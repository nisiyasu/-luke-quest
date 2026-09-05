# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative inventory of Owner-requested implementation work, priority and execution state.

## ACTIVE / QUEUE

| ORDER | ID | PRIORITY | STATUS | TITLE | REQUIREMENT | NOTE |
|---:|---|---|---|---|---|---|
| 1 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` | 正式WebP transport + dialogue guard + Pages CI成功を確認。Owner実機/見た目確認待ち |
| 2 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` | v1.2。専用pointer-drag browser regressionで表示、dead zone、右移動、方向切替、release停止、timer cleanupまでPASS。Pages workflow run 33981782391 SUCCESS。残りはOwner iPhone実機操作感確認 |
| 3 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` | 4方向×3frame WebP stripsを実playerへ統合。static/addon/browser/Pages PASS。Owner見た目/iPhone確認待ち |
| 4 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD | 正式アート要件/素材確定待ち。仮SVGを最終品質扱いしない |
| 5 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD | ルーク/レオンとの世界観統一 |
| 6 | REQ-006 | P1 | VERIFY | 敵絵文字を完全オリジナル敵画像へ置換 | `requirements/REQ-006_ORIGINAL_ENEMY_ART.md` | 通常敵18種をoriginal SVG battle-art registryへ移行。contract/static/browser/Pages run 33982213456 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 7 | REQ-007 | P1 | VERIFY | 地域別戦闘背景画像の正式化 | `requirements/REQ-007_ORIGINAL_BATTLE_BACKGROUNDS.md` | 6通常遭遇地域へdistinct original SVG battle backdropを実装。contract/static/browser/Pages run 33982352056 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 8 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` | Checkpoint A-C実装、最新CのPages workflow run 33980792050 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 9 | REQ-011 | P1 | VERIFY | 冒険ジャーナル / メイン目的・手掛かり・サブクエ追跡 | `requirements/REQ-011_ADVENTURE_JOURNAL.md` | spoiler-safe journal実装。main/clues/3 side quests + contract guard。Pages run 33984155835 SUCCESS。Owner iPhone可読性/主観確認待ち |
| 10 | REQ-012 | P1 | VERIFY | 探索できる永続宝箱システム | `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` | 王都/近郊/森入口へ3宝箱。1回限定G報酬、opened visual、collision、save flag、contract/browser/touch/Pages run 33987117818 SUCCESS。Owner iPhone見た目確認待ち |
| 11 | REQ-014 | P1 | VERIFY | ストーリー進行で町人会話が変化するNPCリアクション | `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` | 王都3NPC+近郊1NPCを既存canonical flagsの6段階projectionへ接続。秘密の先出しなし。自動contract追加、Pages検証待ち |
| 12 | REQ-013 | P2 | VERIFY | 隠しアイテム / 探索スパークル | `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` | 王都/近郊/森深部へ3探索光。正面action、1回限定G報酬、発見後消失、save flag、contract/browser/touch/Pages run 33987250241 SUCCESS。Owner iPhone見た目確認待ち |
| 13 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` | 王都近郊→森入口→深部のA-C実装。Pages workflow run 33981010791全工程SUCCESS。Owner主観/iPhone見た目確認待ち |
| 14 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` | 南門宿・屋根裏談話室を追加。実entry/exit browser smokeを含むPages workflow run 33981620155 SUCCESS。Owner主観/iPhone見た目確認待ち |

## STATUS DEFINITIONS

### BACKLOG
Owner request is preserved, but detailed implementation specification or scheduling is not yet ready.

### READY
Requirement is sufficiently defined and may be selected when no higher-priority IN_PROGRESS work exists.

### IN_PROGRESS
Currently being implemented. `WIP_LIMIT = 1`.

### BLOCKED
Cannot safely continue until an external condition or Owner decision changes. A blocked requirement does not stop development.

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
8. If the remaining BACKLOG items are Owner-only formal-art decisions/assets, register a new directive-authorized player-visible requirement that advances an explicitly unfinished final-game capability without changing protected canon, then execute it under WIP=1.

## QUEUE INVARIANTS

- Do not delete unfinished Owner requests to make the queue look clean.
- Do not claim `DONE` because an image was merely generated in chat or code was merely written.
- Do not keep more than one `IN_PROGRESS` item unless Owner explicitly changes WIP policy.
- Requirement completion must be judged against the detailed requirement file.
- Queue updates, commits, CURRENT updates and Pages success are checkpoints, not reasons to end execution.
