# REQ-149 — PS1-Class Visual Quality Migration

STATUS: IN_PROGRESS
PRIORITY: P0
OWNER_PRIORITY: LATEST_DIRECT_OWNER_REQUEST
PARENT_LANE: REQ-145_GOLD_VERTICAL_SLICE_CONTINUOUS_QUALITY_LANE
ACTIVE_BRANCH: experiment/gold-vertical-slice
ISSUE_EPIC: #5
EXECUTION_ISSUES: #6 #7 #8 #9 #10 #11

## Owner intent

LUKE QUESTの現状画面を `CURRENT_BAD.png` として保全し、`MINIMUM_QUALITY_LINE.png` を最低合格ライン、`TARGET_PS1_FINAL.png` を本命の到達品質として、実際に歩けるゲームの知覚品質を段階的に引き上げる。

これは「少し綺麗なDOM/CSSゲーム」を作る要件ではない。Ownerが指摘した差は小物・影・樽・ベンチ等の局所装飾ではなく、地形・素材・レイヤー・奥行き・水・橋・樹木・人物・HUDを含む画面生成方式の品質差である。

`MINIMUM_QUALITY_LINE.png` に届くことは最終完成ではない。そこを最低線として超えた上で、`TARGET_PS1_FINAL.png` との差を実質的に縮め続ける。

## Canonical visual references

Folder:
`assets/reference/owner_2026-09-11_ps1_visual_target/`

- `CURRENT_BAD.png` = current / bad example / before reference only
- `MINIMUM_QUALITY_LINE.png` = minimum acceptable visual-quality floor
- `TARGET_PS1_FINAL.png` = primary Owner-approved final visual target
- `README.md` = interpretation contract

Mandatory comparison:

`CURRENT_BAD -> candidate build -> MINIMUM_QUALITY_LINE -> TARGET_PS1_FINAL`

判定は二段階とする。

1. candidateが `MINIMUM_QUALITY_LINE` を少なくとも満たす / 超えるか。
2. candidateが `TARGET_PS1_FINAL` との差を実質的に縮めているか。

`CURRENT_BAD` より少し良いだけではPASSしない。最低ラインへ到達しただけでも最終完成にはしない。

## Scope

### First delivery scope

`CURRENT_BAD.png` に対応する王都近郊の画面と、その周囲を実際に歩ける範囲。

最初の一画面だけでなく、前後左右移動時に地形・描画順・人物・マップ端・通行範囲が破綻しない範囲まで含む。

### Not automatically included

- Chapter 1全域の全面刷新
- mainへのmerge
- 3D化
- 全ゲームロジックのrewrite

これらは本要件の最初の合格条件ではない。

## Protected behavior

視覚移行のために以下を壊してはならない。

- REQ-021 Tap Anywhere Action
- REQ-022 iPhone Fullscreen World UI
- REQ-001 Dynamic Touch Controller
- canonical `action()`
- pointer tap / drag distinction
- central `stopMoving()`
- dialogue
- battle
- reward
- area transition
- save / resume compatibility
- story progression
- existing collision semantics unless separately specified and tested
- REQ-023 north-route guidance
- REQ-147 battle command geometry
- REQ-148 post-battle VICTORY + Luke comment presentation

## Architecture rule

第一候補は既存ゲームロジックを保持し、presentation / renderer側を段階的に置換する。

DOM/CSSを維持すること自体は目的ではない。V00〜V04の証拠で、現行DOM/CSS方式が `TARGET_PS1_FINAL` の地形・レイヤー・素材・性能を効率よく達成できないと判明した場合、Canvas / WebGL等の描画方式への段階的移行を許可する。

ただし無証拠の全面rewriteは禁止。既存story/state/input/battle/saveを再利用し、rendererだけを安全checkpoint単位で交換する。

## Execution stages

### V00 — Current-state reproduction and preservation
- fresh Gold/main HEADを記録
- deployed assembly orderを確認し、raw index単体を完成物扱いしない
- `CURRENT_BAD.png` 相当の位置・向き・state・viewportを再現可能に固定
- rollback pointを保存

PASS: 同条件を再現でき、開始状態へ戻せる。

### V01 — Target specification
`MINIMUM_QUALITY_LINE.png` と `TARGET_PS1_FINAL.png` を grass / cliff / shore / water / bridge / conifer / foliage / rocks / signs / player / HUD / light / depth / scene density に分解し、最低線と本命到達点を見て判定できる条件へ変換する。

PASS: 「豪華」「PS1っぽい」だけではない具体的なvisual acceptanceがある。

