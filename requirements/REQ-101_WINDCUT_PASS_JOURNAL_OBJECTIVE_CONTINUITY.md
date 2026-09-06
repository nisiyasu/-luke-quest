# REQ-101 — 風切り峠・冒険ジャーナル目的地整合

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER-VISIBLE UX / JOURNAL CONTINUITY / SAFE CONTENT POLISH
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

fresh HEAD監査で、`addons/adventure-journal.js` のMAIN OBJECTIVEは `withdrawProofSeen` 後に `northCliffRoad` だけlocation-awareで、`windcutPass` 到着後も「北の崖道へ向かい、レオンを追う。」へ戻ることを確認した。

REQ-093でcanonical `windcutPass` が公開済みのため、到着済み場所へ向かうよう指示するjournalはplayer-visibleな導線矛盾である。

## PURPOSE

風切り峠へ到着後、Adventure JournalのMAIN OBJECTIVEを現在地に整合させ、攻略情報なしで次の北側追跡方向を理解できる状態にする。

## REQUIRED BEHAVIOR

- `withdrawProofSeen && map === 'windcutPass'` では、風切り峠内でレオンの痕跡を追い北側の尾根道を確認する旨を表示する。
- `withdrawProofSeen && map === 'northCliffRoad'` の既存objectiveを維持する。
- `withdrawProofSeen` だがそれ以前のmapでは既存「北の崖道へ向かい、レオンを追う。」fallbackを維持する。
- story/save/action/battle/movementのcanonical stateを変更しない。
- spoiler-safe。未到達の秘密やprotected canonを先出ししない。

## ACCEPTANCE

- [x] pure `mainGoal(state)` path covers `windcutPass`
- [x] northCliffRoad objective regression protected
- [x] generic withdrawProofSeen fallback protected
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen regression PASS
- [x] Pages SUCCESS
- [ ] IOS physical readability remains PENDING unless Owner explicitly confirms

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `6c0030b48a3cdc5bd2c74af9d059039ffef67f77`.
- Implementation checkpoint: `dd4e444e9d69094b66136f651330623a2a7582f3` (`Keep Windcut journal objective aligned with current map`).
- `windcutPass` objective now remains location-aware instead of reverting to the already-reached North Cliff destination.
- Existing `northCliffRoad` and generic `withdrawProofSeen` fallback behavior are preserved.
- GitHub Pages workflow run `34035907648`: SUCCESS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## NO-STOP

REQ-101の実装・PASS・VERIFYは終了理由ではない。fresh HEAD → GATE C → 次の安全な仕事へ進む。