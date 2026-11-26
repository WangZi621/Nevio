# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: leads of primary care practices and community health centers in southeastern Pennsylvania who could run a free research pilot starting 2027. They are deciding whether Nevio is real enough, safe enough and simple enough to try in their clinic.

Also reading the same page: competition judges (Conrad and Diamond Challenge, December 2026) and dermatologists checking whether the science is honest.

## Product Purpose

Nevio is an AI skin-lesion triage tool for primary care. A clinician photographs a skin spot through a clip-on dermatoscope and enters up to 17 patient details. Nevio returns three scores (melanoma, other skin cancer, benign) and one triage suggestion: Refer urgently, Refer for review, or Routine follow-up. The clinician decides.

The website's one job: get a clinic to request a free research pilot after believing the result is real.

## Positioning

The model reads the photo together with the patient's details (an EfficientNet-B4 image branch plus a 17-feature patient branch), and it runs entirely on the clinic's own computer or phone in the browser, so photos and patient details never leave the room. About 21 MB, offline after the first load.

## Operating Context

Used during a normal primary care visit: photograph the spot through a clip-on dermatoscope, add the patient's details, read the scores and suggestion, print a referral note. Pilot clinics get a dermatoscope for the study, in-person setup and staff training, and a summary comparing Nevio's suggestions with dermatologists' decisions and biopsy results.

## Capabilities and Constraints

- Research stage. Not FDA-cleared or approved, not for sale, does not diagnose. Say triage, scores, suggests.
- Classes, with these names: melanoma; other skin cancer (basal and squamous cell carcinoma); benign.
- The site is one static index.html with inline CSS and vanilla JS, no build step or framework, served by GitHub Pages. It must load fast on a clinic computer and a phone.
- The pilot form posts to the FORM_ENDPOINT setting (FormSubmit) with a copyable fallback; the endpoint does not change without Jason's say-so.
- Never on the site: pricing, revenue, funding needs or FDA cost plans; the patent; "backed by" or "funded by"; head-to-head claims against other products; "diagnoses", "detects cancer", "93% accurate", "FDA approved"; a personal email address in visible text.

## Brand Commitments

- Name: Nevio.
- Team, first names only: Jason (CEO and CTO), Daisy (CMO), Kenny (COO), James (CFO).
- Jason asked to keep the real app phone scene and a short intro animation on first load.
- No lesion photo as the first thing on load.

## Evidence on Hand

All results come from one held-out split of 9,080 biopsy-confirmed ISIC images (36,320 for training). It is not a clinical study.

- Melanoma AUC 0.940. Three-class AUC 93.2% (an AUC, never "accuracy"). Three-class accuracy 78.6%.
- Melanoma sensitivity 90.0% and specificity 81.5% at a 27.8% cutoff; shown as natural frequencies: 180 of 200 melanomas flagged, 163 of 200 other spots left unflagged.
- One real case, ISIC_5700648 (biopsy-confirmed melanoma in situ, MSK, CC BY), scored step by step by the real model: photo only 6/18/75 Refer for review; plus looks like a mole 74/24/2 Refer urgently; plus age 65, female 72/27/2 Refer urgently; plus head or neck 82/17/2 Refer urgently.
- Assets: img/app-*.webp (real research app screenshots), img/specimens/*.webp (eight biopsy-confirmed ISIC samples, CC BY credits in the footer), img/mis-5700648.jpg (the case photo).
- Recognition: first place in Computer Science, 2026 Delaware Valley Science Fair; paper accepted to IEEE HealthCom 2026.
- No customers, testimonials, clinical study results or partner logos exist. Do not invent any.

## Product Principles

1. Show the real thing: the real model's real outputs, the real app, real biopsy-confirmed images.
2. Honest about limits: research stage, one held-out split, few images of darker skin; say so plainly.
3. The clinician decides; Nevio suggests.
4. Privacy is a mechanism, not a promise: the model runs on the device.

## Accessibility & Inclusion

WCAG AA contrast, keyboard accessible with visible focus, works at 375 px wide, respects reduced motion, and reads without JavaScript.
