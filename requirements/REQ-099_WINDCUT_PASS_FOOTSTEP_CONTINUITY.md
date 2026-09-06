# REQ-099 — 風切り峠・terrain footstep演出の連続性

STATUS: VERIFY
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

- [x] windcutPass is outdoor-covered
- [x] windcutPass resolves to mist
- [x] northCliffRoad and legacy cliff/cliffRoad coverage remain
- [x] unknown map remains uncovered
- [x] transition/reduced-motion/presentation-only behavior preserved
- [x] fail-closed coverage smoke PASS
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `506c03fb7b8b64b377eeb47d7b7d4f312cb9dff0`.
- Footstep implementation: `0ad86ab21c352b24648eca111d42b20f2434e34b` in `addons/footstep-particles.js`.
- Fail-closed coverage guard: `a590301d2254a45d83e7664c5d41c33a79f0b075`.
- `windcutPass` now resolves to existing lightweight `mist` terrain step FX; `northCliffRoad`, legacy `cliff` / `cliffRoad`, unknown-map fallback and no-transition-FX behavior are preserved.
- GitHub Pages workflow run `34033788915` on `a590301d2254a45d83e7664c5d41c33a79f0b075`: SUCCESS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## NO-STOP

REQ-099の実装、commit、Pages成功、VERIFY移行は終了理由ではない。