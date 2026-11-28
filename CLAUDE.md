# Nevio website: notes for Claude Code and other agents

This repo is the public marketing site for Nevio, served by GitHub Pages from `main` at the repo root:
https://wangzi621.github.io/Nevio/

The full project context (business plan, model details, team, open questions and the design brief) is in a private Google Doc, "NEVIO_CONTEXT (read this first)", in Jason's Drive folder "Nevio project hub". Ask Jason for it. This file keeps only what is safe in a public repo.

## What Nevio is

An AI skin-lesion triage tool for primary care clinics. A clinician takes a dermatoscope photo of a skin spot and enters up to 17 patient details. Nevio returns three scores (melanoma, other skin cancer, benign) and one triage suggestion: Refer urgently, Refer for review, or Routine follow-up. It runs on the clinic's own device, so photos never leave the room. It is research-stage, not FDA-cleared, and it does not diagnose.

Who the site is for, in order: competition judges (Conrad and Diamond Challenge, December 2026), primary care clinic leads considering a free research pilot, and dermatologists checking whether the science is honest. The page has one job: get a clinic to request a free research pilot after believing the result is real.

## Stack

- One static `index.html` (HTML, CSS and vanilla JS inline). No build step, no framework, no package manager.
- Images in `img/`. `og.jpg` is the 1200 x 630 share image (a render of the hero; retake it if the hero changes). `mark.svg` is the logo mark and favicon.
- `img/app-*.webp` are real screenshots of the research app (github.com/WangZi621/SkinCancer-AI, `docs/`), run locally at 390 px wide on sample ISIC_5700648 and cropped so the app's current Stryde name never shows. Retake them the same way if the app changes or is renamed.
- `.nojekyll` so Pages serves files as they are (including `.well-known/`).
- `404.html` is the not-found page (absolute `/Nevio/` paths, no script). `SECURITY.md` and `.well-known/security.txt` say how to report a security problem; renew the security.txt `Expires` date before it passes (it is set to Nov 28, 2027). `_headers` holds real security headers for a host that reads it (Cloudflare Pages, Netlify); GitHub Pages ignores it.
- `img/specimens/*.webp` are 480 px crops of the app's eight biopsy-confirmed ISIC samples (CC BY: MSK and Dr. Cristian Navarrete et al.; credits in the footer).
- One typeface, Host Grotesk (variable, SIL OFL), self-hosted in `assets/fonts/` (latin and latin-ext subsets). No Google Fonts request.
- `privacy.html` is the privacy notice the form's consent box links to (static, no script). It must describe exactly what the form and `api/` do.
- `api/` is the signup backend: a Cloudflare Worker with a D1 database, its tests, and a setup guide (`api/README.md`). It is the only part with a package manager (`api/package.json`, wrangler); the site itself stays dependency-free. Never commit `api/.dev.vars`, `api/node_modules` or `api/.wrangler`.
- `PRODUCT.md` holds product truth for design work; `.impeccable/surfaces/index-html.md` holds the page's direction contract. Read both before redesigning.

Keep it static and dependency-free unless Jason asks otherwise. It has to load fast on a clinic computer and a phone.

## Facts you may use, with these exact labels

All results come from one held-out split of 9,080 biopsy-confirmed ISIC images (36,320 used for training). It is not a clinical study.

