# AI見本画像→iPhone高精細3Dゲーム画面 再構築 v1

## Objective
Owner-approved AI target imageを、iPhone上でプレイ可能なリアルタイム3Dゲーム画面として再構築する。

## Source authority
- Spec: `specs/001-target-image-threejs/spec.md`
- Plan: `specs/001-target-image-threejs/plan.md`
- Tasks: `specs/001-target-image-threejs/tasks.md`
- Owner Requirements: `specs/001-target-image-threejs/source/OWNER_REQUIREMENTS_v1.0.md`
- Target blob: `b7281e6580689a7a22cfa3b67d500950e4af7285`

## Owner decision
旧視覚実装を改修元にしない。Remote archiveを作ってから新branchでwhiteboxから再構築し、共通runtimeだけ選別再利用する。

## Completion
G0-G7、iPhone実機、performance/stability、visual evidence、ConvergeまでPASSすること。
