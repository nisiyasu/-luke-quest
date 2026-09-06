# REQ-035 — Original Audio Feedback / SE foundation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: AUDIO / PLAYER_FEEDBACK / POLISH / ACCESSIBILITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終ゲーム完成像は「可能なら音楽・SE」を明示している。

fresh inventoryでは `AudioContext` / `music` / `BGM` / `SE` / `sound` / `audio` に該当する実装が確認できなかった。

現時点では主要なフィールド、入力、戦闘、アイテム、装備、探索コンテンツが存在する一方、操作やイベントへの音響フィードバックがない。そこで著作権上安全な完全オリジナルのWeb Audio生成SE基盤を、小さく安全なplayer-visible checkpointとして追加する。

## SCOPE

外部音源や既存ゲーム音源を使わず、Web Audio APIで短い合成SEを生成する。

最低限:
- UI決定 / canonical Action 成功
- dialogue advance / close
- item / treasure acquisition
- battle hit / skill feedback
- map transition cue

のうち実コードへ安全に接続できる3種類以上を実装する。

## MOBILE / BROWSER SAFETY

- autoplay規制を尊重する
- AudioContextはユーザーgesture後のみresume/createする
- 初回ロード時に勝手に音を鳴らさない
- audio unavailableでもゲームを壊さない
- iPhone Safari / PWAで例外が出てもgameplayを止めない
- reduced-motionとは独立だが、mute設定を提供する
- localStorageへmute stateを保存してよい
- 音量は控えめなdefaultにする

## UI

world gameplayで邪魔にならない小型SOUND toggleを提供する。

REQ-022 fullscreen world UIを壊さずmap上overlayまたは既存MENU内の軽量操作として扱う。

## CANON / GAMEPLAY SAFETY

- story flags変更禁止
- battle damage / RNG変更禁止
- item reward変更禁止
- movement semantics変更禁止
- REQ-021 Tap Anywhere / REQ-001 Dynamic Touch event chainを二重発火させない
- audioはpresentation feedbackのみ

## ORIGINALITY

- 外部音声assetなし
- copyrighted melody引用禁止
- 短いtone/noise envelopeのみ
- BGMは今回必須ではない。まずSE foundationを安全に確立する

## TEST REQUIREMENTS

1. add-on JavaScript syntax PASS
2. AudioContext unsupported時も例外なくgame continues
3. user gesture前にautoplayしない
4. gesture後にaudio engineがunlock可能
5. 3種類以上のdistinct SE path
6. mute toggleでsound dispatchが抑制される
7. mute state保存/復元がgame save schemaを壊さない
8. REQ-021/001 input regressionなし
9. browser smokeでengine/toggle/dispatch contract確認
10. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesにoriginal generated SE foundationが含まれる
- relevant player actionsへ3種類以上接続される
- mute controlが機能する
- browser/runtime regressions PASS
- gameplay/state semantics不変
- Owner iPhone subjective sound/volume verification前はVERIFYでよい

## DO NOT REPEAT

- autoplay loopを初回ロードで開始しない
- copyrighted melodyを再現しない
- audio failureをfatal errorにしない
- input handlerを複製してSEを鳴らさない
- SOUND UIのためにworld viewportを縮めない