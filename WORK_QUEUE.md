# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative inventory of Owner-requested implementation work, priority and execution state.

## ACTIVE / QUEUE

| ORDER | ID | PRIORITY | STATUS | TITLE | REQUIREMENT | NOTE |
|---:|---|---|---|---|---|---|
| 1 | REQ-021 | P0 | VERIFY | 画面のどこを短くタップしてもAアクション | `requirements/REQ-021_TAP_ANYWHERE_ACTION.md` | unified pointer surfaceをfresh再監査。tap=canonical Action 1回、drag=no Action。Dynamic Touch強化後のPages run 34001051996 SUCCESS。Owner iPhone実機確認待ち |
| 2 | REQ-022 | P0 | VERIFY | iPhone全画面World UI / 操作UIをマップ上へ同居 | `requirements/REQ-022_IPHONE_FULLSCREEN_WORLD_UI.md` | 100dvh world + status/controls/A/MENU/dialogue overlay + camera recenter。Dynamic Touch強化後のPages run 34001051996 SUCCESS。Owner iPhone実機確認待ち |
| 3 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` | Owner再監査要求を受けv1.5へ視認性強化。168px高コントラスト4-way UI + dead zone/hold/方向変更/release/cancel/blur/rerender/map-transition/UI exclusionをCI固定。Pages run 34001051996 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 4 | REQ-023 | P0 | VERIFY | 北の退避路・進行必須手掛かりの導線修正 | `requirements/REQ-023_EVAC_ROUTE_CRITICAL_GUIDANCE.md` | 左下の撤収命令を具体的objective+pulse markerで案内。取得後は北端へ即誘導。既存gate/story不変。Pages run 33996304585 SUCCESS。Owner実機導線確認待ち |
| 5 | REQ-024 | P1 | VERIFY | 王都アルディア・民家内部 | `requirements/REQ-024_ALDIA_CIVILIAN_HOME_INTERIOR.md` | walkable民家・住民/小物interaction・安全な退出を実装。修復checkpoint `43ba4e88...` のPages run 33997076846 SUCCESS。Owner実機/見た目確認待ち |
| 6 | REQ-025 | P1 | VERIFY | 王都アルディア・王城門衛詰所 | `requirements/REQ-025_ALDIA_CASTLE_GATEHOUSE_INTERIOR.md` | canonical entry/walk/guard+prop interaction/exit/safe spawnを専用runtime probeで固定。Pages run 34001139669 SUCCESS。Owner実機/見た目確認待ち |
| 7 | REQ-026 | P1 | VERIFY | 王都アルディア・王城前庭 | `requirements/REQ-026_ALDIA_CASTLE_COURTYARD.md` | 門衛詰所→前庭entry/walk/landmark/interaction/本館境界/returnをruntime probeで固定。Pages run 34001268066 SUCCESS。Owner実機/見た目確認待ち |
| 8 | REQ-027 | P1 | IN_PROGRESS | 王都アルディア・王城玄関ホール | `requirements/REQ-027_ALDIA_CASTLE_ENTRANCE_HALL.md` | 前庭大扉から入る最初の王城本館内部。実装 + dedicated runtime acceptanceをcheckpoint済み。Pages/public verification進行中 |
| 9 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` | 正式WebP transport + dialogue guard + Pages CI成功を確認。Owner実機/見た目確認待ち |
| 10 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` | 4方向×3frame WebP stripsを実playerへ統合。static/addon/browser/Pages PASS。Owner見た目/iPhone確認待ち |
| 11 | REQ-016 | P1 | VERIFY | MP / 戦闘技システム | `requirements/REQ-016_MP_SKILL_SYSTEM.md` | 永続MP 10/10 + 初期技「蒼閃」4MP。旧save migration、level-up/敗北回復、static/browser/touch/Pages run 33992924664 SUCCESS。Owner iPhone戦闘感確認待ち |
| 12 | REQ-017 | P1 | VERIFY | 敵ドロップ / 戦利品システム | `requirements/REQ-017_ENEMY_DROP_SYSTEM.md` | 通常敵18種をcanonical薬草/煙玉drop tableへ接続。+1上限、unknown fallback、既存EXP/G保持、Pages run 33993065410 SUCCESS。Ownerバランス/iPhone感確認待ち |
| 13 | REQ-018 | P2 | VERIFY | 蒼閃の専用戦闘フィードバック | `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md` | 青斬撃、敵hit、MP消費/不足feedbackをpresentation-onlyで実装。reduced-motion/cleanup/state-mutation guard、Pages run 33993208928 SUCCESS。Owner見た目/iPhone確認待ち |
| 14 | REQ-019 | P2 | VERIFY | 回復地点のMP整合性 | `requirements/REQ-019_MP_RECOVERY_POINTS.md` | 焚き火MP全回復＋旅人の祠35%MP回復。既存HP/flag維持。Pages run 33993422174 SUCCESS。Owner iPhone回復感確認待ち |
| 15 | REQ-020 | P2 | VERIFY | 図鑑へ敵ドロップ情報を接続 | `requirements/REQ-020_BESTIARY_DROP_INTEL.md` | REQ-017 authorityのdrop labelを発見済み図鑑へsingle-source表示。確率非表示、unknown fallback。Pages run 33993594188 SUCCESS。Owner iPhone可読性確認待ち |
| 16 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD | 正式アート要件/素材確定待ち。仮SVGを最終品質扱いしない |
| 17 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD | ルーク/レオンとの世界観統一 |
| 18 | REQ-006 | P1 | VERIFY | 敵絵文字を完全オリジナル敵画像へ置換 | `requirements/REQ-006_ORIGINAL_ENEMY_ART.md` | 通常敵18種をoriginal SVG battle-art registryへ移行。contract/static/browser/Pages run 33982213456 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 19 | REQ-007 | P1 | VERIFY | 地域別戦闘背景画像の正式化 | `requirements/REQ-007_ORIGINAL_BATTLE_BACKGROUNDS.md` | 6通常遭遇地域へdistinct original SVG battle backdropを実装。contract/static/browser/Pages run 33982352056 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 20 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` | Checkpoint A-C実装、最新CのPages workflow run 33980792050 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 21 | REQ-011 | P1 | VERIFY | 冒険ジャーナル / メイン目的・手掛かり・サブクエ追跡 | `requirements/REQ-011_ADVENTURE_JOURNAL.md` | spoiler-safe journal実装。main/clues/3 side quests + contract guard。Pages run 33984155835 SUCCESS。Owner iPhone可読性/主観確認待ち |
| 22 | REQ-012 | P1 | VERIFY | 探索できる永続宝箱システム | `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` | 王都/近郊/森入口へ3宝箱。1回限定G報酬、opened visual、collision、save flag、contract/browser/touch/Pages run 33987117818 SUCCESS。Owner iPhone見た目確認待ち |
| 23 | REQ-014 | P1 | VERIFY | ストーリー進行で町人会話が変化するNPCリアクション | `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` | 王都3NPC+近郊1NPCを既存canonical flagsの6段階projectionへ接続。秘密の先出しなし。Pages run 33989872020 SUCCESS。Owner iPhone/主観確認待ち |
| 24 | REQ-015 | P1 | VERIFY | 宝箱探索を実アイテム報酬へ拡張 | `requirements/REQ-015_ITEM_TREASURE_CACHES.md` | 深部/霧/監視区域へ3補給cache。薬草×2、煙玉×1、45G。persistent/collision/save。Pages run 33990010600 SUCCESS。Owner iPhone見た目確認待ち |
| 25 | REQ-013 | P2 | VERIFY | 隠しアイテム / 探索スパークル | `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` | 王都/近郊/森深部へ3探索光。正面action、1回限定G報酬、発見後消失、save flag、contract/browser/touch/Pages run 33987250241 SUCCESS。Owner iPhone見た目確認待ち |
| 26 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` | 王都近郊→森入口→深部のA-C実装。Pages workflow run 33981010791全工程SUCCESS。Owner主観/iPhone見た目確認待ち |
| 27 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` | 南門宿・屋根裏談話室を追加。実entry/exit browser smokeを含むPages workflow run 33981620155 SUCCESS。Owner主観/iPhone見た目確認待ち |

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
All completion conditions that can legitimately be claimed are satisfied.

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
3. Within equal priority, explicit Owner order wins.
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
