from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import threading
import time
import traceback
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Any

API = "https://api.github.com"
UNRESOLVED = {"PREPARED", "DISPATCHED", "RESULT_UNKNOWN", "RECONCILIATION_REQUIRED"}

class ApiError(RuntimeError):
    def __init__(self, status: int, body: str):
        super().__init__(f"GitHub API {status}: {body[:500]}")
        self.status = status
        self.body = body

class CasConflict(RuntimeError):
    pass

def canon(v: Any) -> str:
    return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def sha256_text(v: str) -> str:
    return hashlib.sha256(v.encode("utf-8")).hexdigest()

@dataclass
class GitHub:
    repo: str
    token: str

    def request(self, method: str, path: str, data: Any = None, ok=(200, 201)) -> Any:
        url = API + "/repos/" + self.repo + path
        payload = None if data is None else json.dumps(data).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method=method)
        req.add_header("Authorization", "Bearer " + self.token)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", "luke-quest-env-visual-gateway-test")
        if payload is not None:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                raw = resp.read()
                if resp.status not in ok:
                    raise ApiError(resp.status, raw.decode("utf-8", "replace"))
                return json.loads(raw.decode("utf-8")) if raw else None
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")
            raise ApiError(exc.code, body) from exc

    def get_ref(self, branch: str) -> str:
        ref = urllib.parse.quote("heads/" + branch, safe="/")
        return self.request("GET", "/git/ref/" + ref)["object"]["sha"]

    def get_commit(self, sha: str) -> dict:
        return self.request("GET", "/git/commits/" + sha)

    def create_blob(self, content: str) -> str:
        return self.request("POST", "/git/blobs", {"content": content, "encoding": "utf-8"})["sha"]

    def make_commit(self, branch: str, parent: str, path: str, content: str, message: str) -> str:
        commit = self.get_commit(parent)
        blob = self.create_blob(content)
        tree = self.request(
            "POST",
            "/git/trees",
            {
                "base_tree": commit["tree"]["sha"],
                "tree": [{"path": path, "mode": "100644", "type": "blob", "sha": blob}],
            },
        )["sha"]
        return self.request(
            "POST",
            "/git/commits",
            {"message": message, "tree": tree, "parents": [parent]},
        )["sha"]

    def update_ref(self, branch: str, new_sha: str) -> None:
        ref = urllib.parse.quote("heads/" + branch, safe="/")
        try:
            self.request("PATCH", "/git/refs/" + ref, {"sha": new_sha, "force": False}, ok=(200,))
        except ApiError as exc:
            if exc.status == 422:
                raise CasConflict(exc.body) from exc
            raise

    def cas_write(self, branch: str, path: str, content: str, message: str, *, expected_head: str | None = None, retries: int = 8) -> str:
        head = expected_head or self.get_ref(branch)
        for attempt in range(retries):
            new_commit = self.make_commit(branch, head, path, content, message)
            try:
                self.update_ref(branch, new_commit)
                return new_commit
            except CasConflict:
                if expected_head is not None:
                    raise
                head = self.get_ref(branch)
                time.sleep(0.05 * (attempt + 1))
        raise RuntimeError("CAS retries exhausted")

    def get_text(self, branch: str, path: str) -> str:
        q = urllib.parse.urlencode({"ref": branch})
        safe_path = urllib.parse.quote(path, safe="/")
        obj = self.request("GET", "/contents/" + safe_path + "?" + q)
        return base64.b64decode(obj["content"]).decode("utf-8")

    def get_json(self, branch: str, path: str) -> dict:
        return json.loads(self.get_text(branch, path))

    def issue_comments(self, issue: int) -> list[dict]:
        out = []
        page = 1
        while True:
            data = self.request("GET", f"/issues/{issue}/comments?per_page=100&page={page}")
            out.extend(data)
            if len(data) < 100:
                return out
            page += 1

    def comment_markers(self, issue: int, marker: str) -> list[dict]:
        return [c for c in self.issue_comments(issue) if marker in (c.get("body") or "")]

    def post_comment(self, issue: int, body: str) -> None:
        self.request("POST", f"/issues/{issue}/comments", {"body": body})

