# Security policy

This repository is the public website for Nevio, served by GitHub Pages at
https://wangzi621.github.io/Nevio/, and the small signup API in `api/` (a Cloudflare Worker with a
D1 database) that stores pilot requests. Visitors have no accounts or passwords. The site never
receives patient photos or patient information: the research app that reads photos runs on the
clinic's own device and is a separate project.

## Reporting a problem

Please report security problems privately through GitHub:
https://github.com/WangZi621/Nevio/security/advisories/new

Do not open a public issue for a security problem. `/.well-known/security.txt` points to this
policy.

## What is in scope

- The page itself (`index.html`, `404.html` and the files they load).
- The pilot request form and the signup API (`api/`), which store a visitor's name, role,
  organization, work email, city, optional message and consent choices. If the API can't be
  reached, the form falls back to FormSubmit, a third-party email form service. Problems inside
  Cloudflare, FormSubmit or Resend themselves belong with them.

## How the site is protected

- No third-party fonts, analytics or trackers. Everything loads from this repository. The only
  outside requests are the form's POST to the signup API (or FormSubmit as a backup) and, when it
  is turned on, Cloudflare's Turnstile check, which loads only once someone starts on the form.
- A Content-Security-Policy in each page: scripts run only if their SHA-256 hash matches,
  connections go only to the signup API and FormSubmit, and plugins, workers and `<base>` are
  blocked (frames too, except Turnstile's when it is on).
  `_headers` holds the same policy as real HTTP headers (plus HSTS, `frame-ancestors`,
  `X-Content-Type-Options` and `Permissions-Policy`) for a host that supports them, such as
  Cloudflare Pages; GitHub Pages cannot set custom headers.
- The page refuses to be shown inside another site's frame.
- Form input is only ever written as text, never as HTML. Line breaks and control characters
  are stripped from single-line fields, every field has a length limit, and automated
  submissions (a hidden trap field, or a send within two seconds of the page opening) are
  dropped without sending.
- Without JavaScript the form does not send, so personal details never end up in a URL.
- The signup API accepts only the site's own origins, re-validates every field, rate-limits by a
  keyed hash of the network address, stores with parameterised queries, can require a Cloudflare
  Turnstile check, and deletes requests after two years. The team's admin view sits behind
  Cloudflare Access and the Worker verifies the Access token's signature, audience, issuer and
  expiry itself. Details in `api/README.md`; tests in `api/test/`.
