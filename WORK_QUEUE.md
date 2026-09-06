# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED / COMPACT_INDEX_V2
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative compact inventory of Owner-requested implementation work, priority and execution state.
Requirement bodies and detailed evidence live in each `requirements/REQ-xxx_*.md` and fresh GitHub history. Keep this index compact enough for complete autonomous boot loading.

## ACTIVE REALITY

- IN_PROGRESS: `NONE`
- BLOCKED: `REQ-059`, `REQ-113`, `REQ-114`, `REQ-119`
- NEWEST_VERIFY: `REQ-124` gamepad input foundation; Pages `34064096831` SUCCESS
- OWNER_PHYSICAL_PRIORITY: `REQ-121` Cloudbreak → Wind Stair progression retry
- OPENING: `REQ-120` VERIFY
- WIP_AVAILABLE: `YES`

## INVENTORY

| ORDER | ID | P | STATUS | TITLE | REQUIREMENT |
|---:|---|---|---|---|---|
| -1 | REQ-121 | P0 | VERIFY | Cloudbreak → Wind Stair Transition Deadlock Fix | `requirements/REQ-121_CLOUDBREAK_WIND_STAIR_TRANSITION_DEADLOCK_FIX.md` |
| 0 | REQ-102 | P0 | VERIFY | Owner iPhone Forest Input / HUD Toggle / Dialogue Portrait Fix | `requirements/REQ-102_OWNER_IPHONE_FOREST_INPUT_HUD_TOGGLE_DIALOGUE_PORTRAIT_FIX.md` |
| 0 | REQ-092 | P0 | VERIFY | iPhone Field UI Occlusion / Camera Framing Fix | `requirements/REQ-092_IPHONE_FIELD_UI_OCCLUSION_CAMERA_FRAMING.md` |
| 1 | REQ-059 | P0 | BLOCKED | Autonomous Generated Raster Image Pipeline Capability Test | `requirements/REQ-059_AUTONOMOUS_GENERATED_IMAGE_PIPELINE_CAPABILITY_TEST.md` |
| 2 | REQ-034 | P0 | DONE | iPhone公開版 world/map 黒画面修正 | `requirements/REQ-034_IPHONE_BLACK_WORLD_SCREEN.md` |
| 3 | REQ-021 | P0 | VERIFY | 画面のどこを短くタップしてもAアクション | `requirements/REQ-021_TAP_ANYWHERE_ACTION.md` |
| 4 | REQ-022 | P0 | VERIFY | iPhone全画面World UI / 操作UIをマップ上へ同居 | `requirements/REQ-022_IPHONE_FULLSCREEN_WORLD_UI.md` |
| 5 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` |
| 6 | REQ-023 | P0 | VERIFY | 北の退避路・進行必須手掛かりの導線修正 | `requirements/REQ-023_EVAC_ROUTE_CRITICAL_GUIDANCE.md` |
| 7 | REQ-024 | P1 | VERIFY | 王都アルディア・民家内部 | `requirements/REQ-024_ALDIA_CIVILIAN_HOME_INTERIOR.md` |
| 8 | REQ-025 | P1 | VERIFY | 王都アルディア・王城門衛詰所 | `requirements/REQ-025_ALDIA_CASTLE_GATEHOUSE_INTERIOR.md` |
| 9 | REQ-026 | P1 | VERIFY | 王都アルディア・王城前庭 | `requirements/REQ-026_ALDIA_CASTLE_COURTYARD.md` |
| 10 | REQ-027 | P1 | VERIFY | 王都アルディア・王城玄関ホール | `requirements/REQ-027_ALDIA_CASTLE_ENTRANCE_HALL.md` |
| 11 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` |
| 12 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` |
| 13 | REQ-016 | P1 | VERIFY | MP / 戦闘技システム | `requirements/REQ-016_MP_SKILL_SYSTEM.md` |
| 14 | REQ-017 | P1 | VERIFY | 敵ドロップ / 戦利品システム | `requirements/REQ-017_ENEMY_DROP_SYSTEM.md` |
| 15 | REQ-018 | P2 | VERIFY | 蒼閃の専用戦闘フィードバック | `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md` |
| 16 | REQ-019 | P2 | VERIFY | 回復地点のMP整合性 | `requirements/REQ-019_MP_RECOVERY_POINTS.md` |
| 17 | REQ-020 | P2 | VERIFY | 図鑑へ敵ドロップ情報を接続 | `requirements/REQ-020_BESTIARY_DROP_INTEL.md` |
| 18 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD |
| 19 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD |
| 20 | REQ-006 | P1 | VERIFY | 敵絵文字を完全オリジナル敵画像へ置換 | `requirements/REQ-006_ORIGINAL_ENEMY_ART.md` |
| 21 | REQ-007 | P1 | VERIFY | 地域別戦闘背景画像の正式化 | `requirements/REQ-007_ORIGINAL_BATTLE_BACKGROUNDS.md` |
| 22 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` |
| 23 | REQ-011 | P1 | VERIFY | 冒険ジャーナル / メイン目的・手掛かり・サブクエ追跡 | `requirements/REQ-011_ADVENTURE_JOURNAL.md` |
| 24 | REQ-012 | P1 | VERIFY | 探索できる永続宝箱システム | `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` |
| 25 | REQ-014 | P1 | VERIFY | ストーリー進行で町人会話が変化するNPCリアクション | `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` |
| 26 | REQ-015 | P1 | VERIFY | 宝箱探索を実アイテム報酬へ拡張 | `requirements/REQ-015_ITEM_TREASURE_CACHES.md` |
| 27 | REQ-013 | P2 | VERIFY | 隠しアイテム / 探索スパークル | `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` |
| 28 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` |
| 29 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` |
| 30 | REQ-028 | P1 | VERIFY | 王都アルディア・王城上階回廊 | `requirements/REQ-028_ALDIA_CASTLE_UPPER_GALLERY.md` |
| 31 | REQ-029 | P1 | VERIFY | 王都近郊・石灰洞 | `requirements/REQ-029_FIELD_LIMESTONE_CAVE.md` |
| 32 | REQ-030 | P1 | VERIFY | 王都近郊・高地の登山道 | `requirements/REQ-030_ALDIA_HIGHLAND_TRAIL.md` |
| 33 | REQ-031 | P1 | VERIFY | 石灰洞・旧測量坑道 | `requirements/REQ-031_LIMESTONE_SURVEY_DUNGEON.md` |
| 34 | REQ-032 | P1 | VERIFY | 既存武器・防具・装備システム正式監査 | `requirements/REQ-032_EQUIPMENT_SYSTEM.md` |
| 35 | REQ-033 | P1 | VERIFY | 高地・放棄された魔王軍監視所 | `requirements/REQ-033_ABANDONED_DEMON_ARMY_OUTPOST.md` |
| 36 | REQ-035 | P1 | SUPERSEDED | Original Audio Feedback / SE foundation | `requirements/REQ-035_ORIGINAL_AUDIO_FEEDBACK.md` |
| 37 | REQ-036 | P1 | VERIFY | Original Ambient Music Foundation | `requirements/REQ-036_ORIGINAL_AMBIENT_MUSIC.md` |
| 38 | REQ-037 | P1 | VERIFY | Map Transition Fade / Scene Change Feedback | `requirements/REQ-037_MAP_TRANSITION_FADE.md` |
| 39 | REQ-038 | P1 | VERIFY | Battle Defeat Recovery Feedback | `requirements/REQ-038_BATTLE_DEFEAT_RECOVERY_FEEDBACK.md` |
| 40 | REQ-039 | P1 | VERIFY | Level-Up Feedback | `requirements/REQ-039_LEVEL_UP_FEEDBACK.md` |
| 41 | REQ-040 | P1 | VERIFY | EXP Progress Visibility | `requirements/REQ-040_EXP_PROGRESS_VISIBILITY.md` |
| 42 | REQ-041 | P1 | VERIFY | Completion Record Coverage | `requirements/REQ-041_COMPLETION_RECORD_COVERAGE.md` |
| 43 | REQ-042 | P1 | VERIFY | Adventure Record Accuracy | `requirements/REQ-042_ADVENTURE_RECORD_ACCURACY.md` |
| 44 | REQ-043 | P1 | VERIFY | Poison Defeat Cleanup | `requirements/REQ-043_POISON_DEFEAT_CLEANUP.md` |
| 45 | REQ-044 | P1 | VERIFY | Battle-Only Poison Save Sanitization | `requirements/REQ-044_BATTLE_ONLY_POISON_SAVE_SANITIZATION.md` |
| 46 | REQ-045 | P1 | VERIFY | Critical-Hit ATK Persistence Safety | `requirements/REQ-045_CRITICAL_HIT_ATK_PERSISTENCE.md` |
| 47 | REQ-046 | P1 | VERIFY | Defeat Enemy-State Cleanup | `requirements/REQ-046_DEFEAT_ENEMY_STATE_CLEANUP.md` |
| 48 | REQ-047 | P1 | VERIFY | Critical Final-Blow Feedback | `requirements/REQ-047_CRITICAL_FINAL_BLOW_FEEDBACK.md` |
| 49 | REQ-048 | P1 | VERIFY | Autosave Pulse Progress Coverage | `requirements/REQ-048_AUTOSAVE_PULSE_PROGRESS_COVERAGE.md` |
| 50 | REQ-049 | P1 | VERIFY | Manual Backup Corruption Hardening | `requirements/REQ-049_MANUAL_BACKUP_CORRUPTION_HARDENING.md` |
| 51 | REQ-050 | P1 | VERIFY | Manual Backup Dangerous-Key Sanitization | `requirements/REQ-050_MANUAL_BACKUP_DANGEROUS_KEY_SANITIZATION.md` |
| 52 | REQ-051 | P1 | VERIFY | Manual Backup Numeric Type Hardening | `requirements/REQ-051_MANUAL_BACKUP_NUMERIC_TYPE_HARDENING.md` |
| 53 | REQ-052 | P1 | VERIFY | Readable Normal Enemy Behavior | `requirements/REQ-052_NORMAL_ENEMY_READABLE_BEHAVIOR.md` |
| 54 | REQ-053 | P1 | VERIFY | Recovery Magic Foundation | `requirements/REQ-053_RECOVERY_MAGIC_FOUNDATION.md` |
| 55 | REQ-054 | P1 | VERIFY | 王都アルディア・北の神殿内部 | `requirements/REQ-054_ALDIA_NORTH_TEMPLE_INTERIOR.md` |
| 56 | REQ-055 | P1 | VERIFY | Consumable Shop Sell Foundation | `requirements/REQ-055_CONSUMABLE_SHOP_SELL_FOUNDATION.md` |
| 57 | REQ-056 | P1 | VERIFY | Base Equipment Shop Comparison | `requirements/REQ-056_BASE_EQUIPMENT_SHOP_COMPARISON.md` |
| 58 | REQ-057 | P1 | VERIFY | Stackable Shop Sell Quantity | `requirements/REQ-057_STACKABLE_SHOP_SELL_QUANTITY.md` |
| 59 | REQ-058 | P1 | VERIFY | Accessory Equipment Foundation | `requirements/REQ-058_ACCESSORY_EQUIPMENT_FOUNDATION.md` |
| 60 | REQ-060 | P1 | VERIFY | Cross-Browser Save Transfer | `requirements/REQ-060_CROSS_BROWSER_SAVE_TRANSFER.md` |
| 61 | REQ-061 | P1 | VERIFY | Fresh-Browser Continue Validity | `requirements/REQ-061_FRESH_BROWSER_CONTINUE_VALIDITY.md` |
| 62 | REQ-062 | P1 | VERIFY | Save Transfer Existing-Progress Overwrite Guard | `requirements/REQ-062_SAVE_TRANSFER_OVERWRITE_GUARD.md` |
| 63 | REQ-063 | P1 | VERIFY | Canonical Autosave Bootstrap Hardening | `requirements/REQ-063_CANONICAL_AUTOSAVE_BOOTSTRAP_HARDENING.md` |
| 64 | REQ-064 | P1 | VERIFY | Save Transfer File Export / Import | `requirements/REQ-064_SAVE_TRANSFER_FILE_EXPORT_IMPORT.md` |
| 65 | REQ-065 | P1 | VERIFY | Autosave Quarantine Recovery UI | `requirements/REQ-065_AUTOSAVE_QUARANTINE_RECOVERY_UI.md` |
| 66 | REQ-066 | P1 | VERIFY | Inn Guest Bed Recovery | `requirements/REQ-066_INN_GUEST_BED_RECOVERY.md` |
| 67 | REQ-067 | P1 | VERIFY | Native Save Share | `requirements/REQ-067_NATIVE_SAVE_SHARE.md` |
| 68 | REQ-068 | P1 | VERIFY | Save Transfer Import Preview | `requirements/REQ-068_SAVE_TRANSFER_IMPORT_PREVIEW.md` |
| 69 | REQ-069 | P1 | VERIFY | New Game Existing-Save Overwrite Guard | `requirements/REQ-069_NEW_GAME_SAVE_OVERWRITE_GUARD.md` |
| 70 | REQ-070 | P1 | VERIFY | Manual Backup Destructive Action Guard | `requirements/REQ-070_MANUAL_BACKUP_DESTRUCTIVE_ACTION_GUARD.md` |
| 71 | REQ-071 | P1 | VERIFY | Save Transfer Preview Canonical Gold Fix | `requirements/REQ-071_SAVE_TRANSFER_PREVIEW_CANONICAL_GOLD_FIX.md` |
| 72 | REQ-072 | P1 | VERIFY | Accessory Shop Sell Foundation | `requirements/REQ-072_ACCESSORY_SHOP_SELL_FOUNDATION.md` |
| 73 | REQ-073 | P1 | VERIFY | Optional Boss Completion Record Coverage | `requirements/REQ-073_OPTIONAL_BOSS_COMPLETION_RECORD_COVERAGE.md` |
| 74 | REQ-074 | P1 | VERIFY | Optional Boss Adventure Journal Tracking | `requirements/REQ-074_OPTIONAL_BOSS_ADVENTURE_JOURNAL_TRACKING.md` |
| 75 | REQ-075 | P1 | VERIFY | Optional Boss Objective Chip Tracking | `requirements/REQ-075_OPTIONAL_BOSS_OBJECTIVE_CHIP_TRACKING.md` |
| 76 | REQ-076 | P1 | VERIFY | Optional Boss Autosave Pulse Coverage | `requirements/REQ-076_OPTIONAL_BOSS_AUTOSAVE_PULSE_COVERAGE.md` |
| 77 | REQ-077 | P1 | VERIFY | Forest Lord Key Item Visibility Guard | `requirements/REQ-077_FOREST_LORD_KEY_ITEM_VISIBILITY_GUARD.md` |
| 78 | REQ-078 | P1 | VERIFY | Key Item Collection Type Hardening | `requirements/REQ-078_KEY_ITEM_COLLECTION_TYPE_HARDENING.md` |
| 79 | REQ-079 | P1 | VERIFY | Save Transfer Age Preview | `requirements/REQ-079_SAVE_TRANSFER_AGE_PREVIEW.md` |
| 80 | REQ-080 | P1 | VERIFY | Save Transfer Overwrite Comparison | `requirements/REQ-080_SAVE_TRANSFER_OVERWRITE_COMPARISON.md` |
| 81 | REQ-081 | P1 | VERIFY | 北の崖道・第一章追跡ルート継続 | `requirements/REQ-081_NORTH_CLIFF_ROAD_CONTINUATION.md` |
| 82 | REQ-082 | P1 | VERIFY | 北の崖道・通常エンカウント統合 | `requirements/REQ-082_NORTH_CLIFF_ENCOUNTER_INTEGRATION.md` |
| 83 | REQ-083 | P1 | VERIFY | 北の崖道・ローカル進行導線 | `requirements/REQ-083_NORTH_CLIFF_LOCAL_GUIDANCE.md` |
| 84 | REQ-084 | P1 | VERIFY | 北の崖道・冒険ジャーナル目的地整合 | `requirements/REQ-084_NORTH_CLIFF_JOURNAL_OBJECTIVE_CONTINUITY.md` |
| 85 | REQ-085 | P1 | VERIFY | 北の崖道・地域別戦闘背景の連続性 | `requirements/REQ-085_NORTH_CLIFF_BATTLE_BACKGROUND_CONTINUITY.md` |
| 86 | REQ-086 | P1 | VERIFY | 北の崖道・エリアタイトル演出の連続性 | `requirements/REQ-086_NORTH_CLIFF_AREA_TITLE_CARD_CONTINUITY.md` |
| 87 | REQ-087 | P1 | VERIFY | 北の崖道・world ambient演出の連続性 | `requirements/REQ-087_NORTH_CLIFF_WORLD_AMBIENT_CONTINUITY.md` |
| 88 | REQ-088 | P1 | VERIFY | 北の崖道・cloud shadow演出の連続性 | `requirements/REQ-088_NORTH_CLIFF_CLOUD_SHADOW_CONTINUITY.md` |
| 89 | REQ-089 | P1 | VERIFY | 北の崖道・terrain footstep演出の連続性 | `requirements/REQ-089_NORTH_CLIFF_FOOTSTEP_CONTINUITY.md` |
| 90 | REQ-090 | P1 | VERIFY | 北の崖道・cross-system coverage self-audit guard | `requirements/REQ-090_NORTH_CLIFF_CROSS_SYSTEM_COVERAGE_GUARD.md` |
| 91 | REQ-091 | P0 | SUPERSEDED | iPhone Field UI Occlusion / Safe Player Visibility / Controller Transparency Fix | `requirements/REQ-091_IPHONE_FIELD_UI_OCCLUSION_FIX.md` |
| 92 | REQ-093 | P1 | VERIFY | 北の崖道・風切り峠への追跡ルート継続 | `requirements/REQ-093_NORTH_CLIFF_WINDCUT_PASS_CONTINUATION.md` |
| 93 | REQ-094 | P1 | VERIFY | 風切り峠・ローカル進行導線 | `requirements/REQ-094_WINDCUT_PASS_LOCAL_GUIDANCE.md` |
| 94 | REQ-095 | P1 | VERIFY | 風切り峠・地域別戦闘背景の連続性 | `requirements/REQ-095_WINDCUT_PASS_BATTLE_BACKGROUND_CONTINUITY.md` |
| 95 | REQ-096 | P1 | VERIFY | 風切り峠・エリアタイトル演出の連続性 | `requirements/REQ-096_WINDCUT_PASS_AREA_TITLE_CONTINUITY.md` |
| 96 | REQ-097 | P1 | VERIFY | 風切り峠・world ambient演出の連続性 | `requirements/REQ-097_WINDCUT_PASS_WORLD_AMBIENT_CONTINUITY.md` |
| 97 | REQ-098 | P1 | VERIFY | 風切り峠・cloud shadow演出の連続性 | `requirements/REQ-098_WINDCUT_PASS_CLOUD_SHADOW_CONTINUITY.md` |
| 98 | REQ-099 | P1 | VERIFY | 風切り峠・terrain footstep演出の連続性 | `requirements/REQ-099_WINDCUT_PASS_FOOTSTEP_CONTINUITY.md` |
| 99 | REQ-100 | P1 | VERIFY | 風切り峠・cross-system coverage self-audit guard | `requirements/REQ-100_WINDCUT_PASS_CROSS_SYSTEM_COVERAGE_GUARD.md` |
| 100 | REQ-101 | P1 | VERIFY | 風切り峠・冒険ジャーナル目的地整合 | `requirements/REQ-101_WINDCUT_PASS_JOURNAL_OBJECTIVE_CONTINUITY.md` |
| 101 | REQ-103 | P1 | VERIFY | 風切り峠・ランドマーク照明の連続性 | `requirements/REQ-103_WINDCUT_PASS_LANDMARK_LIGHTING_CONTINUITY.md` |
| 102 | REQ-104 | P1 | VERIFY | 北の崖道・ランドマーク照明の連続性 | `requirements/REQ-104_NORTH_CLIFF_LANDMARK_LIGHTING_CONTINUITY.md` |
| 103 | REQ-105 | P1 | VERIFY | 北尾根・実プレイ継続区間 | `requirements/REQ-105_NORTH_RIDGE_PLAYABLE_CONTINUATION.md` |
| 104 | REQ-113 | P1 | BLOCKED | Cloudbreak North Playable Continuation | `requirements/REQ-113_CLOUDBREAK_NORTH_PLAYABLE_CONTINUATION.md` |
| 105 | REQ-114 | P1 | BLOCKED | Story Canon Wiring After Chapter 2 Design | `requirements/REQ-114_STORY_CANON_WIRING_AFTER_CHAPTER_02.md` |
| 106 | REQ-115 | P2 | VERIFY | Wind Stair Ridge Presentation Polish | `requirements/REQ-115_WIND_STAIR_RIDGE_PRESENTATION_POLISH.md` |
| 107 | REQ-116 | P2 | VERIFY | Wind Stair Ridge Environment Continuity | `requirements/REQ-116_WIND_STAIR_RIDGE_ENVIRONMENT_CONTINUITY.md` |
| 108 | REQ-117 | P1 | SUPERSEDED | World / Character Visual Richness Upgrade | `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md` |
| 109 | REQ-118 | P1 | SUPERSEDED | High-Quality Hero Selection Opening / Playable Prologue | `requirements/REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING.md` |
| 110 | REQ-119 | P1 | BLOCKED | World / Character Visual Richness Upgrade | `requirements/REQ-119_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md` |
| 111 | REQ-120 | P1 | VERIFY | High-Quality Hero Selection Opening | `requirements/REQ-120_HIGH_QUALITY_HERO_SELECTION_OPENING.md` |
| 112 | REQ-122 | P1 | VERIFY | Keyboard Gameplay Completeness | `requirements/REQ-122_KEYBOARD_GAMEPLAY_COMPLETENESS.md` |
| 113 | REQ-123 | P2 | VERIFY | Keyboard Shortcut Discoverability | `requirements/REQ-123_KEYBOARD_SHORTCUT_DISCOVERABILITY.md` |
| 114 | REQ-124 | P2 | VERIFY | Gamepad Input Foundation | `requirements/REQ-124_GAMEPAD_INPUT_FOUNDATION.md` |

## STATE / SELECTION

- `VERIFY` does not consume WIP and does not block independent development.
- `BLOCKED` does not stop unrelated safe work.
- If no `READY` exists and only Owner-only formal-art BACKLOG remains, create one directive-authorized player-visible requirement that advances an explicitly unfinished final-game capability without protected-canon invention, then execute it under WIP=1.
- Detailed notes, commit IDs, workflow IDs and acceptance matrices belong in requirement files, not this index.
- Never delete an Owner request merely to make the queue smaller.