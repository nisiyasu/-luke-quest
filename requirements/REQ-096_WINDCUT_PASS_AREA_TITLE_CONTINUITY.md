# REQ-096 — 風切り峠・エリアタイトル演出の連続性

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / AREA-TITLE / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-093で `windcutPass` が正式なwalkable mapになり、REQ-094/095でローカル導線と地域別戦闘背景まで連続性を拡張した。

しかしfresh `addons/area-title-card.js` のsubtitle registryは `northCliffRoad` までで止まっており、canonical `windcutPass` が無い。そのため風切り峠へ入った際、大見出しのmap名は表示できてもsubtitleがgeneric `LUKE QUEST` へ落ちる。

## PURPOSE

既存area-title-card authorityへcanonical `windcutPass` を接続し、北の崖道からさらに高所の峠へ進んだことを一目で理解できる地域字幕を表示する。

## REQUIRED BEHAVIOR

- `windcutPass` をarea-title subtitle registryへ正式登録する。
- subtitleは既存世界観と追跡ルートに整合し、protected canonを追加・変更しない。
- 既存map/interior subtitleを削除・変更しない。
- unknown mapでは既存generic fallback `LUKE QUEST` を維持する。
- presentation-onlyでmovement、encounter、story、save、battle logicへ影響しない。
- map transition時の既存一回表示、timer、reduced-motion behaviorを維持する。
- `LQ_AREA_TITLE_STATUS.hasMap('windcutPass') === true` と dedicated subtitle を機械的に検証する。

## ACCEPTANCE

- [ ] windcutPass has a dedicated subtitle
- [ ] existing subtitles remain intact
- [ ] unknown-map generic fallback remains intact
- [ ] presentation-only behavior preserved
- [ ] fail-closed coverage smoke PASS
- [ ] JS/static/add-on regression PASS
- [ ] assembled browser PASS
- [ ] 390x844 touch/fullscreen PASS
- [ ] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## NO-STOP

REQ-096の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。