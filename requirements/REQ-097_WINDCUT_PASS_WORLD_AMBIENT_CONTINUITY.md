# REQ-097 — 風切り峠・world ambient演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / WORLD-AMBIENCE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` がwalkable mapになり、REQ-094〜096で導線、戦闘背景、area titleまで地域連続性を拡張した。

fresh `addons/world-ambient-layer.js` のregional TYPE registryは `northCliffRoad:'fog'` までで止まり、`windcutPass` が存在しない。`build()` は未登録mapでambient layerをremoveするため、風切り峠だけ既存world-depth presentationが消える。

## PURPOSE

既存world ambient authorityへcanonical `windcutPass` を接続し、北方高所の強風峠らしい薄い霧/風気配を既存の軽量presentation system内で継続表示する。

## REQUIRED BEHAVIOR

- `windcutPass` をregional ambient registryへ正式登録する。
- 既存 `northCliffRoad` / legacy `cliffRoad` mappingを維持する。
- 風切り峠では既存軽量 `fog` ambienceを使用し、地理的連続性を保つ。
- unknown/unmapped mapでambientを出さないfallbackを維持する。
- presentation-onlyでcollision、movement、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusから `windcutPass` coverage/typeを機械的に検証可能にする。

## ACCEPTANCE

- [ ] windcutPass maps to fog
- [ ] northCliffRoad and legacy cliffRoad mappings remain
- [ ] unknown map remains unmapped
- [ ] presentation-only/reduced-motion preserved
- [ ] fail-closed coverage smoke PASS
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-097の実装、commit、Pages成功、VERIFY移行は終了理由ではない。