- Melanoma AUC 0.940.
- Three-class AUC 93.2%. This is an AUC. Never call it accuracy.
- Three-class accuracy 78.6%.
- Melanoma sensitivity 90.0% and specificity 81.5% at a 27.8% cutoff.
- Model: EfficientNet-B4 image branch plus a 17-feature patient branch, about 21 MB, runs in the browser with ONNX Runtime Web, offline after the first load.
- Classes: melanoma; other skin cancer (basal and squamous cell carcinoma); benign. Use those names.
- The case on the page is ISIC_5700648, a biopsy-confirmed melanoma from the ISIC Archive (MSK, CC BY). With patient details: 82% melanoma, 17% benign, 2% other skin cancer, Refer urgently. Photo only: 6% melanoma, 18% benign, 75% other skin cancer, Refer for review. Keep the CC BY credit in the footer.
- The case scene adds details one at a time. These are real outputs of the research model (run locally on the app's `docs/` code, Nov 2026): photo only 6/18/75 Refer for review; plus looks like a mole 74/24/2 Refer urgently; plus age 65, female 72/27/2 Refer urgently; plus head or neck 82/17/2 Refer urgently. Order matters: adding age, sex and site before the mole answer gives 7% melanoma and Routine follow-up at that step. Don't present any step that wasn't actually run, and rerun all steps if the model changes.
- More real outputs, run locally on the app's `docs/` code on Nov 27, 2026, and shown in the page's interactive sections (rerun them if the model changes):
  - Each of the eight specimens, photo only and with the patient details recorded in the app's `samples/samples.json` (ISIC Archive). Every suggestion matches its biopsy group: the melanoma refers urgently with details (photo only: refer for review), the three basal cell carcinomas refer for review, the four seborrheic keratoses get routine follow-up. Exact scores are in `SPECIMENS` in the page script.
  - The case (looks like a mole, 65, female) at each body site, melanoma score: palm or sole 87%, head or neck 82%, arm 74%, not given 72%, leg 71%, mouth or genitals 68%, chest or abdomen 57%, side of torso 57%, back 56%. All refer urgently. In `SITE_RUNS`.
  - Feature maps from seven layers of the image branch for the case photo (four strongest channels per layer, grayscale strips in `img/model/`, dims in `LAYERS`).
- The evidence grids are natural frequencies of the approved numbers: 180 of 200 melanomas flagged (90.0%), 163 of 200 other spots left unflagged (81.5%). Each grid stands for 200 images in those proportions, not 200 actual images.
- Recognition: first place in Computer Science at the 2026 Delaware Valley Science Fair; paper accepted to IEEE HealthCom 2026.
- Team roles: Jason (CEO and CTO), Daisy (CMO), Kenny (COO), James (CFO). First names only unless Jason says otherwise.

## Never put on the site

- Pricing, revenue, funding needs or FDA cost plans.
- Anything about the patent or its claims.
- "Backed by" or "funded by" any company unless Jason confirms the wording.
- A head-to-head claim against another product (for example DermaSensor). If a comparison is ever shown, say the test sets differ.
- "Diagnoses", "detects cancer", "93% accurate" or "FDA approved". Say triage, scores, suggests.
- A personal email address in visible page text.

## Pilot form

Signups are stored in a database. The page sends each request to `SIGNUP_API` first (the Worker in `api/`, which validates it again and stores it in Cloudflare D1); if that can't be reached it falls back to `FORM_ENDPOINT` (FormSubmit, email), then to the copyable message. Both settings sit near the top of the page script. Set or clear the API, and Turnstile, only with `node api/configure-page.mjs` (it keeps the CSP's `connect-src`, `frame-src` and script hashes in step). FormSubmit needs a one-time activation from the receiving inbox; after that the endpoint should use FormSubmit's random alias instead of an address, or be emptied once the API emails the team. Don't change the endpoint without Jason's say-so.

The form asks for consent: a required box (keep these details and email me about the pilot, linking `privacy.html`) and an optional box for updates. Both are stored with the request, with the privacy notice version (`POLICY_VERSION` in `api/wrangler.jsonc`). If `privacy.html` changes, change its version line and `POLICY_VERSION` together. Retention in the notice (two years) is enforced by the Worker's nightly purge (`RETENTION_DAYS`).

No patient information, ever: the form says so, the API has no field for it, and Cloudflare offers HIPAA business associate agreements only on enterprise plans. Don't add fields that invite health details.

Form guards to keep: input reaches the page only as text (`textContent`, `.value`, text nodes), never through `innerHTML`; `collect()` strips line breaks and control characters from one-line fields and caps every field; a hidden trap field (`nv_trap`) or a send within 2 seconds of the page opening shows a fake success and sends nothing; the form is `method="post"` and its button hides without JavaScript, so details never land in a URL.

## Security

Visitors have no accounts or passwords, and there is no patient data. The attack surface is the page's own scripts, the pilot form and the signup API in `api/`. The team signs in to see signups through Cloudflare Access (one-time codes by email), and the Worker verifies the Access token itself (`api/README.md`).

- Each page carries a Content-Security-Policy meta tag. In `index.html`, `script-src` lists the SHA-256 of each inline `<script>`. **If you change any inline script, recompute the hashes or every script on the page stops running.** From the repo root:
  `python3 -c "import re,hashlib,base64;s=open('index.html').read();print(' '.join(\"'sha256-\"+base64.b64encode(hashlib.sha256(m.encode()).digest()).decode()+\"'\" for m in re.findall(r'<script>(.*?)</script>',s,re.S)))"`
  and put the output in place of the old hashes. Then load the page and check the console shows no "Refused to execute" errors.
