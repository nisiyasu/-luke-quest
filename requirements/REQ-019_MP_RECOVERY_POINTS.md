# REQ-019 — MP RECOVERY POINT CONSISTENCY

- PRIORITY: P2
- STATUS: IN_PROGRESS
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

## COMPLETION
- implementation committed
- explicit regression contracts added
- latest Pages SUCCESS
- move to VERIFY pending Owner subjective/iPhone recovery-flow check
