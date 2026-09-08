# LUKE QUEST QUALITY RESEARCH BASIS v1.0

PURPOSE: External evidence base for LUKE QUEST player-experience quality rules.

This document separates external observations from LUKE QUEST-specific design decisions. It is not a mandate to imitate any referenced game or reproduce protected expression.

---

## SOURCE 1 — MDA Framework

SOURCE:
Robin Hunicke, Marc LeBlanc, Robert Zubek, `MDA: A Formal Approach to Game Design and Game Research`.
https://www.cs.northwestern.edu/~hunicke/MDA.pdf

OBSERVED_PATTERN:
The framework separates Mechanics, Dynamics and Aesthetics and emphasizes moving between implementation-level systems and the player experience they produce. It also emphasizes iterative qualitative and quantitative analysis because interactions among coded subsystems create complex behavior.

GENERALIZED_PRINCIPLE:
Do not judge player-visible work solely by whether the mechanic/code exists. Evaluate the dynamic behavior and intended player experience produced by the implementation, then iterate backward into implementation changes.

LIMITATION:
MDA is a general design framework. It does not specify JRPG cinematic direction or LUKE QUEST implementation details.

LUKE_QUEST_APPLICATION:
For meaningful player-visible requirements, acceptance must include both implementation correctness and experience-level quality. `FUNCTIONAL_COMPLETE` and `QUALITY_COMPLETE` remain distinct.

---

## SOURCE 2 — Game Feel / Feedback

SOURCE:
Lee Perry, Game Developer, `The single most useful advice I can give for making any game better.. feedback`.
https://www.gamedeveloper.com/design/the-single-most-useful-advice-i-can-give-for-making-any-game-better-feedback

OBSERVED_PATTERN:
The article argues that unfinished games often have a theme/mechanic but still do not feel solid, and emphasizes feedback as a broadly applicable way to improve game feel.

GENERALIZED_PRINCIPLE:
Actions and important state changes need perceptible, coherent feedback. A mechanically correct event can still feel weak when the player's input or a dramatic change does not produce strong readable audiovisual/world response.

LIMITATION:
This is practitioner advice rather than a controlled comparative study. Feedback density must be tuned to context rather than maximized.

LUKE_QUEST_APPLICATION:
Combat, exploration discoveries, important dialogue beats and scene transitions should produce deliberate feedback across suitable channels instead of silently mutating state or merely replacing text.

---

## SOURCE 3 — Immediate Input Response

SOURCE:
Game Developer coverage of PlatinumGames / NieR:Automata GDC discussion, `How Platinum designed and tuned Nier: Automata to 'feel' good`.
https://www.gamedeveloper.com/design/how-platinum-designed-and-tuned-i-nier-automata-i-to-feel-good

OBSERVED_PATTERN:
Platinum's design discussion explicitly emphasizes that button presses need immediate responsive action to avoid frustration.

GENERALIZED_PRINCIPLE:
Responsiveness is part of quality, not merely input plumbing. Presentation layers must not make basic interaction feel delayed, ambiguous or detached from player intent.

LIMITATION:
NieR:Automata is a 3D action RPG with different mechanics and production scale. The transferable principle is responsiveness, not its exact tuning or animation style.

LUKE_QUEST_APPLICATION:
REQ-021/REQ-001 touch ownership remains protected. Cinematic polish must never compromise short-tap Action, movement stop, dialogue progression or battle-command response.

---

## SOURCE 4 — Sound as Game-Feel Reinforcement

SOURCE:
Joonas Turner, GDC Europe 2015, `Oh My! That Sound Made the Game Feel Better!`.
https://gdcvault.com/play/1022843/Oh-My-That-Sound-Made

OBSERVED_PATTERN:
The session focuses on improving game feel through sound across design, production and gameplay, with an emphasis on coherence.

GENERALIZED_PRINCIPLE:
Sound should reinforce timing, action and state change rather than exist as decorative noise.

LIMITATION:
The source is a conference session overview in this research pass; detailed techniques require deeper source review before highly specific mandates are created.

LUKE_QUEST_APPLICATION:
Important beats may use music changes, SFX or silence when they clarify emotion/timing. Audio is N/A when it does not serve the scene; adding sounds merely to fill a checklist is prohibited.

