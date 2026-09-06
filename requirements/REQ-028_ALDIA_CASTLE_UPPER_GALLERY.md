# REQ-028 — 王都アルディア・王城上階回廊

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / CASTLE / INTERIOR / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

REQ-027で王城本館の玄関ホールまでwalkableになったが、北側の大階段はまだworld-side boundaryで止まっている。`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像にある「城」を試作品の一室で終わらせず、保護された物語秘密や王族イベントを新規断定せずに進められる次の安全なcheckpointとして、上階回廊を追加する。

## PURPOSE

王城玄関ホールの大階段から入れるwalkableな上階回廊を追加し、王城内部に奥行きと探索感を作る。

これは謁見の間、王族、重要story event、王城全体の完成を意味しない。

## REQUIRED PLAYER FLOW

王城玄関ホール
→ 大階段
→ 王城上階回廊
→ 城内の複数区画へ続く扉や回廊が見える

上階回廊から玄関ホールへ安全に戻れる。

## VISUAL REQUIREMENTS

最低限:
- 長い石床 / 絨毯
- 柱またはアーチ
- 窓 / 採光表現
- 青銀の旗または壁飾り
- 灯り
- 奥行きを示す左右の扉 / 分岐
- 単純な色面だけで終わらせない
- 絵文字だけを最終表現にしない

## INTERACTION

最低限3つ:
- 上階警備兵
- 古い王都地図または城内案内図
- 窓 / 壁画 / 装飾甲冑等の環境小物

すべてcanonical `action()` chain経由で動くこと。
重要story flagや報酬は追加しない。

## DEEP CASTLE BOUNDARY

回廊の左右または奥にはさらに区画があることを視覚的に示す。
未実装区画へ落とさず、現在の警戒態勢に沿う自然なworld-side案内で止める。
「開発中」等のメタ文言は禁止。

## CANON SAFETY

以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由
- 王族の新規固有名・系譜・重大政治設定

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 fullscreen world UI維持
- fixed fallback controls維持
- dialogue/map transition時 `stopMoving()` 維持

## SAVE / TRANSITION SAFETY

- old save compatibility維持
- 上階回廊でsave/continue可能
- 玄関ホールへ戻るspawnはcollision安全
- map transitionでstale touch/movementを残さない

## TEST REQUIREMENTS

1. 玄関ホール大階段正面のcanonical Actionで上階回廊へ入れる
2. 上階回廊がwalkable
3. 視覚ランドマークがrenderされる
4. 3つ以上のinteractionがcanonical Actionで動く
5. 未実装深部境界が自然に処理される
6. 上階回廊から玄関ホールへ安全に戻れる
7. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
8. protected canon先出しなし
9. JavaScript/static/add-on/browser regression PASS
10. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesで玄関ホール→上階回廊→玄関ホールの往復が成立
- entry / walk / interaction / boundary / returnをbrowser runtimeで再現可能に検証
- existing gameplay/save/input compatibility維持
- 王城全体完成を偽装しない
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
