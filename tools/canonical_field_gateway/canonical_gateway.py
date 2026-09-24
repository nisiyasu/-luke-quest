from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ENV_GATEWAY_DIR = HERE.parent / "env_visual_gateway"
sys.path.insert(0, str(ENV_GATEWAY_DIR))

import fenced_gateway as base  # noqa: E402

LANE_ID = "field"
PARENT_ISSUE = 12
ROUTER_COMMENT_ID = 5646492352
PROGRAM_ID = "LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2"
IMPLEMENTATION_BRANCH = "prototype/modern-3d"
CONTROL_BRANCH = "control/lease-canonical-field"
TARGET_SOURCE_COMMIT = "90635ceff9d35d69f80da350df1e6ea0610657dd"
TARGET_PATH = "assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png"
TARGET_BLOB_SHA = "b7281e6580689a7a22cfa3b67d500950e4af7285"
PACKET_RANGE = set(range(26, 51))
EVIDENCE_WORKFLOW_ALLOWLIST = {"m02-p01-visible-evidence.yml"}

base.ALLOWED_LANES[LANE_ID] = {
    "parent": PARENT_ISSUE,
    "children": PACKET_RANGE,
    "implementation_branch": IMPLEMENTATION_BRANCH,
    "control_branch": CONTROL_BRANCH,
    "target_source_commit_sha": TARGET_SOURCE_COMMIT,
    "target_path": TARGET_PATH,
    "target_blob_sha": TARGET_BLOB_SHA,
}

ROUTER_FIELDS = {
    "PROGRAM_ID",
    "PARENT_ISSUE",
    "CURRENT_STAGE",
    "CURRENT_PACKET_ID",
    "CURRENT_PACKET_ISSUE",
    "NEXT_PACKET_ID",
    "STATUS",
    "ROUTER_VERSION",
    "LAST_TRANSITION",
}


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def parse_router(body: str) -> dict:
    if "<!-- WORK_PACKET_ROUTER:v1 -->" not in body:
        raise base.RequestRejected("router marker missing")
    fields: dict[str, str] = {}
    for line in body.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in ROUTER_FIELDS:
            fields[key] = value.strip()
    required = {
        "PROGRAM_ID",
        "PARENT_ISSUE",
        "CURRENT_PACKET_ID",
        "CURRENT_PACKET_ISSUE",
        "ROUTER_VERSION",
    }
    missing = required - set(fields)
    if missing:
        raise base.RequestRejected(
            "router missing fields: " + ",".join(sorted(missing))
        )
    if fields["PROGRAM_ID"] != PROGRAM_ID:
        raise base.RequestRejected("router program id mismatch")
    if fields["PARENT_ISSUE"] != "#12":
        raise base.RequestRejected("router parent mismatch")
    if fields["ROUTER_VERSION"] != "v1":
        raise base.RequestRejected("router version mismatch")
    m = re.fullmatch(r"#(\d+)", fields["CURRENT_PACKET_ISSUE"])
    if not m:
        raise base.RequestRejected("router current packet issue invalid")
    issue = int(m.group(1))
    if issue not in PACKET_RANGE:
        raise base.RequestRejected("router current packet outside packet range")
    fields["_CURRENT_PACKET_NUMBER"] = issue
    return fields


def packet_id_from_issue_body(body: str) -> str:
    m = re.search(r"(?m)^PACKET_ID:\s*([^\s]+)\s*$", body or "")
    if not m:
        raise base.RequestRejected("packet issue PACKET_ID missing")
    return m.group(1).strip()


