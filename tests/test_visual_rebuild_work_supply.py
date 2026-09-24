"""#101 visual-rebuild work supply + worker lifecycle repair tests.

Covers: missing-leaf materialization, idempotency, crash/concurrency
duplicate safety, semantic-only dependencies, half-wired leaves never READY,
capability gates, manifest-backed evaluators, nonterminal async states,
no self-disable on recoverable READY=0, and a fresh-run simulation from the
live post-#141 state into the next legitimate work.
"""
import json
import pathlib
import sys
import threading
import time
import unittest
from concurrent.futures import ThreadPoolExecutor

HERE = pathlib.Path(__file__).resolve().parent
TOOLS = HERE.parent / "tools" / "env_visual_gateway"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

import fenced_gateway as gw  # noqa: E402
import loop_worker_controller as ctl  # noqa: E402
import work_supply as ws  # noqa: E402

FIXTURE = json.loads(
    (HERE / "fixtures" / "visual_rebuild_tasks_88694c28.json").read_text(
        encoding="utf-8"
    )
)
TASKS_TEXT = FIXTURE["text"]
MANIFEST = ws.load_manifest()
SPEC_COMMIT = MANIFEST["spec"]["commit"]
TASKS_PATH = MANIFEST["spec"]["tasks_path"]
LANE = gw.ALLOWED_LANES["visual-rebuild"]
CONTROL = LANE["control_branch"]
IMPL = LANE["implementation_branch"]
TARGET_COMMIT = LANE["target_source_commit_sha"]
TARGET_PATH = LANE["target_path"]
TARGET_BLOB = LANE["target_blob_sha"]

# Live execution leaves observed 2026-09-24 (all CLOSED).
EXISTING = {
    "T005": 118, "T006": 119, "T007": 120, "T008": 121, "T009": 122,
    "T010": 123, "T011": 124, "T012": 125, "T013": 127, "T014": 128,
    "T015": 129, "T016": 130, "T017": 131, "T018": 132, "T019": 133,
    "T020": 134, "T021": 135, "T022": 136, "T023": 139, "T024": 141,
}
RETRY_DUPLICATES = {
    "T018": 137, "T019": 138, "T020": 140, "T021": 142, "T022": 143,
    "T023": 144, "T024": 145,
}
GRAPH = ws.compile_graph(MANIFEST, TASKS_TEXT)
NEW_TASKS = [t for t in GRAPH if t not in EXISTING]


def iid(number):
    return number * 1000 + 7