- No third-party scripts, styles, fonts, analytics or embeds. If one is ever needed, it has to be added to the CSP on purpose (and pinned with `integrity`). If the form service changes, change `connect-src` too.
- `innerHTML` only ever takes constants written in the page script. Anything a visitor types, or anything from the URL or storage, goes in as text.
- The head script hides the page and breaks out if it is framed by another site (GitHub Pages can't send `frame-ancestors`). Keep it.
- No inline event handlers (`onclick=`) or `javascript:` links; the CSP blocks them.

## Design brief (short version)

The full design system is the private Google Doc "Nevio design system" in the hub's 4 Website folder; it predates the current look, so where it differs on palette, type or motion, the notes below win until Jason updates it. The doc still holds for voice, facts and components.

On Nov 26, 2026, after rejecting several directions as vibecoded or generic, Jason chose a combined world, "depth scan" plus "model's-eye view": premium, futuristic and dark, with color and motion, and not a copy of any other site (Command Code was a craft bar, not a look to copy).

- Ground: one scan-black #05080A on every section; sections never change background color. Raised panels #0A1013, hairlines at 8% and 15% of the text color.
- Color roles: text #EAF0EE, secondary #A5B2B0, muted #7D8A88. Lime #D7F25A is the one action color (buttons, focus, the scan line, the one figure that matters). Teal #2FE0C6 with amber #FFB648 highlights is scan material only. The model's attention has its own ramp: #0B1C33, #145E78, #22B5A0, #7DD66A, #D7F25A, #FFFBD6. Triage colors only on results, always with their words: urgent #FF6B5E, review #F5B342, routine #4CC9A0. Never violet or lavender.
- Background: one fixed WebGL canvas. Everywhere, a faint still speckle and dermal-fibre field that the pointer lights in teal. In the hero, an illustrated skin cross-section (surface, epidermis, dermis) acquired left of a lime scan line that follows the pointer; it is labelled as an illustration. Nothing moves on its own except the intro and the hero's one scan sweep after it; it redraws only on pointer, scroll and resize.
- Real model internals, not decoration: the colored maps on the eight specimens and on the case are the research model's final 12 x 12 feature maps weighted by its attention module (computed locally from the app's `model.explain`, packed into `MAPS` in the page script, scaled per photo and cropped to the centre square the page shows). The case map comes from the photo alone, so it does not change as details are added; the page says so. Recompute the maps if the model changes. Specimens show the model's view by default and develop into the real photo under the pointer (mid-screen on touch).
- No flesh on first load: the hero shows only the illustrated cross-section; lesion photos start below the fold.
- Light mode ("lab paper"): a toggle in the header (in the menu on phones), remembered in localStorage, dark by default. Cool white #EDF1EF ground, ink #0A1412 text, the scan printed as dark teal speckle, lime kept as the button fill with an ink ring, figures and focus in deep olive #3F5A00 and ink. Specimen tiles, the case lens and the layer maps stay dark, like screens on paper. Tokens live under `html[data-theme="light"]`; the shader takes `uTheme`.
- Interactive sections, all real data: pick a specimen to read its scores (photo only or with details); real female front and back outlines (from the research app's body map, react-native-body-highlighter, MIT; credited in the footer) cut into the model's sites, where the picked site lights in the case's real melanoma score on the attention ramp, with a ranked list (don't hand-draw a body); a sideways strip of real feature maps, layer by layer; "How a pilot runs" in five steps whose line fills as you scroll.
- Intro: once per visit (sessionStorage), a lime scan line sweeps across and acquires the mark and the wordmark, which then fly into the header; any key, click or scroll skips it, reduced motion skips it, and `?intro=off` skips it for screenshots.
- Signature: a millimetre depth ruler at the left edge (wide screens): scroll reads as depth from the surface to 2 mm.
- Type: Host Grotesk only, 400 and 500 (600 for the wordmark), tight tracking on display sizes, tabular figures. No italics, no all-caps labels, no monospace.
- Shape: 6 px control radius (the Model's view switch too: 6 px, 4 px track, 2 px knob), 8 to 10 px panels, round only for lenses and status dots. Depth from surface steps and hairlines, not glows.
- Keep: the pinned case scene with the real step outputs and the 17 numbers the model reads; the pinned phone scene with real app screenshots; the icon arrays; the ASCII footer wordmark built from the evidence numbers, stirred by the pointer; easter eggs (type "scan" for a wider light, "abcde" for the ABCDE checklist, hover scramble on big numbers and names, a console note). Keep them truthful and small.
- Motion explains something: the scan line acquiring, the develop under the pointer, scores tweening to real values, a sweep over the case photo on each rescore. One easing curve; transform, opacity, clip-path, mask and filter (the case photo dims under Model's view, the privacy statement comes into focus). Everything works with reduced motion and without JavaScript.
- Few words, sentence case, no eyebrow labels, no arrows on links, no em dashes, no periods on headings.
- Works at 375 px wide; the pinned case scene fits down to 960 x 700 (below 1000 px tall the lead shortens to "Scroll, or pick a step", and below 800 the 17-number strip hides). Keyboard accessible, visible focus, WCAG AA contrast.

## How to check your work

- github.io is the live site; changes appear a minute or two after a push to `main`.
- Check every in-page `#anchor` resolves, the mobile menu opens and closes, the toggle switches both ways, and the form shows its success and fallback states.
- Look at it at 375 px and at a desktop width before calling it done. Add `?intro=off` to skip the intro in screenshots.
- Check the browser console shows no Content-Security-Policy violations, and that the form sends nothing when submitted within 2 seconds of load or with the trap field filled.
- If you touch `api/`, run its tests (unit, admin and Turnstile tests need nothing; the integration tests need `wrangler dev`, see `api/README.md`): `cd api && npm test`.
