# REQ-036 — Original Ambient Music Foundation

STATUS: IN_PROGRESS
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

最初のcheckpointでは最低限2系統:
- town / safe interior系: 明るく静かな短いpattern
- field / forest / route系: 少し緊張感のある短いpattern

battle専用BGMは今回必須ではない。battle/non-worldへ入ったらworld ambientを安全に停止またはduckする。

## AUTOPLAY / MOBILE SAFETY

- 初回loadでAudioContextを作らない・鳴らさない
- user gestureで明示的に MUSIC ON にした後だけ開始
- Safari autoplay restrictionを尊重
- AudioContext unsupportedでもgameplay継続
- visibility hidden / pagehideで停止またはsuspend
- repeated renderでtimer/oscillatorを増殖させない
- map transitionでtheme切替しても古いschedulerを残さない
- SEの既存AudioContext ownershipや `LQ_sfx` を上書きしない

## UI

world viewportを縮めない小型 `MUSIC` toggleをmap上へoverlayする。

- default OFF
- ON/OFFが明確
- explicit controlなのでREQ-021 world tap Actionから除外されるbutton要素を使う
- REQ-022 fullscreen UIを壊さない
- localStorageにmusic preferenceを保存してよいが、autoplay禁止のためreload後もuser gestureなしに鳴らさない

## ORIGINALITY

- sampled/external asset禁止
- copyrighted melody引用禁止
- simple arpeggio/pad/tone envelopeから構成
- LUKE QUEST独自の短いpatternとして実装

## GAMEPLAY SAFETY

- story / save / reward / battle state変更禁止
- movement/input semantics変更禁止
- canonical action()をwrapしない
- musicはpresentation-only

## TEST REQUIREMENTS

1. JS syntax PASS
2. AudioContext unavailableでもfatalなし
3. initial stateでAudioContext未生成・music未再生
4. explicit MUSIC buttonが存在
5. toggle ONでengineをuser-gesture内からunlock可能
6. toggle OFFでscheduler/active voices停止
7. theme分類2系統以上
8. repeated render/map transitionでduplicate schedulerなし
9. hidden/pagehide cleanup
10. REQ-021/001/022/034 regression PASS
11. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesへoriginal ambient music foundationが含まれる
- explicit user opt-inで2系統以上のworld themeを再生可能
- OFF/visibility/non-worldで安全停止
- existing SE ownership不変
- browser/Pages regressions PASS
- iPhone音量/雰囲気の主観確認前はVERIFYでよい

## DO NOT REPEAT

- v83/v138のSEを再実装しない
- autoplayしない
- renderごとにsetIntervalを増やさない
- world入力surfaceへmusic用pointer handlerを追加しない
- MUSIC UIのためにworld表示領域を削らない