class FakeRepo:
    def __init__(self, tasks_text=TASKS_TEXT):
        self.lock = threading.RLock()
        self.seq = 1000
        self.refs = {CONTROL: "c" * 40, IMPL: "a" * 40}
        self.files = {}
        self.lease = {
            "PRODUCTION_ENABLED": True,
            "LEASE_STATUS": gw.RELEASED,
            "LEASE_UNTIL": None,
            "ACTIVE_OPERATION_ID": None,
            "OWNER_RUN_ID": None,
            "LEASE_EPOCH": 0,
        }
        self.tasks_text = tasks_text
        self.issues = {}
        self.edges = {}
        self.comments_by_issue = {}
        self.next_number = 200
        self.create_calls = 0
        self.hooks = {}
        self._add(101, "program", "<!-- LQ_VISUAL_REBUILD_WORK_UNIT:v1 -->",
                  "open", None)
        for c in MANIFEST["containers"]:
            state = "closed" if c["issue"] == 103 else "open"
            self._add(c["issue"], c["key"], "container body", state, 101)
        for tid, n in EXISTING.items():
            spec = GRAPH[tid]
            body = (
                "<!-- LQ_EXECUTION_LEAF:v1 -->\n"
                "PARENT_PROGRAM: #101\n"
                f"PARENT_CONTAINER: #{spec.container}\n"
                f"TASK_ID: {tid}\n"
                "WORK_TYPE: EXECUTION_LEAF\n"
                "CLAIMABLE: YES\n"
            )
            self._add(n, ws.leaf_title(spec), body, "closed", spec.container)
        for tid, n in EXISTING.items():
            self.edges[n] = {EXISTING[b] for b in GRAPH[tid].blocked_by}
        # Live retry duplicates: closed NOT_PLANNED, unlinked.
        for tid, n in RETRY_DUPLICATES.items():
            body = self.issues[EXISTING[tid]]["body"]
            self._add(n, ws.leaf_title(GRAPH[tid]), body, "closed", None,
                      state_reason="not_planned")

    # ----------------------------------------------------------- helpers
    def _add(self, number, title, body, state, parent, state_reason=None):
        self.issues[number] = {
            "number": number, "id": iid(number), "title": title,
            "body": body, "state": state, "parent": parent,
            "state_reason": state_reason or (
                "completed" if state == "closed" else None),
        }
        self.edges.setdefault(number, set())

    def _hook(self, name, *args):
        fn = self.hooks.get(name)
        if fn:
            fn(*args)

    def _view(self, number):
        x = self.issues[number]
        return {
            "number": x["number"], "id": x["id"], "title": x["title"],
            "body": x["body"], "state": x["state"],
            "state_reason": x["state_reason"],
            "parent_issue_url": (
                f"https://api.github.com/repos/x/y/issues/{x['parent']}"
                if x["parent"] is not None else None
            ),
        }

    def leaves_for(self, tid):
        return [
            n for n, x in self.issues.items()
            if "LQ_EXECUTION_LEAF:v1" in x["body"]
            and f"TASK_ID: {tid}\n" in x["body"]
            and x["state_reason"] != "not_planned"
        ]

    def only_leaf(self, tid):
        found = self.leaves_for(tid)
        assert len(found) == 1, (tid, found)
        return found[0]

    def close(self, number):
        with self.lock:
            self.issues[number]["state"] = "closed"

    # ------------------------------------------------------------ git api
    def ref(self, branch):
        with self.lock:
            return self.refs[branch]

    def content(self, branch, path):
        with self.lock:
            if branch == TARGET_COMMIT and path == TARGET_PATH:
                return b"target", TARGET_BLOB
            if branch == SPEC_COMMIT and path == TASKS_PATH:
                return self.tasks_text.encode("utf-8"), "tasks"
            key = (branch, path)
            if key not in self.files:
                raise gw.ApiError(404, "not found")
            return self.files[key], "blob"

    def text(self, branch, path):
        return self.content(branch, path)[0].decode("utf-8")

    def json_file(self, branch, path):
        with self.lock:
            if branch == CONTROL and path == gw.LEASE_PATH:
                return dict(self.lease)
            return json.loads(self.text(branch, path))

    def cas_write_files(self, branch, files, message, expected_head=None,
                        retries=8):
        self._hook("cas", message)
        with self.lock:
            if expected_head is not None and expected_head != self.refs[branch]:
                raise gw.CasConflict("head mismatch")
            for path, content in files.items():
                if branch == CONTROL and path == gw.LEASE_PATH:
                    self.lease = json.loads(content.decode("utf-8"))
                else:
                    self.files[(branch, path)] = bytes(content)
            self.seq += 1
            self.refs[branch] = f"{self.seq:040x}"
            return self.refs[branch]

    # ---------------------------------------------------------- issue api
    def issue(self, number):
        with self.lock:
            if number not in self.issues:
                raise gw.ApiError(404, "no issue")
            return self._view(number)

    def list_issues(self, since=None):
        with self.lock:
            return [self._view(n) for n in sorted(self.issues)]

    def create_issue(self, title, body):
        self._hook("create", title)
        with self.lock:
            self.create_calls += 1
            n = self.next_number
            self.next_number += 1
            self._add(n, title, body, "open", None)
            return self._view(n)

    def update_issue_body(self, number, body):
        with self.lock:
            self.issues[number]["body"] = body
            return self._view(number)

    def add_sub_issue(self, parent, child_id):
        self._hook("link", parent, child_id)
        with self.lock:
            child = next(n for n, x in self.issues.items() if x["id"] == child_id)
            if self.issues[child]["parent"] is not None:
                raise gw.ApiError(422, "already has parent")
            self.issues[child]["parent"] = parent
            return self._view(child)

    def add_blocked_by(self, number, blocker_id):
        self._hook("dep", number, blocker_id)
        with self.lock:
            blocker = next(
                n for n, x in self.issues.items() if x["id"] == blocker_id
            )
            if blocker in self.edges[number]:
                raise gw.ApiError(422, "duplicate dependency")
            self.edges[number].add(blocker)
            return self._view(number)

    def blocked_by(self, number):
        with self.lock:
            return [self._view(b) for b in sorted(self.edges.get(number, ()))]

    def comments(self, issue):
        with self.lock:
            return [dict(c) for c in self.comments_by_issue.get(issue, [])]

    def find_comment(self, issue, marker):
        return [c for c in self.comments(issue) if marker in c["body"]]

    def post_comment(self, issue, body):
        with self.lock:
            lst = self.comments_by_issue.setdefault(issue, [])
            c = {"id": len(lst) + 1, "body": body}
            lst.append(c)
            return dict(c)


def request(op, owner, payload, *, request_id=None):
    request_id = request_id or f"{owner}-{op.lower()}"
    req = {
        "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id": request_id,
        "lane_id": "visual-rebuild",
        "owner_run_id": owner,
        "lease_epoch": 0,
        "operation_id": request_id + "-op",
        "operation_type": op,
        "expected_lane_head": None,
        "expected_target_identity": {
            "target_source_commit_sha": TARGET_COMMIT,
            "target_blob_sha": TARGET_BLOB,
        },
        "payload": payload,
        "created_at": gw.now_rfc3339(),
        "request_sha256": "",
    }
    req["request_sha256"] = gw.sha256_text(gw.canonical(req))
    return req


def claim_payload(issue, task, worker, caps=None):
    payload = {
        "issue_number": issue, "task_id": task, "worker_id": worker,
        "claim_ttl_seconds": 7200, "progress_deadline_seconds": 1800,
        "max_recovery_attempts": 3,
    }
    if caps is not None:
        payload["worker_capabilities"] = caps
    return payload


class Clock:
    def __init__(self, t=1_800_000_000.0):
        self.t = t

    def __call__(self):
        return self.t


