# REQ-018 — AZURE SLASH VISUAL FEEDBACK

- PRIORITY: P2
- STATUS: IN_PROGRESS
- OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE §§25, 28, 48, 59 / queue selection rule 8
- DEPENDS_ON: REQ-016
- TYPE: battle presentation / player feedback

## GOAL
REQ-016で導入したMP技「蒼閃」を、通常攻撃と視覚的に区別できる専用戦闘フィードバックへ強化する。

## SCOPE
- 蒼閃成功時のみ青系の斬撃エフェクトをbattle sceneへ表示する。
- 敵表示へ短いflash/shakeを与える。
- MP表示へ短い消費pulseを与える。
- MP不足時は成功エフェクトを出さず、不足フィードバックだけを表示する。
- animationは短時間・pointer-events:noneで、入力をブロックしない。
- prefers-reduced-motionでは過剰なmotionを抑える。

## SAFETY
- 蒼閃のdamage/cost/balanceを変更しない。
- `window.lqUseAzureSlash` をwrapし、base functionへ必ずdelegateする。
- canonical battle stateを新規に作らない。
- 敵画像・背景・既存hit effectを破壊しない。
- story/canon変更なし。

## VERIFICATION
1. strict/IIFE/syntax pass
2. base Azure Slash function delegated
3. success effect only when MPが実際に消費された時に発火
4. insufficient MPではsuccess slashを発火しない
5. effect nodes use pointer-events:none
6. reduced-motion guard present
7. transient nodes self-remove
8. no combat numeric fields mutated by this add-on
9. static/addon/browser/touch/Pages pipeline green

## COMPLETION
- implementation + regression contract committed
- latest Pages SUCCESS
- move to VERIFY pending Owner subjective/iPhone presentation check
