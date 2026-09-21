# Analyze / 仕様・計画・タスク整合監査

## 結果
**条件付きPASS**

Owner要件 v1.0の主要要求はSpec/Plan/Tasksへ投影されている。実装開始前に次を満たすこと。

## Coverage
- Visual reference/versioning: covered
- AI image 3D contradiction: covered
- landmark/normalized coordinates: covered
- composition thresholds: covered
- multi-view 3D validity: covered
- production order/gates: covered
- Safari/Home Screen: covered
- safe area/touch/lifecycle: covered
- GPU fallback: covered
- auto quality/hysteresis: covered
- performance/stability/load: covered
- visual evidence/performance evidence: covered
- regression/reference update: covered
- Three.js/WebGPU/GLB/KTX2/Meshopt/Draco/TSL/PBR/Instancing/LOD/Baked Lighting: covered in Plan/Tasks
- Three.js replacement gate: covered
- old visual implementation reset/archive/reuse selection: added from Owner decision
- taskstoissues/sub-issues/dependencies/Projects v2/converge: covered

## Blocking before implementation
1. Archive refをremoteへ作り、実際にrollbackできること。
2. Target imageから具体的landmark catalogとROIをG0で作成すること。
3. ReuseInventoryで共通runtimeと旧scene固有コードを分離すること。
4. iPhone実機test profileをEvidenceへ具体機種/OS/browser buildとして保存すること。

## Contradictions resolved
- Pixel-perfect only vs 3D variability: multi-metric + human reviewで解決。
- Three.js fixed vs alternative comparison: first candidate + continuation gateで解決。
- visual quality vs performance: visual priority order + controlled degradationで解決。
- old implementation continuity vs rebuild: archive first + selected reuseで解決。

## No-go
- 旧sceneへ継ぎ足し修正してG1を省略すること。
- G1未合格でG3/G4/G5へ進むこと。
- exact-head evidenceなしでPASSすること。
