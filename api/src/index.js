// Nevio signup API: a Cloudflare Worker that stores pilot requests from the website in D1.
//
//   POST /v1/signup          a pilot request from an allowed site origin (JSON)
//   GET  /v1/health          liveness check
//   GET  /admin              the team's view of signups (Cloudflare Access sign-in required)
//   GET  /admin/signups.csv  the same as a CSV download
//
// Everything a visitor sends is validated here again, whatever the page already checked:
// the page is not trusted. No patient information is collected or accepted.

export const ROLES = ['Physician', 'Nurse practitioner', 'Physician assistant', 'Nurse', 'Practice manager', 'Medical director', 'Researcher'];
export const LIMITS = { name: 120, role: 60, organization: 160, email: 160, location: 120, message: 2000 };
export const EMAIL_RE = /^[^@\s]+@[^@\s.]+(\.[^@\s.]+)*\.[^@\s.]{2,}$/;
const MAX_BODY = 16 * 1024;
const ACCESS_DOMAIN_RE = /^[a-z0-9-]+\.cloudflareaccess\.com$/;

const BASE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export default {
  async fetch(request, env, ctx) {
    try {
      return await route(request, env, ctx);
    } catch (err) {
      console.error('unhandled', err && err.message);
      return json({ ok: false, error: 'server' }, 500);
    }
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(purge(env));
  },
};

async function route(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === '/v1/health') return request.method === 'GET' ? json({ ok: true }) : json({ ok: false, error: 'method' }, 405);
  if (url.pathname === '/v1/signup') {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: cors ? 204 : 403, headers: { ...BASE_HEADERS, ...(cors || {}) } });
    if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, cors);
    if (!cors) return json({ ok: false, error: 'origin' }, 403);
    return signup(request, env, ctx, cors);
  }
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return admin(request, env, url);
  return json({ ok: false, error: 'not_found' }, 404);
}

// ---- CORS: only the site's own origins may send signups from a browser ----
export function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
}
function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin || !allowedOrigins(env).includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

// ---- cleaning and validation (mirrors the page, but this is the one that counts) ----
export const cleanLine = v => String(v).replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]+/g, ' ').replace(/\s+/g, ' ').trim();
export const cleanText = v => String(v).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '').trim();

export function validate(body) {
  const bad = [];
  const out = {};
  for (const k of ['name', 'role', 'organization', 'email', 'location', 'message']) {
    const raw = body[k];
    if (raw !== undefined && raw !== null && typeof raw !== 'string') { bad.push(k); continue; }
    const v = k === 'message' ? cleanText(raw ?? '') : cleanLine(raw ?? '');
    if (v.length > LIMITS[k]) { bad.push(k); continue; }
    out[k] = v;
  }
  for (const k of ['name', 'organization', 'location']) if (!out[k] && !bad.includes(k)) bad.push(k);
  if (out.role !== undefined && !ROLES.includes(out.role) && !bad.includes('role')) bad.push('role');
  if (out.email !== undefined && !EMAIL_RE.test(out.email) && !bad.includes('email')) bad.push('email');
  if (body.consent_contact !== true) bad.push('consent_contact');
  if (body.consent_updates !== undefined && typeof body.consent_updates !== 'boolean') bad.push('consent_updates');
  out.consent_updates = body.consent_updates === true;
  return { ok: bad.length === 0, bad, data: out };
}

