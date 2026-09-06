# REQ-093 — 北の崖道・風切り峠への追跡ルート継続

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / STORY-PROGRESSION / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

fresh repository realityでは、第一章追跡ルートは `northCliffRoad` までwalkableになっているが、北端の「北へ曲がる崖道」はinteraction文だけで止まり、足跡はその先へ続くと示されている。

REQ-081自身も北境界を「追跡がさらに続くが未実装領域へ進入させない」安全checkpointとして定義している。Owner最新P0のiPhone UI/camera修復はREQ-092としてpublic automated PASS / VERIFYへ到達しており、残るREADY/IN_PROGRESSは無い。AUTONOMOUS_DEV_DIRECTIVEの最終目的はiPhoneで最後まで遊べる作品へ本線を継続することなので、既存canonを暴露・変更せず、追跡ルートをもう1地域だけ安全に前進させる。

## PURPOSE

`northCliffRoad` 北端の既存「北へ曲がる崖道」をcanonical Actionで調べた時、walkableな次地域「風切り峠」へ進めるようにする。

これはレオン再会や章完結を偽装しない。既存の「足跡がさらに北へ続く」という情報を、実際に歩ける1地域へ変換するplayer-visible checkpointである。

## ENTRY / RETURN

- `northCliffRoad` の既存北境界interactionを入口authorityとして再利用する。
- 新しい必須story flagは追加しない。
- entry時は中央 `stopMoving()` を必ず通し、stale pointer / movement timerを残さない。
- `windcutPass` 南端から `northCliffRoad` へ安全に戻れる。
- spawnは壁/NPC/不可侵地形へ埋まらない。

## MAP / VISUAL REQUIREMENTS

風切り峠は北の崖道と視覚的につながるが、同じmapのコピーにはしない。

最低限:

- 風で削られた細い岩道
- 岩壁と谷側の高低差
- 強風を示す視覚演出
- 崩れかけた石積み/道標
- 足跡または擦れた靴跡による追跡継続
- 遠景/雲/風のpresentation
- 絵文字だけ、平坦な単色gridだけで最終品質扱いしない

## INTERACTIONS

canonical Action interactionを最低4つ:

1. 岩陰に残る靴跡
2. 風で傾いた古い道標
3. 谷を渡る遠い物音/視界
4. 北へ続く尾根道の境界

台詞はルークの天然/ビビり/それでも追う性格を保つ。

## NORTH BOUNDARY

北側はさらに追跡が続くことを自然に示すが、このREQでは次の重大イベントや秘密を確定しない。

禁止:

- 「未実装」「開発中」等のメタ文言
- レオンの逃亡理由の最終回答
- グレン/ルークの血縁開示
- ルークの父の正体
- エリシア/エレノア/魔王の核心秘密
- 水晶反応の完全理由

## ENCOUNTER / GAMEPLAY

- `windcutPass` は通常エンカウント可能。
- 既存 `EVAC_ENEMIES` または現在の北側routeに既に許可されたcanonical enemy poolを再利用する。
- 新しい敵identityをこのREQのためだけに作らない。
- entry/return直後にはencounter graceを設定する。
- duplicate battle loopを作らない。

## INPUT / CAMERA / MOBILE SAFETY

必ず保持:

- REQ-021 short tap -> canonical `action()` exactly once
- drag -> movement / drag release no Action
- REQ-001 Dynamic Touch pointer ownership / dead zone / central stopMoving()
- REQ-022 100dvh fullscreen world
- REQ-034 black-world repair
- REQ-092 top-HUD safe player framing / controller transparency / portrait camera scale 0.88

map transition後のDOM rerenderでpointer/timerが残留しない。

## SAVE SAFETY

- old save compatibility維持
- `windcutPass` 上でsave/continueして破綻しない
- required story flag追加なし
- canonical map/location serialization pathを再利用

## TEST REQUIREMENTS

1. `northCliffRoad` 既存北境界Actionから `windcutPass` へ遷移
2. transition時stopMoving / safe spawn
3. walkable route成立
4. 4 canonical interactions成立
5. north boundaryは自然に止める
6. south returnで `northCliffRoad` へ安全帰還
7. encounter uses existing canonical pool + grace
8. save/continue round-trip
9. protected canon unchanged / required story flag count remains 0
10. REQ-021/001/022/034/092 regressions PASS
11. JavaScript/static/add-on/assembled browser PASS
12. 390x844 fullscreen/touch visual-liveness PASS
13. public Pages deploy SUCCESS

## COMPLETION CONDITION

Automated completion:

- public Pagesで `northCliffRoad -> windcutPass -> northCliffRoad` が成立
- walk/interactions/north boundary/encounter/save/input/camera regressions PASS
- Pages SUCCESS

Physical/subjective completion:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner checks actual iPhone feel/visibility.

Requirement creation/implementation/Pages success/VERIFYは自律開発の停止理由ではない。

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration checkpoint: `0402e96e375377bd0c0d6ae8b0fdf2d1f67467e6`.
- Implementation checkpoint: `76228f444a2acfb6bd0fe777cdc1840836549f58`.
- Dedicated REQ-081/093 assembled-browser smoke expansion: `44c158aaed1aae7d1a6e9dbe514f660d06744e09`.
- Legacy REQ-081 smoke compatibility hardening: `6b1dd56eb79a7eee5148c7af2a2f51a302dea0dd`.
- Dedicated smoke asserts Windcut entry, safe spawn, walkability, all four canonical interactions, safe north boundary, south return, canonical encounter-pool reuse, save round-trip and protected-canon safety while preserving REQ-081 legacy assertions.
- GitHub Pages workflow run `34032450470` on HEAD `6b1dd56eb79a7eee5148c7af2a2f51a302dea0dd`: SUCCESS.
- PUBLIC_BUILD_INCLUSION: PASS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.
