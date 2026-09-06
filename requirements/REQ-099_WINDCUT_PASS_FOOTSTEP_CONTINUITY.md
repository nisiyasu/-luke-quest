# REQ-099 — 風切り峠・terrain footstep演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / FOOTSTEP / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` が正式なwalkable outdoor mapになったが、fresh `addons/footstep-particles.js` のOUTDOOR coverageとterrain classifierは `northCliffRoad` までで止まり、`windcutPass` を含んでいない。

`stepFx()` は未登録mapではreturnするため、風切り峠だけ移動時のterrain-aware足元フィードバックが消える。

## PURPOSE

canonical `windcutPass` を既存footstep-particle systemへ接続し、霧と風が強い高所峠で既存mist系step FXを維持する。

## REQUIRED BEHAVIOR

- `windcutPass` をOUTDOOR coverageへ正式登録する。
- `windcutPass` terrain kindは `mist` とする。
- `northCliffRoad` とlegacy `cliff` / `cliffRoad` coverageを維持する。
- unknown/indoor mapではstep FXを誤発火しない。
- map transitionそのものでは既存通りstep FXを出さない。
- presentation-onlyでmovement、collision、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusからcoverage/terrain kindを機械的に検証可能にする。

## ACCEPTANCE

- [ ] windcutPass is outdoor-covered
- [ ] windcutPass resolves to mist
- [ ] northCliffRoad and legacy cliff/cliffRoad coverage remain
- [ ] unknown map remains uncovered
- [ ] transition/reduced-motion/presentation-only behavior preserved
- [ ] fail-closed coverage smoke PASS
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-099の実装、commit、Pages成功、VERIFY移行は終了理由ではない。