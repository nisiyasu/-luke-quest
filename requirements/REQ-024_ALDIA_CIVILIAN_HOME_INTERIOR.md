# REQ-024 — 王都アルディア・民家内部

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / INTERIOR / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「民家」が含まれるが、fresh repository realityでは宿、道具屋系、神殿記録室、訓練場などの内部拡張は存在する一方、王都の一般市民の暮らしを見せる独立した民家内部は確認できない。

Owner-only正式キャラアートを捏造せず、保護された物語秘密を追加開示せずに進められる、player-visibleな未完成能力として実装する。

## PURPOSE

王都アルディアの既存住宅街に、実際に入って歩き、生活用品を調べ、市民と短く会話して退出できる小さな民家内部を追加する。

単なる「扉を押すと文章が出る」ではなく、walkable interiorとして成立させる。

## SCOPE

- 王都 `town` の既存住宅外観に自然な入口を1つ追加
- 新規walkable map `aldiaHomeInterior`
- 入口 / 出口の往復
- 家具・生活用品・窓などの環境密度
- 一般市民NPC 1名程度
- 調べられる生活小物 2〜4個
- iPhone fullscreen world layout / Dynamic Touch / Tap Anywhere Actionと共存

## CANON SAFETY

この民家では以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 勇者水晶異常反応の完全理由

生活感、王都の日常、序盤で既に公開済みの「本命勇者レオンが逃げた」程度の一般市民目線の会話に留める。

## ENTRY DESIGN

既存住宅外観に接する自然な位置へ入口を置く。

- 既存NPC、南門、重要導線を塞がない
- 入口の存在はドア外観 / 小さな看板 / 玄関灯などで視認可能
- 正面からcanonical Actionで入る
- Tap Anywhere Actionでも同じcanonical action wrapper経由で入れる

## INTERIOR QUALITY

最低限:
- 床材
- 壁
- 出口
- ベッドまたは寝具
- テーブル / 椅子
- 棚または収納
- 窓
- 灯り
- 小さな生活用品
- 影 / 奥行き

絵文字だけを最終表現にしない。CSS/DOMの独自家具表現を使ってよい。

## INTERACTION

- 市民NPCと短い会話
- 家具/生活小物を調べられる
- 調べてもアイテム窃盗や新規報酬を勝手に作らない
- 既存 `action()` wrapper chainを壊さない

## EXIT / SAVE SAFETY

- 退出すると王都の玄関前へ安全に戻る
- 既存map coordinatesやtown collisionを大規模変更しない
- save中にinterior mapが保存されてもcontinueできる
- unknown/old saveを壊さない

## TEST REQUIREMENTS

1. 王都の入口正面からActionで民家へ入れる
2. 新interior mapがwalkable
3. 家具/NPC collisionが成立
4. 市民/生活小物をcanonical Actionで調べられる
5. 出口から王都へ戻れる
6. exit後に建物やNPCへ埋まらない
7. Dynamic Touch / Tap Anywhere Actionの対象surfaceとして通常world同様に動く
8. iPhone fullscreen overlay layoutを壊さない
9. protected story secretを先出ししない
10. static/add-on/browser regression PASS
11. Pages deploy SUCCESS

## COMPLETION CONDITION

- 実際に入って歩ける一般民家が王都に1軒存在する
- entry / interior / interaction / exitが公開Pagesで動作する
- existing gameplay/save compatibility維持
- automated tests PASS
- Owner physical iPhone/subjective visual confirmation前はVERIFYでよい
