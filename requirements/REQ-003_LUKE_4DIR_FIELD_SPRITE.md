# REQ-003 — Luke Formal Four-Direction Field Sprite

STATUS: VERIFY
PRIORITY: P0
TYPE: VISUAL / FIELD / CHARACTER
OWNER_REQUEST: CONFIRMED

## PURPOSE

フィールド上のルークを、現在の仮/CSS的方向表現から、正式ビジュアル基準に一致するゲーム用歩行スプライトへ進化させる。

最低4方向を明確に持ち、最終目標は4方向×3フレームの12フレーム歩行アニメーションとする。

## LUKE CANON

- 深い青髪
- 青系衣装
- 青いマント/スカーフ要素
- 銀鎧
- 王道ファンタジー騎士
- 会話用正式Luke artworkと同一人物に見えること

## MINIMUM DIRECTION REQUIREMENT

最低限:

- DOWN / 正面
- UP / 背面
- LEFT
- RIGHT

四方向は色違いではなく、身体・顔・髪・マント・武器/鎧の向きから視覚的に方向が分かること。

## TARGET ANIMATION

Target:

4 directions × 3 frames = 12 frames

各方向:

- step A
- neutral / idle-compatible
- step B

または同等の左右足歩行。

停止時は最後に向いていたdirectionのidle/neutral frameへ戻る。

方向転換のみでもspriteの向きが即座に変わる。

## FIELD SIZE / READABILITY

現在のtile/camera systemを壊さず、1tileより頭部が上に出るJRPG的比率を許可する。

表示目安は既存scaleに合わせるが、概念的には:

- 幅 32〜48 CSS px程度
- 高さ 40〜64 CSS px程度

足元collisionはsprite全体ではなく既存の足元/座標基準を維持する。

## ASSET FORMAT

Web向けsprite sheetまたはdirection/frame別assetを使用してよい。

優先:

- optimized WebP/PNG sprite sheet
- transparent background
- nearest-neighbor/pixel-art系ならimage-rendering方針を統一

生成画像を使用する場合も、チャット生成だけでは完了しない。repositoryへ安全に保存し、codeから実際に参照し、Pagesで表示する。

## CONSISTENCY

会話用Lukeとfield Lukeは絵柄の縮尺が違ってよいが、同一人物として認識できること。

髪色、主要衣装色、銀鎧、青マント等の識別要素を維持する。

## MOVEMENT INTEGRATION

既存 `s.dir` または同等direction stateを利用する。

Dynamic Touch Controller、fixed d-pad、keyboardのどの入力経路でも同じdirection stateを更新する。

入力方式ごとに別sprite logicを作らない。

## WALK FRAME TIMING

歩行frameはtile movement cadenceと同期させる。

保持移動中に自然にA/neutral/Bが循環する。

壁へ押し続けて実際に移動していない場合、足踏みを続けるかidleへ戻すかはゲーム全体の手触りに合わせるが、暴走timerは作らない。

## MOVEMENT SAFETY

このREQで既知の重大input safetyを壊さない。

必ず維持:

- centralized `stopMoving()`
- window pointerup/pointercancel safety
- blur/visibilitychange stop
- battle/dialogue/map transition stop
- encounter grace
- collision
- keyboard/fixed pad fallback
- REQ-001 dynamic touch controller behavior

sprite animationのために独立した制御不能timerを増やさない。

## RENDER PERFORMANCE

歩行frame変更だけでゲーム全DOMを不必要に再生成しない構造を優先する。

既存render architecture上どうしても再renderが必要な場合、pointer release handlerをDOM-local-onlyへ戻さない。

## FUTURE EXTENSION

今回の構造は将来的に以下へ拡張可能にする:

- idle variations
- attack
- damage
- victory
- event poses
- running

ただしこれらはREQ-003の必須完了条件ではない。

## TEST REQUIREMENTS

1. DOWNで正面sprite
2. UPで背面sprite
3. LEFTで左向きsprite
4. RIGHTで右向きsprite
5. 四方向それぞれ歩行frameが切り替わる
6. 停止時に最後directionを維持
7. keyboard入力でも正常
8. fixed d-padでも正常
9. dynamic controllerでも正常
10. wall collisionを壊さない
11. dialogue開始でmovement animation停止
12. battle開始でmovement animation停止
13. map transition後に正しいdirection/frame state
14. save/loadで方向を保存する既存仕様がある場合回帰しない
15. mobile viewportでspriteが見切れない

## AUTOMATED VERIFICATION

既存browser testがある場合、最低限direction class/style/sourceの変化とmovement regressionを自動確認する。

画像の主観品質はOwner確認が必要だが、四方向source/coordinates/frame切替は自動検証可能にする。

## IMPLEMENTATION CHECKPOINT — 2026-09-06

- `assets/characters/luke/field-down.webp.b64`
- `assets/characters/luke/field-up.webp.b64`
- `assets/characters/luke/field-left.webp.b64`
- `assets/characters/luke/field-right.webp.b64`
- 各directionは 144×64 の3-frame horizontal WebP stripとしてrepository transport済み。
- `addons/zzz-luke-field-sprite.js` が4directionのWebP transportをhydrateし、`s.dir` に従って実プレイヤーDOMへ適用する。
- 歩行中は step A / neutral / step B 系の3frameを切り替え、停止時はneutral frameへ戻す。
- 既存 `move()` / `stopMoving()` の中央経路へ接続し、独立した無制限animation timerは追加していない。
- static regressionは全4 WebP payloadのRIFF/WEBP identity、runtime path、4-direction、3-frame、movement/stop contractを検証する。
- addon isolation contract PASS。
- assembled-game browser smoke PASS。
- GitHub Pages deploy PASS。
- Ownerによる見た目の主観確認およびiPhone実機表示確認は未実施のため `DONE` ではなく `VERIFY`。

## COMPLETION CONDITION

- 正式Luke canonに一致するfield sprite asset
- 4方向が視覚的に明確
- 4方向それぞれ複数歩行frame、target 3 frame
- movement方向とsprite方向が一致
- hold movementで歩行animation
- stopでidle/neutral
- dynamic controller/fixed pad/keyboardすべてで正常
- collision/battle/dialogue/map transition safety維持
- repositoryからassetを実際に参照
- Pages公開
- syntax/static/runtime/browser tests PASS

Ownerによる実機/見た目確認が必要なら実装後 `VERIFY` へ移行する。

## NOT COMPLETION

- CSSで左右へ少し傾けただけ
- 正面画像を全方向で共用
- 色だけ変えて方向を表現
- 4方向あるが静止1frameのみを最終品質扱い
- 画像生成しただけでcode未統合
- conversation Lukeと別人

## DO NOT REPEAT

- 常時正面spriteへ戻さない
- 仮CSS characterを正式完成扱いしない
- animation追加でmovement safetyを壊さない
- input経路ごとにdirection logicを分裂させない
- Owner未確認の主観品質を承認済みと報告しない
