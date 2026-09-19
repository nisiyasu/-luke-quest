from __future__ import annotations

import json
import os
import pathlib
import sys
import time
import traceback

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "env_visual_gateway"))
import fenced_gateway as gw

TEST_CONTROL = "test/env-visual-gateway-v1-crash-control"
TEST_IMPLEMENTATION = "test/env-visual-gateway-v1-crash-implementation"
TEST_CHILD = 100
TEST_PARENT = 98
TARGET = {
    "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
    "target_blob_sha": "198d0f5f3da115b70218ae8180d5f8363d744959",
}

gw.ALLOWED_LANES = {
    "dungeon": {
        "parent": TEST_PARENT,
        "children": {TEST_CHILD},
        "implementation_branch": TEST_IMPLEMENTATION,
        "control_branch": TEST_CONTROL,
        "target_source_commit_sha": TARGET["target_source_commit_sha"],
        "target_path": "references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png",
        "target_blob_sha": TARGET["target_blob_sha"],
    }
}
gw.EVIDENCE_BRANCH = "test/env-visual-gateway-v1-evidence"


def make_req(run_id, owner, epoch, op_suffix, op_type, *, expected_head=None, payload=None):
    req = {
        "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id": f"REQ-{run_id}-{op_suffix}",
        "lane_id": "dungeon",
        "owner_run_id": owner,
        "lease_epoch": epoch,
        "operation_id": f"{run_id}-{op_suffix}",
        "operation_type": op_type,
        "expected_lane_head": expected_head,
        "expected_target_identity": TARGET,
        "payload": payload or {},
        "created_at": str(time.time()),
        "request_sha256": "",
    }
    req["request_sha256"] = gw.sha256_text(gw.canonical(req))
    return req


class Proxy:
    def __init__(self, real):
        self.real = real

    def __getattr__(self, name):
        return getattr(self.real, name)


class LoseAfterImplementationCommit(Proxy):
    def __init__(self, real, target_branch):
        super().__init__(real)
        self.target_branch = target_branch
        self.fired = False

    def cas_write_files(self, branch, files, message, **kwargs):
        result = self.real.cas_write_files(branch, files, message, **kwargs)
        if branch == self.target_branch and not self.fired:
            self.fired = True
            raise RuntimeError("SIMULATED_RESPONSE_LOSS_AFTER_IMPLEMENTATION_COMMIT")
        return result


class LoseAfterIssuePost(Proxy):
    def __init__(self, real):
        super().__init__(real)
        self.fired = False

    def post_comment(self, issue, body):
        result = self.real.post_comment(issue, body)
        if not self.fired:
            self.fired = True
            raise RuntimeError("SIMULATED_RESPONSE_LOSS_AFTER_ISSUE_POST")
        return result


class LoseBeforeIssuePost(Proxy):
    def post_comment(self, issue, body):
        raise RuntimeError("SIMULATED_UNKNOWN_BEFORE_VISIBLE_ISSUE_POST")


def expect_raises(fn, exc_type):
    try:
        fn()
    except exc_type as exc:
        return str(exc)
    raise AssertionError(f"expected {exc_type.__name__}")


