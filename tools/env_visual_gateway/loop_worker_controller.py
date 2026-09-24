from __future__ import annotations

import copy
import json
from dataclasses import dataclass
from typing import Callable, Any

try:
    from . import fenced_gateway as gw
except ImportError:
    import fenced_gateway as gw


class RecoveryControllerError(RuntimeError):
    pass


@dataclass(frozen=True)
class RecoveryOutcome:
    status: str
    owner_run_id: str
    claim_generation: int
    patchset_status: str | None = None
    applied_head: str | None = None
    completion_status: str | None = None


def _request_hash(req: dict) -> str:
    normalized = dict(req)
    normalized["request_sha256"] = ""
    return gw.sha256_text(gw.canonical(normalized))

def _base_request(
    source: dict,
    *,
    request_id: str,
    owner_run_id: str,
    operation_type: str,
    expected_head: str | None,
    payload: dict,
    work_context: dict | None = None,
) -> dict:
    req = {
        "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id": request_id,
        "lane_id": source["lane_id"],
        "owner_run_id": owner_run_id,
        "lease_epoch": 0,
        "operation_id": request_id + "-op",
        "operation_type": operation_type,
        "expected_lane_head": expected_head,
        "expected_target_identity": copy.deepcopy(
            source["expected_target_identity"]
        ),
        "payload": payload,
        "created_at": gw.now_rfc3339(),
        "request_sha256": "",
    }
    if work_context is not None:
        req["work_context"] = work_context
    req["request_sha256"] = _request_hash(req)
    return req

def build_recovery_patchset(
    old_draft: dict,
    claim: dict,
    *,
    request_id: str,
    expected_head: str,
) -> dict:
    if old_draft.get("operation_type") != "IMPLEMENTATION_PATCHSET":
        raise RecoveryControllerError(
            "durable recovery source is not IMPLEMENTATION_PATCHSET"
        )
    old_payload = copy.deepcopy(old_draft.get("payload") or {})
    files = old_payload.get("files")
    if not isinstance(files, list) or not files:
        raise RecoveryControllerError("old patchset bytes are missing")

    payload = old_payload
    payload["issue_number"] = claim["ISSUE"]
    payload["task_id"] = claim["TASK_ID"]
    payload["worker_id"] = claim["WORKER_ID"]
    payload["claim_generation"] = int(claim["CLAIM_GENERATION"])
    payload["recovery_of_operation_id"] = old_draft["operation_id"]
    payload["recovery_of_request_sha256"] = old_draft["request_sha256"]
    payload["commit_message"] = str(
        payload.get("commit_message")
        or f"{claim['TASK_ID']}: recovered patchset"
    )

    operation_id = request_id + "-op"
    work_context = {
        "issue_number": claim["ISSUE"],
        "task_id": claim["TASK_ID"],
        "worker_id": claim["WORKER_ID"],
        "owner_run_id": claim["OWNER_RUN_ID"],
        "claim_generation": int(claim["CLAIM_GENERATION"]),
        "operation_id": operation_id,
        "work_phase": "PATCHSET_SUBMITTED",
        "submitted_payload_reference": (
            f"inbox/{old_draft['lane_id']}/{request_id}.json"
        ),
        "expected_head": expected_head,
        "last_progress_at": gw.now_rfc3339(),
        "next_recovery_action": "RECONCILE_PATCHSET_RECEIPT",
        "recovery_source_reference": old_draft.get(
            "work_context", {}
        ).get("submitted_payload_reference"),
    }
    return _base_request(
        old_draft,
        request_id=request_id,
        owner_run_id=claim["OWNER_RUN_ID"],
        operation_type="IMPLEMENTATION_PATCHSET",
        expected_head=expected_head,
        payload=payload,
        work_context=work_context,
    )