---

## SOURCE 5 — Sound Can Direct Attention and Create Subtext

SOURCE:
GDC 2006, `Film and Game Sound Panel: Design Choices`.
https://gdcvault.com/play/1013331/Film-and-Game-Sound-Panel

OBSERVED_PATTERN:
The session overview describes sound as capable of creating subtext, directing attention, clarifying/misdirecting and shaping emotional perception rather than simply attaching a sound to every object.

GENERALIZED_PRINCIPLE:
Audio quality comes from intentional information/emotion design, not sound count.

LIMITATION:
Film techniques are not automatically valid in interactive scenes, and player control changes timing requirements.

LUKE_QUEST_APPLICATION:
For Q4-Q5 scenes, determine what the player should notice or feel at each beat and use audio only where it helps that purpose.

---

## SOURCE 6 — Camera and Emotional Involvement

SOURCE:
Remi Lacoste / Crystal Dynamics, GDC Europe 2013, `Creating an Emotionally Engaging Camera for Tomb Raider`.
https://gdcvault.com/play/1019367/Creating-an-Emotionally-Engaging-Camera

OBSERVED_PATTERN:
The talk's stated premise is that camera choices can increase emotional involvement and require deliberate artistic/technical design.

GENERALIZED_PRINCIPLE:
Framing is part of communication. Important reveals and confrontations should control visual focus when needed rather than leaving critical action visually equivalent to ordinary traversal.

LIMITATION:
Tomb Raider uses 3D camera systems. LUKE QUEST must adapt the principle to inexpensive 2D framing/focus without copying implementation or creating iPhone compositor pressure.

LUKE_QUEST_APPLICATION:
Prefer lightweight camera/focus primitives such as safe viewport translation, composition changes, temporary actor emphasis or restrained shake/pan where useful. Do not assume complex camera motion is mandatory.

---

## SOURCE 7 — iOS Resource Limits

SOURCE:
Apple, `Creating Compatible Web Content` / Safari on iPhone guidance.
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html

OBSERVED_PATTERN:
Apple explicitly states that desktop performance does not guarantee iOS performance and recommends minimizing unnecessary images, CSS and JavaScript and sizing resources appropriately.

GENERALIZED_PRINCIPLE:
Physical mobile constraints are part of product quality. A richer desktop presentation that is unstable on iPhone is a regression.

LIMITATION:
The document is older and references historical network/device constraints. The general warning about device-specific resource limits remains relevant, but exact limits must be verified against current target devices.

LUKE_QUEST_APPLICATION:
Every high-presentation scene must keep an explicit iPhone performance budget and use automated liveness plus Owner physical testing where required.

---

## SOURCE 8 — CSS Filters Are Resource-Intensive

SOURCE:
Apple Safari CSS Reference, `CSS Property Functions — Filter Functions`.
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariCSSRef/Articles/Functions.html

OBSERVED_PATTERN:
Apple warns that filters are resource-intensive, recommends using them sparingly, and specifically calls for testing across devices, especially when animated.

GENERALIZED_PRINCIPLE:
Visual richness must not be equated with stacked blur/filter effects.

LIMITATION:
This reference covers Safari filter behavior broadly and does not diagnose LUKE QUEST's prior black-screen root cause.

LUKE_QUEST_APPLICATION:
Blur, backdrop/filter stacking, large shadows and similar effects remain high-risk presentation tools. Prefer composition, sprite art, timing, color, movement and audio before GPU-heavy filters.

---

## CURRENT RESEARCH SYNTHESIS

The initial evidence supports a quality system built around five ideas:

1. Work backward and forward between implementation and player experience, not code-only acceptance.
2. Give actions and dramatic state changes coherent perceptible feedback.
3. Preserve immediate input responsiveness even when presentation becomes richer.
4. Use camera/audio/timing to guide attention and emotion intentionally rather than decoratively.
5. Treat iPhone physical performance as a quality gate, not a postscript.

This research basis is deliberately small and traceable. Add more sources only when they create a concrete reusable rule or resolve a design uncertainty.

EOF
