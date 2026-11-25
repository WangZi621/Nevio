# Nevio website: notes for Claude Code and other agents

This repo is the public marketing site for Nevio, served by GitHub Pages from `main` at the repo root:
https://wangzi621.github.io/Nevio/

The full project context (business plan, model details, team, open questions and the design brief) is in a private Google Doc, "NEVIO_CONTEXT (read this first)", in Jason's Drive folder "Nevio project hub". Ask Jason for it. This file keeps only what is safe in a public repo.

## What Nevio is

An AI skin-lesion triage tool for primary care clinics. A clinician takes a dermatoscope photo of a skin spot and enters up to 17 patient details. Nevio returns three scores (melanoma, other skin cancer, benign) and one triage suggestion: Refer urgently, Refer for review, or Routine follow-up. It runs on the clinic's own device, so photos never leave the room. It is research-stage, not FDA-cleared, and it does not diagnose.

Who the site is for, in order: competition judges (Conrad and Diamond Challenge, December 2026), primary care clinic leads considering a free research pilot, and dermatologists checking whether the science is honest. The page has one job: get a clinic to request a free research pilot after believing the result is real.

## Stack

- One static `index.html` (HTML, CSS and vanilla JS inline). No build step, no framework, no package manager.
- Images in `img/`. `og.jpg` is the 1200 x 630 share image.
- `.nojekyll` so Pages serves files as they are.
- Fonts from Google Fonts: Schibsted Grotesk (headings), Atkinson Hyperlegible (body).

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

The current page reads as generated: eleven bands with the same shape, too many words, a product mock drawn in HTML instead of a real screenshot, no logo, and the same rounded card everywhere. For the next version:

- Six or seven sections at most. Fewer words per section.
- Keep the real case card and the photo-only versus photo-plus-details toggle. They are the memorable part.
- Replace drawn mocks with real screenshots of the working research app (https://wangzi621.github.io/SkinCancer-AI/) using its sample images.
- A real logo mark plus the wordmark.
- Light, clinical, calm. The three triage colors (red #c8372d, amber #b7791f, teal #2a8277) appear only on results, always with their words.
- Sentence case, no all-caps labels, no eyebrow labels over headings, no arrows appended to links, no em dashes in copy.
- Motion only where it explains something.
- Works at 375 px wide, keyboard accessible, visible focus, respects reduced motion.

## How to check your work

- github.io is the live site; changes appear a minute or two after a push to `main`.
- Check every in-page `#anchor` resolves, the mobile menu opens and closes, the toggle switches both ways, and the form shows its success and fallback states.
- Look at it at 375 px and at a desktop width before calling it done.
