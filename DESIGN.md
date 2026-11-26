---
name: Nevio
description: A dark depth scan that the visitor's pointer lights, showing where the real model looks.
colors:
  ground: "#05080A"
  raised: "#0A1013"
  line: "rgba(226, 240, 236, 0.08)"
  line-2: "rgba(226, 240, 236, 0.15)"
  text: "#EAF0EE"
  text-2: "#A5B2B0"
  muted: "#7D8A88"
  lime: "#D7F25A"
  lime-hi: "#E6FA86"
  lime-ink: "#10160A"
  teal: "#2FE0C6"
  teal-deep: "#0E4A4F"
  amber: "#FFB648"
  att-0: "#0B1C33"
  att-1: "#145E78"
  att-2: "#22B5A0"
  att-3: "#7DD66A"
  att-4: "#D7F25A"
  att-5: "#FFFBD6"
  urgent: "#FF6B5E"
  review: "#F5B342"
  routine: "#4CC9A0"
typography:
  display:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(48px, 6.2vw, 92px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-statement:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(52px, 7vw, 96px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  numeral:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(60px, 6.6vw, 96px)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(38px, 4.4vw, 64px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  figure:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontFeature: "\"tnum\""
  verdict:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 2.6vw, 40px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.35vw, 21px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\""
  button:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1
  nav:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  small:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  annotation:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  wordmark:
    fontFamily: "Host Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "23px"
    fontWeight: 600
    letterSpacing: "-0.03em"
rounded:
  hair: "2px"
  track: "3px"
  sm: "4px"
  control: "6px"
  panel-sm: "8px"
  panel: "10px"
  device: "40px"
  round: "50%"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  ml: "20px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"
  4xl: "64px"
  row: "22px"
  side: "clamp(20px, 4.4vw, 64px)"
  gutter: "clamp(40px, 6vw, 96px)"
  section: "clamp(120px, 12vw, 176px)"
  head: "72px"
  max: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.lime-hi}"
  button-primary-disabled:
    backgroundColor: "#2A3432"
    textColor: "{colors.text-2}"
  button-ghost:
    backgroundColor: "rgba(226, 240, 236, 0.03)"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-ghost-hover:
    backgroundColor: "rgba(226, 240, 236, 0.07)"
  button-header:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  nav-link:
    textColor: "{colors.text-2}"
    typography: "{typography.nav}"
    padding: "0 12px"
    height: "44px"
  nav-link-active:
    textColor: "{colors.text}"
  input-field:
    backgroundColor: "rgba(226, 240, 236, 0.04)"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "50px"
  input-field-focus:
    backgroundColor: "rgba(226, 240, 236, 0.06)"
  switch:
    backgroundColor: "rgba(226, 240, 236, 0.05)"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 14px 0 8px"
    height: "44px"
  switch-track:
    backgroundColor: "#26302F"
    rounded: "{rounded.sm}"
    width: "34px"
    height: "20px"
  switch-track-on:
    backgroundColor: "{colors.lime}"
  detail-row:
    textColor: "{colors.muted}"
    padding: "6px 4px"
    height: "52px"
  detail-row-given:
    textColor: "{colors.text}"
  scan-tag:
    backgroundColor: "rgba(5, 8, 10, 0.72)"
    textColor: "{colors.text-2}"
    typography: "{typography.annotation}"
    rounded: "{rounded.sm}"
    padding: "4px 9px"
  panel:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.panel-sm}"
    padding: "28px 30px"
  form-card:
    backgroundColor: "#0C1316"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 3vw, 40px)"
  score-track:
    backgroundColor: "rgba(226, 240, 236, 0.06)"
    rounded: "{rounded.track}"
    height: "6px"
  score-fill:
    backgroundColor: "rgba(226, 240, 236, 0.28)"
    rounded: "{rounded.track}"
  score-fill-urgent:
    backgroundColor: "{colors.urgent}"
  score-fill-review:
    backgroundColor: "{colors.review}"
  verdict-urgent:
    textColor: "{colors.urgent}"
    typography: "{typography.verdict}"
  verdict-review:
    textColor: "{colors.review}"
    typography: "{typography.verdict}"
  vector-cell:
    backgroundColor: "rgba(226, 240, 236, 0.03)"
    rounded: "{rounded.hair}"
    height: "26px"
  vector-bar:
    backgroundColor: "{colors.teal}"
  vector-bar-changed:
    backgroundColor: "{colors.lime}"
  array-dot:
    backgroundColor: "{colors.text}"
    rounded: "{rounded.round}"
  toast:
    backgroundColor: "rgba(10, 16, 19, 0.94)"
    textColor: "{colors.text-2}"
    rounded: "{rounded.panel}"
    padding: "18px 20px"
    width: "440px"
  ruler-mark:
    backgroundColor: "{colors.lime}"
    width: "18px"
    height: "2px"