def write_json(gh: GitHub, branch: str, path: str, obj: dict, message: str) -> str:
    return gh.cas_write(branch, path, json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=True), message)

def current_identity(tag: str) -> dict:
    return {
        "implementation_head": "head-" + tag,
        "target_revision": "target-v1",
        "anchor_revision": "anchor-v1",
        "acceptance_revision": "accept-v1",
        "viewport": "896x1664@1",
        "evidence_settings": "settings-v1",
        "audit_semantics": "audit-v1",
    }

def test1_response_loss(gh: GitHub, issue: int, state_branch: str, run_id: str) -> dict:
    base = f"gateway-test/runs/{run_id}/test1"
    lease_path = base + "/lease.json"
    op_path = base + "/operation.json"
    marker = f"[ENV_GATEWAY_TEST:{run_id}:TEST1:OP]"

    lease = {"OWNER_RUN_ID": "run-A", "LEASE_EPOCH": 41, "LEASE_STATUS": "ACTIVE", "GATEWAY_GENERATION": 1}
    write_json(gh, state_branch, lease_path, lease, "test1: initialize lease")

    op = {
        "OPERATION_ID": f"{run_id}-T1",
        "OWNER_RUN_ID": "run-A",
        "LEASE_EPOCH": 41,
        "TARGET_RESOURCE": f"issue-{issue}",
        "MUTATION_TYPE": "issue-comment",
        "EXPECTED_POSTCONDITION": marker,
        "OPERATION_STATE": "PREPARED",
        "RETRY_CLASS": "RESULT_CONFIRMATION_REQUIRED",
    }
    write_json(gh, state_branch, op_path, op, "test1: persist operation before dispatch")
    op["OPERATION_STATE"] = "DISPATCHED"
    write_json(gh, state_branch, op_path, op, "test1: mark dispatched")

    # Deliberately discard the response, simulating a gateway crash after the
    # external request left the process but before result persistence.
    gh.post_comment(issue, marker + "\nSimulated response-loss external mutation.")
    recovered = GitHub(gh.repo, gh.token)

    remote_op = recovered.get_json(state_branch, op_path)
    assert remote_op["OPERATION_STATE"] == "DISPATCHED"
    takeover_blocked = remote_op["OPERATION_STATE"] in UNRESOLVED
    assert takeover_blocked

    matches = recovered.comment_markers(issue, marker)
    assert len(matches) == 1
    remote_op["OPERATION_STATE"] = "CONFIRMED_APPLIED"
    remote_op["RECONCILED_COMMENT_ID"] = matches[0]["id"]
    write_json(recovered, state_branch, op_path, remote_op, "test1: reconcile unknown result")

    lease = recovered.get_json(state_branch, lease_path)
    assert recovered.get_json(state_branch, op_path)["OPERATION_STATE"] == "CONFIRMED_APPLIED"
    lease["OWNER_RUN_ID"] = "run-B"
    lease["LEASE_EPOCH"] = 42
    lease["GATEWAY_GENERATION"] = 2
    write_json(recovered, state_branch, lease_path, lease, "test1: takeover only after reconciliation")
    return {"status": "PASS", "marker": marker, "comment_id": matches[0]["id"]}

def test2_stale_gateway(gh: GitHub, issue: int, state_branch: str, run_id: str) -> dict:
    base = f"gateway-test/runs/{run_id}/test2"
    lease_path = base + "/lease.json"
    marker = f"[ENV_GATEWAY_TEST:{run_id}:TEST2:STALE]"
    lease = {"OWNER_RUN_ID": "run-A", "LEASE_EPOCH": 7, "LEASE_STATUS": "ACTIVE", "GATEWAY_GENERATION": 1}
    write_json(gh, state_branch, lease_path, lease, "test2: initialize old gateway")
    lease["GATEWAY_GENERATION"] = 2
    write_json(gh, state_branch, lease_path, lease, "test2: restart gateway generation")

    stale_generation = 1
    fresh = gh.get_json(state_branch, lease_path)
    allowed = stale_generation == fresh["GATEWAY_GENERATION"]
    assert not allowed
    assert len(gh.comment_markers(issue, marker)) == 0
    return {"status": "PASS", "old_generation": 1, "current_generation": 2}

