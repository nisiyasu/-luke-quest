# Requirements Quality Checklist / 要件品質監査

## Source fidelity
- [x] Owner原文を無改変で保存する場所を定義した。
- [x] 第I部と第II部の責務を分離した。
- [x] Target identityをfull identityで固定した。
- [x] Owner追加決定「旧視覚実装を改修しない」を明示した。

## Visual measurability
- [x] P0 center toleranceが数値化されている。
- [x] screen occupancy toleranceが数値化されている。
- [x] horizon toleranceが数値化されている。
- [x] occlusion orderが数値/真偽で判定できる。
- [x] silhouette metricの測定方式をclarifyした。
- [x] human visual scoreをnumeric metricsと併用する。

## Gate discipline
- [x] Whitebox composition前に本制作へ進めない。
- [x] 3D validity前にArt Gateへ進めない。
- [x] 後段変更で前段PASSを再検証する。
- [x] FAILはearliest causal gateへrouteする。

## Playability / iPhone
- [x] SafariとHome Screenを含む。
- [x] safe area / touch / lifecycleを含む。
- [x] GPU fallbackを含む。
- [x] performance thresholdを含む。
- [x] 30分と20回再入場を含む。
- [x] iPhone実機最終Gateを含む。

## Technical-plan separation
- [x] Three.js/WebGPU/GLB/KTX2等をPlan側へ分離した。
- [x] Three.js継続Gateと代替比較Gateを含む。
- [x] 独自rendererへの早すぎる移行を禁止した。

## Work graph
- [x] Taskstoissuesを定義した。
- [x] Sub-issuesを定義した。
- [x] Issue Dependenciesを定義した。
- [x] GitHub Projects v2を管理表示と定義した。
- [x] Convergeを最終収束Gateとして定義した。
