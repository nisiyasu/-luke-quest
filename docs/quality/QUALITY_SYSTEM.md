# LUKE QUEST QUALITY SYSTEM v1.0

STATUS: ACTIVE / REQ-143 VERIFY / OWNER_EXPERIENCE_PASS=PENDING
ROLE: Canonical player-experience quality authority for material player-visible work.

## 1. Core Rule

`FUNCTIONAL_COMPLETE != QUALITY_COMPLETE`.

A feature may work, persist, pass CI and deploy successfully while still being too weak as a game experience.

Quality review therefore evaluates the experience produced by the implementation, not only the existence of implementation.

## 2. Quality Levels

- `Q1 ROUTINE`: ordinary prop/NPC utility interaction/minor feedback.
- `Q2 NORMAL`: normal event, discovery, standard encounter presentation.
- `Q3 IMPORTANT`: meaningful reveal, major location arrival, important character beat.
- `Q4 MAJOR`: core confrontation, reversal, emotionally important sequence.
- `Q5 CLIMAX`: chapter climax, boss/finale, chapter-defining sequence.

Use the lowest level that honestly matches the work. Do not inflate routine content into cinematic bureaucracy.

## 3. Pre-Implementation Contract

For Q1-Q2, identify intent and relevant existing pattern.

For Q3-Q5, define before coding:

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

If these cannot be stated coherently, implementation is premature.

## 4. Multi-Channel Design

Available channels:

- dialogue
- actor movement/facing/pose
- framing/camera/focus
- music
- SFX
- silence
- timing/pause
- transition/fade
- environmental response
- UI suppression/emphasis
- player-control state
- battle feedback
- persistent aftermath

Use channels because they serve the scene purpose. More channels are not automatically better.

## 5. Quality Gates

For material player-visible work evaluate:

- `FUNCTIONAL_PASS`: mechanics/state/progression are correct.
- `VISUAL_PASS`: hierarchy, legibility, composition and art treatment fit importance.
- `DIALOGUE_PASS`: text carries only what dialogue should carry; voice/personality/canon are preserved.
- `CINEMATIC_PASS`: applicable important beats are staged rather than merely described.
- `AUDIO_PASS`: sound/music/silence intentionally reinforce timing/emotion, or N/A with reason.
- `GAME_FEEL_PASS`: inputs, state changes and dramatic beats produce coherent feedback.
- `PERFORMANCE_PASS`: target iPhone constraints protected.
- `REGRESSION_PASS`: protected input/save/story/runtime authorities remain healthy.
- `OWNER_EXPERIENCE_PASS`: required when physical/subjective approval is part of acceptance; never infer from CI.

## 6. Adversarial Review

Q3-Q5 review must ask:

1. Would this look materially different from an ordinary NPC dialogue?
2. Is an important action merely described in text when it can be staged safely?
3. Are actors static during an emotionally physical beat?
4. Does the player know where to look?
5. Does timing create anticipation, impact or aftermath instead of instant state replacement?
6. Is audio/silence meaningful rather than decorative?
7. Does the world/game state visibly acknowledge what happened?
8. Could names be swapped and the same generic scene still work unchanged?
9. Is spectacle covering weak dramatic structure?
10. Is the scene longer without becoming stronger?
11. Does the presentation preserve responsive input and physical iPhone stability?

Material YES answers trigger refinement before Quality Complete.

## 7. Gold Standard Rule

A Gold Standard is a proven LUKE QUEST implementation plus its scene design and explanation. It is not a mood board.

Future agents should be able to inspect:

- why the scene exists;
- how beats are sequenced;
- which primitives are reused;
- why each presentation channel is present;
- what was intentionally omitted;
- what automated gates protect it;
- what physical/Owner verification remains.

First candidate: REQ-128 Leon confrontation after REQ-143 rebuild.

## 8. Concrete Pattern Rule

When a repeated high-value behavior becomes proven, preserve a small reusable primitive/pattern rather than relying on prose alone.

Preferred categories:

- control lock/unlock cleanup;
- beat sequencing/wait;
- actor movement/facing;
- lightweight focus/camera shift;
- music fade/sting/silence;
- scene checkpoints;
- safe transition cleanup.

Do not create parallel canonical input/save/render/battle systems.

## 9. Performance Is Quality

Target: iPhone browser/PWA.

High-risk presentation mechanisms include stacked blur/filter effects, large persistent shadows, many composited fullscreen layers, permanent `will-change`, unbounded particles, unnecessary large assets, persistent invisible animation and overlapping fixed overlays.

Prefer dramatic composition, sprite movement, framing, timing, color, controlled visibility and audio over expensive effects.

Desktop/CI success never proves physical iPhone quality.

## 10. No Fake Quality

Do not equate quality with:

- longer dialogue;
- more particles;
- more animation;
- more screen shake;
- more filters;
- more SFX;
- more delays;
- more framework/documentation.

Quality means the smallest coherent set of mechanics/presentation choices that produces the intended player experience reliably.

## 11. Research Authority

External basis lives in `docs/quality/QUALITY_RESEARCH_BASIS.md`.

Research-derived claims must remain separable from LUKE QUEST design decisions. Do not use famous games as unquestionable authority and do not copy protected expression.

## 12. Current Gold-Standard Pilot

REQ-128 Leon confrontation is Q5 and currently `OWNER_QUALITY_RESULT: FAIL` despite functional machine success.

REQ-143 owns its quality rebuild. The rebuild must preserve Chapter 1 canon, nonlethal confrontation semantics, unnamed sister, no Chapter 2 invention, save compatibility, P0 touch/fullscreen/input behavior and iPhone safety.

## 13. Autonomous Development Integration

When future player-visible work is selected:

1. identify Quality Level;
2. load this file;
3. load relevant Gold Standard/pattern if one exists;
4. define intent/scene design at the required depth;
5. implement;
6. verify function;
7. run quality/adversarial review;
8. refine material weaknesses;
9. run regression/performance/public gates;
10. retain Owner physical/subjective verification as PENDING where applicable.

The purpose is better game output, not more paperwork.

EOF