---

# Design System: Nevio

## Overview

**Creative North Star: "The Lit Cross-Section"**

The page is an instrument, not a brochure. Everything sits on one scan-black ground, and the only light in the room is the visitor's pointer: where it moves, a faint speckle field lights up in teal; in the hero, an illustrated cross-section of skin is acquired left of a lime scan line that follows it. Below the fold the light stops being illustration and becomes evidence. Real biopsy-confirmed specimens are shown first as the research model sees them, its own feature maps on the attention ramp, and develop into the photo where the pointer looks. Scrolling reads as depth: a millimetre ruler at the left edge goes from the surface down to 2 mm.

Density is low and deliberate. Big Host Grotesk headlines with tight tracking, a lead paragraph, then one instrument per section: the specimen grid, the case lens and its readout, the phone, the icon arrays, the statement over the device edge, the form. Sections are separated by space and hairlines, never by a change of ground. Color is rationed by role: lime acts, teal and amber are scan material, the attention ramp is the model's, and the triage colors speak only when a result does.

The world refuses two things by name: the medical template (white ground, clinical blue, stock clinicians) and the generic AI page (purple glow, rows of equal cards). Light here is always caused by something, the pointer or the model, and nothing moves on its own after the intro.

**Key Characteristics:**
- One scan-black ground on every section; depth from light, tonal steps and hairlines, not from shadows or glows.
- The pointer is the light: the WebGL scan layer is still until the pointer lights it.
- Real model internals as imagery: 12 x 12 feature maps on a six-stop attention ramp, cropped and scaled exactly like the photo they sit on.
- Lime is the one color that acts; triage colors appear only with their words.
- Host Grotesk alone, 400 and 500, tight display tracking, tabular figures everywhere.
- 6 px control corners, 4 px tags and tiles, circles only for lenses and dots.
- One authored motion moment (the intro and the hero sweep); everything after that answers the pointer, the scroll or a new value.

## Colors

A near-black instrument palette with one live accent, an OCT-style teal and amber for the scan, a separate cool-to-bone ramp for the model's attention, and three warm-to-green status colors held back for results.

### Primary
- **Signal Lime** (lime): the one color that acts. Primary buttons, the header call to action, focus rings, text selection, link underlines on hover, the caret, the scan line in the hero and on the case lens, the depth ruler's mark, the current how-it-works step, the given ticks and the changed cells in the 17-number strip, the switch when on, and the lead figure in each evidence block. It sits at 16:1 on the ground.
- **Lime Lift** (lime-hi): primary button hover only.
- **Lime Ink** (lime-ink): text and check marks on lime. Never used on the ground.

### Secondary
- **Scan Teal** (teal): scan material. The speckle under the pointer, the hero and privacy cross-sections, the specimen tint, the 17-number bars at rest, and the ASCII footer wordmark.
- **Deep Scan Teal** (teal-deep): the dark end of the scan material, used in the no-WebGL fallback band.

### Tertiary
- **Surface Amber** (amber): the bright skin surface line in the scan, where the speckle is most reflective. Scan material only; never a UI color.

### Attention ramp
Six stops for the model's response, low to high: **Deep Field** (att-0), **Cold Response** (att-1), **Teal Response** (att-2), **Green Response** (att-3), **Lime Response** (att-4), **Bone Peak** (att-5). Used only for real model maps, the hero's attention bloom, and the ramp keys that label them. Its fourth step shares lime's value on purpose: the model's hot spots and the action color are the same light. Inside a map it is data, not an action.

### Triage
- **Urgent Coral** (urgent): "Refer urgently", the leading score's fill when the verdict is urgent, form field errors, and a failed send.
- **Review Amber** (review): "Refer for review", its leading score fill, and the "probably sent" form state.
- **Routine Green** (routine): "Routine follow-up" and the form's sent confirmation.

