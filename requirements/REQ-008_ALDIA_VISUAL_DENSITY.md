# REQ-008 — 王都アルディア PS1初期級 視覚密度強化

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / VISUAL / UX
OWNER_REQUEST: CONFIRMED

## PURPOSE
王都アルディアを、平坦な色タイルと記号中心の仮画面から、初期PlayStation時代の高品質2D JRPGとして「街に来た」と感じられる視覚密度へ段階的に強化する。

既存のゲーム進行、コリジョン、NPC、建物入口、イベント導線を壊さず、まず王都の実プレイ画面を優先する。

## CURRENT PROBLEM
- 基礎MAPは存在し遊べるが、地面・建物・植生が平面的に見えやすい。
- 重要地点の視覚的ヒエラルキーが弱く、王都固有の記憶に残るランドマーク感が不足する。
- タイル記号そのものが作品の最終美術に見えてしまう箇所が残る。

## TARGET
王都画面で最低限、次を視覚的に読み分けられること。

1. 主街道 / 脇道 / 広場
2. 建物の壁・屋根・入口・影
3. 王都らしい石造りの縁取り・舗装差
4. 神殿または王都の主要ランドマークへの自然な視線誘導
5. 木・植栽・街灯・旗・樽・木箱・看板などの環境小物
6. 建物やオブジェクトの接地影
7. 画面端や壁際の単調さを減らす装飾
8. プレイヤー・NPC・出口・入口の可読性

## IMPLEMENTATION POLICY
- fresh HEADの既存MAP座標とcollisionを実装上の正本とする。
- 既存イベント座標を無意味に動かさない。
- 装飾は原則としてcollisionを変えないpresentation layerから始める。
- DOM/JS add-on方式を使う場合も、通常renderで重複ノードを増殖させない。
- iPhoneでスクロールや入力を阻害しない。
- 既存のDynamic Touch Controllerのpointer safetyを壊さない。
- 既存のNPC会話、建物入口、map transitionを壊さない。

## VISUAL LANGUAGE
LUKE QUEST固有の王都として、石・青・銀・金のアクセントを基本にしてよい。王道ファンタジーだが、既存作品の固有デザインやアセットをコピーしない。

装飾は「豪華だから全部置く」ではなく、導線と意味を持たせる。

- 中央/主要街道: 整った舗装、旗、街灯、王都感
- 生活区画: 樽、木箱、看板、植木など生活感
- 神殿側: より清潔・荘厳、青/銀/金のアクセント
- 出口側: 門、石壁、街道への方向感

## LAYERING
可能なら以下の層を意識する。

base terrain
→ road/paving detail
→ architecture
→ environmental props
→ characters
→ foreground/lighting accents
→ HUD

プレイヤーやNPCを装飾で隠しすぎない。

## PERFORMANCE
- 1フレームごとの大量DOM生成禁止。
- renderごとに同じ装飾を無制限追加しない。
- CSS gradient / pseudo-element / cached decoration layerなど軽量手法を優先してよい。
- iPhoneで操作中のカクつきを増やさない。

## REGRESSION REQUIREMENTS
最低限以下を守る。

TEST 1: 王都へ入れる。
TEST 2: 王都から既存出口へ出られる。
TEST 3: NPC会話が従来どおり発火する。
TEST 4: 建物入口が塞がれない。
TEST 5: Dynamic Touch Controllerが装飾に奪われない。
TEST 6: 装飾レイヤーがrenderごとに増殖しない。
TEST 7: プレイヤーが背景へ埋もれない。
TEST 8: iPhone viewportで主要導線が読める。
TEST 9: static/addon/browser regressionが既存基準を維持する。
TEST 10: Pages公開後もJS例外でゲームが停止しない。

## CHECKPOINT PLAN
巨大な一括改造にしない。

Checkpoint A: 王都専用presentation layer / 地面・街道・建物の奥行き
Checkpoint B: ランドマークと環境小物
Checkpoint C: 光・影・foreground polish
Checkpoint D: browser/Pages回帰と管理同期

各checkpointは単独で公開可能な壊れていない状態にする。

## COMPLETION CONDITION
- 王都が平坦な基礎タイルだけに見えない。
- 主街道、建物、主要地点、出口の視覚的階層が明確。
- 複数種類の環境小物と接地/奥行き表現が実画面へ統合済み。
- 既存collision、NPC、入口、transitionを維持。
- touch controllerとの競合なし。
- static/addon/browser regression PASS。
- Pages公開経路PASS。
- Ownerの主観確認が必要な最終美術品質はVERIFYへ残してよい。

## DO NOT REPEAT
- 単なる色変更だけでPS1級と呼ばない。
- 絵文字を増やしただけで環境美術完成としない。
- collisionを無計画に変えない。
- 装飾のために入力を奪わない。
- renderごとにDOMを増殖させない。
- 他作品の固有アートをコピーしない。
