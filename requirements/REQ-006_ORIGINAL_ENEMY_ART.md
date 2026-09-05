# REQ-006 — Replace Enemy Emoji With Original Battle Art

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: VISUAL / BATTLE / ORIGINAL_ASSET
OWNER_REQUEST: PRESERVED

## PURPOSE
Replace normal battle enemy emoji with LUKE QUEST original battle artwork so standard encounters no longer present emoji as final-quality enemy graphics.

## SCOPE
The current normal encounter pools contain 18 named enemies across field, forest, deep forest, mist trail, observation area and evacuation route. REQ-006 covers those normal enemies. Existing dedicated optional-boss artwork is preserved and must not be replaced by the generic system.

## VISUAL TARGET
- Original LUKE QUEST artwork only.
- No copied game/anime/IP artwork.
- No emoji as the visible final battle enemy.
- Large readable silhouette on iPhone.
- Early-PS1-era 2D JRPG presentation: layered silhouette, highlights/shadows, regional palette cues, grounding shadow and readable face/attack features.
- Regional progression must be visible: field creatures brighter/simpler; forest creatures moss/wood tones; deep/mist creatures stranger/darker; military-route creatures harder/armored.

## IMPLEMENTATION ARCHITECTURE
Prefer a collision-safe add-on rather than rewriting the battle core unless core changes are necessary.

The art layer must:
1. identify the active enemy by canonical `s.enemy.n`;
2. replace only the normal enemy visual surface inside `.enemySpriteStage .enemy` or `.enemy` as supported by current assembled UI;
3. leave enemy name, HP, battle logic, attacks, rewards and AI untouched;
4. preserve optional boss dedicated art and unknown/smoke enemies;
5. safely re-apply after battle re-render without duplicating DOM;
6. expose a small runtime status/contract marker for regression inspection.

## REQUIRED ENEMIES
Field:
- ぷるぷるスライム
- ツノウサギ
- 闇カラス

Forest:
- 苔むしコウモリ
- 森グモ
- 木霊ウルフ

Deep forest:
- 霧まといキツネ
- 樹皮トカゲ
- 夜歩きフクロウ

Mist trail:
- 霧喰いヤマネコ
- 灰羽トンビ
- 泥鎧イノシシ

Observation:
- 灰爪ハウンド
- 監視フクロウ
- 黒甲ムカデ

Evacuation route:
- 崖ネズミ
- 石羽コンドル
- 退避路オオカミ

## SAFETY
- Never change stats/rewards merely to support artwork.
- Never replace the optional forest boss dedicated SVG.
- Never cause battle rendering to fail when an unknown enemy is used by runtime smoke tests or future content.
- Unknown enemy: leave the pre-existing representation intact until formal artwork is registered.
- Re-rendering must not create stacked duplicate art nodes.
- Wound/impact/foreground/focus battle add-ons must continue to work.

## CHECKPOINTS
A. Add original-art registry + renderer for all 18 normal enemies.
B. Integrate safely with assembled battle DOM and re-render path.
C. Add regression/contract coverage proving known enemies receive original art and unknown enemies are not hijacked.
D. Pages/browser CI pass.

## COMPLETION CONDITION
Move to VERIFY when:
- all 18 listed enemies have distinct registered original vector/raster presentations;
- normal battle visible enemy surface is no longer emoji for those 18;
- optional boss and unknown test enemy paths remain intact;
- static/add-on validation succeeds;
- browser/Pages workflow succeeds;
- fresh HEAD confirms the integration.

Owner subjective/iPhone visual approval may remain pending in VERIFY and must not block independent work.

## DO NOT REPEAT
- Do not call emoji final artwork.
- Do not replace one emoji with another icon/font glyph.
- Do not use copyrighted third-party character art.
- Do not break battle mechanics while changing presentation.
- Do not overwrite dedicated boss art with the generic registry.
