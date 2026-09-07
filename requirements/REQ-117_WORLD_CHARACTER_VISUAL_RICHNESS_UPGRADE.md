# REQ-117 — WORLD / CHARACTER VISUAL RICHNESS UPGRADE

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE_PRESENTATION / MAP_VISUALS / FIELD_CHARACTER_VISUALS / UX_POLISH
OWNER_REQUEST_DATE: 2026-09-07 JST
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. OWNER INTENT

現在のLUKE QUESTのマップとフィールドキャラクターは、ゲームとしては動いているが、見た目が平坦・寂しい・接地感が弱い・キャラクターのドット表現が単調に見える。

本Requirementでは、既存ゲームプレイ・入力・当たり判定・Story Canon・Save authorityを壊さず、後期16-bit〜初期32-bit世代の上質な2D JRPGに見られるような、立体感・空気感・接地感・キャラクターの陰影とディテールをLUKE QUEST独自表現として強化する。

特定作品の既存アセットを複製・トレースしない。狙うのは一般的な高密度2D JRPG表現の原則であり、LUKE QUEST固有の配色・形状・素材を維持する。

---

## 1. ABSOLUTE SAFETY BOUNDARY

本Requirementは原則 `presentation-only` とする。

変更してはならないもの:

- canonical pointer / touch authority
- REQ-021 Tap Anywhere Action
- REQ-022 iPhone Fullscreen World UI
- REQ-001 Dynamic Touch Controller
- collision / walkability
- player / NPC canonical tile coordinates
- event trigger coordinates
- battle logic
- map transition semantics
- save schema / save fields
- Story flags
- STORY_CANON
- encounter authority
- quest completion conditions

演出レイヤーは可能な限り:

- `pointer-events: none`
- non-persistent
- state read-only
- transform / pseudo-element / overlay based
- cleanup-safe
- map-transition-safe

とする。

見た目のtransformによって、実座標・衝突判定・interaction facing判定を変えてはならない。

---

# 2. MAP VISUAL RICHNESS

## 2.1 Tile Boundary Blending / Autotile-like Edge Treatment

### Goal

地面・レンガ道・石・木・森・壁等の境界が硬く切れすぎている箇所をなじませ、単純な色面の並びではなく奥行きのある地形に見せる。

### Required behavior

- 隣接タイル種が変わる境界に、薄いハイライト / 暗部 / グラデーション /専用edge overlayのいずれかを使う。
- 既存map data自体を書き換えず、描画側で補助する方式を優先する。
- 地面と道、道と壁、草地と森林等で同じ一律処理をせず、既存tile分類に応じて強度を変えてよい。
- pixel-artらしい輪郭を消すほどblurしない。
- iPhone表示で境界が汚く滲まないこと。

### Preferred implementation

現在の描画方式をfresh auditし、CSS/DOM tileならpseudo-element/overlay、Canvas系ならneighbor-aware edge pass、既存tile asset authorityがある場合はautotile-like edge assetを選択する。

---

## 2.2 Height / Drop Shadow Layer

### Goal

レンガ道、壁、段差、石造物、木や高いオブジェクトの「下側」に薄い影を置き、高低差と接地感を作る。

### Required behavior

- raised surfaceの下側に暗い半透明shadowを追加。
- 影は強すぎず、画面全体を暗くしない。
- player / NPC / interaction / collisionを遮らない。
- shadow overlayは pointer transparent。
- map transition後にstale shadowが残らない。

### Visual direction

- short drop shadow
- soft but pixel-compatible edge
- 低コントラスト
- 光源方向はマップ内で一貫させる

---

## 2.3 Ambient Air / Dust Particle Layer

### Goal

画面全体へごく薄い「空気」を加え、静止画的な平坦感を減らす。

### Required behavior

