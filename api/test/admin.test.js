// The team's admin view with Cloudflare Access configured: sign-in enforced, output escaped.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { resetJwksCache } from '../src/index.js';

const b64url = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const rows = [{ created_at: '2026-11-28T04:00:00.000Z', name: '<script>alert(1)</script>', role: 'Nurse', organization: '=cmd()', email: 'a@clinic.org', location: 'PA', message: 'hi "there"', consent_updates: 1, status: 'new' }];
const DB = { prepare: () => ({ bind() { return this; }, all: async () => ({ results: rows }) }) };
const env = { DB, ACCESS_TEAM_DOMAIN: 'nevio.cloudflareaccess.com', ACCESS_AUD: 'aud-123' };

test('admin view: sign-in required, forged tokens refused, output escaped', async () => {
  const k = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...(await crypto.subtle.exportKey('jwk', k.publicKey)), kid: 'k1' };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ keys: [jwk] }));
  resetJwksCache();
  try {
    const now = Math.floor(Date.now() / 1000);
    const h = b64url(JSON.stringify({ alg: 'RS256', kid: 'k1' }));
    const p = b64url(JSON.stringify({ aud: ['aud-123'], iss: 'https://nevio.cloudflareaccess.com', exp: now + 300, email: 'jason@example.org' }));
    const sig = b64url(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', k.privateKey, new TextEncoder().encode(`${h}.${p}`))));
    const token = `${h}.${p}.${sig}`;
    const call = (path, headers = {}, method = 'GET') => worker.fetch(new Request(`https://api.example${path}`, { method, headers }), env, { waitUntil() {} });

    assert.equal((await call('/admin')).status, 401, 'no token');
    assert.equal((await call('/admin', { 'Cf-Access-Jwt-Assertion': `${h}.${p}.AAAA` })).status, 403, 'bad signature');
    assert.equal((await call('/admin', { 'Cf-Access-Jwt-Assertion': token }, 'POST')).status, 405, 'read only');

    const page = await call('/admin', { 'Cf-Access-Jwt-Assertion': token });
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /default-src 'none'/);
    assert.equal(page.headers.get('x-robots-tag'), 'noindex');
    const html = await page.text();
    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;') && !html.includes('<script>alert'), 'names are escaped');
    assert.ok(html.includes('Signed in as jason@example.org'));

    const csv = await call('/admin/signups.csv', { 'Cf-Access-Jwt-Assertion': token });
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get('content-disposition'), /attachment/);
    const text = await csv.text();
    assert.ok(text.includes(`"'=cmd()"`), 'formula neutralised');

    const off = await worker.fetch(new Request('https://api.example/admin', { headers: { 'Cf-Access-Jwt-Assertion': token } }), { DB, ACCESS_TEAM_DOMAIN: 'evil.example.com', ACCESS_AUD: 'aud-123' }, {});
    assert.equal(off.status, 404, 'a team domain that is not cloudflareaccess.com is ignored');
  } finally {
    globalThis.fetch = realFetch;
  }
});