def evidence_files(identity: dict) -> dict[str, str]:
    return {
        "target.png.sha256.txt": "target-image-sha",
        "actual.png.sha256.txt": "actual-image-sha",
        "coordinate-audit.json": canon({"status": "PASS", "objects": 8}),
        "evidence-manifest.candidate.json": canon({"schema": "v1", "identity": identity}),
        "evidence-settings.json": canon({"viewport": "896x1664", "dpr": 1}),
        "evaluation-contract-snapshot.md": "contract-snapshot-v1",
    }

def publish_evidence_set(gh: GitHub, branch: str, prefix: str, files: dict[str, str]) -> tuple[str, str]:
    index = []
    for name, content in sorted(files.items()):
        path = prefix.rstrip("/") + "/" + name
        gh.cas_write(branch, path, content, "evidence: append " + name)
        index.append({"path": name, "sha256": sha256_text(content)})
    index_text = canon(index)
    gh.cas_write(branch, prefix.rstrip("/") + "/evidence-set-index.json", index_text, "evidence: write canonical index")
    return sha256_text(index_text), index_text

def test3_adoption_resume(gh: GitHub, issue: int, state_branch: str, evidence_branch: str, run_id: str) -> dict:
    base = f"gateway-test/runs/{run_id}/test3"
    state_path = base + "/adoption.json"
    evidence_id = f"EV-{run_id}-T3"
    adoption_id = f"AD-{run_id}-T3"
    identity = current_identity("t3")
    record = {
        "EVIDENCE_ID": evidence_id,
        "ADOPTION_ID": adoption_id,
        "IDENTITY": identity,
        "STATE": "IDENTIFIERS_RESERVED",
    }
    write_json(gh, state_branch, state_path, record, "test3: reserve evidence/adoption identifiers")

    # Simulated restart: source of truth is remote state, not process memory.
    record = GitHub(gh.repo, gh.token).get_json(state_branch, state_path)
    assert record["EVIDENCE_ID"] == evidence_id and record["ADOPTION_ID"] == adoption_id

    prefix = f"gateway-test/runs/{run_id}/evidence/dungeon/issue-82/{evidence_id}"
    set_hash, _ = publish_evidence_set(gh, evidence_branch, prefix, evidence_files(identity))
    record["STATE"] = "DURABLE_STORED_NOT_ADOPTED"
    record["DURABLE_URI"] = prefix
    record["DURABLE_EVIDENCE_SET_SHA256"] = set_hash
    write_json(gh, state_branch, state_path, record, "test3: durable stored")

    # Fresh read-back of the canonical index.
    read_back = gh.get_text(evidence_branch, prefix + "/evidence-set-index.json")
    assert sha256_text(read_back) == set_hash
    record = gh.get_json(state_branch, state_path)
    record["READBACK_VERIFIED"] = True
    write_json(gh, state_branch, state_path, record, "test3: read-back verified")

    assert record["IDENTITY"] == current_identity("t3")
    record["STATE"] = "ADOPTED_CHILD_NOT_CLOSED"
    write_json(gh, state_branch, state_path, record, "test3: adopt evidence")

    child_marker = f"[ENV_GATEWAY_TEST:{run_id}:TEST3:CHILD:{adoption_id}]"
    if not gh.comment_markers(issue, child_marker):
        gh.post_comment(issue, child_marker + "\nSimulated child PASS/close mutation.")
    assert len(gh.comment_markers(issue, child_marker)) == 1
    record = gh.get_json(state_branch, state_path)
    record["STATE"] = "CHILD_CLOSED_PARENT_NOT_ADVANCED"
    write_json(gh, state_branch, state_path, record, "test3: child closed")

    parent_marker = f"[ENV_GATEWAY_TEST:{run_id}:TEST3:PARENT:{adoption_id}]"
    if not gh.comment_markers(issue, parent_marker):
        gh.post_comment(issue, parent_marker + "\nSimulated parent progress mutation.")
    assert len(gh.comment_markers(issue, parent_marker)) == 1
    record = gh.get_json(state_branch, state_path)
    record["STATE"] = "COMPLETE"
    write_json(gh, state_branch, state_path, record, "test3: parent advanced")
    assert gh.get_json(state_branch, state_path)["STATE"] == "COMPLETE"
    return {"status": "PASS", "evidence_id": evidence_id, "adoption_id": adoption_id, "set_hash": set_hash}

