# REQ-021 — Tap Anywhere Action

STATUS: VERIFY
PRIORITY: P0
TYPE: UX / INPUT / IPHONE
OWNER_REQUEST: CONFIRMED
IOS_PHYSICAL_VERIFICATION: PENDING

## PURPOSE

フィールド探索中、従来のAボタンを押さなくても、ゲーム画面の有効領域を短くタップすれば既存の `action()` と同等の行動を実行できるようにする。

Owner intent:
- 画面のどこをタッチしてもAが反応する
- 会話を閉じる、NPCへ話しかける、宝箱や痕跡を調べる等をAボタン位置まで指を運ばず実行できる
- iPhone片手操作の負荷を下げる

## REQUIRED BEHAVIOR

フィールド画面で、移動ドラッグと判定されない短いtapを受けた場合、既存の `action()` を1回だけ呼ぶ。

概念フロー:

pointerdown
→ origin記録
→ pointermove距離を監視
→ 移動dead zoneを超えない
→ pointerup
→ short tap判定
→ action() 1回

## IMPORTANT CONFLICT RULE

Dynamic Touch Controllerと同じpointer surfaceを共有するため、tapとdragを必ず区別する。

- dead zone以内の短いtap = Action
- dead zoneを超えたdrag = Movement
- drag後pointerupでActionを誤発火しない
- hold movement中にActionを誤発火しない

## UI EXCLUSION

以下の明示UIを押した場合はglobal Actionを発火しない。

- MENU
- battle command
- inventory
- shop
- inn
- save/load UI
- buttons
- links
- inputs
- selects
- その他明示interactive control

ただしworld上のdialogue表示中にゲーム面をtapした場合は、Aと同等に会話を閉じられること。

## ACTION SEMANTICS

新しい別action systemを作らない。
既存のcanonical `action()` またはその最終wrapperを呼ぶ。

これにより既存の:
- NPC会話
- 会話送り/閉じる
- 宝箱
- hidden find
- story clue
- signs
- interactable object

の意味を維持する。

## SINGLE-FIRE SAFETY

1回のpointer sequenceでaction()を複数回発火させない。
click + pointerupの二重発火を防止する。

## MOVEMENT SAFETY

過去のmoveTimer暴走対策を壊さない。

- drag movement中はtap actionを発火しない
- pointerup時はmovement cleanup後にtap/drag判定を安全に行う
- battle / map transition / dialogue state変化時にstale pointerを残さない

## IPHONE BEHAVIOR

Safariのdouble tap zoom、text selection、scroll等がゲーム入力と競合しないよう、ゲームsurfaceに必要範囲だけ `touch-action` / user-select制御を適用する。

## VISUAL FEEDBACK

Action tapが成立した時、必要なら軽いtap ripple / pulseを短時間表示してよい。
ただし画面を覆わず、遅延を生まないこと。

## TEST REQUIREMENTS

1. NPC正面で画面中央を短くtap → 会話開始
2. 会話中に短くtap → 会話を閉じる/進める
3. 宝箱正面でtap → canonical actionと同じ結果
4. 空間でtap → canonical「何もない」挙動または現在仕様
5. drag movement → actionは発火しない
6. long hold movement → release時action発火なし
7. MENU button tap → menuのみ、world actionなし
8. battle command tap → world actionなし
9. pointercancel → actionなし
10. map transitionをまたぐpointer → stale actionなし
11. 1tapにつきaction()最大1回

## AUTOMATED VERIFICATION

- `addons/floating-touch-controller.js` v1.3 integrates short-tap Action and drag/hold movement on one pointer surface.
- Short stationary tap invokes the current final canonical `action()` exactly once.
- Dialogue tap closes via canonical Action.
- Drag release and pointercancel do not fire Action.
- Explicit interactive controls are excluded.
- `addons/zzz-floating-touch-smoke.js` enforces tap Action, dialogue close, drag-no-Action, cancel-no-Action and single-fire behavior in browser CI.
- Pages workflow run `33995782229` for checkpoint `2c28b2c983911c029a808021b930580e7e1d2796`: SUCCESS.
- Owner physical iPhone verification remains pending.

## COMPLETION CONDITION

- public Pages buildに実装されている
- field gameplay surfaceのshort tapでcanonical A actionが1回発火
- drag/hold movementと誤競合しない
- explicit UIを邪魔しない
- dialogue / NPC / treasure / clue等の既存interactionが維持される
- automated browser regression PASS
- Owner実機確認前は `IOS_PHYSICAL_VERIFICATION = PENDING`

## DO NOT REPEAT

- clickとpointerup両方からactionを二重発火しない
- drag releaseでAを誤発火しない
- dedicated A buttonだけを残して「どこでもtap完了」としない
- test codeだけ存在してpublic build未読込の状態を完了扱いしない