class CanonicalFieldGateway(base.Gateway):
    def _router_comment(self) -> dict:
        matches = [
            c for c in self.gh.comments(PARENT_ISSUE)
            if int(c["id"]) == ROUTER_COMMENT_ID
        ]
        if len(matches) != 1:
            raise base.RequestRejected("canonical router comment unavailable")
        return matches[0]

    def router_state(self) -> tuple[dict, dict]:
        comment = self._router_comment()
        body = comment.get("body") or ""
        parsed = parse_router(body)
        issue = self.gh.issue(parsed["_CURRENT_PACKET_NUMBER"])
        actual_packet_id = packet_id_from_issue_body(issue.get("body") or "")
        if actual_packet_id != parsed["CURRENT_PACKET_ID"]:
            raise base.RequestRejected(
                "router CURRENT_PACKET_ID does not match issue body"
            )
        return comment, parsed

    def _assert_issue_allowed(self, lane_id: str, issue: int) -> None:
        if lane_id != LANE_ID:
            return super()._assert_issue_allowed(lane_id, issue)
        _, router = self.router_state()
        if issue != router["_CURRENT_PACKET_NUMBER"]:
            raise base.RequestRejected(
                f"issue {issue} is not fresh router CURRENT_PACKET"
            )

    def router_assert(self, req: dict) -> dict:
        self._validate_common(req)
        comment, router = self.router_state()
        expected_hash = str(
            req.get("payload", {}).get("expected_router_body_sha256") or ""
        )
        body = comment.get("body") or ""
        actual_hash = sha256_text(body)
        if expected_hash and expected_hash != actual_hash:
            raise base.HeadMismatch("router body hash mismatch")
        return {
            "ROUTER_COMMENT_ID": ROUTER_COMMENT_ID,
            "ROUTER_BODY_SHA256": actual_hash,
            "CURRENT_PACKET_ISSUE": router["_CURRENT_PACKET_NUMBER"],
            "CURRENT_PACKET_ID": router["CURRENT_PACKET_ID"],
            "CURRENT_STAGE": router.get("CURRENT_STAGE"),
            "STATUS": router.get("STATUS"),
            "IMPLEMENTATION_HEAD": self.gh.ref(IMPLEMENTATION_BRANCH),
        }

    def current_packet_state(self, req: dict) -> dict:
        self._validate_common(req)
        payload = req.get("payload", {})
        desired = str(payload.get("state") or "").lower()
        if desired not in {"open", "closed"}:
            raise base.RequestRejected("state must be open or closed")

        _, router = self.router_state()
        issue = int(payload.get("issue_number") or 0)
        if issue != router["_CURRENT_PACKET_NUMBER"]:
            raise base.RequestRejected(
                "packet state mutation must target fresh current packet"
            )

        if desired == "closed":
            evidence_op = str(
                payload.get("evidence_comment_operation_id") or ""
            )
            if not evidence_op:
                raise base.RequestRejected(
                    "closing current packet requires evidence comment operation id"
                )
            marker = f"[LQ_GATEWAY_OP:{evidence_op}]"
            if len(self.gh.find_comment(issue, marker)) != 1:
                raise base.RequestRejected(
                    "required gateway evidence comment marker not found"
                )

        _, op, _ = self._start_operation(
            req,
            "CURRENT_PACKET_STATE",
            f"issue-{issue}:{desired}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == base.CONFIRMED_APPLIED:
            return op

        current = self.gh.issue(issue)
        if current.get("state") != desired:
            op = self._mark_dispatched(req, op)
            self.gh.request(
                "PATCH",
                f"/issues/{issue}",
                {"state": desired},
                ok=(200,),
            )
            current = self.gh.issue(issue)
            if current.get("state") != desired:
                raise base.GatewayError("packet state fresh readback failed")

        return self._finish(
            req,
            op,
            base.CONFIRMED_APPLIED,
            {"ISSUE_NUMBER": issue, "ISSUE_STATE": desired},
        )

    def router_update(self, req: dict) -> dict:
        self._validate_common(req)
        payload = req.get("payload", {})
        expected_hash = str(payload.get("expected_router_body_sha256") or "")
        transition = str(payload.get("transition_type") or "")
        new_body = str(payload.get("body") or "")
        if transition not in {"PASS_ADVANCE", "FAIL_ROUTE", "STATE_REFRESH"}:
            raise base.RequestRejected("unsupported router transition_type")

        comment, current = self.router_state()
        current_body = comment.get("body") or ""
        actual_hash = sha256_text(current_body)
        if expected_hash != actual_hash:
            raise base.HeadMismatch(
                "router body changed since request was prepared"
            )

        expected_current = int(
            payload.get("expected_current_packet_issue") or 0
        )
        if expected_current != current["_CURRENT_PACKET_NUMBER"]:
            raise base.RequestRejected(
                "expected_current_packet_issue mismatch"
            )

        new = parse_router(new_body)
        target_issue = new["_CURRENT_PACKET_NUMBER"]
        target_obj = self.gh.issue(target_issue)
        target_packet_id = packet_id_from_issue_body(
            target_obj.get("body") or ""
        )
        if target_packet_id != new["CURRENT_PACKET_ID"]:
            raise base.RequestRejected(
                "new router packet id does not match target issue"
            )

        if transition == "PASS_ADVANCE":
            current_obj = self.gh.issue(current["_CURRENT_PACKET_NUMBER"])
            if current_obj.get("state") != "closed":
                raise base.RequestRejected(
                    "PASS_ADVANCE requires current packet already closed"
                )

        _, op, _ = self._start_operation(
            req,
            "ROUTER_UPDATE",
            f"issue-{PARENT_ISSUE}-comment-{ROUTER_COMMENT_ID}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == base.CONFIRMED_APPLIED:
            return op

        fresh_comment = self._router_comment()
        fresh_body = fresh_comment.get("body") or ""
        if fresh_body == new_body:
            return self._finish(
                req,
                op,
                base.CONFIRMED_APPLIED,
                {
                    "ROUTER_COMMENT_ID": ROUTER_COMMENT_ID,
                    "ROUTER_BODY_SHA256": sha256_text(new_body),
                    "RECONCILED_BY_READBACK": True,
                },
            )
        if sha256_text(fresh_body) != expected_hash:
            raise base.HeadMismatch(
                "router changed before gateway dispatch"
            )

        op = self._mark_dispatched(req, op)
        self.gh.update_comment(ROUTER_COMMENT_ID, new_body)
        readback = self._router_comment().get("body") or ""
        if readback != new_body:
            self._persist_operation_state(
                req,
                op,
                base.RESULT_UNKNOWN,
                {"EXPECTED_ROUTER_BODY_SHA256": sha256_text(new_body)},
                clear_active=False,
            )
            raise base.GatewayError("router update readback mismatch")

        return self._finish(
            req,
            op,
            base.CONFIRMED_APPLIED,
            {
                "ROUTER_COMMENT_ID": ROUTER_COMMENT_ID,
                "ROUTER_BODY_SHA256": sha256_text(new_body),
                "CURRENT_PACKET_ISSUE": target_issue,
                "CURRENT_PACKET_ID": new["CURRENT_PACKET_ID"],
            },
        )

    def evidence_workflow_dispatch(self, req: dict) -> dict:
        self._validate_common(req)
        payload = req.get("payload", {})
        workflow = str(payload.get("workflow") or "")
        if workflow not in EVIDENCE_WORKFLOW_ALLOWLIST:
            raise base.RequestRejected("evidence workflow not allowlisted")

        _, router = self.router_state()
        expected_packet = int(payload.get("expected_current_packet_issue") or 0)
        if expected_packet != router["_CURRENT_PACKET_NUMBER"]:
            raise base.RequestRejected("evidence dispatch current packet mismatch")

        expected_head = str(req.get("expected_lane_head") or "")
        actual_head = self.gh.ref(IMPLEMENTATION_BRANCH)
        if not expected_head or expected_head != actual_head:
            raise base.HeadMismatch("evidence dispatch requires exact implementation HEAD")

        _, op, _ = self._start_operation(
            req,
            "EVIDENCE_WORKFLOW_DISPATCH",
            f"workflow:{workflow}@{actual_head}",
            "IDEMPOTENT_RETRY_SAFE",
        )
        if op["OPERATION_STATE"] == base.CONFIRMED_APPLIED:
            return op

        op = self._mark_dispatched(req, op)
        self.gh.request(
            "POST",
            f"/actions/workflows/{workflow}/dispatches",
            {"ref": IMPLEMENTATION_BRANCH, "inputs": {"expected_head": actual_head}},
            ok=(204,),
        )
        return self._finish(
            req,
            op,
            base.CONFIRMED_APPLIED,
            {
                "WORKFLOW": workflow,
                "DISPATCH_REF": IMPLEMENTATION_BRANCH,
                "EXPECTED_HEAD": actual_head,
                "CURRENT_PACKET_ISSUE": expected_packet,
            },
        )

    def apply(self, req: dict) -> dict:
        if not self.production_enabled:
            raise base.RequestRejected("production mutation disabled")
        self._validate_common(req)
        if req.get("lane_id") != LANE_ID:
            raise base.RequestRejected("canonical gateway accepts field lane only")

        lane_lease = self.lease(LANE_ID)
        if lane_lease.get("PRODUCTION_ENABLED") is not True:
            raise base.RequestRejected("canonical field cutover disabled")

        op = req["operation_type"]
        if op == "LEASE_ACQUIRE":
            return self.acquire(req)

        handlers = {
            "LEASE_HEARTBEAT": self.heartbeat,
            "LEASE_RELEASE": self.release,
            "IMPLEMENTATION_FILE_UPDATE": self.implementation_file_update,
            "ISSUE_COMMENT": self.issue_comment,
            "ROUTER_ASSERT": self.router_assert,
            "CURRENT_PACKET_STATE": self.current_packet_state,
            "ROUTER_UPDATE": self.router_update,
            "EVIDENCE_WORKFLOW_DISPATCH": self.evidence_workflow_dispatch,
        }
        try:
            return handlers[op](req)
        except KeyError as exc:
            raise base.RequestRejected(
                f"canonical operation type not allowlisted: {op}"
            ) from exc


def load_request(path: str) -> dict:
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--request-file", required=True)
    p.add_argument("--result-file", required=True)
    p.add_argument("--production-enabled", action="store_true")
    args = p.parse_args()

    req = load_request(args.request_file)
    gh = base.GitHub(
        os.environ["GITHUB_REPOSITORY"],
        os.environ["GITHUB_TOKEN"],
    )
    gateway = CanonicalFieldGateway(
        gh,
        production_enabled=args.production_enabled,
    )
    try:
        result = {"ok": True, "result": gateway.apply(req)}
    except Exception as exc:
        result = {"ok": False, "error": f"{type(exc).__name__}: {exc}"}
        pathlib.Path(args.result_file).write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(json.dumps(result, ensure_ascii=False, indent=2))
        raise
    pathlib.Path(args.result_file).write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
