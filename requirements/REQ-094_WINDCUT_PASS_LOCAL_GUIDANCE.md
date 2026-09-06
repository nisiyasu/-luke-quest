# REQ-094 — 風切り峠・ローカル進行導線

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: UX / GUIDANCE / PLAYER-VISIBLE CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` がwalkableになり、4つのcanonical interactionと北側継続境界が追加された。一方、初見プレイヤーが峠に入った直後に「まずどこを調べ、次にどこへ向かうか」をHUD上で具体的に理解できる専用導線はまだない。

Ownerの既存品質基準は「攻略情報なしで進める」。REQ-083で北の崖道に実装した、compact objective + presentation-only markerの成功パターンを風切り峠にも接続する。

## PURPOSE

`windcutPass` で探索を壊す巨大矢印や自動移動を使わず、初見プレイヤーが「岩陰の靴跡を確認し、その後北へ続く尾根道を追う」と自然に理解できるようにする。

## REQUIRED BEHAVIOR

1. `windcutPass` にいる間だけcompact objectiveを表示する。
2. entry phaseでは「岩陰に残る靴跡」を調べるよう案内する。
3. その靴跡をcanonical `action()`で調べた後、objectiveを「北へ続く尾根道」へ切り替える。
4. 現在phaseの対象だけに軽いpulse markerを表示する。
5. markerは `pointer-events:none` とし、REQ-021 tap action / REQ-001 Dynamic Touchを妨げない。
6. mapを離れたら専用objective/markerを消す。
7. map座標、collision、encounter、save semantics、story flags、protected canonは変更しない。
8. 導線phaseはpresentation-only runtime stateとし、old save compatibilityを壊さない。
9. REQ-092 portrait camera 0.88 / top HUD safe framingと共存する。

## TARGETS

REQ-093 canonical interactions:

- `kind === 'lqWindcutFootprints'` at `(7,16)`
- `kind === 'lqWindcutBoundary'` at `(10,1)`

## ACCEPTANCE

- [ ] windcutPass entry phaseで具体的objective表示
- [ ] footprints target marker表示
- [ ] canonical action()でfootprints interaction成立
- [ ] interaction直後にnorth boundary objectiveへ切替
- [ ] footprints marker消失 / north boundary marker表示
- [ ] map離脱で専用guidance消失
- [ ] gameplay/save/story/protected canon mutationなし
- [ ] assembled browser regression PASS
- [ ] 390x844 touch/fullscreen regression PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone feel remains PENDING

## NO-STOP

REQ-094の実装・commit・Pages成功・VERIFY移行は自律開発の終了理由ではない。