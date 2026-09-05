# REQ-013 — Hidden Find / Sparkle Item System

- ID: REQ-013
- PRIORITY: P2
- STATUS: IN_PROGRESS
- TITLE: 隠しアイテム / 探索スパークル

## PURPOSE
宝箱とは別系統の探索報酬として、マップの端・草地・街角などに小さな光の手掛かりを置き、近くで調べると一度だけ報酬を得られる「隠しアイテム」を実装する。DIRECTIVEの最終完成像にある「隠しアイテム」を実プレイへ導入する。

## SCOPE
- 3地域以上へ隠し探索ポイントを配置。
- 宝箱より控えめな小さな光/粒子として表示し、pointer inputを奪わない。
- 隣接正面でA/actionすると発見できる。
- 発見後はflagを保存し、再取得不可。
- 報酬は序盤バランスを壊さない少額Goldとする。
- story progressionやprotected秘密は格納しない。
- 既存NPC/action、宝箱、移動、battle、touchを壊さない。

## INITIAL FINDS
- 王都アルディア: 噴水脇の落とし物 / 5G
- 王都近郊: 草むらの古銭 / 8G
- 魔物の森・深部: 根元の光る小銭 / 11G

## COMPLETION CONDITIONS
- [ ] 3 unique map-specific finds.
- [ ] subtle original sparkle presentation.
- [ ] front-facing action interaction.
- [ ] exactly-once reward with unique persistent flags.
- [ ] discovered sparkle disappears.
- [ ] no touch interception.
- [ ] runtime status marker.
- [ ] add-on contract regression.
- [ ] existing assembled browser and floating-touch smoke PASS.
- [ ] Pages deploy PASS.
- [ ] Owner subjective iPhone verification remains VERIFY, not falsely claimed.
