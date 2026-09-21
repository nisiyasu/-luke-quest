# Required Spec Kit Extension / 必要なSpec Kit拡張仕様

## 目的

Spec Kit Coreの `taskstoissues` が生成する平面的なIssue集合を、GitHub nativeのWork Graphへ安全に投影する。

## 責務

Extensionが担当してよいもの:
- Parent IssueへのSub-issues追加
- Issue Dependenciesの登録
- GitHub Projects v2へのIssue追加
- Projects v2 custom fields更新
- tasks.md / issue-map.mdに基づくrelation projection
- dry-run
- drift report
- idempotent replay

Extensionが担当してはいけないもの:
- spec/plan/tasks内容の改変
- Requirement authorityの変更
- Issue本文の意味変更
- acceptance thresholdの緩和
- implementation
- Issue completion truthの製造
- Project statusだけを根拠にIssueをcloseすること

## 入力

- `tasks.md`
- `analyze.md`
- `issue-map.md`
- GitHub repository
- taskstoissuesで作られたIssue番号集合
- Parent Issue番号
- Projects v2 project identity

## 出力

- relation plan
- applied Sub-issues
- applied Dependencies
- Projects v2 item IDs
- field values
- coverage report
- unresolved drift
- replay-safe operation log

## 安全条件

1. **Dry-run first**: apply前にplanned mutationsを一覧化する。
2. **Idempotency**: 同一入力を複数回実行してrelation重複を起こさない。
3. **Fresh read**: mutation直前にIssue state / relation / project itemをfresh取得する。
4. **No delete by default**: 既存relationを勝手に削除しない。差異はdriftとして報告する。
5. **Authority preservation**: GitHub IssuesがWork SSOT。Projects v2は表示面。
6. **Partial failure**: 一部失敗時に成功済みoperationを記録し、再実行で続きから安全に復旧できる。
7. **Coverage**: requirements→tasks→issuesのcoverageが100%でない場合、実装Readyへ進めない。
8. **No orphan**: Parentに属さない実装Issue、Taskへ紐付かないIssue、Issue化されない実装Taskを0件にする。

## Project v2 field候補

- Status
- Priority
- Gate
- Lane
- Work Type
- Owner Attention

## Extension PASS

- Sub-issue graph一致
- Dependency graph一致
- Projects v2 item coverage 100%
- field projection一致
- duplicate relation 0
- orphan issue 0
- orphan task 0
- unresolved mutation failure 0
