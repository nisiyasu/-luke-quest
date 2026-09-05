# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative inventory of Owner-requested implementation work, priority and execution state.

## ACTIVE / QUEUE

| ORDER | ID | PRIORITY | STATUS | TITLE | REQUIREMENT | NOTE |
|---:|---|---|---|---|---|---|
| 1 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` | 正式WebP transport + dialogue guard + Pages CI成功を確認。Owner実機/見た目確認待ち |
| 2 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` | v1.2。方向切替timer残留に加え、通常walk renderでhold入力が解除される不具合を修正。static/addon/browser/Pages PASS。Owner iPhone操作感確認待ち |
| 3 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` | 4方向×3frame WebP stripsを実playerへ統合。static/addon/browser/Pages PASS。Owner見た目/iPhone確認待ち |
| 4 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD | 正式アート要件/素材確定待ち。仮SVGを最終品質扱いしない |
| 5 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD | ルーク/レオンとの世界観統一 |
| 6 | REQ-006 | P1 | BACKLOG | 敵絵文字を完全オリジナル敵画像へ置換 | TBD | 地域別3〜5種＋将来ボス専用画像 |
| 7 | REQ-007 | P1 | BACKLOG | 地域別戦闘背景画像の正式化 | TBD | CSS背景を最終品質扱いしない |
| 8 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` | Checkpoint A-C実装、最新CのPages workflow run 33980792050 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 9 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` | 王都近郊→森入口→深部のA-C実装。Pages workflow run 33981010791全工程SUCCESS。Owner主観/iPhone見た目確認待ち |
| 10 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` | 南門宿・屋根裏談話室を追加。実entry/exit browser smokeを含むPages workflow run 33981620155 SUCCESS。Owner主観/iPhone見た目確認待ち |

## STATUS DEFINITIONS

### BACKLOG
Owner request is preserved, but detailed implementation specification or scheduling is not yet ready.

### READY
Requirement is sufficiently defined and may be selected when no higher-priority IN_PROGRESS work exists.

### IN_PROGRESS
Currently being implemented. `WIP_LIMIT = 1`.

### BLOCKED
Cannot safely continue until an external condition or Owner decision changes. A blocked requirement does not stop independent work.

### VERIFY
Implementation is sufficiently complete for verification. Typical examples are Owner physical iPhone feel-check or subjective visual approval. VERIFY does not consume the IN_PROGRESS WIP slot.

### DONE
All completion conditions that can legitimately be claimed have been satisfied.

### SUPERSEDED
Replaced by a newer requirement. Keep historical entry and record replacement ID.

### CANCELLED
Explicitly cancelled by Owner.

## PRIORITY DEFINITIONS

### P0 — IMMEDIATE
Owner direct request, severe bug, severe UX/input defect, active canonical-visual correction, or work explicitly ordered first by Owner.

### P1 — HIGH
Major player-visible quality, core gameplay, presentation, visual-quality or content improvement.

### P2 — MEDIUM
Important expansion after P0/P1 work.

### P3 — LOW
Future polish, optional content and non-urgent enhancement.

## SELECTION RULE

1. Recover existing `IN_PROGRESS` first.
2. If none exists, select highest-priority `READY`.
3. Within equal priority, explicit ORDER wins.
4. Owner's newest direct request may be promoted/reordered immediately.
5. `VERIFY` does not block selecting new `READY` work.
6. A single `BLOCKED` item does not stop development.
7. When all higher-priority items are VERIFY/BACKLOG and no READY exists, detail the highest-value safe BACKLOG requirement that does not require unavailable Owner-only assets/decisions, then move it to IN_PROGRESS.

## QUEUE INVARIANTS

- Do not delete unfinished Owner requests to make the queue look clean.
- Do not claim `DONE` because an image was merely generated in chat or code was merely written.
- Do not keep more than one `IN_PROGRESS` item unless Owner explicitly changes WIP policy.
- Requirement completion must be judged against the detailed requirement file.
- Queue updates, commits, CURRENT updates and Pages success are checkpoints, not reasons to end execution.
