# LUKE QUEST Graphiti Memory Sync Branch

BRANCH_ROLE: DURABLE_MEMORY_SYNC_OUTBOX
BRANCH: memory/luke-visual-rebuild-graphiti
GROUP_ID: luke-quest-visual-rebuild-v1
MERGE_TO_MAIN: NO

このbranchはGraphiti Memory同期イベント専用。
Work SSOT / Current / READY / Authorityの正本ではない。

## Paths

- graphiti-sync/events/<EVENT_ID>.json
- graphiti-sync/receipts/<EVENT_ID>.json

## Rules

- CONTROL_ONLY writer
- event / receiptはappend-only
- 既存EVENT_IDを書き換えない
- Worker A/B/Cは直接書かない
- main / spec branchへmergeしない
- Current / READY / Authorityをここから判定しない
- eventあり + receiptなし = MEMORY_SYNC_PENDING

## Write order

GitHub Work SSOT更新
→ Fresh readback
→ このbranchへevent
→ Fresh readback
→ Graphiti sync
→ Graphiti readback
→ このbranchへreceipt

Graphiti sync失敗時:
- Work SSOTをrollbackしない
- eventを削除しない
- receiptを作らない