# ==========================================================================
class ManifestAuthorityTests(unittest.TestCase):
    def test_manifest_compiles_all_spec_tasks(self):
        self.assertEqual(len(GRAPH), 114)
        self.assertEqual(list(GRAPH)[0], "T001")
        self.assertEqual(list(GRAPH)[-1], "T114")
        self.assertEqual(FIXTURE["sha256"], MANIFEST["spec"]["tasks_sha256"])
        # T025+ exist in the spec (Failure B root cause: never materialized).
        for tid in ("T025", "T036", "T047", "T094", "T114"):
            self.assertIn(tid, GRAPH)

    def test_existing_leaf_edges_match_live_hand_authored_graph(self):
        self.assertEqual(GRAPH["T024"].blocked_by,
                         ("T018", "T020", "T021", "T022", "T023"))
        self.assertEqual(GRAPH["T019"].evaluator, "T019_CAPTURE_CONTRACT_V1")
        self.assertEqual(GRAPH["T024"].evaluator, "FORMAL_VISUAL_EVIDENCE_V1")

    def test_manifest_evaluators_agree_with_gateway_literal_table(self):
        evaluators = ws.task_evaluators(MANIFEST)
        for tid, ev in gw.CURRENT_TASK_EVALUATORS.items():
            self.assertEqual(evaluators[tid], ev, tid)

    def test_spec_drift_fails_closed_without_mutation(self):
        repo = FakeRepo(tasks_text=TASKS_TEXT + "- [ ] T115 extra\n")
        report = ws.WorkSupply(repo, run_id="r").reconcile(apply=True)
        self.assertEqual(report["status"], "SPEC_DRIFT")
        self.assertEqual(repo.create_calls, 0)

    def test_cycle_is_rejected(self):
        bad = json.loads(json.dumps(MANIFEST))
        bad["tasks"]["T025"]["blocked_by"] = ["T035"]
        with self.assertRaisesRegex(ws.GraphInvalid, "cycle"):
            ws.compile_graph(bad, TASKS_TEXT)


