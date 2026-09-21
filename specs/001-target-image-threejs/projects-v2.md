# GitHub Projects v2 Projection / 管理表示設計

## 目的

GitHub IssuesをWork SSOTとして維持したまま、OwnerとAgentが現在地・Ready・Blocked・Reviewを見やすくする。

## Fields

### Status
- Backlog
- Ready
- In Progress
- Review
- Blocked
- Done

### Priority
- P0
- P1
- P2

### Gate
- G0
- G1
- G2
- G3
- G4
- G5
- G6
- G7
- WorkGraph
- Converge

### Lane
- Visual Rebuild

### Work Type
- Planning
- Infrastructure
- Scene
- Art
- Runtime
- Verification
- Management

### Owner Attention
- No
- Review
- Decision Required

## Views
1. **今やる / Ready**: Status=Ready
2. **実行中**: In Progress
3. **ブロック**: Blocked
4. **レビュー**: Review
5. **Gate別**: Gate grouping
6. **Owner確認**: Owner Attention != No
7. **完了**: Done

## Completion authority

ProjectのStatus=DoneだけではIssue完了を成立させない。
Issue acceptance + required evidence + PR/Test/Review/Mergeがcompletion truth。
