# Taskstoissues Migration Audit / タスク→Issue移行監査

## 方針

1. `tasks.md`をSpec Kit Coreのtaskstoissuesへ投入する。
2. 生成Issueをそのまま実装開始にはしない。
3. Task IDをIssue本文に保存する。
4. Parent/Sub-issue/Dependency/Projects v2投影後にcoverageを再監査する。
5. AnalyzeでCRITICAL/HIGH/MEDIUM findingが残る場合、Ready化しない。

## 必須Trace fields
各Issue本文へ最低限:
- FEATURE_REF
- TASK_IDS
- SOURCE_REQUIREMENTS
- GATE
- ACCEPTANCE
- EVIDENCE_REQUIRED
- BLOCKED_BY
- BLOCKS
- SPEC_REF
- PLAN_REF
- TASKS_REF

## Migration PASS
- task coverage: 100%
- requirement coverage: 100%
- duplicate task ownership: 0
- orphan implementation task: 0
- orphan issue: 0
- dependency cycle: 0
- Parent coverage: 100%