# ==========================================================================
class MaterializationTests(unittest.TestCase):
    def setUp(self):
        self.repo = FakeRepo()
        self.clock = Clock()

    def supply(self, run_id="run-1"):
        return ws.WorkSupply(self.repo, run_id=run_id, clock=self.clock)

    def test_dry_run_plans_exactly_the_missing_leaves(self):
        report = self.supply().reconcile(apply=False)
        planned = [p["task_id"] for p in report["planned"]
                   if p["op"] == "create_leaf"]
        self.assertEqual(planned, NEW_TASKS)
        self.assertEqual(len(planned), 94)
        self.assertEqual(self.repo.create_calls, 0)
        self.assertEqual(report["program_state"], "INCOMPLETE")

    def test_missing_leaves_materialized_under_containers_and_idempotent(self):
        first = self.supply().reconcile(apply=True)
        self.assertEqual(first["status"], "SUPPLY_OK", first["anomalies"])
        self.assertEqual(len(first["created"]), 94)
        for tid in NEW_TASKS:
            n = self.repo.only_leaf(tid)
            leaf = self.repo.issues[n]
            self.assertEqual(leaf["parent"], GRAPH[tid].container, tid)
            self.assertIn("CLAIMABLE: YES", leaf["body"])
            self.assertIn(f"ACCEPTANCE_EVALUATOR: {GRAPH[tid].evaluator}",
                          leaf["body"])
        calls = self.repo.create_calls
        edges = {n: set(e) for n, e in self.repo.edges.items()}

        second = self.supply(run_id="run-2").reconcile(apply=True)
        self.assertEqual(second["status"], "SUPPLY_OK")
        self.assertEqual(second["created"], [])
        self.assertEqual(second["dependencies_added"], [])
        self.assertEqual(second["activated"], [])
        self.assertEqual(second["anomalies"], [])
        self.assertEqual(self.repo.create_calls, calls)
        self.assertEqual({n: set(e) for n, e in self.repo.edges.items()}, edges)

    def test_retry_duplicates_closed_not_planned_are_ignored(self):
        report = self.supply().reconcile(apply=False)
        self.assertEqual(report["anomalies"], [])
        self.assertEqual(
            sorted(x["issue"] for x in report["ignored_superseded"]),
            sorted(RETRY_DUPLICATES.values()),
        )
        planned = {p["task_id"] for p in report["planned"]
                   if p["op"] == "create_leaf"}
        self.assertFalse(planned & set(RETRY_DUPLICATES))
        self.assertEqual(report["closed_task_count"], 20)

    def test_bounded_batches_resume_to_the_same_result(self):
        seen = set()
        for i in range(20):
            report = self.supply(run_id=f"batch-{i}").reconcile(
                apply=True, missing_only=True, max_create=12
            )
            seen.update(x["task_id"] for x in report["created"])
            if not report["missing_after"]:
                break
        self.assertEqual(seen, set(NEW_TASKS))
        for tid in NEW_TASKS:
            self.assertIn("CLAIMABLE: YES",
                          self.repo.issues[self.repo.only_leaf(tid)]["body"])

    def test_crash_after_create_is_adopted_not_duplicated(self):
        def crash_on_record(message):
            if message.startswith("work supply issue-created"):
                raise RuntimeError("runner died after issues.create")
        self.repo.hooks["cas"] = crash_on_record
        with self.assertRaises(RuntimeError):
            self.supply(run_id="crashed").reconcile(apply=True)
        self.assertEqual(len(self.repo.leaves_for("T001")), 1)
        self.repo.hooks.clear()

        report = self.supply(run_id="recover").reconcile(apply=True)
        self.assertEqual(len(self.repo.leaves_for("T001")), 1)
        self.assertIn("T001", [x["task_id"] for x in report["recovered"]])
        self.assertEqual(report["missing_after"], [])
        n = self.repo.only_leaf("T001")
        self.assertEqual(self.repo.issues[n]["parent"], 102)
        self.assertIn("CLAIMABLE: YES", self.repo.issues[n]["body"])
        record = self.repo.json_file(CONTROL, "work-supply/tasks/T001.json")
        self.assertEqual(record["STATE"], "ISSUE_CREATED")
        self.assertEqual(record["ISSUE"], n)

    def test_fresh_foreign_reservation_is_in_flight_then_stale_recreated(self):
        def crash_on_create(title):
            if title.startswith("T001:"):
                raise RuntimeError("died before issues.create")
        self.repo.hooks["create"] = crash_on_create
        with self.assertRaises(RuntimeError):
            self.supply(run_id="dead").reconcile(apply=True)
        self.repo.hooks.clear()
        self.assertEqual(self.repo.leaves_for("T001"), [])

        busy = self.supply(run_id="other").reconcile(
            apply=True, missing_only=True
        )
        self.assertEqual(busy["status"], "SUPPLY_IN_FLIGHT")
        self.assertEqual(self.repo.leaves_for("T001"), [])

        self.clock.t += ws.INFLIGHT_STALE_SECONDS + 1
        done = self.supply(run_id="later").reconcile(apply=True)
        self.assertEqual(len(self.repo.leaves_for("T001")), 1)
        self.assertEqual(done["missing_after"], [])

    def test_concurrent_reconcilers_create_each_leaf_once(self):
        barrier = threading.Barrier(2)

        def run(i):
            barrier.wait()
            return ws.WorkSupply(
                self.repo, run_id=f"race-{i}", clock=self.clock
            ).reconcile(apply=True)

        with ThreadPoolExecutor(max_workers=2) as pool:
            list(pool.map(run, range(2)))
        self.supply(run_id="settle").reconcile(apply=True)
        for tid in GRAPH:
            self.assertEqual(len(self.repo.leaves_for(tid)), 1, tid)

    def test_half_wired_leaf_is_never_claimable(self):
        target_task = "T026"

        def fail_dep(number, blocker_id):
            body = self.repo.issues[number]["body"]
            if f"TASK_ID: {target_task}\n" in body:
                raise gw.ApiError(502, "dependency api outage")
        self.repo.hooks["dep"] = fail_dep
        with self.assertRaises(gw.ApiError):
            self.supply(run_id="partial").reconcile(apply=True)
        self.repo.hooks.clear()
        n = self.repo.only_leaf(target_task)
        self.assertIn("CLAIMABLE: PENDING_DEPENDENCIES",
                      self.repo.issues[n]["body"])
        gateway = gw.Gateway(self.repo, production_enabled=True)
        with self.assertRaisesRegex(gw.RequestRejected, "not claimable"):
            gateway.apply(request(
                "WORK_CLAIM_ACQUIRE", "run-x",
                claim_payload(n, target_task, "A", ["IPHONE_REAL_DEVICE"]),
            ))
        # The cheap poller pass finishes wiring and activates it.
        self.supply(run_id="poller").reconcile(apply=True, missing_only=True)
        self.assertIn("CLAIMABLE: YES", self.repo.issues[n]["body"])
        self.assertEqual(
            self.repo.edges[n], {self.repo.only_leaf("T025")}
        )


# ==========================================================================
class DependencySemanticsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.repo = FakeRepo()
        ws.WorkSupply(cls.repo, run_id="deps").reconcile(apply=True)

    def blockers(self, tid):
        n = self.repo.only_leaf(tid)
        rev = {v: k for k, v in
               {t: self.repo.only_leaf(t) for t in GRAPH}.items()}
        return sorted(rev[b] for b in self.repo.edges[n])

    def test_live_edges_equal_declared_semantic_edges_exactly(self):
        for tid in NEW_TASKS:
            self.assertEqual(self.blockers(tid),
                             sorted(GRAPH[tid].blocked_by), tid)

    def test_parallel_tasks_are_not_serialized(self):
        for tid in ("T026", "T027", "T028", "T029", "T031", "T032"):
            self.assertEqual(self.blockers(tid), ["T025"], tid)
        for tid in ("T036", "T037", "T038", "T039"):
            self.assertEqual(self.blockers(tid), ["T024", "T025"], tid)

    def test_no_edge_targets_a_container_or_forward_task(self):
        containers = {c["issue"] for c in MANIFEST["containers"]}
        for tid in NEW_TASKS:
            n = self.repo.only_leaf(tid)
            self.assertFalse(self.repo.edges[n] & containers, tid)
            for b in GRAPH[tid].blocked_by:
                self.assertLess(int(b[1:]), int(tid[1:]), (tid, b))

    def test_no_bulk_phase_ordering(self):
        # A gate PASS task must not be blocked by every earlier task.
        self.assertLess(len(GRAPH["T047"].blocked_by), 8)
        self.assertEqual(GRAPH["T095"].blocked_by, ())
        self.assertEqual(GRAPH["T001"].blocked_by, ())


