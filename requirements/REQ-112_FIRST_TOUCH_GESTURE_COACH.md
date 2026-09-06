# REQ-112 — First-Touch Gesture Coach

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: MOBILE UX / INPUT DISCOVERABILITY / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD proves the canonical mobile input is already implemented and public-gated:

- short stationary touch/pen tap on the world surface = canonical `action()` exactly once;
- drag beyond the dead zone = Movement mode;
- held drag = continuous movement;
- release/cancel/blur/hidden/dialogue/map transition stop movement;
- REQ-111 now removes legacy A-only wording around interactions.

However the first-time iPhone player still has no compact world-level explanation that these two gestures share the same surface. The old fixed-D-pad hint is not a reliable discovery surface because the iPhone fullscreen design intentionally de-emphasizes fixed controls.

## 2. PURPOSE

Add a transient, non-blocking mobile gesture coach that makes the Owner's intended control model immediately discoverable without consuming permanent world viewport.

Player-visible copy:

- `短くタップ：調べる`
- `スライド：歩く`

The coach must appear only during world gameplay on coarse-pointer/mobile style environments, then disappear automatically. It must never become a permanent HUD row.

## 3. PRESENTATION

- compact overlay inside the world viewport;
- pointer-events none;
- safe-area aware;
- visually subordinate to dialogue and MENU;
- auto-hide after a short interval;
- hide immediately when dialogue, battle, menu or shop takes over;
- may reappear after a full page reload because no save-schema/persistent state is required;
- reduced-motion compatible.

## 4. INPUT SAFETY

This requirement is presentation-only.

MUST NOT:

- add pointerdown / pointermove / pointerup / pointercancel handlers;
- call `action()`;
- call `move()` / `startMoving()` / `stopMoving()`;
- change dead-zone, tap timing, pointerId ownership or explicit-control exclusions;
- mutate story/save/map/battle/shop authority;
- alter REQ-021 / REQ-022 / REQ-001 canonical behavior.

## 5. IMPLEMENTATION APPROACH

Implement as a late add-on that observes rendered world state and manages one idempotent coach node.

Use a session-local in-memory shown flag only. No localStorage or save-field additions.

## 6. ACCEPTANCE

Fail-closed assembled-browser acceptance must verify:

- world render can create exactly one coach node;
- text teaches short tap = examine and slide = walk;
- coach has pointer-events none;
- no duplicate nodes after repeated render;
- dialogue suppresses/removes the coach;
- non-world state suppresses/removes the coach;
- no story flags are mutated;
- canonical Tap Anywhere and Fullscreen status objects remain present;
- add-on exposes no pointer/action/movement authority.

## 7. PUBLIC GATE

Before VERIFY:

- JavaScript syntax PASS;
- static regression PASS;
- add-on contract PASS;
- assembled browser PASS including REQ-112 self-acceptance;
- 390x844 Touch/Fullscreen PASS;
- relevant north-route regressions PASS;
- Pages workflow SUCCESS on complete implementation HEAD.

## 8. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 9. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
