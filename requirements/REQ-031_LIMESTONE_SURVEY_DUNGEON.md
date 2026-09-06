# REQ-031 — 石灰洞・旧測量坑道

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / DUNGEON / EXPLORATION / PERSISTENT_SWITCH
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「ダンジョン」が含まれる。fresh repository inventoryでは洞窟・森・山・王城などの探索領域は存在するが、独立した小型dungeonとして、分岐と永続ギミックを持つwalkable mapは確認できない。

REQ-029の石灰洞には古い測量印と採掘杭が既に存在するため、その自然洞の脇から入れる古い測量坑道を最初の安全なdungeon checkpointとして追加する。

## PURPOSE

石灰洞から入れる旧測量坑道を追加し、単なる一室ではなく、

- 一本道ではない探索
- blocking gate
- canonical Actionで動くswitch/lever
- gate状態の永続
- 奥区画の到達
- 安全な帰還

を持つ小型ダンジョンとして成立させる。

重要story progressionやprotected canonは変更しない。

## ENTRY / EXIT

- REQ-029 `aldiaLimestoneCave` 内の安全な床へ `旧測量坑道の入口` を追加
- 既存interactionを潰さない
- 正面canonical `action()`で入る
- Tap Anywhere Actionでも同じcanonical chain経由
- dungeon出口から石灰洞へ安全に戻れる

## DUNGEON MAP

新規mapは最低限:
- 複数の通路
- 小さな分岐
- 中央または奥にblocking gate
- gate手前とは別位置にlever/switch
- gateの向こうに到達確認できる奥区画
- 帰路

を持つ。

単なる長方形1室を「ダンジョン」と呼ばない。

## PERSISTENT GATE MECHANIC

必須:
- gate closed状態では通れない
- leverをcanonical Actionで調べるとgateが開く
- `s.flags` のoptional flagで状態を保持
- old saveではundefined=falseとしてclosed扱い
- save/load後もopen状態を再構築可能
- gate open後に同じleverを調べても危険な状態へ戻さない
- map/render再構築でgate状態が逆戻りしない

推奨flag:
`lqSurveyGateOpen`

## INTERACTION

最低限:
- gate lever
- 古い測量台 / 地図台
- 奥区画の測量標または崩落記録
- 入口または壁の注意書き等

報酬は必須ではない。
重要story flag、秘密設定、王国の重大新設定は追加しない。

## VISUAL REQUIREMENTS

最低限:
- 木製支柱 / 坑道補強
- 石壁
- 鉄格子または古いgate
- ランタン / 小さな灯り
- 測量道具
- 奥へ深くなる照明差
- CSS/DOMによる独自visual density
- 絵文字だけを最終表現にしない

## CANON SAFETY

坑道は古い一般測量・採掘用途として扱う。
以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由
- 古代文明等の巨大新設定

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 fullscreen world UI維持
- fixed fallback controls維持
- dialogue/map transition時 `stopMoving()` 維持

## SAVE SAFETY

- old save compatibility維持
- dungeon mapでsave/continue可能
- `s.flags` が存在する既存save modelを利用
- optional new flag以外のsave schemaを変更しない
- open gateのruntime projectionをrender/load後に再構築

## TEST REQUIREMENTS

1. 石灰洞に坑道入口が存在
2. canonical Actionでdungeon entry
3. dungeonがwalkableかつ分岐あり
4. gate closed時は通過不能
5. lever Actionで `lqSurveyGateOpen=true`
6. gate open後は通過可能
7. render後もgate open維持
8. save-compatible state projectionでclosed/openを再現可能
9. 奥区画interactionが成立
10. dungeonから石灰洞へ安全に帰還
11. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
12. existing story/save regressionなし
13. JavaScript/static/add-on/browser regression PASS
14. Pages deploy SUCCESS

## AUTOMATED VERIFICATION

- `addons/limestone-survey-dungeon.js` implements the walkable survey dungeon, canonical entry/exit, persistent lever flag and gate projection.
- `addons/zzzzzzzzzzzz-limestone-survey-dungeon-smoke.js` verifies entry, safe spawn, closed-gate blocking model, lever opening, persistent re-render projection, deep interaction and safe exit in the assembled browser build.
- The first acceptance attempt exposed a test-only defect: the smoke probe referenced nonexistent `canWalk()`. The diagnostic path was hardened so failures surface their exact reason, then the probe was repaired to use the map's actual tile/NPC collision model without changing gameplay code.
- Pages run `34005199926` for checkpoint `0122e83389f70a74ba15c143ec5cc81c8ff2c7ad`: SUCCESS through sequential syntax validation, 98 add-on syntax checks, static regression, add-on contract, PWA/assets, assembled browser smoke, floating touch smoke, upload and Pages deploy.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

## COMPLETION CONDITION

- public Pagesで石灰洞→旧測量坑道→lever→gate通過→奥区画→石灰洞帰還が成立
- gate stateがoptional persistent flagで安全に保持される
- entry / walk / switch / gate / deep interaction / safe exitをbrowser runtimeで再現可能に検証
- existing gameplay/save/input compatibility維持
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
