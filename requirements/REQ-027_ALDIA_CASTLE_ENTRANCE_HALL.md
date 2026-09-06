# REQ-027 — 王都アルディア・王城玄関ホール

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / CASTLE / INTERIOR / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「城」と「建物内部」が含まれる。REQ-025で門衛詰所、REQ-026で王城前庭までwalkableになったが、王城本館内部はまだ存在しない。

現在の前庭には本館大扉が視認できるため、その先を「開発中」等のメタ文言で塞ぎ続けるより、保護された物語秘密を新規断定せずに実装できる安全な最初の本館内部として玄関ホールを追加する。

## PURPOSE

王城前庭の大扉から入れるwalkableな王城玄関ホールを追加し、王都→門衛詰所→前庭→王城本館内部という空間的連続性を成立させる。

これは謁見の間、王族イベント、王城全体の完成を意味しない。

## REQUIRED PLAYER FLOW

王都
→ 王城門衛詰所
→ 王城前庭
→ 王城本館大扉
→ 王城玄関ホール

玄関ホールから前庭へ安全に戻れる。

## VISUAL REQUIREMENTS

最低限:
- 石または磨かれた床
- 厚い城壁 / 柱
- 青銀系の王国旗
- 灯り
- 階段または奥へ続く高低差表現
- 受付 / 衛兵卓 / 城内案内のいずれか
- 奥に城の続きがあると分かるランドマーク
- 単なる色付き格子だけにしない
- 絵文字だけを最終表現にしない

## INTERACTION

最低限3つ:
- 玄関衛兵または案内係
- 城内案内板
- 王国紋章 / 旗 / 古い鎧等の環境小物

canonical `action()` chain経由で調べられること。

報酬、重要story flag、秘密設定は勝手に追加しない。

## DEEP CASTLE BOUNDARY

玄関ホール奥には「さらに王城内部が続く」ことを視覚的に示す。

奥部が未実装の場合:
- 未完成mapへ落とさない
- 「開発中」等のメタ文言を出さない
- 現在の王都警戒態勢に沿う自然なworld-side案内で止める

## CANON SAFETY

以下を新規断定しない:
- グレンとルークの血縁
- ルークの父の正体
- エリシアの全過去
- エレノアの裏切り
- 現魔王と旧王家の全関係
- 水晶異常反応の完全理由

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 iPhone fullscreen overlay維持
- fixed D-pad / A fallback維持
- dialogue開始時movement cleanup維持

## SAVE / TRANSITION SAFETY

- old save compatibility維持
- 玄関ホールmapでsave/continueしても破綻しない
- map transition時 `stopMoving()` を維持
- 前庭へ戻ったspawnが壁/NPCへ埋まらない

## TEST REQUIREMENTS

1. 前庭大扉正面のcanonical Actionで玄関ホールへ入れる
2. Tap Anywhere Actionでも同じcanonical chain経由で入れる
3. 玄関ホールがwalkable
4. NPC / propsがcollisionを持つ
5. 3つ以上のinteractionがcanonical Actionで動く
6. 奥部境界が自然なworld-side案内になる
7. 玄関ホールから前庭へ安全に戻れる
8. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
9. protected canon先出しなし
10. JavaScript/static/add-on/browser regression PASS
11. Pages deploy SUCCESS

## AUTOMATED / PUBLIC VERIFICATION

- Requirement registration checkpoint: `510a8d6af7d71cee436ce6c3d402a53e0c359ca3`.
- Entrance-hall implementation checkpoint: `db5e9dcc488c380b04b062fea58c346e6db8771f`.
- Dedicated runtime acceptance checkpoint: `ac46b29e9c663022c8126c9df2a135feaad7e2cd`.
- Queue-synchronized public build checkpoint: `f86eafa82d6f4d65e2d3b840881a686495e30eec`.
- Pages workflow run `34003902302`: SUCCESS.
- The assembled browser test includes `addons/zzzzzzzz-aldia-castle-entrance-hall-smoke.js`, which exercises canonical courtyard-door entry, hall walkability, guard interaction, guide-board interaction, deep-castle boundary interaction, hall exit, and safe courtyard spawn. Any failure emits the workflow-recognized `lqRuntimeSmokeFailure` marker.
- The same successful pipeline also re-ran sequential JavaScript syntax, collision-safe add-ons, static regression, add-on contract, PWA/assets, approved Luke art, existing world/browser regressions, strengthened floating-touch regression, upload, and Pages deploy.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

## COMPLETION CONDITION

- public Pagesで前庭→王城玄関ホール→前庭の往復が成立
- entry / walk / interaction / deep-boundary / exitがbrowser runtimeで再現可能に検証される
- existing gameplay/save/input compatibility維持
- 王城全体完成を偽装しない
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
