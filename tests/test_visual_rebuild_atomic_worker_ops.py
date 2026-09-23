import importlib.util
import json
import pathlib
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor

HERE = pathlib.Path(__file__).resolve().parent
MODULE = HERE.parent / "tools" / "env_visual_gateway" / "fenced_gateway.py"
spec = importlib.util.spec_from_file_location("lq_env_gateway_atomic", MODULE)
gw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gw)

TARGET_COMMIT = gw.ALLOWED_LANES["visual-rebuild"]["target_source_commit_sha"]
TARGET_PATH = gw.ALLOWED_LANES["visual-rebuild"]["target_path"]
TARGET_BLOB = gw.ALLOWED_LANES["visual-rebuild"]["target_blob_sha"]
IMPL = gw.ALLOWED_LANES["visual-rebuild"]["implementation_branch"]
CONTROL = gw.ALLOWED_LANES["visual-rebuild"]["control_branch"]


class FakeGitHub:
    def __init__(self):
        self.lock = threading.RLock()
        self.seq = 100
        self.refs = {
            IMPL: "a" * 40,
            CONTROL: "c" * 40,
        }
        self.files = {}
        self.comments_by_issue = {130: [], 133: []}
        self.issue_state = {130: "open", 133: "open", 104: "open", 101: "open"}
        self.parents = {130: 104, 133: 104, 104: 101, 101: None}
        self.next_comment_id = 1
        self.next_event_id = 1
        self.events_by_issue = {130: [], 133: []}
        self.lease = {
            "PRODUCTION_ENABLED": True,
            "LEASE_STATUS": gw.RELEASED,
            "LEASE_UNTIL": None,
            "ACTIVE_OPERATION_ID": None,
            "OWNER_RUN_ID": None,
            "LEASE_EPOCH": 0,
        }
        self.pause_patchset = False
        self.patchset_entered = threading.Event()
        self.allow_patchset = threading.Event()

    def _next_sha(self):
        self.seq += 1
        return f"{self.seq:040x}"

    def ref(self, branch):
        with self.lock:
            return self.refs[branch]

    def content(self, branch, path):
        with self.lock:
            if branch == TARGET_COMMIT and path == TARGET_PATH:
                return b"target", TARGET_BLOB
            key = (branch, path)
            if key not in self.files:
                raise gw.ApiError(404, "not found")
            return self.files[key], "blob"

    def json_file(self, branch, path):
        with self.lock:
            if branch == CONTROL and path == gw.LEASE_PATH:
                return dict(self.lease)
            key = (branch, path)
            if key not in self.files:
                raise gw.ApiError(404, "not found")
            return json.loads(self.files[key].decode("utf-8"))

    def issue(self, number):
        with self.lock:
            body = ""
            title = f"Issue {number}"
            if number == 130:
                title = "T016: spatial intent"
                body = (
                    "<!-- LQ_EXECUTION_LEAF:v1 -->\n"
                    "PARENT_PROGRAM: #101\n"
                    "TASK_ID: T016\n"
                    "WORK_TYPE: EXECUTION_LEAF\n"
                    "CLAIMABLE: YES\n"
                )
            if number == 133:
                title = "T019: capture contract"
                body = (
                    "<!-- LQ_EXECUTION_LEAF:v1 -->\n"
                    "PARENT_PROGRAM: #101\n"
                    "TASK_ID: T019\n"
                    "WORK_TYPE: EXECUTION_LEAF\n"
                    "CLAIMABLE: YES\n"
                )
            parent = self.parents.get(number)
            return {
                "number": number,
                "state": self.issue_state.get(number, "open"),
                "body": body,
                "title": title,
                "parent_issue_url": (
                    f"https://api.github.com/repos/x/y/issues/{parent}"
                    if parent is not None
                    else None
                ),
            }

    def comments(self, issue):
        with self.lock:
            return [dict(x) for x in self.comments_by_issue.setdefault(issue, [])]

    def find_comment(self, issue, marker):
        return [c for c in self.comments(issue) if marker in c.get("body", "")]

    def post_comment(self, issue, body):
        with self.lock:
            c = {"id": self.next_comment_id, "body": body}
            self.next_comment_id += 1
            self.comments_by_issue.setdefault(issue, []).append(c)
            return dict(c)

    def blocked_by(self, issue):
        return []

    def events(self, issue):
        with self.lock:
            return [dict(x) for x in self.events_by_issue.setdefault(issue, [])]

    def close_issue(self, issue, actor="github-actions[bot]"):
        with self.lock:
            self.issue_state[issue] = "closed"
            self.events_by_issue.setdefault(issue, []).append({
                "id": self.next_event_id,
                "event": "closed",
                "created_at": gw.now_rfc3339(),
                "actor": {"login": actor},
            })
            self.next_event_id += 1
            return self.issue(issue)

    def cas_write_files(self, branch, files, message, expected_head=None, retries=8):
        if (
            branch == IMPL
            and self.pause_patchset
            and "atomic worker patchset" in message
        ):
            self.patchset_entered.set()
            self.allow_patchset.wait(timeout=5)
        with self.lock:
            current = self.refs[branch]
            if expected_head is not None and expected_head != current:
                raise gw.CasConflict("head mismatch")
            for path, content in files.items():
                if branch == CONTROL and path == gw.LEASE_PATH:
                    self.lease = json.loads(content.decode("utf-8"))
                else:
                    self.files[(branch, path)] = bytes(content)
            new_head = self._next_sha()
            self.refs[branch] = new_head
            return new_head

    def expire_claim(self, issue):
        with self.lock:
            path = (CONTROL, f"work-claims/issue-{issue}.json")
            record = json.loads(self.files[path].decode("utf-8"))
            record["PROGRESS_DEADLINE_AT"] = "2000-01-01T00:00:00Z"
            record["CLAIM_UNTIL"] = "2000-01-01T00:00:00Z"
            self.files[path] = (
                json.dumps(record, sort_keys=True) + "\n"
            ).encode("utf-8")
            self.refs[CONTROL] = self._next_sha()

    def manual_close(self, issue):
        return self.close_issue(issue, actor="nisiyasu")


