# REQ-019 — MP RECOVERY POINT CONSISTENCY

- PRIORITY: P2
- STATUS: VERIFY
- OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE §§9, 35, 48 / queue selection rule 8
- DEPENDS_ON: REQ-016
- TYPE: recovery loop / resource consistency

## GOAL
REQ-016でMPを導入した後も、既存の回復地点がHPだけを回復してMPを取り残す不整合を起こさないようにする。

## VERIFIED EXISTING RECOVERY POINTS
- `addons/campfire-rest.js`: 森の一度きりの焚き火休憩。HP全回復。
- `addons/wayfarer-shrine-blessing.js`: 旅人の祠の一度きりの水鉢。最大HPの35%相当を回復。
- `addons/inn-guest-room.js`: 現時点では歩行可能な客室コンテンツであり、宿泊回復処理そのものは持たない。見た目だけを理由に回復機能を捏造しない。

## RULES
### Campfire
- HP全回復と同時にMPも `s.mmp` まで全回復する。
- MPが旧save等で未定義でもクラッシュしない。
- 既存の一度きりflag、会話、HP回復を保持する。

### Wayfarer Shrine
- 既存HP回復比率35%に合わせて、最大MPの35%相当を回復する。
- `Math.ceil(s.mmp * .35)` を上限 `s.mmp` でclampする。
- 既存の一度きりflag、会話、HP回復を保持する。

### Inn
- 現時点で正式な宿泊/料金/睡眠interactionが存在しないため、REQ-019では新規回復処理を追加しない。
- 将来宿泊interactionが正式実装された場合、HP/MP双方を回復する契約を引き継ぐ。

## PRESENTATION
- MPが実際に回復した場合のみ、既存dialogueへ `MPが N 回復した。` を追加する。
- HP/MPとも満タンでも既存満タン系dialogueを壊さない。

## SAFETY
- MP以外の戦闘バランスを変更しない。
- Gold、inventory、story flagsを追加変更しない。
- 回復地点のone-time persistenceを変更しない。
- protected canonを変更しない。

## VERIFICATION
1. campfire full MP recovery present
2. shrine 35% proportional MP recovery present
3. both clamp to `s.mmp`
4. undefined/non-finite MP safely tolerated
5. existing one-time flags retained
6. existing HP recovery retained
7. no Gold/inventory mutation introduced
8. MP recovery dialogue only when positive
9. static/addon/browser/touch/Pages pipeline green

## IMPLEMENTATION CHECKPOINTS
- Requirement definition: `fff8c877ca0242f79bda44a211f2df02febe6660`
- Campfire MP integration: `66c214c125a9152954bd2529a835f2b99688325b`
- Shrine MP integration: `d32360b6d90512e1d3fb5c221295c791f25ce343`
- Queue registration: `232b1a4614b8632cf05671541675e097edd51468`
- Explicit regression-contract checkpoint: `7c4a12f22f3f4451ded0f00c7b1398847bc15f8b`

## AUTOMATED VERIFICATION RESULT
- GitHub Pages workflow run `33993422174`: SUCCESS.
- collision-safe add-on syntax: PASS.
- campfire full HP + full MP + undefined-MP safety + persistent flag contracts: PASS.
- shrine 35% HP + 35% MP + clamp + undefined-MP safety + persistent flag contracts: PASS.
- Gold/inventory non-mutation guard: PASS.
- assembled browser smoke: PASS.
- floating touch pointer-drag smoke: PASS.
- artifact upload and Pages deployment: PASS.
- physical iPhone / subjective recovery-flow feel remains Owner-side and is not claimed.

## COMPLETION
- implementation committed: SATISFIED
- explicit regression contracts added: SATISFIED
- latest Pages SUCCESS: SATISFIED
- state: VERIFY pending Owner subjective/iPhone recovery-flow check
