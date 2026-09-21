# Work Graph Contract / 作業グラフ契約

## Authority
- GitHub Issues: Work SSOT
- Sub-issues: 縦方向の分解
- Issue Dependencies: 横方向の依存
- GitHub Projects v2: 状態・担当・優先度・Gateの管理表示
- Spec Kit artifacts: 要件/計画/タスクのcompile source
- PR/Commit/CI/Evidence: 実装証拠
- Converge extension: 完成実装とSpec/Plan/Tasksの最終収束確認

## Rules
1. taskstoissues後にIssue hierarchyを構築する。
2. Parent Issueは製品成果/垂直スライスを表す。
3. Sub-issueはGateまたは独立Work Unitを表す。
4. Dependenciesは`blocked by / blocks`としてGitHub nativeへ投影する。
5. Projects v2はIssueのWork authorityを上書きしない。
6. 実装AgentはReady Issueをpullし、未Issue化の仕事を勝手に発明しない。
7. PASS条件とEvidenceを満たさないIssueをDoneにしない。
