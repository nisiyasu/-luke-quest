# LEON GOLD STANDARD SCENE DESIGN v1.0

STATUS: DESIGN_READY / IMPLEMENTATION_PENDING
QUALITY_LEVEL: Q5 CLIMAX
SOURCE_REQUIREMENT: REQ-128
QUALITY_REBUILD_REQUIREMENT: REQ-143

## 1. SCENE PURPOSE

Pay off the entire Chapter 1 pursuit by making Leon's collapse understandable, dangerous and tragic without turning him into a villain, while demonstrating Luke's defining strength: he is reluctant and frightened, but when someone is truly in danger he acts to protect rather than condemn.

The scene must leave the player remembering the encounter, not merely remembering that several dialogue boxes appeared.

## 2. PLAYER EMOTION TARGET

Primary arc:

`arrival relief -> unease -> painful revelation -> escalating instability -> defensive tension -> shock -> sudden silence/guilt -> urgent compassion -> exhausted return`

The scene should not feel triumphant. The chapter closes with emotional weight and unresolved consequences.

## 3. START STATE

- Player reaches the existing Wind Stair Ridge north climax boundary.
- Chapter 1 pursuit is still active.
- Leon does not yet know Luke was chosen as Hero.
- Luke is not seeking combat.
- Sister interruption has not occurred.

## 4. END STATE

- Leon knows Luke was chosen.
- Nonlethal confrontation has ended.
- Leon's sister has been accidentally wounded but is explicitly alive/nonfatal.
- Leon recognizes what he has done.
- Luke prioritizes helping her.
- Group returns to Aldia.
- Chapter 1 is complete.
- Chapter 2 remains undefined.

## 5. VISUAL LANGUAGE

Do not replace the world with a generic flat card as the default staging language.

Prefer the existing Wind Stair Ridge environment as the dramatic stage where technically safe.

Visual hierarchy:

1. ridge/environment establishes isolation and wind;
2. Leon is revealed as the visual focus;
3. Luke and Leon occupy opposing readable positions;
4. during defensive phase, distance/composition changes communicate escalation;
5. sister enters physically into the space between them;
6. impact is readable without graphic injury;
7. immediate post-impact composition collapses from confrontation geometry into aid/guilt geometry.

Do not use emoji stand-ins as final Q5 actor presentation.

## 6. CHARACTER ACTING

### Luke

- approaches cautiously rather than heroically posing;
- does not draw/attack as first intent;
- visible hesitation before revealing he was chosen;
- defensive movement during Leon's attacks;
- after sister is wounded, immediately shifts attention to her.

### Leon

- begins controlled but withdrawn;
- visibly stiffens after Hero revelation;
- facing/movement becomes less controlled as lines escalate;
- the attack should feel like emotional loss of control, not calculated murder;
- after sister impact, movement stops abruptly and posture/facing changes to shock.

### Leon's Sister

- enters physically during the escalation, not via narration only;
- her intervention must be visible and causally understandable;
- injury presentation remains non-graphic and nonfatal.

## 7. CAMERA / FOCUS

Use lightweight 2D focus techniques only.

Candidate beat language:

- arrival: normal world framing;
- Leon reveal: short controlled focus shift/pan or actor emphasis;
- Hero revelation: hold framing rather than immediate next-line churn;
- escalation: subtle tightening/relative placement, not expensive filter stacks;
- sister entry: focus follows the entering actor/center conflict space;
- impact: brief restrained hit feedback + immediate visual stillness;
- aftermath: stable framing with Luke/sister as focus and Leon slightly displaced.

No permanent `will-change`, stacked blur or heavy full-screen compositor effects.

## 8. AUDIO

Use existing safe audio authority where available.

Desired logic:

- arrival: retain environmental wind/ambience;
- pre-revelation: avoid unnecessary musical clutter;
- Hero revelation: controlled music reduction/sting or deliberate pause if available;
- escalation: reinforce tension without continuous loud effects;
- sister impact: one readable restrained impact cue, then a short silence/ambient-only beat;
- aftermath: avoid celebratory victory framing;
- chapter end: distinct closure cue only if safe/original authority exists.

If no safe reusable audio exists for a beat, silence is preferable to arbitrary stock-like noise.

## 9. PLAYER CONTROL

- world movement stops safely when climax begins;
- no stale pointer ownership/movement timer survives transition;
- dialogue advancement uses existing canonical interaction authority where possible;
- defensive confrontation remains interactive and explicitly nonlethal;
- confrontation choices must feel like defensive intent rather than normal damage menu;
- control returns only after safe transition to post-chapter world state.

