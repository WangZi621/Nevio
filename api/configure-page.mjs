// Points the website at the signup API (and optionally Cloudflare Turnstile), keeping the page's
// Content-Security-Policy and script hashes in step. No dependencies. From the repo root:
//
//   node api/configure-page.mjs --api https://nevio-api.<account>.workers.dev [--turnstile <site key>]
//   node api/configure-page.mjs --off            (back to email only)
//
// It edits index.html in place and prints what changed.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const off = args.includes('--off');
const api = off ? '' : opt('--api');
const sitekey = off ? '' : (opt('--turnstile') ?? null);
if (!off && !api) {
  console.error('usage: node api/configure-page.mjs --api https://nevio-api.<account>.workers.dev [--turnstile <site key>] | --off');
  process.exit(1);
}
let origin = '';
if (api) {
  const u = new URL(api);
  if (u.protocol !== 'https:' && u.hostname !== '127.0.0.1' && u.hostname !== 'localhost') throw new Error('the API must be https');
  origin = u.origin;
}
const file = new URL('../index.html', import.meta.url);
let s = readFileSync(file, 'utf8');
const swap = (re, to, what) => { if (!re.test(s)) throw new Error(`could not find ${what}`); s = s.replace(re, to); };

swap(/const SIGNUP_API = "[^"]*";/, `const SIGNUP_API = "${api ? `${origin}/v1/signup` : ''}";`, 'SIGNUP_API');
if (sitekey !== null) {
  if (sitekey && !/^[0-9a-zA-Z_-]{10,64}$/.test(sitekey)) throw new Error('that does not look like a Turnstile site key');
  swap(/const TURNSTILE_SITEKEY = "[^"]*";/, `const TURNSTILE_SITEKEY = "${sitekey}";`, 'TURNSTILE_SITEKEY');
}
const ts = /const TURNSTILE_SITEKEY = "([^"]+)";/.test(s);

// connect-src: FormSubmit (the email backup) plus the API's origin
swap(/connect-src [^;"]*;/, `connect-src https://formsubmit.co${origin ? ` ${origin}` : ''};`, 'connect-src');
// frame-src: Turnstile's frame only when it is on
swap(/frame-src [^;"]*;/, `frame-src ${ts ? 'https://challenges.cloudflare.com' : "'none'"};`, 'frame-src');
// script-src: the hashes of the inline scripts, plus Turnstile's script only when it is on
const hashes = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
swap(/script-src [^;"]*;/, `script-src ${hashes.join(' ')}${ts ? ' https://challenges.cloudflare.com' : ''};`, 'script-src');

writeFileSync(file, s);
console.log(`index.html: SIGNUP_API ${api ? `${origin}/v1/signup` : 'off'}; Turnstile ${ts ? 'on' : 'off'}; ${hashes.length} script hashes updated.`);
