# Security policy

This repository is the public website for Nevio, served by GitHub Pages at
https://wangzi621.github.io/Nevio/. It is one static page with no accounts, no passwords,
no database and no server code of its own. It never receives patient photos or patient
information: the research app that reads photos runs on the clinic's own device and is a
separate project.

## Reporting a problem

Please report security problems privately through GitHub:
https://github.com/WangZi621/Nevio/security/advisories/new

Do not open a public issue for a security problem. `/.well-known/security.txt` points to this
policy.

## What is in scope

- The page itself (`index.html`, `404.html` and the files they load).
- The pilot request form, which sends a visitor's name, role, organization, work email,
  city and an optional message to the team's inbox through FormSubmit, a third-party form
  service. Problems inside FormSubmit itself belong with FormSubmit.

## How the site is protected

- No third-party scripts, fonts, analytics or trackers. Everything loads from this repository,
  and the only outside request is the form's POST to FormSubmit.
- A Content-Security-Policy in each page: scripts run only if their SHA-256 hash matches,
  connections go only to FormSubmit, and plugins, frames, workers and `<base>` are blocked.
  `_headers` holds the same policy as real HTTP headers (plus HSTS, `frame-ancestors`,
  `X-Content-Type-Options` and `Permissions-Policy`) for a host that supports them, such as
  Cloudflare Pages; GitHub Pages cannot set custom headers.
- The page refuses to be shown inside another site's frame.
- Form input is only ever written as text, never as HTML. Line breaks and control characters
  are stripped from single-line fields, every field has a length limit, and automated
  submissions (a hidden trap field, or a send within two seconds of the page opening) are
  dropped without sending.
- Without JavaScript the form does not send, so personal details never end up in a URL.
