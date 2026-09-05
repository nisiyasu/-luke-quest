# REQ-023 — 北の退避路・進行必須手掛かりの導線修正

STATUS: IN_PROGRESS
PRIORITY: P0
TYPE: UX / GUIDANCE / REAL-PLAY BUG
OWNER_REQUEST: CONFIRMED

## TRIGGER

Owner実プレイで「北の退避路で、ここから先に進めない。どうするのか分からない」と報告された。

現実の進行条件は `withdrawProofSeen` だが、画面上の目的表示が「退避路の痕跡を調べる」程度に留まり、3つの痕跡のうちどれが進行必須か、取得後にどこへ戻るべきかが十分伝わっていない。

これはプレイヤーの見落としではなく、ゲーム側の導線不良として修正する。

## PURPOSE

攻略情報なしの初見プレイヤーが、探索の楽しさを残したまま次の行動を理解できる状態にする。

## REQUIRED BEHAVIOR

`evacRoute` で `withdrawProofSeen === false` の間:
- objectiveを具体化し、「左下側に残された撤収命令の切れ端」を探すことが分かる
- 必須対象 `kind === 'withdrawProof'` を他の任意手掛かりより視認しやすくする
- ただし画面全体を塞ぐ巨大矢印や完全自動誘導にはしない
- 対象の位置は探索で発見できる余白を残す

`withdrawProofSeen === true` になった直後:
- objectiveを即座に「北端へ戻り、崖道へ進む」へ切り替える
- 北端出口が次の目的地だと明示する
- 既存gate conditionとstory canonは変更しない

## VISUAL GUIDANCE

必須撤収命令は、未取得時のみ軽いpulse / sparkle / quest markerで強調してよい。
取得後は強調を消す。

北端へ戻るフェーズでは、objective文を主導線とし、必要なら出口側に軽い目的マーカーを表示してよい。

## NO GAMEPLAY CHANGE

変更しない:
- `withdrawProofSeen` の意味
- 既存NPC/手掛かり本文
- gate condition
- map coordinates / collision
- story flags
- encounter rate
- save semantics

## TEST REQUIREMENTS

1. `evacRoute` + `withdrawProofSeen=false` で具体的objectiveが表示される
2. 必須撤収命令に視覚的強調がある
3. 任意手掛かりを調べても進行条件は勝手に満たされない
4. 撤収命令をcanonical actionで調べると既存 `withdrawProofSeen=true` になる
5. 同一render cycleまたは直後renderでobjectiveが北端誘導へ変わる
6. 取得後に撤収命令の強調が消える
7. 北端gateの既存進行条件を変更しない
8. 既存map/collision/save regression PASS
9. public Pages buildに含まれる

## COMPLETION CONDITION

- 初見プレイヤーが外部攻略なしで必須手掛かりと次の出口を理解できる
- explorationを完全一本道の作業UIにしない
- automated browser/static regression PASS
- Pages deploy SUCCESS
- Owner実機確認前は主観UX確認をVERIFYとして残してよい
