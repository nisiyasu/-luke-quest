# REQ-112 — First-Touch Gesture Coach

STATUS: VERIFY
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
- REQ-111 removes legacy A-only wording around interactions.

The remaining discoverability gap was that a first-time iPhone player had no compact world-level explanation that these two gestures share the same surface. The old fixed-D-pad hint is not a reliable discovery surface because the iPhone fullscreen design intentionally de-emphasizes fixed controls.

## 2. PURPOSE

Implemented a transient, non-blocking mobile gesture coach that makes the Owner's intended control model immediately discoverable without consuming permanent world viewport.

Player-visible copy:

- `短くタップ：調べる`
- `スライド：歩く`

The coach appears only during world gameplay on coarse-pointer/mobile style environments, then disappears automatically. It is not a permanent HUD row.

## 3. PRESENTATION

Implemented as `addons/first-touch-gesture-coach.js`.

- compact overlay inside the world viewport;
- pointer-events none;
- safe-area aware;
- visually subordinate to dialogue and MENU;
- auto-hide after 4800ms;
- hide immediately when dialogue, battle, menu or shop takes over;
- may reappear after a full page reload because no save-schema/persistent state is used;
- reduced-motion compatible.

## 4. INPUT SAFETY

This requirement is presentation-only.

It does not:

- add pointerdown / pointermove / pointerup / pointercancel handlers;
- call `action()`;
- call `move()` / `startMoving()` / `stopMoving()`;
- change dead-zone, tap timing, pointerId ownership or explicit-control exclusions;
- mutate story/save/map/battle/shop authority;
- alter REQ-021 / REQ-022 / REQ-001 canonical behavior.

## 5. IMPLEMENTATION

The late add-on observes rendered world state and manages one idempotent coach node.

A session-local in-memory shown flag is used only. No localStorage or save-field additions.

A fresh post-write audit detected a harmless malformed descendant CSS selector in the first implementation and repaired it before the public gate. The public-gated implementation is the polished checkpoint below.

## 6. ACCEPTANCE

Fail-closed assembled-browser acceptance verifies:

- world render can create exactly one coach node;
- text teaches short tap = examine and slide = walk;
- coach has pointer-events none;
- no duplicate nodes after repeated render;
- dialogue suppresses/removes the coach;
- non-world state suppresses/removes the coach;
- story flags remain unchanged;
- canonical Tap Anywhere and Fullscreen status objects remain present;
- add-on exposes no pointer/action/movement authority.

Broken REQ-112 emits `.lqFirstTouchGestureCoachSmokeFailure` and throws before Pages upload.

## 7. PUBLIC GATE

Complete implementation HEAD: `1270aad68ee08c4a6536a4947615111913fbb712`
Pages workflow: `34048446380` / SUCCESS

The deploy job completed all required gates successfully, including:

- sequential JavaScript syntax validation;
- collision-safe add-on syntax validation;
- static regression guard;
- add-on contract guard;
- REQ-063 autosave bootstrap guard;
- assembled browser smoke including REQ-112 self-acceptance;
- 390x844 floating touch + iPhone world visual-liveness smoke;
- REQ-081 north cliff road regression;
- REQ-082 north cliff encounter regression;
- artifact upload;
- GitHub Pages deployment.

## 8. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
IOS_PHYSICAL_VERIFICATION: PENDING

Physical iPhone appearance/feel remains Owner-only and is not claimed from CI.

## 9. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
