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
- `.nojekyll` so Pages serves files as they are.
- `img/specimens/*.webp` are 480 px crops of the app's eight biopsy-confirmed ISIC samples (CC BY: MSK and Dr. Cristian Navarrete et al.; credits in the footer).
- Fonts from Google Fonts: Anybody (headlines, big numbers and the wordmark, set condensed with `font-stretch: 62%`, weight 800), Bricolage Grotesque (everything else).

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

The form posts JSON to the `FORM_ENDPOINT` setting near the top of the page script (FormSubmit). Keep that setting and the fallback behaviour (if sending fails, the visitor gets a copyable message). FormSubmit needs a one-time activation from the receiving inbox; after that the endpoint should use FormSubmit's random alias instead of an address. Don't change the endpoint without Jason's say-so.

## Design brief (short version)

The full design system (palette, type, layout, components, page plan, CSS tokens) is the private Google Doc "Nevio design system" in the hub's 4 Website folder. Ask Jason for it; where it differs from the notes below, it wins.

On Nov 26, 2026 Jason asked for a bolder, less generic site, then for more texture, more style, no AI-looking fonts or rounded buttons, colors that pop, a background that reacts only to the cursor, and more things going on (easter eggs, ASCII, dither). The page now follows the research app's own visual system (docs/DESIGN.md in SkinCancer-AI) so the site and the app screenshots read as one brand, with Nevio's own type, shapes and motion on top:

- Color, "clinic light" (the app's palette): off-white ground #ECECEC under a dot lattice, white sheets #FFFFFF, ink #0B0E14 for text, button outlines and hard shadows, dress blue #14213D for headlines, muted ink #4C525D, rules #D5D7DC, and cobalt #1B4FD8 as the one color that acts (buttons, LED arcs, the figure that matters, the lattice under the pointer). Never violet, lavender or indigo. Sections never change background color; they are separated by space and scale. Triage colors (urgent #B42318, review #9A4A06, routine #1A7247, the app's own) appear only on results, always with their words; cobalt never colors a result. Colors live in the :root tokens and the shader reads --net, --net-hot and --net-base from them.
- Background: a WebGL triangular dot lattice (28 px) with fine grain, still until the pointer touches it. Near the pointer the dots swell and bulge and cobalt struts light up; a click or tap on empty page sends a ripple. Nothing moves on its own and it does not drift with scroll (Jason disliked the automatic hexagons). In the case scene the lattice turns irregular as the real melanoma score rises. Without WebGL a static SVG dot lattice stands in.
- No flesh on first load (Jason, Nov 26): the hero is a lens that follows the pointer and shows a lit field with an organic pigment network; the real lesion photos start below the fold, and the specimen grid prints them as a 1-bit Bayer dither that develops into the photo where the pointer looks (mid-screen on touch screens).
- Intro: once per visit (sessionStorage), the logo's ring draws itself, the LED arc lights, the spot comes into focus, the wordmark rises, and the mark flies into the header; any key, click or scroll skips it, and reduced motion skips it entirely. The hero then enters once. No fade-in on every section, no captions under images (credits go in the footer), per the taste skill (Leonxlnx/taste-skill).
- Shape: no rounded corners on controls. Buttons, panels and tags have one 45 degree cut corner, like the writing face of a biopsy tissue cassette. Buttons have a 2 px ink outline and a hard 4 px ink offset shadow, lift on hover and press in on click (the app's buttons). Only physical things are round: lenses and the phone.
- Type: Anybody condensed 800 for headlines and big numbers, Bricolage Grotesque for text. No italics, no monospace (the ASCII wordmark draws Bricolage characters on a grid).
- The memorable parts: the intro; the hero lens; the dithered specimen grid; the pinned case scene where real model outputs change as details are added, with the 17 numbers the model actually reads (encodeMetadata in the app; blank details use its neutral defaults) and a sweep and scan on each rescore; the pinned phone scene with real app screenshots; the icon arrays; the ASCII footer wordmark built from the evidence numbers, which the pointer stirs.
- Easter eggs: type "scope" for a lens that follows the pointer around the whole page, "abcde" for the ABCDE melanoma checklist, Escape to close; big numbers and names re-read themselves on hover; the header logo's LED arc turns with scroll like a focus ring; a short note in the browser console. Keep them truthful and small.
- Motion explains something: focus (blur to clear), the LED arc turning like a focus ring, scores moving to real values. Transform, opacity, clip-path, mask and filter only. Everything still works and reads with reduced motion and without JavaScript.
- Six or seven sections, few words, sentence case, no eyebrow labels, no arrows on links, no em dashes, no periods on headings.
- Works at 375 px wide (the hero keeps a clear window for the lens between headline and buttons), and the pinned case scene fits down to 960 x 680 (the 17-number strip hides below 710 px tall). Keyboard accessible, visible focus, WCAG AA contrast.

## How to check your work

- github.io is the live site; changes appear a minute or two after a push to `main`.
- Check every in-page `#anchor` resolves, the mobile menu opens and closes, the toggle switches both ways, and the form shows its success and fallback states.
- Look at it at 375 px and at a desktop width before calling it done.
