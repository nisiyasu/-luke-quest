# REQ-086 — 北の崖道・エリアタイトル演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / AREA-TITLE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081で `northCliffRoad` が正式なwalkable mapになり、REQ-082〜085でencounter、導線、journal、battle backdropまで地域連続性を拡張した。

しかしfresh `addons/area-title-card.js` のsubtitle registryは `cliff` / `cliffRoad` を持つ一方、実際のcanonical map key `northCliffRoad` を持っていない。

そのため北の崖道へ入った際、area titleの大見出しはMAPS由来で表示できても、subtitleはgeneric fallback `LUKE QUEST` へ落ちる。新地域だけ既存のcinematic location-title systemから外れるplayer-visible continuity gapである。

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
- relevant acceptance / Pages gate as needed

## ACCEPTANCE

- [ ] `northCliffRoad` has a dedicated subtitle
- [ ] existing subtitles remain intact
- [ ] unknown-map generic fallback remains intact
- [ ] presentation-only behavior preserved
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-086の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。
