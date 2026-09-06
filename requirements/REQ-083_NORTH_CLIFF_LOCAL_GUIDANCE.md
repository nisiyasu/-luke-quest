# REQ-083 — 北の崖道・ローカル進行導線

STATUS: VERIFY
PRIORITY: P1
TYPE: UX / GUIDANCE / PLAYER-VISIBLE CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081で北の崖道はwalkableになり、REQ-082でcanonical random encounterへ統合された。一方、fresh実装では崖道に入った後のHUDは既存の汎用進行タグが中心で、崖道内で次に何を確認すべきかが画面上で十分具体化されていない。

Ownerの品質基準は「攻略情報なしで進める」。既存REQ-023で退避路の必須手掛かり導線は修復済みなので、その成功パターンを崖道到着後にもつなぐ。

## PURPOSE

北の崖道で、探索を潰す巨大矢印や自動移動を使わず、初見プレイヤーが「まず新しい足跡を確認し、その後さらに北へ進む道を追う」ことを理解できるようにする。

## REQUIRED BEHAVIOR

`northCliffRoad` にいる間:

1. world上にcompactなobjectiveを表示する。
2. 最初の具体的行動として、南寄りにある「新しい足跡」を調べることを案内する。
3. 足跡をcanonical action()で調べた後は、objectiveを北側の「北へ曲がる崖道」を確認する導線へ切り替える。
4. 足跡と北側境界には、そのphaseだけ軽いpulse/quest markerを表示してよい。
5. 既存のNPC interaction本文、map座標、collision、encounter、save semantics、protected canonを変更しない。
6. 新しいrequired story flagを追加しない。崖道内の導線phaseはpresentation-only runtime stateとして扱い、save compatibilityを壊さない。
7. 崖道を離れたら専用objective/markerは表示しない。
8. REQ-021 canonical tap action / REQ-001 dynamic touch / REQ-022 fullscreen worldを妨げず、markerはpointer-events:noneとする。

## TARGETS

Existing canonical REQ-081 interactions:

- `kind === 'lqNorthCliffFootprints'` at `(7,14)`
- `kind === 'lqNorthCliffBoundary'` at `(10,1)`

## ACCEPTANCE

- [x] northCliffRoad entry phaseで具体的objectiveが表示される
- [x] entry phaseでfootprints targetに軽いmarkerがある
- [x] canonical action()でfootprintsを調べる
- [x] 同一または直後renderでobjectiveが北側boundary導線へ切り替わる
- [x] footprints markerが消え、north boundary markerが表示される
- [x] mapを離れると専用guidanceが消える
- [x] gameplay/save/protected canon mutationなし
- [x] assembled browser regression PASS
- [x] 390x844 touch/fullscreen regression PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `0a837c599b0e420e4468b7b05e6be088605ec301`.
- Guidance implementation: `593b8bd8eea8f8feab294836af18ce8b9649a8d5` in `addons/zzzzzz-north-cliff-local-guidance.js`.
- Browser acceptance: `cb73dcb624a0b9325d035dd2de7ccd23bf595b9d` in `addons/zzzzzzz-north-cliff-guidance-smoke.js`.
- First integrated 390x844 run exposed a test-order defect: REQ-083 smoke mutated shared state while the canonical REQ-001/021 touch smoke was still exercising pointer sequences. All seven REQ-083 assertions were already true, but core touch assertions were contaminated. This was repaired forward rather than weakening the core input gate.
- Test serialization repair: `7e6206394b679a30f880d75aa8c5391d7da88311`. REQ-083 smoke now waits for `lqFloatingTouchRuntimeSmokeMarker` before changing shared runtime state.
- GitHub Pages run `34026070789` on `7e6206394b679a30f880d75aa8c5391d7da88311`: SUCCESS.
- Successful run passed JS/add-on validation, static regression, add-on contract, autosave bootstrap/PWA/raster gates, assembled browser smoke, 390x844 floating touch + iPhone world visual-liveness, REQ-081 north cliff road smoke, REQ-082 encounter smoke, upload and Pages deploy.
- No Owner physical iPhone PASS is claimed.

## NO-STOP

REQ-083の実装・commit・Pages成功・VERIFY移行は終了理由ではない。完了checkpoint後はfresh HEADからGATE Cを実行し、安全な次作業があれば継続する。
