# REQ-148 — POST BATTLE VICTORY PRESENTATION

STATUS: VERIFY
PRIORITY: P0
OWNER_SOURCE: direct Owner feedback 2026-09-10

## OWNER INTENT

戦闘勝利直後は、戦闘画面を背景として保持したまま、勝利したことが一目で分かる VICTORY 表示とルークの戦闘後コメントを同時に見せる。

以前成立していた「戦闘背景が薄く、または軽くぼやけ、その上に勝利情報とルークコメントが浮く」演出を復元する。

## REQUIRED PLAYER-VISIBLE BEHAVIOR

1. 敵撃破後、フィールドへ即時に見た目を切り替えない。
2. 撃破直前の戦闘画面を背景として保持する。
3. 背景には明確な減光を適用する。
4. 背景には軽い blur を適用してよい。文字や主要UIより背景が一段後ろに見えること。
5. 画面上に `VICTORY` を明確に表示する。
6. 同じ勝利画面上に canonical なルークの戦闘後コメントを表示する。
7. EXP / Gold の canonical reward summary を失わない。
8. VICTORY とルークコメントのどちらか一方だけに退行してはならない。
9. 戦闘背景を完全な黒画面や別画面へ置換しない。
10. 表示を閉じた後に通常worldへ戻る。
11. reward / battle balance / save schema / story authorityを変更しない。
12. iPhone portraitでdialogueがsafe areaからはみ出さない。

## ACCEPTANCE

- VICTORY visible: PASS required
- Luke post-battle comment visible: PASS required
- Battle frame preserved behind result UI: PASS required
- Background visibly dimmed: PASS required
- Background lightly blurred or equivalent depth separation: PASS required
- EXP/Gold reward summary preserved exactly once: PASS required
- Single dismiss returns to world without duplicate action: PASS required
- Existing battle command / touch / save regression: PASS required
- GitHub Pages Gold preview includes the implementation: PASS required
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner confirms on device

## VERIFICATION EVIDENCE

- IMPLEMENTATION_CHECKPOINT: `d9208608b296bc91cf4238325724ee7d871a4056`
- ACCEPTANCE_GATE_CHECKPOINT: `b808c99122ba19093c5af67968c4d2102f7e61c0`
- DEDICATED_GATE: `REQ-137 Battle Victory Reward run 34426439910 SUCCESS` with the REQ-148 acceptance title requiring VICTORY plus dimmed/blurred battle backdrop.
- DESCENDANT_GOLD_HEAD: `a4ca4813f428ed62d268b1dded932305d0f88602`
- DESCENDANT_GOLD_CHALLENGER: `34454773919 SUCCESS`
- DESCENDANT_P0_TOUCH: `34454773943 SUCCESS`
- DESCENDANT_REQ023: `34454773993 SUCCESS`
- PUBLIC_PREVIEW: Gold Pages deployment lineage has included the REQ-148 implementation; physical iPhone presentation approval remains Owner-only.
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## DO NOT

- 「別VICTORY overlayを作らない」を「VICTORY文字自体を消す」と解釈しない。
- ルークコメントだけを出して完了扱いしない。
- 背景減光・ぼかしを削除しない。
- canonical win() の報酬や進行処理を別実装に置換しない。
