# REQ-025 — 王都アルディア・王城門衛詰所

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / INTERIOR / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「城」が含まれる。fresh repository realityでは王都の宿・店舗・神殿系施設・民家などの内部は拡張されている一方、王城側のwalkable interiorは未確認である。

正式キャラアートや保護された物語秘密を新規断定せずに進められる安全なplayer-visible完成単位として、王城の手前にある門衛詰所を実装する。

## PURPOSE

王都アルディア北側に、実際に入って歩ける小規模な王城門衛詰所を追加する。

これは最終的な王城本体・謁見の間の完成を偽装するものではなく、王城エリア実装の最初の安全なcheckpointである。

## SCOPE

- 王都 `town` 北側に視認できる門衛詰所入口を追加
- 新規walkable map `aldiaCastleGatehouse`
- 入口 / 出口の往復
- 石床・石壁・武具棚・机・灯り・旗など門衛らしい環境密度
- 一般門衛NPC 1名
- 調べられる環境小物 3〜4個
- iPhone fullscreen world / Dynamic Touch / Tap Anywhere Actionと共存

## CANON SAFETY

以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 勇者水晶異常反応の完全理由

門衛会話は、序盤ですでに公知の「勇者候補レオンが逃げた」「王都が少し慌ただしい」程度に留める。

## ENTRY DESIGN

- 王都北側の既存主要導線を壊さない座標を使用
- 入口は門・灯り・盾などの視覚表現で分かる
- 正面からcanonical Actionで入る
- Tap Anywhere Actionでも同じcanonical `action()` chain経由で入れる

## INTERIOR QUALITY

最低限:
- 石床
- 石壁
- 出口
- 門衛机
- 武具棚
- 王国旗または紋章表現
- 灯り
- 影 / 奥行き
- NPC

絵文字だけを最終表現にしない。CSS/DOMの独自visualを用いてよい。

## INTERACTION

- 門衛NPCと短い会話
- 武具棚 / 掲示板 / 旗などを調べられる
- 報酬や重要ストーリーフラグを勝手に追加しない
- 既存 `action()` wrapper chainを壊さない

## EXIT / SAVE SAFETY

- 退出すると王都の入口前へ安全に戻る
- 既存town map tilesを大規模変更しない
- saveがinterior mapでもcontinue可能
- old save compatibility維持

## TEST REQUIREMENTS

1. 王都北側入口正面からActionで入れる
2. interiorがwalkable
3. NPC/prop collision成立
4. 門衛・環境小物をcanonical Actionで調べられる
5. 出口から王都へ戻れる
6. exit後に壁/NPCへ埋まらない
7. Dynamic Touch / Tap Anywhere Actionと共存
8. iPhone fullscreen overlay layoutを壊さない
9. protected story secretを先出ししない
10. static/add-on/browser regression PASS
11. Pages deploy SUCCESS

## AUTOMATED / PUBLIC VERIFICATION

- Implementation checkpoint: `5cfdeec127b1fcd4c38ff4a15c26742bf9ea3cf7`.
- Dedicated runtime acceptance probe added at `e69e22efe5c82012cd388f2cff8e75088d1d1ddf` in `addons/zzzzzz-aldia-castle-gatehouse-smoke.js`.
- The probe exercises canonical entry, walkability, guard interaction, environment-prop interaction, exit and safe town spawn, then restores the smoke-test state.
- Pages workflow run `34001139669` passed JavaScript validation, add-on/static contracts, assembled browser runtime smoke including the REQ-025 probe, the strengthened Dynamic Touch/Tap Anywhere smoke, upload and deploy.
- Dynamic Touch v1.5, Tap Anywhere Action and fullscreen overlay regressions remained green in the same public build.
- Owner physical iPhone / subjective visual verification remains pending.

## COMPLETION CONDITION

- 王都にwalkableな王城門衛詰所が1つ存在する
- entry / interior / interaction / exitが公開Pagesで動作する
- existing gameplay/save compatibility維持
- automated tests PASS
- 王城本体完成とは主張しない
- Owner physical iPhone/subjective visual confirmation前はVERIFYでよい