def main():
    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ["GITHUB_REPOSITORY"]
    run_id = os.environ["GITHUB_RUN_ID"]
    report_path = pathlib.Path(os.environ["REPORT_PATH"])

    real = gw.GitHub(repo, token)

    # Every run gets fresh test-only branches. The previous run intentionally
    # leaves RESULT_UNKNOWN fenced state behind as evidence, so reusing a fixed
    # control branch would make the next run fail before the test starts.
    global TEST_CONTROL, TEST_IMPLEMENTATION
    TEST_CONTROL = f"test/env-visual-gateway-v1-crash-control-{run_id}"
    TEST_IMPLEMENTATION = f"test/env-visual-gateway-v1-crash-implementation-{run_id}"
    test_evidence = f"test/env-visual-gateway-v1-crash-evidence-{run_id}"
    base_head = real.ref("main")
    for branch in (TEST_CONTROL, TEST_IMPLEMENTATION, test_evidence):
        real.request(
            "POST",
            "/git/refs",
            {"ref": f"refs/heads/{branch}", "sha": base_head},
            ok=(201,),
        )

    implementation_head = real.ref(TEST_IMPLEMENTATION)
    initial_lease = {
        "schema": "LUKE_QUEST_ENV_LANE_LEASE:v1",
        "LANE_ID": "isolated-dungeon-crash-test",
        "OWNER_RUN_ID": None,
        "LEASE_EPOCH": 0,
        "FENCING_TOKEN": 0,
        "ACQUIRED_AT": None,
        "LEASE_UNTIL": None,
        "LAST_HEARTBEAT_AT": None,
        "BASE_HEAD_SHA": None,
        "CURRENT_HEAD_SHA": implementation_head,
        "LEASE_STATUS": "RELEASED",
        "PRODUCTION_ENABLED": True,
        "ACTIVE_OPERATION_ID": None,
        "GATEWAY_CUTOVER_STATUS": "ISOLATED_TEST",
        "TEST_ONLY": True,
    }
    real.cas_write_files(
        TEST_CONTROL,
        {
            gw.LEASE_PATH: (
                json.dumps(initial_lease, ensure_ascii=False, indent=2) + "\n"
            ).encode("utf-8")
        },
        f"test: initialize crash recovery lane {run_id}",
    )

    gw.ALLOWED_LANES = {
        "dungeon": {
            "parent": TEST_PARENT,
            "children": {TEST_CHILD},
            "implementation_branch": TEST_IMPLEMENTATION,
            "control_branch": TEST_CONTROL,
            "target_source_commit_sha": TARGET["target_source_commit_sha"],
            "target_path": "references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png",
            "target_blob_sha": TARGET["target_blob_sha"],
        }
    }
    gw.EVIDENCE_BRANCH = test_evidence

    gate = gw.Gateway(real, production_enabled=True)
    owner = f"gateway-crash-test-{run_id}"
    results = []
    _, gateway_blob_under_test = real.content(
        os.environ.get("GITHUB_SHA", "main"),
        "tools/env_visual_gateway/fenced_gateway.py",
    )

    # Acquire generation 1.
    acquired = gate.apply(
        make_req(
            run_id,
            owner,
            0,
            "acquire",
            "LEASE_ACQUIRE",
            payload={"ttl_seconds": 1800},
        )
    )
    epoch = int(acquired["lease"]["LEASE_EPOCH"])
    results.append({"scenario": "ACQUIRE", "status": "PASS", "epoch": epoch})

    # ------------------------------------------------------------------
    # Scenario A: implementation ref update succeeds, response is lost.
    # ------------------------------------------------------------------
    before = real.ref(TEST_IMPLEMENTATION)
    impl_req = make_req(
        run_id,
        owner,
        epoch,
        "impl-loss",
        "IMPLEMENTATION_FILE_UPDATE",
        expected_head=before,
        payload={
            "path": "crash-recovery-runtime.txt",
            "encoding": "utf-8",
            "content": f"response-loss-applied:{run_id}\n",
        },
    )
    lost_gate = gw.Gateway(
        LoseAfterImplementationCommit(real, TEST_IMPLEMENTATION),
        production_enabled=True,
    )
    first_error = expect_raises(lambda: lost_gate.apply(impl_req), RuntimeError)
    after_first = real.ref(TEST_IMPLEMENTATION)
    assert after_first != before, "simulated implementation write did not apply"

    recovered = gate.apply(impl_req)
    after_replay = real.ref(TEST_IMPLEMENTATION)
    assert after_replay == after_first, "replay caused a second implementation ref move"
    assert recovered["OPERATION_STATE"] == gw.CONFIRMED_APPLIED
    assert recovered.get("RECOVERED_AFTER_UNKNOWN_RESPONSE") is True
    results.append(
        {
            "scenario": "IMPLEMENTATION_RESPONSE_LOSS",
            "status": "PASS",
            "first_error": first_error,
            "before_head": before,
            "applied_head": after_first,
            "replay_head": after_replay,
            "recovered_without_second_write": True,
        }
    )

    # ------------------------------------------------------------------
    # Scenario B: issue post succeeds, response is lost. Replay must
    # reconcile the marker and must not create a second comment.
    # ------------------------------------------------------------------
    comment_req = make_req(
        run_id,
        owner,
        epoch,
        "comment-loss-after",
        "ISSUE_COMMENT",
        payload={
            "issue_number": TEST_CHILD,
            "body": "Crash recovery test: response lost after comment creation.",
        },
    )
    marker = f"[LQ_GATEWAY_OP:{comment_req['operation_id']}]"
    post_loss_gate = gw.Gateway(LoseAfterIssuePost(real), production_enabled=True)
    second_error = expect_raises(
        lambda: post_loss_gate.apply(comment_req), RuntimeError
    )
    count_after_loss = len(real.find_comment(TEST_CHILD, marker))
    assert count_after_loss == 1

    reconciled = gate.apply(comment_req)
    count_after_replay = len(real.find_comment(TEST_CHILD, marker))
    assert count_after_replay == 1, "comment replay duplicated external side effect"
    assert reconciled["OPERATION_STATE"] == gw.CONFIRMED_APPLIED
    assert reconciled.get("RECONCILED_BY_MARKER") is True
    results.append(
        {
            "scenario": "ISSUE_COMMENT_RESPONSE_LOSS_AFTER_APPLY",
            "status": "PASS",
            "first_error": second_error,
            "marker_count_before_replay": count_after_loss,
            "marker_count_after_replay": count_after_replay,
            "blind_resend": False,
        }
    )

    # ------------------------------------------------------------------
    # Scenario C: dispatch outcome is genuinely unknown and no marker is
    # observable. Replay must NOT post. It must preserve RESULT_UNKNOWN
    # and keep the lane fenced.
    # ------------------------------------------------------------------
    unknown_req = make_req(
        run_id,
        owner,
        epoch,
        "comment-loss-unknown",
        "ISSUE_COMMENT",
        payload={
            "issue_number": TEST_CHILD,
            "body": "THIS MUST NOT BE BLINDLY RESENT",
        },
    )
    unknown_marker = f"[LQ_GATEWAY_OP:{unknown_req['operation_id']}]"
    before_loss_gate = gw.Gateway(
        LoseBeforeIssuePost(real), production_enabled=True
    )
    third_error = expect_raises(
        lambda: before_loss_gate.apply(unknown_req), RuntimeError
    )
    assert len(real.find_comment(TEST_CHILD, unknown_marker)) == 0

    replay_error = expect_raises(
        lambda: gate.apply(unknown_req), gw.GatewayError
    )
    assert "blind resend prohibited" in replay_error
    assert len(real.find_comment(TEST_CHILD, unknown_marker)) == 0

    control_op = real.json_file(
        TEST_CONTROL, f"operations/{unknown_req['operation_id']}.json"
    )
    lease = real.json_file(TEST_CONTROL, gw.LEASE_PATH)
    assert control_op["OPERATION_STATE"] == gw.RESULT_UNKNOWN
    assert lease["ACTIVE_OPERATION_ID"] == unknown_req["operation_id"]

    release_req = make_req(
        run_id, owner, epoch, "release-while-unknown", "LEASE_RELEASE"
    )
    release_error = expect_raises(
        lambda: gate.apply(release_req), gw.ActiveOperation
    )

    takeover_req = make_req(
        run_id,
        f"new-owner-{run_id}",
        0,
        "takeover-while-unknown",
        "LEASE_ACQUIRE",
        payload={"ttl_seconds": 1800},
    )
    takeover_error = expect_raises(
        lambda: gate.apply(takeover_req), gw.ActiveOperation
    )

    results.append(
        {
            "scenario": "ISSUE_COMMENT_TRUE_UNKNOWN",
            "status": "PASS",
            "first_error": third_error,
            "replay_error": replay_error,
            "marker_count": 0,
            "operation_state": control_op["OPERATION_STATE"],
            "active_operation_id": lease["ACTIVE_OPERATION_ID"],
            "release_blocked": release_error,
            "takeover_blocked": takeover_error,
            "blind_resend": False,
        }
    )

    report = {
        "schema": "LUKE_QUEST_ENV_GATEWAY_CRASH_RECOVERY_REPORT:v1",
        "overall": "PASS",
        "test_only": True,
        "run_id": run_id,
        "gateway_blob_under_test": gateway_blob_under_test,
        "resources": {
            "parent_issue": TEST_PARENT,
            "child_issue": TEST_CHILD,
            "control_branch": TEST_CONTROL,
            "implementation_branch": TEST_IMPLEMENTATION,
        },
        "results": results,
        "final_state_intentionally_fenced": True,
        "final_note": (
            "The test control lane intentionally remains RESULT_UNKNOWN with "
            "ACTIVE_OPERATION_ID set, proving fail-closed behavior. It is test-only."
        ),
    }
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        traceback.print_exc()
        try:
            failure_path = pathlib.Path(os.environ["REPORT_PATH"])
            failure_path.write_text(
                json.dumps(
                    {
                        "schema": "LUKE_QUEST_ENV_GATEWAY_CRASH_RECOVERY_REPORT:v1",
                        "overall": "FAIL",
                        "test_only": True,
                        "run_id": os.environ.get("GITHUB_RUN_ID"),
                        "error_type": type(exc).__name__,
                        "error": str(exc),
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )
        except Exception:
            traceback.print_exc()
        raise
