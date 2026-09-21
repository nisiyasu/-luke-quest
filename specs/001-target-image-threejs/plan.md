# 実装計画: AI見本画像からiPhone高精細3Dゲーム画面を再構築する

**Branch**: `spec/target-image-to-threejs-20260921`  
**Date**: 2026-09-21  
**Spec**: `spec.md`  
**Owner技術付属書**: `source/OWNER_REQUIREMENTS_v1.0.md` 第II部

## 1. Summary / 概要

現行の視覚sceneを継ぎ足し改修せず、復旧点を保存してから新しいimplementation branchを作る。共通runtimeだけを選別再利用し、最初は灰色のprimitiveによるwhiteboxでターゲット静止画の構図を合わせる。

実装の第一候補はThree.js。WebGPUを第一描画経路、WebGL 2をfallback候補とする。モデルはglTF 2.0/GLB、textureはKTX2/Basis Universal、geometry圧縮はMeshoptとDracoを実機比較する。WebGPU独自表現はThree.js TSLを優先し、PBR、Instancing、LOD、Baked Lighting、Dynamic Resolutionを利用候補とする。

## 2. Technical Context / 技術条件

- Language: JavaScript / TypeScript境界は既存runtime調査後に固定
- Primary runtime candidate: Three.js
- Primary renderer candidate: WebGPURenderer / WebGPU
- Fallback renderer: WebGL 2
- Asset format: glTF 2.0 / GLB
- Texture: KTX2 + Basis Universal
- Geometry compression: Meshopt first comparison, Draco comparison candidate
- Shader authoring: TSL first choice for WebGPU-specific custom expression
- Material: PBR
- Repeated objects: Instancing
- Distance optimization: LOD
- Static background lighting: Baked Lighting where feasible
- Target platform: iPhone Safari + Home Screen Web App
- Canonical viewport: 941x1672, DPR=1
- High-quality target profile: iPhone 15 Pro equivalent
- Minimum target profile: iPhone 13 equivalent
- Initial load target: playable <= 8s at ~20Mbps
- Sustained test: 30 minutes
- Re-entry test: >=20 cycles

## 3. 既存コードの扱い

### 3.1 Archive first
実装開始前に現行 `prototype/modern-3d` HEADをarchive tag/branchへ保存する。復旧可能性確認後にだけ旧視覚sceneコードを新implementation branchから除去する。

推奨:
- archive ref: `archive/pre-target-image-rebuild-20260921`
- implementation branch: `experiment/target-image-threejs-v1`

### 3.2 Reuse whitelist
次を「視覚構図と独立していること」をコード監査・smoke testで確認してから再利用候補にする。
- player core
- movement
- input
- camera controller共通部分
- traversal/collision共通部分
- asset loader
- runtime bootstrap
- diagnostics/performance instrumentation

### 3.3 Delete/replace candidates
次は新branchで原則削除または切離し対象。
- old scene layout
- old visual offsets
- old target-specific landmark placement
- accumulated visual patch files
- scene-specific DOM/CSS/addon
- old composition acceptance assumptions

削除はinventoryとrollback point確立後に行う。

## 4. Phase 0: Research / 技術実証

Technical Spikeで次を同一基準sceneで測定する。

- iPhone actual device
- WebGPU
- WebGL 2 fallback
- GLB loading
- KTX2
- PBR
- shadows
- instancing
- LOD
- dynamic resolution
- quality switching
- canonical target comparison
- 30-minute stability

### Renderer adoption gate
WebGPU availableだけで採用確定しない。
WebGPU vs WebGL 2を視覚差、frame performance、long-run stability、GPU errors、memory、missing featureで比較する。

### Three.js continuation gate
Three.jsが要求を満たせば採用継続。満たさない場合、独自renderer/大量workaroundへ進む前にPlayCanvas/Babylon.js等を比較する。

## 5. Phase 1: Design / 設計

成果物:
- Reference Set schema
- Landmark / ROI schema
- Verification View schema
- Evidence Set schema
- Performance Evidence schema
- Quality Profile schema
- Gate Record schema
- Runtime capability/fallback decision table
- Reuse inventory
- Archive/rollback plan

## 6. Scene Gate実装順

### G0 Reference / Baseline
- target authority
- current/bad baseline
- canonical state
- landmarks
- role split across multiple references

### G1 Whitebox Composition
primitive only:
- ground
- cliff/shore/water volume
- bridge/main architecture volume
- tree masses
- player proxy
- distant silhouettes
- canonical camera

合格までmaterial、lighting、decorative art禁止。

### G2 3D Validity
- canonical + two extra viewpoints
- depth
- occlusion
- parallax
- traversal
- camera movement

### G3 Model & Material
- production models
- PBR
- texture/compression
- silhouette preservation

### G4 Lighting & Color
- light direction
- brightness
- color temperature
- shadow policy
- baked/real-time split

### G5 Background & Decoration
- density
- distant objects
- micro props
- non-critical effects

### G6 iPhone Runtime
- Safari
- Home Screen
- safe area
- touch
- lifecycle
- renderer fallback
- quality presets
- dynamic resolution
- performance/stability/load

### G7 Final Convergence
- actual iPhone capture
- direct target comparison
- overlay/diff
- landmark metrics
- visual score
- residual gaps
- final regression

## 7. Visual evidence architecture

各主要GateのEvidence Set:
- target identity
- target image
- actual image
- overlay/diff image
- landmark measurements
- silhouette metrics
- human visual ratings
- implementation HEAD
- device/profile
- viewport
- verdict
- residual gaps
- timestamp

PASSはEvidence Setが揃った場合のみ成立する。

## 8. Quality degradation order

品質低下は原則:
1. internal resolution
2. high-cost post effects
3. shadow quality
4. distant detail
5. distant decoration

camera、main composition、P0 landmark geometryは劣化対象にしない。

## 9. Project Structure / 想定構造

```text
specs/001-target-image-threejs/
├── source/
│   └── OWNER_REQUIREMENTS_v1.0.md
├── spec.md
├── clarifications.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── visual-evidence-contract.md
│   └── work-graph-contract.md
├── checklists/
│   └── requirements.md
├── tasks.md
├── analyze.md
├── issue-map.md
└── DEVELOPMENT_PIPELINE_v1.md
```

実装sourceの具体パスはarchive/reuse inventoryで確定する。Plan段階では既存の `prototypes/modern-3d` を直接改修することを前提にしない。

## 10. Constitution Check / 憲法確認

- Exact Target Authority: PASS
- Composition Before Detail: PASS
- Coordinate and Anchor Discipline: PASS
- Evidence-Gated Acceptance: PASS
- Playable Scene, Not a Poster: PASS
- Fail Closed and Route Back: PASS
- Planning workspace isolation: PASS

## 11. Complexity Tracking

独自engine/独自rendererは既定案にしない。Three.js標準、browser標準、既存mature solutionを優先する。Capability gapが出た場合は代替既存基盤を比較してからcustom buildを判断する。
