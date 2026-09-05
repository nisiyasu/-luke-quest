# REQ-022 — iPhone Fullscreen World UI

STATUS: READY
PRIORITY: P0
TYPE: UX / LAYOUT / IPHONE
OWNER_REQUEST: CONFIRMED

## PURPOSE

iPhoneでゲーム画面を可能な限り大きく使い、現在のようにstatus / world / controller / A / MENUが縦に別枠を取り合うレイアウトを廃止する。

Owner intent:
- iPhoneで全画面に近い表示
- 狭くて見づらい現状を解消
- controller / MENU / Aをゲーム画面上へ重ねて同居
- 操作用UIだけで別の大きな枠を消費しない
- マップそのものを主役にする

## TARGET LAYOUT

world gameplay中はviewportをゲーム画面として扱う。

基本構造:
- map/world = viewportの大部分または全体
- status HUD = top overlay
- objective/location = compact top overlay
- MENU = edge overlay
- A = overlay/fallback
- Dynamic Touch Controller = touch origin周辺へ一時overlay
- dialogue = bottom overlay

worldの下に大きなcontrols領域を固定確保しない。

## VIEWPORT

`100dvh` を第一候補とし、iOS Safariのdynamic browser chromeを考慮する。
必要に応じて `100svh` / fallbackを使用する。

`viewport-fit=cover` と safe-area insetを維持する。

## SAFE AREA

以下を考慮する:
- env(safe-area-inset-top)
- env(safe-area-inset-bottom)
- env(safe-area-inset-left)
- env(safe-area-inset-right)

MENUやfallback AがDynamic Island / home indicator / browser chromeへ食い込まないこと。

## WORLD PRIORITY

画面高さの大半をmap表示へ渡す。

現在のような:
status card
→ gameShell
→ controls card
→ footer

の縦積みをworld modeでは廃止または大幅縮小する。

## HUD OVERLAY

LV / HP / MP / Gold / items等はmapの上へcompact overlayとして配置する。

- 半透明
- mapを完全に隠さない
- 小さすぎて読めない状態にしない
- iPhone portraitで1〜2段以内を目安

## MENU OVERLAY

MENU buttonをworld内の端へfloating配置する。

推奨:
- 右上または右下
- 44 CSS px以上のtouch target
- safe area対応
- map navigationを過剰に邪魔しない

## ACTION INPUT

REQ-021完成後はshort tap anywhereがprimary Actionとなる。

A buttonは当面fallback / affordanceとして小さくoverlayしてよい。
Owner確認後に縮小・非表示化できる構造にする。

A専用の大きな外部パネルは廃止する。

## MOVEMENT INPUT

REQ-001 Dynamic Touch Controllerをprimary mobile movementへする。

固定D-padはfallbackとして当面残してもよいが:
- world下部に大枠を占有しない
- debug/legacy fallbackとしてcompact overlayまたは設定切替へ移行可能にする

Dynamic Touch Controllerが不安定な状態でfixed controlsを完全削除しない。

## DIALOGUE

dialogueはworldの下側overlay。

- 背景を適度に暗くする
- map contextが完全に消えない
- Luke portrait等と共存
- text areaがiPhoneで読める
- bottom safe area確保

## CAMERA / GAME SHELL

world shellはviewport変化時に再計算する。
Safari address barの出入りやorientation changeで極端に崩れないこと。

map cameraをviewport center基準で再計算し、既存collision / map coordinates / save coordinatesを変更しない。

## NO LAYOUT-DRIVEN GAMEPLAY CHANGE

このREQはpresentation/layout中心。
以下を勝手に変更しない:
- map coordinates
- gate logic
- collision
- story flags
- encounter rate
- save semantics

## TOUCH CONFLICT SAFETY

overlay HUDは原則 pointer-events:none。
実際に押すMENU / fallback A等だけpointer-events:auto。

これによりmap surfaceのtap-anywhere Action / Dynamic Touch Controllerを阻害しない。

## IPHONE BROWSER REALITY

Safari通常タブではbrowser chromeそのものをWebページから完全消去できない場合がある。
その場合も、利用可能viewportを最大限使う。

PWA / ホーム画面起動時は `display: standalone` 等を活用し、より全画面に近づける。

「Safari chromeをプログラムで完全除去した」と虚偽報告しない。

## TEST REQUIREMENTS

1. iPhone portrait相当viewportでworldが主領域を占める
2. controls専用大枠がworld下へ残らない
3. status HUDがmap上overlay
4. MENUがoverlayかつtouchable
5. fallback Aが存在する場合もoverlay
6. dialogue overlayがsafe area内
7. map cameraが正常
8. Dynamic Touch surfaceがoverlay HUDに塞がれない
9. Tap Anywhere ActionがMENU等のinteractive UIと競合しない
10. battle/menu screenは必要に応じ別layoutを保持し壊れない
11. orientation/viewport resizeで致命的崩れなし
12. Pages public buildで適用

## COMPLETION CONDITION

- iPhone portraitでworldがviewport主体になっている
- status / objective / MENU / fallback A / movement UIがworldへ同居
- controls専用の大きな縦領域を廃止
- safe area対応
- tap-anywhere ActionとDynamic Touch Controllerの入力面を確保
- existing gameplay/save compatibility維持
- automated responsive/browser regression PASS
- Owner実機確認前は `IOS_PHYSICAL_VERIFICATION = PENDING`

## DO NOT REPEAT

- 単にgameShellを少し高くしただけで全画面完了扱いしない
- controlsの大枠を下に残したまま完了扱いしない
- Safari chromeを消せない制約とgame UIの無駄な余白を混同しない
- Dynamic Touch完成前にfallback操作を全削除して操作不能にしない
- overlayをmap tap surfaceより上に敷き詰めて入力不能にしない