Protect REQ-021, REQ-022 and REQ-001.

## 10. DIALOGUE ROLE

Dialogue should communicate what cannot be communicated through staging alone:

- Leon's identity collapse and pressure;
- Luke's reluctant/non-hostile intent;
- explicit aid priority after injury;
- nonfatal status without awkward medical exposition if presentation can convey stability.

Reduce narration that describes visible physical actions after those actions become actually staged.

Do not lengthen dialogue simply to appear cinematic.

## 11. BEATS

### BEAT 1 — ARRIVAL / REVEAL

Player crosses canonical threshold.
Movement safely locks.
Wind/ridge remains visible.
Leon is revealed at distance with a small intentional pause before dialogue.

Goal: pay off the chase spatially.

### BEAT 2 — ATTEMPT TO BRING HIM HOME

Luke approaches/addresses Leon.
Leon remains turned away or visually withdrawn before responding.

Goal: show that this begins as retrieval, not combat.

### BEAT 3 — HERO REVELATION

Luke reluctantly tells Leon that selection is over and Luke was chosen.
After the key line, hold a short readable pause before Leon responds.
Leon posture/facing changes before his emotional dialogue continues.

Goal: make the revelation land before explanation begins.

### BEAT 4 — COLLAPSE / DRAW

Leon crosses from verbal hurt into physical instability.
A visible draw/advance/facing change happens before the defensive confrontation begins.
Luke visibly does not answer with an offensive stance.

Goal: make the mechanical phase emerge from the drama.

### BEAT 5 — NONLETHAL DEFENSIVE CONFRONTATION

Keep the existing core idea of `身を守る` / `呼びかける`, but stage each turn with actor movement/feedback rather than only replacing text.

Turn progression should communicate:

1. sudden pressure;
2. worsening loss of control;
3. opening for interruption/de-escalation.

No EXP/G/drop/victory fanfare.

### BEAT 6 — SISTER ENTRY

Before the final dangerous motion resolves, sister runs/steps physically into the conflict space.

Goal: causal clarity. The player must see why she is struck.

### BEAT 7 — IMPACT / SILENCE

Restrained impact feedback.
No graphic injury.
Short pause/stillness.
Leon freezes.
Sister drops/changes state visibly.

Goal: shock comes from sudden consequence, not gore.

### BEAT 8 — LUKE CHOOSES AID

Luke immediately moves/focuses toward sister.
His dialogue prioritizes treatment and asks Leon to help.
Leon response is minimal and stunned.

Goal: express Luke's character through action first, words second.

### BEAT 9 — RETURN

Do not resolve the entire return only with narration if a lightweight transition can stage it.
Use a controlled fade/transition to Aldia and a brief receiving tableau with Eleanor outwardly benevolent.

No hidden Eleanor truth revealed.

### BEAT 10 — CHAPTER END

Show a distinct but lightweight chapter-end presentation.
Persist `chapter1Complete` safely.
Return to canonical world state with neutral continuation status.
Do not invent Chapter 2.

## 12. PERFORMANCE BUDGET

Q5 richness should come primarily from sequencing, composition, actor movement, art, timing and audio.

Avoid:

- backdrop blur;
- large animated filter layers;
- permanent full-screen effects;
- high particle density;
- many simultaneous shadows;
- persistent animation after the scene leaves.

Any temporary overlay must be removed deterministically.

## 13. IMPLEMENTATION STRATEGY

Before rewriting the scene, fresh-audit repository primitives for:

- actor/sprite rendering;
- current camera/world transform;
- fade/transition;
- existing audio/SFX authority;
- dialogue portraits;
- safe stopMoving/input cleanup;
- save/render lifecycle.

Reuse before creating new primitives.

If a tiny generic beat sequencer is needed, it must remain presentation-only and must not become a second canonical state/save/input system.

## 14. GOLD STANDARD ACCEPTANCE

The rebuilt scene is a Gold Standard candidate only if:

- it remains end-to-end playable;
- protected canon is unchanged;
- important physical actions are staged rather than narrated-only;
- emoji stand-ins are removed from final Q5 actor presentation;
- defensive interaction remains nonlethal and meaningful;
- audio/camera/timing are intentional, not decorative;
- iPhone performance/regression gates pass;
- Pages deploy succeeds;
- Owner plays it and determines the quality is acceptable.

Until Owner approval:

`GOLD_STANDARD_STATUS: CANDIDATE`

EOF
