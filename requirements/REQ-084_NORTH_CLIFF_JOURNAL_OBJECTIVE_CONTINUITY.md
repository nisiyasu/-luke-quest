# REQ-084 — 北の崖道・冒険ジャーナル目的地整合

STATUS: VERIFY
PRIORITY: P1
TYPE: UX / JOURNAL / OBJECTIVE-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081〜083で北の崖道は実際に到達・探索・戦闘・ローカル導線まで成立したが、fresh `addons/adventure-journal.js` の `mainGoal()` は `withdrawProofSeen` がtrueなら常に「北の崖道へ向かい、レオンを追う。」を返していた。

そのためプレイヤーがすでに `northCliffRoad` に立っていてもPAUSE内JOURNALだけが到着前の指示を出す状態不整合があった。

## PURPOSE

既存のspoiler-safe Adventure Journalを、現在地を考慮したmain objectiveへ修正する。北の崖道到着後は「向かう」ではなく、その場で足跡・北側ルートを追う次行動を示す。

## REQUIRED BEHAVIOR

- `withdrawProofSeen=true` かつ `map==='northCliffRoad'` の時、MAIN OBJECTIVEは北の崖道内で痕跡を追い北側ルートを確認する内容になる。
- `withdrawProofSeen=true` だがまだ `northCliffRoad` 外なら従来どおり「北の崖道へ向かい、レオンを追う。」を維持する。
- それ以前のmainGoal分岐順・side quests・discovered cluesを変更しない。
- 新しいstory/save flagを作らない。
- save compatibility、protected canon、movement/action/battleを変更しない。
- mainGoal判定をpure helperとして外部からsynthetic stateで検証可能にし、回帰試験が実ゲームstateを汚さないようにする。

## ACCEPTANCE

- [x] northCliffRoad + withdrawProofSeenで到着後objectiveを返す
- [x] evacRoute + withdrawProofSeenでは従来到着前objectiveを返す
- [x] 既存mainGoal分岐を壊さない
- [x] discovered clues / side questsに変更なし
- [x] global save/gameplay state mutationなし
- [x] JS/add-on/static regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone readability remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `9179416ef549a281b77fe4636feb4bbff762478a`.
- Location-aware journal implementation: `ddc212ed99038e9c049e6849b2c8d4239ce0539f`.
- Pure synthetic-state browser acceptance: `e13bd440b9ff7430e569711a3e265a955e640e38`.
- First CI correctly rejected the refactor because the long-standing add-on contract requires explicit live `s.wins` authority. The contract was not weakened.
- `8c93d8cad607095ca21da4acd7fdd491db86d306` restored explicit live `s.wins` authority while keeping synthetic-state testability.
- `b69d42b8f64d3a6063e6bc8d60aa8a5252572e03` restored the pre-existing HTML quote escaping semantics after self-audit noticed an incidental `&quot;` drift during the repair.
- GitHub Pages run `34026388737` for HEAD `b69d42b8f64d3a6063e6bc8d60aa8a5252572e03`: SUCCESS.
- Successful run passed sequential patches, collision-safe add-ons, static regression, add-on contract, autosave bootstrap/PWA/raster/Luke asset gates, assembled browser, 390x844 floating-touch + iPhone world visual-liveness, REQ-081, REQ-082, upload and Pages deploy.
- No Owner physical iPhone PASS is claimed.

## NO-STOP

REQ-084の完了・VERIFY・Pages成功は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
