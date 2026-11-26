# Nevio website: notes for Claude Code and other agents

This repo is the public marketing site for Nevio, served by GitHub Pages from `main` at the repo root:
https://wangzi621.github.io/Nevio/

The full project context (business plan, model details, team, open questions and the design brief) is in a private Google Doc, "NEVIO_CONTEXT (read this first)", in Jason's Drive folder "Nevio project hub". Ask Jason for it. This file keeps only what is safe in a public repo.

## What Nevio is

An AI skin-lesion triage tool for primary care clinics. A clinician takes a dermatoscope photo of a skin spot and enters up to 17 patient details. Nevio returns three scores (melanoma, other skin cancer, benign) and one triage suggestion: Refer urgently, Refer for review, or Routine follow-up. It runs on the clinic's own device, so photos never leave the room. It is research-stage, not FDA-cleared, and it does not diagnose.

Who the site is for, in order: competition judges (Conrad and Diamond Challenge, December 2026), primary care clinic leads considering a free research pilot, and dermatologists checking whether the science is honest. The page has one job: get a clinic to request a free research pilot after believing the result is real.

## Stack

- One static `index.html` (HTML, CSS and vanilla JS inline). No build step, no framework, no package manager.
- Images in `img/`. `og.jpg` is the 1200 x 630 share image. `mark.svg` is the logo mark and favicon.
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

On Nov 26, 2026 Jason asked for a bolder, less generic site than the light design-system version, then for more texture, more style and no AI-looking fonts or rounded buttons. The page now uses a "scope" system that departs from the Drive doc's light palette, type and motion rules (the doc still holds for voice, facts and components until it is updated):

- Color, "surgical": one green-black ground (#131917) for the whole page, bone text (#E8E6DE), sage (#9FC7B8) for the lattice and quiet highlights, and one warm accent, peach (#F7A98B), for actions, the LED arcs and the figure that matters. Green is the complement of red tissue (why operating rooms went green in the 1920s), so the peach and the photos pop against it. Never violet or lavender anywhere. Sections never change background color; they are separated by space and scale. Triage colors (urgent #FF6A5C, review #F2B04A, routine #5FD0BE) appear only on results, always with their words; the peach accent never touches a result.
- Texture: a WebGL pigment-network lattice behind the page (the mesh dermatologists read under the scope). The pointer lights it, it drifts with scroll, and it turns atypical (irregular) as the case's melanoma score rises. Without WebGL, a faint SVG honeycomb stands in. Keep it subtle behind text.
- No flesh on first load (Jason, Nov 26): the hero is a lens over the lattice that follows the pointer and magnifies it; the real lesion photos start below the fold.
- Intro: once per visit (sessionStorage), the logo's ring draws itself, the LED arc lights, the spot comes into focus, the wordmark rises, and the mark flies into the header; any key, click or scroll skips it, and reduced motion skips it entirely. The hero then enters once. No fade-in on every section, no captions under images (credits go in the footer), per the taste skill (Leonxlnx/taste-skill).
- Shape: no rounded corners on controls. Buttons, panels and tags have one 45 degree cut corner, like the writing face of a biopsy tissue cassette. Only physical things are round: lenses and the phone.
- Type: Anybody condensed 800 for headlines and big numbers, Bricolage Grotesque for text. No italics, no monospace.
- The memorable parts: the intro; the hero lens over the lattice; the specimen grid; the pinned case scene where real model outputs change as details are added; the pinned phone scene with real app screenshots; the icon arrays.
- Motion explains something: focus (blur to clear), the LED arc turning like a focus ring, scores moving to real values. Transform, opacity, clip-path and filter only. Everything still works and reads with reduced motion and without JavaScript.
- Six or seven sections, few words, sentence case, no eyebrow labels, no arrows on links, no em dashes, no periods on headings.
- Works at 375 px wide (the hero keeps a clear window for the lens between headline and buttons), keyboard accessible, visible focus, WCAG AA contrast.

## How to check your work

- github.io is the live site; changes appear a minute or two after a push to `main`.
- Check every in-page `#anchor` resolves, the mobile menu opens and closes, the toggle switches both ways, and the form shows its success and fallback states.
- Look at it at 375 px and at a desktop width before calling it done.
