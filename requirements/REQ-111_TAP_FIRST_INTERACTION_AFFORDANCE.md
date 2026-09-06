# REQ-111 — Tap-First Interaction Affordance

STATUS: IN_PROGRESS
PRIORITY: P0
TYPE: MOBILE UX / INPUT CLARITY / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh public code already implements REQ-021 correctly: a short touch/pen tap anywhere on the world gameShell invokes final canonical `action()` exactly once, while drag enters Movement mode and drag release never fires Action.

However player-facing copy still teaches the old A-button mental model:

- core dialogue footer says `Aで閉じる`;
- `addons/facing-npc-marker.js` renders a literal `A` bubble over the NPC Luke is facing;
- `addons/physical-landmark-prompts.js` renders a literal `A` badge beside EXAMINE landmarks.

This does not break the input engine, but it makes the Owner's Tap Anywhere capability look absent or secondary on iPhone.

## 2. PURPOSE

Align visible interaction affordances with the already-canonical Tap Anywhere system without changing interaction mechanics.

On world gameplay:

- dialogue close guidance must explicitly say tap is valid;
- facing-NPC marker must stop implying that A is required;
- landmark examine prompt must stop implying that A is required;
- physical A button may remain as an optional fallback control;
- keyboard/desktop Action remains supported.

## 3. PRESENTATION

Use compact, device-neutral wording:

- dialogue: `タップ / Aで閉じる`
- NPC marker: semantic `話す` cue rather than literal A-only button
- landmark badge: semantic `調べる` cue rather than literal A-only button

No permanent new HUD panel. No new fixed controls. No loss of world viewport.

## 4. INPUT SAFETY

This requirement is presentation-only.

MUST NOT:

- add pointerdown / pointermove / pointerup / pointercancel handlers;
- call `action()`;
- call `move()`;
- replace `stopMoving()`;
- modify dead-zone / tap timing / pointerId ownership;
- mutate menu/button/link/input exclusions;
- change map, story, save, battle, shop or gate authority.

REQ-021 / REQ-022 / REQ-001 remain canonical.

## 5. IMPLEMENTATION APPROACH

Prefer a late presentation add-on that:

- rewrites the rendered dialogue footer after world/render reconstruction;
- overrides legacy NPC A-bubble copy without changing facing-NPC detection;
- rewrites legacy physical-landmark A badge after it is rendered;
- is idempotent across repeated render;
- leaves the fallback physical A button itself untouched.

Do not edit interaction logic in the older add-ons unless required.

## 6. ACCEPTANCE

Fail-closed assembled-browser acceptance must verify:

- a world dialogue renders `タップ / Aで閉じる` and no longer renders A-only close instruction;
- a facing NPC still receives the existing facing marker class;
- the facing marker is marked with semantic `話す` presentation authority;
- a physical landmark prompt still renders and its badge becomes `調べる` rather than `A`;
- fallback `.actionPad .a` remains present;
- no duplicate hint nodes are created after repeated render;
- no new pointer handler authority is introduced by this add-on;
- P0 Touch/Fullscreen status remains present;
- save/story state remains unchanged by presentation sync.

Broken REQ-111 must emit a dedicated failure marker and fail assembled browser smoke before Pages upload.

## 7. PUBLIC GATE

Before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- assembled browser PASS including REQ-111 self-acceptance
- 390x844 Touch/Fullscreen PASS
- visibilitychange regression PASS
- north-route regressions PASS
- Pages workflow SUCCESS on complete implementation HEAD

## 8. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 9. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
