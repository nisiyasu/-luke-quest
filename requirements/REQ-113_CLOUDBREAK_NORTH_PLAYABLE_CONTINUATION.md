# REQ-113 — Cloudbreak North Playable Continuation

STATUS: BLOCKED
PRIORITY: P1
TYPE: GAMEPLAY / FIRST-CHAPTER ROUTE CONTINUATION / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED / SUPERSEDED_BY_NEWER_STORY_GOVERNANCE_FOR_FURTHER_PURSUIT_EXTENSION
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. OWNER STORY-CANON PREEMPTION — 2026-09-07

Fresh HEAD now contains `STORY_CANON.md`, created after REQ-113 work began.

That Owner-approved partial authority explicitly records the current governance defect: the first-chapter Leon pursuit has been extended north repeatedly without a chapter-level destination. It requires that, until Chapter 1 and Chapter 2 Story Beats are fixed, autonomous development must **not keep extending the main pursuit merely because Leon traces continue farther north**.

Therefore:

- the already-committed `windStairRidge` implementation is preserved at HEAD as repository reality;
- no additional north pursuit map / clue chain may be generated from REQ-113;
- REQ-113 is removed from active WIP and set `BLOCKED` pending the Owner-led Chapter 1 / Chapter 2 story design checkpoint;
- do not delete or roll back the published map merely to hide historical work;
- do not promote this requirement to VERIFY under its original acceptance text, because the final implementation intentionally stopped short of the original `EVAC_ENEMIES` encounter integration to preserve the protected REQ-082 authority chain;
- future story implementation must converge toward the approved Chapter 1 climax rather than creating another generic pursuit interval.

BLOCKER: `STORY_CANON.md` Chapter 1 remains partially confirmed and Chapter 2 is not designed. Further main-story route extension requires approved Story Beats.

## 1. FRESH PROBLEM EVIDENCE

Fresh `addons/zzz-cloudbreak-saddle.js` exposes a north-boundary interactable at `(10,1)` named `次の高所へ続く石段跡`.

Its dialogue explicitly says the old passage continues farther north and Luke says `追跡路としては、まだ終わってないですね。` However the prior implementation had no north transition from `cloudbreakSaddle`; only the south `V` return gate was wired.

REQ-113 was created to remove that immediate gameplay dead end. The route interval was subsequently implemented and repeatedly hardened at HEAD before the newer Story Canon checkpoint was created.

## 2. PURPOSE

Original purpose:

Continue the playable first-chapter pursuit route north from `cloudbreakSaddle` without changing protected story canon or adding a new required story flag.

Implemented interval:

- map id: `windStairRidge`
- display name: `北尾根・風鳴りの石段`

The interval remains published as historical implementation reality, but this requirement no longer authorizes another pursuit extension beyond it.

## 3. REQUIRED FLOW

Implemented target flow:

`cloudbreakSaddle`
→ face/interact with existing `lqCloudbreakBoundary`
→ enter `windStairRidge` at a safe south spawn
→ walk/explore
→ inspect local pursuit evidence
→ reach a clearly readable north continuation boundary
→ safely return south through the map's south exit when desired.

The north continuation boundary is now a **story-design hold boundary**, not autonomous permission to create another map.

## 4. LOCAL CONTENT

The interval was designed with spoiler-safe canonical Action interactables including pursuit evidence, route structure, environmental landmark, north-boundary clue and safe return.

Protected lineage / Glenn / Elisia / Eleanor secrets must remain undisclosed until Story Canon explicitly schedules them.

## 5. GAMEPLAY INTEGRATION

Original requirement requested reuse of `EVAC_ENEMIES` encounter authority. During hardening, repeated regression isolation showed that adding another global `checkGate()` / encounter / Action wrapper risked interference with the protected REQ-082 authority chain.

The final stabilized architecture therefore uses:

- data-only `MAPS.windStairRidge` registration in `addons/zzz-wind-stair-ridge.js`;
- interaction/transition authority folded into the existing Cloudbreak action wrapper rather than another global wrapper;
- combat-free pursuit interval for now;
- no new save schema;
- canonical map state;
- pointer/tap/movement authority unchanged;
- safe south return.

This deviation is intentional and is why the original acceptance text is not being falsely marked complete.

## 6. INPUT / P0 SAFETY

MUST NOT alter:

- REQ-021 Tap Anywhere canonical authority;
- REQ-022 fullscreen world geometry;
- REQ-001 Dynamic Touch pointer ownership/dead zone/stop safety;
- MENU/button/input exclusions.

## 7. ORIGINAL ACCEPTANCE

The original fail-closed target included:

- `MAPS.windStairRidge` exists and is walkable;
- existing cloudbreak north boundary enters the new map through canonical Action;
- entry spawn is valid/walkable;
- local interactable Action opens dialogue;
- south exit returns safely to cloudbreak;
- encounter registry uses existing `EVAC_ENEMIES`;
- compact guidance exists;
- no new story flag/save schema/pointer authority;
- REQ-021/022/001 status remains present;
- a dedicated REQ-113 success marker is emitted.

Because the protected-authority hardening intentionally deferred encounter integration, this acceptance set is not claimed as fully satisfied.

## 8. PUBLIC / HEAD EVIDENCE

- Initial registration commit: `fe6ddd64845c5ff54491c4d9680ed6a5a4b56141`.
- Implementation commit: `029dc97cf9302ece793f87d2efcbf86879a8d292`.
- Subsequent regression-isolation / authority-hardening commits culminated in `7360b6279280193f76cfbe579e059a51ddeef0b7` (`Make REQ-113 map registration data-only`).
- Pages workflow for `7360b6279280193f76cfbe579e059a51ddeef0b7`: run `34049582140`, SUCCESS.
- Newer HEAD `5fd43a687e23ffb6a391639ae80ac819b22ef784` added `STORY_CANON.md`; Pages run `34049703956`, SUCCESS.

## 9. COMPLETION STATE

IMPLEMENTATION_PRESENT_AT_HEAD: YES
ORIGINAL_ACCEPTANCE_COMPLETE: NO
PAGES_BUILD_AFTER_STABILIZATION: SUCCESS
STATUS: BLOCKED
IOS_PHYSICAL_VERIFICATION: PENDING

## 10. RESUME CONDITION

Resume only after the Owner-led Story Canon session fixes the relevant Chapter 1 / Chapter 2 Story Beats and explicitly determines what follows the current pursuit route.

When resumed, prefer implementing an approved dramatic Story Beat / Chapter 1 convergence over adding another generic north pursuit map.

## 11. NO-STOP

Blocking this story-specific requirement does not stop autonomous development. Continue with independent, canon-safe player-visible work allowed by `WORK_MANAGER.md` and the latest Owner authority.
