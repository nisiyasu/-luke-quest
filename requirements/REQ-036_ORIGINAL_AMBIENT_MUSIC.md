# REQ-036 — Original Ambient Music Foundation

STATUS: VERIFY
PRIORITY: P1
TYPE: AUDIO / MUSIC / ATMOSPHERE / POLISH
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像は「可能なら音楽・SE」を含む。

fresh inventoryで既存SE実装 `ux-v83.js` / `ux-v138.js` / `addons/audio-dedup-v138.js` を確認したため、REQ-035の重複SE登録はSUPERSEDEDへ自己修復した。

さらに `BGM` / `music` / `soundtrack` とaddon filename inventoryを行ったが、継続的な音楽/環境音楽レイヤーは確認できなかった。

したがって既存SE所有権を壊さず、完全オリジナルの小規模なambient music foundationを追加する。

## SCOPE

Web Audio APIのみで、外部音源なしの短いオリジナルambient loopを生成する。

実装済み2系統:
- town / safe interior系: 明るく静かな短いpattern
- field / forest / route系: 少し緊張感のある短いpattern

battle/non-worldへ入ったらworld ambientを安全に停止する。

## AUTOPLAY / MOBILE SAFETY

- 初回loadでAudioContextを作らない・鳴らさない
- user gestureで明示的に MUSIC ON にした後だけ開始
- Safari autoplay restrictionを尊重
- AudioContext unsupportedでもgameplay継続
- visibility hidden / pagehideで停止/suspend
- repeated renderでtimer/oscillatorを増殖させない generation token方式
- map theme切替時に旧scheduler/voiceを停止
- SEの既存AudioContext ownershipや `LQ_sfx` を上書きしない

## UI

`addons/original-ambient-music.js` が worldの `gameShell` 内に小型 `MUSIC` buttonをoverlayする。

- default playback OFF
- ON/OFF明示
- button要素なのでworld Actionのexplicit-control exclusion対象
- world viewportをdocument flowで縮めない
- preferenceはlocalStorageへ保存可能だが、reload後もsession user gesture前には再生しない

## ORIGINALITY

- sampled/external assetなし
- copyrighted melody引用なし
- oscillator + gain envelopeのみ
- safe / wild の独自短尺pattern

## GAMEPLAY SAFETY

- story / save / reward / battle state変更なし
- movement/input semantics変更なし
- canonical `action()` をwrapしない
- existing `LQ_sfx` ownership不変
- musicはpresentation-only

## TEST / VERIFICATION

Implemented:
- `addons/original-ambient-music.js`
- `addons/zzzzzzzzzzzz-original-ambient-music-smoke.js`

Smoke checks in the existing iPhone-sized `lqTouchSmoke` harness:
- status export exists
- original synth / external audio false
- initial autoplay false / playing false
- pre-gesture unlocked false
- safe + wild themes exist
- explicit MUSIC button exists inside gameShell
- gameShell remains >80% viewport height
- input wrappers untouched
- existing SFX ownership preserved

Checkpoint:
- implementation `fd85e8e4386af22538e3798c7bf705875e3a5257`
- browser acceptance `0803395d9fe7e39668cdcdfc1814520a3e38066c`
- Pages run `34006935671`: SUCCESS
- sequential JS/add-ons/static/add-on/PWA/assets: SUCCESS
- assembled browser gameplay smoke: SUCCESS
- iPhone-sized floating touch + world visual liveness + ambient music acceptance: SUCCESS
- upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated completion is satisfied:
- public Pages includes original ambient music foundation
- explicit user opt-in supports two world theme classes
- OFF/hidden/non-world cleanup exists
- existing SE ownership remains intact
- browser/Pages regressions PASS

Physical/subjetive completion remains:
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner checks actual iPhone sound/volume/feel.

## DO NOT REPEAT

- v83/v138のSEを再実装しない
- autoplayしない
- renderごとにschedulerを増殖させない
- world入力surfaceへmusic用pointer handlerを追加しない
- MUSIC UIのためにworld表示領域を削らない
- headless browser successをiPhone音量/音質の実機PASSと扱わない