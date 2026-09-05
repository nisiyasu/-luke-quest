# REQ-018 — AZURE SLASH VISUAL FEEDBACK

- PRIORITY: P2
- STATUS: VERIFY
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
3. success effect only when canonical battle log confirms 蒼閃 execution
4. insufficient MPではsuccess slashを発火しない
5. effect nodes use pointer-events:none
6. reduced-motion guard present
7. transient nodes self-remove
8. no combat numeric fields mutated by this add-on
9. static/addon/browser/touch/Pages pipeline green

## IMPLEMENTATION CHECKPOINTS
- Requirement definition: `f9030145e61e63b58ce77504e888b65642c13f37`
- Presentation implementation: `7297bbdd01e712cd7123c9c1fe3d1822bcfaad94`
- Queue registration: `3152b9189c77b3533f0060c0adbf3131289ad7d0`
- Explicit regression contract: `37e447e38b951b1817cc9bdc5bdb9353e5cdb361`

## AUTOMATED VERIFICATION RESULT
- GitHub Pages workflow run `33993208928`: SUCCESS.
- add-on syntax and isolation: PASS.
- base Azure Slash delegation: PASS.
- canonical battle-log success/insufficient branch detection: PASS.
- presentation-only numeric-state guard: PASS.
- pointer passthrough / reduced-motion / transient cleanup contracts: PASS.
- assembled browser smoke: PASS.
- floating touch pointer-drag smoke: PASS.
- artifact upload and Pages deployment: PASS.
- physical iPhone / subjective visual feel remains Owner-side and is not claimed.

## COMPLETION
- implementation + regression contract committed: SATISFIED
- latest Pages SUCCESS: SATISFIED
- state: VERIFY pending Owner subjective/iPhone presentation check
