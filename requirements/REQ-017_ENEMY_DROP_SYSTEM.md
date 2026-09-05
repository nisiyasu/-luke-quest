# REQ-017 — ENEMY DROP / BATTLE LOOT SYSTEM

- PRIORITY: P1
- STATUS: VERIFY
- OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE §§28, 35, 48 / queue selection rule 8
- TYPE: core gameplay / battle rewards / inventory loop

## GOAL
通常戦闘の勝利報酬をEXP/Gだけで終わらせず、既存canonical inventoryへ接続された敵ドロップを導入する。

戦闘 → 戦利品 → 次の探索/戦闘で使用、というJRPGの循環を強化する。

## SAFETY / AUTHORITY
- 既存 `win()` のEXP/G/level-up/勝利会話を保持する。
- 敵HP、攻撃力、遭遇率、既存Gold報酬は変更しない。
- 新しい並行inventory authorityを作らない。
- 使用可能な既存canonical consumable `s.potions` / `s.smokeBombs` のみを初期ドロップ対象にする。
- 保護ストーリー設定を追加・変更しない。
- optional bossや未知敵を壊さない。

## INITIAL DROP TABLE
通常敵18種を地域ごとに安全なドロップ群へ割り当てる。

### Field
- ぷるぷるスライム / ツノウサギ / 闇カラス
- 薬草の小確率ドロップ

### Forest / Deep Forest
- 森・深部の通常敵6種
- 薬草を中心に、深部の一部のみ煙玉の低確率ドロップ

### Mist / Observation / Evac Route
- 後半通常敵9種
- 薬草または煙玉を低〜中確率でドロップ

確率は戦闘経済を壊さない範囲にする。Goldを追加で水増ししない。

## PRESENTATION
- ドロップした場合、既存勝利後dialogueへ戦利品行を追加する。
- 例: `戦利品：薬草 ×1`
- 何も落ちなかった場合に余計な失敗文を表示しない。
- inventory更新後にsaveする。

## IMPLEMENTATION STRATEGY
- collision-safe isolated add-onとして `win()` をwrapする。
- base `win()` 実行前に倒した敵名をcaptureする。
- base `win()` がcanonical victory処理を終えた後にdropをrollする。
- drop成功時だけcanonical inventoryへ加算し、dialogueへ追記してsave/renderする。
- 未登録敵はdropなしで既存挙動へ完全fallbackする。

## VERIFICATION
1. add-on strict/IIFE/syntax passes
2. 18 normal enemies are explicitly registered
3. duplicate enemy registry names are forbidden
4. only canonical `s.potions` / `s.smokeBombs` are mutated
5. base `win()` remains delegated
6. unknown enemy fallback exists
7. drops are bounded to +1 per victory in initial implementation
8. no extra Gold mutation exists
9. successful drop calls save
10. victory dialogue receives loot line only on success
11. existing static/addon/browser/touch/Pages pipeline remains green

## IMPLEMENTATION CHECKPOINTS
- Requirement definition: `0cc3f5b89fecb6de25132e18c69393fb04220baa`
- Queue registration: `0a271f16add8cfafa4fb0d110f6aac3c7dfd4886`
- Runtime implementation: `6ebd89af5d291888e846abb33e3e62762fe3c058`
- Explicit regression-contract checkpoint: `9df98dd25bb55da81780e0a1c8d18ec133fe3526`

## AUTOMATED VERIFICATION RESULT
- GitHub Pages workflow run `33993065410`: SUCCESS.
- 18 normal enemies explicitly covered by regression guard: PASS.
- canonical potion/smoke inventory only: PASS.
- unknown enemy fallback / base win delegation / +1 cap / no Gold mutation contracts: PASS.
- sequential syntax, all add-on syntax, static/add-on contracts: PASS.
- assembled browser smoke and floating-touch smoke: PASS.
- artifact upload and Pages deployment: PASS.
- subjective drop frequency/economy feel and physical iPhone feel remain Owner-side and are not claimed.

## COMPLETION
- implementation checkpoint committed: SATISFIED
- explicit regression contract added: SATISFIED
- latest Pages workflow SUCCESS: SATISFIED
- state: VERIFY pending Owner subjective balance/feel confirmation

## DO NOT CLAIM
- final economy balance complete
- physical iPhone PASS without Owner check
- complete crafting/material system
