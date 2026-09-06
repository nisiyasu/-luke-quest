# REQ-088 — 北の崖道・cloud shadow演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / WORLD-CLOUD-SHADOW / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

fresh `addons/world-cloud-shadows.js` のOUTDOOR setとmist classificationは旧キー `cliff` / `cliffRoad` までしか持たず、canonical `northCliffRoad` を含んでいない。

`addClouds()` は `!OUTDOOR.has(s.map)` でreturnするため、北の崖道だけ既存の屋外cloud-shadow depth演出が完全に適用されない。REQ-081〜087で正式化した新地域のvisual continuity gapである。

## PURPOSE

canonical `northCliffRoad` を既存cloud-shadow systemのoutdoor/mist分類へ接続し、高所の崖道で既存の軽量な広域雲影演出を維持する。

## REQUIRED BEHAVIOR

- `northCliffRoad` をOUTDOOR coverageへ正式登録する。
- `northCliffRoad` をmist cloud classへ分類する。
- legacy `cliff` / `cliffRoad` coverageを維持する。
- unknown/indoor mapへcloud shadowを誤表示しない。
- presentation-onlyでcollision、movement、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusからcanonical coverage/classificationを機械的に検証可能にする。

## IMPLEMENTATION TARGET

- `addons/world-cloud-shadows.js`
- dedicated fail-closed smoke

## ACCEPTANCE

- [ ] `northCliffRoad` is outdoor-covered
- [ ] `northCliffRoad` resolves to mist cloud class
- [ ] legacy cliff/cliffRoad coverage remains
- [ ] unknown map remains uncovered
- [ ] presentation-only/reduced-motion preserved
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-088の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