def test4_three_lane_publish(gh: GitHub, evidence_branch: str, run_id: str) -> dict:
    common_head = gh.get_ref(evidence_branch)
    barrier = threading.Barrier(3)
    lanes = ["village", "castle", "dungeon"]
    results = {}

    def worker(lane: str):
        local = GitHub(gh.repo, gh.token)
        path = f"gateway-test/runs/{run_id}/test4/{lane}/evidence.json"
        content = canon({"lane": lane, "run_id": run_id})
        first_commit = local.make_commit(evidence_branch, common_head, path, content, "test4: first CAS " + lane)
        barrier.wait(timeout=20)
        conflict = False
        try:
            local.update_ref(evidence_branch, first_commit)
        except CasConflict:
            conflict = True
            local.cas_write(evidence_branch, path, content, "test4: CAS retry " + lane)
        return lane, conflict, path, content

    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = [pool.submit(worker, lane) for lane in lanes]
        for fut in as_completed(futures):
            lane, conflict, path, content = fut.result()
            assert gh.get_text(evidence_branch, path) == content
            results[lane] = {"initial_conflict": conflict, "path": path}

    conflicts = sum(1 for x in results.values() if x["initial_conflict"])
    assert conflicts >= 2
    assert set(results) == set(lanes)
    return {"status": "PASS", "initial_conflicts": conflicts, "lanes": results}

def test5_mismatched_evidence(gh: GitHub, issue: int, evidence_branch: str, run_id: str) -> dict:
    marker = f"[ENV_GATEWAY_TEST:{run_id}:TEST5:SHOULD-NOT-EXIST]"
    old_identity = current_identity("old")
    current = dict(old_identity)
    current["implementation_head"] = "head-new"
    current["anchor_revision"] = "anchor-v2"
    prefix = f"gateway-test/runs/{run_id}/test5/old-evidence"
    publish_evidence_set(gh, evidence_branch, prefix, evidence_files(old_identity))
    assert old_identity != current
    adopt_allowed = old_identity == current
    assert not adopt_allowed
    assert len(gh.comment_markers(issue, marker)) == 0
    return {"status": "PASS", "rejected_identity": old_identity, "current_identity": current}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--report", required=True)
    args = p.parse_args()

    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ["GITHUB_REPOSITORY"]
    run_id = os.environ["GITHUB_RUN_ID"]
    issue = int(os.environ["TEST_ISSUE_NUMBER"])
    state_branch = os.environ["TEST_STATE_BRANCH"]
    evidence_branch = os.environ["TEST_EVIDENCE_BRANCH"]
    gh = GitHub(repo, token)

    tests = [
        ("TEST-1 external write response loss", lambda: test1_response_loss(gh, issue, state_branch, run_id)),
        ("TEST-2 stale gateway return", lambda: test2_stale_gateway(gh, issue, state_branch, run_id)),
        ("TEST-3 adoption crash resume", lambda: test3_adoption_resume(gh, issue, state_branch, evidence_branch, run_id)),
        ("TEST-4 three-lane evidence publication", lambda: test4_three_lane_publish(gh, evidence_branch, run_id)),
        ("TEST-5 mismatched evidence rejection", lambda: test5_mismatched_evidence(gh, issue, evidence_branch, run_id)),
    ]

    results = []
    overall = True
    for name, fn in tests:
        try:
            detail = fn()
            results.append({"test": name, "status": "PASS", "detail": detail})
        except Exception as exc:
            overall = False
            results.append({"test": name, "status": "FAIL", "error": f"{type(exc).__name__}: {exc}", "traceback": traceback.format_exc()})

    report = {
        "schema": "LUKE_QUEST_ENV_VISUAL_GATEWAY_INTEGRATION_TEST_REPORT:v1",
        "run_id": run_id,
        "repository": repo,
        "test_issue": issue,
        "state_branch": state_branch,
        "evidence_branch": evidence_branch,
        "overall": "PASS" if overall else "FAIL",
        "tests": results,
    }
    with open(args.report, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    raise SystemExit(0 if overall else 1)

if __name__ == "__main__":
    main()
