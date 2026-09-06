# REQ-098 — 風切り峠・cloud shadow演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / WORLD-CLOUD-SHADOW / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` が正式なwalkable outdoor mapになったが、fresh `addons/world-cloud-shadows.js` のOUTDOOR coverageとmist classificationは `northCliffRoad` までで止まり、`windcutPass` を含んでいない。

このままでは風切り峠だけ既存の屋外cloud-shadow depth演出が消え、REQ-095/097で追加した峠の背景・霧演出との視覚連続性が途切れる。

## PURPOSE

canonical `windcutPass` を既存cloud-shadow systemのoutdoor/mist分類へ接続し、高所の強風峠でも既存の軽量な広域雲影演出を維持する。

## REQUIRED BEHAVIOR

- `windcutPass` をOUTDOOR coverageへ正式登録する。
- `windcutPass` をmist cloud classへ分類する。
- `northCliffRoad` とlegacy `cliff` / `cliffRoad` coverageを維持する。
- unknown/indoor mapへcloud shadowを誤表示しない。
- presentation-onlyでcollision、movement、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusからcoverage/classificationを機械的に検証可能にする。

## ACCEPTANCE

- [ ] windcutPass is outdoor-covered
- [ ] windcutPass resolves to mist cloud class
- [ ] northCliffRoad and legacy cliff/cliffRoad coverage remain
- [ ] unknown map remains uncovered
- [ ] presentation-only/reduced-motion preserved
- [ ] fail-closed coverage smoke PASS
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-098の実装、commit、Pages成功、VERIFY移行は終了理由ではない。