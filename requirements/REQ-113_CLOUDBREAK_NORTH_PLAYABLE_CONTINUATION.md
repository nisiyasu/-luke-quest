# REQ-113 — Cloudbreak North Playable Continuation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: GAMEPLAY / FIRST-CHAPTER ROUTE CONTINUATION / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh `addons/zzz-cloudbreak-saddle.js` exposes a north-boundary interactable at `(10,1)` named `次の高所へ続く石段跡`.

Its dialogue explicitly says the old passage continues farther north and Luke says `追跡路としては、まだ終わってないですね。` However the current implementation has no north transition from `cloudbreakSaddle`; only the south `V` return gate is wired.

Therefore a player who follows the current guidance reaches a narrative and gameplay dead end despite the route explicitly promising continuation.

## 2. PURPOSE

Continue the playable first-chapter pursuit route north from `cloudbreakSaddle` without changing protected story canon or adding a new required story flag.

Add one distinct walkable pursuit interval:

- map id: `windStairRidge`
- display name: `北尾根・風鳴りの石段`

The new interval must feel like the next physical step in the same pursuit, not a teleport or menu jump.

## 3. REQUIRED FLOW

`cloudbreakSaddle`
→ face/interact with existing `lqCloudbreakBoundary`
→ enter `windStairRidge` at a safe south spawn
→ walk/explore
→ inspect local pursuit evidence
→ reach a clearly readable north continuation boundary
→ safely return south through the map's south exit when desired.

The north continuation boundary may remain a future-route clue in this requirement. The player must not be trapped and must always have a safe return.

## 4. LOCAL CONTENT

Provide at least four canonical Action interactables, spoiler-safe and canon-preserving:

1. fresh boot scuff / pursuit evidence near the south half;
2. wind-carved step or old route structure;
3. overlook or environmental landmark;
4. clearly readable north-boundary clue.

Do not reveal protected lineage/Glenn/Elisia/Eleanor secrets early.

## 5. GAMEPLAY INTEGRATION

- reuse existing `EVAC_ENEMIES` encounter authority;
- entry/return encounter grace;
- no new save schema;
- canonical `action()` interaction path;
- canonical map state so ordinary save/load can preserve the map;
- pointer/tap/movement authority unchanged;
- local compact guidance and a visible clue marker so no攻略情報 is required;
- safe south return into `cloudbreakSaddle`.

## 6. INPUT / P0 SAFETY

MUST NOT alter:

- REQ-021 Tap Anywhere canonical authority;
- REQ-022 fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership/dead zone/stop safety;
- MENU/button/input exclusions.

## 7. ACCEPTANCE

Fail-closed assembled-browser acceptance must verify:

- `MAPS.windStairRidge` exists and is walkable;
- existing cloudbreak north boundary enters the new map through canonical Action;
- entry spawn is valid/walkable;
- local interactable Action opens dialogue;
- south exit returns safely to cloudbreak;
- encounter registry uses existing `EVAC_ENEMIES`;
- compact guidance exists;
- no new story flag/save schema/pointer authority;
- REQ-021/022/001 status remains present;
- a dedicated REQ-113 success marker is emitted, and failure throws before Pages upload.

## 8. PUBLIC GATE

Before VERIFY:

- JavaScript syntax PASS;
- static regression PASS;
- add-on contract PASS;
- assembled browser PASS including REQ-113 acceptance;
- 390x844 Touch/Fullscreen PASS;
- REQ-081/082 north-route regressions PASS;
- Pages workflow SUCCESS on complete implementation HEAD.

## 9. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 10. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or one completed route interval is not an autonomous stop condition.