def build_completion_request(
    source: dict,
    claim: dict,
    *,
    request_id: str,
    exact_head: str,
    acceptance: dict,
    summary: str,
) -> dict:
    payload = {
        "issue_number": claim["ISSUE"],
        "task_id": claim["TASK_ID"],
        "worker_id": claim["WORKER_ID"],
        "claim_generation": int(claim["CLAIM_GENERATION"]),
        "exact_head": exact_head,
        "acceptance": acceptance,
        "summary": summary,
    }
    operation_id = request_id + "-op"
    work_context = {
        "issue_number": claim["ISSUE"],
        "task_id": claim["TASK_ID"],
        "worker_id": claim["WORKER_ID"],
        "owner_run_id": claim["OWNER_RUN_ID"],
        "claim_generation": int(claim["CLAIM_GENERATION"]),
        "operation_id": operation_id,
        "work_phase": "COMPLETION_SUBMITTED",
        "submitted_payload_reference": (
            f"inbox/{source['lane_id']}/{request_id}.json"
        ),
        "expected_head": exact_head,
        "last_progress_at": gw.now_rfc3339(),
        "next_recovery_action": "RECONCILE_TASK_COMPLETE",
    }
    return _base_request(
        source,
        request_id=request_id,
        owner_run_id=claim["OWNER_RUN_ID"],
        operation_type="TASK_COMPLETE",
        expected_head=exact_head,
        payload=payload,
        work_context=work_context,
    )


def build_work_supply_request(
    source: dict,
    *,
    request_id: str,
    owner_run_id: str,
    mode: str = "FULL",
) -> dict:
    return _base_request(
        source,
        request_id=request_id,
        owner_run_id=owner_run_id,
        operation_type="WORK_SUPPLY_RECONCILE",
        expected_head=None,
        payload={"mode": mode},
    )


# --------------------------------------------------------------------------
# Worker lifecycle decision
#
# A scheduled run is one controller iteration over durable Work state.  The
# decision below is the whole lifecycle contract in executable form:
#
# * Draft / canonical Request / pending Receipt / no Receipt are NONTERMINAL.
#   The run keeps polling the same request_id; it never ends there.
# * A terminal Receipt is consumed in the same run.
# * READY == 0 is never a reason to disable a Worker.  Missing leaves become
#   a WORK_SUPPLY_RECONCILE request; work owned by others is a quiet wait;
#   only capability/Owner gates and spec drift are reported to the Owner.
# * No decision ever returns a self-disable.
# --------------------------------------------------------------------------

SELF_DISABLE_PERMITTED = False

NONTERMINAL_REQUEST_STAGES = {"DRAFT", "REQUEST", "PENDING", "NO_RECEIPT"}
TERMINAL_REQUEST_STAGES = {"TERMINAL_OK", "TERMINAL_REJECTED"}

# Actions after which the run keeps working in the same process.
CONTINUE_ACTIONS = {
    "WAIT_FOR_RECEIPT",
    "ADVANCE_AFTER_RECEIPT",
    "REPAIR_AFTER_REJECTED_RECEIPT",
    "CONTINUE_OWNED_CLAIM",
    "RENEW_OWNED_CLAIM",
    "TAKEOVER_STALE_CLAIM",
    "CLAIM_READY_LEAF",
    "REQUEST_WORK_SUPPLY_RECONCILE",
}
# Actions that end this run; the schedule stays enabled.
RUN_END_ACTIONS = {
    "CHECKPOINT_BEFORE_BUDGET_EXHAUSTED",
    "WAIT_FOR_UPSTREAM_IN_PROGRESS",
    "OWNER_GATE_CAPABILITY",
    "OWNER_GATE_ESCALATED",
    "OWNER_GATE_SPEC_DRIFT",
    "OWNER_GATE_CONTROL_PLANE_ANOMALY",
    "PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE",
}

NEXT_AFTER_RECEIPT = {
    "WORK_CLAIM_ACQUIRE": "EXECUTE_TASK",
    "WORK_CLAIM_TAKEOVER": "RESUME_FROM_NEXT_RECOVERY_ACTION",
    "WORK_CLAIM_RENEW": "RESUME_CURRENT_PHASE",
    "IMPLEMENTATION_PATCHSET": "RUN_ACCEPTANCE_EVALUATOR_ON_APPLIED_HEAD",
    "TASK_COMPLETE": "CONFIRM_CLAIM_RELEASED_THEN_SELECT_NEXT",
    "WORK_CLAIM_RELEASE": "SELECT_NEXT",
    "WORK_SUPPLY_RECONCILE": "RESELECT_READY",
    "EVIDENCE_ADOPT": "SUBMIT_TASK_COMPLETE",
}

