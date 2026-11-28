# Nevio signup API

Pilot requests from the website are stored here: a Cloudflare Worker (`src/index.js`) with a
Cloudflare D1 database (`migrations/`). The website itself stays a static page on GitHub Pages; only
the form talks to this API.

```
browser ──POST /v1/signup──▶ Worker ──▶ D1 database (signups)
   │                          ├─▶ Turnstile check (optional, bot protection)
   │                          └─▶ Resend email to the team (optional)
   └─ if the API can't be reached: FormSubmit email, then a copy-and-send box
team ──Cloudflare Access sign-in──▶ /admin (table) and /admin/signups.csv
```

What the Worker enforces, whatever the page does:

- Only the site's own origins (`ALLOWED_ORIGINS`) may send, as JSON, under 16 KB.
- Every field is checked again: required fields, the role list, a real-looking email, length caps,
  consent ticked. Control characters and line breaks are stripped from one-line fields.
- At most `RATE_LIMIT_PER_HOUR` requests an hour from one network address, counted with a keyed
  hash of the address (never the address itself), deleted after a day.
- The same email within a day is stored once. The hidden trap field gets a fake success.
- With `TURNSTILE_SECRET` set, only a token Cloudflare accepts, issued on our own site, gets through.
- Queries are parameterised; the admin view escapes everything and the CSV export neutralises
  spreadsheet formulas.
- Signups older than `RETENTION_DAYS` (two years) are deleted every night (`privacy.html` says so).
- No patient information is collected or accepted. Cloudflare signs HIPAA business associate
  agreements only on enterprise plans, so keep it that way.

## One-time setup (about 20 minutes)

You need a free Cloudflare account. Run these from `api/`:

```bash
npm install
```

```bash
npx wrangler login
```

```bash
npx wrangler d1 create nevio-signups
```

Copy the `database_id` it prints into `wrangler.jsonc`, then create the tables and set the one
required secret (paste a long random string when asked, for example the output of
`openssl rand -hex 32`):

```bash
npx wrangler d1 migrations apply nevio-signups --remote
```

```bash
npx wrangler secret put IP_SALT
```

```bash
npx wrangler deploy
```

`deploy` prints the API's address, like `https://nevio-api.<account>.workers.dev`. Point the website
at it (this also updates the page's Content-Security-Policy and script hashes), then commit and push:

```bash
node api/configure-page.mjs --api https://nevio-api.<account>.workers.dev
```

### Email the team when a request arrives (recommended)

Create a free account at resend.com and an API key, then:

```bash
npx wrangler secret put RESEND_API_KEY
```

```bash
npx wrangler secret put NOTIFY_EMAIL
```

Without your own domain, Resend only delivers to the address you signed up with, which is all this
needs. Once Nevio has a domain, verify it in Resend and set `NOTIFY_FROM` to an address on it.

Once emails arrive, the FormSubmit backup can go: set `FORM_ENDPOINT` to `""` in `index.html` (that
also takes the personal address out of the page source).

### Bot protection with Turnstile (recommended)

In the Cloudflare dashboard, Turnstile, add a widget for `wangzi621.github.io` (managed mode). Then:

```bash
npx wrangler secret put TURNSTILE_SECRET
```

```bash
node api/configure-page.mjs --api https://nevio-api.<account>.workers.dev --turnstile <site key>
```

### The team's sign-in and admin view

In the dashboard, Workers, `nevio-api`, Settings, Domains & Routes, turn on Cloudflare Access for the
`workers.dev` address and allow the team's emails. Access shows a sign-in page (a one-time code by
email) before anything under the Worker is reached. Then copy two values from the Access
application into `wrangler.jsonc` and deploy again:

- `ACCESS_TEAM_DOMAIN`: your team domain, like `nevio.cloudflareaccess.com`
- `ACCESS_AUD`: the application's Audience (AUD) tag

The Worker also checks the Access token itself, so `/admin` stays closed even if Access is
misconfigured. Then open `https://nevio-api.<account>.workers.dev/admin`, or download
`/admin/signups.csv`.

Note: Access in front of the whole `workers.dev` address would also put a sign-in in front of
`/v1/signup`. Protect only the `/admin` path (an Access application with path `/admin`), or put the
API on a custom domain later.

## Day to day

See the newest requests without the admin view:

```bash
npx wrangler d1 execute nevio-signups --remote --command "SELECT created_at, name, organization, email, status FROM signups ORDER BY created_at DESC LIMIT 20"
```

Mark one as contacted:

```bash
npx wrangler d1 execute nevio-signups --remote --command "UPDATE signups SET status = 'contacted' WHERE email = 'name@clinic.org'"
```

Someone asks to be deleted (the privacy notice promises this):

```bash
npx wrangler d1 execute nevio-signups --remote --command "DELETE FROM signups WHERE email = 'name@clinic.org'"
```

D1 keeps 7 days of Time Travel history on the free plan, so a mistake can be rolled back.

## Develop and test locally

Create `api/.dev.vars` (never committed):

```
ALLOWED_ORIGINS="http://127.0.0.1:8124"
IP_SALT="local-test-salt"
RATE_LIMIT_PER_HOUR="40"
```

```bash
npx wrangler d1 migrations apply nevio-signups --local
```

```bash
npx wrangler dev --local --port 8787 --test-scheduled
```

In another terminal, the unit tests and the integration tests against the local Worker and database:

```bash
API_URL=http://127.0.0.1:8787 npm test
```