- ごく薄い半透明の光粒 / dust / mist mote等を低速移動させる。
- map categoryに応じて既存ambient authorityがある場合はそれを再利用する。
- particlesは gameplay stateを一切変更しない。
- `pointer-events: none`。
- map transition / dialogue / battle transitionでcleanup-safe。
- permanent save stateを追加しない。
- mobile performanceを優先し、particle countを制限する。
- `prefers-reduced-motion` では停止または大幅減衰。
- 非表示タブで無駄な高頻度描画を続けない。

### Map-sensitive examples

- town / field: warm fine dust / light motes
- forest: leaf-light / pollen-like restrained particles
- mist / high-altitude maps: cold mist / sparse wind motes

既存 `world-ambient-layer.js` 等のauthorityがある場合は、競合する第2のambient authorityを新設せず、可能な限り統合する。

---

# 3. CHARACTER GROUNDING / PRESENCE

## 3.1 Universal Elliptical Foot Shadow — HIGHEST VISUAL PRIORITY

### Goal

player / NPCが背景から浮いて見える問題を解消する。

### Required behavior

- world上のplayerと通常NPCすべての足元に楕円形の黒〜濃色半透明shadowを表示する。
- shadowはentity bodyより下のz-order。
- shadowはentityのcanonical位置ではなく見た目の足元へ追従。
- character click/tap/facing判定を変えない。
- shadow自身はpointer transparent。
- dialogue / battle / map transition後にghost shadowを残さない。
- character sizeに応じてshadow widthを調整できる。

### Quality bar

- 真円禁止。横長楕円。
- opacityは「見えるが主張しない」。
- 必要なら1px程度のsoftnessを使うが、pixel-artをぼかさない。

---

## 3.2 Idle Breathing / Bounce Animation

### Goal

停止中のplayer / NPCに生命感を出す。

### Required behavior

- idle中だけ、1〜2px以内の垂直変位または極小scaleによる呼吸感を追加。
- movement中は既存walk animationを優先し、idle transformが競合しない。
- canonical x/y coordinatesは変更しない。
- collision / event trigger / facingは視覚transformに影響されない。
- playerもNPCも適用可能だが、NPC全員が完全同期して呼吸しないよう位相差を持たせてよい。
- `prefers-reduced-motion` では停止または静的表示。
- dialogue中に不自然なら会話対象のみ減衰 / 停止してよい。

### Motion direction

高級感を優先し、派手なbounceは禁止。
「呼吸している」「わずかに体重移動している」程度とする。

---

## 3.3 Interaction Popup Ease-In

### Goal

NPCの `話す` / `調べる`、Glen系 `TALK / EXAMINE` 等のinteraction affordanceが瞬間表示される安っぽさをなくす。

### Required behavior

- 表示時に短時間のopacity + translateY + tiny scale easingを追加。
- 少し下からふわっと湧き上がる感覚。
- 入力受付タイミングは既存canonical Actionのまま。
- animation中でもTap Anywhere / A fallbackを妨害しない。
- popup自身のpointer modelを勝手に変更しない。
- repeated renderでanimation nodeがstackしない。
- reduced-motion対応。

### Duration target

概ね 100〜180ms 程度を基準に、fresh visual auditで調整する。

---

# 4. FIELD CHARACTER PIXEL-ART RICHNESS

## 4.1 Scope

対象は主にworld / field上のplayerとNPC sprite表現。

Dialogue portraitや正式キャラクター立ち絵は別authorityを尊重する。
REQ-004 Leon formal dialogue art / REQ-005 Glenn formal dialogue art等のOwner-quality-source待ちを、本Requirementだけで勝手にDONE扱いしてはならない。

既存の承認済みLuke field sprite / raster assetがある場合、freshにasset authorityを確認し、無断で低品質なprogrammatic spriteへ置換しない。

---

## 4.2 1px Outline Principle

各field characterは、背景から判読できるよう外周に1px相当のclean outlineを持つこと。

- pure blackまたは髪 / 服の同系統dark toneを使う。
- outlineが太すぎて頭身を潰さない。
- internal featureすべてを黒枠で囲ってゴチャつかせない。
- 背景色と同化しやすい方向でもsilhouetteが読める。

