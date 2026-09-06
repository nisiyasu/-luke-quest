# REQ-111 — Tap-First Interaction Affordance

STATUS: VERIFY
PRIORITY: P0
TYPE: MOBILE UX / INPUT CLARITY / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh public code already implements REQ-021 correctly: a short touch/pen tap anywhere on the world gameShell invokes final canonical `action()` exactly once, while drag enters Movement mode and drag release never fires Action.

However player-facing copy still taught the old A-button mental model:

- core dialogue footer said `Aで閉じる`;
- `addons/facing-npc-marker.js` rendered a literal `A` bubble over the NPC Luke is facing;
- `addons/physical-landmark-prompts.js` rendered a literal `A` badge beside EXAMINE landmarks.

This did not break the input engine, but made the Owner's Tap Anywhere capability look absent or secondary on iPhone.

## 2. PURPOSE

Align visible interaction affordances with the already-canonical Tap Anywhere system without changing interaction mechanics.

On world gameplay:

- dialogue close guidance explicitly says tap is valid;
- facing-NPC marker no longer implies that A is required;
- landmark examine prompt no longer implies that A is required;
- physical A button remains as an optional fallback control;
- keyboard/desktop Action remains supported.

## 3. PRESENTATION

Implemented compact, device-neutral wording:

- dialogue: `タップ / Aで閉じる`
- NPC marker: semantic `話す` cue rather than literal A-only button
- landmark badge: semantic `調べる` cue rather than literal A-only button

No permanent new HUD panel. No new fixed controls. No loss of world viewport.

## 4. INPUT SAFETY

This requirement is presentation-only.

It does not:

- add pointerdown / pointermove / pointerup / pointercancel handlers;
- call `action()`;
- call `move()`;
- replace `stopMoving()`;
- modify dead-zone / tap timing / pointerId ownership;
- mutate menu/button/link/input exclusions;
- change map, story, save, battle, shop or gate authority.

REQ-021 / REQ-022 / REQ-001 remain canonical.

## 5. IMPLEMENTATION

Implemented as `addons/tap-first-interaction-affordance.js`.

The late presentation add-on:

- rewrites the rendered dialogue footer after world/render reconstruction;
- overrides legacy NPC A-bubble copy without changing facing-NPC detection;
- rewrites legacy physical-landmark A badge after it is rendered;
- is idempotent across repeated render;
- leaves the fallback physical A button itself untouched.

## 6. ACCEPTANCE

Fail-closed assembled-browser acceptance verifies:

- a world dialogue renders `タップ / Aで閉じる` and no longer renders A-only close instruction;
- a facing NPC still receives the existing facing marker class;
- the facing marker receives semantic `話す` presentation authority;
- a physical landmark prompt still renders and its badge becomes `調べる` rather than `A`;
- fallback `.actionPad .a` remains present;
- no duplicate hint nodes are created after repeated render;
- presentation sync does not mutate story flags;
- canonical Tap Anywhere and Fullscreen statuses remain present.

Broken REQ-111 emits `.lqTapFirstAffordanceSmokeFailure` and throws before Pages upload.

## 7. PUBLIC GATE

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- assembled browser PASS including REQ-111 self-acceptance
- 390x844 Touch/Fullscreen PASS
- visibilitychange/P0 regression PASS through existing assembled guards
- REQ-081 north cliff road PASS
- REQ-082 north cliff encounters PASS
- artifact upload PASS
- Pages deploy PASS

## 8. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
IOS_PHYSICAL_VERIFICATION: PENDING

Implementation checkpoint: `a46c9b8f088ba32fd5e31a2a44aa4646240ee2b8`
Pages workflow: `34047595001` / SUCCESS

Physical iPhone visual confirmation remains Owner-only and is not claimed.

## 9. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
