# REQ-012 — Persistent Treasure Chest System

- ID: REQ-012
- PRIORITY: P1
- STATUS: VERIFY
- TITLE: 探索できる永続宝箱システム
- OWNER INTENT: LUKE QUESTを最後まで遊べるJRPGへ近づける。DIRECTIVEの完成像に含まれる「宝箱」を、既存ゲームを壊さず実プレイへ導入する。

## PURPOSE
フィールド探索に「見つける → 前を向く → 調べる → 報酬を得る → 開封済み外観になる」というJRPGらしい小さな報酬ループを追加する。

## SCOPE
1. 少なくとも3個の宝箱を、既存の安全なマップへ配置する。
2. 宝箱はworld上に視覚表示され、未開封/開封済みが区別できる。
3. プレイヤーが宝箱の隣で宝箱方向を向いてA/actionすると開けられる。
4. 開封時に報酬を1回だけ付与し、dialogueで内容を伝える。
5. 開封状態は既存save()が保存するstate/flagsへ記録し、再描画や再訪で復活しない。
6. 同じ宝箱を何度調べても報酬を重複取得できない。
7. 既存NPC interaction、building entry、battle、Dynamic Touch Controller、save/loadを壊さない。
8. protected story canonを新規開示しない。
9. 外部ゲーム素材をコピーせず、LUKE QUEST独自の軽量表示を使う。

## INITIAL CHESTS
- 王都アルディア: 路地の補給箱 / 12G / `(15,5)`
- 王都近郊: 古い旅人箱 / 18G / `(18,10)`
- 魔物の森・入口: 苔むした探索箱 / 25G / `(20,15)`

## IMPLEMENTATION
- `addons/treasure-chests.js` に3地域の宝箱registryを実装。
- CSSだけで独自の木箱本体・蓋・金属帯・錠前を描画し、emoji/外部素材へ依存しない。
- unopened/openedで蓋と色調が変化する。
- `front()` + `action` wrapperで隣接正面interactionを実装。
- `move` wrapperで宝箱tileへの侵入を止め、既存movementへは宝箱が無い場合そのまま委譲。
- `s.flags` の3固有flagへ開封状態を保存し、開封時にflagを立ててからgold付与・`save()`。
- 開封済み分岐はgoldを再付与せず空箱dialogueのみ。
- world/render wrapperで再描画し、既存宝箱DOMを除去してから再生成するためduplicateしない。
- `pointer-events:none` でDynamic Touch Controllerやworld touchを奪わない。
- `window.LQ_TREASURE_CHEST_STATUS` を公開。

## COMPLETION CONDITIONS
- [x] 3 chest definitions are present and map-specific.
- [x] unopened chest is visibly rendered in world by implementation contract.
- [x] opened chest visibly changes state by implementation contract.
- [x] action while facing adjacent chest opens it by host/action contract.
- [x] reward is guarded to grant exactly once.
- [x] opened state persists through existing save()-serialized state/flags.
- [x] unknown maps / maps without chests remain unaffected.
- [x] runtime status marker exists for automated inspection.
- [x] add-on contract guard covers registry count, unique flags, one-time reward guard, render cleanup/action hook and touch non-interception.
- [x] Node/add-on syntax checks pass in Pages workflow run `33987117818`.
- [x] static/add-on regression passes in Pages workflow run `33987117818`.
- [x] assembled browser smoke remains PASS in Pages workflow run `33987117818`.
- [x] existing floating touch smoke remains PASS in Pages workflow run `33987117818`.
- [x] published Pages deployment succeeds in Pages workflow run `33987117818`.
- [ ] Owner physical iPhone subjective/visual verification. Not claimed.

## AUTOMATED VERIFICATION
Pages workflow run `33987117818` on checkpoint `d96c7e789de3211db3d9d6db889d8dd462c02ff7`: SUCCESS.
Passed sequential patch syntax, collision-safe add-on syntax, static regression, add-on contract, PWA checks, assembled browser smoke, floating touch pointer-drag smoke, artifact upload and Pages deployment.

## DO NOT
- Do not put required story progression inside a chest.
- Do not reveal protected Leon/Glenn/Elisia/Eleanor secrets.
- Do not award the same chest repeatedly.
- Do not make chest DOM intercept touch movement.
- Do not overwrite existing NPC/action behavior when no chest is directly in front.
- Do not call Owner physical iPhone verification PASS without Owner confirmation.