---

## 4.3 Mandatory Three-Tone Shading

主要素材ごとに最低3階調を基本とする:

1. base
2. shadow
3. highlight

対象:

- hair
- primary clothing
- cape / armor / robe等の大面積素材

### Required detail

- hair top / light-facing edgeにhighlight cluster
- hair underside / backにshadow
- clothing folds / armpit / belt下 / body sideにshadow
- shoulder / chest / upper foldにrestrained highlight

単純なsmooth gradientではなく、pixel clusterとして読める階調を優先する。

---

## 4.4 Proportion / Costume Detail

現在の寸胴感を軽減する。

- 頭身を極端にリアル化しない。
- shoulder width / neck / torso separationを改善。
- collar / belt / waist boundary / bootsを判読可能にする。
- armとtorsoが一枚の塊に見えないようにする。
- side/back directionでも服装の特徴が失われないようにする。

LUKE QUESTの既存可愛いJRPG character scaleは維持し、過度な高頭身化は禁止。

---

## 4.5 Eyes / Expression Readability

目を単一の大きな丸・四角ベタ塗りだけにしない。

解像度が許す範囲で:

- eye white / sclera indication
- iris / dark pupil
- tiny highlightまたは向きが分かる配置

を使い、視線方向と最低限の表情が読めるようにする。

小解像度spriteで白目がノイズになる場合は、1〜2pixel clusterによる視線方向表現を優先してよい。

---

## 4.6 Four-Direction Consistency

既存4方向player/NPC sprite authorityがある場合:

- front
- back
- left
- right

でoutline / palette / costume identifiers / shadow / proportionが一貫すること。

歩行フレームも同一character identityを保つ。

---

# 5. IMPLEMENTATION STRATEGY

このREQは大きいため、一度に全てを書き換えて破損させない。

同一Requirement内で以下のcheckpointを順に実行してよい。

## Checkpoint A — Grounding and Interaction Polish

- universal character foot shadow
- idle animation
- interaction popup easing

Aのpublic gateが通るまでBへ進まない。

## Checkpoint B — Map Depth

- tile boundary blending
- raised-object / path drop shadows
- map visual regression

## Checkpoint C — Ambient Air

- lightweight map-aware particle / air layer
- reduced motion / visibility cleanup / mobile performance

## Checkpoint D — Field Sprite Richness

- fresh audit existing player/NPC sprite authorities
- improve outline / 3-tone shading / costume detail / eyes / proportions
- prioritize visible recurring field NPCs and player
- preserve approved source authority

各checkpointは安全なcompleted unitとしてcommit可能。
ただしcheckpoint完了はREQ全体を終了する理由ではない。

---

# 6. PLAYER-VISIBLE ACCEPTANCE CRITERIA

最低限、以下を満たすまでVERIFYへ移さない。

## Character grounding

- player足元shadow visible
- representative town NPC shadow visible
- representative field/forest NPC shadow visible
- shadow does not change interaction/collision

## Idle

- player idle motion visible but restrained
- at least representative NPC idle motion visible
- walking animation remains intact
- reduced-motion fallback works

## Interaction popup

- semantic `話す` / `調べる` prompt gets ease-in
- Glenn TALK/EXAMINE or equivalent existing named interaction affordance gets same quality treatment where architecture permits
- no duplicated popup or stuck opacity

## Map depth

- at least town + field + forest representative screenshots/browser checks show softened tile boundaries
- raised path/wall/object lower-edge shadows visible
- no collision/map-data mutation

## Ambient

- at least 3 environment categories use restrained ambient air treatment
- pointer-safe
- reduced-motion safe
- hidden-tab / transition cleanup safe

## Sprite richness

- player and multiple recurring NPC field sprites show improved silhouette/readability
- outline visible against light and dark backgrounds
- major hair/clothing use base+shadow+highlight where pixel resolution permits
- eye / gaze or facial-direction readability improved where resolution permits
- no accidental replacement of Owner-approved dialogue art authority

