# REQ-085 — 北の崖道・地域別戦闘背景の連続性

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / BATTLE-BACKGROUND / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-082で `northCliffRoad` はcanonical random encounter mapになったが、fresh `addons/original-battle-backgrounds.js` のformal regional battle backdropは `field / forest / deepForest / mistTrail / observation / evacRoute` の6地域だけを対象としていた。

`apply()` は `SCENES[s.map]` が無い場合にfalseで戻るため、北の崖道で戦闘が起きても既存REQ-007のoriginal regional backdropが出ない。探索マップは新地域なのに戦闘画面だけ地域表現が落ちるplayer-visible continuity gapだった。

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

- [x] formal scene registry includes all previous 6 maps plus northCliffRoad
- [x] northCliffRoad scene label/art is distinct and original
- [x] battle backdrop application recognizes northCliffRoad
- [x] unknown map fallback preserved
- [x] presentation-only; gameplay/save/story unchanged
- [x] strict add-on contract requires all 7 scenes
- [x] JS/add-on/static regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## VERIFIED EVIDENCE

- Implementation checkpoint: `c314d1cc31c0ec01c2472908a9ed363c1f9ec14a` (`Add formal north cliff battle backdrop`).
- Strict seven-scene contract checkpoint: `bfb8b83f1e5c92222b0c90f0f27b26e07f718669` (`Require all seven regional battle backdrops`).
- Pages workflow run: `34026769548` / SUCCESS on `bfb8b83f1e5c92222b0c90f0f27b26e07f718669`.
- Workflow evidence: static regression, add-on contract, assembled browser, 390x844 floating touch + iPhone world visual-liveness, upload and Pages deploy all SUCCESS.
- `LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS` now exposes `hasMap(map)` and the registry contains `northCliffRoad`.
- No Owner physical iPhone visual PASS is claimed.

## NO-STOP

REQ-085の実装・VERIFY・Pages成功は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