def make_request(
    op,
    owner,
    payload,
    *,
    expected_head=None,
    work_phase=None,
    request_id=None,
):
    request_id = request_id or owner + "-" + op.lower()
    req = {
        "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id": request_id,
        "lane_id": "visual-rebuild",
        "owner_run_id": owner,
        "lease_epoch": 0,
        "operation_id": request_id + "-op",
        "operation_type": op,
        "expected_lane_head": expected_head,
        "expected_target_identity": {
            "target_source_commit_sha": TARGET_COMMIT,
            "target_blob_sha": TARGET_BLOB,
        },
        "payload": payload,
        "created_at": gw.now_rfc3339(),
        "request_sha256": "",
    }
    if work_phase:
        req["work_context"] = {
            "issue_number": payload["issue_number"],
            "task_id": payload["task_id"],
            "worker_id": payload["worker_id"],
            "owner_run_id": owner,
            "claim_generation": payload["claim_generation"],
            "operation_id": req["operation_id"],
            "work_phase": work_phase,
            "submitted_payload_reference": (
                f"inbox/visual-rebuild/{request_id}.json"
            ),
            "expected_head": expected_head,
            "last_progress_at": gw.now_rfc3339(),
            "next_recovery_action": (
                "RECONCILE_PATCHSET_RECEIPT"
                if op == "IMPLEMENTATION_PATCHSET"
                else "RECONCILE_TASK_COMPLETE"
            ),
        }
    req["request_sha256"] = gw.sha256_text(gw.canonical(req))
    return req

def acceptance(task_id, head, evaluator="INFRASTRUCTURE_TEST_V1"):
    return {
        "schema": "LQ_TASK_ACCEPTANCE:v1",
        "task_id": task_id,
        "evaluator_id": evaluator,
        "result": "PASS",
        "accepted_head": head,
        "runtime_config": {"profile": "test"},
        "evidence_artifacts": [
            {
                "kind": "test-report.json",
                "uri": "evidence://test/report",
                "sha256": "1" * 64,
            }
        ],
        "evaluated_at": gw.now_rfc3339(),
    }


