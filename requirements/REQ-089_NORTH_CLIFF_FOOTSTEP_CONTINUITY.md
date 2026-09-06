# REQ-089 — 北の崖道・terrain footstep演出の連続性

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / FOOTSTEP / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

fresh `addons/footstep-particles.js` のOUTDOOR setとterrain classifierは旧キー `cliff` / `cliffRoad` までしか持たず、canonical `northCliffRoad` を含んでいなかった。

`stepFx()` は `!OUTDOOR.has(s.map)` ならreturnするため、北の崖道では既存のterrain-aware step FXが完全に発火しない。REQ-081〜088で正式化した新地域だけ移動時の足元フィードバックが抜けるplayer-visible continuity defectだった。

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
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-world-footstep-north-cliff-smoke.js`

## ACCEPTANCE

- [x] `northCliffRoad` is outdoor-covered
- [x] `northCliffRoad` resolves to `mist`
- [x] legacy cliff/cliffRoad coverage remains
- [x] unknown map remains uncovered
- [x] transition/reduced-motion/presentation-only behavior preserved
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## VERIFIED EVIDENCE

- Requirement registration checkpoint: `3f102afa41d23cf8b702aaf7ba55d758c8f4cca5`.
- Implementation checkpoint: `64ce64ac004b40b71a731308e9ca80aceede3c38` (`Add north cliff footstep continuity`).
- Fail-closed coverage checkpoint: `d29c66f63caab97a82fee76403bb3ea3bc9930a0` (`Gate REQ-089 north cliff footstep coverage`).
- Runtime status exposes `hasMap(map)` and `kindFor(map)`; `northCliffRoad` resolves to `mist`, legacy `cliff` / `cliffRoad` remain `mist`, and unknown maps remain uncovered/null.
- Dedicated smoke throws if canonical coverage, legacy aliases, terrain kind, or unknown-map fallback regresses.
- Pages workflow run `34027731834`: SUCCESS. Static/add-on checks, assembled browser, 390x844 touch/fullscreen visual-liveness, north-cliff road/encounter browser smokes, upload and Pages deploy all SUCCESS.
- No Owner physical iPhone visual PASS is claimed.

## NO-STOP

REQ-089の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
