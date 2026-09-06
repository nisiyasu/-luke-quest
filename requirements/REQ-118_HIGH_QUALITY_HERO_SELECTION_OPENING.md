# REQ-118 — HIGH-QUALITY HERO SELECTION OPENING

- ID: `REQ-118`
- TITLE: `High-Quality Hero Selection Opening / Playable Prologue`
- PRIORITY: `P1`
- STATUS: `READY`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / STORY / OPENING / TUTORIAL / PRESENTATION`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_AUTHORITY: `DIRECT / APPROVED OPENING FLOW`
- STORY_AUTHORITY: `STORY_CANON.md / OPENING CONFIRMED`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

---

## 0. OWNER INTENT

LUKE QUEST currently needs a strong story-facing opening rather than beginning as a thin functional prototype.

Build a polished, playable JRPG opening that immediately establishes:

- Luke's natural, unmotivated personality and hidden capability;
- Leon's lifelong hero expectation, effort and anxiety;
- Eleanor's public identity as the woman who has long claimed she gave birth to the hero;
- the social assumption that Leon will be chosen;
- Luke and Leon's school-era contrast;
- the hero-selection ceremony;
- the abnormal crystal response to Luke;
- Leon's disappearance;
- Luke's first mission to retrieve Leon;
- a clean transition into the already-existing Chapter 1 gameplay.

This Opening is not a text dump. It must feel like the beginning of a finished commercial-style 2D JRPG: playable exploration, short cinematic beats, environmental storytelling, battle tutorial, sound/presentation polish and a strong title/Chapter 1 handoff.

Do not imitate or reproduce any specific copyrighted game's maps, sprites, dialogue, music or cinematics. The quality target is original late-16-bit / early-32-bit-era JRPG richness, pacing and readability.

---

## 1. MANDATORY FRESH AUDIT BEFORE IMPLEMENTATION

Before changing implementation files, fresh-read and inspect at least:

1. repository metadata / actual default branch / HEAD;
2. `AUTONOMOUS_DEV_DIRECTIVE.md`;
3. `STORY_CANON.md`;
4. `WORK_MANAGER.md`;
5. `WORK_QUEUE.md`;
6. `CURRENT.md`;
7. existing title / NEW GAME / CONTINUE bootstrap flow;
8. any current intro/prologue logic if it exists;
9. canonical world/map registration and transition authority;
10. canonical dialogue/event systems;
11. canonical battle flow and tutorial-safe entry points;
12. existing Luke field sprite / dialogue art authorities;
13. existing Eleanor / Leon / NPC presentation assets or placeholders;
14. save/autosave bootstrap and migration rules;
15. iPhone fullscreen / unified touch authorities REQ-021 / REQ-022 / REQ-001;
16. existing audio, fade, area-title, ambient and transition presentation systems.

Do not blindly replace the title/newGame path. Recover actual current behavior first.

If a pre-existing opening already implements part of this canon, preserve compatible work and extend/repair it instead of duplicating it.

---

## 2. STORY CANON BOUNDARY

The exact approved Opening beats are stored in `STORY_CANON.md` under `OPENING / PROLOGUE — CONFIRMED`.

Implementation may add micro-dialogue, staging, camera timing, NPC flavor, animation timing and non-material tutorial wording where needed, but may NOT autonomously change the protected story meaning.

### Must remain true

- Leon is Eleanor's son.
- Eleanor has publicly acted as though Leon is the future hero and has long boasted that she gave birth to the hero.
- Leon is very capable and hard-working but not uniquely best at everything.
- Luke is usually unmotivated but has beaten Leon in school combat.
- Leon fears the hero crystal may not respond to him.
- Leon disappears before his hero-selection turn is completed.
- Luke receives the abnormal crystal response and is selected instead.
- Luke's first mission becomes retrieving Leon from the monster-forest direction.

### Must NOT be revealed in the Opening

- Glenn is Luke's uncle.
- Luke's father's complete identity/history.
- Elysia's complete past.
- Eleanor's full betrayal/crime.
- the complete Demon King / prior royal succession history.
- the full reason Luke's crystal reaction is abnormal.
- later Chapter 1 sister-interruption details.
- any Chapter 2 plot.

Foreshadowing is allowed; direct explanation is not.

---

## 3. OPENING STRUCTURE

### CHECKPOINT A — Cold Open / Aldia Morning

Build a polished cold open:

- black/fade opening;
- distant bell or existing safe atmospheric audio;
- short thematic text: `勇者は、選ばれる。` may be used;
- transition into Aldia on hero-selection morning;
- visible celebration / flags / crowds / temple-bound townspeople using existing or original lightweight presentation assets;
- NPC dialogue naturally establishes the assumption that Leon will be chosen;
- NPC dialogue may establish Eleanor's public reputation as the mother of the future hero.

Avoid lore dump narration.

Acceptance:

- player immediately understands this is a special public event;
- Leon is socially perceived as the obvious hero candidate;
- no protected truth is spoiled;
- mobile view remains readable and playable.

---

### CHECKPOINT B — Luke Introduction / Playable Aldia Walk

Introduce Luke with his natural personality.

Preferred direction:

- late / sleepy / underprepared;
- reactions such as `今日でしたっけ` / `僕も候補なんですか` in spirit, not necessarily exact wording;
- no heroic swagger;
- player takes control and walks toward the ceremony location.

Use this as an invisible tutorial for:

- movement;
- short-tap Action;
- NPC talk;
- Examine;
- basic interaction readability.

Do not create a giant tutorial panel if the existing first-touch coach and tap-first systems can teach the controls naturally.

Acceptance:

- Luke's personality is clear through behavior, not exposition alone;
- tutorial integrates with existing REQ-021/022/001 authority rather than creating another input system;
- normal world controls remain canonical.

---

### CHECKPOINT C — School Training Flashback / Battle Tutorial

Trigger a short, natural memory around a training ground, school landmark or equivalent story cue.

Flashback content:

- Leon trains seriously;
- Luke treats the exercise casually;
- the player participates in a short Luke-vs-Leon mock battle or equivalent interactive combat tutorial;
- Luke wins;
- Luke does not gloat;
- Leon's frustration is visible;
- a small final beat leaves the first hint that Leon cannot accept why Luke can beat him.

This is the preferred battle tutorial authority for a fresh NEW GAME if it can be integrated safely.

Do not permanently damage, reward, level or mutate the main save from a tutorial battle unless deliberately normalized back to the approved starting state.

Acceptance:

- teaches core battle interaction without making Leon a villain;
- Luke's victory is canonically clear;
- battle state cannot leak into present-day world state;
- save state remains deterministic.

---

### CHECKPOINT D — Leon Private Anxiety Scene

Show a brief Leon-side scene before the ceremony.

Environmental storytelling should include some combination of:

- sword / magic books / training records;
- prizes showing repeated excellence but not absolute dominance;
- examples such as second-place / runner-up / excellence awards where visually practical;
- hero-crystal research material;
- remembered pressure from Eleanor / family expectations.

Core emotional beat:

Leon fears: `もし、光らなかったら？`

Do not turn this into a long monologue.

Do not explicitly show every detail of his escape if ceremony absence will produce a stronger reveal.

Acceptance:

- player understands Leon's pressure before judging him;
- his later Chapter 1 breakdown is seeded;
- no protected late-game truth is exposed.

---

### CHECKPOINT E — Hero Selection Ceremony

This is a major Opening production-value scene.

Required story beats:

- public formal ceremony;
- Eleanor appears publicly confident and respected;
- Leon's name is called;
- Leon is absent;
- crowd reaction / silence / confusion;
- Eleanor briefly reacts but publicly regains composure;
- ceremony continues;
- Luke is eventually called.

Use existing dialogue/fade/audio/camera/title authorities where possible rather than building incompatible duplicate systems.

Acceptance:

- ceremony feels meaningfully larger than ordinary NPC dialogue;
- stage remains readable on 390x844 mobile;
- event progression cannot deadlock if player taps rapidly.

---

### CHECKPOINT F — Abnormal Crystal Reaction

Luke touches the hero crystal.

The crystal reaction must be the Opening's strongest visual/audio moment.

Preferred presentation:

- brief apparent non-response or pause;
- sudden abnormal surge;
- strong white/blue/gold light language;
- subtle unexplained dark/alien pulse may appear very briefly;
- screen/environment reaction without obscuring controls permanently;
- restrained shake only if motion-safe;
- Eleanor visibly shocked;
- optional very short distant Glenn reaction shot or equivalent foreshadowing.

Do NOT explain the reason.

Support `prefers-reduced-motion` or equivalent existing motion-safety behavior.

Acceptance:

- unmistakably more than a normal successful hero selection;
- no seizure-like uncontrolled flashing;
- mobile GPU/performance remains practical;
- no gameplay/input state gets stuck after the effect.

---

### CHECKPOINT G — Luke Selected / Tone Release

After the dramatic pause, Luke is recognized as the hero.

Luke's response should preserve his natural comedy, e.g. the spirit of:

`……え、僕ですか？`

The joke should release tension without destroying the emotional significance of the scene.

Eleanor publicly congratulates Luke and remains outwardly benevolent.

A short private/publicly-unseen beat may show Eleanor looking at the crystal and thinking/saying the equivalent of:

`……なぜ？`

No further explanation.

---

### CHECKPOINT H — Leon Missing / First Mission

Immediately after or near the end of the ceremony:

- report arrives that Leon left Aldia;
- traces point toward the monster forest;
- Luke is assigned the first mission: retrieve Leon;
- Luke may react with the natural-comedy spirit of `勇者って人探しもするんですね`;
- guide player toward the existing Chapter 1 route.

Opening should finish with a strong departure image:

- Aldia gate / northern route / distant forest;
- original `LUKE QUEST` logo/title treatment;
- optional Chapter 1 title card;
- transition into the existing playable route without a loading dead end.

Do not invent Chapter 2 or extend Leon farther north than current approved Chapter 1 bounds.

---

## 4. PRESENTATION QUALITY BAR

The Opening must not feel like a debug sequence.

Expected techniques where compatible with current engine:

- camera framing / subtle focus;
- fades / scene transitions;
- environmental animation;
- area/title cards;
- existing original ambient music and sound feedback;
- NPC staging;
- interaction prompts matching Tap-first UX;
- character foot shadows / visual-richness systems from REQ-117 if already implemented when this work executes;
- readable dialogue pacing;
- occasional controlled pause/silence;
- clear visual hierarchy during the crystal scene.

Avoid:

- walls of text;
- instant teleport chains with no staging;
- raw debug labels;
- giant permanent tutorial overlays;
- copyrighted music/art or direct recreation of another game's cinematic composition.

---

## 5. SAVE / NEW GAME / CONTINUE SAFETY

This is mandatory.

### Fresh NEW GAME

A fresh NEW GAME should enter the new Opening unless actual existing architecture provides a safer equivalent entry.

### Existing saves

Existing saves that have already progressed beyond the Opening must NOT be forced backward through it.

### Migration

If a new opening-complete/prologue state is needed:

- use a minimal canonical state/flag;
- old progressed saves must infer or migrate safely to Opening-complete where appropriate;
- imported/manual/cross-browser saves must remain valid;
- no false Continue regressions;
- do not break REQ-060+ save-transfer authorities.

### Skip / replay

A skip or replay feature is optional, not required for first delivery.

If added:

- skipping must land in a valid canonical start-of-Chapter-1 state;
- no required flags/items/tutorial normalization may be missing;
- replay must not corrupt current progressed save.

---

## 6. INPUT / MOBILE SAFETY

Protect all current P0 authorities:

- REQ-021 Tap Anywhere Action;
- REQ-022 iPhone Fullscreen World UI;
- REQ-001 Dynamic Touch Controller.

Opening cutscenes/dialogue must correctly stop movement and clean pointer ownership where existing canonical systems require it.

Do not add a competing pointer/touch controller.

Rapid tap / pointercancel / app hide-show / orientation changes must not leave the Opening softlocked.

---

## 7. IMPLEMENTATION STRATEGY

Do not attempt the entire Opening as one unreviewable mega-write if safe checkpoints are available.

Preferred delivery:

1. `A+B` cold open + Luke playable Aldia route;
2. `C` flashback/tutorial battle;
3. `D+E` Leon anxiety + ceremony staging;
4. `F+G` crystal climax + hero recognition;
5. `H` escape report + Chapter 1 handoff;
6. end-to-end save/mobile/regression hardening.

Each checkpoint must leave HEAD playable and recoverable.

A checkpoint commit is not a stop condition for the autonomous loop.

---

## 8. REQUIRED AUTOMATED VERIFICATION

Before promotion to VERIFY, run or create appropriate tests for:

- JavaScript syntax / addon validation;
- assembled browser boot;
- fresh NEW GAME enters Opening;
- present-day/flashback transition correctness;
- tutorial battle returns to deterministic story state;
- hero ceremony progression;
- rapid-dialogue taps do not duplicate event transitions;
- crystal sequence exits cleanly;
- Chapter 1 handoff reaches the correct playable state;
- existing progressed save bypasses Opening safely;
- save/load round-trip;
- imported save compatibility where relevant;
- 390x844 touch/fullscreen smoke;
- REQ-021/022/001 regressions;
- PWA/static guards;
- Pages deployment SUCCESS.

Do not claim physical iPhone PASS from CI.

---

## 9. COMPLETION CONDITIONS

REQ-118 may move to `VERIFY` only when:

- approved Opening beats A-H are playable end-to-end;
- the Opening visibly/presentationally feels materially above the old functional start;
- Luke / Leon / Eleanor characterization matches Story Canon;
- the school mock battle is implemented or an equally interactive Owner-canon-compatible version fulfills the same role;
- the hero-selection crystal scene has a polished abnormal-reaction climax;
- new-game and existing-save paths are both safe;
- Chapter 1 handoff is functional;
- no protected reveal is leaked;
- P0 touch/fullscreen behavior is preserved;
- automated gates pass;
- Pages deployment succeeds;
- `IOS_PHYSICAL_VERIFICATION` remains `PENDING` until Owner confirms actual-device feel/visuals.

---

## 10. DO NOT

- Do not invent Chapter 2.
- Do not reveal protected family/Demon King truths.
- Do not turn Eleanor openly evil in the Opening.
- Do not make Leon a cartoon villain.
- Do not make Luke suddenly heroic/serious in a way that breaks his natural personality.
- Do not replace approved Luke art with lower-quality placeholders merely to finish quickly.
- Do not add a new input authority.
- Do not regress existing saves.
- Do not extend the generic north-pursuit route.
- Do not copy a copyrighted game's art, map, music, text or exact cinematic staging.

EOF
