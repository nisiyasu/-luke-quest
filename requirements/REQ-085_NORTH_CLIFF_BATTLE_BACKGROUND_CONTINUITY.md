# REQ-085 — 北の崖道・地域別戦闘背景の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / BATTLE-BACKGROUND / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-082で `northCliffRoad` はcanonical random encounter mapになったが、fresh `addons/original-battle-backgrounds.js` のformal regional battle backdropは `field / forest / deepForest / mistTrail / observation / evacRoute` の6地域だけを対象としている。

`apply()` は `SCENES[s.map]` が無い場合にfalseで戻るため、北の崖道で戦闘が起きても既存REQ-007のoriginal regional backdropが出ない。探索マップは新地域なのに戦闘画面だけ地域表現が落ちるplayer-visible continuity gap。

## PURPOSE

既存REQ-007のpresentation-only regional battle backdrop systemへ `northCliffRoad` を正式に追加し、北の退避路から続く高所の崖道らしい独自背景を表示する。

## REQUIRED BEHAVIOR

- `northCliffRoad` がformal regional battle background sceneとして登録される。
- 既存6地域のscene identityと表示を削除・置換しない。
- 北の崖道は `evacRoute` と世界観を連続させつつ、より高所・狭い崖道・遠景の山稜を感じるdistinct original inline-SVG sceneにする。
- 外部画像、placeholder、Owner-only formal character artを必要としない。
- presentation-onlyであり、enemy pool、battle logic、damage、save、story、protected canonを変更しない。
- unknown map fallback behaviorを維持する。
- add-on contractは弱めず、旧6地域すべて + `northCliffRoad` の7地域を明示的に要求する。
- `LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS` から `northCliffRoad` coverageを検証可能にする。

## ACCEPTANCE

- [ ] formal scene registry includes all previous 6 maps plus northCliffRoad
- [ ] northCliffRoad scene label/art is distinct and original
- [ ] battle backdrop application recognizes northCliffRoad
- [ ] unknown map fallback preserved
- [ ] presentation-only; gameplay/save/story unchanged
- [ ] strict add-on contract requires all 7 scenes
- [ ] JS/add-on/static regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-085の実装・VERIFY・Pages成功は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