# ==========================================================================
class GatewayIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.repo = FakeRepo()
        self.gateway = gw.Gateway(self.repo, production_enabled=True)

    def reconcile_via_gateway(self, rid):
        return self.gateway.apply(request(
            "WORK_SUPPLY_RECONCILE", "worker-a-run", {"mode": "FULL",
                                                      "max_create": 40},
            request_id=rid,
        ))

    def full_supply(self):
        for i in range(5):
            result = self.reconcile_via_gateway(f"supply-{i}")
            if not result["report"]["missing_after"]:
                return result
        self.fail("supply did not converge")

    def test_gateway_reconcile_operation_is_idempotent(self):
        result = self.full_supply()
        self.assertEqual(result["status"], "WORK_SUPPLY_RECONCILED")
        calls = self.repo.create_calls
        again = self.reconcile_via_gateway("supply-again")
        self.assertEqual(again["report"]["created"], [])
        self.assertEqual(self.repo.create_calls, calls)

    def test_completed_t024_leads_to_t025_then_g1_leaves(self):
        report = self.full_supply()["report"]
        ready = sorted(
            x["task_id"] for x in report["frontier"]
            if x["claimable"] and not x["open_blocker_tasks"]
            and x["capability"] == "STANDARD"
        )
        self.assertEqual(ready, ["T001", "T004", "T025", "T095"])

        t025 = self.repo.only_leaf("T025")
        got = self.gateway.apply(request(
            "WORK_CLAIM_ACQUIRE", "run-a", claim_payload(t025, "T025", "A")))
        self.assertEqual(got["status"], "CLAIM_ACQUIRED")

        t036 = self.repo.only_leaf("T036")
        self.assertEqual(self.repo.issues[t036]["parent"], 106)  # G1
        with self.assertRaisesRegex(gw.RequestRejected, "open blockers"):
            self.gateway.apply(request(
                "WORK_CLAIM_ACQUIRE", "run-b",
                claim_payload(t036, "T036", "B")))

        self.repo.close(t025)  # T025 TASK_COMPLETE
        report = self.reconcile_via_gateway("after-t025")["report"]
        ready = {
            x["task_id"] for x in report["frontier"]
            if x["claimable"] and not x["open_blocker_tasks"]
        }
        for tid in ("T036", "T037", "T038", "T039", "T040"):
            self.assertIn(tid, ready)
        got = self.gateway.apply(request(
            "WORK_CLAIM_ACQUIRE", "run-b", claim_payload(t036, "T036", "B")))
        self.assertEqual(got["status"], "CLAIM_ACQUIRED")

    def test_same_issue_cannot_be_double_claimed(self):
        self.full_supply()
        n = self.repo.only_leaf("T025")
        barrier = threading.Barrier(2)

        def attempt(worker):
            barrier.wait()
            try:
                return self.gateway.apply(request(
                    "WORK_CLAIM_ACQUIRE", f"run-{worker}",
                    claim_payload(n, "T025", worker)))["status"]
            except gw.GatewayError as exc:
                return type(exc).__name__

        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(attempt, ["A", "B"]))
        self.assertEqual(results.count("CLAIM_ACQUIRED"), 1, results)

    def test_container_is_not_an_execution_unit(self):
        self.full_supply()
        with self.assertRaisesRegex(gw.RequestRejected, "not an execution leaf"):
            self.gateway.apply(request(
                "WORK_CLAIM_ACQUIRE", "run-a", claim_payload(105, "T025", "A")))

    def test_device_leaf_requires_declared_capability(self):
        self.full_supply()
        self.repo.close(self.repo.only_leaf("T025"))
        n = self.repo.only_leaf("T026")
        with self.assertRaisesRegex(gw.RequestRejected, "IPHONE_REAL_DEVICE"):
            self.gateway.apply(request(
                "WORK_CLAIM_ACQUIRE", "run-a", claim_payload(n, "T026", "A")))
        got = self.gateway.apply(request(
            "WORK_CLAIM_ACQUIRE", "owner-device",
            claim_payload(n, "T026", "OWNER", ["IPHONE_REAL_DEVICE"])))
        self.assertEqual(got["status"], "CLAIM_ACQUIRED")

    def test_manifest_capability_cannot_be_downgraded_by_issue_body(self):
        self.full_supply()
        self.repo.close(self.repo.only_leaf("T025"))
        n = self.repo.only_leaf("T026")
        body = self.repo.issues[n]["body"].replace(
            "REQUIRED_CAPABILITY: IPHONE_REAL_DEVICE",
            "REQUIRED_CAPABILITY: STANDARD",
        )
        self.repo.update_issue_body(n, body)
        with self.assertRaisesRegex(gw.RequestRejected, "declaration drift"):
            self.gateway.apply(request(
                "WORK_CLAIM_ACQUIRE", "run-a", claim_payload(n, "T026", "A")))

    def test_manifest_evaluator_cannot_be_downgraded_by_issue_body(self):
        self.full_supply()
        n = self.repo.only_leaf("T047")
        self.assertEqual(self.gateway._required_task_evaluator(n, "T047"),
                         "FORMAL_VISUAL_EVIDENCE_V1")
        body = self.repo.issues[n]["body"].replace(
            "ACCEPTANCE_EVALUATOR: FORMAL_VISUAL_EVIDENCE_V1",
            "ACCEPTANCE_EVALUATOR: INFRASTRUCTURE_TEST_V1")
        self.repo.update_issue_body(n, body)
        with self.assertRaisesRegex(gw.RequestRejected, "declaration drift"):
            self.gateway._required_task_evaluator(n, "T047")

    def test_new_leaf_task_complete_evaluator_is_resolvable(self):
        # Before the repair T025+ had no control evaluator at all.
        self.assertEqual(gw.control_task_evaluator("T025"),
                         "INFRASTRUCTURE_TEST_V1")
        self.assertEqual(gw.control_task_evaluator("T094"),
                         "FORMAL_VISUAL_EVIDENCE_V1")


