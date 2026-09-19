# LUKE QUEST Environment Gateway Request Schema v1

**状態:** DESIGN FROZEN / 実装用schema
**Production:** DISABLED until credential boundary PASS

## Request Envelope

```json
{
  "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
  "request_id": "<globally unique id>",
  "lane_id": "village|castle|dungeon",
  "owner_run_id": "<scheduled run id>",
  "lease_epoch": 0,
  "operation_id": "<stable operation id>",
  "operation_type": "<operation>",
  "expected_lane_head": "<sha-or-null>",
  "expected_target_identity": {
    "target_source_commit_sha": "<sha>",
    "target_blob_sha": "<sha>"
  },
  "payload": {},
  "created_at": "<RFC3339>",
  "request_sha256": "<canonical request hash>"
}
```

## Allowed Operation Types

Initial production allowlist:

- `LEASE_ACQUIRE`
- `LEASE_HEARTBEAT`
- `LEASE_RELEASE`
- `IMPLEMENTATION_FILE_UPDATE`
- `ISSUE_COMMENT`
- `ISSUE_CLOSE`
- `PARENT_PROGRESS_UPDATE`
- `DURABLE_EVIDENCE_PUBLISH`
- `EVIDENCE_ADOPT`

Unknown operation types are Fail Closed.

## Required Fencing

Every mutating operation except the initial successful `LEASE_ACQUIRE` must match:

- active OWNER_RUN_ID
- active LEASE_EPOCH
- unexpired lease
- lane allowlist
- expected implementation HEAD when applicable
- unresolved RESULT_UNKNOWN = none

## Idempotency

`request_id` and `operation_id` are immutable.

Same id + same canonical hash may be replayed for reconciliation.

Same id + different hash is rejected.

`RESULT_CONFIRMATION_REQUIRED` operations are never blindly resent after unknown response.

## Production Lane Allowlist

Village:
- Parent #51
- Children #54–#67
- branch `environment/village`
- control `control/lease-village`

Castle:
- Parent #52
- Children #68–#81
- branch `environment/castle`
- control `control/lease-castle`

Dungeon:
- Parent #53
- Children #82–#95
- branch `environment/dungeon`
- control `control/lease-dungeon`

Durable Evidence:
- branch `evidence/visual-verification`

Canonical #12 / `WORK_PACKET_ROUTER:v1` / grassland are outside this Gateway allowlist.

## Request Lifecycle

`RECEIVED -> PREPARED -> DISPATCHED -> CONFIRMED_APPLIED | CONFIRMED_NOT_APPLIED | RESULT_UNKNOWN | RECONCILIATION_REQUIRED`

Gateway must persist PREPARED before external mutation.

## Adoption Ordering

Evidence path:

`IDENTIFIERS_RESERVED -> DURABLE_STORED_NOT_ADOPTED -> READBACK_VERIFIED -> ADOPTED_CHILD_NOT_CLOSED -> CHILD_CLOSED_PARENT_NOT_ADVANCED -> COMPLETE`

No PASS/close/Parent advance before durable fresh read-back.
