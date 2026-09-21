# Research / 技術判断記録

## R-001 旧画面は改修せず再構築する

**決定**: 旧視覚sceneをpatchの起点にしない。Archiveを作り、新branchでwhiteboxから再構築する。

**理由**:
- 現状は構図・camera・placementの基礎がTargetから外れている。
- 後段patchで直すと補正が連鎖し、構図Gateを検証しにくい。
- Git履歴に旧状態を保存できるため、削除は可逆にできる。

## R-002 Three.jsを第一候補にする

**決定**: Owner付属書どおりThree.jsを第一候補とする。

**条件**:
- Technical SpikeでiPhone実機性能/安定性/視覚要求を満たすこと。
- 満たさなければPlayCanvas/Babylon.js等を比較し、独自rendererへ直行しない。

## R-003 WebGPUを第一経路、WebGL 2をfallback候補とする

**決定**: browser/OS名ではなくcapabilityで選ぶ。

**禁止**:
- WebGPUが存在するだけで本番採用確定
- Safari/iPhoneという名称だけでrenderer決定

## R-004 Reference comparisonはpixel-perfect単独にしない

3D rendering差を考慮し、landmark position、screen occupancy、horizon、occlusion、silhouette IoU、color/light、人間視覚評価を組み合わせる。

## R-005 主要silhouette metric

初期基準85%以上はcanonical viewでのmask IoUとして扱う。Mask生成方法はEvidence Contractで固定する。

## R-006 Project management

Spec Kit標準の `taskstoissues` は平面Issue化の起点として使う。その後、GitHub nativeでSub-issues、Issue Dependencies、Projects v2へ投影する。GitHub IssuesをWork SSOTとし、Projects v2は管理表示面とする。
