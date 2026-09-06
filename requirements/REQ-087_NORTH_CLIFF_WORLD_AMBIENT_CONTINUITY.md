# REQ-087 — 北の崖道・world ambient演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / WORLD-AMBIENCE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

canonical map keyは `northCliffRoad` だが、fresh `addons/world-ambient-layer.js` のregional TYPE registryは旧キー `cliffRoad:'fog'` までしか持っていない。

`build()` は `TYPE[s.map]` が無い場合、既存ambient layerをremoveしてreturnするため、北の崖道では地域ambient演出が完全に消える。REQ-081〜086で正式化した新地域だけ既存world-depth presentationから外れるplayer-visible continuity defectである。

## PURPOSE

既存world ambient authorityへcanonical `northCliffRoad` を接続し、北方高所らしい薄い霧/風気配を既存の軽量presentation system内で継続表示する。

## REQUIRED BEHAVIOR

- `northCliffRoad` をregional ambient registryへ正式登録する。
- 既存 `cliffRoad` aliasを削除せず後方互換を維持する。
- 北の崖道では既存 `fog` ambienceを使用し、退避路との地理的連続性を保つ。
- unknown/unmapped mapでambientを出さない既存fallbackを維持する。
- presentation-onlyでcollision、movement、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusからmap coverage/typeを機械的に検証可能にする。

## IMPLEMENTATION TARGET

- `addons/world-ambient-layer.js`
- dedicated fail-closed smoke

## ACCEPTANCE

- [ ] `northCliffRoad` maps to `fog`
- [ ] legacy `cliffRoad` mapping remains
- [ ] unknown map remains unmapped
- [ ] presentation-only/reduced-motion preserved
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-087の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