CHECKPOINT_RESERVE_SECONDS = 240
RENEW_WINDOW_SECONDS = 600
MIN_BUDGET_FOR_NEW_CLAIM_SECONDS = 900


@dataclass(frozen=True)
class Decision:
    action: str
    reason: str
    issue: int | None = None
    task_id: str | None = None
    request_id: str | None = None
    owner_run_id: str | None = None
    next_step: str | None = None
    detail: tuple = ()

    @property
    def ends_run(self) -> bool:
        return self.action in RUN_END_ACTIONS

    @property
    def self_disable(self) -> bool:
        return False

    def as_dict(self) -> dict:
        return {
            "action": self.action,
            "reason": self.reason,
            "issue": self.issue,
            "task_id": self.task_id,
            "request_id": self.request_id,
            "owner_run_id": self.owner_run_id,
            "next_step": self.next_step,
            "detail": list(self.detail),
            "ends_run": self.ends_run,
            "self_disable": False,
        }


def _ts(value: Any) -> float | None:
    try:
        return gw.parse_time(value)
    except Exception:
        return None


def claim_is_stale(claim: dict, now: float) -> bool:
    until = _ts(claim.get("CLAIM_UNTIL"))
    progress = _ts(claim.get("PROGRESS_DEADLINE_AT"))
    return (
        claim.get("CLAIM_STATUS") != "ACTIVE"
        or (until is not None and until <= now)
        or (progress is not None and progress <= now)
    )


def _task_num(task_id: str) -> int:
    try:
        return int(str(task_id)[1:])
    except ValueError:
        return 10**6


def select_ready(ready: list[dict], rank: int) -> dict:
    ordered = sorted(ready, key=lambda x: _task_num(x["task_id"]))
    index = rank - 1
    return ordered[index] if 0 <= index < len(ordered) else ordered[0]


