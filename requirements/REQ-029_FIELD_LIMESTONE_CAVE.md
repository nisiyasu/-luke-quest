# REQ-029 — 王都近郊・石灰洞

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / CAVE / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「洞窟」が含まれる。fresh repository inventoryでは王都、近郊、森、魔王軍監視区域、北の退避路、複数建物内部、王城内部は存在する一方、独立したwalkable cave mapは確認できない。

城の部屋を連続追加するだけでは地理的な完成度が偏るため、次の安全なplayer-visible checkpointとして王都近郊に小規模な石灰洞を追加する。

## PURPOSE

王都近郊から任意に立ち寄れるwalkableな洞窟を追加し、屋外・町・建物とは異なる探索空間を成立させる。

重要story progressionやprotected canonは変更しない。これは洞窟システムの最初の完成単位であり、巨大ダンジョン完成とは主張しない。

## ENTRY / EXIT

- 既存 `field` の主要ルートを塞がない位置に視認可能な洞口を追加
- 洞口正面からcanonical `action()`で入る
- REQ-021 Tap Anywhere Actionでも同じcanonical chain経由で入れる
- 洞窟出口から王都近郊へ安全に戻れる
- exit spawnが壁/NPCへ埋まらない

## CAVE VISUAL REQUIREMENTS

最低限:
- 岩壁
- 不規則な石床
- 暗所表現
- 湿った地面または地底水
- 鉱脈 / 結晶 / 石筍のいずれか
- 入り口から奥へ視覚的に深くなる構成
- CSS/DOMによる独自visual density
- 絵文字だけを最終表現にしない

## INTERACTION

最低限3つ:
- 古い測量印
- 淡く光る鉱脈または結晶
- 地底水 / 崩落跡 / 石筍等の環境小物

すべてcanonical `action()` chain経由。
重要story flag、秘密設定、強制報酬は勝手に追加しない。

## OPTIONAL DEPTH BOUNDARY

洞窟奥にはさらに深い亀裂または崩落区域があることを示してよい。
未実装領域へ落とさず、自然なworld-side boundaryで止める。
「開発中」等のメタ文言は禁止。

## CANON SAFETY

以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由

洞窟は序盤の地域地理として成立する一般的な自然洞とする。

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 fullscreen world UI維持
- fixed fallback controls維持
- dialogue/map transition時 `stopMoving()` 維持

## SAVE SAFETY

- old save compatibility維持
- cave mapでsave/continueしても破綻しない
- 新しい必須flagを要求しない
- 既存story progressionを変更しない

## TEST REQUIREMENTS

1. 王都近郊の洞口が視認できる
2. 洞口正面canonical Actionで入れる
3. caveがwalkable
4. 独自cave visual landmarksがrenderされる
5. 3つ以上のenvironment interactionがcanonical Actionで動く
6. 奥の未実装深部境界が自然に処理される
7. caveからfieldへ安全に戻れる
8. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
9. existing story/save regressionなし
10. JavaScript/static/add-on/browser regression PASS
11. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesでfield→cave→fieldの往復が成立
- entry / walk / environment interactions / depth boundary / safe exitがbrowser runtimeで再現可能に検証
- existing gameplay/save/input compatibility維持
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
