# REQ-074 — Optional Boss Adventure Journal Tracking

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / JOURNAL / OPTIONAL-BOSS / SPOILER-SAFE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit after REQ-073 found a distinct player-facing gap. The optional boss `苔角の森王` now appears in completion records after defeat, but the active ADVENTURE JOURNAL did not track the optional objective after the player had physically discovered the giant hoofprints.

The boss remains spoiler-safe: it is not revealed before the existing `forestMiniBossWarned` discovery flag is set.

## 1. REQUIRED BEHAVIOR

- Before `forestMiniBossWarned`, the journal must not reveal the optional boss objective.
- After `forestMiniBossWarned` and before `forestMiniBossDefeated`, SIDE QUESTS must show a clear optional objective telling the player to investigate the giant hoofprints again.
- After `forestMiniBossDefeated`, the same thread becomes a completed row for `苔角の森王`.
- Existing elder charm, forest bounty and herb sample rows remain unchanged.
- Journal projection is read-only. It must not set/clear boss, bounty, reward, inventory, key-item or story flags.
- No change to boss unlock, battle, reward, story or protected canon.

## 2. ACCEPTANCE

Automated acceptance proves:
1. no pre-discovery spoiler row;
2. discovered/not-defeated state exposes the repeat-investigation objective;
3. defeated state exposes exactly one completed boss row;
4. original three side-quest definition families remain present;
5. boss journal projection depends on existing flags only and does not mutate them;
6. syntax/static/add-on contracts PASS;
7. assembled browser regression PASS;
8. 390x844 touch/fullscreen visual-liveness PASS;
9. Pages deploy SUCCESS.

## 3. IMPLEMENTATION / VERIFICATION EVIDENCE

- `addons/adventure-journal.js` adds `forestMiniBoss` as a fourth spoiler-safe side-quest family.
- `forestMiniBossWarned && !forestMiniBossDefeated` projects `巨大な蹄跡 / 魔物の森・入口で巨大な蹄跡をもう一度調べる`.
- `forestMiniBossDefeated` projects exactly one completed `苔角の森王 / 森の主を討伐した` row.
- No boss row is emitted before `forestMiniBossWarned`.
- `window.LQ_ADVENTURE_JOURNAL_TEST.sideQuests` exposes the pure projection for fail-closed regression without changing gameplay authority.
- `tools/lq-optional-boss-journal-smoke.mjs` records standalone deterministic acceptance coverage.
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-optional-boss-journal-smoke.js` participates automatically in the existing assembled `?lqSmoke=1` browser run, throws on spoiler/projection/state-mutation regression, and restores the original flags after the test.
- Checkpoints:
  - `1d0a0bc1ecf3de4186205cab9b8e0da792ee85aa` — register REQ-074.
  - `5b52cee698bc8bfb44ce53a85e575e2d7f7a3627` — implement journal tracking.
  - `2aab21748c8b287f77c7eb55620e6da5cc901d5a` — standalone acceptance.
  - `0a749a2e9dbadf4493d56937c900f37270d6e417` — assembled-browser regression gate.
- GitHub Pages workflow run `34019148578`: SUCCESS. Sequential/add-on syntax, static regression, add-on contract, assembled browser smoke, 390x844 floating-touch/fullscreen visual-liveness, upload and Pages deployment all succeeded.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no false physical-device PASS is claimed.

## 4. NO-STOP

REQ completion is a checkpoint only. Fresh-fetch HEAD, synchronize queue/CURRENT as needed, run GATE C and continue to the next safe useful work.
