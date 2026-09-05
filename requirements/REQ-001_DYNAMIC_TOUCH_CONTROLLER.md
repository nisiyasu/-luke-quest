# REQ-001 — Dynamic Touch Movement Controller

STATUS: VERIFY
PRIORITY: P0
TYPE: UX / INPUT / IPHONE
OWNER_REQUEST: CONFIRMED

## PURPOSE

LUKE QUESTのiPhoneフィールド移動を、固定位置の方向キー中心から、画面の任意位置から呼び出せる動的タッチコントローラーへ改善する。

プレイヤーがフィールド画面の任意位置へ指を置くと、その指の位置を中心として半透明の上下左右コントローラーを表示する。

そのまま指を上下左右へスライドすると対応方向が選択され、その方向で指を保持している間は連続移動する。

指を離した瞬間に移動停止し、コントローラーを消す。

iPhone Safariで片手でも自然に操作できることを最重要とする。

## CURRENT PROBLEM

固定方向キーのみでは、

- 指を毎回固定位置まで移動する必要がある
- iPhoneの持ち方によって操作位置が合わない
- フィールドを見る領域をUIが常時占有する
- ゲーム機的というよりWeb UI感が強い

という問題がある。

## CURRENT IMPLEMENTATION REALITY AT REGISTRATION

Repositoryのv0.30系では、floating one-thumb controllerの初期実装が既に公開済み。

確認されている実装要素:

- free field touch位置への半透明4方向controller表示
- button/link/menu/dialogue等のinteractive UI除外
- dead zone
- dominant-axisによるUP/DOWN/LEFT/RIGHT判定
- drag/hold連続移動
- release/cancelで既存中央管理 `stopMoving()` へ戻す
- battle/dialogue/world遷移時cleanup
- pointerup / pointercancel / blur / visibilitychange cleanup
- keyboardと既存fixed d-padのfallback維持
- current dead zone: 16 CSS px
- current outer radius: 70 CSS px、直径140px相当

したがって本REQは新規ゼロ実装ではなく、現実の実装をこの正式仕様へ照合し、不足テスト・操作感・安全性をVERIFYする案件として登録する。

OwnerによるiPhone実機操作感確認は未完了なので、実装済みという理由だけでDONEにしない。

## TARGET INTERACTION

フィールド探索中:

pointerdown / touchstart
↓
その位置にDynamic Controller表示
↓
開始位置をCENTERとして記録
↓
指をスライド
↓
deltaX / deltaY計算
↓
dead zoneを超えたら方向決定
↓
UP / DOWN / LEFT / RIGHT
↓
方向へ連続移動
↓
指を別方向へ滑らせたら方向変更
↓
pointerup / pointercancel
↓
stopMoving()
↓
controller非表示

## INPUT ARCHITECTURE

既存の中央管理型movement systemを破壊しない。

必ず既存の `stopMoving()` を移動停止の唯一の基準として維持する。

過去に発生した重大バグ:

pointerdown
→ move()
→ render()
→ DOM rebuild
→ button local pointerup消失
→ timer残留
→ 勝手に歩き続ける

この再発を絶対に防止する。

Dynamic Controllerを導入したことで、button-local-onlyなrelease処理へ戻してはならない。

## REQUIRED STATE

実装では少なくとも以下に相当する状態を持つこと。

- `dynamicPad.active`
- `dynamicPad.pointerId`
- `dynamicPad.originX`
- `dynamicPad.originY`
- `dynamicPad.currentX`
- `dynamicPad.currentY`
- `dynamicPad.direction`
- `dynamicPad.deadZone`
- `dynamicPad.radius`

命名は既存コードとの整合性を優先して変更してよい。

状態が複数箇所へ分散してrelease漏れを起こさないようにする。

## POINTER EVENTS

iPhone Safariを考慮し、可能ならPointer Eventsを中心に実装する。

field gameplay surfaceで:

- `pointerdown`

windowまたはdocument levelで:

- `pointermove`
- `pointerup`
- `pointercancel`

を管理する。

重要:

`pointerup`を生成されたDynamic Controller DOM自身だけに登録してはいけない。

