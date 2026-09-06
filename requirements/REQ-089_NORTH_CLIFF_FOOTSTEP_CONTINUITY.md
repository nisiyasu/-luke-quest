# REQ-089 — 北の崖道・terrain footstep演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / FOOTSTEP / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

fresh `addons/footstep-particles.js` のOUTDOOR setとterrain classifierは旧キー `cliff` / `cliffRoad` までしか持たず、canonical `northCliffRoad` を含んでいない。

`stepFx()` は `!OUTDOOR.has(s.map)` ならreturnするため、北の崖道では既存のterrain-aware step FXが完全に発火しない。REQ-081〜088で正式化した新地域だけ移動時の足元フィードバックが抜けるplayer-visible continuity defectである。

## PURPOSE

canonical `northCliffRoad` を既存footstep-particle systemへ接続し、北方の霧がかった崖道で既存のmist系step FXを維持する。

## REQUIRED BEHAVIOR

- `northCliffRoad` をOUTDOOR coverageへ正式登録する。
- `northCliffRoad` のterrain kindは `mist` とする。
- legacy `cliff` / `cliffRoad` coverageを維持する。
- unknown/indoor mapではstep FXを誤発火しない。
- map transitionそのものでは既存通りstep FXを出さない。
- presentation-onlyでmovement、collision、encounter、story、save、battleへ影響しない。
- reduced-motion behaviorを維持する。
- runtime statusからmap coverageとterrain kindを機械的に検証可能にする。

## IMPLEMENTATION TARGET

- `addons/footstep-particles.js`
- dedicated fail-closed smoke

## ACCEPTANCE

- [ ] `northCliffRoad` is outdoor-covered
- [ ] `northCliffRoad` resolves to `mist`
- [ ] legacy cliff/cliffRoad coverage remains
- [ ] unknown map remains uncovered
- [ ] transition/reduced-motion/presentation-only behavior preserved
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-089の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