# ==========================================================================
NOW = 1_800_000_000.0


def iso(t):
    return ws._rfc3339(t)


def snapshot(**kw):
    base = {
        "worker_id": "A", "rank": 1, "capabilities": ["STANDARD"],
        "now": NOW, "run_budget_remaining_seconds": 3000,
        "claims": [], "own_requests": [], "supply": None,
        "supply_reconciled_this_run": False,
    }
    base.update(kw)
    return base


def live_claim(worker, issue, task, **kw):
    c = {
        "ISSUE": issue, "TASK_ID": task, "WORKER_ID": worker,
        "OWNER_RUN_ID": f"run-{worker}", "CLAIM_GENERATION": 1,
        "CLAIM_STATUS": "ACTIVE", "CLAIM_UNTIL": iso(NOW + 7000),
        "PROGRESS_DEADLINE_AT": iso(NOW + 1700), "PHASE": "CLAIMED",
        "NEXT_RECOVERY_ACTION": "EXECUTE_TASK",
    }
    c.update(kw)
    return c


def supply_report(frontier, missing=(), program_state="INCOMPLETE"):
    return {
        "status": "SUPPLY_OK" if not missing else "SUPPLY_REPAIR_PLANNED",
        "frontier": frontier, "missing_after": list(missing),
        "program_state": program_state,
    }


def leaf(task, issue, blockers=(), cap="STANDARD", claimable=True):
    return {"task_id": task, "issue": issue, "capability": cap,
            "claimable": claimable, "open_blocker_tasks": list(blockers)}


