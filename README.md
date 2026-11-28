# Nevio website

Static one-page site (index.html). No build step.

Deploy: GitHub Pages, Settings > Pages > Deploy from branch > main / (root).

Pilot form: set FORM_ENDPOINT (and optionally CONTACT_EMAIL) at the top of the script in index.html.

Security: see SECURITY.md. If you edit an inline script in index.html, update the script hashes in its
Content-Security-Policy meta tag (the command is in CLAUDE.md), or the page's scripts will not run.
