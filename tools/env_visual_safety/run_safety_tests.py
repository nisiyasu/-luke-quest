from __future__ import annotations

import argparse
import json
import tempfile
import traceback
from datetime import datetime, timezone
from pathlib import Path

from foundation import (
    ADOPTED_CHILD_NOT_CLOSED,
    CHILD_CLOSED_PARENT_NOT_ADVANCED,
    COMPLETE,
    CONFIRMED_NOT_APPLIED,
    DURABLE_STORED_NOT_ADOPTED,
    IDENTIFIERS_RESERVED,
    RESULT_CONFIRMATION_REQUIRED,
    RESULT_UNKNOWN,
    ConcurrentPublication,
    IdentityMismatch,
    JsonSafetyStore,
    SafetyFoundation,
    StaleGatewayInstance,
    TakeoverBlocked,
)

def identity(head="head-a", target="target-v1", anchor="anchor-v1"):
    return {
        "implementation_head": head,
        "target_revision": target,
        "anchor_revision": anchor,
        "acceptance_revision": "accept-v1",
        "viewport": "896x1664@1",
        "evidence_settings": "settings-v1",
        "audit_semantics": "audit-v1",
    }

def new_foundation(root: Path):
    return SafetyFoundation(JsonSafetyStore(root / "state.json"))

def test_1(root: Path):
    f = new_foundation(root)
    f.create_lane("village", "run-A", lease_epoch=41)
    gen = f.lane("village")["GATEWAY_GENERATION"]
    f.prepare_operation(operation_id="op-response-lost", lane_id="village", owner_run_id="run-A", lease_epoch=41, gateway_generation=gen, target="issue-54-state", mutation_type="issue-close", expected_precondition="open", expected_postcondition="closed", retry_class=RESULT_CONFIRMATION_REQUIRED)
    f.dispatch_operation("op-response-lost", owner_run_id="run-A", lease_epoch=41, gateway_generation=gen, outcome="not_applied_response_lost")
    assert f.operation_state("op-response-lost") == RESULT_UNKNOWN
    try:
        f.takeover("village", "run-B")
        raise AssertionError("takeover must be blocked while result is unknown")
    except TakeoverBlocked:
        pass
    assert f.reconcile_operation("op-response-lost") == RESULT_UNKNOWN
    f.confirm_request_will_not_apply("op-response-lost")
    assert f.operation_state("op-response-lost") == CONFIRMED_NOT_APPLIED
    assert f.takeover("village", "run-B") == 42

def test_2(root: Path):
    f = new_foundation(root)
    f.create_lane("castle", "run-A", lease_epoch=7, gateway_instance_id="gateway-old")
    old_gen = f.lane("castle")["GATEWAY_GENERATION"]
    new_gen = f.restart_gateway("castle", "gateway-new")
    assert new_gen > old_gen
    try:
        f.prepare_operation(operation_id="stale-gateway-write", lane_id="castle", owner_run_id="run-A", lease_epoch=7, gateway_generation=old_gen, target="issue-68-state", mutation_type="comment", expected_precondition="none", expected_postcondition="commented", retry_class=RESULT_CONFIRMATION_REQUIRED)
        raise AssertionError("old gateway generation must be rejected")
    except StaleGatewayInstance:
        pass

def test_3(root: Path):
    f = new_foundation(root)
    f.create_lane("dungeon", "run-A", lease_epoch=9)
    gen = f.lane("dungeon")["GATEWAY_GENERATION"]
    ev_id = "EV-DUNGEON-82-001"
    ad_id = "AD-DUNGEON-82-001"
    ident = identity()
    f.reserve_evidence(lane_id="dungeon", child_issue=82, evidence_id=ev_id, adoption_id=ad_id, identity=ident, owner_run_id="run-A", lease_epoch=9, gateway_generation=gen)
    assert f.evidence_record(ad_id)["STATE"] == IDENTIFIERS_RESERVED
    f = new_foundation(root)
    assert f.evidence_record(ad_id)["EVIDENCE_ID"] == ev_id
    files = {
        "target.png.sha256.txt": "target-hash",
        "actual.png.sha256.txt": "actual-hash",
        "coordinate-audit.json": '{"status":"PASS"}',
        "evidence-manifest.candidate.json": '{"schema":"v1"}',
        "evidence-settings.json": '{"viewport":"896x1664"}',
        "evaluation-contract-snapshot.md": "contract-v1",
    }
    f.store_evidence(ad_id, files)
    assert f.evidence_record(ad_id)["STATE"] == DURABLE_STORED_NOT_ADOPTED
    f = new_foundation(root)
    f.verify_evidence_readback(ad_id)
    f = new_foundation(root)
    f.adopt_evidence(ad_id, current_identity=ident, owner_run_id="run-A", lease_epoch=9, gateway_generation=gen)
    assert f.evidence_record(ad_id)["STATE"] == ADOPTED_CHILD_NOT_CLOSED
    f = new_foundation(root)
    f.close_child(ad_id)
    assert f.evidence_record(ad_id)["STATE"] == CHILD_CLOSED_PARENT_NOT_ADVANCED
    f = new_foundation(root)
    f.advance_parent(ad_id)
    assert f.evidence_record(ad_id)["STATE"] == COMPLETE
    f.advance_parent(ad_id)
    rec = f.evidence_record(ad_id)
    assert rec["EVIDENCE_ID"] == ev_id and rec["ADOPTION_ID"] == ad_id

