from __future__ import annotations

import argparse
import base64
import hashlib
import io
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from datetime import datetime, timezone
from typing import Any

API = "https://api.github.com"

ACTIVE = "ACTIVE"
RELEASED = "RELEASED"
PREPARED = "PREPARED"
DISPATCHED = "DISPATCHED"
CONFIRMED_APPLIED = "CONFIRMED_APPLIED"
CONFIRMED_NOT_APPLIED = "CONFIRMED_NOT_APPLIED"
RESULT_UNKNOWN = "RESULT_UNKNOWN"
RECONCILIATION_REQUIRED = "RECONCILIATION_REQUIRED"

ALLOWED_LANES = {
    "village": {
        "parent": 51,
        "children": set(range(54, 68)),
        "implementation_branch": "environment/village",
        "control_branch": "control/lease-village",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_path": "references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png",
        "target_blob_sha": "e6536371eddcc7fb5cf5803568216f008011a5f1",
    },
    "castle": {
        "parent": 52,
        "children": set(range(68, 82)),
        "implementation_branch": "environment/castle",
        "control_branch": "control/lease-castle",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_path": "references/target-quality/environments/CASTLE_INTERIOR_TARGET_OWNER_20260914.png",
        "target_blob_sha": "573c13225471820d063043a37e3ee26fad389d63",
    },
    "dungeon": {
        "parent": 53,
        "children": set(range(82, 96)),
        "implementation_branch": "environment/dungeon",
        "control_branch": "control/lease-dungeon",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_path": "references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png",
        "target_blob_sha": "198d0f5f3da115b70218ae8180d5f8363d744959",
    },
    "visual-rebuild": {
        "parent": 101,
        "children": set(range(102, 117)),
        "allow_descendants": True,
        "implementation_branch": "experiment/target-image-threejs-v1",
        "control_branch": "control/lease-visual-rebuild",
        "target_source_commit_sha": "90635ceff9d35d69f80da350df1e6ea0610657dd",
        "target_path": "assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png",
        "target_blob_sha": "b7281e6580689a7a22cfa3b67d500950e4af7285",
    },
}
EVIDENCE_BRANCH = "evidence/visual-verification"
LEASE_PATH = "lease-state.json"
CANONICAL_VIEWPORT = [941, 1672]
UNRESOLVED = {PREPARED, DISPATCHED, RESULT_UNKNOWN, RECONCILIATION_REQUIRED}


class GatewayError(RuntimeError):
    pass


class ApiError(GatewayError):
    def __init__(self, status: int, body: str):
        super().__init__(f"GitHub API {status}: {body[:1000]}")
        self.status = status
        self.body = body


class CasConflict(GatewayError):
    pass


class StaleEpoch(GatewayError):
    pass


class LeaseUnavailable(GatewayError):
    pass


class HeadMismatch(GatewayError):
    pass


class ActiveOperation(GatewayError):
    pass


class RequestRejected(GatewayError):
    pass


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_text(value: str) -> str:
    return sha256_bytes(value.encode("utf-8"))


def now_rfc3339() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def parse_time(value: str | None) -> float | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()


class GitHub:
    def __init__(self, repo: str, token: str):
        self.repo = repo
        self.token = token

    def request(self, method: str, path: str, data: Any = None, ok=(200, 201)) -> Any:
        url = API + "/repos/" + self.repo + path
        payload = None if data is None else json.dumps(data).encode("utf-8")
        req = urllib.request.Request(url, data=payload, method=method)
        req.add_header("Authorization", "Bearer " + self.token)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", "luke-quest-env-fenced-gateway")
        if payload is not None:
            req.add_header("Content-Type", "application/json")
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                raw = resp.read()
                if resp.status not in ok:
                    raise ApiError(resp.status, raw.decode("utf-8", "replace"))
                return json.loads(raw.decode("utf-8")) if raw else None
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")
            raise ApiError(exc.code, body) from exc

    def artifact_metadata(self, artifact_id: int) -> dict:
        return self.request("GET", f"/actions/artifacts/{artifact_id}")

    def artifact_zip(self, artifact_id: int) -> bytes:
        url = API + "/repos/" + self.repo + f"/actions/artifacts/{artifact_id}/zip"
        req = urllib.request.Request(url, method="GET")
        req.add_header("Authorization", "Bearer " + self.token)
        req.add_header("Accept", "application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        req.add_header("User-Agent", "luke-quest-env-fenced-gateway")
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read()
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "replace")
            raise ApiError(exc.code, body) from exc

    def ref(self, branch: str) -> str:
        p = urllib.parse.quote("heads/" + branch, safe="/")
        return self.request("GET", "/git/ref/" + p)["object"]["sha"]

    def commit(self, sha: str) -> dict:
        return self.request("GET", "/git/commits/" + sha)

    def blob(self, content: bytes) -> str:
        return self.request(
            "POST",
            "/git/blobs",
            {"content": base64.b64encode(content).decode("ascii"), "encoding": "base64"},
        )["sha"]

    def make_commit(self, branch: str, parent: str, files: dict[str, bytes], message: str) -> str:
        parent_commit = self.commit(parent)
        entries = []
        for path, content in sorted(files.items()):
            entries.append({"path": path, "mode": "100644", "type": "blob", "sha": self.blob(content)})
        tree = self.request(
            "POST",
            "/git/trees",
            {"base_tree": parent_commit["tree"]["sha"], "tree": entries},
        )["sha"]
        return self.request(
            "POST",
            "/git/commits",
            {"message": message, "tree": tree, "parents": [parent]},
        )["sha"]

    def update_ref(self, branch: str, new_sha: str) -> None:
        p = urllib.parse.quote("heads/" + branch, safe="/")
        try:
            self.request("PATCH", "/git/refs/" + p, {"sha": new_sha, "force": False}, ok=(200,))
        except ApiError as exc:
            if exc.status == 422:
                raise CasConflict(exc.body) from exc
            raise

    def cas_write_files(
        self,
        branch: str,
        files: dict[str, bytes],
        message: str,
        *,
        expected_head: str | None = None,
        retries: int = 8,
    ) -> str:
        head = expected_head or self.ref(branch)
        for attempt in range(retries):
            new_sha = self.make_commit(branch, head, files, message)
            try:
                self.update_ref(branch, new_sha)
                return new_sha
            except CasConflict:
                if expected_head is not None:
                    raise
                head = self.ref(branch)
                time.sleep(0.08 * (attempt + 1))
        raise CasConflict("CAS retries exhausted")

    def content(self, branch: str, path: str) -> tuple[bytes, str]:
        q = urllib.parse.urlencode({"ref": branch})
        safe = urllib.parse.quote(path, safe="/")
        obj = self.request("GET", "/contents/" + safe + "?" + q)
        return base64.b64decode(obj["content"]), obj["sha"]

    def text(self, branch: str, path: str) -> str:
        return self.content(branch, path)[0].decode("utf-8")

    def json_file(self, branch: str, path: str) -> dict:
        return json.loads(self.text(branch, path))

    def issue(self, number: int) -> dict:
        return self.request("GET", f"/issues/{number}")

    def comments(self, issue: int) -> list[dict]:
        out = []
        page = 1
        while True:
            batch = self.request("GET", f"/issues/{issue}/comments?per_page=100&page={page}")
            out.extend(batch)
            if len(batch) < 100:
                return out
            page += 1

    def find_comment(self, issue: int, marker: str) -> list[dict]:
        return [c for c in self.comments(issue) if marker in (c.get("body") or "")]

    def post_comment(self, issue: int, body: str) -> dict:
        return self.request("POST", f"/issues/{issue}/comments", {"body": body})

    def update_comment(self, comment_id: int, body: str) -> dict:
        return self.request("PATCH", f"/issues/comments/{comment_id}", {"body": body}, ok=(200,))

    def close_issue(self, issue: int) -> dict:
        return self.request("PATCH", f"/issues/{issue}", {"state": "closed"}, ok=(200,))


