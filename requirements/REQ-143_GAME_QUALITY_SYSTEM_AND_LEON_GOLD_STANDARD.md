# REQ-143 — Game Quality System / Leon Gold Standard

- ID: `REQ-143`
- TITLE: `Game Quality System / Leon Gold Standard`
- PRIORITY: `P0`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-08 JST`
- TYPE: `QUALITY_ARCHITECTURE / PLAYER_EXPERIENCE / PRESENTATION / CONTINUOUS_DEVELOPMENT`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_DIRECT_AUTHORITY: `2026-09-08 — current Leon climax is far too weak; change the root development method so all future output is higher quality, using concrete examples/code and external references where useful.`

---

## 0. OWNER INTENT

The problem is not limited to one weak Leon scene.

The current autonomous loop can satisfy functional requirements, automated tests and Pages deployment while still producing a scene that is technically complete but experientially cheap.

The permanent objective is to change the development system so that future maps, scenes, battles, dialogue, UI, audio and story beats are designed and reviewed against explicit player-experience quality standards rather than only functional completeness.

Owner physical-play evidence is authoritative subjective evidence for player experience. The current REQ-128 Leon climax is therefore:

`OWNER_QUALITY_RESULT: FAIL`

This does not invalidate its functional/canon-safe implementation. It means `FUNCTIONAL_COMPLETE != QUALITY_COMPLETE`.

---

## 1. ABSOLUTE QUALITY PRINCIPLE

`WORKING` is not synonymous with `DONE` for player-visible work.

For material player-visible requirements, distinguish at least:

- `FUNCTIONAL_PASS`
- `VISUAL_PASS`
- `DIALOGUE_PASS`
- `CINEMATIC_PASS` when applicable
- `AUDIO_PASS` when applicable
- `GAME_FEEL_PASS`
- `PERFORMANCE_PASS`
- `REGRESSION_PASS`
- `OWNER_EXPERIENCE_PASS` when subjective/physical confirmation is required

N/A is allowed only with a reason. Do not turn this into mechanical checkbox theater.

---

## 2. RESEARCH-FIRST RULE

Before inventing quality rules, study credible external design/development material and separate:

- `SOURCE`
- `OBSERVED_PATTERN`
- `GENERALIZED_PRINCIPLE`
- `LIMITATION`
- `LUKE_QUEST_APPLICATION`

Prefer developer talks, postmortems, primary/technical references, game-design literature and direct product observation.

Do not copy protected dialogue, story text, music, art, source code or distinctive scene staging from another game. Extract reusable design principles.

---

## 3. QUALITY SSOT

Create and maintain a compact quality authority under `docs/quality/`.

Required minimum:

- `docs/quality/QUALITY_SYSTEM.md`
- `docs/quality/QUALITY_RESEARCH_BASIS.md`
- future focused standards only when concrete repeated need exists

Avoid document sprawl. One canonical parent should route to narrower standards/examples.

---

## 4. QUALITY LEVELS

Classify player-visible work by importance before implementation.

### Q1 — Routine Interaction
NPC utility line, ordinary prop, minor feedback.

### Q2 — Normal Event
Small quest beat, location discovery, regular combat presentation.

### Q3 — Important Event
Important character beat, meaningful reveal, major location arrival.

### Q4 — Major Story Beat
Core confrontation, major reversal, emotionally important scene.

### Q5 — Chapter Climax / Boss / Finale
Chapter-defining sequence whose experience must carry narrative and mechanical weight.

Higher quality level means stronger pre-design, reference comparison and adversarial review. It does not mean more particles, longer dialogue or heavier GPU effects.

REQ-128 Leon confrontation is `Q5`.

---

## 5. SCENE DESIGN BEFORE CODE

For Q3-Q5 scenes, create a compact scene design before implementation with:

- `SCENE_PURPOSE`
- `PLAYER_EMOTION_TARGET`
- `START_STATE`
- `END_STATE`
- `BEATS`
- `VISUAL_FOCUS`
- `CHARACTER_ACTING`
- `CAMERA`
- `AUDIO`
- `PLAYER_CONTROL`
- `DIALOGUE_ROLE`
- `TRANSITION_OUT`
- `PERFORMANCE_BUDGET`

The point is not paperwork. The point is to decide the intended player experience before writing event code.

---

## 6. MULTI-CHANNEL PRESENTATION

Important scenes must not dump the entire burden on a dialogue box.

Available presentation channels include:

- dialogue
- character movement/pose/facing
- camera/framing/focus
- music
- SFX
- silence
- timing/pause
- screen transition
- lighting/color shift
- environmental change
- UI suppression
- player-control state
- battle feedback
- aftermath/world-state change

Use only channels that serve the scene purpose. Do not pass by counting effects.

---

## 7. GOLD STANDARD

Create at least one real LUKE QUEST implementation that serves as a code-level quality reference.

First Gold Standard candidate: `REQ-128 Leon confrontation`.

It must include:

1. current-state audit;
2. scene design;
3. revised implementation;
4. concrete reusable patterns/primitives;
5. performance constraints;
6. automated verification;
7. adversarial quality review;
8. Owner physical/subjective verification.

The current REQ-128 implementation must not be grandfathered into Gold Standard status merely because its machine gates passed.

---

## 8. CONCRETE CODE REFERENCE RULE

Abstract prose alone is insufficient for autonomous quality reproduction.

Where LUKE QUEST has a proven implementation pattern, preserve a small concrete reference in code or a Gold Standard example so future agents can compare against actual behavior.

Prefer reusable primitives over copied scene blobs, for example:

- safe control lock/unlock
- timed beat sequencing
- actor facing/movement
- safe camera focus/pan
- audio fade/sting
- deliberate silence
- scene-state checkpoint
- safe transition cleanup

Reuse existing authorities where available. Do not create duplicate input, save, render, audio or battle authorities.

---

## 9. ADVERSARIAL QUALITY REVIEW

Q3-Q5 work must be reviewed after functional implementation from a hostile quality perspective.

Ask:

- Does this feel materially different from ordinary NPC dialogue?
- Is important information merely written instead of staged?
- Are characters visually static when their actions matter?
- Does the player know where to look?
- Is timing deliberate or just instantaneous UI replacement?
- Does audio/silence carry meaning where appropriate?
- Does the world visibly change because the event happened?
- Could the same generic implementation be pasted into an unrelated scene with only names changed?
- Is spectacle masking weak dramatic structure?
- Is the scene longer without being stronger?
- Is the implementation safe on physical iPhone constraints?

If the answer exposes a material weakness, refine before Quality Complete.

---

## 10. NO FAKE QUALITY

The following are not quality improvements by themselves:

- more words
- more CSS animations
- more particles
- more blur/drop-shadow
- stronger screen shake
- more delays
- more sound effects
- more files/frameworks

Quality means mechanics, presentation, pacing and feedback cooperate to create the intended player experience.

---

## 11. IPHONE PERFORMANCE BUDGET

LUKE QUEST is an iPhone-targeted web game. Presentation quality must respect physical mobile rendering limits.

Treat the following as high-risk until proven safe:

- large/stacked CSS filters and blur
- many composited full-screen layers
- permanent `will-change`
- large drop shadows
- unbounded particle counts
- multiple persistent overlays
- unnecessary large images/CSS/JavaScript
- animation loops that continue when invisible

A visually richer scene that reintroduces black-screen behavior is a quality regression, not an improvement.

---

## 12. REQ-128 CURRENT QUALITY GAP

Fresh code audit shows the current climax is functionally deliberate and canon-safe, but presentation is dominated by:

- a standalone card/screen replacing the normal world;
- emoji stand-ins for Luke, Leon, sister and Eleanor;
- mostly static character presentation;
- dialogue progression through a single `つづける` button;
- three defensive turns represented primarily as text plus two buttons;
- sister interruption/wound described mostly by narration rather than staged character action;
- return to Aldia described rather than experienced/staged;
- limited meaningful camera/audio/world-response orchestration.

This explains how machine acceptance could pass while Owner experience still judged the climax weak.

Do not solve this merely by lengthening dialogue.

---

## 13. FIRST IMPLEMENTATION PHASE

Phase A — build the compact Quality SSOT and research basis.

Phase B — produce `LEON_GOLD_STANDARD_SCENE_DESIGN.md` from protected Chapter 1 canon.

Phase C — inspect existing safe scene/audio/camera/actor primitives and design the smallest reusable cinematic sequencing layer needed. Do not build a giant framework.

Phase D — rebuild REQ-128 presentation as the first Gold Standard while preserving:

- all confirmed Chapter 1 canon;
- nonlethal confrontation semantics;
- sister remains unnamed;
- no Chapter 2 invention;
- save compatibility;
- REQ-021 / REQ-022 / REQ-001 input authorities;
- iPhone rendering safety.

Phase E — automated regressions + Pages + physical Owner quality verification.

Phase F — wire the Quality System into perpetual autonomous development so future player-visible requirements classify quality level and load relevant standards/examples.

---

## 14. ACCEPTANCE

REQ-143 can move to `VERIFY` only when:

- Quality SSOT exists and is concrete enough for another agent to execute;
- external research is traceable and principles are separated from source observations;
- Leon Q5 scene design exists;
- Leon implementation has been materially rebuilt, not merely reworded;
- revised scene has automated functional/regression/performance evidence;
- public Pages deployment succeeds;
- Gold Standard concrete reference is preserved;
- autonomous development is wired to consult the Quality System for future relevant work;
- `OWNER_EXPERIENCE_PASS` remains PENDING until Owner actually plays/approves it.

---

## 15. FAIL-CLOSED / DO NOT

Do not:

- invent Chapter 2;
- rename or redefine protected characters;
- copy another game's protected expression;
- create a second canonical input/save/battle authority;
- treat desktop/CI success as iPhone physical PASS;
- add expensive GPU effects simply to make a scene look premium;
- mark the Leon scene Quality Complete before Owner play evidence;
- stop at documentation if safe implementation work remains.

EOF
