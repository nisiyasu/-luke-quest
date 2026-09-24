"""Deterministic #101 visual-rebuild Work Supply reconciler.

tasks.md at the pinned spec commit is the task authority.  The work-graph
manifest (visual_rebuild_work_graph.json) binds every task to its container,
semantic blockers, acceptance evaluator and required capability.  The
reconciler makes GitHub match that graph:

* every task has exactly one LQ_EXECUTION_LEAF:v1 Issue under its container
* every OPEN leaf carries its declared Native blocked_by edges

Creation is idempotent and crash-safe: a control-branch reservation record
(work-supply/tasks/<TASK>.json) is CAS-written before the Issue is created,
the Issue body carries a unique supply marker, and a recovering reconciler
adopts an Issue carrying that marker instead of creating a second one.
Nothing is ever deleted, closed, or unlinked.
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
import time
from dataclasses import dataclass
from typing import Any, Callable

try:
    from . import fenced_gateway as gw
except ImportError:
    import fenced_gateway as gw

MANIFEST_PATH = pathlib.Path(__file__).with_name(
    "visual_rebuild_work_graph.json"
)
LEAF_MARKER = "LQ_EXECUTION_LEAF:v1"
SUPPLY_MARKER = "LQ_WORK_SUPPLY_LEAF:v1"
RECORD_DIR = "work-supply/tasks"
SUPERSEDED_REASONS = {"not_planned", "duplicate"}
INFLIGHT_STALE_SECONDS = 600
KNOWN_EVALUATORS = {
    "INFRASTRUCTURE_TEST_V1",
    "T019_CAPTURE_CONTRACT_V1",
    "FORMAL_VISUAL_EVIDENCE_V1",
}
TASK_LINE_RE = re.compile(r"^- \[[ xX]\] (T\d{3}) (.+?)\s*$")
TASK_ID_RE = re.compile(r"^T\d{3}$")


def _is_gateway_error(exc: BaseException, name: str) -> bool:
    """Match Gateway errors by class name: fenced_gateway may be loaded twice
    (as __main__ or under a test alias), yielding distinct class objects."""
    return any(cls.__name__ == name for cls in type(exc).__mro__)


class SpecDrift(gw.RequestRejected):
    """tasks.md no longer matches the manifest; fail closed."""


class GraphInvalid(gw.RequestRejected):
    """The manifest itself is inconsistent; fail closed."""


@dataclass(frozen=True)
class LeafSpec:
    task_id: str
    text: str
    container: int
    gate: str
    blocked_by: tuple[str, ...]
    evaluator: str
    capability: str
    why: str


def load_manifest(path: pathlib.Path | str = MANIFEST_PATH) -> dict:
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def task_evaluators(manifest: dict | None = None) -> dict[str, str]:
    manifest = manifest or load_manifest()
    default = manifest["defaults"]["evaluator"]
    return {
        tid: str(entry.get("evaluator") or default)
        for tid, entry in manifest["tasks"].items()
    }


def task_capabilities(manifest: dict | None = None) -> dict[str, str]:
    manifest = manifest or load_manifest()
    default = manifest["defaults"]["capability"]
    return {
        tid: str(entry.get("capability") or default)
        for tid, entry in manifest["tasks"].items()
    }


def parse_tasks(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for raw in text.splitlines():
        m = TASK_LINE_RE.match(raw.strip())
        if not m:
            continue
        tid, body = m.group(1), m.group(2).strip()
        if tid in out:
            raise SpecDrift(f"duplicate task id in tasks.md: {tid}")
        out[tid] = body
    if not out:
        raise SpecDrift("tasks.md contains no task lines")
    return out


def _num(tid: str) -> int:
    return int(tid[1:])


def compile_graph(manifest: dict, tasks_text: str) -> dict[str, LeafSpec]:
    expected_hash = manifest["spec"]["tasks_sha256"]
    actual_hash = gw.sha256_bytes(tasks_text.encode("utf-8"))
    if actual_hash != expected_hash:
        raise SpecDrift(
            "tasks.md hash differs from manifest pin "
            f"expected={expected_hash} actual={actual_hash}"
        )
    tasks = parse_tasks(tasks_text)
    declared = manifest["tasks"]
    if set(tasks) != set(declared):
        missing = sorted(set(tasks) - set(declared))
        extra = sorted(set(declared) - set(tasks))
        raise SpecDrift(
            f"manifest task set drift missing={missing} extra={extra}"
        )
    capabilities = set(manifest["capabilities"])
    default_eval = manifest["defaults"]["evaluator"]
    default_cap = manifest["defaults"]["capability"]

    owner: dict[str, dict] = {}
    for c in manifest["containers"]:
        for n in range(_num(c["first"]), _num(c["last"]) + 1):
            tid = f"T{n:03d}"
            if tid in owner:
                raise GraphInvalid(f"task {tid} mapped to two containers")
            owner[tid] = c
    unmapped = sorted(set(tasks) - set(owner))
    if unmapped:
        raise GraphInvalid(f"tasks without container: {unmapped}")

    graph: dict[str, LeafSpec] = {}
    for tid in sorted(tasks, key=_num):
        entry = declared[tid]
        blockers = tuple(entry.get("blocked_by") or ())
        for b in blockers:
            if b == tid:
                raise GraphInvalid(f"{tid} blocks itself")
            if b not in tasks:
                raise GraphInvalid(f"{tid} blocked by unknown task {b}")
        if len(set(blockers)) != len(blockers):
            raise GraphInvalid(f"{tid} has duplicate blockers")
        if not str(entry.get("why") or "").strip():
            raise GraphInvalid(f"{tid} dependency rationale missing")
        evaluator = str(entry.get("evaluator") or default_eval)
        if evaluator not in KNOWN_EVALUATORS:
            raise GraphInvalid(f"{tid} unknown evaluator {evaluator}")
        capability = str(entry.get("capability") or default_cap)
        if capability not in capabilities:
            raise GraphInvalid(f"{tid} unknown capability {capability}")
        c = owner[tid]
        graph[tid] = LeafSpec(
            task_id=tid,
            text=tasks[tid],
            container=int(c["issue"]),
            gate=str(c["gate"]),
            blocked_by=blockers,
            evaluator=evaluator,
            capability=capability,
            why=str(entry["why"]).strip(),
        )
    _assert_acyclic(graph)
    return graph


def _assert_acyclic(graph: dict[str, LeafSpec]) -> None:
    indegree = {tid: len(spec.blocked_by) for tid, spec in graph.items()}
    dependents: dict[str, list[str]] = {tid: [] for tid in graph}
    for tid, spec in graph.items():
        for b in spec.blocked_by:
            dependents[b].append(tid)
    queue = [tid for tid, d in indegree.items() if d == 0]
    seen = 0
    while queue:
        tid = queue.pop()
        seen += 1
        for dep in dependents[tid]:
            indegree[dep] -= 1
            if indegree[dep] == 0:
                queue.append(dep)
    if seen != len(graph):
        cyclic = sorted(t for t, d in indegree.items() if d > 0)
        raise GraphInvalid(f"dependency cycle among {cyclic}")


def leaf_title(spec: LeafSpec) -> str:
    return f"{spec.task_id}: {spec.text.replace('`', '')}"


def supply_marker(spec: LeafSpec, manifest: dict) -> str:
    return (
        f"<!-- {SUPPLY_MARKER} TASK_ID={spec.task_id} "
        f"SPEC_COMMIT={manifest['spec']['commit']} -->"
    )


CLAIMABLE_PENDING = "PENDING_DEPENDENCIES"


def leaf_body(
    spec: LeafSpec, manifest: dict, *, claimable: str = CLAIMABLE_PENDING
) -> str:
    """Leaves are born unclaimable; they turn YES only after every declared
    blocked_by edge is live, so a half-wired leaf can never look READY."""
    s = manifest["spec"]
    program = manifest["program_issue"]
    blockers = ",".join(spec.blocked_by) if spec.blocked_by else "NONE"
    capability_note = (
        "- Scheduled Worker (STANDARD capability) may claim this Leaf."
        if spec.capability == "STANDARD"
        else f"- Requires {spec.capability}: "
        f"{manifest['capabilities'][spec.capability]} "
        "WORK_CLAIM_ACQUIRE must declare this capability."
    )
    return "\n".join(
        [
            f"<!-- {LEAF_MARKER} -->",
            f"FEATURE_REF: {s['feature_ref']}",
            f"PARENT_PROGRAM: #{program}",
            f"PARENT_CONTAINER: #{spec.container}",
            f"TASK_ID: {spec.task_id}",
            "WORK_TYPE: EXECUTION_LEAF",
            f"CLAIMABLE: {claimable}",
            f"GATE: {spec.gate}",
            f"ACCEPTANCE_EVALUATOR: {spec.evaluator}",
            f"REQUIRED_CAPABILITY: {spec.capability}",
            f"BLOCKED_BY_TASKS: {blockers}",
            f"SPEC_COMMIT: {s['commit']}",
            f"SPEC_REF: {s['spec_ref']}",
            f"PLAN_REF: {s['plan_ref']}",
            f"TASKS_REF: {s['tasks_path']}",
            "",
            "## Scope",
            f"tasks.md {spec.task_id}: {spec.text}",
            "",
            f"Dependency rationale: {spec.why}",
            "",
            "## Acceptance",
            f"- tasks.md の {spec.task_id} を省略せず実行する。",
            "- 使用した branch / exact commit SHA / file / command / test / "
            "evidence をIssueへ耐久記録する。",
            "- 推測や過去会話だけでPASSしない。",
            f"- TASK_COMPLETE は {spec.evaluator} の exact-head "
            "LQ_TASK_ACCEPTANCE:v1 PASS にだけ束縛する。",
            "- Acceptance / Evidenceが成立した場合のみこのLeafをcloseする。",
            f"- Container #{spec.container} 自体をWorkerの実行仕事として"
            "claim/closeしない。",
            capability_note,
            "",
            "## Safety",
            "- 旧フィールド本線 #12 / prototype/modern-3d の継続開発authorityを"
            "変更しない。",
            f"- #{program}新本線のproduct persistent mutationは"
            "visual-rebuild Gateway契約に従う。",
            "- G1 Whitebox PASS前にmodel/material/light/decorへ進まない。",
            "",
            supply_marker(spec, manifest),
            "",
        ]
    )


def _body_field(body: str, key: str) -> str | None:
    prefix = key + ":"
    for raw in body.splitlines():
        line = raw.strip()
        if line.startswith(prefix):
            return line[len(prefix):].strip()
    return None


def _parent_number(issue: dict) -> int | None:
    url = issue.get("parent_issue_url")
    if not url:
        return None
    try:
        return int(str(url).rstrip("/").rsplit("/", 1)[-1])
    except ValueError:
        return None


def leaf_task_id(issue: dict, program: int, containers: set[int]) -> str | None:
    """Return TASK_ID when the Issue is a #program execution leaf."""
    if issue.get("pull_request"):
        return None
    body = str(issue.get("body") or "")
    if LEAF_MARKER not in body:
        return None
    tid = _body_field(body, "TASK_ID") or ""
    if not TASK_ID_RE.match(tid):
        return None
    program_field = _body_field(body, "PARENT_PROGRAM")
    if program_field != f"#{program}" and _parent_number(issue) not in containers:
        return None
    return tid