class Gateway:
    def __init__(self, gh: GitHub, *, production_enabled: bool, request_source: dict | None = None):
        self.gh = gh
        self.production_enabled = production_enabled
        self.request_source = dict(request_source or {})

    @staticmethod
    def lane_cfg(lane_id: str) -> dict:
        try:
            return ALLOWED_LANES[lane_id]
        except KeyError as exc:
            raise RequestRejected(f"unknown lane_id={lane_id}") from exc

    def _control(self, lane_id: str) -> str:
        return self.lane_cfg(lane_id)["control_branch"]

    def lease(self, lane_id: str) -> dict:
        return self.gh.json_file(self._control(lane_id), LEASE_PATH)

    def _encode_json(self, value: dict) -> bytes:
        return (json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _op_path(self, operation_id: str) -> str:
        if "/" in operation_id or ".." in operation_id:
            raise RequestRejected("invalid operation_id")
        return f"operations/{operation_id}.json"

    def _validate_hash(self, req: dict) -> None:
        supplied = req.get("request_sha256")
        if not supplied:
            raise RequestRejected("request_sha256 required")
        normalized = dict(req)
        normalized["request_sha256"] = ""
        actual = sha256_text(canonical(normalized))
        if supplied != actual:
            raise RequestRejected(f"request hash mismatch supplied={supplied} actual={actual}")

    def _validate_common(self, req: dict) -> dict:
        if req.get("schema") != "LUKE_QUEST_ENV_GATEWAY_REQUEST:v1":
            raise RequestRejected("unsupported request schema")
        self._validate_hash(req)
        cfg = self.lane_cfg(req["lane_id"])
        self._verify_target_identity(req, cfg)
        if not req.get("owner_run_id") or not req.get("operation_id") or not req.get("request_id"):
            raise RequestRejected("request_id/operation_id/owner_run_id required")
        return cfg

    def _verify_target_identity(self, req: dict, cfg: dict) -> None:
        identity = req.get("expected_target_identity")
        if not isinstance(identity, dict):
            raise RequestRejected("expected_target_identity required")
        expected_commit = cfg["target_source_commit_sha"]
        expected_blob = cfg["target_blob_sha"]
        if identity.get("target_source_commit_sha") != expected_commit:
            raise RequestRejected("target source commit mismatch")
        if identity.get("target_blob_sha") != expected_blob:
            raise RequestRejected("target blob mismatch")
        _, actual_blob = self.gh.content(expected_commit, cfg["target_path"])
        if actual_blob != expected_blob:
            raise RequestRejected(f"target authority blob mismatch actual={actual_blob} expected={expected_blob}")

    def _is_issue_descendant(
        self, issue: int, root: int, *, max_depth: int = 8
    ) -> bool:
        current = int(issue)
        seen: set[int] = set()
        for _ in range(max_depth + 1):
            if current == int(root):
                return True
            if current in seen:
                raise RequestRejected(
                    f"issue ancestry cycle detected at issue {current}"
                )
            seen.add(current)
            data = self.gh.issue(current)
            parent_url = data.get("parent_issue_url")
            if not parent_url:
                return False
            try:
                current = int(str(parent_url).rstrip("/").rsplit("/", 1)[-1])
            except (TypeError, ValueError) as exc:
                raise RequestRejected(
                    f"invalid parent_issue_url for issue {current}: {parent_url}"
                ) from exc
        raise RequestRejected(
            f"issue ancestry exceeds max depth={max_depth} from issue {issue}"
        )

    def _assert_issue_allowed(self, lane_id: str, issue: int) -> None:
        cfg = self.lane_cfg(lane_id)
        if issue == cfg["parent"] or issue in cfg["children"]:
            return
        if cfg.get("allow_descendants") and self._is_issue_descendant(
            issue, cfg["parent"]
        ):
            return
        raise RequestRejected(f"issue {issue} outside lane allowlist")

    def _lease_valid(self, lease: dict, req: dict, *, require_active: bool = True) -> None:
        if require_active and lease.get("LEASE_STATUS") != ACTIVE:
            raise LeaseUnavailable(f"lease status={lease.get('LEASE_STATUS')}")
        if lease.get("OWNER_RUN_ID") != req["owner_run_id"]:
            raise StaleEpoch("owner_run_id mismatch")
        if int(lease.get("LEASE_EPOCH", -1)) != int(req["lease_epoch"]):
            raise StaleEpoch("STALE_LEASE_EPOCH")
        expiry = parse_time(lease.get("LEASE_UNTIL"))
        if require_active and expiry is not None and expiry <= time.time():
            raise LeaseUnavailable("lease expired")
        if lease.get("ACTIVE_OPERATION_ID") not in (None, req["operation_id"]):
            raise ActiveOperation(f"lane already has active operation {lease.get('ACTIVE_OPERATION_ID')}")

    def _start_operation(self, req: dict, mutation_type: str, target: str, retry_class: str) -> tuple[dict, dict, str]:
        branch = self._control(req["lane_id"])
        control_head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        self._lease_valid(lease, req)
        op_path = self._op_path(req["operation_id"])
        try:
            existing = self.gh.json_file(branch, op_path)
        except ApiError as exc:
            if exc.status != 404:
                raise
            existing = None
        if existing:
            if existing["REQUEST_SHA256"] != req["request_sha256"]:
                raise RequestRejected("operation_id reused with different request hash")
            return lease, existing, control_head

        op = {
            "OPERATION_ID": req["operation_id"],
            "REQUEST_ID": req["request_id"],
            "REQUEST_SHA256": req["request_sha256"],
            "LANE_ID": req["lane_id"],
            "OWNER_RUN_ID": req["owner_run_id"],
            "LEASE_EPOCH": int(req["lease_epoch"]),
            "MUTATION_TYPE": mutation_type,
            "TARGET_RESOURCE": target,
            "RETRY_CLASS": retry_class,
            "OPERATION_STATE": PREPARED,
            "CREATED_AT": now_rfc3339(),
            "LAST_UPDATED_AT": now_rfc3339(),
        }
        if self.request_source:
            op["REQUEST_CHANNEL_SOURCE"] = self.request_source
        lease["ACTIVE_OPERATION_ID"] = req["operation_id"]
        lease["LAST_GATEWAY_ACCEPTED_AT"] = now_rfc3339()
        self.gh.cas_write_files(
            branch,
            {LEASE_PATH: self._encode_json(lease), op_path: self._encode_json(op)},
            f"gateway: prepare {req['operation_id']}",
            expected_head=control_head,
        )
        return self.lease(req["lane_id"]), self.gh.json_file(branch, op_path), self.gh.ref(branch)

    def _mark_dispatched(self, req: dict, op: dict) -> dict:
        branch = self._control(req["lane_id"])
        head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        self._lease_valid(lease, req)
        if op["OPERATION_STATE"] == PREPARED:
            op["OPERATION_STATE"] = DISPATCHED
            op["LAST_UPDATED_AT"] = now_rfc3339()
            self.gh.cas_write_files(
                branch,
                {self._op_path(req["operation_id"]): self._encode_json(op)},
                f"gateway: dispatch {req['operation_id']}",
                expected_head=head,
            )
        return self.gh.json_file(branch, self._op_path(req["operation_id"]))

    def _finish(self, req: dict, op: dict, state: str, extra: dict | None = None) -> dict:
        branch = self._control(req["lane_id"])
        head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        if lease.get("OWNER_RUN_ID") != req["owner_run_id"] or int(lease.get("LEASE_EPOCH", -1)) != int(req["lease_epoch"]):
            raise StaleEpoch("cannot finalize operation after ownership changed")
        if lease.get("ACTIVE_OPERATION_ID") != req["operation_id"]:
            raise ActiveOperation("active operation identity changed during dispatch")
        op["OPERATION_STATE"] = state
        op["LAST_UPDATED_AT"] = now_rfc3339()
        if extra:
            op.update(extra)
        lease["ACTIVE_OPERATION_ID"] = None
        lease["LAST_GATEWAY_COMPLETED_AT"] = now_rfc3339()
        self.gh.cas_write_files(
            branch,
            {LEASE_PATH: self._encode_json(lease), self._op_path(req["operation_id"]): self._encode_json(op)},
            f"gateway: finalize {req['operation_id']} {state}",
            expected_head=head,
        )
        return self.gh.json_file(branch, self._op_path(req["operation_id"]))

    def acquire(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        branch = cfg["control_branch"]
        head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        if lease.get("ACTIVE_OPERATION_ID"):
            raise ActiveOperation("cannot acquire while an operation is unresolved")
        status = lease.get("LEASE_STATUS")
        expiry = parse_time(lease.get("LEASE_UNTIL"))
        if status == ACTIVE and (expiry is None or expiry > time.time()):
            current_epoch = int(lease.get("LEASE_EPOCH", 0))
            requested_epoch = int(req.get("lease_epoch", 0))
            if (
                lease.get("OWNER_RUN_ID") == req["owner_run_id"]
                and requested_epoch in (0, current_epoch)
            ):
                return {
                    "status": "LEASE_ALREADY_ACQUIRED",
                    "lease": lease,
                    "RECOVERED_AFTER_UNKNOWN_RESPONSE": True,
                }
            raise LeaseUnavailable("active lease exists")
        new_epoch = int(lease.get("LEASE_EPOCH", 0)) + 1
        if int(req.get("lease_epoch", 0)) not in (0, new_epoch):
            raise RequestRejected(f"LEASE_ACQUIRE expected lease_epoch 0 or {new_epoch}")
        ttl = int(req.get("payload", {}).get("ttl_seconds", 1800))
        if ttl < 60 or ttl > 7200:
            raise RequestRejected("ttl_seconds must be 60..7200")
        current_head = self.gh.ref(cfg["implementation_branch"])
        lease.update(
            {
                "OWNER_RUN_ID": req["owner_run_id"],
                "LEASE_EPOCH": new_epoch,
                "FENCING_TOKEN": new_epoch,
                "ACQUIRED_AT": now_rfc3339(),
                "LEASE_UNTIL": datetime.fromtimestamp(time.time() + ttl, timezone.utc).isoformat().replace("+00:00", "Z"),
                "LAST_HEARTBEAT_AT": now_rfc3339(),
                "BASE_HEAD_SHA": current_head,
                "CURRENT_HEAD_SHA": current_head,
                "LEASE_STATUS": ACTIVE,
                "ACTIVE_OPERATION_ID": None,
            }
        )
        self.gh.cas_write_files(branch, {LEASE_PATH: self._encode_json(lease)}, f"gateway: acquire {req['lane_id']} epoch {new_epoch}", expected_head=head)
        return {"status": "LEASE_ACQUIRED", "lease": self.lease(req["lane_id"])}

    def heartbeat(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        branch = cfg["control_branch"]
        head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        if lease.get("ACTIVE_OPERATION_ID"):
            raise ActiveOperation("heartbeat blocked while operation unresolved")
        self._lease_valid(lease, req)
        ttl = int(req.get("payload", {}).get("ttl_seconds", 1800))
        if ttl < 60 or ttl > 7200:
            raise RequestRejected("ttl_seconds must be 60..7200")
        lease["LAST_HEARTBEAT_AT"] = now_rfc3339()
        lease["LEASE_UNTIL"] = datetime.fromtimestamp(time.time() + ttl, timezone.utc).isoformat().replace("+00:00", "Z")
        lease["CURRENT_HEAD_SHA"] = self.gh.ref(cfg["implementation_branch"])
        self.gh.cas_write_files(branch, {LEASE_PATH: self._encode_json(lease)}, f"gateway: heartbeat {req['lane_id']}", expected_head=head)
        return {"status": "LEASE_HEARTBEAT", "lease": self.lease(req["lane_id"])}

    def release(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        branch = cfg["control_branch"]
        head = self.gh.ref(branch)
        lease = self.gh.json_file(branch, LEASE_PATH)
        if lease.get("ACTIVE_OPERATION_ID"):
            raise ActiveOperation("release blocked while operation unresolved")
        if (
            lease.get("LEASE_STATUS") == RELEASED
            and lease.get("OWNER_RUN_ID") == req["owner_run_id"]
            and int(lease.get("LEASE_EPOCH", -1)) == int(req["lease_epoch"])
        ):
            return {
                "status": "LEASE_ALREADY_RELEASED",
                "lease": lease,
                "RECOVERED_AFTER_UNKNOWN_RESPONSE": True,
            }
        self._lease_valid(lease, req)
        lease["LEASE_STATUS"] = RELEASED
        lease["LEASE_UNTIL"] = None
        lease["LAST_HEARTBEAT_AT"] = now_rfc3339()
        lease["ACTIVE_OPERATION_ID"] = None
        self.gh.cas_write_files(branch, {LEASE_PATH: self._encode_json(lease)}, f"gateway: release {req['lane_id']}", expected_head=head)
        return {"status": "LEASE_RELEASED", "lease": self.lease(req["lane_id"])}

    def _adoption_path(self, adoption_id: str) -> str:
        if not adoption_id or "/" in adoption_id or ".." in adoption_id:
            raise RequestRejected("invalid adoption_id")
        return f"adoptions/{adoption_id}.json"

    def adoption_record(self, lane_id: str, adoption_id: str) -> dict:
        return self.gh.json_file(self._control(lane_id), self._adoption_path(adoption_id))

    def _update_adoption_record(self, lane_id: str, adoption_id: str, mutate, message: str) -> dict:
        branch = self._control(lane_id)
        for _ in range(8):
            head = self.gh.ref(branch)
            record = self.adoption_record(lane_id, adoption_id)
            updated = mutate(dict(record))
            try:
                self.gh.cas_write_files(
                    branch,
                    {self._adoption_path(adoption_id): self._encode_json(updated)},
                    message,
                    expected_head=head,
                )
                return self.adoption_record(lane_id, adoption_id)
            except CasConflict:
                continue
        raise CasConflict("adoption record CAS retries exhausted")

    def evidence_identifiers_reserve(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        child = int(payload["child_issue"])
        self._assert_issue_allowed(req["lane_id"], child)
        if child == cfg["parent"]:
            raise RequestRejected("evidence reservation requires child issue")
        evidence_id = str(payload["evidence_id"])
        adoption_id = str(payload["adoption_id"])
        if not evidence_id or "/" in evidence_id or ".." in evidence_id:
            raise RequestRejected("invalid evidence_id")
        path = self._adoption_path(adoption_id)
        current_head = self.gh.ref(cfg["implementation_branch"])
        expected_head = req.get("expected_lane_head")
        if not expected_head or current_head != expected_head:
            raise HeadMismatch("reservation requires exact implementation HEAD")
        _, op, _ = self._start_operation(
            req, "EVIDENCE_IDENTIFIERS_RESERVE", f"{self._control(req['lane_id'])}:{path}", "IDEMPOTENT_RETRY_SAFE"
        )
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op
        op = self._mark_dispatched(req, op)
        record = {
            "schema": "LUKE_QUEST_ENV_EVIDENCE_ADOPTION:v1",
            "ADOPTION_ID": adoption_id,
            "EVIDENCE_ID": evidence_id,
            "LANE_ID": req["lane_id"],
            "CHILD_ISSUE": child,
            "OWNER_RUN_ID": req["owner_run_id"],
            "LEASE_EPOCH": int(req["lease_epoch"]),
            "IMPLEMENTATION_HEAD": current_head,
            "TARGET_IDENTITY": req.get("expected_target_identity"),
            "EVALUATION_CONTRACT_SHA256": payload.get("evaluation_contract_sha256"),
            "STATE": "IDENTIFIERS_RESERVED",
            "DURABLE_URI": None,
            "DURABLE_EVIDENCE_SET_SHA256": None,
            "READBACK_VERIFIED": False,
            "RESERVED_AT": now_rfc3339(),
        }
        branch = self._control(req["lane_id"])
        head = self.gh.ref(branch)
        try:
            existing = self.gh.json_file(branch, path)
        except ApiError as exc:
            if exc.status != 404:
                raise
            existing = None
        if existing:
            immutable = ("ADOPTION_ID", "EVIDENCE_ID", "LANE_ID", "CHILD_ISSUE", "IMPLEMENTATION_HEAD", "TARGET_IDENTITY")
            if any(existing.get(k) != record.get(k) for k in immutable):
                raise RequestRejected("reserved adoption identity collision")
        else:
            self.gh.cas_write_files(branch, {path: self._encode_json(record)}, f"gateway: reserve evidence ids {adoption_id}", expected_head=head)
        return self._finish(req, op, CONFIRMED_APPLIED, {"ADOPTION_ID": adoption_id, "EVIDENCE_ID": evidence_id})



    def _persist_operation_state(
        self,
        req: dict,
        op: dict,
        state: str,
        extra: dict | None = None,
        *,
        clear_active: bool = False,
    ) -> dict:
        branch = self._control(req["lane_id"])
        for _ in range(8):
            head = self.gh.ref(branch)
            lease = self.gh.json_file(branch, LEASE_PATH)
            if (
                lease.get("OWNER_RUN_ID") != req["owner_run_id"]
                or int(lease.get("LEASE_EPOCH", -1)) != int(req["lease_epoch"])
            ):
                raise StaleEpoch("cannot persist operation after ownership changed")
            if lease.get("ACTIVE_OPERATION_ID") not in (
                None,
                req["operation_id"],
            ):
                raise ActiveOperation(
                    "another operation owns the lane during reconciliation"
                )
            updated = dict(op)
            updated["OPERATION_STATE"] = state
            updated["LAST_UPDATED_AT"] = now_rfc3339()
            if extra:
                updated.update(extra)
            if clear_active and lease.get("ACTIVE_OPERATION_ID") == req["operation_id"]:
                lease["ACTIVE_OPERATION_ID"] = None
            files = {self._op_path(req["operation_id"]): self._encode_json(updated)}
            if clear_active:
                files[LEASE_PATH] = self._encode_json(lease)
            try:
                self.gh.cas_write_files(
                    branch,
                    files,
                    f"gateway: operation {req['operation_id']} -> {state}",
                    expected_head=head,
                )
                return self.gh.json_file(
                    branch, self._op_path(req["operation_id"])
                )
            except CasConflict:
                continue
        raise CasConflict("operation state CAS retries exhausted")

    def _sync_current_head(self, req: dict, implementation_head: str) -> None:
        branch = self._control(req["lane_id"])
        for _ in range(8):
            head = self.gh.ref(branch)
            lease = self.gh.json_file(branch, LEASE_PATH)
            if (
                lease.get("OWNER_RUN_ID") != req["owner_run_id"]
                or int(lease.get("LEASE_EPOCH", -1)) != int(req["lease_epoch"])
            ):
                return
            lease["CURRENT_HEAD_SHA"] = implementation_head
            try:
                self.gh.cas_write_files(
                    branch,
                    {LEASE_PATH: self._encode_json(lease)},
                    f"gateway: sync current head {implementation_head}",
                    expected_head=head,
                )
                return
            except CasConflict:
                continue
        raise CasConflict("lease current-head sync CAS retries exhausted")

    def implementation_file_update(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        expected_head = req.get("expected_lane_head")
        if not expected_head:
            raise RequestRejected("expected_lane_head required")

        payload = req.get("payload", {})
        path = payload.get("path")
        if not path or path.startswith(".git/") or path == LEASE_PATH:
            raise RequestRejected("invalid implementation path")
        content = decode_payload_content(payload)

        _, op, _ = self._start_operation(
            req,
            "IMPLEMENTATION_FILE_UPDATE",
            f"{cfg['implementation_branch']}:{path}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op
        if op["OPERATION_STATE"] == CONFIRMED_NOT_APPLIED:
            return op

        current_head = self.gh.ref(cfg["implementation_branch"])

        # Recovery path for a process that dispatched the ref update and died
        # before recording its result. If the requested postcondition is
        # already observable, finalize the same Operation instead of issuing a
        # second write.
        if op["OPERATION_STATE"] in (DISPATCHED, RESULT_UNKNOWN):
            if current_head != expected_head:
                try:
                    actual, _ = self.gh.content(cfg["implementation_branch"], path)
                except ApiError:
                    actual = None

                if actual == content:
                    result = self._finish(
                        req,
                        op,
                        CONFIRMED_APPLIED,
                        {
                            "APPLIED_HEAD": current_head,
                            "CONTENT_SHA256": sha256_bytes(content),
                            "RECOVERED_AFTER_UNKNOWN_RESPONSE": True,
                        },
                    )
                    self._sync_current_head(req, current_head)
                    return result

                # The old request might have applied partially or a non-Gateway
                # writer might have moved the lane. Do not retry and do not
                # permit takeover. Keep ACTIVE_OPERATION_ID fenced until
                # explicit reconciliation.
                self._persist_operation_state(
                    req,
                    op,
                    RECONCILIATION_REQUIRED,
                    {
                        "EXPECTED_IMPLEMENTATION_HEAD": expected_head,
                        "OBSERVED_IMPLEMENTATION_HEAD": current_head,
                        "EXPECTED_CONTENT_SHA256": sha256_bytes(content),
                    },
                    clear_active=False,
                )
                raise GatewayError(
                    f"implementation outcome requires reconciliation expected_head={expected_head} current_head={current_head}"
                )

            # HEAD is still the exact precondition. This operation is
            # IDEMPOTENT_RETRY_SAFE, so a retry is safe.
        elif current_head != expected_head:
            raise HeadMismatch(
                f"implementation branch HEAD mismatch expected={expected_head} current={current_head}"
            )

        op = self._mark_dispatched(req, op)
        try:
            new_head = self.gh.cas_write_files(
                cfg["implementation_branch"],
                {path: content},
                f"gateway: {req['operation_id']}",
                expected_head=expected_head,
            )
        except CasConflict:
            return self._finish(
                req,
                op,
                CONFIRMED_NOT_APPLIED,
                {"FAILURE": "HEAD_CAS_CONFLICT"},
            )
        except Exception:
            # The transport may fail after GitHub has already accepted the ref
            # update. Leave the Operation DISPATCHED so a restart reconciles
            # actual target state before any retry or takeover.
            raise

        actual, _ = self.gh.content(cfg["implementation_branch"], path)
        if actual != content:
            self._persist_operation_state(
                req,
                op,
                RESULT_UNKNOWN,
                {
                    "EXPECTED_CONTENT_SHA256": sha256_bytes(content),
                    "OBSERVED_IMPLEMENTATION_HEAD": self.gh.ref(cfg["implementation_branch"]),
                },
                clear_active=False,
            )
            raise GatewayError("implementation readback mismatch")

        result = self._finish(
            req,
            op,
            CONFIRMED_APPLIED,
            {
                "APPLIED_HEAD": new_head,
                "CONTENT_SHA256": sha256_bytes(content),
            },
        )
        self._sync_current_head(req, new_head)
        return result


    def issue_comment(self, req: dict) -> dict:
        self._validate_common(req)
        issue = int(req.get("payload", {}).get("issue_number"))
        self._assert_issue_allowed(req["lane_id"], issue)
        body = str(req.get("payload", {}).get("body", ""))
        marker = f"[LQ_GATEWAY_OP:{req['operation_id']}]"

        _, op, _ = self._start_operation(
            req,
            "ISSUE_COMMENT",
            f"issue-{issue}",
            "RESULT_CONFIRMATION_REQUIRED",
        )

        existing = self.gh.find_comment(issue, marker)
        if existing:
            return self._finish(
                req,
                op,
                CONFIRMED_APPLIED,
                {
                    "COMMENT_ID": existing[0]["id"],
                    "RECONCILED_BY_MARKER": True,
                },
            )

        # A RESULT_CONFIRMATION_REQUIRED operation must never be blindly
        # retransmitted after dispatch. Absence of the marker at this instant
        # is not proof that GitHub will never apply the old request.
        if op["OPERATION_STATE"] in (DISPATCHED, RESULT_UNKNOWN):
            self._persist_operation_state(
                req,
                op,
                RESULT_UNKNOWN,
                {"RECONCILIATION_REASON": "marker_not_observable_after_prior_dispatch"},
                clear_active=False,
            )
            raise GatewayError(
                "issue comment result unknown; blind resend prohibited"
            )

        if op["OPERATION_STATE"] == RECONCILIATION_REQUIRED:
            raise GatewayError("issue comment requires reconciliation")
        if op["OPERATION_STATE"] == CONFIRMED_NOT_APPLIED:
            return op

        op = self._mark_dispatched(req, op)
        try:
            self.gh.post_comment(issue, marker + "\n" + body)
        except Exception:
            # Do not convert transport failure into NOT_APPLIED. The request
            # may already have crossed the external boundary.
            raise

        matches = self.gh.find_comment(issue, marker)
        if len(matches) != 1:
            self._persist_operation_state(
                req,
                op,
                RESULT_UNKNOWN,
                {
                    "RECONCILIATION_REASON": "marker_count_after_dispatch",
                    "OBSERVED_MARKER_COUNT": len(matches),
                },
                clear_active=False,
            )
            raise GatewayError(
                f"issue comment outcome unknown; marker count={len(matches)}"
            )

        return self._finish(
            req,
            op,
            CONFIRMED_APPLIED,
            {"COMMENT_ID": matches[0]["id"]},
        )

    def issue_close(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        issue = int(payload.get("issue_number"))
        self._assert_issue_allowed(req["lane_id"], issue)
        if issue == cfg["parent"]:
            raise RequestRejected("parent issue close is outside initial gateway allowlist")
        adoption_id = str(payload.get("adoption_id", ""))
        if not adoption_id:
            raise RequestRejected("child close requires adoption_id")
        adoption = self.adoption_record(req["lane_id"], adoption_id)
        if adoption.get("CHILD_ISSUE") != issue or adoption.get("STATE") not in ("ADOPTED_CHILD_NOT_CLOSED", "CHILD_CLOSED_PARENT_NOT_ADVANCED", "COMPLETE"):
            raise RequestRejected("child close requires adopted evidence for same child")
        _, op, _ = self._start_operation(req, "ISSUE_CLOSE", f"issue-{issue}", "IDEMPOTENT_RETRY_SAFE")
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op
        current = self.gh.issue(issue)
        if current.get("state") != "closed":
            op = self._mark_dispatched(req, op)
            self.gh.close_issue(issue)
            current = self.gh.issue(issue)
            if current.get("state") != "closed":
                raise GatewayError("issue close readback failed")
        def mutate(r):
            if r.get("STATE") == "ADOPTED_CHILD_NOT_CLOSED":
                r["STATE"] = "CHILD_CLOSED_PARENT_NOT_ADVANCED"
                r["CHILD_CLOSED_AT"] = now_rfc3339()
            return r
        self._update_adoption_record(req["lane_id"], adoption_id, mutate, f"gateway: adoption child closed {adoption_id}")
        return self._finish(req, op, CONFIRMED_APPLIED, {"ISSUE_STATE": "closed", "ADOPTION_ID": adoption_id})

    def parent_progress_update(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        parent = int(payload.get("issue_number", cfg["parent"]))
        if parent != cfg["parent"]:
            raise RequestRejected("parent progress may update only lane parent")
        comment_id = int(payload["comment_id"])
        body = str(payload["body"])
        parent_comments = [c for c in self.gh.comments(parent) if int(c["id"]) == comment_id]
        if len(parent_comments) != 1:
            raise RequestRejected("progress comment id is not owned by lane parent")
        adoption_id = payload.get("adoption_id")
        if adoption_id:
            adoption = self.adoption_record(req["lane_id"], str(adoption_id))
            if adoption.get("STATE") not in ("CHILD_CLOSED_PARENT_NOT_ADVANCED", "COMPLETE"):
                raise RequestRejected("PASS parent advance requires closed child adoption state")
        _, op, _ = self._start_operation(req, "PARENT_PROGRESS_UPDATE", f"issue-{parent}-comment-{comment_id}", "IDEMPOTENT_RETRY_SAFE")
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op
        op = self._mark_dispatched(req, op)
        self.gh.update_comment(comment_id, body)
        matches = [c for c in self.gh.comments(parent) if int(c["id"]) == comment_id]
        if len(matches) != 1 or (matches[0].get("body") or "") != body:
            raise GatewayError("parent progress readback mismatch")
        if adoption_id:
            def mutate(r):
                if r.get("STATE") == "CHILD_CLOSED_PARENT_NOT_ADVANCED":
                    r["STATE"] = "COMPLETE"
                    r["PARENT_ADVANCED_AT"] = now_rfc3339()
                return r
            self._update_adoption_record(req["lane_id"], str(adoption_id), mutate, f"gateway: adoption complete {adoption_id}")
        return self._finish(req, op, CONFIRMED_APPLIED, {"COMMENT_ID": comment_id, "BODY_SHA256": sha256_text(body), "ADOPTION_ID": adoption_id})

    def _durable_evidence_publish_bytes(
        self,
        req: dict,
        cfg: dict,
        child: int,
        evidence_id: str,
        adoption_id: str,
        expected_head: str,
        files: dict[str, bytes],
        mutation_type: str,
    ) -> dict:
        reservation = self.adoption_record(req["lane_id"], adoption_id)
        if (
            reservation.get("EVIDENCE_ID") != evidence_id
            or reservation.get("CHILD_ISSUE") != child
        ):
            raise RequestRejected(
                "evidence publication does not match reserved identifiers"
            )
        if reservation.get("STATE") not in (
            "IDENTIFIERS_RESERVED",
            "DURABLE_STORED_NOT_ADOPTED",
        ):
            raise RequestRejected(
                f"evidence publication invalid adoption state={reservation.get('STATE')}"
            )
        if (
            reservation.get("IMPLEMENTATION_HEAD")
            != self.gh.ref(cfg["implementation_branch"])
        ):
            raise HeadMismatch(
                "reserved evidence implementation HEAD no longer current"
            )

        required = {
            "target.png",
            "actual.png",
            "coordinate-audit.json",
            "evidence-manifest.candidate.json",
            "evidence-settings.json",
            "evaluation-contract-snapshot.md",
            "visual-audit.json",
        }
        if not required.issubset(set(files)):
            raise RequestRejected(
                "durable evidence file set incomplete: "
                + ",".join(sorted(required - set(files)))
            )

        prefix = f"evidence/{req['lane_id']}/issue-{child}/{evidence_id}/"
        prefixed: dict[str, bytes] = {}
        for rel, content in files.items():
            if rel.startswith("/") or ".." in rel.split("/"):
                raise RequestRejected("invalid evidence relative path")
            prefixed[prefix + rel] = content

        _, op, _ = self._start_operation(
            req,
            mutation_type,
            f"{EVIDENCE_BRANCH}:{prefix}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op

        pending = {}
        existing_count = 0
        for evidence_path, content in prefixed.items():
            try:
                old, _ = self.gh.content(EVIDENCE_BRANCH, evidence_path)
            except ApiError as exc:
                if exc.status != 404:
                    raise
                old = None
            if old is not None:
                existing_count += 1
                if old != content:
                    raise RequestRejected(
                        f"append-only evidence collision at {evidence_path}"
                    )
            else:
                pending[evidence_path] = content

        if op["OPERATION_STATE"] == PREPARED:
            op = self._mark_dispatched(req, op)

        if pending:
            first_attempt = (
                existing_count == 0
                and self.gh.ref(EVIDENCE_BRANCH) == expected_head
            )
            try:
                applied_head = self.gh.cas_write_files(
                    EVIDENCE_BRANCH,
                    pending,
                    f"evidence: {req['operation_id']}",
                    expected_head=expected_head if first_attempt else None,
                )
            except CasConflict:
                applied_head = self.gh.cas_write_files(
                    EVIDENCE_BRANCH,
                    pending,
                    f"evidence-retry: {req['operation_id']}",
                )
        else:
            applied_head = self.gh.ref(EVIDENCE_BRANCH)

        index = []
        for evidence_path, content in sorted(prefixed.items()):
            actual, _ = self.gh.content(EVIDENCE_BRANCH, evidence_path)
            if actual != content:
                raise GatewayError(
                    f"durable evidence readback mismatch at {evidence_path}"
                )
            index.append(
                {
                    "path": evidence_path[len(prefix):],
                    "sha256": sha256_bytes(actual),
                }
            )

        index_text = canonical(index).encode("utf-8")
        index_path = prefix + "evidence-set-index.json"
        try:
            old_index, _ = self.gh.content(EVIDENCE_BRANCH, index_path)
        except ApiError as exc:
            if exc.status != 404:
                raise
            old_index = None

        if old_index is None:
            applied_head = self.gh.cas_write_files(
                EVIDENCE_BRANCH,
                {index_path: index_text},
                f"evidence-index: {req['operation_id']}",
            )
        elif old_index != index_text:
            raise RequestRejected("evidence index collision")

        read_index, _ = self.gh.content(EVIDENCE_BRANCH, index_path)
        if read_index != index_text:
            raise GatewayError("evidence index fresh read-back mismatch")
        set_hash = sha256_bytes(read_index)

        def mutate(r):
            if r.get("EVIDENCE_ID") != evidence_id:
                raise RequestRejected("adoption/evidence reservation drift")
            r["STATE"] = "DURABLE_STORED_NOT_ADOPTED"
            r["DURABLE_URI"] = prefix
            r["DURABLE_EVIDENCE_SET_SHA256"] = set_hash
            r["READBACK_VERIFIED"] = True
            r["DURABLE_STORED_AT"] = now_rfc3339()
            return r

        self._update_adoption_record(
            req["lane_id"],
            adoption_id,
            mutate,
            f"gateway: durable evidence stored {adoption_id}",
        )
        return self._finish(
            req,
            op,
            CONFIRMED_APPLIED,
            {
                "EVIDENCE_ID": evidence_id,
                "ADOPTION_ID": adoption_id,
                "DURABLE_URI": prefix,
                "DURABLE_EVIDENCE_SET_SHA256": set_hash,
                "APPLIED_EVIDENCE_HEAD": applied_head,
                "READBACK_VERIFIED": True,
            },
        )

    def durable_evidence_publish(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        child = int(payload["child_issue"])
        self._assert_issue_allowed(req["lane_id"], child)
        evidence_id = str(payload["evidence_id"])
        adoption_id = str(payload["adoption_id"])
        expected_head = str(payload["expected_evidence_head"])
        files_spec = payload.get("files", {})
        files: dict[str, bytes] = {}
        for rel, spec in files_spec.items():
            files[rel] = decode_content_spec(spec)
        return self._durable_evidence_publish_bytes(
            req,
            cfg,
            child,
            evidence_id,
            adoption_id,
            expected_head,
            files,
            "DURABLE_EVIDENCE_PUBLISH",
        )

    def durable_evidence_publish_from_artifact(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        child = int(payload["child_issue"])
        self._assert_issue_allowed(req["lane_id"], child)
        evidence_id = str(payload["evidence_id"])
        adoption_id = str(payload["adoption_id"])
        expected_head = str(payload["expected_evidence_head"])
        capture_request_id = str(payload["capture_request_id"])
        artifact_id = int(payload["artifact_id"])

        if (
            not capture_request_id
            or len(capture_request_id) > 128
            or any(
                not (ch.isalnum() or ch in "._-")
                for ch in capture_request_id
            )
        ):
            raise RequestRejected("invalid capture_request_id")
        if artifact_id <= 0:
            raise RequestRejected("artifact_id must be positive")

        metadata = self.gh.artifact_metadata(artifact_id)
        expected_name = "lq-env-evidence-" + capture_request_id
        if metadata.get("name") != expected_name:
            raise RequestRejected(
                f"artifact name mismatch expected={expected_name} actual={metadata.get('name')}"
            )
        if metadata.get("expired") is True:
            raise RequestRejected("evidence artifact expired")

        archive = self.gh.artifact_zip(artifact_id)
        digest = str(metadata.get("digest") or "")
        if digest.startswith("sha256:"):
            actual_archive_hash = sha256_bytes(archive)
            if actual_archive_hash != digest.split(":", 1)[1]:
                raise RequestRejected("artifact archive digest mismatch")

        artifact_files: dict[str, bytes] = {}
        try:
            with zipfile.ZipFile(io.BytesIO(archive)) as zf:
                infos = [info for info in zf.infolist() if not info.is_dir()]
                if len(infos) > 40:
                    raise RequestRejected("artifact contains too many files")
                total = sum(info.file_size for info in infos)
                if total > 40 * 1024 * 1024:
                    raise RequestRejected("artifact uncompressed size exceeds 40 MiB")
                for info in infos:
                    name = info.filename.replace("\\", "/")
                    if (
                        name.startswith("/")
                        or ".." in name.split("/")
                        or "/" in name
                    ):
                        raise RequestRejected(
                            f"artifact path not allowed: {info.filename}"
                        )
                    if name in artifact_files:
                        raise RequestRejected(
                            f"duplicate artifact member: {name}"
                        )
                    artifact_files[name] = zf.read(info)
        except zipfile.BadZipFile as exc:
            raise RequestRejected("artifact is not a valid ZIP") from exc

        candidate_required = {
            "target.png",
            "actual.png",
            "evidence-manifest.candidate.json",
            "evidence-settings.json",
            "evaluation-contract-snapshot.md",
        }
        if not candidate_required.issubset(artifact_files):
            raise RequestRejected(
                "artifact candidate set incomplete: "
                + ",".join(
                    sorted(candidate_required - set(artifact_files))
                )
            )

        manifest = json.loads(
            artifact_files["evidence-manifest.candidate.json"].decode("utf-8")
        )
        current_head = self.gh.ref(cfg["implementation_branch"])
        if (
            manifest.get("lane_id") != req["lane_id"]
            or int(manifest.get("parent_issue", -1)) != int(cfg["parent"])
            or int(manifest.get("child_issue", -1)) != child
        ):
            raise RequestRejected("artifact manifest lane/issue mismatch")
        if (
            manifest.get("actual_head_sha") != current_head
            or manifest.get("runtime_build_sha") != current_head
        ):
            raise HeadMismatch("artifact implementation HEAD no longer current")
        if (
            manifest.get("target_source_commit_sha")
            != cfg["target_source_commit_sha"]
            or manifest.get("target_blob_sha") != cfg["target_blob_sha"]
        ):
            raise RequestRejected("artifact target identity mismatch")
        if (
            manifest.get("target_dimensions") != CANONICAL_VIEWPORT
            or manifest.get("actual_dimensions") != CANONICAL_VIEWPORT
        ):
            raise RequestRejected("artifact canonical viewport mismatch")

        target_hash = sha256_bytes(artifact_files["target.png"])
        actual_hash = sha256_bytes(artifact_files["actual.png"])
        if (
            manifest.get("target_image_sha256") != target_hash
            or manifest.get("actual_image_sha256") != actual_hash
        ):
            raise RequestRejected("artifact image hash mismatch")
        if (
            manifest.get("evidence_settings_sha256")
            != sha256_bytes(artifact_files["evidence-settings.json"])
            or manifest.get("evaluation_contract_snapshot_sha256")
            != sha256_bytes(
                artifact_files["evaluation-contract-snapshot.md"]
            )
        ):
            raise RequestRejected("artifact manifest supporting hash mismatch")
        if (
            "runtime-audit.json" in artifact_files
            and manifest.get("runtime_audit_sha256")
            != sha256_bytes(artifact_files["runtime-audit.json"])
        ):
            raise RequestRejected("artifact runtime audit hash mismatch")

        visual = payload.get("visual_audit")
        coordinate = payload.get("coordinate_audit")
        if not isinstance(visual, dict) or not isinstance(coordinate, dict):
            raise RequestRejected("visual_audit and coordinate_audit required")
        visual_status = str(
            visual.get("STATUS", visual.get("status", ""))
        ).upper()
        coordinate_status = str(
            coordinate.get("STATUS", coordinate.get("status", ""))
        ).upper()
        if visual_status != "PASS":
            raise RequestRejected("visual audit must be PASS")
        if visual.get("visual_comparison_performed") is not True:
            raise RequestRejected("visual comparison must be explicitly performed")
        if coordinate_status != "PASS":
            raise RequestRejected("coordinate audit must be PASS")
        if (
            visual.get("target_image_sha256") != target_hash
            or visual.get("actual_image_sha256") != actual_hash
        ):
            raise RequestRejected("visual audit image identity mismatch")

        files = dict(artifact_files)
        files["coordinate-audit.json"] = (
            json.dumps(
                coordinate,
                ensure_ascii=False,
                indent=2,
                sort_keys=True,
            )
            + "\n"
        ).encode("utf-8")
        files["visual-audit.json"] = (
            json.dumps(
                visual,
                ensure_ascii=False,
                indent=2,
                sort_keys=True,
            )
            + "\n"
        ).encode("utf-8")
        files["artifact-provenance.json"] = (
            json.dumps(
                {
                    "schema": "LUKE_QUEST_ENV_ARTIFACT_PROVENANCE:v1",
                    "capture_request_id": capture_request_id,
                    "artifact_id": artifact_id,
                    "artifact_name": metadata.get("name"),
                    "artifact_digest": metadata.get("digest"),
                    "artifact_created_at": metadata.get("created_at"),
                    "artifact_updated_at": metadata.get("updated_at"),
                    "workflow_run": metadata.get("workflow_run"),
                },
                ensure_ascii=False,
                indent=2,
                sort_keys=True,
            )
            + "\n"
        ).encode("utf-8")

        return self._durable_evidence_publish_bytes(
            req,
            cfg,
            child,
            evidence_id,
            adoption_id,
            expected_head,
            files,
            "DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT",
        )

    def evidence_adopt(self, req: dict) -> dict:
        cfg = self._validate_common(req)
        payload = req.get("payload", {})
        child = int(payload["child_issue"])
        self._assert_issue_allowed(req["lane_id"], child)
        adoption_id = str(payload["adoption_id"])
        evidence_id = str(payload["evidence_id"])

        reservation = self.adoption_record(req["lane_id"], adoption_id)
        if reservation.get("EVIDENCE_ID") != evidence_id or reservation.get("CHILD_ISSUE") != child:
            raise RequestRejected("adoption does not match reserved identifiers")

        # Persist/recover the Operation before taking a terminal-state fast
        # path. This prevents a crash after the adoption record changes but
        # before Operation Journal finalization from stranding the Lane.
        _, op, _ = self._start_operation(
            req,
            "EVIDENCE_ADOPT",
            f"{self._control(req['lane_id'])}:{self._adoption_path(adoption_id)}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == CONFIRMED_APPLIED:
            return op

        if reservation.get("STATE") in (
            "ADOPTED_CHILD_NOT_CLOSED",
            "CHILD_CLOSED_PARENT_NOT_ADVANCED",
            "COMPLETE",
        ):
            return self._finish(
                req,
                op,
                CONFIRMED_APPLIED,
                {
                    "ADOPTION_ID": adoption_id,
                    "EVIDENCE_ID": evidence_id,
                    "RECOVERED_AFTER_ADOPTION_STATE_COMMIT": True,
                },
            )

        if reservation.get("STATE") != "DURABLE_STORED_NOT_ADOPTED" or not reservation.get("READBACK_VERIFIED"):
            raise RequestRejected(
                "durable evidence must be stored and fresh-read before adoption"
            )

        expected_lane_head = req.get("expected_lane_head")
        current_head = self.gh.ref(cfg["implementation_branch"])
        if (
            not expected_lane_head
            or current_head != expected_lane_head
            or reservation.get("IMPLEMENTATION_HEAD") != current_head
        ):
            raise HeadMismatch("adoption implementation head mismatch")

        prefix = f"evidence/{req['lane_id']}/issue-{child}/{evidence_id}/"
        index_bytes, _ = self.gh.content(
            EVIDENCE_BRANCH, prefix + "evidence-set-index.json"
        )
        set_hash = sha256_bytes(index_bytes)
        if (
            set_hash != payload["durable_evidence_set_sha256"]
            or set_hash != reservation.get("DURABLE_EVIDENCE_SET_SHA256")
        ):
            raise RequestRejected("durable evidence set hash mismatch")

        manifest = json.loads(
            self.gh.text(
                EVIDENCE_BRANCH, prefix + "evidence-manifest.candidate.json"
            )
        )
        coordinate = json.loads(
            self.gh.text(EVIDENCE_BRANCH, prefix + "coordinate-audit.json")
        )
        visual = json.loads(
            self.gh.text(EVIDENCE_BRANCH, prefix + "visual-audit.json")
        )
        settings = json.loads(
            self.gh.text(EVIDENCE_BRANCH, prefix + "evidence-settings.json")
        )

        if (
            manifest.get("actual_head_sha") != current_head
            or manifest.get("runtime_build_sha") != current_head
        ):
            raise RequestRejected("evidence actual/runtime HEAD mismatch")
        if (
            manifest.get("target_source_commit_sha")
            != cfg["target_source_commit_sha"]
            or manifest.get("target_blob_sha") != cfg["target_blob_sha"]
        ):
            raise RequestRejected("evidence target identity mismatch")
        if (
            manifest.get("target_dimensions") != CANONICAL_VIEWPORT
            or manifest.get("actual_dimensions") != CANONICAL_VIEWPORT
        ):
            raise RequestRejected("evidence canonical viewport mismatch")

        vp = settings.get("viewport", {})
        if (
            [vp.get("width"), vp.get("height")] != CANONICAL_VIEWPORT
            or vp.get("dpr") != 1
        ):
            raise RequestRejected("evidence settings viewport mismatch")

        coordinate_status = str(
            coordinate.get("STATUS", coordinate.get("status", ""))
        ).upper()
        visual_status = str(
            visual.get("STATUS", visual.get("status", ""))
        ).upper()

        if coordinate_status != "PASS":
            raise RequestRejected("coordinate audit is not PASS")
        if (
            visual_status != "PASS"
            or visual.get("visual_comparison_performed") is not True
        ):
            raise RequestRejected(
                "visual audit is not PASS or comparison was not performed"
            )
        if (
            visual.get("target_image_sha256")
            and visual.get("target_image_sha256")
            != manifest.get("target_image_sha256")
        ):
            raise RequestRejected("visual audit target image hash mismatch")
        if (
            visual.get("actual_image_sha256")
            and visual.get("actual_image_sha256")
            != manifest.get("actual_image_sha256")
        ):
            raise RequestRejected("visual audit actual image hash mismatch")

        op = self._mark_dispatched(req, op)

        def mutate(r):
            if r.get("STATE") != "DURABLE_STORED_NOT_ADOPTED":
                raise RequestRejected("adoption state changed before commit")
            r["STATE"] = "ADOPTED_CHILD_NOT_CLOSED"
            r["ADOPTED_AT"] = now_rfc3339()
            r["VISUAL_AUDIT_STATUS"] = visual_status
            r["COORDINATE_AUDIT_STATUS"] = coordinate_status
            return r

        self._update_adoption_record(
            req["lane_id"],
            adoption_id,
            mutate,
            f"gateway: adopt evidence {adoption_id}",
        )
        return self._finish(
            req,
            op,
            CONFIRMED_APPLIED,
            {"ADOPTION_ID": adoption_id, "EVIDENCE_ID": evidence_id},
        )

    def apply(self, req: dict) -> dict:
        if not self.production_enabled:
            raise RequestRejected("production mutation disabled")
        self._validate_common(req)
        lane_lease = self.lease(req["lane_id"])
        if lane_lease.get("PRODUCTION_ENABLED") is not True:
            raise RequestRejected("lane production cutover disabled")
        op = req["operation_type"]
        if op == "LEASE_ACQUIRE":
            return self.acquire(req)
        handlers = {
            "LEASE_HEARTBEAT": self.heartbeat,
            "LEASE_RELEASE": self.release,
            "IMPLEMENTATION_FILE_UPDATE": self.implementation_file_update,
            "ISSUE_COMMENT": self.issue_comment,
            "ISSUE_CLOSE": self.issue_close,
            "PARENT_PROGRESS_UPDATE": self.parent_progress_update,
            "EVIDENCE_IDENTIFIERS_RESERVE": self.evidence_identifiers_reserve,
            "DURABLE_EVIDENCE_PUBLISH": self.durable_evidence_publish,
            "DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT": self.durable_evidence_publish_from_artifact,
            "EVIDENCE_ADOPT": self.evidence_adopt,
        }
        try:
            return handlers[op](req)
        except KeyError as exc:
            raise RequestRejected(f"operation type not allowlisted: {op}") from exc


def decode_content_spec(spec: Any) -> bytes:
    if isinstance(spec, str):
        return spec.encode("utf-8")
    encoding = spec.get("encoding", "utf-8")
    content = spec.get("content", "")
    if encoding == "utf-8":
        return content.encode("utf-8")
    if encoding == "base64":
        return base64.b64decode(content)
    raise RequestRejected(f"unsupported content encoding {encoding}")


def decode_payload_content(payload: dict) -> bytes:
    return decode_content_spec({"encoding": payload.get("encoding", "utf-8"), "content": payload.get("content", "")})


def load_request(path: str) -> dict:
    return json.loads(open(path, encoding="utf-8").read())


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--request-file", required=True)
    p.add_argument("--result-file", required=True)
    p.add_argument("--production-enabled", action="store_true")
    args = p.parse_args()

    req = load_request(args.request_file)
    gh = GitHub(os.environ["GITHUB_REPOSITORY"], os.environ["LQ_ENV_GATEWAY_WRITER_TOKEN"])
    gateway = Gateway(gh, production_enabled=args.production_enabled)
    try:
        result = {"ok": True, "result": gateway.apply(req)}
    except Exception as exc:
        result = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
        with open(args.result_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        raise
    with open(args.result_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
