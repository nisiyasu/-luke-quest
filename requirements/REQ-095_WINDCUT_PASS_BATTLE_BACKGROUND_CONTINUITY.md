# REQ-095 — 風切り峠・地域別戦闘背景の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / BATTLE-BACKGROUND / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` はcanonical random encounter mapになったが、fresh `addons/original-battle-backgrounds.js` のformal regional battle backdrop registryは `northCliffRoad` までの7地域で止まっており、`windcutPass` が存在しない。

そのため風切り峠で戦闘へ入ると、探索側では峠の固有visualがあるのに、既存REQ-007のregional battle backdropが適用されないpresentation continuity gapが残る。

## PURPOSE

既存REQ-007/085のsingle-source regional battle backdrop systemへ `windcutPass` を正式追加し、北の崖道からさらに高所へ進んだ強風の峠らしい独自戦闘背景を表示する。

## REQUIRED BEHAVIOR

- `windcutPass` をformal regional battle background sceneとして登録する。
- 既存7地域のscene identityと表示を削除・置換しない。
- `northCliffRoad` と連続感を持たせつつ、より高所、細い尾根、強風、雲の流れを感じるdistinct original inline-SVG sceneにする。
- external image / placeholder / Owner-only formal artを必要としない。
- presentation-onlyで、enemy pool、battle logic、damage、save、story、protected canonを変更しない。
- unknown-map fallbackを維持する。
- `LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS.hasMap('windcutPass') === true` を公開する。
- existing add-on/assembled/browser/390x844 regressionsを弱めない。

## ACCEPTANCE

- [ ] registry includes previous 7 maps + windcutPass
- [ ] windcutPass scene is distinct/original
- [ ] battle backdrop recognizes windcutPass
- [ ] unknown fallback preserved
- [ ] gameplay/save/story unchanged
- [ ] JS/add-on/static regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-095の実装・commit・Pages成功・VERIFYは終了理由ではない。