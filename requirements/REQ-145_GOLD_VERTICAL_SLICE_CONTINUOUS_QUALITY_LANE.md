# REQ-145 — GOLD VERTICAL SLICE CONTINUOUS QUALITY LANE

STATUS: IN_PROGRESS
PRIORITY: P0
OWNER_DIRECT_REQUEST: YES
QUALITY_LEVEL: Q5
EXECUTION_MODE: SEPARATE_BRANCH_CONTINUOUS_CHALLENGER
TARGET_REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
DEVELOPMENT_BRANCH: experiment/gold-vertical-slice

## 1. Owner intent

LUKE QUESTの既存本線を壊さず、別branchでChapter 1のplayer-visible qualityを徹底的に引き上げる。

目的は「REQを1個ずつ局所修正する」ことではない。

既存LUKEのstory canon / gameplay behavior / save compatibility / mobile input lessons / regression gatesを資産として保持しつつ、Astra世代で成果が出ている開発方式を5.6 Solでも可能な限り再現する。

半無限のtoken budgetを、短い局所patchの量産ではなく、build → play → critique → repair の反復へ投資する。

## 2. Absolute product goal

Chapter 1から5〜10分程度のGold Vertical Sliceを選び、現行公開版より明確に上の体験へする。

成功条件は「コードが増えた」ではなく、以下を満たすこと。

- iPhone portraitでworldが主役
- 最初の数秒でゲームらしさが伝わる
- 移動、会話、探索、戦闘、報酬、dramatic beatの一連が気持ちよくつながる
- visual hierarchyが整理されている
- playerが次に何をすべきか理解できる
- motion / feedback / lighting / framing / density / UIが一つの作品として整合する
- current mainと比較してcandidateが明確に優れている

## 3. Preserve existing authority

以下は原則として既存authorityを再利用し、duplicate authorityを作らない。

- protected Chapter 1 story canon
- canonical action()
- REQ-021 tap-anywhere behavior
- REQ-001 Dynamic Touch arbitration and central stopMoving()
- REQ-022 fullscreen / safe-area behavior
- canonical save schema / migration
- battle reward/progression authority
- existing Pages and regression protections

必要なpresentation rebuildは許可するが、上記authorityの意味変更は別途evidenceと明示的な安全設計なしに行わない。

## 4. Development philosophy

旧ループ:
requirements → code → CI → Pages → next requirement

REQ-145ループ:
TARGET EXPERIENCE
→ REFERENCE / QUALITY TARGET
→ CANDIDATE BUILD
→ PLAY / RUNTIME INSPECTION
→ VISUAL + UX CRITIQUE
→ REPAIR
→ REGRESSION
→ CURRENT-vs-CANDIDATE A/B QUALITY REVIEW
→ REPEAT

CIは品質の床であり、player-visible qualityそのものではない。

## 5. Mandatory roles

同一モデルでもcontext/観点を分離して以下を繰り返す。

### BUILDER
実装担当。最小のcoherent sliceを常にplayableに保つ。

### VISUAL DIRECTOR
world composition、UI、色、lighting、sprite scale、density、animation、effectsを評価。

### PLAYTESTER
実プレイ経路、迷い、入力、feedback、game feel、進行不能を評価。

### BLIND CRITIC
current mainとcandidateを先入観なく比較し、どちらがcommercial-quality productに見えるか、上位差分だけを返す。

### PERFORMANCE / SAFETY REVIEWER
iPhone向けcompositor負荷、DOM churn、event leakage、touch authority、save compatibility、Pages regressionを監査。

## 6. Gold slice initial scope

最初のsliceはChapter 1内の既存canonだけを使う。

優先候補:

王都 / 王都近郊
→ NPC interaction
→ field traversal / clue
→ battle
→ reward
→ Leonへ向かうdramatic progression

実装開始時にfresh code realityを見て、最もplayer-visible比較がしやすい5〜10分を確定する。

Chapter 2は作らない。

## 7. Quality axes

最低限、各iterationで以下を採点する。

1. FIRST_10_SECONDS
2. WORLD_VISUAL_COHERENCE
3. CHARACTER_READABILITY
4. UI_HIERARCHY
5. MOVEMENT_GAME_FEEL
6. INTERACTION_FEEDBACK
7. BATTLE_FEEDBACK
8. OBJECTIVE_CLARITY
9. CINEMATIC / DRAMATIC_IMPACT
10. MOBILE_PERFORMANCE
11. INPUT_SAFETY
12. SAVE / PROGRESSION_SAFETY

各軸は0〜5。

candidateはcurrent mainに対し、重大安全項目を落とさず、player-visible合計で明確に上回ること。

## 8. Iteration policy

- 一度の実装で完成扱いしない
- material changeごとにruntime evidenceを取る
- critiqueで弱点が残れば次のrepairへ進む
- 「十分」「区切りが良い」はstop理由にしない
- token budgetを理由に小さくまとめすぎない
- ただし安全なcheckpoint単位でcommitする
- broken branchを長時間放置しない

## 9. Reference policy

参考画像・既存ゲームの特徴を使う場合、copyright assetそのものをコピーせず、構図・密度・contrast・feedback・framingなど抽象的なquality characteristicsへ変換する。

LUKE QUEST固有のoriginal world / art / UIへ落とす。

## 10. Architecture policy

現行addon pile-upがlocal optimumの原因になっている場合、branch内でpresentation layerの整理・統合を許可する。

ただし:

- duplicate input handlerを増殖させない
- duplicate save authorityを作らない
- protected story dataをforkしない
- existing regressionを意図なく無効化しない
- mainへmergeする前に移植単位を明確化する

## 11. Branch isolation

Development branch:
`experiment/gold-vertical-slice`

mainはcanonical production baselineとして維持する。

REQ-145の実験的presentation changesはまずbranch内のみで行う。

mainへのpromoteは、current-vs-candidateの品質比較と回帰確認後に行う。

## 12. Initial deliverables

A. Gold Slice Experience Contract
- exact playable path
- target emotions
- before/after quality rubric
- must-preserve authorities

B. Candidate presentation foundation
- coherent world viewport
- HUD hierarchy
- interaction feedback
- motion/lighting/density baseline

C. Playtest loop
- reproducible path
- screenshots/runtime observations where available
- defect/work-order log

D. A/B quality gate
- current main vs candidate
- scored axes
- explicit reasons candidate wins/loses

## 13. Completion conditions

REQ-145をVERIFYへ進める最低条件:

1. separate branchにplayable Gold Vertical Slice candidateが存在
2. protected canon preserved
3. canonical touch/action/save authorities preserved or explicitly audited
4. relevant JS/static/browser regression PASS
5. candidate runtime can be exercised in browser
6. main vs candidate A/B reviewを実施
7. player-visible quality axesでcandidateが明確に優位
8. critical mobile/input/save regressionsなし
9. mainへpromote可能な移植計画またはPRが存在
10. Owner physical/subjective approvalが未実施ならOWNER_EXPERIENCE_PASS=PENDING / IOS_PHYSICAL_VERIFICATION=PENDINGのまま

## 14. Not completion

以下だけでは完了ではない。

- branchを作った
- design docを書いた
- CSSを少し変更した
- screenshotが一枚綺麗
- CIがgreen
- feature数が増えた
- Astra風promptを書いた
- current mainとの差が客観評価されていない

## 15. Preemption record

REQ-144 Original Generic Field NPC Art はOwnerの2026-09-09直接指示により一時suspendしREADYへ戻す。

REQ-144の既存成果・要件は削除しない。
REQ-145が安全に区切られた後、fresh priorityで再選択可能。
