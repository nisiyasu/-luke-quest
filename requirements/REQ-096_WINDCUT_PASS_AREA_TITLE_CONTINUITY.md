# REQ-096 — 風切り峠・エリアタイトル演出の連続性

STATUS: VERIFY
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

- [x] windcutPass has a dedicated subtitle
- [x] existing subtitles remain intact
- [x] unknown-map generic fallback remains intact
- [x] presentation-only behavior preserved
- [x] fail-closed coverage smoke PASS
- [x] JS/static/add-on regression PASS
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone visual feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `d6ba85642c2501bdae609e6c1943cbbc766d0880`.
- Area-title implementation: `4041dc666ee2ed0dd491fdd0731316d80ecd8c74` in `addons/area-title-card.js`.
- Fail-closed coverage guard: `5be1070c106c61492792af7f154e8dde54e98f08`.
- Dedicated subtitle: `北尾根へ続く風の強い高所峠`.
- Existing `northCliffRoad` dedicated subtitle and unknown-map `LUKE QUEST` fallback are explicitly guarded.
- GitHub Pages workflow run `34033373703` on `5be1070c106c61492792af7f154e8dde54e98f08`: SUCCESS.
- AUTOMATED_VERIFICATION: PASS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## NO-STOP

REQ-096の実装、commit、Pages成功、VERIFY移行は終了理由ではない。fresh HEAD → queue/current sync → GATE Cを実行し、安全な次作業があれば継続する。