class WorkSupply:
    def __init__(
        self,
        gh: Any,
        manifest: dict | None = None,
        *,
        run_id: str,
        clock: Callable[[], float] = time.time,
    ):
        self.gh = gh
        self.manifest = manifest or load_manifest()
        self.run_id = run_id
        self.clock = clock
        cfg = gw.ALLOWED_LANES[self.manifest["lane_id"]]
        self.control = cfg["control_branch"]
        self.program = int(self.manifest["program_issue"])
        self.containers = {int(c["issue"]) for c in self.manifest["containers"]}

    # ---------------------------------------------------------------- read
    def load_graph(self) -> dict[str, LeafSpec]:
        s = self.manifest["spec"]
        text = self.gh.text(s["commit"], s["tasks_path"])
        return compile_graph(self.manifest, text)

    def observe_leaves(
        self, superseded: list[dict] | None = None
    ) -> dict[str, list[dict]]:
        by_task: dict[str, list[dict]] = {}
        for issue in self.gh.list_issues():
            tid = leaf_task_id(issue, self.program, self.containers)
            if not tid:
                continue
            if (
                str(issue.get("state")).lower() == "closed"
                and str(issue.get("state_reason") or "").lower()
                in SUPERSEDED_REASONS
            ):
                # Closed without completion (e.g. retry duplicates #137-#145):
                # neither work nor completion evidence.
                if superseded is not None:
                    superseded.append(
                        {"task_id": tid, "issue": int(issue["number"]),
                         "state_reason": issue.get("state_reason")}
                    )
                continue
            by_task.setdefault(tid, []).append(issue)
        for issues in by_task.values():
            issues.sort(key=lambda x: int(x["number"]))
        return by_task

    def _record_path(self, tid: str) -> str:
        return f"{RECORD_DIR}/{tid}.json"

    def _read_record(self, tid: str) -> dict | None:
        try:
            return self.gh.json_file(self.control, self._record_path(tid))
        except Exception as exc:
            if _is_gateway_error(exc, "ApiError") and getattr(
                exc, "status", None
            ) == 404:
                return None
            raise

    def _find_marked_issue(self, spec: LeafSpec, since: str | None) -> dict | None:
        marker = supply_marker(spec, self.manifest)
        for issue in self.gh.list_issues(since=since):
            if marker in str(issue.get("body") or "") and not issue.get(
                "pull_request"
            ):
                return issue
        return None

    # --------------------------------------------------------------- write
    def _ensure_linked(self, spec: LeafSpec, issue: dict, report: dict) -> None:
        parent = _parent_number(issue)
        if parent == spec.container:
            return
        if parent is not None:
            report["anomalies"].append(
                {
                    "kind": "LEAF_UNDER_WRONG_CONTAINER",
                    "task_id": spec.task_id,
                    "issue": int(issue["number"]),
                    "parent": parent,
                    "expected_parent": spec.container,
                }
            )
            return
        self.gh.add_sub_issue(spec.container, int(issue["id"]))
        report["linked"].append(
            {"task_id": spec.task_id, "issue": int(issue["number"]),
             "container": spec.container}
        )

    def _write_records(
        self, records: dict[str, dict], message: str,
        *, expected_head: str | None = None,
    ) -> None:
        self.gh.cas_write_files(
            self.control,
            {
                self._record_path(tid): (
                    json.dumps(rec, ensure_ascii=False, indent=2,
                               sort_keys=True) + "\n"
                ).encode("utf-8")
                for tid, rec in records.items()
            },
            message,
            expected_head=expected_head,
        )

    def _materialize(
        self, specs: list[LeafSpec], report: dict
    ) -> dict[str, dict]:
        """Create missing leaves exactly once.

        1. one CAS commit reserves every task in the batch (PREPARED)
        2. Issues are created with the unique supply marker
        3. one commit records ISSUE numbers; each leaf is linked
        A crash anywhere is recovered by marker adoption; a fresh foreign
        reservation is left alone until INFLIGHT_STALE_SECONDS.
        """
        result: dict[str, dict] = {}
        pending = list(specs)
        for _ in range(8):
            if not pending:
                return result
            head = self.gh.ref(self.control)
            reserve: list[tuple[LeafSpec, dict]] = []
            for spec in pending:
                tid = spec.task_id
                marker = supply_marker(spec, self.manifest)
                record = self._read_record(tid)
                if record and record.get("ISSUE"):
                    issue = self.gh.issue(int(record["ISSUE"]))
                    if marker not in str(issue.get("body") or ""):
                        raise GraphInvalid(
                            f"supply record for {tid} points at unmarked "
                            f"issue #{record['ISSUE']}"
                        )
                    self._ensure_linked(spec, issue, report)
                    result[tid] = self.gh.issue(int(record["ISSUE"]))
                    continue
                if record and record.get("STATE") == "PREPARED":
                    prepared_at = gw.parse_time(record.get("PREPARED_AT")) or 0.0
                    found = self._find_marked_issue(
                        spec,
                        since=_rfc3339(prepared_at - 120) if prepared_at else None,
                    )
                    if found:
                        self._adopt(spec, record, found, report)
                        result[tid] = self.gh.issue(int(found["number"]))
                        continue
                    if (
                        record.get("RECONCILER_RUN_ID") != self.run_id
                        and self.clock() - prepared_at < INFLIGHT_STALE_SECONDS
                    ):
                        report["in_flight"].append(
                            {"task_id": tid, "reconciler_run_id":
                             record.get("RECONCILER_RUN_ID")}
                        )
                        continue
                reserve.append((spec, {
                    "schema": "LQ_WORK_SUPPLY_RECORD:v1",
                    "TASK_ID": tid,
                    "STATE": "PREPARED",
                    "CONTAINER": spec.container,
                    "SPEC_COMMIT": self.manifest["spec"]["commit"],
                    "MARKER": marker,
                    "RECONCILER_RUN_ID": self.run_id,
                    "PREPARED_AT": _rfc3339(self.clock()),
                    "ATTEMPT": int((record or {}).get("ATTEMPT", 0)) + 1,
                }))
            if not reserve:
                return result
            try:
                self._write_records(
                    {s.task_id: rec for s, rec in reserve},
                    f"work supply reserve {len(reserve)} tasks "
                    f"{reserve[0][0].task_id}..{reserve[-1][0].task_id}",
                    expected_head=head,
                )
            except Exception as exc:
                if _is_gateway_error(exc, "CasConflict"):
                    pending = [s for s, _ in reserve]
                    continue
                raise
            created: list[tuple[LeafSpec, dict, dict]] = []
            for spec, rec in reserve:
                issue = self.gh.create_issue(
                    leaf_title(spec), leaf_body(spec, self.manifest)
                )
                created.append((spec, rec, issue))
            self._write_records(
                {
                    spec.task_id: self._adopted_record(rec, issue)
                    for spec, rec, issue in created
                },
                f"work supply issue-created {len(created)} tasks",
            )
            for spec, _, issue in created:
                n = int(issue["number"])
                report["created"].append({"task_id": spec.task_id, "issue": n})
                self._ensure_linked(spec, self.gh.issue(n), report)
                result[spec.task_id] = self.gh.issue(n)
            return result
        raise gw.CasConflict("work supply reservation retries exhausted")

    def _adopted_record(self, record: dict, issue: dict) -> dict:
        done = dict(record)
        done.update(
            {
                "STATE": "ISSUE_CREATED",
                "ISSUE": int(issue["number"]),
                "ISSUE_NODE_ID": int(issue["id"]),
                "ADOPTED_BY_RUN_ID": self.run_id,
                "ADOPTED_AT": _rfc3339(self.clock()),
            }
        )
        return done

    def _adopt(
        self, spec: LeafSpec, record: dict, issue: dict, report: dict
    ) -> None:
        """Recovery: bind an already-created marked Issue to its record."""
        self._write_records(
            {spec.task_id: self._adopted_record(record, issue)},
            f"work supply {spec.task_id} ISSUE_CREATED (recovered)",
        )
        report["recovered"].append(
            {"task_id": spec.task_id, "issue": int(issue["number"])}
        )
        self._ensure_linked(spec, self.gh.issue(int(issue["number"])), report)

    # ----------------------------------------------------------- reconcile
    def reconcile(
        self,
        *,
        apply: bool,
        missing_only: bool = False,
        max_create: int | None = None,
    ) -> dict:
        report: dict[str, Any] = {
            "schema": "LQ_WORK_SUPPLY_REPORT:v1",
            "mode": ("APPLY" if apply else "DRY_RUN")
            + ("_MISSING_ONLY" if missing_only else ""),
            "program_issue": self.program,
            "spec_commit": self.manifest["spec"]["commit"],
            "reconciler_run_id": self.run_id,
            "observed_at": _rfc3339(self.clock()),
            "created": [],
            "recovered": [],
            "linked": [],
            "dependencies_added": [],
            "planned": [],
            "in_flight": [],
            "anomalies": [],
        }
        try:
            graph = self.load_graph()
        except SpecDrift as exc:
            report["status"] = "SPEC_DRIFT"
            report["error"] = str(exc)
            return report
        report["ignored_superseded"] = []
        leaves = self.observe_leaves(report["ignored_superseded"])

        for tid, issues in leaves.items():
            if tid not in graph:
                report["anomalies"].append(
                    {"kind": "LEAF_FOR_UNKNOWN_TASK", "task_id": tid,
                     "issues": [int(i["number"]) for i in issues]}
                )
            elif len(issues) > 1:
                report["anomalies"].append(
                    {"kind": "DUPLICATE_LEAF", "task_id": tid,
                     "issues": [int(i["number"]) for i in issues]}
                )

        missing = [tid for tid in graph if tid not in leaves]
        report["missing_before"] = missing
        touched: set[str] = set()
        deferred: list[str] = []
        batch: list[LeafSpec] = []
        for tid in missing:
            spec = graph[tid]
            if not apply:
                report["planned"].append(
                    {"op": "create_leaf", "task_id": tid,
                     "container": spec.container, "title": leaf_title(spec)}
                )
            elif max_create is not None and len(batch) >= max_create:
                deferred.append(tid)
            else:
                batch.append(spec)
        for tid, issue in self._materialize(batch, report).items():
            leaves[tid] = [issue]
            touched.add(tid)
        for tid, issues in leaves.items():
            if tid in graph and tid not in touched and len(issues) == 1 and apply:
                spec, issue = graph[tid], issues[0]
                if _parent_number(issue) is None and supply_marker(
                    spec, self.manifest
                ) in str(issue.get("body") or ""):
                    # Crash between create and record/link: finish adoption.
                    record = self._read_record(tid) or {
                        "schema": "LQ_WORK_SUPPLY_RECORD:v1", "TASK_ID": tid
                    }
                    self._adopt(spec, record, issue, report)
                    leaves[tid] = [self.gh.issue(int(issue["number"]))]
                else:
                    self._ensure_linked(spec, issue, report)

        pending = {
            tid for tid, issues in leaves.items()
            if tid in graph and len(issues) == 1
            and _body_field(str(issues[0].get("body") or ""), "CLAIMABLE")
            == CLAIMABLE_PENDING
        }
        dep_scope = (touched | pending) if missing_only else set(graph)
        if not apply:
            dep_scope |= set(missing)
        self._reconcile_dependencies(graph, leaves, dep_scope, apply, report)
        if not missing_only:
            report["frontier"] = self._frontier(graph, leaves)

        remaining = [tid for tid in graph if tid not in leaves]
        closed = [
            tid for tid in graph
            if tid in leaves
            and all(str(i.get("state")).lower() == "closed" for i in leaves[tid])
        ]
        report["missing_after"] = remaining
        report["task_count"] = len(graph)
        report["closed_task_count"] = len(closed)
        report["program_state"] = (
            "TASKS_COMPLETE_OWNER_FINAL_GATE"
            if len(closed) == len(graph)
            else "INCOMPLETE"
        )
        report["deferred"] = deferred
        if report["in_flight"]:
            report["status"] = "SUPPLY_IN_FLIGHT"
        elif deferred:
            # Bounded batch; the next reconcile resumes from the same records.
            report["status"] = "SUPPLY_PARTIAL"
        elif remaining and apply:
            report["status"] = "SUPPLY_INCOMPLETE"
        elif report["in_flight"]:
            report["status"] = "SUPPLY_IN_FLIGHT"
        elif not apply and report["planned"]:
            report["status"] = "SUPPLY_REPAIR_PLANNED"
        else:
            report["status"] = "SUPPLY_OK"
        return report

    def _reconcile_dependencies(
        self,
        graph: dict[str, LeafSpec],
        leaves: dict[str, list[dict]],
        scope: set[str],
        apply: bool,
        report: dict,
    ) -> None:
        report.setdefault("activated", [])
        for tid in sorted(scope, key=_num):
            spec = graph[tid]
            issues = leaves.get(tid) or []
            if not issues and not apply:
                for b in spec.blocked_by:
                    report["planned"].append(
                        {"op": "dependency_add_for_new_leaf",
                         "task_id": tid, "blocker_task_id": b}
                    )
                report["planned"].append(
                    {"op": "activate_leaf_after_dependencies", "task_id": tid}
                )
                continue
            if len(issues) != 1:
                continue
            leaf = issues[0]
            if str(leaf.get("state")).lower() != "open":
                continue
            current = {int(x["number"]) for x in self.gh.blocked_by(
                int(leaf["number"])
            )}
            desired: dict[int, dict] = {}
            unresolved = False
            for b in spec.blocked_by:
                blockers = leaves.get(b) or []
                if len(blockers) != 1:
                    unresolved = True
                    report["planned"].append(
                        {"op": "dependency_add_after_blocker_exists",
                         "task_id": tid, "blocker_task_id": b}
                    )
                    continue
                desired[int(blockers[0]["number"])] = blockers[0]
            for number, blocker in sorted(desired.items()):
                if number in current:
                    continue
                edge = {"task_id": tid, "issue": int(leaf["number"]),
                        "blocked_by_issue": number}
                if apply:
                    self.gh.add_blocked_by(int(leaf["number"]), int(blocker["id"]))
                    report["dependencies_added"].append(edge)
                    current.add(number)
                else:
                    unresolved = True
                    report["planned"].append({"op": "dependency_add", **edge})
            undeclared = sorted(current - set(desired))
            if undeclared:
                report["anomalies"].append(
                    {"kind": "UNDECLARED_DEPENDENCY", "task_id": tid,
                     "issue": int(leaf["number"]), "blocked_by": undeclared}
                )
            body = str(leaf.get("body") or "")
            if _body_field(body, "CLAIMABLE") != CLAIMABLE_PENDING:
                continue
            if unresolved:
                continue
            if not apply:
                report["planned"].append(
                    {"op": "activate_leaf", "task_id": tid,
                     "issue": int(leaf["number"])}
                )
                continue
            live = {int(x["number"]) for x in self.gh.blocked_by(
                int(leaf["number"])
            )}
            if not set(desired).issubset(live):
                report["anomalies"].append(
                    {"kind": "DEPENDENCY_READBACK_MISSING", "task_id": tid,
                     "issue": int(leaf["number"]),
                     "missing": sorted(set(desired) - live)}
                )
                continue
            self.gh.update_issue_body(
                int(leaf["number"]),
                body.replace(
                    f"CLAIMABLE: {CLAIMABLE_PENDING}", "CLAIMABLE: YES", 1
                ),
            )
            leaf["body"] = body.replace(
                f"CLAIMABLE: {CLAIMABLE_PENDING}", "CLAIMABLE: YES", 1
            )
            report["activated"].append(
                {"task_id": tid, "issue": int(leaf["number"])}
            )

    def _frontier(
        self, graph: dict[str, LeafSpec], leaves: dict[str, list[dict]]
    ) -> list[dict]:
        """Open leaves with their open blockers (declared or live)."""
        state = {
            tid: str(issues[0].get("state")).lower()
            for tid, issues in leaves.items() if len(issues) == 1
        }
        number = {
            tid: int(issues[0]["number"])
            for tid, issues in leaves.items() if len(issues) == 1
        }
        out = []
        for tid, spec in graph.items():
            if state.get(tid) != "open":
                continue
            open_blockers = [
                b for b in spec.blocked_by if state.get(b) != "closed"
            ]
            body = str(leaves[tid][0].get("body") or "")
            out.append(
                {
                    "task_id": tid,
                    "issue": number[tid],
                    "claimable": _body_field(body, "CLAIMABLE") == "YES",
                    "capability": spec.capability,
                    "evaluator": spec.evaluator,
                    "open_blocker_tasks": open_blockers,
                }
            )
        return out


