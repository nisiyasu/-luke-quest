# REQ-107 — 北尾根・雲裂きの稜線 実プレイ継続

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYABLE CONTENT / FIRST-CHAPTER ROUTE CONTINUATION / CROSS-SYSTEM INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD after REQ-106 confirms:

- `windShelf` / 「北尾根・風蝕の岩棚」は公開Pagesで歩ける実プレイ区間になった。
- 北端 `(10,1)` の canonical landmark は「さらに北へ細い踏み跡が続く」と明示している。
- しかし現在は canonical `action()` で会話が出るだけで、次のwalkable transitionは存在しない。

したがって、プレイヤーが追跡の手掛かりを正しく追っても再び硬い終点へ到達する。

## 2. PURPOSE

`windShelf` の北へ、もう1区間だけ実際に歩いて探索できる高所稜線を追加する。

Canonical map id:

`skylineTraverse`

Player-visible name:

`北尾根・雲裂きの稜線`

これは第一章の追跡路を前へ伸ばすためのapproach/exploration continuationであり、protected story revealではない。

Do NOT:

- Leon / Glennの隠された最終意図を明かす
- Eleanor / Elysiaの裏設定を先出しする
- mandatory bossを追加する
- required new story flagを追加する
- `withdrawProofSeen` authorityを変更する
- reward / damage / item / encounter balanceを変更する

## 3. ROUTE REQUIREMENTS

- `windShelf` north boundary `(10,1)` の既存canonical interactionから `skylineTraverse` へ遷移する。
- entry spawnは安全・walkable・north-facing。
- south return gateから安全に `windShelf` へ戻れる。
- 既存追跡ロジックと整合するcanonical interactableを最低4つ置く。

Required interactables:

1. near-entry: 風で途切れながらも北へ続く新しい片足跡
2. mid-route safety landmark: 稜線の横風と崩れた石積み
3. distant route observation: 雲の切れ間からさらに北へ続く尾根を確認する観測点
4. north-end continuation landmark: 踏み跡がさらに高い稜線へ折れている地点

- 新必須story flagは作らない。
- `map === 'skylineTraverse'` は既存generic persistenceでsave/load可能であること。

## 4. GUIDANCE

攻略情報なしで次に何を調べればよいか分かること。

- entry直後はfirst clueを探すcompact objective。
- first clueをcanonical `action()` で調べた後、north continuationへobjectiveを即更新。
- currently relevant landmarkにpointer-safeな軽いmarkerを表示。
- guidance phaseはruntime-onlyでsave semanticsを変更しない。
- mapを離れたらarea-specific markerを残さない。

## 5. GAMEPLAY / ENCOUNTER

- 既存canonical random encounter loopを利用。
- exact `EVAC_ENEMIES` を再利用。
- adjacent north-route mapと同等のentry / return encounter graceを付与。
- battle logicを複製しない。
- rewards / enemy stats / encounter rate authorityを変更しない。

## 6. CROSS-SYSTEM INTEGRATION — SAME REQUIREMENT

VERIFY前に `skylineTraverse` を以下へ統合する。

1. regional battle background
2. area-title subtitle
3. world ambient layer
4. cloud/outdoor classification
5. terrain footstep presentation
6. Adventure Journal location-aware MAIN OBJECTIVE
7. landmark-lighting / route-readability layer

既存map coverageとunknown-map fallbackを壊さない。

## 7. INPUT / IPHONE SAFETY

REQ-021 / REQ-022 / REQ-001を保護する。

- 新しい独立world pointer handlerを作らない
- short dead-zone tap -> final canonical `action()` exactly once
- drag -> Movement; release Actionなし
- Dynamic Touch pointer ownership / dead zone / direction change / central `stopMoving()`を維持
- pointercancel / blur / visibilitychange / dialogue / battle / map transition / rerender safetyを維持
- MENU / button / input / link exclusionsを維持
- fullscreen viewport-primary worldを維持
- 追加presentation DOMはpointer-safe

P0 visibilitychange regression checkpoint `a667febf1b49c234c9c019bdb4f63a1ebd0ceb39` 以降のguardを弱めない。

## 8. FORWARD-COMPATIBILITY

REQ-106 acceptanceは現在 `windShelf` north boundaryのcanonical interactionを検証している。

REQ-107 transition導入時:

- REQ-106 acceptanceをforward-compatibleにする。
- historical north-boundary interactionが実際に発火したことは引き続き検証する。
- legitimate `skylineTraverse` transitionを許容する。
- その他REQ-106 assertionsを弱めない。

## 9. FAIL-CLOSED ACCEPTANCE

Dedicated late-loading assembled-browser acceptanceで最低限検証する。

- map id / display name / dimensions / critical coordinates
- required four interactables
- Wind Shelf north boundary -> Skyline Traverse transition
- safe entry + immediate walking
- canonical Action interactions
- guidance clue phase -> north phase
- safe south return
- exact `EVAC_ENEMIES` reuse
- no required new story flag
- protected canon unchanged
- save schema unchanged
- battle/title/ambient/cloud/footstep/journal/landmark coverage
- unknown-map fallbacks preserved where applicable
- presentation overlays pointer-safe
- temporary runtime/localStorage restoration
- REQ-021/022/001 guard status remains present

Broken REQ-107 must fail closed before Pages upload/deploy.

## 10. PUBLIC COMPLETION GATE

Required before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-107 acceptance PASS
- assembled browser smoke PASS
- 390x844 floating touch/fullscreen regression PASS
- visibilitychange touch regression PASS
- existing North Cliff / Windcut / North Ridge / Wind Shelf regressions PASS
- GitHub Pages workflow SUCCESS on a HEAD containing complete implementation + guard
- deployed build inclusion PASS

IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms on an actual iPhone.

## 11. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING

## 12. NO-STOP

REQ-107 registration, implementation, commit, Pages success, queue synchronization or CURRENT autosave is not an autonomous stop condition.
