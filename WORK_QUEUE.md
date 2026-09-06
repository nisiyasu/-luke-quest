# LUKE QUEST WORK QUEUE

MODE: QUEUE_CONTROLLED
WIP_LIMIT: 1 IN_PROGRESS requirement
VERIFY_COUNTS_AGAINST_WIP: NO

This file is the authoritative inventory of Owner-requested implementation work, priority and execution state.

## ACTIVE / QUEUE

| ORDER | ID | PRIORITY | STATUS | TITLE | REQUIREMENT | NOTE |
|---:|---|---|---|---|---|---|
| -2 | REQ-127 | P0 | IN_PROGRESS | iPhone Black Screen Autonomous Detection & Recovery | `requirements/REQ-127_IPHONE_BLACK_SCREEN_AUTONOMOUS_DETECTION_RECOVERY.md` | Owner direct absolute priority. Persistent iPhone Home Screen PWA black screen; machine-side visual-liveness, runtime diagnostics, screenshot/black-frame detection, resume regression, deterministic Service Worker/cache handling, and autonomous recovery. Do not require repeated Owner checks for speculative iterations. IOS_PHYSICAL_VERIFICATION=PENDING. |
| -1 | REQ-121 | P0 | READY | Cloudbreak → Wind Stair Transition Deadlock Fix | `requirements/REQ-121_CLOUDBREAK_WIND_STAIR_TRANSITION_DEADLOCK_FIX.md` | Owner iPhone実機で再現したハード進行不能。雲上の鞍部の「次の高所へ続く石段跡」が会話を再表示するだけで既存`windStairRidge`へ遷移しない。最新Owner直接指示により全READY案件より最優先。新しい北追跡マップは作らず既存遷移だけ復旧する。 |
| 0 | REQ-102 | P0 | VERIFY | Owner iPhone Forest Input / HUD Toggle / Dialogue Portrait Fix | `requirements/REQ-102_OWNER_IPHONE_FOREST_INPUT_HUD_TOGGLE_DIALOGUE_PORTRAIT_FIX.md` | 魔物の森entry spawnを北へ進めるlaneへ修復、top HUD再stack + HUD ON/OFF、Owner upload画像をLuke会話face cropへroute。REQ-102 runtime guard + 390x844 touch/fullscreen + assembled browser PASS、Pages run 34039338259 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 0 | REQ-092 | P0 | VERIFY | iPhone Field UI Occlusion / Camera Framing Fix | `requirements/REQ-092_IPHONE_FIELD_UI_OCCLUSION_CAMERA_FRAMING.md` | 最新Owner実機報告4点を統合。上部UI重なり、playerのHUD裏隠れ、Dynamic Touch透明化、portrait camera 0.88 zoom-outを実装。Pages run 34031527694 SUCCESS。Owner実機最終確認はPENDING。旧誤登録REQ-085はID衝突をfresh inventoryで検知しREQ-092へ復旧。 |
| 1 | REQ-059 | P0 | BLOCKED | Autonomous Generated Raster Image Pipeline Capability Test | `requirements/REQ-059_AUTONOMOUS_GENERATED_IMAGE_PIPELINE_CAPABILITY_TEST.md` | RESULT=PARTIAL/BLOCKED_AT_GENERATED_BYTE_HANDOFF。GitHub binary-safe blob transportは実証済み。生成画像→bytes/file/base64のchainable handoffのみ未提供。単一blockerとして開発を止めない。 |
| 2 | REQ-034 | P0 | DONE | iPhone公開版 world/map 黒画面修正 | `requirements/REQ-034_IPHONE_BLACK_WORLD_SCREEN.md` | fullscreen world plane geometry + transparent controls planeをhardening。390x844 visual-liveness + integrated touch gate追加。Pages run 34006670133 SUCCESS。Owner iPhone実機で「うん、直った」と確認、IOS_PHYSICAL_VERIFICATION=PASS |
| 3 | REQ-021 | P0 | VERIFY | 画面のどこを短くタップしてもAアクション | `requirements/REQ-021_TAP_ANYWHERE_ACTION.md` | unified pointer surfaceをfresh再監査。tap=canonical Action 1回、drag/cancel/stale transition=no Action。dialogue開始途中のpointer cleanupも再監査・hardening。390x844 integrated touch gate Pages run 34024686626 SUCCESS。Owner iPhone実機確認待ち |
| 4 | REQ-022 | P0 | VERIFY | iPhone全画面World UI / 操作UIをマップ上へ同居 | `requirements/REQ-022_IPHONE_FULLSCREEN_WORLD_UI.md` | 100dvh world + overlays + camera recenter。world plane/controls plane hardening保持。fresh 390x844 visual-livenessをPages run 34024686626で再PASS。Owner iPhone実機確認待ち |
| 5 | REQ-001 | P0 | VERIFY | 画面任意位置Dynamic Touch Controller | `requirements/REQ-001_DYNAMIC_TOUCH_CONTROLLER.md` | v1.5 168px高コントラスト4-way UI。fresh再監査でdialogue開始前dead-zone pending pointer残留リスクを自己検知し`f69ecb3...`修復、`e8553883...`でdialogue-mid-gesture、`152477fa...`でbattle transition regression追加。Pages run 34024686626 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 6 | REQ-023 | P0 | VERIFY | 北の退避路・進行必須手掛かりの導線修正 | `requirements/REQ-023_EVAC_ROUTE_CRITICAL_GUIDANCE.md` | fresh再監査でcanonical withdrawProof `(6,17)` / `withdrawProofSeen` gateを確認。左下の撤収命令を具体的objective+pulse markerで案内、取得後は北端へ即誘導。既存gate/story不変。Owner実機導線確認待ち |
| 7 | REQ-024 | P1 | VERIFY | 王都アルディア・民家内部 | `requirements/REQ-024_ALDIA_CIVILIAN_HOME_INTERIOR.md` | walkable民家・住民/小物interaction・安全な退出を実装。修復checkpoint `43ba4e88...` のPages run 33997076846 SUCCESS。Owner実機/見た目確認待ち |
| 8 | REQ-025 | P1 | VERIFY | 王都アルディア・王城門衛詰所 | `requirements/REQ-025_ALDIA_CASTLE_GATEHOUSE_INTERIOR.md` | canonical entry/walk/guard+prop interaction/exit/safe spawnを専用runtime probeで固定。Pages run 34001139669 SUCCESS。Owner実機/見た目確認待ち |
| 9 | REQ-026 | P1 | VERIFY | 王都アルディア・王城前庭 | `requirements/REQ-026_ALDIA_CASTLE_COURTYARD.md` | 門衛詰所→前庭entry/walk/landmark/interaction/本館境界/returnをruntime probeで固定。Pages run 34001268066 SUCCESS。Owner実機/見た目確認待ち |
| 10 | REQ-027 | P1 | VERIFY | 王都アルディア・王城玄関ホール | `requirements/REQ-027_ALDIA_CASTLE_ENTRANCE_HALL.md` | 前庭大扉→玄関ホールentry/walk/guard+prop/deep-boundary/exit/safe spawnを専用runtime probeで固定。Pages run 34003902302 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 11 | REQ-002 | P0 | VERIFY | ルーク会話グラフィックを承認済み生成画像へ正式化 | `requirements/REQ-002_LUKE_DIALOGUE_ART.md` | 正式WebP transport + dialogue guard + Pages CI成功を確認。Owner実機/見た目確認待ち |
| 12 | REQ-003 | P0 | VERIFY | ルーク正式4方向×複数フレーム歩行スプライト | `requirements/REQ-003_LUKE_4DIR_FIELD_SPRITE.md` | 4方向×3frame WebP stripsを実playerへ統合。static/addon/browser/touch/Pages PASS。Owner見た目/iPhone確認待ち |
| 13 | REQ-016 | P1 | VERIFY | MP / 戦闘技システム | `requirements/REQ-016_MP_SKILL_SYSTEM.md` | 永続MP 10/10 + 初期技「蒼閃」4MP。旧save migration、level-up/敗北回復、static/browser/touch/Pages run 33992924664 SUCCESS。Owner iPhone戦闘感確認待ち |
| 14 | REQ-017 | P1 | VERIFY | 敵ドロップ / 戦利品システム | `requirements/REQ-017_ENEMY_DROP_SYSTEM.md` | 通常敵18種をcanonical薬草/煙玉drop tableへ接続。+1上限、unknown fallback、既存EXP/G保持、Pages run 33993065410 SUCCESS。Ownerバランス/iPhone感確認待ち |
| 15 | REQ-018 | P2 | VERIFY | 蒼閃の専用戦闘フィードバック | `requirements/REQ-018_AZURE_SLASH_FEEDBACK.md` | 青斬撃、敵hit、MP消費/不足feedbackをpresentation-onlyで実装。reduced-motion/cleanup/state-mutation guard、Pages run 33993208928 SUCCESS。Owner見た目/iPhone確認待ち |
| 16 | REQ-019 | P2 | VERIFY | 回復地点のMP整合性 | `requirements/REQ-019_MP_RECOVERY_POINTS.md` | 焚き火MP全回復＋旅人の祠35%MP回復。既存HP/flag維持。Pages run 33993422174 SUCCESS。Owner iPhone回復感確認待ち |
| 17 | REQ-020 | P2 | VERIFY | 図鑑へ敵ドロップ情報を接続 | `requirements/REQ-020_BESTIARY_DROP_INTEL.md` | REQ-017 authorityのdrop labelを発見済み図鑑へsingle-source表示。確率非表示、unknown fallback。Pages run 33993594188 SUCCESS。Owner iPhone可読性確認待ち |
| 18 | REQ-004 | P1 | BACKLOG | レオン正式全身会話立ち絵 | TBD | 正式アート要件/素材確定待ち。仮SVGを最終品質扱いしない |
| 19 | REQ-005 | P1 | BACKLOG | グレン正式全身会話立ち絵 | TBD | ルーク/レオンとの世界観統一 |
| 20 | REQ-006 | P1 | VERIFY | 敵絵文字を完全オリジナル敵画像へ置換 | `requirements/REQ-006_ORIGINAL_ENEMY_ART.md` | 通常敵18種をoriginal SVG battle-art registryへ移行。contract/static/browser/Pages run 33982213456 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 21 | REQ-007 | P1 | VERIFY | 地域別戦闘背景画像の正式化 | `requirements/REQ-007_ORIGINAL_BATTLE_BACKGROUNDS.md` | 6通常遭遇地域へdistinct original SVG battle backdropを実装。contract/static/browser/Pages run 33982352056 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 22 | REQ-008 | P1 | VERIFY | 王都アルディアをPS1初期級の視覚密度へ強化 | `requirements/REQ-008_ALDIA_VISUAL_DENSITY.md` | Checkpoint A-C実装、最新CのPages workflow run 33980792050 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 23 | REQ-011 | P1 | VERIFY | 冒険ジャーナル / メイン目的・手掛かり・サブクエ追跡 | `requirements/REQ-011_ADVENTURE_JOURNAL.md` | spoiler-safe journal実装。main/clues/3 side quests + contract guard。Pages run 33984155835 SUCCESS。Owner iPhone可読性/主観確認待ち |
| 24 | REQ-012 | P1 | VERIFY | 探索できる永続宝箱システム | `requirements/REQ-012_TREASURE_CHEST_SYSTEM.md` | 王都/近郊/森入口へ3宝箱。1回限定G報酬、opened visual、collision、save flag、contract/browser/touch/Pages run 33987117818 SUCCESS。Owner iPhone見た目確認待ち |
| 25 | REQ-014 | P1 | VERIFY | ストーリー進行で町人会話が変化するNPCリアクション | `requirements/REQ-014_NPC_DIALOGUE_PROGRESSION.md` | 王都3NPC+近郊1NPCを既存canonical flagsの6段階projectionへ接続。秘密の先出しなし。Pages run 33989872020 SUCCESS。Owner iPhone/主観確認待ち |
| 26 | REQ-015 | P1 | VERIFY | 宝箱探索を実アイテム報酬へ拡張 | `requirements/REQ-015_ITEM_TREASURE_CACHES.md` | 深部/霧/監視区域へ3補給cache。薬草×2、煙玉×1、45G。persistent/collision/save。Pages run 33990010600 SUCCESS。Owner iPhone見た目確認待ち |
| 27 | REQ-013 | P2 | VERIFY | 隠しアイテム / 探索スパークル | `requirements/REQ-013_HIDDEN_FIND_SYSTEM.md` | 王都/近郊/森深部へ3探索光。正面action、1回限定G報酬、発見後消失、save flag、contract/browser/touch/Pages run 33987250241 SUCCESS。Owner iPhone見た目確認待ち |
| 28 | REQ-009 | P2 | VERIFY | フィールド/森をPS1初期級の視覚密度へ強化 | `requirements/REQ-009_FIELD_FOREST_VISUAL_DENSITY.md` | 王都近郊→森入口→深部のA-C実装。Pages workflow run 33981010791全工程SUCCESS。Owner主観/iPhone見た目確認待ち |
| 29 | REQ-010 | P2 | VERIFY | 建物内部と町コンテンツの追加拡張 | `requirements/REQ-010_BUILDING_INTERIOR_EXPANSION.md` | 南門宿・屋根裏談話室を追加。実entry/exit browser smokeを含むPages workflow run 33981620155 SUCCESS。Owner主観/iPhone見た目確認待ち |
| 30 | REQ-028 | P1 | VERIFY | 王都アルディア・王城上階回廊 | `requirements/REQ-028_ALDIA_CASTLE_UPPER_GALLERY.md` | 玄関ホール大階段→上階回廊entry/walk/guard+map/boundary/returnをruntime probeで固定。旧REQ-027 smokeのforward-compatibility defectも自己修復。Pages run 34004233876 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 31 | REQ-029 | P1 | VERIFY | 王都近郊・石灰洞 | `requirements/REQ-029_FIELD_LIMESTONE_CAVE.md` | field→cave entry/walk/environment interactions/depth boundary/safe exitをruntime probeで固定。公開前spawn collisionも自己検知修正。Pages run 34004420157 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 32 | REQ-030 | P1 | VERIFY | 王都近郊・高地の登山道 | `requirements/REQ-030_ALDIA_HIGHLAND_TRAIL.md` | field→highland entry/walk/sign+cairn/high-altitude boundary/safe exitをruntime probeで固定。Pages run 34004585120 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 33 | REQ-031 | P1 | VERIFY | 石灰洞・旧測量坑道 | `requirements/REQ-031_LIMESTONE_SURVEY_DUNGEON.md` | 分岐坑道 + 永続lever/gate + 奥区画 + safe exitをassembled browserで固定。test-only `canWalk()` defectを自己診断・修復。Pages run 34005199926 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 34 | REQ-032 | P1 | VERIFY | 既存武器・防具・装備システム正式監査 | `requirements/REQ-032_EQUIPMENT_SYSTEM.md` | 既存v0.31/v0.40/Tier II装備chainを再監査。重複実装を撤去し、Tier II→下位装備でATK/DEF bonusが残る実バグを修正。Pages run 34005710946 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 35 | REQ-033 | P1 | VERIFY | 高地・放棄された魔王軍監視所 | `requirements/REQ-033_ABANDONED_DEMON_ARMY_OUTPOST.md` | optional walkable Demon Army outpost実装 + dedicated runtime acceptance済み。checkpoint `283a0b4...` Pages SUCCESS。Owner実機/見た目確認待ち |
| 36 | REQ-035 | P1 | SUPERSEDED | Original Audio Feedback / SE foundation | `requirements/REQ-035_ORIGINAL_AUDIO_FEEDBACK.md` | deeper inventoryで既存 `ux-v83.js` + `ux-v138.js` + audio dedup実装を発見。重複実装せず監査履歴としてSUPERSEDED |
| 37 | REQ-036 | P1 | VERIFY | Original Ambient Music Foundation | `requirements/REQ-036_ORIGINAL_AMBIENT_MUSIC.md` | external assetなしWeb Audio original safe/wild music + explicit MUSIC toggle。autoplay OFF、既存SE非干渉、390x844 integrated smoke含むPages run 34006935671 SUCCESS。Owner iPhone音量/雰囲気確認待ち |
| 38 | REQ-037 | P1 | VERIFY | Map Transition Fade / Scene Change Feedback | `requirements/REQ-037_MAP_TRANSITION_FADE.md` | visual fade + non-stacking/pointer-safe/reduced-motion cleanup。既存v0.139 transition SFX非重複。Pages run 34007224602 SUCCESS。Owner iPhone transition feel確認待ち |
| 39 | REQ-038 | P1 | VERIFY | Battle Defeat Recovery Feedback | `requirements/REQ-038_BATTLE_DEFEAT_RECOVERY_FEEDBACK.md` | canonical defeat recovery保持。presentation-only戦闘不能→王都搬送cue + dedicated lqTouchSmoke acceptance。Pages run 34008956384 SUCCESS。Owner iPhone feel確認待ち |
| 40 | REQ-039 | P1 | VERIFY | Level-Up Feedback | `requirements/REQ-039_LEVEL_UP_FEEDBACK.md` | canonical progression保持。統合監査でMP +2表示漏れを自己検知しdeferred final snapshotへ修復。Pages run 34009469016 SUCCESS。Owner iPhone feel確認待ち |
| 41 | REQ-040 | P1 | VERIFY | EXP Progress Visibility | `requirements/REQ-040_EXP_PROGRESS_VISIBILITY.md` | compact EXP meter。統合監査でEXP+MPの6セルHUD二段化リスクを自己検知し6-column single-rowへ修復。Pages run 34009469016 SUCCESS。Owner iPhone readability確認待ち |
| 42 | REQ-041 | P1 | VERIFY | Completion Record Coverage | `requirements/REQ-041_COMPLETION_RECORD_COVERAGE.md` | COMPLETED記録へ既存3件目「森の薬草標本」を接続。pure row-builder + fail-closed smoke。Pages run 34009469016 SUCCESS。Owner iPhone readability確認待ち |
| 43 | REQ-042 | P1 | VERIFY | Adventure Record Accuracy | `requirements/REQ-042_ADVENTURE_RECORD_ACCURACY.md` | OPTIONAL DONEを3件へ整合、TREASURE FINDSをlegacy + chest + hidden-find + item-cache statusから動的dedupe集計。Pages run 34009625492 SUCCESS。Owner iPhone readability確認待ち |
| 44 | REQ-043 | P1 | VERIFY | Poison Defeat Cleanup | `requirements/REQ-043_POISON_DEFEAT_CLEANUP.md` | battle-only poisonが敗北搬送後にworldへ漏れる整合性バグを修復。battle→world transition cleanup + fail-closed acceptance。Pages run 34009787755 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 45 | REQ-044 | P1 | VERIFY | Battle-Only Poison Save Sanitization | `requirements/REQ-044_BATTLE_ONLY_POISON_SAVE_SANITIZATION.md` | stale/legacy saveからbattle-only poisonがworldへ復元・再保存される境界をcanonical save sanitizationでhardening。Pages run 34010063196 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 46 | REQ-045 | P1 | VERIFY | Critical-Hit ATK Persistence Safety | `requirements/REQ-045_CRITICAL_HIT_ATK_PERSISTENCE.md` | critical killing blow中の一時+5 ATK保存汚染とlevel-up +3消失を修復。canonical attack/win維持、save normalization + delta-preserving cleanup。Pages run 34010189516 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 47 | REQ-046 | P1 | VERIFY | Defeat Enemy-State Cleanup | `requirements/REQ-046_DEFEAT_ENEMY_STATE_CLEANUP.md` | live敗北後のstale enemy/ehpに加え、legacy/manual backupのnon-battle復元境界もsave sanitizationでhardening。Pages run 34010441091 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 48 | REQ-047 | P1 | VERIFY | Critical Final-Blow Feedback | `requirements/REQ-047_CRITICAL_FINAL_BLOW_FEEDBACK.md` | critical killing blowでbattle DOM消滅後にCRITICAL cueが欠落するpresentation gapをdocument-level fixed cueで修復。Pages run 34010537279 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 49 | REQ-048 | P1 | VERIFY | Autosave Pulse Progress Coverage | `requirements/REQ-048_AUTOSAVE_PULSE_PROGRESS_COVERAGE.md` | later chest/hidden/cache + `lqHerbSampleQuestDone` をdynamic dedupe signatureへ追加。canonical save非変更。Pages run 34010704113 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 50 | REQ-049 | P1 | VERIFY | Manual Backup Corruption Hardening | `requirements/REQ-049_MANUAL_BACKUP_CORRUPTION_HARDENING.md` | malformed/primitive/array backupを安全拒否、INVALID表示/LOAD無効化、valid legacy object保持。dedicated smoke + Pages run 34011257673 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 51 | REQ-050 | P1 | VERIFY | Manual Backup Dangerous-Key Sanitization | `requirements/REQ-050_MANUAL_BACKUP_DANGEROUS_KEY_SANITIZATION.md` | `__proto__` / `constructor` / `prototype` をstate+flags merge前に除外。REQ-049 contract保持。dedicated smoke + Pages run 34011382155 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 52 | REQ-051 | P1 | VERIFY | Manual Backup Numeric Type Hardening | `requirements/REQ-051_MANUAL_BACKUP_NUMERIC_TYPE_HARDENING.md` | runtime DEFAULT由来のcanonical numeric fieldsをdynamic type-normalize。REQ-049/050 contract保持。dedicated smoke + Pages run 34011542116 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 53 | REQ-052 | P1 | VERIFY | Readable Normal Enemy Behavior | `requirements/REQ-052_NORMAL_ENEMY_READABLE_BEHAVIOR.md` | 通常敵へPRESSURE/BURST/STEADYのreadable intentを追加。canonical enemyTurn/guard/poison chainと既存boss AIを保持。dedicated smoke + Pages run 34011798629 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 54 | REQ-053 | P1 | VERIFY | Recovery Magic Foundation | `requirements/REQ-053_RECOVERY_MAGIC_FOUNDATION.md` | MP回復魔法「癒光」5MPを追加。full HP/MP不足時はno-cost/no-turn、毒治療は薬草へ分離、canonical enemyTurn維持。dedicated smoke + Pages run 34011930589 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 55 | REQ-054 | P1 | VERIFY | 王都アルディア・北の神殿内部 | `requirements/REQ-054_ALDIA_NORTH_TEMPLE_INTERIOR.md` | canonical神殿設定をwalkable interior化。正門/侍祭/祈祷水晶/奉納棚/安全退出、報酬・回復・protected canon変更なし。dedicated smoke + Pages run 34012131433 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 56 | REQ-055 | P1 | VERIFY | Consumable Shop Sell Foundation | `requirements/REQ-055_CONSUMABLE_SHOP_SELL_FOUNDATION.md` | 薬草4G/煙玉9Gの1個売却を既存shop stateへ追加。初回touch-smoke timing collisionを自己修復し、dedicated smoke + assembled browser + 390x844 touch/fullscreen + Pages run 34013983279 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 57 | REQ-056 | P1 | VERIFY | Base Equipment Shop Comparison | `requirements/REQ-056_BASE_EQUIPMENT_SHOP_COMPARISON.md` | 青銅の剣/革の旅装へ現在ATK/DEF→購入後のsigned delta比較をUI-only追加。Tier II downgradeも明示。dedicated/assembled/equipment/390x844 regressions + Pages run 34014165812 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 58 | REQ-057 | P1 | VERIFY | Stackable Shop Sell Quantity | `requirements/REQ-057_STACKABLE_SHOP_SELL_QUANTITY.md` | REQ-055の同一sell authorityを×1/×3へ拡張。在庫不足/不正qty/店外はreject、buy×1/×3と旧x1 sell保持。dedicated/assembled/390x844 + Pages run 34014292725 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 59 | REQ-058 | P1 | VERIFY | Accessory Equipment Foundation | `requirements/REQ-058_ACCESSORY_EQUIPMENT_FOUNDATION.md` | 3枠目ACCESSORYを追加。旅人の護符60G/DEF+1、購入・装備・はずす・再装備・Tier II防具跨ぎdelta安全を実装。dedicated/equipment/assembled/390x844 + Pages run 34014440476 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 60 | REQ-060 | P1 | VERIFY | Cross-Browser Save Transfer | `requirements/REQ-060_CROSS_BROWSER_SAVE_TRANSFER.md` | SAVE CODE export/import、fresh browser title IMPORT、Unicode round-trip、invalid/dangerous payload fail-closed、manual backup保持。Pages run 34015168161 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 61 | REQ-061 | P1 | VERIFY | Fresh-Browser Continue Validity | `requirements/REQ-061_FRESH_BROWSER_CONTINUE_VALIDITY.md` | bootstrap DEFAULT/title autosaveを実進行と誤認する偽Continueを修正。intro/world/legacy/REQ-060 importはContinue維持。fail-closed smoke + Pages run 34015384336 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 62 | REQ-062 | P1 | VERIFY | Save Transfer Existing-Progress Overwrite Guard | `requirements/REQ-062_SAVE_TRANSFER_OVERWRITE_GUARD.md` | existing resumable progressではvalid SAVE CODE importを二段確認化。fresh/non-resumable browserは一段。code変更/12秒expiryでdisarm。dedicated/assembled/390x844 + Pages run 34015640423 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 63 | REQ-063 | P1 | VERIFY | Canonical Autosave Bootstrap Hardening | `requirements/REQ-063_CANONICAL_AUTOSAVE_BOOTSTRAP_HARDENING.md` | malformed/primitive canonical autosaveをpre-bootstrap quarantineし、dangerous keysをbase merge前sanitize。dedicated acceptance + assembled prelude-order gate + title/world + 390x844 + Pages run 34016458577 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 64 | REQ-064 | P1 | VERIFY | Save Transfer File Export / Import | `requirements/REQ-064_SAVE_TRANSFER_FILE_EXPORT_IMPORT.md` | existing REQ-060 SAVE CODEを`.lqsave.txt`で持ち運ぶfile pathを追加。file loadは既存textarea+IMPORT経由でREQ-062上書きguardを維持。malformed/empty/oversize fail-closed。Pages run 34016621862 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 65 | REQ-065 | P1 | VERIFY | Autosave Quarantine Recovery UI | `requirements/REQ-065_AUTOSAVE_QUARANTINE_RECOVERY_UI.md` | REQ-063で隔離された壊れたautosaveをtitleで可視化し、raw/reason/timestampをDOWNLOAD可能。dismissは隔離データを削除しない。Pages run 34016802177 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 66 | REQ-066 | P1 | VERIFY | Inn Guest Bed Recovery | `requirements/REQ-066_INN_GUEST_BED_RECOVERY.md` | 既存の南門宿・客室ベッドをrepeatable HP/MP全回復へ接続。canonical Action/saveを使用し、battle-only poison cleanup、state preservation、non-bed flavor回帰を専用smokeで固定。Pages run 34017022991 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 67 | REQ-067 | P1 | VERIFY | Native Save Share | `requirements/REQ-067_NATIVE_SAVE_SHARE.md` | REQ-060/064の既存SAVE FILEをnative Web Shareへ接続。未対応/失敗時は既存downloadへfallback、AbortErrorは非破壊cancel。dedicated/assembled/390x844 + Pages run 34017657791 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 68 | REQ-068 | P1 | VERIFY | Save Transfer Import Preview | `requirements/REQ-068_SAVE_TRANSFER_IMPORT_PREVIEW.md` | valid SAVE CODEのLV/location/HP/MP/Gを既存REQ-060 validation authorityからread-only preview。invalid fail-closed/no mutation、file loadも同一input経路。Pages run 34017799386 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 69 | REQ-069 | P1 | VERIFY | New Game Existing-Save Overwrite Guard | `requirements/REQ-069_NEW_GAME_SAVE_OVERWRITE_GUARD.md` | resumable save時のNEW GAMEを二段確認化。初回tapはraw save byte不変、CONTINUE/transfer保持、2回目のみcanonical newGame。smoke teardownも自己監査修復。Pages run 34017974207 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 70 | REQ-070 | P1 | VERIFY | Manual Backup Destructive Action Guard | `requirements/REQ-070_MANUAL_BACKUP_DESTRUCTIVE_ACTION_GUARD.md` | manual slot overwrite/deleteを二段確認化。初回tapはraw bytes不変、2回目のみcanonical save/delete。Pages run 34018181780 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 71 | REQ-071 | P1 | VERIFY | Save Transfer Preview Canonical Gold Fix | `requirements/REQ-071_SAVE_TRANSFER_PREVIEW_CANONICAL_GOLD_FIX.md` | import previewの誤った`g`参照をcanonical `gold`優先へ修復。adversarial smoke + Pages run 34018266479 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 72 | REQ-072 | P1 | VERIFY | Accessory Shop Sell Foundation | `requirements/REQ-072_ACCESSORY_SHOP_SELL_FOUNDATION.md` | 旅人の護符を未装備時のみ30Gで売却可能。REQ-058 authority再利用、canonical consumable preservation hardening済み。Pages run 34018553794 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 73 | REQ-073 | P1 | VERIFY | Optional Boss Completion Record Coverage | `requirements/REQ-073_OPTIONAL_BOSS_COMPLETION_RECORD_COVERAGE.md` | 苔角の森王撃破をADVENTURE RECORD OPTIONAL DONEとCOMPLETEDへread-only反映。REQ-041 smokeをforward-compatible化。Pages run 34018645505 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 74 | REQ-074 | P1 | VERIFY | Optional Boss Adventure Journal Tracking | `requirements/REQ-074_OPTIONAL_BOSS_ADVENTURE_JOURNAL_TRACKING.md` | 巨大蹄跡を発見後だけSIDE QUESTSへ表示し、再調査を案内。撃破後は苔角の森王の完了行へ遷移。発見前ネタバレなし、read-only、assembled smoke + 390x844 + Pages run 34019148578 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 75 | REQ-075 | P1 | VERIFY | Optional Boss Objective Chip Tracking | `requirements/REQ-075_OPTIONAL_BOSS_OBJECTIVE_CHIP_TRACKING.md` | 巨大蹄跡を発見後だけworld SIDE chipへ再調査導線を表示。撃破後は消える。既存3 optional objective precedence保持、Pages run 34019286555 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 76 | REQ-076 | P1 | VERIFY | Optional Boss Autosave Pulse Coverage | `requirements/REQ-076_OPTIONAL_BOSS_AUTOSAVE_PULSE_COVERAGE.md` | `forestMiniBossDefeated`を既存autosave progress signatureへ追加。warning-onlyは除外。途中の無関係CSS driftを自己検知・修復。Pages run 34019432206 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 77 | REQ-077 | P1 | VERIFY | Forest Lord Key Item Visibility Guard | `requirements/REQ-077_FOREST_LORD_KEY_ITEM_VISIBILITY_GUARD.md` | unrelated keyItemsがあるだけで森王の角を誤表示するlegacy条件をexact ownership final-state guardで修復。assembled smoke + 390x844 + Pages run 34019534573 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 78 | REQ-078 | P1 | VERIFY | Key Item Collection Type Hardening | `requirements/REQ-078_KEY_ITEM_COLLECTION_TYPE_HARDENING.md` | autosave/SAVE CODE/manual backupでkeyItemsをstring-only ordered unique arrayへnormalize。malformed collectionをsafe empty arrayへ。assembled + bootstrap + Pages run 34019919393 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 79 | REQ-079 | P1 | VERIFY | Save Transfer Age Preview | `requirements/REQ-079_SAVE_TRANSFER_AGE_PREVIEW.md` | IMPORT PREVIEWへREQ-060 envelope `createdAt`由来の作成時刻を追加。invalid/missing timestampはneutral fallback。existing state不変、assembled + 390x844 + Pages run 34021747701 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 80 | REQ-080 | P1 | VERIFY | Save Transfer Overwrite Comparison | `requirements/REQ-080_SAVE_TRANSFER_OVERWRITE_COMPARISON.md` | existing resumable progressの上書き初回確認でCURRENT vs IMPORTのLV/location/Gを表示。REQ-060 preparation authorityとREQ-062 confirm authorityを再利用、invalid/fresh-browser/code-change/expiry挙動保持。Pages run 34022037838 SUCCESS、subsequent full HEAD run 34022100887 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING |
| 81 | REQ-081 | P1 | VERIFY | 北の崖道・第一章追跡ルート継続 | `requirements/REQ-081_NORTH_CLIFF_ROAD_CONTINUATION.md` | `withdrawProofSeen` gate authority維持。evacRoute北端→walkable北の崖道→安全帰還、4 canonical interactions、save round-trip、protected canon非変更を専用assembled browserで固定。Pages run 34025050191 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 82 | REQ-082 | P1 | VERIFY | 北の崖道・通常エンカウント統合 | `requirements/REQ-082_NORTH_CLIFF_ENCOUNTER_INTEGRATION.md` | northCliffRoadを既存canonical random encounterへ接続しEVAC_ENEMIESを再利用。entry/return grace、dedicated browser、390x844 touch/fullscreen、Pages run 34025554356 SUCCESS。Owner実機確認待ち。 |
| 83 | REQ-083 | P1 | VERIFY | 北の崖道・ローカル進行導線 | `requirements/REQ-083_NORTH_CLIFF_LOCAL_GUIDANCE.md` | 新しい足跡→北へ曲がる崖道をcompact objective + presentation-only markerで案内。canonical action/save/story/encounter非変更。初回CIでtest-order競合を自己検知・修復。Pages run 34026070789 SUCCESS。Owner iPhone導線感確認待ち。 |
| 84 | REQ-084 | P1 | VERIFY | 北の崖道・冒険ジャーナル目的地整合 | `requirements/REQ-084_NORTH_CLIFF_JOURNAL_OBJECTIVE_CONTINUITY.md` | 到着後も「北の崖道へ向かう」と出るstale objectiveをlocation-aware化。pure helper acceptance、既存s.wins contract維持、HTML escape drift自己修復。Pages run 34026388737 SUCCESS。Owner iPhone可読性確認待ち。 |
| 85 | REQ-085 | P1 | VERIFY | 北の崖道・地域別戦闘背景の連続性 | `requirements/REQ-085_NORTH_CLIFF_BATTLE_BACKGROUND_CONTINUITY.md` | Fresh requirement inventory recovery。canonical northCliffRoadをregional battle backdropへ統合済み。requirement自身のSTATUS=VERIFY、Owner実機見た目確認PENDING。 |
| 86 | REQ-086 | P1 | VERIFY | 北の崖道・エリアタイトル演出の連続性 | `requirements/REQ-086_NORTH_CLIFF_AREA_TITLE_CARD_CONTINUITY.md` | Fresh requirement inventory recovery。canonical northCliffRoadのarea-title continuityを実装済み。requirement自身のSTATUS=VERIFY。 |
| 87 | REQ-087 | P1 | VERIFY | 北の崖道・world ambient演出の連続性 | `requirements/REQ-087_NORTH_CLIFF_WORLD_AMBIENT_CONTINUITY.md` | Fresh requirement inventory recovery。northCliffRoadをworld ambient registryへ統合済み。requirement自身のSTATUS=VERIFY。 |
| 88 | REQ-088 | P1 | VERIFY | 北の崖道・cloud shadow演出の連続性 | `requirements/REQ-088_NORTH_CLIFF_CLOUD_SHADOW_CONTINUITY.md` | Fresh requirement inventory recovery。northCliffRoadのoutdoor/cloud-shadow coverageを統合済み。requirement自身のSTATUS=VERIFY。 |
| 89 | REQ-089 | P1 | VERIFY | 北の崖道・terrain footstep演出の連続性 | `requirements/REQ-089_NORTH_CLIFF_FOOTSTEP_CONTINUITY.md` | Fresh requirement inventory recovery。northCliffRoadのterrain-aware footstep coverageを統合済み。requirement自身のSTATUS=VERIFY。 |
| 90 | REQ-090 | P1 | VERIFY | 北の崖道・cross-system coverage self-audit guard | `requirements/REQ-090_NORTH_CLIFF_CROSS_SYSTEM_COVERAGE_GUARD.md` | Fresh requirement inventory recovery。canonical northCliffRoadの主要presentation/導線coverage driftをPages前にfail-closed検知するguard。STATUS=VERIFY。 |
| 91 | REQ-091 | P0 | SUPERSEDED | iPhone Field UI Occlusion / Safe Player Visibility / Controller Transparency Fix | `requirements/REQ-091_IPHONE_FIELD_UI_OCCLUSION_FIX.md` | 最初の3 defectを並行実装した有効履歴。Owner追加のzoom-outを含む完全版REQ-092へSUPERSEDED。実装commitはREQ-092へ再利用。 |
| 92 | REQ-093 | P1 | VERIFY | 北の崖道・風切り峠への追跡ルート継続 | `requirements/REQ-093_NORTH_CLIFF_WINDCUT_PASS_CONTINUATION.md` | northCliffRoad北境界→walkable風切り峠→安全帰還、4 canonical interactions、EVAC_ENEMIES再利用、save round-trip、protected canon非変更。Pages run 34032450470 SUCCESS on `6b1dd56e...`。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 93 | REQ-094 | P1 | VERIFY | 風切り峠・ローカル進行導線 | `requirements/REQ-094_WINDCUT_PASS_LOCAL_GUIDANCE.md` | compact objective + phase markerで岩陰の靴跡→北へ続く尾根道を案内。canonical action/gameplay/save/story非変更。Pages run 34032985334 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 94 | REQ-095 | P1 | VERIFY | 風切り峠・地域別戦闘背景の連続性 | `requirements/REQ-095_WINDCUT_PASS_BATTLE_BACKGROUND_CONTINUITY.md` | 既存regional battle backdrop single-sourceへ風切り峠を第8地域として追加。Pages run 34033196993 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 95 | REQ-096 | P1 | VERIFY | 風切り峠・エリアタイトル演出の連続性 | `requirements/REQ-096_WINDCUT_PASS_AREA_TITLE_CONTINUITY.md` | dedicated subtitle「北尾根へ続く風の強い高所峠」を既存area-title authorityへ接続。Pages run 34033373703 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 96 | REQ-097 | P1 | VERIFY | 風切り峠・world ambient演出の連続性 | `requirements/REQ-097_WINDCUT_PASS_WORLD_AMBIENT_CONTINUITY.md` | 既存world ambient registryへwindcutPass=fogを追加しnorthCliffRoad/legacy alias/unknown fallbackを保持。Pages run 34033532905 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 97 | REQ-098 | P1 | VERIFY | 風切り峠・cloud shadow演出の連続性 | `requirements/REQ-098_WINDCUT_PASS_CLOUD_SHADOW_CONTINUITY.md` | windcutPassを既存cloud-shadow OUTDOOR/mist分類へ接続。northCliffRoad/legacy alias/unknown fallback保持。Pages run 34033702442 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 98 | REQ-099 | P1 | VERIFY | 風切り峠・terrain footstep演出の連続性 | `requirements/REQ-099_WINDCUT_PASS_FOOTSTEP_CONTINUITY.md` | windcutPassを既存footstep OUTDOOR/mist分類へ接続。transition/reduced-motion/unknown fallback保持。Pages run 34033788915 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 99 | REQ-100 | P1 | VERIFY | 風切り峠・cross-system coverage self-audit guard | `requirements/REQ-100_WINDCUT_PASS_CROSS_SYSTEM_COVERAGE_GUARD.md` | canonical windcutPassのguidance/battle/title/ambient/cloud/footstep coverageをlate-loading fail-closed smokeで固定。Pages run 34033921077 SUCCESS。IOS_PHYSICAL_VERIFICATION=NOT_REQUIRED_FOR_GATE。 |
| 100 | REQ-101 | P1 | VERIFY | 風切り峠・冒険ジャーナル目的地整合 | `requirements/REQ-101_WINDCUT_PASS_JOURNAL_OBJECTIVE_CONTINUITY.md` | windcutPass到着後のMAIN OBJECTIVEを現在地に整合。northCliffRoad/generic fallback保持。Pages run 34035907648 SUCCESS。Owner iPhone可読性確認待ち。 |
| 101 | REQ-103 | P1 | VERIFY | 風切り峠・ランドマーク照明の連続性 | `requirements/REQ-103_WINDCUT_PASS_LANDMARK_LIGHTING_CONTINUITY.md` | 傾いた道標と北尾根境界へcold wind glintを追加。既存town/forest/observation lightingを保持し、late fail-closed smokeで固定。Pages run 34040588718 SUCCESS on `a3d5b205...`。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 102 | REQ-104 | P1 | VERIFY | 北の崖道・ランドマーク照明の連続性 | `requirements/REQ-104_NORTH_CLIFF_LANDMARK_LIGHTING_CONTINUITY.md` | 壊れた安全杭と北折れ境界へcold stone/cliff glintを追加。REQ-103 windcut coverageと既存lightingを保持しfail-closed smokeで固定。Pages run 34040880074 SUCCESS on `af731342...`。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 103 | REQ-105 | P1 | VERIFY | 北尾根・実プレイ継続区間 | `requirements/REQ-105_NORTH_RIDGE_PLAYABLE_CONTINUATION.md` | windcutPass北境界→walkable `northRidgeApproach` / 北尾根・岩棚道。安全entry/return、4 canonical interactions、EVAC_ENEMIES、guidance、battle/title/ambient/cloud/footstep/journal/landmark coverage、late fail-closed acceptanceを同一REQで完結。Pages run 34042539057 SUCCESS on `c8a7411d...`; descendant run 34042614779 SUCCESS。IOS_PHYSICAL_VERIFICATION=PENDING。 |
| 104 | REQ-113 | P1 | BLOCKED | Cloudbreak North Playable Continuation | `requirements/REQ-113_CLOUDBREAK_NORTH_PLAYABLE_CONTINUATION.md` | Existing `windStairRidge` history preserved. Further generic Leon pursuit extension blocked by STORY_CANON. Original acceptance not falsely promoted to VERIFY. |
| 105 | REQ-114 | P1 | BLOCKED | Story Canon Wiring After Chapter 2 Design | `requirements/REQ-114_STORY_CANON_WIRING_AFTER_CHAPTER_02.md` | Duplicate `requirements/REQ-113_STORY_CANON_AUTONOMOUS_WIRING.md` is SUPERSEDED and must not execute. Wiring remains blocked until Owner-approved Chapter 2 design is ready. |
| 106 | REQ-115 | P2 | VERIFY | Wind Stair Ridge Presentation Polish | `requirements/REQ-115_WIND_STAIR_RIDGE_PRESENTATION_POLISH.md` | Published-map area-title continuity repaired; Pages SUCCESS; iPhone physical check PENDING. |
| 107 | REQ-116 | P2 | VERIFY | Wind Stair Ridge Environment Continuity | `requirements/REQ-116_WIND_STAIR_RIDGE_ENVIRONMENT_CONTINUITY.md` | Published-map ambient/cloud/footstep/landmark presentation continuity repaired; Pages SUCCESS; iPhone physical check PENDING. |
| 108 | REQ-117 | P1 | READY | World / Character Visual Richness Upgrade | `requirements/REQ-117_WORLD_CHARACTER_VISUAL_RICHNESS_UPGRADE.md` | Owner-directed presentation upgrade: character foot shadows, restrained idle motion, interaction popup easing, map edge blending/depth shadows/ambient air, and field-sprite outline/3-tone/detail/eye richness. Preserve input/collision/save/story authorities. |
| 109 | REQ-118 | P1 | READY | High-Quality Hero Selection Opening / Playable Prologue | `requirements/REQ-118_HIGH_QUALITY_HERO_SELECTION_OPENING.md` | Owner-approved playable Opening: Aldia hero-selection morning -> Luke playable intro -> school mock-battle flashback -> Leon anxiety -> ceremony -> abnormal crystal response -> Leon escape report -> Chapter 1 handoff. Existing saves must not rewind; protect Story Canon and P0 input/fullscreen. |

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