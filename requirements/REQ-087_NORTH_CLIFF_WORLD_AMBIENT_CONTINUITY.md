# REQ-087 — 北の崖道・world ambient演出の連続性

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / WORLD-AMBIENCE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

canonical map keyは `northCliffRoad` だが、fresh `addons/world-ambient-layer.js` のregional TYPE registryは旧キー `cliffRoad:'fog'` までしか持っていなかった。

`build()` は `TYPE[s.map]` が無い場合、既存ambient layerをremoveしてreturnするため、北の崖道では地域ambient演出が完全に消える。REQ-081〜086で正式化した新地域だけ既存world-depth presentationから外れるplayer-visible continuity defectだった。

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
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-world-ambient-north-cliff-smoke.js`

## ACCEPTANCE

- [x] `northCliffRoad` maps to `fog`
- [x] legacy `cliffRoad` mapping remains
- [x] unknown map remains unmapped
- [x] presentation-only/reduced-motion preserved
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## VERIFIED EVIDENCE

- Requirement registration checkpoint: `23d8fedc503dce1c8fbebe3ed78abab170e66738`.
- Implementation checkpoint: `d4a0192b94c397082ce6a5123e9a6bd2f98e1388` (`Add north cliff ambient continuity`).
- Fail-closed coverage checkpoint: `5d9014d543a53d9b4b66634127ad9dc89a9628c0` (`Gate REQ-087 north cliff ambient coverage`).
- Runtime status exposes `hasMap(map)` and `typeFor(map)`; `northCliffRoad` resolves to `fog`, legacy `cliffRoad` remains `fog`, and unknown maps resolve to `null`.
- Dedicated late-loading smoke throws if canonical coverage, legacy alias, or unknown-map fallback regresses.
- Pages workflow run `34027503885`: SUCCESS. Collision-safe add-ons, static regression, add-on contract, assembled browser, 390x844 touch/fullscreen visual-liveness, north-cliff road/encounter browser smokes, upload and Pages deploy all SUCCESS.
- No Owner physical iPhone visual PASS is claimed.

## NO-STOP

REQ-087の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
