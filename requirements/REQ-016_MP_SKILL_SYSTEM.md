# REQ-016 — MP / BATTLE SKILL SYSTEM

- PRIORITY: P1
- STATUS: IN_PROGRESS
- OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE §§9, 25, 35 / queue selection rule 8
- TYPE: core gameplay / battle readability / persistent character resource

## GOAL
LUKE QUESTの通常戦闘へ、通常攻撃・防御・薬草・逃走とは異なる明確な戦術選択としてMP消費技を導入する。

最初の安全な完成単位では、既存戦闘ロジックを壊さず、ルークに永続MPと1つのオリジナル戦闘技を追加する。

## CANON / SAFETY
- 保護ストーリー設定を追加・変更しない。
- ルークの正式ビジュアルを変更しない。
- 既存の attack / guard / potion / runAway を削除しない。
- 既存の敵HP・報酬・遭遇・勝利・敗北処理を維持する。
- 既存save `lukeQuestV2` を壊さず、MPフィールドが無い旧saveをruntime migrationする。
- 並行inventory authorityを作らない。

## INITIAL SYSTEM
### Resource
- `s.mp`: current MP
- `s.mmp`: max MP
- 初期値: MP 10 / 10
- 旧saveで未定義なら安全に初期化する。

### Skill
- 名称: `蒼閃`
- 消費MP: 4
- 単体攻撃技。
- 通常攻撃より明確に強いが、乱用できない有限リソースとする。
- ダメージは既存 `s.atk` / `s.lv` を基礎にし、敵HPをcanonical `s.ehp` で減らす。
- 敵撃破時は既存 `win()` を使用する。
- 非撃破時は既存 `enemyTurn()` を使用する。
- MP不足時は消費せず敵ターンへ渡さず、battle logへ不足を表示する。

## UI
- world/status HUDにMP current/maxを読みやすく表示する。
- battle command panelに `蒼閃 4MP` ボタンを追加する。
- iPhone tap targetを既存 `.btn` と同等以上に保つ。
- MP不足時もボタンを消さず、何が不足しているか分かる表示にする。

## RECOVERY
- level up時にmax MPを少量成長させ、HPと同様にMPを全回復する。
- battle defeat / 王都への復帰時はMPを全回復して詰みを防ぐ。
- 既存宿屋回復add-onと安全に共存できるよう、将来の宿屋統合を阻害しない。

## VERIFICATION
Automated verification must cover at least:
1. add-on syntax passes
2. old save without MP migrates safely
3. MP fields are finite and clamped
4. status/battle UI exposes MP
5. skill costs exactly 4 MP
6. insufficient MP does not spend MP or trigger enemy turn
7. successful skill damages `s.ehp`
8. skill defeat path delegates to `win()`
9. non-defeat path delegates to `enemyTurn()`
10. existing battle commands remain present
11. Pages assembly/browser smoke remains green

## COMPLETION
- implementation committed to default branch
- automated contracts / existing regression pass
- GitHub Pages deployment succeeds
- requirement moves to VERIFY, because final iPhone subjective combat feel is Owner-side

## DO NOT CLAIM
- physical iPhone PASS without Owner check
- full magic system complete from one skill
- final combat balance complete from this initial checkpoint
