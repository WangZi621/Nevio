// Turnstile on the signup route: only a token Cloudflare accepts, issued on our own site, gets through.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

function fakeDb() {
  const rows = [];
  return {
    rows,
    prepare(q) {
      let args = [];
      return {
        bind(...a) { args = a; return this; },
        async first() { return q.startsWith('INSERT INTO rate_limits') ? { count: 1 } : null; },
        async run() { if (q.includes('INSERT INTO signups')) rows.push(args); return {}; },
      };
    },
  };
}
const body = { name: 'Dana Lee', role: 'Nurse', organization: 'Acme', email: 'dana@clinic.org', location: 'PA', consent_contact: true, turnstile: 'tok' };
const req = b => new Request('https://api.example/v1/signup', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://wangzi621.github.io', 'CF-Connecting-IP': '203.0.113.9' }, body: JSON.stringify(b) });

test('Turnstile decides whether a signup is stored', async () => {
  const realFetch = globalThis.fetch;
  const seen = [];
  let answer;
  globalThis.fetch = async (url, init) => {
    seen.push([url, Object.fromEntries(init.body.entries())]);
    if (answer === 'throw') throw new Error('network');
    return new Response(JSON.stringify(answer));
  };
  try {
    const env = () => ({ DB: fakeDb(), ALLOWED_ORIGINS: 'https://wangzi621.github.io', TURNSTILE_SECRET: 'secret-x', IP_SALT: 's', POLICY_VERSION: 'v1' });

    answer = { success: true, hostname: 'wangzi621.github.io' };
    let e = env();
    assert.equal((await worker.fetch(req(body), e, { waitUntil() {} })).status, 201);
    assert.equal(e.DB.rows.length, 1);
    assert.equal(seen.at(-1)[0], 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.deepEqual(seen.at(-1)[1], { secret: 'secret-x', response: 'tok', remoteip: '203.0.113.9' });

    answer = { success: false, 'error-codes': ['invalid-input-response'] };
    e = env();
    let r = await worker.fetch(req(body), e, { waitUntil() {} });
    assert.equal(r.status, 400);
    assert.equal((await r.json()).error, 'verification');
    assert.equal(e.DB.rows.length, 0);

    answer = { success: true, hostname: 'evil.example' };
    e = env();
    assert.equal((await worker.fetch(req(body), e, { waitUntil() {} })).status, 400, 'token from another site');

    e = env();
    const calls = seen.length;
    assert.equal((await worker.fetch(req({ ...body, turnstile: undefined }), e, { waitUntil() {} })).status, 400, 'no token');
    assert.equal(seen.length, calls, 'no token: Cloudflare not even asked');

    answer = 'throw';
    e = env();
    r = await worker.fetch(req(body), e, { waitUntil() {} });
    assert.equal(r.status, 503, 'check unavailable: the page falls back');
    assert.equal(e.DB.rows.length, 0);
  } finally {
    globalThis.fetch = realFetch;
  }
});