def decide_next_action(snapshot: dict) -> Decision:
    """Pure lifecycle decision over a fresh snapshot.

    snapshot keys:
      worker_id, rank, capabilities, now, run_budget_remaining_seconds,
      claims: authoritative work-claims records (all issues),
      own_requests: [{request_id, operation_type, issue, stage, consumed,
                      receipt_ok, error}],
      supply: LQ_WORK_SUPPLY_REPORT (FULL) or None,
      supply_reconciled_this_run: bool
    """
    worker = str(snapshot["worker_id"])
    now = float(snapshot["now"])
    budget = float(snapshot.get("run_budget_remaining_seconds", 3600))
    caps = set(snapshot.get("capabilities") or ["STANDARD"])
    claims = [c for c in snapshot.get("claims") or [] if isinstance(c, dict)]
    own_active = [
        c for c in claims
        if c.get("WORKER_ID") == worker and c.get("CLAIM_STATUS") == "ACTIVE"
    ]
    pending = [
        r for r in snapshot.get("own_requests") or []
        if not r.get("consumed")
    ]
    has_owned_work = bool(own_active or pending)

    # 0. Only the tail of the run budget is for checkpointing.
    if has_owned_work and budget <= CHECKPOINT_RESERVE_SECONDS:
        first = (own_active or [{}])[0]
        return Decision(
            "CHECKPOINT_BEFORE_BUDGET_EXHAUSTED",
            "run budget nearly exhausted; persist exact state for next run",
            issue=first.get("ISSUE"),
            task_id=first.get("TASK_ID"),
            owner_run_id=first.get("OWNER_RUN_ID"),
            detail=tuple(r["request_id"] for r in pending),
        )

    # 1. Own async operations: nonterminal means keep waiting in this run.
    for r in pending:
        if r.get("stage") in NONTERMINAL_REQUEST_STAGES:
            return Decision(
                "WAIT_FOR_RECEIPT",
                f"request {r['request_id']} is {r.get('stage')} (NONTERMINAL); "
                "poll the same request_id until a terminal receipt",
                issue=r.get("issue"),
                request_id=r["request_id"],
            )
    for r in pending:
        if r.get("stage") == "TERMINAL_OK":
            return Decision(
                "ADVANCE_AFTER_RECEIPT",
                f"terminal receipt ok for {r['request_id']}; advance now",
                issue=r.get("issue"),
                request_id=r["request_id"],
                next_step=NEXT_AFTER_RECEIPT.get(
                    str(r.get("operation_type")), "RESELECT_FROM_CLAIM_RECORD"
                ),
            )
        if r.get("stage") == "TERMINAL_REJECTED":
            return Decision(
                "REPAIR_AFTER_REJECTED_RECEIPT",
                f"terminal receipt rejected {r['request_id']}: {r.get('error')}",
                issue=r.get("issue"),
                request_id=r["request_id"],
                next_step="CLASSIFY_ERROR_REPAIR_RESUBMIT_NEW_REQUEST_ID",
            )

    # 2. Own claim: continue it; never take another Leaf while owning one.
    for c in sorted(own_active, key=lambda x: _task_num(x.get("TASK_ID", ""))):
        if claim_is_stale(c, now):
            return Decision(
                "TAKEOVER_STALE_CLAIM",
                "own claim passed its deadline; renew is forbidden, recover "
                "through WORK_CLAIM_TAKEOVER with a new owner_run_id",
                issue=c.get("ISSUE"),
                task_id=c.get("TASK_ID"),
            )
        progress = _ts(c.get("PROGRESS_DEADLINE_AT"))
        if progress is not None and progress - now <= RENEW_WINDOW_SECONDS:
            return Decision(
                "RENEW_OWNED_CLAIM",
                "progress deadline close; WORK_CLAIM_RENEW before continuing",
                issue=c.get("ISSUE"),
                task_id=c.get("TASK_ID"),
                owner_run_id=c.get("OWNER_RUN_ID"),
            )
        return Decision(
            "CONTINUE_OWNED_CLAIM",
            "continue the owned Leaf under the Claim Record identity",
            issue=c.get("ISSUE"),
            task_id=c.get("TASK_ID"),
            owner_run_id=c.get("OWNER_RUN_ID"),
            next_step=str(c.get("NEXT_RECOVERY_ACTION") or "EXECUTE_TASK"),
        )

    escalated = [
        c for c in claims if c.get("CLAIM_STATUS") == "ESCALATED"
    ]

    # 3. Recover stalled work before starting new work.
    supply = snapshot.get("supply") or {}
    frontier = {
        int(x["issue"]): x for x in supply.get("frontier") or []
    }
    stale = [
        c for c in claims
        if c.get("CLAIM_STATUS") == "ACTIVE" and claim_is_stale(c, now)
        and frontier.get(int(c.get("ISSUE", 0)), {}).get(
            "capability", "STANDARD") in caps
    ]
    if stale and budget >= MIN_BUDGET_FOR_NEW_CLAIM_SECONDS:
        c = sorted(stale, key=lambda x: _task_num(x.get("TASK_ID", "")))[0]
        return Decision(
            "TAKEOVER_STALE_CLAIM",
            f"claim by {c.get('WORKER_ID')} is stale; fenced takeover",
            issue=c.get("ISSUE"),
            task_id=c.get("TASK_ID"),
        )

    # 4. Supply authority.
    if supply.get("status") == "SPEC_DRIFT":
        return Decision(
            "OWNER_GATE_SPEC_DRIFT",
            "tasks.md changed without a work-graph manifest update",
            detail=(str(supply.get("error")),),
        )
    supply_missing = (
        not supply
        or "frontier" not in supply
        or bool(supply.get("missing_after"))
        or supply.get("status") in {"SUPPLY_PARTIAL", "SUPPLY_IN_FLIGHT",
                                    "SUPPLY_REPAIR_PLANNED",
                                    "SUPPLY_INCOMPLETE"}
    )
    if supply_missing and not snapshot.get("supply_reconciled_this_run"):
        return Decision(
            "REQUEST_WORK_SUPPLY_RECONCILE",
            "execution leaves missing or unobserved; submit "
            "WORK_SUPPLY_RECONCILE (FULL) and wait for its receipt",
        )
    if supply.get("program_state") == "TASKS_COMPLETE_OWNER_FINAL_GATE":
        return Decision(
            "PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE",
            "every tasks.md task has a closed leaf; #101 closure is the "
            "Owner final gate",
        )

    # 5. READY = open, claimable, no open blockers, no live claim, capable.
    live_claimed = {
        int(c["ISSUE"]) for c in claims
        if c.get("CLAIM_STATUS") in {"ACTIVE", "ESCALATED"}
    }
    unblocked = [
        x for x in frontier.values()
        if x.get("claimable") and not x.get("open_blocker_tasks")
        and int(x["issue"]) not in live_claimed
    ]
    ready = [x for x in unblocked if x.get("capability", "STANDARD") in caps]
    if ready and budget >= MIN_BUDGET_FOR_NEW_CLAIM_SECONDS:
        pick = select_ready(ready, int(snapshot.get("rank", 1)))
        return Decision(
            "CLAIM_READY_LEAF",
            f"{len(ready)} READY leaf(s); rank {snapshot.get('rank')} pick",
            issue=int(pick["issue"]),
            task_id=pick["task_id"],
        )
    if ready:
        return Decision(
            "CHECKPOINT_BEFORE_BUDGET_EXHAUSTED",
            "READY work exists but remaining budget is below the new-claim "
            "minimum; next run claims it",
            detail=tuple(x["task_id"] for x in ready),
        )

    # 6. READY == 0 while incomplete: classify, never disable.
    others_live = [
        c for c in claims
        if c.get("CLAIM_STATUS") == "ACTIVE" and not claim_is_stale(c, now)
        and c.get("WORKER_ID") != worker
    ]
    if others_live:
        return Decision(
            "WAIT_FOR_UPSTREAM_IN_PROGRESS",
            "no READY leaf; other Workers own live claims that unblock the "
            "graph; schedule stays enabled",
            detail=tuple(
                f"{c.get('TASK_ID')}#{c.get('ISSUE')}@{c.get('WORKER_ID')}"
                for c in others_live
            ),
        )
    gated = [x for x in unblocked if x.get("capability", "STANDARD") not in caps]
    if gated:
        return Decision(
            "OWNER_GATE_CAPABILITY",
            "remaining unblocked leaves need a capability this Worker lacks",
            detail=tuple(
                f"{x['task_id']}#{x['issue']}:{x.get('capability')}"
                for x in sorted(gated, key=lambda x: _task_num(x["task_id"]))
            ),
        )
    if escalated:
        return Decision(
            "OWNER_GATE_ESCALATED",
            "WORK_ESCALATED claim blocks the graph; Owner arbitration",
            detail=tuple(
                f"{c.get('TASK_ID')}#{c.get('ISSUE')}" for c in escalated
            ),
        )
    if not snapshot.get("supply_reconciled_this_run"):
        return Decision(
            "REQUEST_WORK_SUPPLY_RECONCILE",
            "program incomplete, READY == 0, nothing in progress: "
            "reconcile leaves/dependencies before concluding anything",
        )
    return Decision(
        "OWNER_GATE_CONTROL_PLANE_ANOMALY",
        "program incomplete, READY == 0 after a fresh reconcile, nothing in "
        "progress; report the frontier (do not disable the schedule)",
        detail=tuple(
            f"{x['task_id']}#{x['issue']} blockers={x.get('open_blocker_tasks')}"
            f" claimable={x.get('claimable')}"
            for x in sorted(frontier.values(),
                            key=lambda x: _task_num(x["task_id"]))[:12]
        ),
    )


def receipt_stage(
    *, draft_exists: bool, request_exists: bool, receipt: dict | None
) -> str:
    if receipt is not None:
        if receipt.get("terminal") is True:
            return "TERMINAL_OK" if receipt.get("ok") is True else (
                "TERMINAL_REJECTED"
            )
        return "PENDING"
    if request_exists:
        return "REQUEST"
    if draft_exists:
        return "DRAFT"
    return "NO_RECEIPT"


def main(argv: list[str] | None = None) -> int:
    import argparse
    import sys

    ap = argparse.ArgumentParser(
        description="Deterministic next action for a visual-rebuild Worker"
    )
    ap.add_argument("--snapshot", required=True, help="snapshot JSON path")
    args = ap.parse_args(argv)
    with open(args.snapshot, encoding="utf-8") as f:
        snapshot = json.load(f)
    decision = decide_next_action(snapshot)
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(decision.as_dict(), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