### V02 — Render-authority and collision map
組立済みDOM / CSS / addon順を基準に、ground / water / cliff / structure / player / foreground / HUD の最終描画担当を特定する。旧表現をどこで停止し、何を保護するかを明示する。

PASS: 無制限のaddon/CSS上乗せをせず、renderer責任境界が明確。

### V03 — Asset production contract
最小素材セットを制作する。初期目安: grass variants, shore edges/corners, cliff face, water, conifer, bridge deck/side/support/rail, grounding shadow。

PASS: scale / origin / transparency / view / light direction / pixel densityが統一され、manifestがある。

### V04 — Small playable quality gate
草・崖・水・橋・木・Lukeが同時に見える小区画を実ゲームへ実装し、歩行・同構図比較を行う。

PASSには最低でも `MINIMUM_QUALITY_LINE` 相当を満たし、かつ `TARGET_PS1_FINAL` 方向へ質感・立体感・scale・scene coherenceが明確に揃っていることを要求する。

**V04未合格の素材・方式を全域へ量産してはならない。**

### V05 — Grass / shore / cliff
### V06 — Water / shoreline
### V07 — Bridge structure / passability coherence
### V08 — Forest / props
### V09 — Player integration
### V10 — Lighting / color unification
### V11 — HUD / controls visual integration
### V12 — Surrounding playable-area rollout
### V13 — Regression / performance / Pages verification
### V14 — Final same-area target comparison and repair loop

V05〜V14の詳細acceptanceはIssue #8〜#11をcanonical execution decompositionとして参照する。

## V04 quality gate — non-negotiable

以下ではV04 PASSにしない。

- CSSの色を変えただけ
- 木・樽・ベンチ等の小物を増やしただけ
- shadow/filterを増やしただけ
- `CURRENT_BAD` より少し綺麗になっただけ
- `MINIMUM_QUALITY_LINE` を下回る
- 最低ラインへ届いただけで本命targetとの差を無視する
- generated imageを保存しただけ
- background一枚絵としてTARGETを貼っただけ
- CI greenだけ

実際のplayable areaで `CURRENT_BAD -> candidate -> MINIMUM_QUALITY_LINE -> TARGET_PS1_FINAL` を比較し、candidateが最低線を超え、本命target方向へ構造的に近づいている必要がある。

## Player-visible completion

最低限:

- candidateがassembled buildへ含まれる
- browser regression PASS
- relevant P0 input regression PASS
- gameplay flow維持
- save/resume維持
- public Gold Pagesへ含まれる場合はdeployed SHA一致確認
- Owner visual verificationは別扱い
- iPhone physical verificationは別扱い

`OWNER_EXPERIENCE_PASS = PENDING` until Owner confirms.

`IOS_PHYSICAL_VERIFICATION = PENDING` until Owner confirms on actual iPhone.

## No fake completion

禁止:

- requirement / issue / spec作成だけでimplementation complete
- asset追加だけでimplementation complete
- code存在だけでplayer-visible complete
- CI greenだけでOwner experience pass
- WebKit automationだけでphysical iPhone pass
- mainより少し改善だけでTARGET reached
- `MINIMUM_QUALITY_LINE` 到達だけで `TARGET_PS1_FINAL` reached扱い
- CURRENT更新だけで進捗完了
- 本要件完了を理由に自動main merge

## Required evidence record

```text
TASK_ID: FIELD-Vxx
STATUS: NOT_STARTED | IN_PROGRESS | BLOCKED | VERIFY | DONE
BASE_SHA:
RESULT_SHA:
CURRENT_BAD_IMAGE: assets/reference/owner_2026-09-11_ps1_visual_target/CURRENT_BAD.png
MINIMUM_QUALITY_IMAGE: assets/reference/owner_2026-09-11_ps1_visual_target/MINIMUM_QUALITY_LINE.png
TARGET_IMAGE: assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png
ACTIVE_STAGE:
CHANGED_FILES:
ASSET_VERSIONS:
BUILD_COMMAND:
REPRO_STATE_AND_VIEWPORT:
SCREENSHOT_PATHS:
FUNCTIONAL_RESULT:
VISUAL_RESULT:
PERFORMANCE_RESULT:
FAILED_CHECKS:
REMAINING_GAPS:
NEXT_EXACT_ACTION:
ROLLBACK_POINT:
OWNER_EXPERIENCE_PASS: PENDING
IOS_PHYSICAL_VERIFICATION: PENDING
```

## Current execution start

Continue from fresh HEAD / CURRENT reality. Do not stop at planning. Preserve V04 as the quality gate until the minimum line is met and the final-target gap is materially closing; do not broaden V05〜V12 merely because functional CI is green.