### Neutral
- **Scan Black** (ground): the page, every section, the header's solid state, the intro.
- **Raised Black** (raised): one tonal step up for media wells (specimen tiles, the lens interior) and the limits panel.
- **Hairline** (line) and **Strong Hairline** (line-2): the text color at 8% and 15%. Row dividers, inset rings on controls, panels and tiles, the ruler's minor ticks.
- **Instrument White** (text): headings, body copy, figures, icon array dots. 17:1 on the ground.
- **Secondary Grey** (text-2): leads, descriptions, nav links at rest, scan tags. 9:1.
- **Muted Grey** (muted): metadata, captions under figures, hints, unfilled states. 5.6:1 on the ground and above 5:1 on raised surfaces, so it holds AA at 14 px.

Text-tinted washes of the same hairline color make the control fills: 3 to 5% at rest, plus about 4% on hover, 6% for empty score tracks, 28% for a neutral score fill.

### Named Rules
**The One Light Rule.** Lime marks what acts or what is live right now. It is never a second brand color, never a large fill, and never emphasis on static text.

**The Words Attached Rule.** Urgent, review and routine appear only where a result or a status is stated, always beside the words that name it. Only the leading score's fill takes the verdict's color; the others stay neutral.

**The Same Ground Rule.** Every section sits on scan-black. The cross-section bands are light drawn on that ground, not colored panels.

**The Mirror Rule.** The :root tokens are normative, but the WebGL shader, the attention ramp array, the specimen scan LUT, the ASCII footer and the inline logo marks carry literal copies of these values. Change a token and its copies together.

## Typography

