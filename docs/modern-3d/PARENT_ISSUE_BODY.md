# [EPIC][MODERN-3D] LUKE QUEST Modern 3D Visual Prototype — M00–M12

## Purpose
王都近郊フィールドの1画面相当エリアを、Three.jsによるモダン3D JRPG風の、実際に移動できる技術・美術検証として制作する。

「プレステ初期」は品質上限ではない。既存DOM/CSS維持、簡易形状だけの実装、1回処理で完成することを品質制約にしない。

## Canonical full execution plan
- Branch source: `experiment/gold-vertical-slice`
- Full plan: `docs/modern-3d/LUKE_QUEST_MODERN_3D_EXECUTION_PLAN_v2.md`
- Work log template: `docs/modern-3d/ISSUE_WORK_LOG_TEMPLATE.md`
- Document ID: `LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2`

Immutable registration commit containing the full plan: `1aa7f823e797544e18dfe3b79bf55413c8b8a765`

## Visual reference authority
### Minimum line
`assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png`

### Final target
`assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png`

Owner latest authority:
- second image = `MINIMUM_QUALITY_LINE.png` = minimum acceptable quality floor
- third image = `TARGET_PS1_FINAL.png` = primary final visual destination
- reaching the minimum line alone is **not** final completion
- `CURRENT_BAD.png` is historical/before evidence only

## Management model
This parent Issue is the command/index surface. Detailed work lives in 13 stage Issues, M00–M12.

Every loop resumes by reading only:
1. this parent Issue
2. the current active Mxx Issue
3. code/assets required by that stage

Do not reread every Issue or full history each run unless recovery/audit specifically requires it.

## Critical execution rules
- **Registration and execution start are separate.** Creating these Issues does not mean M00 has started.
- **Do not close a stage just because it was processed once.** Close only after its acceptance condition is supported by evidence.
- **M00 must verify actual execution capabilities available to the normal chat/runtime.** 3D asset production, browser execution, screenshots/video/evidence must not be claimed if unavailable. Record blockers and continue any safe independent work.
- No automatic Gold replacement, main merge, new schedule, or unapproved paid asset purchase.
- Owner subjective visual approval and physical iPhone verification are never inferred from CI.

## Stage index
- M00 — 独立プロトタイプの準備
- M01 — 画作りと比較契約
- M02 — Three.js実行基盤
- M03 — 仮形状で構図と通行を検証
- M04 — 本制作アセット
- M05 — 代表画面の美術品質ゲート
- M06 — 地形・植生・橋の完成
- M07 — 水・照明・空気感
- M08 — 人物・移動・カメラ
- M09 — 全エリアとUI
- M10 — iPhone最適化・配布物
- M11 — 最終比較・不足修正
- M12 — Goldへの移植設計

## Current stage
`REGISTERED_NOT_STARTED`

Next executable stage after explicit execution start: `M00`

## Whole-program completion condition
The program is not complete until the plan's stage gates have been satisfied in sequence or through an explicitly recorded return/rework path, with evidence. In particular:
- the playable prototype exists and runs
- representative art quality is not materially below the required visual direction
- `MINIMUM_QUALITY_LINE.png` is a floor, not the destination
- remaining gap toward `TARGET_PS1_FINAL.png` has been materially closed and evaluated
- high-quality and iPhone-practical presets are evaluated separately
- gameplay input/movement stability is verified for the prototype scope
- final comparison/rework M11 is complete or waiting only on explicit Owner subjective/physical verification
- M12 contains a concrete Gold integration design or a documented hold decision

## Per-session record
Append to the **active Mxx Issue**:
- implementation/work performed
- commit SHA
- screenshot/video evidence
- verification results
- unfinished work
- exact next action

Use `docs/modern-3d/ISSUE_WORK_LOG_TEMPLATE.md`.

## Status
REGISTRATION: IN_PROGRESS
EXECUTION: NOT_STARTED
OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