class AtomicWorkerOpsTests(unittest.TestCase):
    def setUp(self):
        self.gh = FakeGitHub()
        self.gateway = gw.Gateway(self.gh, production_enabled=True)

    def claim(self, worker="A", owner="run-a", issue=130, task="T016"):
        result = self.gateway.apply(make_request(
            "WORK_CLAIM_ACQUIRE",
            owner,
            {
                "issue_number": issue,
                "task_id": task,
                "worker_id": worker,
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 3,
            },
        ))
        return result

    def claim_generation(self, issue=130):
        return self.gh.json_file(
            CONTROL, f"work-claims/issue-{issue}.json"
        )["CLAIM_GENERATION"]

    def patch_request(self, owner="run-a", worker="A", content="x"):
        generation = self.claim_generation()
        return make_request(
            "IMPLEMENTATION_PATCHSET",
            owner,
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": worker,
                "claim_generation": generation,
                "commit_message": "T016: atomic worker patchset",
                "files": [
                    {
                        "path": "prototypes/target-image-threejs/x.txt",
                        "encoding": "utf-8",
                        "content": content,
                    }
                ],
            },
            expected_head=self.gh.ref(IMPL),
            work_phase="PATCHSET_SUBMITTED",
            request_id=owner + "-patch",
        )

    def complete_request(
        self,
        *,
        issue=130,
        task="T016",
        owner="run-a",
        worker="A",
        evaluator="INFRASTRUCTURE_TEST_V1",
        acceptance_override=None,
        request_id=None,
    ):
        generation = self.claim_generation(issue)
        head = self.gh.ref(IMPL)
        acc = acceptance_override or acceptance(task, head, evaluator)
        if evaluator == "T019_CAPTURE_CONTRACT_V1" and acceptance_override is None:
            acc["runtime_config"] = {
                "viewport": {"width": 941, "height": 1672, "dpr": 1}
            }
            acc["evidence_artifacts"] = [
                {
                    "kind": "actual.png",
                    "uri": "evidence://t019/actual.png",
                    "sha256": "2" * 64,
                },
                {
                    "kind": "runtime-audit.json",
                    "uri": "evidence://t019/runtime-audit.json",
                    "sha256": "3" * 64,
                },
            ]
        return make_request(
            "TASK_COMPLETE",
            owner,
            {
                "issue_number": issue,
                "task_id": task,
                "worker_id": worker,
                "claim_generation": generation,
                "exact_head": head,
                "acceptance": acc,
                "summary": f"{task} accepted",
            },
            expected_head=head,
            work_phase="COMPLETION_SUBMITTED",
            request_id=request_id or owner + "-complete",
        )

    def test_concurrent_abc_claim_exactly_one_owner(self):
        def try_claim(worker):
            try:
                out = self.claim(
                    worker=worker,
                    owner=f"run-{worker.lower()}",
                )
                return ("ok", worker, out["claim"]["CLAIM_GENERATION"])
            except Exception as exc:
                return ("fail", worker, type(exc).__name__)

        with ThreadPoolExecutor(max_workers=3) as pool:
            results = list(pool.map(try_claim, ["A", "B", "C"]))
        winners = [x for x in results if x[0] == "ok"]
        self.assertEqual(len(winners), 1, results)
        record = self.gh.json_file(CONTROL, "work-claims/issue-130.json")
        self.assertEqual(record["WORKER_ID"], winners[0][1])
        self.assertEqual(record["CLAIM_STATUS"], "ACTIVE")

    def test_different_ready_issues_keep_independent_claims(self):
        a = self.claim(worker="A", owner="run-a", issue=130, task="T016")
        b = self.claim(worker="B", owner="run-b", issue=133, task="T019")
        self.assertEqual(a["status"], "CLAIM_ACQUIRED")
        self.assertEqual(b["status"], "CLAIM_ACQUIRED")
        ca = self.gh.json_file(CONTROL, "work-claims/issue-130.json")
        cb = self.gh.json_file(CONTROL, "work-claims/issue-133.json")
        self.assertEqual(ca["WORKER_ID"], "A")
        self.assertEqual(cb["WORKER_ID"], "B")
        self.assertEqual(ca["CLAIM_STATUS"], "ACTIVE")
        self.assertEqual(cb["CLAIM_STATUS"], "ACTIVE")

    def test_takeover_revokes_old_run_from_legacy_lease_reacquire(self):
        self.claim(worker="A", owner="run-a")
        self.gh.expire_claim(130)
        takeover = self.gateway.apply(make_request(
            "WORK_CLAIM_TAKEOVER",
            "run-b",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "B",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 3,
            },
            request_id="run-b-takeover-revoke",
        ))
        self.assertEqual(takeover["status"], "CLAIM_TAKEN_OVER")
        revoked = self.gh.json_file(
            CONTROL, takeover["revoked_writer_path"]
        )
        self.assertEqual(revoked["OWNER_RUN_ID"], "run-a")
        self.assertEqual(revoked["CLAIM_GENERATION"], 1)
        stale_lease = make_request(
            "LEASE_ACQUIRE",
            "run-a",
            {"ttl_seconds": 180},
            request_id="run-a-reacquire-after-takeover",
        )
        with self.assertRaisesRegex(gw.StaleEpoch, "permanently fenced"):
            self.gateway.apply(stale_lease)

    def test_takeover_invalidates_old_active_lease_epoch(self):
        self.claim(worker="A", owner="run-a")
        self.gh.lease.update({
            "LEASE_STATUS": gw.ACTIVE,
            "LEASE_UNTIL": "2099-01-01T00:00:00Z",
            "OWNER_RUN_ID": "run-a",
            "LEASE_EPOCH": 7,
            "FENCING_TOKEN": 7,
            "ACTIVE_OPERATION_ID": None,
        })
        self.gh.expire_claim(130)
        takeover = self.gateway.apply(make_request(
            "WORK_CLAIM_TAKEOVER",
            "run-b",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "B",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 3,
            },
            request_id="run-b-takeover-lease-fence",
        ))
        self.assertEqual(takeover["status"], "CLAIM_TAKEN_OVER")
        lease = self.gh.json_file(CONTROL, gw.LEASE_PATH)
        self.assertEqual(lease["LEASE_STATUS"], gw.RELEASED)
        self.assertGreater(lease["LEASE_EPOCH"], 7)
        stale_heartbeat = make_request(
            "LEASE_HEARTBEAT",
            "run-a",
            {"ttl_seconds": 180},
            request_id="run-a-old-heartbeat",
        )
        stale_heartbeat["lease_epoch"] = 7
        stale_heartbeat["request_sha256"] = ""
        stale_heartbeat["request_sha256"] = gw.sha256_text(
            gw.canonical(stale_heartbeat)
        )
        with self.assertRaises((gw.StaleEpoch, gw.LeaseUnavailable)):
            self.gateway.apply(stale_heartbeat)
    def test_takeover_fences_paused_old_writer(self):
        self.claim()
        old_generation = self.claim_generation()
        req_a = self.patch_request()
        self.gh.pause_patchset = True
        outcome = {}

        def old_writer():
            try:
                outcome["result"] = self.gateway.apply(req_a)
            except Exception as exc:
                outcome["error"] = exc

        t = threading.Thread(target=old_writer)
        t.start()
        self.assertTrue(self.gh.patchset_entered.wait(timeout=3))

        self.gh.expire_claim(130)
        takeover = self.gateway.apply(make_request(
            "WORK_CLAIM_TAKEOVER",
            "run-b",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "B",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 3,
            },
            request_id="run-b-takeover",
        ))
        self.assertEqual(takeover["status"], "CLAIM_TAKEN_OVER")
        new_record = self.gh.json_file(
            CONTROL, "work-claims/issue-130.json"
        )
        self.assertGreater(
            new_record["CLAIM_GENERATION"], old_generation
        )
        fence_head = self.gh.ref(IMPL)

        self.gh.allow_patchset.set()
        t.join(timeout=3)
        self.assertFalse(t.is_alive())
        self.assertIn("error", outcome)
        self.assertIsInstance(
            outcome["error"], (gw.StaleEpoch, gw.CasConflict)
        )
        with self.assertRaises(gw.ApiError):
            self.gh.content(
                IMPL, "prototypes/target-image-threejs/x.txt"
            )
        self.assertEqual(self.gh.ref(IMPL), fence_head)

    def test_patchset_recovery_after_commit_without_claim_finalize(self):
        self.claim()
        req = self.patch_request(content="durable")
        original = self.gateway._update_claim_after_operation
        calls = {"n": 0}

        def fail_once(*args, **kwargs):
            if kwargs.get("phase") == "PATCHSET_APPLIED" and calls["n"] == 0:
                calls["n"] += 1
                raise RuntimeError("simulated crash after implementation commit")
            return original(*args, **kwargs)

        self.gateway._update_claim_after_operation = fail_once
        with self.assertRaisesRegex(RuntimeError, "simulated crash"):
            self.gateway.apply(req)
        self.gateway._update_claim_after_operation = original
        result = self.gateway.apply(req)
        self.assertEqual(result["status"], "PATCHSET_ALREADY_APPLIED")
        claim = self.gh.json_file(CONTROL, "work-claims/issue-130.json")
        self.assertEqual(claim["PHASE"], "PATCHSET_APPLIED")
        self.assertIsNone(claim["ACTIVE_OPERATION_ID"])

    def test_task_complete_recovers_after_close_before_phase_record(self):
        self.claim()
        req = self.complete_request()
        original_update = self.gateway._completion_update
        injected = {"done": False}

        def crash_after_close(*args, **kwargs):
            if (
                kwargs.get("phase") == "ISSUE_CLOSED"
                and not injected["done"]
            ):
                injected["done"] = True
                raise RuntimeError("crash after issue close")
            return original_update(*args, **kwargs)

        self.gateway._completion_update = crash_after_close
        with self.assertRaisesRegex(RuntimeError, "crash after issue close"):
            self.gateway.apply(req)
        self.assertEqual(self.gh.issue_state[130], "closed")

        self.gateway._completion_update = original_update
        result = self.gateway.apply(req)
        self.assertEqual(result["status"], "TASK_COMPLETED")
        claim = self.gh.json_file(CONTROL, "work-claims/issue-130.json")
        self.assertEqual(claim["CLAIM_STATUS"], "RELEASED")
        completion = result["completion"]
        self.assertEqual(completion["PHASE"], "COMPLETE")

        retry = self.gateway.apply(req)
        self.assertEqual(retry["status"], "TASK_ALREADY_COMPLETE")

    def test_unrelated_manual_close_is_not_adopted(self):
        self.claim()
        self.gh.manual_close(130)
        req = self.complete_request()
        with self.assertRaisesRegex(
            gw.RequestRejected, "no durable completion record"
        ):
            self.gateway.apply(req)

    def test_stale_h1_acceptance_cannot_complete_h2(self):
        self.claim()
        h1 = self.gh.ref(IMPL)
        stale = acceptance("T016", h1)
        self.gh.cas_write_files(
            IMPL,
            {"prototypes/target-image-threejs/other.txt": b"h2"},
            "advance to H2",
            expected_head=h1,
        )
        req = self.complete_request(
            acceptance_override=stale,
            request_id="stale-acceptance",
        )
        with self.assertRaisesRegex(
            gw.RequestRejected, "accepted_head"
        ):
            self.gateway.apply(req)

    def test_t019_capture_contract_accepts_no_visual_similarity_requirement(self):
        self.claim(
            worker="B", owner="run-b", issue=133, task="T019"
        )
        req = self.complete_request(
            issue=133,
            task="T019",
            owner="run-b",
            worker="B",
            evaluator="T019_CAPTURE_CONTRACT_V1",
            request_id="t019-complete",
        )
        result = self.gateway.apply(req)
        self.assertEqual(result["status"], "TASK_COMPLETED")

    def test_t019_capture_contract_rejects_wrong_viewport(self):
        self.claim(
            worker="B", owner="run-b", issue=133, task="T019"
        )
        head = self.gh.ref(IMPL)
        bad = acceptance(
            "T019", head, "T019_CAPTURE_CONTRACT_V1"
        )
        bad["runtime_config"] = {
            "viewport": {"width": 390, "height": 844, "dpr": 1}
        }
        bad["evidence_artifacts"] = [
            {
                "kind": "actual.png",
                "uri": "evidence://bad/actual.png",
                "sha256": "4" * 64,
            },
            {
                "kind": "runtime-audit.json",
                "uri": "evidence://bad/runtime.json",
                "sha256": "5" * 64,
            },
        ]
        req = self.complete_request(
            issue=133,
            task="T019",
            owner="run-b",
            worker="B",
            acceptance_override=bad,
            request_id="t019-bad",
        )
        with self.assertRaisesRegex(
            gw.RequestRejected, "941x1672 DPR1"
        ):
            self.gateway.apply(req)

    def test_formal_visual_acceptance_requires_adopted_matching_head(self):
        self.claim()
        head = self.gh.ref(IMPL)
        acc = acceptance(
            "T016", head, "FORMAL_VISUAL_EVIDENCE_V1"
        )
        acc["adoption_id"] = "adopt-1"
        req = self.complete_request(
            acceptance_override=acc,
            request_id="formal-missing",
        )
        with self.assertRaises(gw.ApiError):
            self.gateway.apply(req)

        adoption = {
            "ADOPTION_ID": "adopt-1",
            "CHILD_ISSUE": 130,
            "IMPLEMENTATION_HEAD": "f" * 40,
            "STATE": "ADOPTED_CHILD_NOT_CLOSED",
            "READBACK_VERIFIED": True,
        }
        self.gh.files[(CONTROL, "adoptions/adopt-1.json")] = (
            json.dumps(adoption).encode("utf-8")
        )
        req2 = self.complete_request(
            acceptance_override=acc,
            request_id="formal-wrong-head",
        )
        with self.assertRaises(gw.HeadMismatch):
            self.gateway.apply(req2)

    def test_bounded_recovery_escalates_after_limit(self):
        self.gateway.apply(make_request(
            "WORK_CLAIM_ACQUIRE",
            "run-a",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "A",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 1,
            },
            request_id="claim-limited",
        ))
        self.gh.expire_claim(130)
        first = self.gateway.apply(make_request(
            "WORK_CLAIM_TAKEOVER",
            "run-b",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "B",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 1,
            },
            request_id="takeover-1",
        ))
        self.assertEqual(first["status"], "CLAIM_TAKEN_OVER")
        self.gh.expire_claim(130)
        second = self.gateway.apply(make_request(
            "WORK_CLAIM_TAKEOVER",
            "run-c",
            {
                "issue_number": 130,
                "task_id": "T016",
                "worker_id": "C",
                "claim_ttl_seconds": 7200,
                "progress_deadline_seconds": 1800,
                "max_recovery_attempts": 1,
            },
            request_id="takeover-2",
        ))
        self.assertEqual(second["status"], "WORK_ESCALATED")
        record = self.gh.json_file(
            CONTROL, "work-claims/issue-130.json"
        )
        self.assertEqual(record["CLAIM_STATUS"], "ESCALATED")
        self.assertEqual(
            record["NEXT_RECOVERY_ACTION"], "OWNER_ARBITRATION"
        )

    def test_task_complete_recovers_work_log_written_before_phase_record(self):
        self.claim()
        req = self.complete_request(request_id="log-crash")
        original = self.gateway._completion_update
        injected = {"done": False}

        def crash_after_log(*args, **kwargs):
            if (
                kwargs.get("phase") == "WORK_LOGGED"
                and not injected["done"]
            ):
                injected["done"] = True
                raise RuntimeError("crash after work log")
            return original(*args, **kwargs)

        self.gateway._completion_update = crash_after_log
        with self.assertRaisesRegex(RuntimeError, "crash after work log"):
            self.gateway.apply(req)
        marker = f"[LQ_GATEWAY_OP:{req['operation_id']}]"
        self.assertEqual(len(self.gh.find_comment(130, marker)), 1)

        self.gateway._completion_update = original
        result = self.gateway.apply(req)
        self.assertEqual(result["status"], "TASK_COMPLETED")
        self.assertEqual(len(self.gh.find_comment(130, marker)), 1)

    def test_completed_operation_retry_models_lost_terminal_receipt(self):
        self.claim()
        req = self.complete_request(request_id="lost-receipt")
        first = self.gateway.apply(req)
        self.assertEqual(first["status"], "TASK_COMPLETED")
        second = self.gateway.apply(req)
        self.assertEqual(second["status"], "TASK_ALREADY_COMPLETE")
        record = self.gh.json_file(
            CONTROL,
            self.gateway._completion_path(
                130, req["operation_id"]
            ),
        )
        self.assertEqual(record["PHASE"], "COMPLETE")


if __name__ == "__main__":
    unittest.main()

