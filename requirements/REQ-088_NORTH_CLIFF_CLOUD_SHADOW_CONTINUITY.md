# REQ-088 — 北の崖道・cloud shadow演出の連続性

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / WORLD-CLOUD-SHADOW / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

fresh `addons/world-cloud-shadows.js` のOUTDOOR setとmist classificationは旧キー `cliff` / `cliffRoad` までしか持たず、canonical `northCliffRoad` を含んでいなかった。

`addClouds()` は `!OUTDOOR.has(s.map)` でreturnするため、北の崖道だけ既存の屋外cloud-shadow depth演出が完全に適用されない。REQ-081〜087で正式化した新地域のvisual continuity gapだった。

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
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-world-cloud-north-cliff-smoke.js`

## ACCEPTANCE

- [x] `northCliffRoad` is outdoor-covered
- [x] `northCliffRoad` resolves to mist cloud class
- [x] legacy cliff/cliffRoad coverage remains
- [x] unknown map remains uncovered
- [x] presentation-only/reduced-motion preserved
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## VERIFIED EVIDENCE

- Requirement registration checkpoint: `da53656464425381051632268c739dd3cf261539`.
- Implementation checkpoint: `12a9232fa8cd864372cbc817acfb7771a147bc6d` (`Add north cliff cloud-shadow continuity`).
- Fail-closed coverage checkpoint: `436ee7e7499949e39b12023670c13a6a27ae343a` (`Gate REQ-088 north cliff cloud-shadow coverage`).
- Runtime status exposes `hasMap(map)` and `classFor(map)`; `northCliffRoad` resolves to `mist`, legacy `cliff` / `cliffRoad` remain `mist`, unknown maps are uncovered and return `null`.
- Dedicated late-loading smoke throws if canonical coverage, legacy coverage, mist classification, or unknown-map fallback regresses.
- Pages workflow run `34027572489`: SUCCESS. Collision-safe add-ons, static regression, add-on contract, assembled browser, 390x844 touch/fullscreen visual-liveness, north-cliff road/encounter browser smokes, upload and Pages deploy all SUCCESS.
- No Owner physical iPhone visual PASS is claimed.

## NO-STOP

REQ-088の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
