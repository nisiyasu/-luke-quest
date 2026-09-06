# REQ-026 — 王都アルディア・王城前庭

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / CASTLE / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「城」が含まれる。REQ-025で王城門衛詰所までwalkableになったが、正式な王城本体へ続く空間はまだ未完成である。

Owner-only formal artや保護された物語秘密を要求せず、既存の王都・門衛詰所から自然に王城側へ世界を広げられる次の安全なplayer-visible checkpointとして、王城前庭を実装する。

## PURPOSE

王城門衛詰所の奥から入れるwalkableな王城前庭を追加し、「王城エリアへ進んでいる」空間的連続性を作る。

これは謁見の間・王城本館・重要ストーリーイベント完成を意味しない。

## REQUIRED PLAYER FLOW

王都
→ 王城門衛詰所
→ 奥の門
→ 王城前庭
→ 奥に王城本館入口が見える

前庭から門衛詰所へ安全に戻れる。

## VISUAL REQUIREMENTS

- 石畳または整備された城内舗装
- 城壁
- 植栽 / 庭園要素
- 王国旗または紋章
- 灯り
- 王城本館が奥に存在すると分かる視覚的ランドマーク
- 単なる平坦色タイルだけで終わらせない
- 絵文字だけを最終表現にしない

## INTERACTION

最低限2〜3個の任意interactionを置いてよい。
例:
- 前庭の案内板
- 王国旗
- 噴水 / 記念碑

報酬、重要フラグ、秘密設定は追加しない。

## CASTLE ENTRANCE BOUNDARY

前庭奥の王城本館入口は視認可能にする。
ただし本館が未実装なら、入口で自然な短い案内を出し、未完成の空間へプレイヤーを落とさない。

「開発中」等のメタ文言をゲーム世界へ出さない。
序盤世界観として自然な理由を使う。

## CANON SAFETY

以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Actionを維持
- REQ-001 Dynamic Touch Controllerを維持
- REQ-022 fullscreen overlay layoutを維持
- fixed controls fallbackを壊さない

## SAVE / TRANSITION SAFETY

- old save compatibility維持
- 前庭mapでsave/continueしても破綻しない
- map transition時movement cleanupを壊さない
- 門衛詰所へ戻った時に壁やNPCへ埋まらない

## TEST REQUIREMENTS

1. 門衛詰所の奥から前庭へ入れる
2. 前庭がwalkable
3. 前庭の視覚ランドマークがrenderされる
4. 任意interactionがcanonical Actionで動く
5. 前庭から門衛詰所へ安全に戻れる
6. 王城本館未実装境界が自然に処理される
7. Tap Anywhere / Dynamic Touch / fullscreen UI regressionなし
8. protected canon先出しなし
9. JavaScript/static/add-on/browser regression PASS
10. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pages上で王都→門衛詰所→王城前庭の連続探索が成立
- entry / walk / interaction / returnが再現可能に検証される
- 王城本館完成を偽装しない
- existing gameplay/save/input compatibility維持
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
