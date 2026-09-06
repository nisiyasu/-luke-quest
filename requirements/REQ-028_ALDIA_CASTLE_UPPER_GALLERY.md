# REQ-028 — 王都アルディア・王城上階回廊

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / CASTLE / INTERIOR / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

REQ-027で王城本館の玄関ホールまでwalkableになったが、北側の大階段はまだworld-side boundaryで止まっていた。`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像にある「城」を試作品の一室で終わらせず、保護された物語秘密や王族イベントを新規断定せずに進められる次の安全なcheckpointとして、上階回廊を追加した。

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

## AUTOMATED / PUBLIC VERIFICATION

- Registration checkpoint: `d7fe1d9333777dc2c4798b20ca293301b14cb5da`.
- Implementation checkpoint: `e1c4f608b0da8ddbfcde7680309279f4b7c9dca8`.
- Initial runtime acceptance checkpoint: `ada3a11246b91d3ced24aae798aadbf413d3c80f`.
- Initial shared smoke runs exposed a forward-compatibility defect in the older REQ-027 acceptance: it incorrectly required the castle stair to remain a permanent dialogue-only boundary even after a safe next map existed.
- `15c4aa18e3300efd34c0ff48dd91e72aaa9b008d` evolved the REQ-027 smoke contract to accept either the original safe boundary or a formally implemented safe continuation, while preserving the original hall entry/walk/interaction/return checks.
- Pages run `34004203854` passed the repaired legacy contract with REQ-028 implementation present.
- `b6ceb875e685a898051e14cfaee052331eed62f5` re-enabled the REQ-028 dedicated assembled-browser acceptance.
- Pages run `34004233876`: SUCCESS through sequential JavaScript syntax, add-on syntax, static regression, add-on contract, PWA/assets, approved Luke art, assembled browser smoke including REQ-027+REQ-028 compatibility, Dynamic Touch smoke, upload and Pages deploy.
- REQ-028 runtime acceptance verifies hall stair entry, gallery walkability, guard interaction, old-city-map interaction, safe unimplemented-zone boundary, return to hall and safe spawn.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

## COMPLETION CONDITION

- public Pagesで玄関ホール→上階回廊→玄関ホールの往復が成立
- entry / walk / interaction / boundary / returnをbrowser runtimeで再現可能に検証
- existing gameplay/save/input compatibility維持
- 王城全体完成を偽装しない
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
