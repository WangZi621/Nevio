// Unit tests for the pure parts of the Worker. Run: npm test (from api/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, cleanLine, cleanText, toCsv, verifyAccessJwt, resetJwksCache } from '../src/index.js';

const good = { name: 'Dana Lee', role: 'Physician', organization: 'Acme Clinic', email: 'dana@clinic.org', location: 'Philadelphia, PA', message: 'Hi', consent_contact: true };

test('a complete request passes', () => {
  const v = validate(good);
  assert.equal(v.ok, true);
  assert.equal(v.data.consent_updates, false);
});

test('each required field and rule is enforced', () => {
  const cases = [
    [{ name: '' }, 'name'], [{ organization: '   ' }, 'organization'], [{ location: '' }, 'location'],
    [{ role: 'Hacker' }, 'role'], [{ email: 'a@b' }, 'email'], [{ email: 'a@b.c' }, 'email'], [{ email: 'no-at.org' }, 'email'],
    [{ name: 'x'.repeat(121) }, 'name'], [{ message: 'x'.repeat(2001) }, 'message'],
    [{ name: 42 }, 'name'], [{ email: ['dana@clinic.org'] }, 'email'],
    [{ consent_contact: false }, 'consent_contact'], [{ consent_contact: 'true' }, 'consent_contact'], [{ consent_contact: undefined }, 'consent_contact'],
    [{ consent_updates: 'yes' }, 'consent_updates'],
  ];
  for (const [patch, field] of cases) {
    const v = validate({ ...good, ...patch });
    assert.equal(v.ok, false, JSON.stringify(patch));
    assert.ok(v.bad.includes(field), `${JSON.stringify(patch)} -> ${v.bad}`);
  }
});

test('control characters and line breaks are removed from one-line fields', () => {
  assert.equal(cleanLine('Acme\r\nBcc: x@y.z\u0007 end'), 'Acme Bcc: x@y.z end');
  assert.equal(cleanText('a\r\nb\u0000c'), 'a\nbc');
  const v = validate({ ...good, organization: 'Acme\nClinic' });
  assert.equal(v.data.organization, 'Acme Clinic');
});

test('CSV export neutralises spreadsheet formulas and quotes', () => {
  const csv = toCsv([{ created_at: '2026-11-28T00:00:00Z', name: '=HYPERLINK("http://evil")', role: 'Nurse', organization: '+1', email: '@x', location: '-2', message: 'say "hi"', consent_updates: 1, status: 'new' }]);
  const line = csv.split('\r\n')[1];
  assert.ok(line.includes(`"'=HYPERLINK(""http://evil"")"`), line);
  assert.ok(line.includes(`"'+1"`) && line.includes(`"'@x"`) && line.includes(`"'-2"`));
  assert.ok(line.includes('"say ""hi"""'));
});

// ---- Cloudflare Access tokens ----
const env = { ACCESS_TEAM_DOMAIN: 'nevio.cloudflareaccess.com', ACCESS_AUD: 'aud-123' };
const b64url = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function keypair() {
  const k = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = await crypto.subtle.exportKey('jwk', k.publicKey);
  return { priv: k.privateKey, jwk: { ...jwk, kid: 'k1' } };
}
async function sign(priv, header, payload) {
  const h = b64url(JSON.stringify(header)), p = b64url(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', priv, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${b64url(new Uint8Array(sig))}`;
}
const now = () => Math.floor(Date.now() / 1000);
const claims = over => ({ aud: ['aud-123'], iss: 'https://nevio.cloudflareaccess.com', exp: now() + 300, iat: now(), email: 'jason@example.org', ...over });

test('Access tokens: only a valid, signed, unexpired token for our app is accepted', async () => {
  const { priv, jwk } = await keypair();
  const other = await keypair();
  let calls = 0;
  const fetchImpl = async url => { calls++; assert.equal(url, 'https://nevio.cloudflareaccess.com/cdn-cgi/access/certs'); return new Response(JSON.stringify({ keys: [jwk] })); };
  resetJwksCache();
  const hdr = { alg: 'RS256', kid: 'k1', typ: 'JWT' };
  assert.equal((await verifyAccessJwt(await sign(priv, hdr, claims()), env, fetchImpl)).email, 'jason@example.org');
  assert.equal(await verifyAccessJwt(await sign(priv, hdr, claims({ aud: ['someone-else'] })), env, fetchImpl), null, 'wrong audience');
  assert.equal(await verifyAccessJwt(await sign(priv, hdr, claims({ iss: 'https://evil.cloudflareaccess.com' })), env, fetchImpl), null, 'wrong issuer');
  assert.equal(await verifyAccessJwt(await sign(priv, hdr, claims({ exp: now() - 10 })), env, fetchImpl), null, 'expired');
  assert.equal(await verifyAccessJwt(await sign(other.priv, hdr, claims()), env, fetchImpl), null, 'signed by another key');
  assert.equal(await verifyAccessJwt(await sign(priv, { ...hdr, kid: 'nope' }, claims()), env, fetchImpl), null, 'unknown key id');
  const t = await sign(priv, hdr, claims());
  const [h, , s] = t.split('.');
  assert.equal(await verifyAccessJwt(`${h}.${b64url(JSON.stringify(claims({ email: 'attacker@x.io' })))}.${s}`, env, fetchImpl), null, 'tampered claims');
  assert.equal(await verifyAccessJwt(`${b64url(JSON.stringify({ alg: 'none', kid: 'k1' }))}.${b64url(JSON.stringify(claims()))}.`, env, fetchImpl), null, 'alg none');
  assert.equal(await verifyAccessJwt('not-a-token', env, fetchImpl), null);
  assert.equal(calls, 1, 'signing keys are cached');
});
