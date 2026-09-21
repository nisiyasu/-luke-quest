# 最新現状開発手順 v1 / LUKE Visual Rebuild

このfeatureの正式工程を以下に固定する。

## A. 前段設計
1. Owner要望・Reference画像
2. 要件定義
3. 敵対レビュー / 穴埋め
4. Owner-approved baseline / FREEZE候補
5. `speckit.constitution`
6. `speckit.specify`
7. `speckit.clarify`
8. `speckit.plan`
9. `speckit.checklist`
10. `speckit.tasks`
11. `speckit.analyze`

## B. Task→GitHub Work Graph移行
12. `speckit.taskstoissues`
13. Parent Issue作成
14. GitHub Sub-issues / サブイシューで縦方向分解
15. GitHub Issue Dependencies / イシュー依存関係で横方向依存を登録
16. GitHub Projects v2へ投影
17. Projects v2 fields / views / Ready条件を設定
18. Requirement→Spec→Plan→Task→Issue coverage監査

## C. 必要なSpec Kit Extension
19. Coreだけでは表現できないGitHub native投影をExtensionとして定義する
20. ExtensionはSub-issues / Dependencies / Projects v2投影を自動化してよいが、IssueをWork SSOTとするauthorityを変更しない
21. Extensionの入力・出力・idempotency・dry-run・再実行性を検証する
22. ExtensionによるIssue Graphがtasks.md / analyze.mdと100%整合することを確認する

## D. Agent実装
23. Ready IssueをAgentがpull
24. claim / lease / branch・worktree分離
25. implementation
26. tests
27. visual/performance evidence
28. review
29. fix loop
30. PR
31. merge
32. Issue close / Parent progress

## E. Converge / 最終収束
33. `speckit.converge`
34. Source Requirement→Spec→Plan→Tasks→Issues→Implementation→Evidenceの収束監査
35. drift / missing implementation / orphan task / orphan issue / false PASSを0件化
36. 不足があればTask追加→Issue追加→再実装
37. 再Converge
38. Owner final gate

## Authority
- GitHub Issues: Work SSOT
- Sub-issues: vertical decomposition
- Issue Dependencies: horizontal dependency
- Projects v2: management/control view
- PR/Commit/CI/Evidence: implementation truth
- Spec Kit artifacts: planning/decomposition source
- Converge: final consistency/coverage extension

## 補助
GitHub Copilot Project Planningは、Spec Kit後の細分化補助として利用可能。ただしSpec Kit artifacts / GitHub native relationsを上書きする正本にはしない。

## Current execution boundary / 今回の停止点

Owner指示により、この実行は **Step 22: ExtensionによるIssue Graphがtasks.md / analyze.mdと100%整合することの確認** まで進める。

- Step 23以降のAgent実装はこの実行では開始しない。
- 旧視覚実装の削除、implementation branchでのゲームコード変更も開始しない。
- Archive/rebuild方針は設計・Issueへ固定するが、実際の削除は実装フェーズ開始時にrollback point確認後に行う。