def _rfc3339(ts: float) -> str:
    from datetime import datetime, timezone

    return (
        datetime.fromtimestamp(ts, timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )


def _token() -> str:
    for key in ("LQ_ENV_GATEWAY_WRITER_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"):
        if os.environ.get(key):
            return os.environ[key]
    out = subprocess.run(
        ["gh", "auth", "token"], capture_output=True, text=True, check=True
    )
    return out.stdout.strip()


class ThrottledGitHub(gw.GitHub):
    """CLI client: paces writes and backs off on secondary rate limits."""

    def __init__(self, repo: str, token: str, write_interval: float = 1.0):
        super().__init__(repo, token)
        self.write_interval = write_interval

    def request(self, method, path, data=None, ok=(200, 201)):
        for attempt in range(6):
            try:
                result = super().request(method, path, data, ok=ok)
                if method != "GET":
                    time.sleep(self.write_interval)
                return result
            except gw.ApiError as exc:
                limited = exc.status in (403, 429) and (
                    "rate limit" in exc.body.lower()
                )
                if not limited or attempt == 5:
                    raise
                time.sleep(60 * (attempt + 1))
        raise AssertionError("unreachable")


def _prefer_ipv4() -> None:
    """Local CLI only: some networks return an unroutable NAT64 AAAA record
    first, costing ~20s per urllib connection before IPv4 fallback."""
    import socket

    original = socket.getaddrinfo

    def ordered(*args, **kwargs):
        infos = original(*args, **kwargs)
        return sorted(infos, key=lambda x: x[0] != socket.AF_INET)

    socket.getaddrinfo = ordered


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--repo", default=os.environ.get(
        "GITHUB_REPOSITORY", "nisiyasu/-luke-quest"))
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--missing-only", action="store_true")
    ap.add_argument("--max-create", type=int)
    ap.add_argument("--run-id", default=f"work-supply-cli-{int(time.time())}")
    args = ap.parse_args(argv)
    _prefer_ipv4()
    gh = ThrottledGitHub(args.repo, _token())
    report = WorkSupply(gh, run_id=args.run_id).reconcile(
        apply=args.apply,
        missing_only=args.missing_only,
        max_create=args.max_create,
    )
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    ok = {"SUPPLY_OK", "SUPPLY_REPAIR_PLANNED", "SUPPLY_PARTIAL"}
    return 0 if report["status"] in ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