// ---- POST /v1/signup ----
async function signup(request, env, ctx, cors) {
  const type = request.headers.get('Content-Type') || '';
  if (!type.toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'content_type' }, 415, cors);
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413, cors);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413, cors);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'json' }, 400, cors); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ ok: false, error: 'json' }, 400, cors);

  // the hidden trap field: answer like a success, store nothing
  if (typeof body.nv_trap === 'string' && body.nv_trap !== '') return json({ ok: true }, 201, cors);

  const v = validate(body);
  if (!v.ok) return json({ ok: false, error: 'invalid', fields: v.bad }, 400, cors);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (env.TURNSTILE_SECRET) {
    const passed = await verifyTurnstile(env, body.turnstile, ip);
    if (passed === 'unavailable') return json({ ok: false, error: 'verification_unavailable' }, 503, cors);
    if (!passed) return json({ ok: false, error: 'verification' }, 400, cors);
  }

  // at most RATE_LIMIT_PER_HOUR requests an hour from one network address
  const hour = Math.floor(Date.now() / 3600000);
  const key = await hmacHex(env.IP_SALT || 'nevio-local-dev-salt', `${ip}|${hour}`);
  const row = await env.DB.prepare(
    'INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count'
  ).bind(key, hour).first();
  const limit = Number(env.RATE_LIMIT_PER_HOUR || 5);
  if (row && row.count > limit) return json({ ok: false, error: 'rate_limited' }, 429, { ...cors, 'Retry-After': '3600' });

  // the same email within a day: already have it, don't store twice
  const d = v.data;
  const since = new Date(Date.now() - 86400000).toISOString();
  const dup = await env.DB.prepare('SELECT id FROM signups WHERE email = ?1 AND created_at > ?2 LIMIT 1').bind(d.email, since).first();
  if (dup) return json({ ok: true }, 201, cors);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO signups (id, created_at, name, role, organization, email, location, message, consent_contact, consent_updates, policy_version, source)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1, ?9, ?10, ?11)`
  ).bind(id, createdAt, d.name, d.role, d.organization, d.email, d.location, d.message, d.consent_updates ? 1 : 0, String(env.POLICY_VERSION || ''), request.headers.get('Origin') || '').run();

  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) ctx.waitUntil(notify(env, d, createdAt));
  return json({ ok: true }, 201, cors);
}

async function verifyTurnstile(env, token, ip) {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  let res;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    res = await r.json();
  } catch {
    return 'unavailable';
  }
  if (!res || res.success !== true) return false;
  // the token must have been issued on one of our own sites (test keys report "example.com")
  if (res.hostname && res.hostname !== 'example.com') {
    const hosts = allowedOrigins(env).map(o => { try { return new URL(o).hostname; } catch { return ''; } });
    if (!hosts.includes(res.hostname)) return false;
  }
  return true;
}

async function notify(env, d, createdAt) {
  const text = [
    'New Nevio pilot request', '',
    `Name: ${d.name}`, `Role: ${d.role}`, `Clinic or organization: ${d.organization}`,
    `Email: ${d.email}`, `City and state: ${d.location}`, `Updates: ${d.consent_updates ? 'yes' : 'no'}`,
    `Received: ${createdAt}`, '', d.message || '(no message)',
  ].join('\n');
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || 'Nevio signups <onboarding@resend.dev>',
        to: [env.NOTIFY_EMAIL],
        reply_to: d.email,
        subject: `Nevio pilot request: ${d.organization}`.slice(0, 200),
        text,
      }),
    });
    if (!r.ok) console.error('notify failed', r.status);
  } catch (err) {
    console.error('notify error', err && err.message);
  }
}

// ---- the team's view: Cloudflare Access signs people in, and the Worker checks the token itself ----
async function admin(request, env, url) {
  const headers = { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'", 'X-Robots-Tag': 'noindex' };
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !ACCESS_DOMAIN_RE.test(env.ACCESS_TEAM_DOMAIN)) return json({ ok: false, error: 'not_found' }, 404);
  if (request.method !== 'GET') return json({ ok: false, error: 'method' }, 405);
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return json({ ok: false, error: 'sign_in_required' }, 401);
  let who;
  try { who = await verifyAccessJwt(token, env); } catch { who = null; }
  if (!who) return json({ ok: false, error: 'forbidden' }, 403);

  const { results } = await env.DB.prepare(
    'SELECT created_at, name, role, organization, email, location, message, consent_updates, status FROM signups ORDER BY created_at DESC LIMIT 1000'
  ).all();
  if (url.pathname === '/admin/signups.csv') {
    return new Response(toCsv(results), {
      headers: { ...BASE_HEADERS, ...headers, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="nevio-signups.csv"' },
    });
  }
  if (url.pathname !== '/admin' && url.pathname !== '/admin/') return json({ ok: false, error: 'not_found' }, 404);
  return new Response(adminPage(results, who.email), { headers: { ...BASE_HEADERS, ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
}

const jwks = { at: 0, keys: null };
export async function verifyAccessJwt(token, env, fetchImpl = fetch) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const header = JSON.parse(b64urlText(parts[0]));
  const payload = JSON.parse(b64urlText(parts[1]));
  if (header.alg !== 'RS256' || !header.kid) return null;
  if (!jwks.keys || Date.now() - jwks.at > 3600000) {
    const r = await fetchImpl(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
    if (!r.ok) return null;
    jwks.keys = (await r.json()).keys || [];
    jwks.at = Date.now();
  }
  const jwk = jwks.keys.find(k => k.kid === header.kid && k.kty === 'RSA');
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const good = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!good) return null;
  const now = Math.floor(Date.now() / 1000);
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) return null;
  if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
  if (typeof payload.exp !== 'number' || payload.exp < now) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null;
  return payload;
}
export function resetJwksCache() { jwks.at = 0; jwks.keys = null; }

export function toCsv(rows) {
  const cols = ['created_at', 'name', 'role', 'organization', 'email', 'location', 'message', 'consent_updates', 'status'];
  // a cell that starts like a formula is prefixed so spreadsheets show it as text
  const cell = v => {
    let s = v === null || v === undefined ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\r\n') + '\r\n';
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function adminPage(rows, who) {
  const body = rows.map(r => `<tr><td>${esc(r.created_at.slice(0, 16).replace('T', ' '))}</td><td>${esc(r.name)}</td><td>${esc(r.role)}</td><td>${esc(r.organization)}</td><td>${esc(r.email)}</td><td>${esc(r.location)}</td><td>${esc(r.message)}</td><td>${r.consent_updates ? 'yes' : 'no'}</td><td>${esc(r.status)}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nevio signups</title>
