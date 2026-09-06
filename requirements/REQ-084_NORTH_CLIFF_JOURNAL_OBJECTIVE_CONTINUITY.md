# REQ-084 — 北の崖道・冒険ジャーナル目的地整合

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: UX / JOURNAL / OBJECTIVE-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081〜083で北の崖道は実際に到達・探索・戦闘・ローカル導線まで成立したが、fresh `addons/adventure-journal.js` の `mainGoal()` は `withdrawProofSeen` がtrueなら常に「北の崖道へ向かい、レオンを追う。」を返す。

そのためプレイヤーがすでに `northCliffRoad` に立っていてもPAUSE内JOURNALだけが到着前の指示を出す。これは攻略なしで進めるというOwner品質基準と、REQ-083のplayer-visible guidanceに対する状態不整合。

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

- [ ] northCliffRoad + withdrawProofSeenで到着後objectiveを返す
- [ ] evacRoute + withdrawProofSeenでは従来到着前objectiveを返す
- [ ] 既存mainGoal分岐を壊さない
- [ ] discovered clues / side questsに変更なし
- [ ] global save/gameplay state mutationなし
- [ ] JS/add-on/static regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone readability remains PENDING

## NO-STOP

REQ-084の完了・VERIFY・Pages成功は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
