# Nevio website

Static one-page site (index.html). No build step.

Deploy: GitHub Pages, Settings > Pages > Deploy from branch > main / (root).

Pilot form: requests are stored by the signup API in `api/` (Cloudflare Worker + D1); set it up with
`api/README.md`, then point the page at it with `node api/configure-page.mjs --api <url>`. Until then the
form emails requests through FORM_ENDPOINT (FormSubmit). Privacy notice: `privacy.html`.

Security: see SECURITY.md. If you edit an inline script in index.html, update the script hashes in its
Content-Security-Policy meta tag (the command is in CLAUDE.md), or the page's scripts will not run.