controller DOMが再renderされたり、指がcontrollerの外へ移動しても、移動停止イベントを失わない構造にする。

## POINTER CAPTURE

安全に利用できる場合、

`setPointerCapture(pointerId)`

または同等の仕組みを検討する。

ただしiPhone Safariや既存DOM再構築との相性で問題が出る場合は、window-level pointer trackingを優先する。

pointer captureを使うこと自体を完了条件にはしない。release safetyが本質。

## UI EXCLUSION

以下の場所からDynamic Controllerを起動してはいけない。

- dialogue
- battle
- menu
- shop
- inn
- inventory
- save/load
- system buttons
- action button
- existing interactive controls
- links
- buttons
- input
- select
- textarea
- その他、ユーザーが通常のUI操作を期待するinteractive element

interactive element判定を用意し、`closest()` 等でUI祖先を確認してよい。

UI上のタップはUI本来の動作を優先する。

## GAME STATE EXCLUSION

以下ではDynamic Controllerを起動しない。

- world exploration以外のscreen
- dialogue active
- battle active
- transition active
- menu active
- scripted event active
- movementを意図的にlockしている状態

既存実装のscreen/state modelと整合させる。

## DEAD ZONE

指を置いただけでキャラを動かさない。

開始地点からの距離がdeadZone以下の場合:

`direction = null`

とする。

初期目安:

12〜24 CSS px程度。

登録時点の実装値は16 CSS px。

Owner実機確認で敏感すぎる/鈍すぎる場合は調整する。

## DIRECTION CALCULATION

概念:

`dx = currentX - originX`

`dy = currentY - originY`

`absX = abs(dx)`

`absY = abs(dy)`

基本判定:

`absX > absY` → horizontal

それ以外 → vertical

horizontal:

- `dx > 0` → RIGHT
- `dx < 0` → LEFT

vertical:

- `dy > 0` → DOWN
- `dy < 0` → UP

斜め移動は現段階では導入しない。

斜めへ指が移動した場合も最も優位な4方向へ丸める。

## DIRECTION HYSTERESIS

方向境界付近で、

UP
RIGHT
UP
RIGHT

のように高速で入力がブレないようにする。

必要なら現在方向を少し優先するhysteresisを設ける。

例えば現在RIGHTなら、vertical成分がhorizontal成分を一定幅以上上回るまでRIGHTを維持する等。

具体値はOwner実機操作感を優先する。

現在のdominant-axis実装に明示的hysteresisがない場合、それだけで即FAILにはしないが、実機で方向がチラつくならこの項目を実装する。

## CONTINUOUS MOVEMENT

方向が決定したら既存movement loopへ入力する。

新しい独立した無制限 `setInterval` を乱造しない。

既存の `moveTimer`、中央movement controller、または既存d-pad入力経路を可能な限り再利用する。

保持中:

RIGHT
RIGHT
RIGHT
...

のようにタイル単位で継続する。

方向変更時:

RIGHT
↓
UP

なら、古いRIGHT入力を安全に解除してUPへ切り替える。

複数方向timerが同時に残らないこと。

## MOVEMENT SPEED

タイルベースゲームとして不自然な高速移動にしない。

既存keyboard / fixed d-padとおおむね同じ歩行速度を維持する。

Dynamic Controllerだけ異常に速い/遅い状態にしない。

## CONTROLLER VISUAL

タッチ開始地点を中心に表示する。

基本構成:

- outer ring
- center origin
- UP arrow
- DOWN arrow
- LEFT arrow
- RIGHT arrow

半透明でマップを隠しすぎない。

ただし透明すぎて見えない状態にもならない。

登録時点の実装outer radiusは70 CSS px、直径140 CSS px相当。

## ACTIVE DIRECTION VISUAL

現在入力中の方向は他方向より明確に強調する。

例:

通常矢印:
- opacity低め

active:
- opacity高め
- scale 1.05〜1.15程度
- glowやborderの軽い強調

具体デザインはLUKE QUEST全体UIと整合させる。

## CONTROLLER SIZE

iPhone指操作を前提とする。

外径の設計目安:

120〜180 CSS px程度。

画面を占有しすぎず、指で方向を選べるサイズにする。

登録時点は140px diameter相当。