class WorkerLifecycleTests(unittest.TestCase):
    def test_every_pending_async_stage_is_nonterminal(self):
        for stage in ("DRAFT", "REQUEST", "PENDING", "NO_RECEIPT"):
            d = ctl.decide_next_action(snapshot(own_requests=[
                {"request_id": "r1", "operation_type": "WORK_CLAIM_ACQUIRE",
                 "issue": 136, "stage": stage}
            ]))
            self.assertEqual(d.action, "WAIT_FOR_RECEIPT", stage)
            self.assertFalse(d.ends_run, stage)

    def test_failure_a_replay_waits_then_advances_in_same_run(self):
        rid = "worker-a-20260923T163900Z-run12-t022-claim-lease"
        # 01:39:52 JST: request finalized, poller dispatched, no receipt yet.
        waiting = ctl.decide_next_action(snapshot(own_requests=[
            {"request_id": rid, "operation_type": "WORK_CLAIM_ACQUIRE",
             "issue": 136, "stage": ctl.receipt_stage(
                 draft_exists=True, request_exists=True, receipt=None)}
        ]))
        self.assertEqual(waiting.action, "WAIT_FOR_RECEIPT")
        self.assertFalse(waiting.ends_run)
        # 01:40:03 JST: terminal receipt LEASE_ACQUIRED -> advance now.
        receipt = {"terminal": True, "ok": True,
                   "result": {"status": "LEASE_ACQUIRED"}}
        advanced = ctl.decide_next_action(snapshot(own_requests=[
            {"request_id": rid, "operation_type": "WORK_CLAIM_ACQUIRE",
             "issue": 136, "stage": ctl.receipt_stage(
                 draft_exists=True, request_exists=True, receipt=receipt)}
        ]))
        self.assertEqual(advanced.action, "ADVANCE_AFTER_RECEIPT")
        self.assertEqual(advanced.next_step, "EXECUTE_TASK")
        self.assertFalse(advanced.ends_run)

    def test_wait_timeout_is_not_an_endpoint(self):
        stage = ctl.receipt_stage(draft_exists=True, request_exists=True,
                                  receipt={"terminal": False})
        self.assertEqual(stage, "PENDING")
        self.assertIn(stage, ctl.NONTERMINAL_REQUEST_STAGES)

    def test_rejected_receipt_routes_to_repair(self):
        d = ctl.decide_next_action(snapshot(own_requests=[
            {"request_id": "r", "operation_type": "IMPLEMENTATION_PATCHSET",
             "stage": "TERMINAL_REJECTED", "error": "HeadMismatch"}]))
        self.assertEqual(d.action, "REPAIR_AFTER_REJECTED_RECEIPT")
        self.assertFalse(d.ends_run)

    def test_owned_leaf_is_continued_before_any_new_claim(self):
        d = ctl.decide_next_action(snapshot(
            claims=[live_claim("A", 141, "T024", OWNER_RUN_ID="run-a-prev",
                               NEXT_RECOVERY_ACTION="RUN_ACCEPTANCE_EVALUATOR")],
            supply=supply_report([leaf("T025", 300)]),
        ))
        self.assertEqual(d.action, "CONTINUE_OWNED_CLAIM")
        self.assertEqual(d.owner_run_id, "run-a-prev")
        self.assertEqual(d.next_step, "RUN_ACCEPTANCE_EVALUATOR")

    def test_near_deadline_renews_and_expired_takes_over(self):
        near = ctl.decide_next_action(snapshot(claims=[live_claim(
            "A", 300, "T025", PROGRESS_DEADLINE_AT=iso(NOW + 100))]))
        self.assertEqual(near.action, "RENEW_OWNED_CLAIM")
        expired = ctl.decide_next_action(snapshot(claims=[live_claim(
            "A", 300, "T025", PROGRESS_DEADLINE_AT=iso(NOW - 1))]))
        self.assertEqual(expired.action, "TAKEOVER_STALE_CLAIM")

    def test_missing_leaves_trigger_supply_reconcile_not_disable(self):
        # The exact Failure B state: G0 done, T025+ have no leaves.
        d = ctl.decide_next_action(snapshot(
            supply=supply_report([], missing=["T025", "T026"])))
        self.assertEqual(d.action, "REQUEST_WORK_SUPPLY_RECONCILE")
        self.assertFalse(d.ends_run)
        d = ctl.decide_next_action(snapshot(supply=None))
        self.assertEqual(d.action, "REQUEST_WORK_SUPPLY_RECONCILE")

    def test_ready_zero_with_others_working_is_a_quiet_wait(self):
        d = ctl.decide_next_action(snapshot(
            claims=[live_claim("B", 300, "T025")],
            supply=supply_report([leaf("T025", 300),
                                  leaf("T036", 311, ["T025"])]),
            supply_reconciled_this_run=True,
        ))
        self.assertEqual(d.action, "WAIT_FOR_UPSTREAM_IN_PROGRESS")
        self.assertFalse(d.self_disable)

    def test_only_device_work_left_is_an_owner_capability_gate(self):
        d = ctl.decide_next_action(snapshot(
            supply=supply_report([leaf("T026", 301, cap="IPHONE_REAL_DEVICE"),
                                  leaf("T033", 308, ["T026"],
                                       cap="IPHONE_REAL_DEVICE")]),
            supply_reconciled_this_run=True,
        ))
        self.assertEqual(d.action, "OWNER_GATE_CAPABILITY")
        self.assertIn("T026#301:IPHONE_REAL_DEVICE", d.detail)

    def test_rank_spreads_workers_across_ready_leaves(self):
        frontier = [leaf("T001", 201), leaf("T004", 204), leaf("T025", 300)]
        picks = [
            ctl.decide_next_action(snapshot(
                worker_id=w, rank=r, supply=supply_report(frontier))).task_id
            for w, r in (("A", 1), ("B", 2), ("C", 3))
        ]
        self.assertEqual(picks, ["T001", "T004", "T025"])

    def test_checkpoint_only_at_budget_tail(self):
        pending = [{"request_id": "r", "operation_type": "TASK_COMPLETE",
                    "stage": "PENDING"}]
        self.assertEqual(ctl.decide_next_action(snapshot(
            own_requests=pending)).action, "WAIT_FOR_RECEIPT")
        self.assertEqual(ctl.decide_next_action(snapshot(
            own_requests=pending, run_budget_remaining_seconds=120)).action,
            "CHECKPOINT_BEFORE_BUDGET_EXHAUSTED")

    def test_program_complete_is_owner_final_gate(self):
        d = ctl.decide_next_action(snapshot(supply=supply_report(
            [], program_state="TASKS_COMPLETE_OWNER_FINAL_GATE")))
        self.assertEqual(d.action, "PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE")

    def test_no_decision_ever_self_disables(self):
        self.assertFalse(ctl.SELF_DISABLE_PERMITTED)
        stages = ["DRAFT", "PENDING", "TERMINAL_OK", "TERMINAL_REJECTED", None]
        frontiers = [
            [], [leaf("T025", 300)],
            [leaf("T036", 311, ["T025"])],
            [leaf("T026", 301, cap="IPHONE_REAL_DEVICE")],
            [leaf("T025", 300, claimable=False)],
        ]
        claim_sets = [[], [live_claim("B", 300, "T025")],
                      [live_claim("A", 300, "T025")],
                      [live_claim("C", 300, "T025", CLAIM_STATUS="ESCALATED")]]
        for stage in stages:
            for fr in frontiers:
                for claims in claim_sets:
                    for reconciled in (False, True):
                        for budget in (60, 600, 3000):
                            reqs = ([] if stage is None else [
                                {"request_id": "r", "operation_type":
                                 "WORK_CLAIM_ACQUIRE", "stage": stage}])
                            d = ctl.decide_next_action(snapshot(
                                claims=claims, own_requests=reqs,
                                supply=supply_report(fr),
                                supply_reconciled_this_run=reconciled,
                                run_budget_remaining_seconds=budget))
                            self.assertFalse(d.self_disable)
                            self.assertFalse(d.as_dict()["self_disable"])
                            self.assertIn(
                                d.action,
                                ctl.CONTINUE_ACTIONS | ctl.RUN_END_ACTIONS)

    def test_controller_built_completion_request_has_valid_hash(self):
        source = {"lane_id": "visual-rebuild", "expected_target_identity": {
            "target_source_commit_sha": TARGET_COMMIT,
            "target_blob_sha": TARGET_BLOB}}
        claim = live_claim("A", 300, "T025")
        req = ctl.build_completion_request(
            source, claim, request_id="a-t025-complete", exact_head="f" * 40,
            acceptance={"schema": "LQ_TASK_ACCEPTANCE:v1"}, summary="done")
        self.assertEqual(req["operation_type"], "TASK_COMPLETE")
        self.assertEqual(req["expected_lane_head"], "f" * 40)
        gw.Gateway(FakeRepo(), production_enabled=True)._validate_hash(req)


