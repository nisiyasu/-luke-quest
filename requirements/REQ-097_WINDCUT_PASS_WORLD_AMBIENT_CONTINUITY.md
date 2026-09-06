# REQ-097 — 風切り峠・world ambient演出の連続性

STATUS: VERIFY
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

- [x] windcutPass maps to fog
- [x] northCliffRoad and legacy cliffRoad mappings remain
- [x] unknown map remains unmapped
- [x] presentation-only/reduced-motion preserved
- [x] fail-closed coverage smoke PASS
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `b5ed2ebb5640e9aa9d2fa097b17ee333c38de592`.
- Ambient implementation: `8bf9caed7a4c13a72df7b8218dd74b77a333ec5f` in `addons/world-ambient-layer.js`.
- Fail-closed coverage guard: `f51811c2c67d50371cf33b160977e7f97b34349c`.
- `windcutPass`, `northCliffRoad`, and legacy `cliffRoad` resolve to existing lightweight `fog`; unknown maps remain unmapped.
- GitHub Pages workflow run `34033532905` on `f51811c2c67d50371cf33b160977e7f97b34349c`: SUCCESS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## NO-STOP

REQ-097の実装、commit、Pages成功、VERIFY移行は終了理由ではない。