## EDGE CLAMPING

画面端をタップした場合、controllerが画面外へ大きく切れないようにする。

表示上のcenterはviewport内へclampしてよい。

ただし入力計算のoriginは、可能なら実際の指開始地点を保持する。

表示centerとinput originを分離してもよい。

端での操作が中央より極端に不自然にならないこと。

## SAFE AREA

iPhoneの以下を考慮する。

- `safe-area-inset-top`
- `safe-area-inset-bottom`
- `safe-area-inset-left`
- `safe-area-inset-right`

ホームインジケーター、Dynamic Island/notch周辺などによって実用的な操作領域が失われないこと。

## TOUCH SCROLL PREVENTION

Dynamic Controller操作中にSafariページ自体がスクロール/パンしてゲーム操作が壊れないようにする。

必要な範囲で:

`touch-action: none`

を利用する。

ただしゲーム外UIや本来scroll可能な画面まで無意味に操作不能にしない。

## MULTI TOUCH

最初の有効pointerをmovement pointerとして採用する。

`dynamicPad.pointerId`

と一致しないpointerはmovement controllerでは無視する。

これにより2本指による予期せぬ方向変更やrelease競合を防ぐ。

別UIの操作と競合した場合もmovement pointerの所有権を明確にする。

## RELEASE SAFETY

必ず以下で `stopMoving()` とcontroller cleanupを行う。

- pointerup
- pointercancel
- window blur
- visibilitychangeでhidden
- battle start
- dialogue start
- menu open
- map transition
- scripted event start
- その他world movementが禁止されるstate transition

release後にtimer、pressed state、active direction、pointerIdが残らないこと。

## MAP TRANSITION SAFETY

Dynamic Controllerで出口へ歩き続けてmap transitionが起きた場合、transition前に必ずmovementを停止する。

新マップへ入ったあと、同じpointer入力やtimerが残って勝手に歩かないこと。

spawn地点から連続で別出口へ入る等の暴走を防ぐ。

## BATTLE SAFETY

random encounter発生時:

1. `stopMoving()`
2. `hideDynamicController()` または同等cleanup
3. battle transition

の順序を安全に行う。

戦闘終了後にtouch stateが残って再び勝手に動かないこと。

既存のencounter grace等の安全機構を維持する。

## DIALOGUE SAFETY

NPC接触、Action、イベント等で会話が始まる時も:

- stopMoving
- controller hide
- active pointer state cleanup

を行う。

会話中に背景のpointermoveがmovementへ流れないこと。

## EXISTING CONTROLS

以下を維持する。

- Arrow keys
- WASD
- existing fixed d-pad fallback
- Action button

Dynamic ControllerがOwner実機確認を含め十分安定するまでは、固定D-padを突然削除しない。

将来的にOwner判断で固定padを縮小/非表示へ変更可能。

## ACTION BUTTON

移動controllerとAction操作を混同しない。

Actionボタンは独立維持してよい。

将来的に:

- short tap = action
- drag = movement

のような統合操作を検討してもよいが、このREQの完了条件ではない。

## VISUAL QUALITY

単なるデバッグ円ではなくLUKE QUESTのUIとして成立させる。

PS1初期高品質2D JRPGという全体方向性に合わせ、例えば:

- 青
- 銀
- 半透明
- 軽い魔法陣/金属リング的意匠

を使ってよい。

ただし主役はマップであり、controllerが派手すぎて視界を奪わないこと。

## PERFORMANCE

pointermoveごとにゲーム全体 `render()` を行わない。

可能ならcontroller DOMだけを更新する。

必要に応じて `requestAnimationFrame` によるvisual update制御を検討する。

大量のpointermove eventでもiPhoneでカクつきにくいこと。

DOM nodeをmoveごとに破棄再生成しない構造を優先する。

## ACCESSIBILITY / FALLBACK

Dynamic Controllerが利用できない環境でも、既存の:

- keyboard
- fixed controls

で最低限遊べる状態を維持する。

新操作導入で既存操作を壊さない。

## TEST REQUIREMENTS

### TEST 1 — DEAD ZONE
中央をtouch
→ controller表示
→ 指を動かさない
→ Lukeは動かない

