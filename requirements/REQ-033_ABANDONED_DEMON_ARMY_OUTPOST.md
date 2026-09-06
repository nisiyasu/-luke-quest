# REQ-033 — 高地・放棄された魔王軍監視所

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / DEMON_ARMY_FACILITY / EXPLORATION / INTERIOR
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「魔王軍施設」が含まれる。

本REQ登録前に以下をfresh inventoryした。

- current code / add-ons の `魔王 / 魔族 / 砦 / 前哨 / 拠点 / 駐屯 / 野営 / 基地 / demon / fortress / outpost / camp / garrison / facility`
- commit history の `魔王軍 / 砦 / outpost` 等
- current map registry周辺

既存の状態異常、ボス、装備は履歴から実装済みと判明したため重複登録を回避した一方、独立した魔王軍施設は確認できなかった。

したがって、protected canonを進めずに実装できる最初の安全な魔王軍施設checkpointとして、高地に放棄された小規模監視所を追加する。

## PURPOSE

REQ-030 `aldiaHighlandTrail` の横道から入れるwalkableな「放棄された魔王軍監視所」を追加する。

この施設は:
- 現在の重要作戦拠点ではない
- グレン本人の基地とは断定しない
- 重要story progressionを持たない
- 敵側の軍事施設が世界に実在することをplayer-visibleにする

という安全なoptional exploration areaとする。

## ENTRY / EXIT

- `aldiaHighlandTrail` の既存必須導線・出口・既存5 interactionを壊さない位置へ脇道入口を追加
- 入口は壊れた黒鉄標識 / 古い魔族紋の杭等で視認可能
- 正面canonical `action()` で入る
- REQ-021 Tap Anywhere Actionでも同じcanonical chain
- 退出すると高地の入口前へ安全に戻る
- spawn地点はwall/NPCに重ならない

## OUTPOST MAP

新規walkable mapを追加する。

最低限:
- 監視室
- 小さな兵站棚
- 地図台
- 崩れた寝台または休憩区画
- 外を見る監視窓
- 安全な出口

単なる1枚dialogueではなく、実際に歩いて複数箇所を調べられること。

## VISUAL QUALITY

late-SFC / early-PS1 2D JRPGのplayer-visible densityを目標にする。

最低限:
- 黒鉄 / 暗灰石 / 木材の軍施設らしい色調
- 魔族側と分かるが秘密設定を説明しない抽象紋章
- 監視窓から差す寒色光
- 壊れた棚 / 地図台 / 装備掛け等の環境小物
- 影 / 奥行き
- emojiだけを最終表現にしない

## INTERACTIONS

最低限4つ:
1. 古い監視地図
2. 空になった兵站棚
3. 壊れた警報具または信号灯
4. 高地を望む監視窓

任意で一般的な短文を追加してよい。

例として安全な情報:
- 王都周辺を遠くから監視できる地形だった
- 長期間使われていない
- 補給品は撤去済み

## CANON SAFETY — ABSOLUTE

以下を新規断定・説明しない:
- グレンがルークの叔父
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由
- この監視所をグレンが直接運営していた事実
- 現魔王軍の重要作戦、侵攻計画、指揮系統の新しい確定設定

文書や地図に重要story spoilerを書かない。

## GAMEPLAY SAFETY

- main story flagsを追加しない
- encounter rateを変更しない
- reward必須にしない
- highland既存出口/境界を変更しない
- save schemaは新規map id以外変更しない
- map内save/continue可能
- old save compatibility維持

## INPUT COMPATIBILITY

- REQ-021 Tap Anywhere Action
- REQ-001 Dynamic Touch Controller
- REQ-022 fullscreen world UI
- fixed fallback controls
- map transition `stopMoving()`

を維持する。

## TEST REQUIREMENTS

1. highlandに監視所入口が存在
2. existing REQ-030 interaction/exit coordinatesを壊さない
3. canonical Actionでentry
4. entry spawnがwalkable / collision-safe
5. outpost内を歩ける
6. 4つ以上のenvironment interactionがcanonical Actionで成立
7. protected canon spoilerなし
8. main story flag変更なし
9. safe exitでhighlandへ戻る
10. exit spawnがwall/NPCに重ならない
11. save-compatible map state
12. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
13. JavaScript/static/add-on/browser regression PASS
14. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesで highland → outpost entry → walk/explore → multiple interactions → highland return が成立
- independent Demon Army facility capabilityがplayer-visibleに存在
- protected canon / existing gameplay / input / save compatibility維持
- automated browser regression PASS
- Owner physical iPhone / subjective visual verification前はVERIFYでよい

## VERIFICATION CHECKPOINT

- Implementation and dedicated browser acceptance are present at fresh HEAD history.
- Pages workflow for checkpoint `283a0b419365332a2c86c96bf081b283e027592e` completed successfully.
- Automated implementation is therefore VERIFY, not active WIP.
- Owner physical iPhone / subjective visual verification remains PENDING.

## DO NOT REPEAT

- 「魔王軍施設」という完成像を理由にprotected canonを勝手に進めない
- existing highland north boundaryを上書きしてREQ-030を壊さない
- dialogueだけ追加してwalkable facility完成扱いしない
- inventory前に別名で既存機能がないか確認する手順を省略しない