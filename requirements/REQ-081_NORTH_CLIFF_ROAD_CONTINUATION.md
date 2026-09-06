# REQ-081 — 北の崖道・第一章追跡ルート継続

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / STORY-PROGRESSION / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

fresh repository realityでは、第一章の主導線は `evacRoute` の北端まで到達しているが、`withdrawProofSeen=true` で北端gate `N` に入っても「レオンの新しい足跡はさらに北へ続いている」と会話するだけで、walkableな次地域へ遷移しなかった。

`AUTONOMOUS_DEV_DIRECTIVE.md` のMISSIONは「iPhoneのブラウザで実際に最後まで遊べる完成作品」へ継続拡張することであり、既存READYが無く、残BACKLOGは生成画像handoff待ちのOwner-only formal artであった。

したがって、既存canonを暴露・変更せず、現在の第一章本線を実際に1地域先へ進める安全なplayer-visible checkpointとして北の崖道を追加した。

## PURPOSE

`withdrawProofSeen` を確認したプレイヤーが北の退避路の北端から、レオンの新しい足跡を追ってwalkableな「北の崖道」へ進めるようにする。

これは最終章やレオン再会の完成を偽装しない。第一章追跡ルートを1つ先へ伸ばす完成単位である。

## ENTRY / RETURN

- `evacRoute` 北端gate `N` は `withdrawProofSeen=false` の既存blockを維持する。
- `withdrawProofSeen=true` の時だけ北端から `northCliffRoad` へ進む。
- 崖道南端から `evacRoute` へ安全に戻れる。
- spawnは壁・NPC・不可侵地形へ埋まらない。
- transition時は `stopMoving()` を維持し、Dynamic Touch stale pointerを残さない。

## MAP / VISUAL REQUIREMENTS

最低限:
- 狭い崖沿いの道
- 岩壁 / 崩れた岩
- 谷側の縁 / 遠景表現
- 風の視覚表現
- 古い道標または安全杭
- レオン追跡を示す既存情報と矛盾しない足跡表現
- 平坦な単色格子・絵文字だけに依存しないCSS/DOM visual density

## INTERACTIONS

canonical Action interactionを4つ実装:
- 新しい足跡
- 折れた安全杭
- 谷を望む岩棚
- 北へ曲がる崖道

会話は序盤情報開示ルールを守る。

## NORTH BOUNDARY

北側には追跡がさらに続くことを自然に示すが、未実装領域へ落下・進入させない。

「開発中」「未実装」等のメタ文言は禁止。

境界文は新しい重大canonを断定せず、「足跡が曲がり角の先へ続いている」程度に留める。

## CANON SAFETY

以下を新規断定・開示しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由
- レオンの逃亡理由の最終回答

既存 `withdrawProofSeen` の意味、既存退避路の証拠、既存ストーリーフラグの意味を変更しない。

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 fullscreen world UI維持
- fixed fallback controls維持
- map transition時中央 `stopMoving()` 維持

## SAVE SAFETY

- old save compatibility維持
- `northCliffRoad` でsave/continueして破綻しない
- 新しい必須story flagを増やさない
- 既存 `withdrawProofSeen` をentry authorityとして再利用する

## TEST REQUIREMENTS

1. `withdrawProofSeen=false` では既存北端blockを維持
2. `withdrawProofSeen=true` + north gateで崖道へ遷移
3. safe spawn / walkable route成立
4. 3つ以上のcanonical interaction成立
5. north boundaryが自然に止める
6. 崖道から退避路へ安全に戻れる
7. save/continue compatibility
8. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
9. protected canon変更なし
10. JavaScript/static/add-on/browser regression PASS
11. public Pages deploy SUCCESS

## IMPLEMENTATION

- Requirement registration: `b3d4e343d907fd15536d711309d2f9125310353c`.
- Queue activation under WIP=1: `114d12017c2d2468ef210b7706837d3f545f1161`.
- Player-visible implementation: `5ac5151a152c356c53081f66bceebeb82d084a47` in `addons/north-cliff-road.js`.
- Dedicated browser acceptance: `b99addbd3807326f7e747ba7070901f01ddc2f79`.
- Pages workflow gate: `83c880d9cbce3e376ef2cfdd7afe8b4ae0413374`.

## AUTOMATED / PUBLIC VERIFICATION

Pages workflow run `34025050191`: SUCCESS.

Dedicated REQ-081 browser gate proved on the assembled application:
- `withdrawProofSeen=false` keeps the existing north gate blocked.
- `withdrawProofSeen=true` enters `northCliffRoad`.
- entry spawn is safe and the route is walkable.
- footprint and north-boundary canonical interactions execute.
- cliff road returns safely to `evacRoute`.
- autosave round-trip preserves `northCliffRoad` map and coordinates.
- runtime contract reports `entryAuthority=withdrawProofSeen`, `newRequiredStoryFlags=0`, `protectedCanonChanged=false`.

The same run also passed sequential JS validation, collision-safe add-ons, static/add-on contracts, autosave/PWA/raster/Luke checks, assembled browser regression, REQ-001/021 floating touch plus 390x844 iPhone fullscreen visual-liveness, site upload and Pages deployment.

`IOS_PHYSICAL_VERIFICATION = PENDING`; automated CI does not claim Owner physical iPhone approval.

## COMPLETION CONDITION

- public Pagesで `evacRoute -> northCliffRoad -> evacRoute` の安全な往復が成立: AUTOMATED PASS
- `withdrawProofSeen` gate authorityを維持: PASS
- walk / interactions / north boundary / save/input compatibilityを自動検証: PASS
- Pages SUCCESS: PASS (`34025050191`)
- Owner physical iPhone / subjective visual verification前はVERIFY: PENDING
