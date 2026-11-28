// Integration tests against a running Worker with a local D1 database:
//   npx wrangler d1 migrations apply nevio-signups --local
//   npx wrangler dev --local --port 8787 --test-scheduled      (with .dev.vars, see README)
//   API_URL=http://127.0.0.1:8787 npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const API = process.env.API_URL;
const ORIGIN = 'http://127.0.0.1:8124';
const run = Date.now().toString(36);
const skip = API ? false : 'set API_URL to run integration tests';

function sql(q) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'nevio-signups', '--local', '--json', '--command', q], { cwd: new URL('..', import.meta.url).pathname, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' } }).toString();
  return JSON.parse(out)[0].results;
}
const post = (body, { origin = ORIGIN, type = 'application/json', raw } = {}) => fetch(`${API}/v1/signup`, {
  method: 'POST', headers: { 'Content-Type': type, ...(origin ? { Origin: origin } : {}) }, body: raw ?? JSON.stringify(body),
});
const good = over => ({ name: 'Dana Lee', role: 'Physician', organization: 'Acme Clinic', email: `dana+${run}-${Math.random().toString(36).slice(2, 8)}@clinic.org`, location: 'Philadelphia, PA', message: 'Hello', consent_contact: true, consent_updates: false, ...over });

test('health and security headers', { skip }, async () => {
  const r = await fetch(`${API}/v1/health`);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.match(r.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});

test('CORS: only the site may send signups from a browser', { skip }, async () => {
  const pre = await fetch(`${API}/v1/signup`, { method: 'OPTIONS', headers: { Origin: ORIGIN, 'Access-Control-Request-Method': 'POST' } });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('access-control-allow-origin'), ORIGIN);
  const evilPre = await fetch(`${API}/v1/signup`, { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } });
  assert.equal(evilPre.status, 403);
  assert.equal(evilPre.headers.get('access-control-allow-origin'), null);
  assert.equal((await post(good(), { origin: 'https://evil.example' })).status, 403);
  assert.equal((await post(good(), { origin: null })).status, 403);
});

test('malformed requests are refused', { skip }, async () => {
  assert.equal((await post(good(), { type: 'text/plain' })).status, 415);
  assert.equal((await post(null, { raw: '{not json' })).status, 400);
  assert.equal((await post(null, { raw: '[1,2]' })).status, 400);
  assert.equal((await post(good({ message: 'x'.repeat(20000) }))).status, 413);
  assert.equal((await fetch(`${API}/v1/signup`, { method: 'GET', headers: { Origin: ORIGIN } })).status, 405);
  const r = await post(good({ role: 'Hacker', email: 'a@b', consent_contact: false }));
  assert.equal(r.status, 400);
  const body = await r.json();
  assert.deepEqual(body.fields.sort(), ['consent_contact', 'email', 'role']);
});

test('a valid request is stored once, cleaned, and injection is just text', { skip }, async () => {
  const d = good({ name: "Robert'); DROP TABLE signups;--", organization: 'Acme\u0007 Clinic', message: '<script>alert(1)</script>\r\nline two', consent_updates: true });
  const r = await post(d);
  assert.equal(r.status, 201);
  assert.deepEqual(await r.json(), { ok: true });
  assert.equal((await post(d)).status, 201, 'a repeat within a day still says ok');
  const rows = sql(`SELECT name, organization, message, consent_contact, consent_updates, policy_version, source, status FROM signups WHERE email = '${d.email}'`);
  assert.equal(rows.length, 1, 'stored once');
  assert.equal(rows[0].name, "Robert'); DROP TABLE signups;--");
  assert.equal(rows[0].organization, 'Acme Clinic');
  assert.equal(rows[0].message, '<script>alert(1)</script>\nline two');
  assert.equal(rows[0].consent_contact, 1);
  assert.equal(rows[0].consent_updates, 1);
  assert.equal(rows[0].policy_version, '2026-11-28');
  assert.equal(rows[0].source, ORIGIN);
  assert.equal(rows[0].status, 'new');
  assert.ok(sql("SELECT count(*) AS n FROM sqlite_master WHERE name = 'signups'")[0].n === 1, 'table still there');
});

test('the trap field gets a success answer and nothing is stored', { skip }, async () => {
  const d = good({ nv_trap: 'http://spam.example' });
  const r = await post(d);
  assert.equal(r.status, 201);
  assert.equal(sql(`SELECT count(*) AS n FROM signups WHERE email = '${d.email}'`)[0].n, 0);
});

test('the admin view is off until Cloudflare Access is configured', { skip }, async () => {
  assert.equal((await fetch(`${API}/admin`)).status, 404);
  assert.equal((await fetch(`${API}/admin/signups.csv`, { headers: { 'Cf-Access-Jwt-Assertion': 'forged.token.here' } })).status, 404);
  assert.equal((await fetch(`${API}/anything-else`)).status, 404);
});

test('the nightly purge removes signups past retention and old rate-limit rows', { skip }, async () => {
  sql("INSERT INTO signups (id, created_at, name, role, organization, email, location, consent_contact, policy_version) VALUES ('old-row', '2020-01-01T00:00:00.000Z', 'Old', 'Nurse', 'Old Clinic', 'old@clinic.org', 'Nowhere', 1, 'v0')");
  sql("INSERT INTO rate_limits (key, window_start, count) VALUES ('old-key', 1, 1)");
  const r = await fetch(`${API}/__scheduled?cron=17+4+*+*+*`);
  assert.equal(r.status, 200);
  await new Promise(res => setTimeout(res, 500));
  assert.equal(sql("SELECT count(*) AS n FROM signups WHERE id = 'old-row'")[0].n, 0);
  assert.equal(sql("SELECT count(*) AS n FROM rate_limits WHERE key = 'old-key'")[0].n, 0);
  assert.ok(sql('SELECT count(*) AS n FROM signups')[0].n >= 1, 'recent signups kept');
});

test('one network address is limited per hour (runs last)', { skip }, async () => {
  let limited = null;
  for (let i = 0; i < 60 && !limited; i++) {
    const r = await post(good());
    if (r.status === 429) limited = r;
    else assert.equal(r.status, 201);
  }
  assert.ok(limited, 'got a 429');
  assert.equal(limited.headers.get('retry-after'), '3600');
});