**Display Font:** Host Grotesk (self-hosted variable woff2, with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Host Grotesk
**Label/Mono Font:** none; there is no second family and no monospace.

**Character:** One grotesk carries everything, split by weight and tracking alone. At display sizes it is set at 500 and pulled tight so headlines read as dense, engineered shapes; at body sizes it opens up at 400 with generous leading. Figures are tabular across the whole page so scores and counts never jitter as they tween.

### Hierarchy
- **Display** (500, clamp 48 to 92 px, 0.98, -0.04em): the hero headline only, two lines at desktop. On phones it steps to clamp 40 to 56 px at line height 1.
- **Display statement** (500, clamp 52 to 96 px, 0.98, -0.04em): the privacy statement, whose words come into focus with scroll.
- **Numeral** (500, clamp 60 to 96 px, 0.92, -0.04em): the evidence counts; the denominator is muted.
- **Headline** (500, clamp 38 to 64 px, 1.02, -0.035em): section headings. Inside the pinned case scene it tightens to clamp 34 to 46 px.
- **Figure** (500, 44 px, 1, -0.04em): metric values in the results sheet. Siblings on the same rule: team names at clamp 36 to 52 px, privacy facts and score values at 32 px (26 px pinned), all 500 with -0.03 to -0.04em.
- **Verdict** (500, clamp 30 to 40 px, 1.1, -0.03em): the triage suggestion, in its triage color.
- **Title** (500, 22 px, 1.25, -0.015em): step titles, the limits panel heading, the FAQ heading.
- **Lead** (400, clamp 18 to 21 px, 1.55): the paragraph under a heading, in secondary grey, max about 34em.
- **Body** (400, 18 px, 1.6): running text, list items, FAQ answers.
- **Button** (500, 16 px): all buttons. Nav links and field labels sit at 15 px.
- **Small** (400, 14 px): metadata, legends, help text, in muted grey.
- **Annotation** (400, 12 px): scan tags, the ruler readout, the band notes. 13 px for the cutoff note and keycaps.
- **Wordmark** (600, 23 px, -0.03em): "nevio", always lowercase, beside the mark. The one place 600 appears in UI (96 px in the intro, the giant footer word).

### Named Rules
**The One Family Rule.** Host Grotesk only. Hierarchy comes from size, weight (400 against 500) and tracking, never from a second face, italics or all caps.

**The Tight at Scale Rule.** Tracking tightens as size grows: -0.015em at 22 px, -0.03em around 32 to 40 px, -0.035 to -0.04em at headline and display sizes. Body text is never tracked.

**The Sentence Case Rule.** Every heading, label, button and tag is in sentence case with no period on headings, no eyebrow above a heading, and no arrow after a link.

## Layout

Content sits in a centred column of up to 1280 px plus side padding that grows from 20 to 64 px. The fixed header is 72 px tall and anchors scroll padding. Each section opens with top padding of clamp 120 to 176 px; the pilot section also closes with it. Nothing else separates sections.

The grid is asymmetric pairs. Section heads split 7 : 5 with the heading left and the lead aligned to the end of the right column. Content pairs (case, how it works, team, pilot, evidence details) split 5 : 6 with a gutter of clamp 40 to 96 px. The specimen grid is four columns with 40 px rows and 20 px columns, two columns below 860 px. The evidence arrays are two columns on a subgrid so their counts, labels and dot grids align row for row.

Rhythm is built on 4 and 8: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Lists of facts, steps, people and FAQ entries are rows divided by hairlines with about 22 px of vertical padding, a strong hairline on top and a light one between.

The hero fills the first viewport: headline, then a row with the lead at left and the two actions at right, then a full-bleed cross-section band (min 280 px, 220 px on phones) that runs edge to edge under the column.

Two scenes pin at 960 x 700 and above: the case (a 440vh track with a sticky full-height stage, scroll steps through the details) and how it works (320vh, scroll steps the phone). Below 1000 px tall the case lead shortens; below 800 px the 17-number strip hides. Under 960 px both unpin and stack: the case orders heading, lens, then rows, strip, scores and verdict; the phone gives way to a screenshot under each step.

At 860 px and below the nav collapses into a Menu button and a dropdown panel of 56 px rows. At 760 px and below the hero actions share the width equally. Specimens develop when they sit in the middle fifth of the screen on touch devices. The depth ruler shows from 1180 px; its millimetre readout from 1560 px.

### Named Rules
**The Asymmetric Pair Rule.** Two-column layouts are 5 : 6 or 7 : 5, never 1 : 1 rows of equal cards.

## Elevation & Depth

Depth is optical, not stacked. The page is one plane of scan-black, and depth comes from four things in order: the pointer's light in the scan layer, one tonal step to raised black for wells and panels, 1 px inset hairline rings that draw every edge without shifting layout, and the depth ruler that turns scroll into millimetres. Shadows are black, soft and reserved for the three objects that float above the page. The header turns to 90% scan-black with a 12 px backdrop blur once the page scrolls past 24 px.

### Shadow Vocabulary
- **Device drop** (`box-shadow: inset 0 0 0 1px var(--line-2), 0 40px 80px -30px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 0, 0, 0.6)`): the phone.
- **Card drop** (`box-shadow: inset 0 0 0 1px var(--line-2), 0 40px 80px -40px rgba(0, 0, 0, 0.8)`): the pilot form card.
- **Overlay drop** (`box-shadow: inset 0 0 0 1px var(--line-2), 0 24px 60px -20px rgba(0, 0, 0, 0.9)`): the toast, with a 10 px backdrop blur.
- **Hairline ring** (`box-shadow: inset 0 0 0 1px var(--line)` or `var(--line-2)`): every control, tile, panel and tag edge.

### Named Rules
**The Light Is Depth Rule.** Things come forward because they are lit, not because they cast shadows. No colored shadow, no glow, no text shadow; drop shadows are black and only under the phone, the form card and the toast.

## Shapes

Corners are small and consistent. Everything a finger presses (buttons, fields, the switch, the menu button, the skip link) has 6 px corners. Tags on the scan, specimen tiles, tick boxes, the switch track and keycaps use 4 px. The 17-number cells, the switch knob and focus outlines use 2 px. Panels open up a little: 8 px for the limits panel, 10 px for the form card and the toast. Score tracks and ramp keys are 6 px tall with 3 px ends.

Circles are reserved for things that are round: the case lens, the icon array dots, the honors bullets, the verdict's status shape, the step counters, and the spinner. The phone has its physical corners (40 px body, 30 px screen). The switch is a rounded rectangle, not a pill.

The lens is the recurring magnified-view shape: a circular clip inset 7% inside a ring of 120 ticks, every tenth longer and brighter. The score track carries a 2 px cutoff tick that overshoots the track by 6 px above and below. Missed or unflagged items in icon arrays are 1.5 px rings, not dimmer fills. The FAQ disclosure is a plus drawn from two 1.5 px bars, one of which rotates flat when open.

### Named Rules
**The 6 px Rule.** Every pressable thing has 6 px corners. No pills, no cut corners, nothing above 10 px except the phone's physical body.

## Components

### Buttons
Flat, solid and precise; they read as instrument keys, not pills.
- **Shape:** gently squared corners (6 px), 52 px tall, 24 px side padding, 500 weight at 16 px.
- **Primary:** lime fill with lime ink text. Used for Request a pilot (header, 40 px tall on desktop, 44 px on phones), Request a free pilot, and Send pilot request.
- **Hover / Focus:** hover lifts the fill to lime-hi in 160 ms; focus draws a 2 px lime outline 3 px out; press nudges down 1 px and scales to 0.99 in 120 ms.
- **Ghost:** a 3% text wash with a strong hairline ring, text in instrument white; hover raises the wash to 7% and the ring to 28%. Used for See a real case and Copy request.
- **Disabled / busy:** a dark grey fill with secondary text and a 16 px spinner while the form sends.

### Scan tags
- **Style:** 12 px secondary grey text on a 72% scan-black chip, 4 px corners, a hairline ring, 4 by 9 px padding.
- **Use:** labels placed on drawn scans only (Surface, Dermis, On the clinic's device, Nothing crosses this line). They annotate an image; they never sit above a heading.

### Panels
- **Corner Style:** 8 px (limits panel), 10 px (form card).
- **Background:** raised black for the limits panel; a very slight vertical gradient from just above raised for the form card.
- **Shadow Strategy:** hairline ring only for the limits panel; card drop for the form card (see Elevation & Depth).
- **Internal Padding:** 28 by 30 px; clamp 24 to 40 px for the form card.
- Panels hold one job each. There are no grids of equal cards anywhere on the page.

### Inputs / Fields
- **Style:** 50 px tall, 6 px corners, a 4% text wash with a strong hairline ring, 16 px text, labels above at 15 px 500. Selects use a drawn chevron in secondary grey; the textarea starts at 120 px.
- **Focus:** a 2 px lime outline 2 px out, the inset ring turns lime, the wash rises to 6%.
- **Error:** a 1.5 px urgent ring and a 14 px urgent message with an outlined alert icon under the field; it clears as the person types.
- **Status after send:** sent in routine green with a check, probably sent in review amber, failed in urgent coral, each with a sentence and, when needed, a copyable textarea.

### Navigation
- **Header:** transparent over the hero, then 90% scan-black with blur and a bottom hairline after 24 px of scroll. Logo mark (a ring with a lime horizon line and a pupil) beside the lowercase wordmark.
- **Links:** 15 px secondary grey, 44 px hit height, 12 px side padding; hover and the section in view turn instrument white. No underlines, no arrows.
- **Mobile:** a Menu button (6 px, 5% wash, ring) toggles to Close and drops a panel of 26 px 500 links in 56 px rows divided by hairlines; it fades and slides 6 px in 200 ms, out in 120 ms, and closes on Escape, outside click or link choice. Without JavaScript the links wrap inline.

### Model's view switch
- **Style:** a 44 px control with 6 px corners, a 5% wash and a ring, holding a 34 by 20 px track (4 px corners) and a 14 px knob (2 px corners).
- **States:** off is a dark grey track with a white knob; on is a lime track with a lime-ink knob moved 14 px over 220 ms. It uses aria-pressed.

### Detail rows
Full-width row buttons that add one patient detail at a time in the case scene.
- **Style:** 52 px rows (46 px pinned) divided by hairlines, an 18 px tick box with 4 px corners and a 1.5 px ring, the detail at left and its value at right in tabular figures.
- **States:** muted until given; given rows turn instrument white with a lime tick and a lime-ink check; the current step carries a 5% lime wash.

### 17-number strip
The exact inputs the model's patient branch reads, one cell each.
- **Style:** 17 equal cells, 3 px apart, 26 px tall, 2 px corners, a 3% wash and a hairline ring. Each holds a bar that grows from the bottom by its value.
- **States:** bars are teal; cells that changed at this step get a lime ring and a lime bar. Bars move in 560 ms on the in-out curve. Hovering a cell names it and shows its value in the strip's header.

### Score tracks
- **Style:** class name at left, value at right (32 px, 500, tabular), a 6 px track under both with 3 px ends, a 6% wash.
- **Fill:** neutral at 28% white; only the leading class takes the verdict's color (urgent or review). Fills scale from the left in 600 ms on the in-out curve while the number counts to its new value.
- **Cutoff:** a 2 px instrument-white tick at the cutoff on the melanoma track, with a 13 px muted note under it.

### Verdict
- **Style:** a hairline above, a 12 px status shape, the suggestion in the verdict style and its triage color, and the reason under it in secondary grey.
- **Shape by tone:** urgent is a solid dot; review is a ring half filled from the left. The shape differs so the tone never relies on color alone.
- **Change:** the old verdict blurs out in 120 ms and the new one blurs in over 260 ms. The region is polite live.

### Icon arrays
- **Style:** 200 dots in 20 columns with 5 px gaps, up to 440 px wide. A filled instrument-white dot is a hit; a 1.5 px muted ring is a miss. A key under each grid names both.
- **Motion:** on first view the dots fill column by column like a scan line passing, each fading and scaling up from 0.3 in 320 ms, 34 ms apart per column and 6 ms per row, while the count above tweens up over 1400 ms. Reduced motion shows the finished grid.

### Toast
- **Style:** fixed at the bottom left on the side margin, up to 440 px wide, 10 px corners, 94% raised black with a 10 px blur, ring and overlay drop. A 18 px 500 title in white, 15 px body in secondary grey.
- **Behavior:** rises 10 px and fades in over 240 ms, out in 160 ms; closes on Escape or after a few seconds. It is used only for the easter eggs.

### The scan layer (signature)
One fixed WebGL canvas behind all content, pointer-events off, device pixel ratio capped at 1.5.
- **Everywhere:** a faint per-pixel speckle and a slow dermal-fibre pattern, nearly invisible at rest. Within about 230 px of the pointer the speckle brightens and shifts from cool white to teal. Typing "scan" widens the light by 220 px.
- **Hero band:** an illustrated skin cross-section (an amber-bright surface line, epidermis, the junction, dermis falling off with depth, one lesion with nests) drawn on the scan LUT, ground to deep teal to teal to amber to near-white. Left of a 2 px lime scan line it is acquired at full strength with a short lime trail; right of it, a 20% ghost unless the pointer lights it. The line follows the pointer across the hero. Where the pointer rests for 300 ms, an attention bloom gathers on the attention ramp, inside the tissue only. The band fades out over its last 110 px. It is labelled "Illustration of a skin cross-section" with a ramp key, and carries the research-stage note.
- **Privacy band:** the same tissue drawn only up to a lime edge line at 62% of the width; nothing exists past it.
- **Redraw:** still until something changes. The frame loop runs only while pointer, light, scan line, width or bloom are easing toward their targets, and stops when they settle. It wakes on pointer move, pointer leave, a tap on the band, resize, and scroll while a band is on screen (plus one frame as it leaves). Touch pointer moves are ignored; a tap sets the line and the bloom.
- **Fallbacks:** without WebGL the canvas is removed and each band shows a static gradient of amber surface into teal. With reduced motion every value jumps to its target.

### Model maps
The colored layers on the specimens and the case are the research model's own final 12 x 12 feature maps, weighted by its attention module, one per photo. They are not illustrations and are never retouched.
- **Scaling:** each map is normalized to its own photo (per-photo percentile scaling, a light 3 x 3 smoothing, then divided by its maximum), so a ramp position means "high for this photo", not an absolute score.
- **Cropping:** the page shows the centre square of each photo, so each map is cropped by the same offsets before it is sampled, then interpolated smoothly and feathered over the outer 8% of the square.
- **Specimen tiles:** the photo's own luminance, contrast-stretched to its range, is drawn on the scan LUT as teal speckle, and the attention ramp is blended over it where the response passes 30%. The pointer develops the real photo through a radial mask (124 px, 36 px feather, 520 ms); on touch the tile in the middle of the screen opens to 460 px, and a tap toggles it. The case specimen's class name is the only one set apart.
- **Case lens:** the photo is shown dimmed and mostly desaturated, and the map is screen-blended over it as light on the attention ramp with thin lime contour lines at 45, 65 and 85% response. The Model's view switch removes it and returns the photo to full color. The page states that this layer comes from the photo alone and does not change between steps.
- **Legend:** a 120 by 6 px ramp key with a plain label ("Where the model's image branch responds most", "Low to high response").

### Depth ruler (signature)
A fixed millimetre scale at the left edge, 18 px in, from below the header to 32 px above the bottom, shown from 1180 px wide.
- **Scale:** minor ticks every 5% (8 px, strong hairline), major ticks every 25% (14 px, 32% white).
- **Mark:** an 18 by 2 px lime bar that moves with scroll progress; from 1560 px a 12 px readout beside it counts from 0.00 mm at the top of the page to 2.00 mm at the bottom.
- It is aria-hidden and decorative in the strict sense: it restates scroll position, nothing more.

### The lens
The case photo sits in a circular clip inside a ring of 120 ticks. As the pinned scene progresses the photo comes into focus (5 px blur to clear in the first eighth) and zooms to 1.16. Each time the model rescores, a 2 px lime sweep crosses the lens in 640 ms on the in-out curve.

### Motion
- **Curves:** arrivals and settles use one ease-out curve, `cubic-bezier(0.23, 1, 0.32, 1)` (--ease). Values and sweeps that travel between two known states (score fills, the strip's bars, the lens sweep, the intro reveal and its line, number tweens) use a symmetric in-out, `cubic-bezier(0.65, 0, 0.35, 1)` (--ease-io). Color-only hover changes use plain ease. The intro's flight to the header has its own move curve.
- **Durations:** 120 to 160 ms for presses, hovers and color; 200 to 240 ms for the switch, menu, toast and FAQ disclosure; 400 to 640 ms for develops, swaps, fills and sweeps; 700 ms for the hero entrance; 1400 ms for counters.
- **Properties:** transform, opacity, clip-path, mask and filter. The scan's own animation is per-frame easing toward a target, normalized to frame rate.
- **Intro:** once per visit. A lime scan line crosses the mark and the lowercase wordmark as a clip reveals them (900 ms), then the lockup flies into the header (720 ms) while the black ground fades. The hero's text rises 18 px out of a 6 px blur in 700 ms with a 90 ms stagger, the hero's scan line sweeps in once, and attention gathers on the lesion. Any key, click, wheel or touch skips it; reduced motion skips it entirely.
- **Statement:** the privacy headline's words come into focus one by one with scroll (16% opacity and 10 px blur to clear).
- **Reduced motion:** all transitions and animations drop to zero; every scene shows its final, readable state.

## Do's and Don'ts

### Do:
- **Do** keep every section on scan-black (#05080A) and separate sections with section padding (clamp 120 to 176 px) and hairlines.
- **Do** reserve lime for what acts or is live: buttons, focus, selection, link hover, the scan line, the ruler mark, the current step, given ticks, changed cells and the lead evidence figure.
- **Do** put urgent, review and routine only beside the words they stand for, and give the verdict a shape that differs by tone (solid dot, half-filled ring).
- **Do** draw edges as 1 px inset rings at 8% or 15% of the text color, and use raised black (#0A1013) for wells and panels.
- **Do** label any drawn scan that is not data as an illustration, and say plainly when a layer is computed by the research model.
- **Do** crop and scale each model map exactly like the photo under it, normalized per photo, and recompute the maps if the model changes.
- **Do** set everything in Host Grotesk at 400 and 500 (600 only for the wordmark), sentence case, tabular figures, tightening tracking as size grows.
- **Do** keep the scan still until the pointer lights it, and redraw only on pointer, scroll and resize.
- **Do** give every motion a reason (acquire, develop, rescore, settle) and a reduced-motion state that shows the final frame.
- **Do** keep pressable targets at least 44 px tall on touch layouts, and keep muted text at or above 4.5:1 on the surface it sits on.

### Don't:
- **Don't** use violet, lavender, indigo or purple anywhere in the system; real photos keep their own color.
- **Don't** change a section's background color or add colored bands; the cross-sections are light drawn on the same ground.
- **Don't** set labels in all caps or letterspaced caps, and don't put eyebrow labels over headings.
- **Don't** use italics or any monospace face; the ASCII footer draws Host Grotesk characters on a grid.
- **Don't** add glows as decoration: no colored box-shadow halos, text shadows, neon outlines or blurred color blobs. Light appears only where the pointer is or where the model responds.
- **Don't** use lime as a second brand color, a large fill, or emphasis on static text such as role labels or bullets.
- **Don't** use teal, amber or the attention ramp for UI chrome; they are scan material and model data.
- **Don't** let anything move on its own after the intro: no loops, drifting backgrounds, autoplay or pulsing elements (the spinner while the form sends is the one exception).
- **Don't** round controls into pills, cut corners, or use hard offset shadows; nothing above 10 px except the phone's physical body.
- **Don't** put a lesion photo in the first viewport; the hero shows only the illustrated cross-section.
- **Don't** build rows of equal cards or a white, clinical-blue medical template look.