### TEST 2 — RIGHT INPUT
右へslide
→ RIGHT active
→ Lukeが右へ移動

### TEST 3 — CONTINUOUS HOLD
右方向を保持
→ 1歩だけで止まらず連続移動

### TEST 4 — LIVE DIRECTION CHANGE
右保持から指を上へslide
→ RIGHT解除
→ UPへ切替
→ timerが二重化しない

### TEST 5 — RELEASE
指を離す
→ 即停止
→ controller消失
→ pressed state残留なし

### TEST 6 — COLLISION
壁へ押し続ける
→ 壁を抜けない
→ timer runawayしない
→ release後停止

### TEST 7 — DIALOGUE
移動からNPC会話開始
→ controller消失
→ movement停止
→ 会話中に再移動しない

### TEST 8 — RANDOM BATTLE
Dynamic Controller移動中にrandom battle
→ movement停止
→ battle中controllerなし
→ 戦闘後勝手に歩かない

### TEST 9 — MAP TRANSITION
出口へ保持移動
→ transition
→ 新mapで勝手に歩かない

### TEST 10 — UI EXCLUSION
menu/button/dialogue等のinteractive UI上をtouch
→ Dynamic Controllerが起動しない
→ UI本来の操作が働く

### TEST 11 — TOUCH CANCEL
pointercancel/touch cancel
→ movement停止
→ controller消失

### TEST 12 — SAFARI BACKGROUND
移動中にSafari/appをbackgroundへ
→ movement停止
→ timer残留なし

### TEST 13 — RESUME
backgroundからゲームへ戻る
→ Lukeが勝手に移動再開しない
→ 新しい有効pointer操作まで停止状態

## AUTOMATED VERIFICATION

既存Playwright / browser test基盤が利用可能なら、少なくとも次のpointer sequenceを自動回帰テストへ追加する。

pointerdown
→ pointermove outside dead zone
→ continuous movement evidence
→ pointermove direction change
→ pointerup
→ stop evidence

さらに可能ならUI exclusion、battle transition cleanup、map transition cleanupも自動化する。

登録時点ではbrowser/runtime suiteは存在するが、Dynamic Controllerのpointer-drag flowを正式な専用回帰として十分に固定できていないため、これをVERIFY残件とする。

## IPHONE VERIFICATION

Ownerによる実機確認前は:

`IOS_PHYSICAL_VERIFICATION = PENDING`

とする。

自動browser test、desktop touch emulation、コードレビューだけで:

`iPhone physical PASS`

と記録してはいけない。

Owner実機確認では最低限:

- 好きな場所へ指を置きやすいか
- controllerが邪魔すぎないか
- dead zoneが自然か
- 方向切替が自然か
- 長押し速度が自然か
- releaseで確実に止まるか
- 画面端で使えるか

を確認する。

## COMPLETION CONDITION

以下をすべて満たすこと。

- field任意位置からcontroller表示
- dead zoneあり
- 4方向入力
- hold continuous movement
- holding中direction change
- pointer release immediate stop
- controller hide
- UI exclusion
- battle safety
- dialogue safety
- map transition safety
- touchcancel safety
- blur/visibility safety
- movement runaway regressionなし
- keyboard/fixed fallback維持
- GitHub Pagesへ公開
- static/runtime/browser verification PASS
- dedicated pointer-drag regression testまたは同等の再現可能検証

Owner physical iPhone verificationが未完の場合は、実装条件を満たしても:

`STATUS: VERIFY`

を維持してよい。

Ownerが操作感を確認し重大問題がなければDONE候補。

## DO NOT REPEAT

- button-local `pointerup` だけに依存しない
- 独立した無管理 `setInterval` を作らない
- controller DOM rebuildによってstop eventを失わない
- battle/dialogue/transitionをまたいでmovement timerを残さない
- release後にpointerIdやactive directionを残さない
- fixed padを壊してからDynamic Controllerを試験しない
- UI上のtouchをmovementとして横取りしない
- dead zoneなしで微小タッチを即移動にしない
- 実機未確認なのにiPhone完全PASSと報告しない
- v0.30で既に実装されている機能をCURRENTが古いという理由だけでゼロから重複実装しない
