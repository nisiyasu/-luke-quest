# REQ-030 — 王都近郊・高地の登山道

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / MOUNTAIN / EXPLORATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「山」が含まれる。fresh repository inventoryでは王都、近郊、森、北の退避路、魔王軍監視区域、建物内部、王城、そしてREQ-029で洞窟まで存在する一方、独立したwalkable mountain/highland mapは確認できなかった。

同一カテゴリの小部屋を増殖させず、ゲーム世界の地理的バリエーションを広げる安全なplayer-visible checkpointとして、王都近郊から立ち寄れる高地の登山道を追加した。

## PURPOSE

王都近郊から任意に入れるwalkableな山岳探索マップを追加し、平地・森・洞窟とは異なる高所の環境、視界、風、崖の探索感を成立させる。

重要story progressionやprotected canonは変更しない。これは山岳地域の最初の完成単位であり、山頂・巨大ダンジョン完成とは主張しない。

## ENTRY / EXIT

- 既存 `field` の主要ストーリールートを塞がない位置に視認可能な登山口を追加
- 登山口正面からcanonical `action()`で入る
- REQ-021 Tap Anywhere Actionでも同じcanonical chain経由で入れる
- 登山道出口から王都近郊へ安全に戻れる
- entry / exit spawnは壁、NPC、不可侵地形へ埋まらない

## MOUNTAIN VISUAL REQUIREMENTS

最低限:
- 岩肌 / 崖
- 高地の細い道
- 風が抜ける視覚表現
- 遠景 / 雲 / 王都を見下ろす眺望のいずれか
- ケルン / 道標 / 古いロープ等の山岳小物
- 平地とは明確に異なる色・密度・奥行き
- CSS/DOMによる独自visual density
- 絵文字だけを最終表現にしない

## INTERACTION

最低限3つ:
- 古い登山道標
- 石積みのケルン
- 高所の見晴らし / 古いロープ / 風化した岩壁等

すべてcanonical `action()` chain経由。
重要story flag、秘密設定、強制報酬は追加しない。

## HEIGHT / DANGER BOUNDARY

山道の奥にはさらに標高の高い尾根または崩れた登路があることを視覚的に示す。
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
- 王国の新しい重大政治史や固有王族設定

## INPUT / MOBILE COMPATIBILITY

- REQ-021 Tap Anywhere Action維持
- REQ-001 Dynamic Touch Controller維持
- REQ-022 fullscreen world UI維持
- fixed fallback controls維持
- dialogue/map transition時 `stopMoving()` 維持

## SAVE SAFETY

- old save compatibility維持
- highland mapでsave/continueしても破綻しない
- 新しい必須flagを要求しない
- 既存story progressionを変更しない

## TEST REQUIREMENTS

1. 王都近郊の登山口が視認できる
2. 登山口正面canonical Actionで入れる
3. mountain/highland mapがwalkable
4. 独自mountain visual landmarksがrenderされる
5. 3つ以上のenvironment interactionがcanonical Actionで動く
6. 奥の未実装高所境界が自然に処理される
7. highlandからfieldへ安全に戻れる
8. Tap Anywhere / Dynamic Touch / fullscreen regressionなし
9. existing story/save regressionなし
10. JavaScript/static/add-on/browser regression PASS
11. Pages deploy SUCCESS

## AUTOMATED / PUBLIC VERIFICATION

- Requirement registration checkpoint: `235014265d0de6191b6f13670484e4268140d2bb`.
- Highland implementation checkpoint: `f44f3c3092b1dd818d8450396cefb7b48119889d`.
- Dedicated assembled-browser acceptance checkpoint: `c65486ad069e1df8741fe00ef3cf7b79f0c5b11c`.
- Pre-public coordinate audit verified field trailhead `(19,14)`, highland spawn `(9,14)`, field return `(18,14)`, map row widths, and NPC non-overlap before runtime publication.
- Pages workflow run `34004585120`: SUCCESS through sequential JavaScript validation, collision-safe add-ons, static regression, add-on contract, PWA/assets, approved Luke art, assembled browser smoke including highland entry/walk/interactions/high-altitude boundary/safe-exit, Dynamic Touch smoke, upload and Pages deploy.
- Runtime acceptance verifies visible field trailhead, canonical Action entry, safe highland spawn, walkability, trail-sign interaction, cairn interaction, collapsed-ridge boundary, safe field return, and status integration.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

## COMPLETION CONDITION

- public Pagesでfield→highland→fieldの往復が成立
- entry / walk / mountain interactions / high-altitude boundary / safe exitがbrowser runtimeで再現可能に検証
- existing gameplay/save/input compatibility維持
- mountain全体完成を偽装しない
- Owner physical iPhone / subjective visual verification前はVERIFYでよい
