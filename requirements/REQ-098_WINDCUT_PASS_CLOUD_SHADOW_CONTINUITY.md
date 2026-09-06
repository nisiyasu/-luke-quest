# REQ-098 — 風切り峠・cloud shadow演出の連続性

STATUS: VERIFY
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

- [x] windcutPass is outdoor-covered
- [x] windcutPass resolves to mist cloud class
- [x] northCliffRoad and legacy cliff/cliffRoad coverage remain
- [x] unknown map remains uncovered
- [x] presentation-only/reduced-motion preserved
- [x] fail-closed coverage smoke PASS
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `764c05c204d04d8ffc8a37edbc8788f8bbc0e096`.
- Cloud-shadow implementation: `83254f799a3497282136267ddfef0d4eca3b3934` in `addons/world-cloud-shadows.js`.
- Fail-closed coverage guard: `109b6830b0aab32d0f2c00f664d81ea6f6c670ad`.
- `windcutPass` is now in OUTDOOR and resolves to `mist`; `northCliffRoad`, legacy `cliff` / `cliffRoad`, and unknown-map fallback are explicitly guarded.
- GitHub Pages workflow run `34033702442` on `109b6830b0aab32d0f2c00f664d81ea6f6c670ad`: SUCCESS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## NO-STOP

REQ-098の実装、commit、Pages成功、VERIFY移行は終了理由ではない。