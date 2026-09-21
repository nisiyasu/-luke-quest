# Quickstart / 実装開始手順

1. Spec/Plan/Tasks/AnalyzeがPASSしていることを確認。
2. `prototype/modern-3d` の実装開始時HEADをfresh取得。
3. `archive/pre-target-image-rebuild-20260921` を作成しremoteへpush。
4. 新branch `experiment/target-image-threejs-v1` をarchive pointから作成。
5. ReuseInventoryを作り、REUSE/REWRITE/DELETEを判定。
6. 旧視覚sceneを新branchから切離す。archiveがremoteに存在するまでは削除禁止。
7. G0のReference Set / Canonical State / Landmark Catalog / Evidence baselineを確定。
8. G1はgray primitive whiteboxのみで開始。
9. G1 PASSまでmaterials/lighting/decorative work禁止。
10. 各GateでEvidence Setを保存。
11. Gate FAIL時は最も早いcausal gateへ戻る。
12. G6でiPhone実機performance/lifecycleを通す。
13. G7で最終視覚収束。
14. Converge extensionでSpec/Plan/Tasks/Issues/Implementation/Evidenceを最終照合。