---

# 7. REGRESSION / PUBLIC GATES

Before VERIFY:

1. JavaScript/static validation PASS
2. existing add-on contract guard PASS
3. assembled browser smoke PASS
4. 390x844 iPhone touch/fullscreen smoke PASS
5. REQ-021 Tap Anywhere regression PASS
6. REQ-022 fullscreen visual-liveness PASS
7. REQ-001 Dynamic Touch regression PASS
8. representative town/field/forest rendering PASS
9. map transition cleanup PASS
10. dialogue + interaction prompt PASS
11. no Story flag / Save schema mutation
12. Pages workflow SUCCESS

`IOS_PHYSICAL_VERIFICATION` remains `PENDING` until Owner verifies on actual iPhone.

---

# 8. PERFORMANCE BUDGET

- avoid high particle counts
- avoid expensive full-screen blur every frame
- avoid unnecessary layout thrash
- avoid per-frame DOM recreation where reusable layer is possible
- pause or reduce animation while hidden
- preserve playable frame pacing on iPhone viewport

If a requested effect materially harms mobile performance, choose the lower-cost visual equivalent while preserving Owner intent.

---

# 9. DO NOT

- do not add another main-story route/map as part of this REQ
- do not invent Chapter 2
- do not change Leon sister canon/profile
- do not alter battle balance
- do not change player speed
- do not alter collision to fit visuals
- do not move NPC event coordinates for aesthetic reasons
- do not replace approved Luke assets with lower-quality placeholder SVG
- do not mark REQ-004/REQ-005 completed from this work
- do not introduce copyrighted game assets or traced sprites
- do not make all particles / shadows / motion so strong that UI readability drops

---

# 10. COMPLETION DEFINITION

IMPLEMENTATION_COMPLETE = YES only when Checkpoints A-D have been implemented or, where a checkpoint cannot be safely completed, its exact external blocker is recorded and all independent safe portions are completed.

PAGES_VERIFIED = YES only after the final integrated presentation build is publicly deployed successfully.

OWNER_VISUAL_APPROVAL = PENDING until Owner checks the actual game visually.

IOS_PHYSICAL_VERIFICATION = PENDING until Owner confirms on actual iPhone.

---

# 11. IMPLEMENTATION CHECKPOINT — 2026-09-07

STATUS: `VERIFY`
IOS_PHYSICAL_VERIFICATION: `PENDING`

Machine/public evidence:

- Checkpoint A: canonical character grounding, foot shadows, restrained idle motion and interaction easing. The stale duplicate-authority gate was repaired to validate `world-character-grounding.js` directly.
- Checkpoint B: neighbor-aware town/field/forest edge depth retained while per-tile `filter: drop-shadow()` and `isolation:isolate` compositor layers were removed in favor of iPhone-safe box-shadow treatment.
- Checkpoint C: canonical ambient authority reused; mobile particle count capped, fog blur/filter removed, hidden-page lifecycle and reduced-motion handling preserved.
- Checkpoint D: approved Luke 4-direction × 3-frame WebP raster authority preserved and routed through the canonical visual-body wrapper. This repairs the prior risk where sprite application could delete the canonical foot-shadow/body structure. Multiple recurring NPCs retain the canonical grounded body and receive lightweight silhouette treatment without inventing fake formal NPC raster assets.
- REQ-021 Tap Anywhere, REQ-022 iPhone Fullscreen and REQ-001 Dynamic Touch authority remain protected.
- Dedicated REQ-117 A/B/C/D gate run `34074892503`: SUCCESS.
- GitHub Pages run `34074892512` (#1219): SUCCESS on `707dab7a888bb7a0ba8e25f00316ee07d2e66327`.
- Render Liveness run `34074892523`: SUCCESS after the compositor-safe character/sprite integration.
- REQ-121 progression regression run `34074892552`: SUCCESS.

Subjective final sprite/art feel remains Owner iPhone verification territory; machine success is not physical-device PASS.

EOF