def test_4(root: Path):
    f = new_foundation(root)
    lanes = [("village",54,"EV-V-1","AD-V-1"),("castle",68,"EV-C-1","AD-C-1"),("dungeon",82,"EV-D-1","AD-D-1")]
    for lane_name, child, ev, ad in lanes:
        f.create_lane(lane_name, f"run-{lane_name}")
        lane=f.lane(lane_name)
        f.reserve_evidence(lane_id=lane_name, child_issue=child, evidence_id=ev, adoption_id=ad, identity=identity(head=f"head-{lane_name}"), owner_run_id=f"run-{lane_name}", lease_epoch=1, gateway_generation=lane["GATEWAY_GENERATION"])
    assert f.publication_head() == 0
    f.store_evidence("AD-V-1", {"manifest":"village"}, expected_publication_head=0)
    for ad in ("AD-C-1","AD-D-1"):
        try:
            f.store_evidence(ad, {"manifest":ad}, expected_publication_head=0)
            raise AssertionError("stale evidence head must conflict")
        except ConcurrentPublication:
            pass
        f.store_evidence(ad, {"manifest":ad}, expected_publication_head=f.publication_head())
    paths=f.publication_paths()
    assert len(paths)==3
    assert any("/village/" in p for p in paths)
    assert any("/castle/" in p for p in paths)
    assert any("/dungeon/" in p for p in paths)

def test_5(root: Path):
    f = new_foundation(root)
    f.create_lane("village","run-A")
    lane=f.lane("village")
    original=identity(head="head-old",target="target-v1",anchor="anchor-v1")
    f.reserve_evidence(lane_id="village",child_issue=54,evidence_id="EV-OLD",adoption_id="AD-OLD",identity=original,owner_run_id="run-A",lease_epoch=1,gateway_generation=lane["GATEWAY_GENERATION"])
    f.store_evidence("AD-OLD",{"manifest":"old"})
    f.verify_evidence_readback("AD-OLD")
    current=identity(head="head-new",target="target-v1",anchor="anchor-v2")
    try:
        f.adopt_evidence("AD-OLD",current_identity=current,owner_run_id="run-A",lease_epoch=1,gateway_generation=lane["GATEWAY_GENERATION"])
        raise AssertionError("mismatched evidence must not be adopted")
    except IdentityMismatch:
        pass
    assert f.evidence_record("AD-OLD")["STATE"] == DURABLE_STORED_NOT_ADOPTED
    assert not f.historical_evidence_valid("AD-OLD")

TESTS=[
    ("TEST-1 external write response loss",test_1),
    ("TEST-2 stale gateway process return",test_2),
    ("TEST-3 evidence/adoption crash resume",test_3),
    ("TEST-4 three-lane evidence publication",test_4),
    ("TEST-5 stale/mismatched evidence rejection",test_5),
]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--report",required=True)
    args=parser.parse_args()
    results=[]
    overall=True
    with tempfile.TemporaryDirectory(prefix="lq-env-visual-safety-") as tmp:
        root=Path(tmp)
        for i,(name,fn) in enumerate(TESTS,1):
            case_root=root/f"case-{i}"
            case_root.mkdir(parents=True,exist_ok=True)
            try:
                fn(case_root)
                results.append({"test":name,"status":"PASS"})
            except Exception as exc:
                overall=False
                results.append({"test":name,"status":"FAIL","error":f"{type(exc).__name__}: {exc}","traceback":traceback.format_exc()})
    report={"schema":"LUKE_QUEST_ENV_VISUAL_SAFETY_TEST_REPORT:v1","generated_at":datetime.now(timezone.utc).isoformat(),"overall":"PASS" if overall else "FAIL","tests":results}
    Path(args.report).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    raise SystemExit(0 if overall else 1)

if __name__=="__main__":
    main()
