# REQ-009 — 王都近郊 / 森 PS1初期級 視覚密度強化

STATUS: VERIFY
PRIORITY: P2
TYPE: WORLD / VISUAL / EXPLORATION / UX
OWNER_REQUEST: CONFIRMED

## PURPOSE
王都近郊から魔物の森へ進む序盤の探索画面を、平坦な緑床・単純な木記号の印象から、初期PlayStation時代の高品質2D JRPGとして進行方向・地域差・探索感が視覚で伝わる密度へ段階強化する。

既存collision、エンカウント、NPC、痕跡イベント、マップ遷移、Dynamic Touch Controllerを壊さない。

## FRESH BASELINE
既存実装にはすでに以下のpresentation add-onが存在するため、同じものを無意味に作り直さない。

- `addons/field-roadside-details.js`: 柵、道標、花、小石
- `addons/forest-ground-details.js`: 森地面の既存ディテール
- `addons/footstep-particles.js`
- `addons/field-wayfarer-shrine.js`
- `addons/forest-hidden-clearing.js`
- その他fresh HEADで存在する地域別add-on

REQ-009はこれらを基礎として、地域全体の視覚階層と方向誘導を一段上げる。

## TARGET — 王都近郊
最低限、文字を読まなくても次が分かる状態へ寄せる。

1. 王都へ戻る方向
2. 魔物の森へ向かう方向
3. 主街道と脇の草地
4. 草の濃淡・踏み跡・土の露出
5. 岩、小石、花、低木、柵など複数の環境要素
6. 木陰・接地影
7. 街道沿いの意味あるランドマーク
8. マップ端の単調さ軽減

## TARGET — 魔物の森 / 深部
最低限、次の差を視覚化する。

1. 森入口はまだ外光が入り、比較的読みやすい
2. 深部は暗く、木陰と密度が増す
3. 細い踏み跡と小さな開けた場所が読める
4. 落ち葉、倒木、根、苔、岩など複数の地表要素
5. 痕跡イベントが背景に埋もれない
6. 北へ進む方向や重要出口が装飾に負けない
7. 光が差す場所と暗い場所のコントラスト

## IMPLEMENTATION POLICY
- collision/map tile/event座標はfresh HEADを正本とする。
- presentation-only layerを優先し、装飾でcollisionを変更しない。
- pointer-events:noneを基本にし、touch controllerの入力を奪わない。
- renderごとに装飾DOMを増殖させない。
- 既存の地域add-onと重複する要素は、追加価値がある場合だけ強化する。
- 既存の王都REQ-008用CSSを他マップへ漏らさない。
- iPhone portrait viewportで主人公・NPC・出口・痕跡を読み取れる密度を維持する。

## VISUAL LANGUAGE
### 王都近郊
- 明るい草地
- 王都から延びる整った街道
- 使われている柵・道標
- 花、低木、小石
- 遠景方向を感じる地面差

### 魔物の森入口
- 緑は濃いが外光あり
- 木漏れ日
- 葉・根・落ち枝
- 道幅が狭まる

### 深部
- 青緑 / 深緑 / 暗色
- 太い根・倒木・苔
- 光のスポット
- 霧への接続を予感させる冷たい色

## PERFORMANCE
- 1 frameごとの大量DOM生成禁止。
- map再render時はanchor/guardで重複を防止。
- CSS gradient / pseudo element / cached decorative nodesを優先してよい。
- アニメーションは必要最小限。常時大量particleは禁止。

## REGRESSION REQUIREMENTS
TEST 1: 王都↔王都近郊の既存transitionが維持される。
TEST 2: 王都近郊→魔物の森の既存勝利条件/入口が維持される。
TEST 3: 魔物の森→深部の既存transitionが維持される。
TEST 4: NPC/痕跡会話が従来どおり発火する。
TEST 5: encounter処理を変更しない。
TEST 6: Dynamic Touch Controllerが装飾に奪われない。
TEST 7: decorationがrenderごとに重複増殖しない。
TEST 8: 主人公・NPC・出口が背景へ埋もれない。
TEST 9: static/addon/browser regression PASS。
TEST 10: Pages公開後にJS runtime errorなし。

## CHECKPOINT PLAN
Checkpoint A: 王都近郊の街道・地面階層・王都/森方向誘導
Checkpoint B: 魔物の森入口の木陰・地表・木漏れ日
Checkpoint C: 深部の暗さ・根/倒木・光スポット・霧方向の予感
Checkpoint D: browser/Pages回帰と管理同期

## IMPLEMENTED CHECKPOINTS

### Checkpoint A — COMPLETE
Commit: `e76e46c0e2e5b03117b8ee86ee9649d29ee25670`
File: `addons/field-route-hierarchy.js`

Added without collision changes:
- capital-side stone paving
- maintained route from the south gate toward the northeast forest gate
- visually distinct route segments rather than another flower/fence duplicate pass
- townward and forestward direction stones
- low shrubs and forest-gate verge darkening
- field-specific ground hierarchy

### Checkpoint B — COMPLETE
Commit: `0079e23aa34bae1c41ac7014b0be8c303b7629e8`
File: `addons/forest-light-depth.js`

Added without duplicating the existing logs/mushrooms/stones/leaves layer:
- readable entrance glow near the south entry
- narrowing forest trail
- root crossings and fern clusters
- canopy shade
- two subtle sunshafts
- forest-specific ground treatment

### Checkpoint C — COMPLETE
Commit: `e12d472d6f8575334e62cc67ba1690ba200f4354`
File: `addons/deep-forest-depth.js`

Added:
- colder/darker deep-forest ground treatment
- northward cold trail
- root masses, moss patches and dead branches
- two light pools
- northern mist hint
- deeper edge darkness

### Checkpoint D — AUTOMATED PASS / OWNER VISUAL VERIFY REMAINS
GitHub Pages workflow run `33981010791` completed successfully on commit `e12d472d6f8575334e62cc67ba1690ba200f4354`.

The workflow passed collision-safe add-on syntax validation, static regression, add-on contract, PWA and raster validation, assembled-game browser smoke, site upload and GitHub Pages deploy.

Owner physical iPhone / subjective final-art-quality confirmation is not claimed, so this requirement remains `VERIFY` rather than `DONE`.

## COMPLETION CONDITION
- 王都近郊が単なる緑床に見えない。
- 王都方向と森方向が視覚的に読みやすい。
- 森入口と深部の地域差が明確。
- 複数種類の地表・植生・影・ランドマークが統合済み。
- 既存collision/event/encounter/transitionを維持。
- touch controllerとの競合なし。
- static/addon/browser regression PASS。
- Pages公開経路PASS。
- Ownerの主観的最終美術品質確認はVERIFYへ残してよい。

## DO NOT REPEAT
- 既存`field-roadside-details.js`の内容を名前だけ変えて再実装しない。
- 単なる色変更だけで完成扱いしない。
- 木の絵文字を増やしただけで森密度完成としない。
- collisionを装飾目的で無計画に変えない。
- 痕跡/NPC/出口を装飾で隠さない。
- 他作品固有アートをコピーしない。
