# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative inventory of Owner-requested implementation work, priority and execution state.

## ACTIVE / QUEUE

| ORDER | ID | PRIORITY | STATUS | TITLE | REQUIREMENT | NOTE |
|---:|---|---|---|---|---|---|
| 1 | REQ-034 | P0 | DONE | iPhone公開版 world/map 黒画面修正 | `requirements/REQ-034_IPHONE_BLACK_WORLD_SCREEN.md` | fullscreen world plane geometry + transparent controls planeをhardening。390x844 visual-liveness + integrated touch gate追加。Pages run 34006670133 SUCCESS。Owner iPhone実機で「うん、直った」と確認、IOS_PHYSICAL_VERIFICATION=PASS |
| 2 | REQ-021 | P0 | VERIFY | 画面のどこを短くタップしてもAアクション | `requirements/REQ-021_TAP_ANYWHERE_ACTION.md` | unified pointer surfaceをfresh再監査。tap=canonical Action 1回、drag=no Action。REQ-034の390x844 integrated touch gateでもPASS。Owner iPhone実機確認待ち |
| 3 | REQ-022 | P0 | VERIFY | iPhone全画面World UI / 操作UIをマップ上へ同居 | `requirements/REQ-022_IPHONE_FULLSCREEN_WORLD_UI.md` | 100dvh world + overlays + camera recenter。REQ-034でworld plane/controls planeをhardeningし390x844 visual-liveness PASS。Owner iPhone実機確認待ち |
| 4 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` | v1.5 168px高コントラスト4-way UI + safety conditions。REQ-034 integrated 390x844 floating-touch smoke PASS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 5 | REQ-023 | P0 | VERIFY | 北の退避路・進行必須手掛かりの導線修正 | `requirements/REQ-023_EVAC_ROUTE_CRITICAL_GUIDANCE.md` | 左下の撤収命令を具体的objective+pulse markerで案内。取得後は北端へ即誘導。既存gate/story不変。Pages run 33996304585 SUCCESS。Owner実機導線確認待ち |
| 6 | REQ-024 | P1 | VERIFY | 王都アルディア・民家内部 | `requirements/REQ-024_ALDIA_CIVILIAN_HOME_INTERIOR.md` | walkable民家・住民/小物interaction・安全な退出を実装。修復checkpoint `43ba4e88...` のPages run 33997076846 SUCCESS。Owner実機/見た目確認待ち |
| 7 | REQ-025 | P1 | VERIFY | 王都アルディア・王城門衛詰所 | `requirements/REQ-025_ALDIA_CASTLE_GATEHOUSE_INTERIOR.md` | canonical entry/walk/guard+prop interaction/exit/safe spawnを専用runtime probeで固定。Pages run 34001139669 SUCCESS。Owner実機/見た目確認待ち |
| 8 | REQ-026 | P1 | VERIFY | 王都アルディア・王城前庭 | `requirements/REQ-026_ALDIA_CASTLE_COURTYARD.md` | 門衛詰所→前庭entry/walk/landmark/interaction/本館境界/returnをruntime probeで固定。Pages run 34001268066 SUCCESS。Owner実機/見た目確認待ち |
| 9 | REQ-027 | P1 | VERIFY | 王都アルディア・王城玄関ホール | `requirements/REQ-027_ALDIA_CASTLE_ENTRANCE_HALL.md` | 前庭大扉→玄関ホールentry/walk/guard+prop/deep-boundary/exit/safe spawnを専用runtime probeで固定。Pages run 34003902302 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 10 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` | 正式WebP transport + dialogue guard + Pages CI成功を確認。Owner実機/見た目確認待ち |
| 11 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` | 4方向×3frame WebP stripsを実playerへ統合。static/addon/browser/Pages PASS。Owner見た目/iPhone確認待ち |
| 12 | REQ-016 | P1 | VERIFY | MP / 戦闘技システム | `requirements/REQ-016_MP_SKILL_SYSTEM.md` | 永続MP 10/10 + 初期技「蒼閃」4MP。旧save migration、level-up/敗北回復、static/browser/touch/Pages run 33992924664 SUCCESS。Owner iPhone戦闘感確認待ち |
| 13 | REQ-017 | P1 | VERIFY | 敵ドロップ / 戦利品システム | `requirements/REQ-017_ENEMY_DROP_SYSTEM.md` | 通常敵18種をcanonical薬草/煙玉drop tableへ接続。+1上限、unknown fallback、既存EXP/G保持、Pages run 33993065410 SUCCESS。Ownerバランス/iPhone感確認待ち |
| 14 | REQ-018 | P2 | VERIFY | 蒼閃の専用戦闘フィードバック | `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md` | 青斬撃、敵hit、MP消費/不足feedbackをpresentation-onlyで実装。reduced-motion/cleanup/state-mutation guard、Pages run 33993208928 SUCCESS。Owner見た目/iPhone確認待ち |
| 15 | REQ-019 | P2 | VERIFY | 回復地点のMP整合性 | `requirements/REQ-019_MP_RECOVERY_POINTS.md` | 焚き火MP全回復＋旅人の祠35%MP回復。既存HP/flag維持。Pages run 33993422174 SUCCESS。Owner iPhone回復感確認待ち |
| 16 | REQ-020 | P2 | VERIFY | 図鑑へ敵ドロップ情報を接続 | `requirements/REQ-020_BESTIARY_DROP_INTEL.md` | REQ-017 authorityのdrop labelを発見済み図鑑へsingle-source表示。確率非表示、unknown fallback。Pages run 33993594188 SUCCESS。Owner iPhone可読性確認待ち |
| 17 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD | 正式アート要件/素材確定待ち。仮SVGを最終品質扱いしない |
| 18 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD | ルーク/レオンとの世界観統一 |
| 19 | REQ-006 | P1 | VERIFY | 敵絵文字を完全オリジナル敵画像へ置換 | `requirements/REQ-006_ORIGINAL_ENEMY_ART.md` | 通常敵18種をoriginal SVG battle-art registryへ移行。contract/static/browser/Pages run 33982213456 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 20 | REQ-007 | P1 | VERIFY | 地域別戦闘背景画像の正式化 | `requirements/REQ-007_ORIGINAL_BATTLE_BACKGROUNDS.md` | 6通常遭遇地域へdistinct original SVG battle backdropを実装。contract/static/browser/Pages run 33982352056 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 21 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` | Checkpoint A-C実装、最新CのPages workflow run 33980792050 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 22 | REQ-011 | P1 | VERIFY | 冒険ジャーナル / メイン目的・手掛かり・サブクエ追跡 | `requirements/REQ-011_ADVENTURE_JOURNAL.md` | spoiler-safe journal実装。main/clues/3 side quests + contract guard。Pages run 33984155835 SUCCESS。Owner iPhone可読性/主観確認待ち |
| 23 | REQ-012 | P1 | VERIFY | 探索できる永続宝箱システム | `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` | 王都/近郊/森入口へ3宝箱。1回限定G報酬、opened visual、collision、save flag、contract/browser/touch/Pages run 33987117818 SUCCESS。Owner iPhone見た目確認待ち |
| 24 | REQ-014 | P1 | VERIFY | ストーリー進行で町人会話が変化するNPCリアクション | `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` | 王都3NPC+近郊1NPCを既存canonical flagsの6段階projectionへ接続。秘密の先出しなし。Pages run 33989872020 SUCCESS。Owner iPhone/主観確認待ち |
| 25 | REQ-015 | P1 | VERIFY | 宝箱探索を実アイテム報酬へ拡張 | `requirements/REQ-015_ITEM_TREASURE_CACHES.md` | 深部/霧/監視区域へ3補給cache。薬草×2、煙玉×1、45G。persistent/collision/save。Pages run 33990010600 SUCCESS。Owner iPhone見た目確認待ち |
| 26 | REQ-013 | P2 | VERIFY | 隠しアイテム / 探索スパークル | `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` | 王都/近郊/森深部へ3探索光。正面action、1回限定G報酬、発見後消失、save flag、contract/browser/touch/Pages run 33987250241 SUCCESS。Owner iPhone見た目確認待ち |
| 27 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` | 王都近郊→森入口→深部のA-C実装。Pages workflow run 33981010791全工程SUCCESS。Owner主観/iPhone見た目確認待ち |
| 28 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` | 南門宿・屋根裏談話室を追加。実entry/exit browser smokeを含むPages workflow run 33981620155 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 29 | REQ-028 | P1 | VERIFY | 王都アルディア・王城上階回廊 | `requirements/REQ-028_ALDIA_CASTLE_UPPER_GALLERY.md` | 玄関ホール大階段→上階回廊entry/walk/guard+map/boundary/returnをruntime probeで固定。旧REQ-027 smokeのforward-compatibility defectも自己修復。Pages run 34004233876 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 30 | REQ-029 | P1 | VERIFY | 王都近郊・石灰洞 | `requirements/REQ-029_FIELD_LIMESTONE_CAVE.md` | field→cave entry/walk/environment interactions/depth boundary/safe exitをruntime probeで固定。公開前spawn collisionも自己検知修正。Pages run 34004420157 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 31 | REQ-030 | P1 | VERIFY | 王都近郊・高地の登山道 | `requirements/REQ-030_ALDIA_HIGHLAND_TRAIL.md` | field→highland entry/walk/sign+cairn/high-altitude boundary/safe exitをruntime probeで固定。Pages run 34004585120 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 32 | REQ-031 | P1 | VERIFY | 石灰洞・旧測量坑道 | `requirements/REQ-031_LIMESTONE_SURVEY_DUNGEON.md` | 分岐坑道 + 永続lever/gate + 奥区画 + safe exitをassembled browserで固定。test-only `canWalk()` defectを自己診断・修復。Pages run 34005199926 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 33 | REQ-032 | P1 | VERIFY | 既存武器・防具・装備システム正式監査 | `requirements/REQ-032_EQUIPMENT_SYSTEM.md` | 既存v0.31/v0.40/Tier II装備chainを再監査。重複実装を撤去し、Tier II→下位装備でATK/DEF bonusが残る実バグを修正。Pages run 34005710946 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 34 | REQ-033 | P1 | VERIFY | 高地・放棄された魔王軍監視所 | `requirements/REQ-033_ABANDONED_DEMON_ARMY_OUTPOST.md` | optional walkable Demon Army outpost実装 + dedicated runtime acceptance済み。checkpoint `283a0b4...` Pages SUCCESS。Owner実機/見た目確認待ち |
| 35 | REQ-035 | P1 | SUPERSEDED | Original Audio Feedback / SE foundation | `requirements/REQ-035_ORIGINAL_AUDIO_FEEDBACK.md` | deeper inventoryで既存 `ux-v83.js` + `ux-v138.js` + audio dedup実装を発見。重複実装せず監査履歴としてSUPERSEDED |
| 36 | REQ-036 | P1 | VERIFY | Original Ambient Music Foundation | `requirements/REQ-036_ORIGINAL_AMBIENT_MUSIC.md` | external assetなしWeb Audio original safe/wild music + explicit MUSIC toggle。autoplay OFF、既存SE非干渉、390x844 integrated smoke含むPages run 34006935671 SUCCESS。Owner iPhone音量/雰囲気確認待ち |
| 37 | REQ-037 | P1 | VERIFY | Map Transition Fade / Scene Change Feedback | `requirements/REQ-037_MAP_TRANSITION_FADE.md` | visual fade + non-stacking/pointer-safe/reduced-motion cleanup。既存v0.139 transition SFX非重複。Pages run 34007224602 SUCCESS。Owner iPhone transition feel確認待ち |
| 38 | REQ-038 | P1 | VERIFY | Battle Defeat Recovery Feedback | `requirements/REQ-038_BATTLE_DEFEAT_RECOVERY_FEEDBACK.md` | canonical defeat recovery保持。presentation-only戦闘不能→王都搬送cue + dedicated lqTouchSmoke acceptance。Pages run 34008956384 SUCCESS。Owner iPhone feel確認待ち |
| 39 | REQ-039 | P1 | VERIFY | Level-Up Feedback | `requirements/REQ-039_LEVEL_UP_FEEDBACK.md` | canonical progression保持。統合監査でMP +2表示漏れを自己検知しdeferred final snapshotへ修復。Pages run 34009469016 SUCCESS。Owner iPhone feel確認待ち |
| 40 | REQ-040 | P1 | VERIFY | EXP Progress Visibility | `requirements/REQ-040_EXP_PROGRESS_VISIBILITY.md` | compact EXP meter。統合監査でEXP+MPの6セルHUD二段化リスクを自己検知し6-column single-rowへ修復。Pages run 34009469016 SUCCESS。Owner iPhone readability確認待ち |
| 41 | REQ-041 | P1 | VERIFY | Completion Record Coverage | `requirements/REQ-041_COMPLETION_RECORD_COVERAGE.md` | COMPLETED記録へ既存3件目「森の薬草標本」を接続。pure row-builder + fail-closed smoke。Pages run 34009469016 SUCCESS。Owner iPhone readability確認待ち |
| 42 | REQ-042 | P1 | VERIFY | Adventure Record Accuracy | `requirements/REQ-042_ADVENTURE_RECORD_ACCURACY.md` | OPTIONAL DONEを3件へ整合、TREASURE FINDSをlegacy + chest + hidden-find + item-cache statusから動的dedupe集計。Pages run 34009625492 SUCCESS。Owner iPhone readability確認待ち |
| 43 | REQ-043 | P1 | VERIFY | Poison Defeat Cleanup | `requirements/REQ-043_POISON_DEFEAT_CLEANUP.md` | battle-only poisonが敗北搬送後にworldへ漏れる整合性バグを修復。battle→world transition cleanup + fail-closed acceptance。Pages run 34009787755 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 44 | REQ-044 | P1 | VERIFY | Battle-Only Poison Save Sanitization | `requirements/REQ-044_BATTLE_ONLY_POISON_SAVE_SANITIZATION.md` | stale/legacy saveからbattle-only poisonがworldへ復元・再保存される境界をcanonical save sanitizationで修復。Pages run 34010063196 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 45 | REQ-045 | P1 | VERIFY | Critical-Hit ATK Persistence Safety | `requirements/REQ-045_CRITICAL_HIT_ATK_PERSISTENCE.md` | critical killing blow中の一時+5 ATK保存汚染とlevel-up +3消失を修復。canonical attack/win維持、save normalization + delta-preserving cleanup。Pages run 34010189516 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 46 | REQ-046 | P1 | VERIFY | Defeat Enemy-State Cleanup | `requirements/REQ-046_DEFEAT_ENEMY_STATE_CLEANUP.md` | live敗北後のstale enemy/ehpに加え、legacy/manual backupのnon-battle復元境界もsave sanitizationでhardening。Pages run 34010441091 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 47 | REQ-047 | P1 | VERIFY | Critical Final-Blow Feedback | `requirements/REQ-047_CRITICAL_FINAL_BLOW_FEEDBACK.md` | critical killing blowでbattle DOM消滅後にCRITICAL cueが欠落するpresentation gapをdocument-level fixed cueで修復。Pages run 34010537279 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 48 | REQ-048 | P1 | VERIFY | Autosave Pulse Progress Coverage | `requirements/REQ-048_AUTOSAVE_PULSE_PROGRESS_COVERAGE.md` | later chest/hidden/cache + `lqHerbSampleQuestDone` をdynamic dedupe signatureへ接続。canonical save非変更。Pages run 34010704113 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 49 | REQ-049 | P1 | VERIFY | Manual Backup Corruption Hardening | `requirements/REQ-049_MANUAL_BACKUP_CORRUPTION_HARDENING.md` | malformed/primitive/array backupを安全拒否、INVALID表示/LOAD無効化、valid legacy object保持。dedicated smoke + Pages run 34011257673 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 50 | REQ-050 | P1 | VERIFY | Manual Backup Dangerous-Key Sanitization | `requirements/REQ-050_MANUAL_BACKUP_DANGEROUS_KEY_SANITIZATION.md` | `__proto__` / `constructor` / `prototype` をstate+flags merge前に除外。REQ-049 contract保持。dedicated smoke + Pages run 34011382155 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 51 | REQ-051 | P1 | VERIFY | Manual Backup Numeric Type Hardening | `requirements/REQ-051_MANUAL_BACKUP_NUMERIC_TYPE_HARDENING.md` | runtime DEFAULT由来のcanonical numeric fieldsをdynamic type-normalize。REQ-049/050 contract保持。dedicated smoke + Pages run 34011542116 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 52 | REQ-052 | P1 | VERIFY | Readable Normal Enemy Behavior | `requirements/REQ-052_NORMAL_ENEMY_READABLE_BEHAVIOR.md` | 通常敵へPRESSURE/BURST/STEADYのreadable intentを追加。canonical enemyTurn/guard/poison chainと既存boss AIを保持。dedicated smoke + Pages run 34011798629 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 53 | REQ-053 | P1 | VERIFY | Recovery Magic Foundation | `requirements/REQ-053_RECOVERY_MAGIC_FOUNDATION.md` | MP回復魔法「癒光」5MPを追加。full HP/MP不足時はno-cost/no-turn、毒治療は薬草へ分離、canonical enemyTurn維持。dedicated smoke + Pages run 34011930589 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 54 | REQ-054 | P1 | VERIFY | 王都アルディア・北の神殿内部 | `requirements/REQ-054_ALDIA_NORTH_TEMPLE_INTERIOR.md` | canonical神殿設定をwalkable interior化。正門/侍祭/祈祷水晶/奉納棚/安全退出、報酬・回復・protected canon変更なし。dedicated smoke + Pages run 34012131433 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 55 | REQ-055 | P1 | VERIFY | Consumable Shop Sell Foundation | `requirements/REQ-055_CONSUMABLE_SHOP_SELL_FOUNDATION.md` | 薬草4G/煙玉9Gの1個売却を既存shop stateへ追加。初回touch-smoke timing collisionを自己修復し、dedicated smoke + assembled browser + 390x844 touch/fullscreen + Pages run 34013983279 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |

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
Important expansion after higher-priority work.

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