<style>body{margin:0;padding:32px;background:#05080A;color:#EAF0EE;font:15px/1.5 system-ui,sans-serif}h1{font-weight:500;font-size:28px;margin:0 0 4px}p{color:#A5B2B0;margin:0 0 24px}a{color:#D7F25A}
table{border-collapse:collapse;width:100%}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid rgba(226,240,236,.12)}th{color:#A5B2B0;font-weight:500}td:nth-child(7){max-width:32em;white-space:pre-wrap}</style></head>
<body><h1>Pilot requests</h1><p>${rows.length} shown, newest first. Signed in as ${esc(who || 'team')}. <a href="/admin/signups.csv">Download CSV</a></p>
<table><thead><tr><th>Received (UTC)</th><th>Name</th><th>Role</th><th>Organization</th><th>Email</th><th>City and state</th><th>Message</th><th>Updates</th><th>Status</th></tr></thead><tbody>${body}</tbody></table></body></html>`;
}

// ---- nightly: delete signups past the retention period and old rate-limit rows ----
export async function purge(env) {
  const days = Math.max(30, Number(env.RETENTION_DAYS || 730));
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  await env.DB.prepare('DELETE FROM signups WHERE created_at < ?1').bind(cutoff).run();
  await env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?1').bind(Math.floor(Date.now() / 3600000) - 24).run();
}

// ---- helpers ----
function json(obj, status = 200, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...BASE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'", ...(extra || {}) },
  });
}
async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function b64urlBytes(s) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, c => c.charCodeAt(0));
}
function b64urlText(s) { return new TextDecoder().decode(b64urlBytes(s)); }
