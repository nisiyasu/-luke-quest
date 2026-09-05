# REQ-013 — Hidden Find / Sparkle Item System

- ID: REQ-013
- PRIORITY: P2
- STATUS: VERIFY
- TITLE: 隠しアイテム / 探索スパークル

## PURPOSE
宝箱とは別系統の探索報酬として、マップの端・草地・街角などに小さな光の手掛かりを置き、近くで調べると一度だけ報酬を得られる「隠しアイテム」を実装する。DIRECTIVEの最終完成像にある「隠しアイテム」を実プレイへ導入する。

## IMPLEMENTED FINDS
- 王都アルディア: 噴水脇の落とし物 / 5G / `(7,10)` / `lqFindTownFountainCoin`
- 王都近郊: 草むらの古銭 / 8G / `(4,14)` / `lqFindFieldGrassCoin`
- 魔物の森・深部: 根元の光る小銭 / 11G / `(20,17)` / `lqFindDeepRootCoin`

## IMPLEMENTATION
- `addons/hidden-finds.js` に3地域の探索ポイントを登録。
- 宝箱より控えめな十字光＋中心粒子をCSSで描画し、外部素材やemojiへ依存しない。
- `prefers-reduced-motion` を尊重し、通常時のみ緩やかなpulseを使用。
- `front()` + `action` wrapperで正面隣接interaction。
- 発見時は固有flagを立ててからgoldを付与して`save()`。
- current find listは発見済みflagを除外するため、再描画/再訪で光が復活しない。
- `pointer-events:none` でDynamic Touch Controllerやworld inputを奪わない。
- world/render wrapperは既存find DOMを除去して再生成し、duplicateを防ぐ。
- `window.LQ_HIDDEN_FIND_STATUS` でruntime statusを公開。

## COMPLETION CONDITIONS
- [x] 3 unique map-specific finds.
- [x] subtle original sparkle presentation.
- [x] front-facing action interaction.
- [x] exactly-once reward with unique persistent flags.
- [x] discovered sparkle disappears by persistent flag filter.
- [x] no touch interception.
- [x] runtime status marker.
- [x] add-on contract regression PASS.
- [x] existing assembled browser smoke PASS.
- [x] existing floating-touch smoke PASS.
- [x] Pages deploy PASS.
- [ ] Owner subjective iPhone verification. Not claimed.

## AUTOMATED VERIFICATION
Pages workflow run `33987250241` on checkpoint `9459da5615ae76bac93297314a10674cb9531940`: SUCCESS.
Passed sequential patch syntax, collision-safe add-on syntax, static regression, add-on contract, PWA/asset validation, assembled browser smoke, floating-touch pointer-drag smoke, upload and Pages deployment.

## DO NOT
- Do not place required story progression in hidden finds.
- Do not reveal protected story secrets.
- Do not allow repeated reward collection.
- Do not make sparkle DOM intercept touch input.
- Do not falsely claim Owner physical iPhone verification.
