# REQ-086 — 北の崖道・エリアタイトル演出の連続性

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / AREA-TITLE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081で `northCliffRoad` が正式なwalkable mapになり、REQ-082〜085でencounter、導線、journal、battle backdropまで地域連続性を拡張した。

しかしfresh `addons/area-title-card.js` のsubtitle registryは `cliff` / `cliffRoad` を持つ一方、実際のcanonical map key `northCliffRoad` を持っていなかった。

そのため北の崖道へ入った際、area titleの大見出しはMAPS由来で表示できても、subtitleはgeneric fallback `LUKE QUEST` へ落ちる。新地域だけ既存のcinematic location-title systemから外れるplayer-visible continuity gapだった。

## PURPOSE

既存area-title-card authorityへcanonical `northCliffRoad` を接続し、北の退避路から高所の崖道へ進んだことが一目で分かる地域字幕を表示する。

## REQUIRED BEHAVIOR

- `northCliffRoad` をarea title subtitle registryへ正式登録する。
- subtitleは既存世界観と現在の追跡ルートに整合し、protected canonを追加・変更しない。
- 既存map/interior subtitleを削除・変更しない。
- unknown mapでは既存generic fallbackを維持する。
- area titleはpresentation-onlyで、movement、encounter、story、save、battle logicへ影響しない。
- map transition時の既存一回表示、timer、reduced-motion behaviorを維持する。
- acceptanceから `northCliffRoad` coverageを機械的に検証できるようにする。

## IMPLEMENTATION TARGET

- `addons/area-title-card.js`
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-area-title-north-cliff-smoke.js`

## ACCEPTANCE

- [x] `northCliffRoad` has a dedicated subtitle
- [x] existing subtitles remain intact
- [x] unknown-map generic fallback remains intact
- [x] presentation-only behavior preserved
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## VERIFIED EVIDENCE

- Requirement registration checkpoint: `8542993c76d4158d6f33e06db72ed124937a52b4`.
- Implementation checkpoint: `3aff8a349a6144f6a18fb5e5cd2bfbb9bbd998f0` (`Add north cliff area title continuity`).
- Fail-closed coverage checkpoint: `dbdc61e8cf5cd1bca01e6927f33ea7474711df62` (`Gate REQ-086 north cliff area title coverage`).
- `northCliffRoad` subtitle: `退避路の先へ続く風の強い北方崖道`.
- Runtime status now exposes `hasMap(map)` and `subtitle(map)` so coverage and fallback are mechanically inspectable.
- Dedicated late-loading smoke fails closed with `TypeError` if `northCliffRoad` is absent, uses generic fallback, or unknown-map fallback changes.
- Pages workflow run `34027291395`: SUCCESS. Collision-safe add-on validation, static regression, add-on contract, assembled browser, 390x844 floating touch/fullscreen visual-liveness, north-cliff road/encounter browser smoke, upload and Pages deploy all SUCCESS.
- No Owner physical iPhone visual PASS is claimed.

## NO-STOP

REQ-086の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