# ==========================================================================
class FreshRunSimulationTests(unittest.TestCase):
    """Live post-#141 state -> fresh Worker run reaches executable work."""

    def test_fresh_worker_run_reaches_next_incomplete_task(self):
        repo = FakeRepo()  # G0 complete, #141 closed, no T025+ leaves
        gateway = gw.Gateway(repo, production_enabled=True)
        state = {"supply": None, "reconciled": False, "requests": [],
                 "claims": []}
        trace = []
        for _ in range(30):
            d = ctl.decide_next_action(snapshot(
                now=time.time(),  # Gateway stamps claims with the real clock
                worker_id="A", rank=1, claims=state["claims"],
                own_requests=state["requests"], supply=state["supply"],
                supply_reconciled_this_run=state["reconciled"]))
            trace.append(d.action)
            self.assertFalse(d.self_disable)
            if d.action == "REQUEST_WORK_SUPPLY_RECONCILE":
                rid = f"a-supply-{len(trace)}"
                state["requests"] = [{"request_id": rid, "operation_type":
                                      "WORK_SUPPLY_RECONCILE",
                                      "stage": "REQUEST"}]
                state["pending_req"] = request(
                    "WORK_SUPPLY_RECONCILE", "run-a",
                    {"mode": "FULL", "max_create": 40}, request_id=rid)
            elif d.action == "WAIT_FOR_RECEIPT":
                result = gateway.apply(state["pending_req"])  # poller
                state["requests"][0]["stage"] = "TERMINAL_OK"
                state["last_result"] = result
            elif d.action == "ADVANCE_AFTER_RECEIPT":
                result = state["last_result"]
                if "report" in result:
                    state["supply"] = result["report"]
                    state["reconciled"] = not result["report"]["missing_after"]
                else:
                    state["claims"] = [result["claim"]]
                state["requests"] = []
            elif d.action == "CLAIM_READY_LEAF":
                rid = f"a-claim-{d.task_id.lower()}"
                state["requests"] = [{"request_id": rid, "operation_type":
                                      "WORK_CLAIM_ACQUIRE", "issue": d.issue,
                                      "stage": "DRAFT"}]
                state["pending_req"] = request(
                    "WORK_CLAIM_ACQUIRE", "run-a",
                    claim_payload(d.issue, d.task_id, "A"), request_id=rid)
            elif d.action == "CONTINUE_OWNED_CLAIM":
                break
            else:
                self.fail(f"unexpected run end {d.action} trace={trace}")
        supply_round = ["REQUEST_WORK_SUPPLY_RECONCILE", "WAIT_FOR_RECEIPT",
                        "ADVANCE_AFTER_RECEIPT"]
        claim_round = ["CLAIM_READY_LEAF", "WAIT_FOR_RECEIPT",
                       "ADVANCE_AFTER_RECEIPT", "CONTINUE_OWNED_CLAIM"]
        # 94 missing leaves at max_create=40 -> three bounded supply rounds,
        # then one claim, all inside one run with no Owner action.
        self.assertEqual(trace, supply_round * 3 + claim_round, trace)
        self.assertEqual(d.task_id, "T001")  # rank 1 -> lowest READY task
        self.assertEqual(d.next_step, "EXECUTE_TASK")
        claim = repo.json_file(CONTROL, f"work-claims/issue-{d.issue}.json")
        self.assertEqual(claim["CLAIM_STATUS"], "ACTIVE")
        self.assertEqual(claim["WORKER_ID"], "A")


if __name__ == "__main__":
    unittest.main()
