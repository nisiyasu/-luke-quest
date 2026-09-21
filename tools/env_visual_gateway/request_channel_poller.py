from __future__ import annotations

import base64
import json
import os
import pathlib
import re
import subprocess
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import Any

from fenced_gateway import (
    ActiveOperation,
    ApiError,
    CasConflict,
    Gateway,
    GatewayError,
    GitHub,
    HeadMismatch,
    LeaseUnavailable,
    RequestRejected,
    StaleEpoch,
)

API = "https://api.github.com"
REQUEST_REF = "main"
RECEIPT_BRANCH = "gateway/request-receipts"
RECEIPT_SCHEMA = "LUKE_QUEST_ENV_GATEWAY_RECEIPT:v1"
def now_rfc3339() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class PublicRequestRepo:
    def __init__(self, repo: str):
        self.repo = repo

    def get(self, path: str) -> Any:
        req = urllib.request.Request(
            API + "/repos/" + self.repo + path,
            headers={
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "luke-quest-env-request-poller",
            },
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def head_sha(self) -> str:
        obj = self.get("/git/ref/heads/" + REQUEST_REF)
        return obj["object"]["sha"]

    def request_files(self, head_sha: str) -> list[dict]:
        tree = self.get("/git/trees/" + head_sha + "?recursive=1")
        out = []
        for entry in tree.get("tree", []):
            path = entry.get("path", "")
            if (
                entry.get("type") == "blob"
                and path.startswith("requests/")
                and path.endswith(".json")
            ):
                parts = path.split("/")
                if len(parts) == 3 and parts[1] in {"village", "castle", "dungeon", "visual-rebuild"}:
                    out.append(
                        {
                            "path": path,
                            "blob_sha": entry["sha"],
                            "lane_from_path": parts[1],
                        }
                    )
        return sorted(out, key=lambda x: x["path"])

    def read_blob(self, blob_sha: str) -> bytes:
        obj = self.get("/git/blobs/" + blob_sha)
        if obj.get("encoding") != "base64":
            raise RuntimeError("request blob is not base64 encoded")
        return base64.b64decode(obj["content"])


class LocalRequestRepo:
    def __init__(self, repo: str, root: str):
        self.repo = repo
        self.root = pathlib.Path(root).resolve()
        self._blobs: dict[str, bytes] = {}

    def _git(self, *args: str) -> str:
        return subprocess.check_output(
            ["git", "-C", str(self.root), *args],
            text=True,
            encoding="utf-8",
        ).strip()

    def head_sha(self) -> str:
        return self._git("rev-parse", "HEAD")

    def request_files(self, head_sha: str) -> list[dict]:
        actual = self.head_sha()
        if actual != head_sha:
            raise RuntimeError(f"request checkout HEAD drifted expected={head_sha} actual={actual}")
        out = []
        for path in sorted(self.root.glob("requests/*/*.json")):
            rel = path.relative_to(self.root).as_posix()
            parts = rel.split("/")
            if len(parts) != 3 or parts[1] not in {"village", "castle", "dungeon", "visual-rebuild"}:
                continue
            blob_sha = self._git("rev-parse", f"HEAD:{rel}")
            content = path.read_bytes()
            self._blobs[blob_sha] = content
            out.append({"path": rel, "blob_sha": blob_sha, "lane_from_path": parts[1]})
        return out

    def read_blob(self, blob_sha: str) -> bytes:
        try:
            return self._blobs[blob_sha]
        except KeyError as exc:
            raise RuntimeError(f"request blob not materialized: {blob_sha}") from exc


def json_bytes(value: dict) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode("utf-8")
REQUEST_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")


def safe_request_id(request_id: str) -> str:
    if not REQUEST_ID_RE.fullmatch(request_id):
        raise RequestRejected("request_id contains unsupported characters")
    return request_id


def receipt_path(request_id: str, *, terminal: bool) -> str:
    safe = safe_request_id(request_id)
    state = "terminal" if terminal else "pending"
    return f"receipts/{state}/{safe}.json"


def legacy_receipt_path(request_id: str) -> str:
    return "receipts/" + safe_request_id(request_id) + ".json"


def terminal_receipt_ids(gh: GitHub) -> set[str]:
    head = gh.ref(RECEIPT_BRANCH)
    tree = gh.request("GET", f"/git/trees/{head}?recursive=1")
    out: set[str] = set()
    prefix = "receipts/terminal/"
    for entry in tree.get("tree", []):
        path = entry.get("path", "")
        if entry.get("type") == "blob" and path.startswith(prefix) and path.endswith(".json"):
            out.add(path[len(prefix):-5])
    return out


def read_receipt(gh: GitHub, request_id: str) -> dict | None:
    paths = [
        receipt_path(request_id, terminal=True),
        receipt_path(request_id, terminal=False),
        legacy_receipt_path(request_id),
    ]
    for path in paths:
        try:
            return gh.json_file(RECEIPT_BRANCH, path)
        except ApiError as exc:
            if exc.status != 404:
                raise
    return None


def write_receipt(gh: GitHub, receipt: dict) -> None:
    path = receipt_path(receipt["request_id"], terminal=receipt.get("terminal") is True)
    gh.cas_write_files(
        RECEIPT_BRANCH,
        {path: json_bytes(receipt)},
        "gateway receipt: " + receipt["request_id"],
    )


def classify_terminal(exc: Exception) -> bool:
    if isinstance(exc, (RequestRejected, StaleEpoch, HeadMismatch)):
        return True
    if isinstance(exc, (LeaseUnavailable, ActiveOperation, CasConflict)):
        return False
    if isinstance(exc, ApiError):
        return exc.status in {400, 401, 403, 404, 409, 422}
    if isinstance(exc, GatewayError):
        return False
    return False
def process_one(
    target: GitHub,
    request_repo: Any,
    source_repo: str,
    source_head: str,
    item: dict,
    terminal_ids: set[str],
) -> tuple[str, bool]:
    raw = request_repo.read_blob(item["blob_sha"])
    req = json.loads(raw.decode("utf-8"))
    request_id = str(req.get("request_id") or "")
    lane_id = str(req.get("lane_id") or "")

    if not request_id:
        raise RequestRejected("request_id required")
    safe_request_id(request_id)
    if pathlib.PurePosixPath(item["path"]).name != request_id + ".json":
        raise RequestRejected("request filename must equal request_id + .json")
    if request_id in terminal_ids:
        return lane_id, True
    if lane_id != item["lane_from_path"]:
        raise RequestRejected(
            f"lane path mismatch path={item['lane_from_path']} request={lane_id}"
        )

    previous = read_receipt(target, request_id)
    if previous and previous.get("terminal") is True:
        return lane_id, True
    if previous and previous.get("source_blob_sha") != item["blob_sha"]:
        receipt = dict(previous)
        receipt.update(
            {
                "ok": False,
                "terminal": True,
                "error": "REQUEST_MUTATED_AFTER_FIRST_RECEIPT",
                "observed_blob_sha": item["blob_sha"],
                "processed_at": now_rfc3339(),
            }
        )
        write_receipt(target, receipt)
        return lane_id, True
    source = {
        "repository": source_repo,
        "ref": REQUEST_REF,
        "commit_sha": source_head,
        "path": item["path"],
        "blob_sha": item["blob_sha"],
    }
    gateway = Gateway(
        target,
        production_enabled=True,
        request_source=source,
    )

    try:
        result = gateway.apply(req)
        receipt = {
            "schema": RECEIPT_SCHEMA,
            "request_id": request_id,
            "operation_id": req.get("operation_id"),
            "lane_id": lane_id,
            "request_sha256": req.get("request_sha256"),
            "source_repository": source_repo,
            "source_commit_sha": source_head,
            "source_path": item["path"],
            "source_blob_sha": item["blob_sha"],
            "ok": True,
            "terminal": True,
            "processed_at": now_rfc3339(),
            "result": result,
        }
        write_receipt(target, receipt)
        return lane_id, True
    except Exception as exc:
        terminal = classify_terminal(exc)
        receipt = {
            "schema": RECEIPT_SCHEMA,
            "request_id": request_id,
            "operation_id": req.get("operation_id"),
            "lane_id": lane_id,
            "request_sha256": req.get("request_sha256"),
            "source_repository": source_repo,
            "source_commit_sha": source_head,
            "source_path": item["path"],
            "source_blob_sha": item["blob_sha"],
            "ok": False,
            "terminal": terminal,
            "processed_at": now_rfc3339(),
            "error": f"{type(exc).__name__}: {exc}",
        }
        write_receipt(target, receipt)
        if terminal:
            return lane_id, True
        return lane_id, False


def main() -> None:
    source_repo = os.environ.get(
        "LQ_ENV_REQUEST_REPOSITORY",
        "nisiyasu/luke-env-gateway-requests",
    )
    token = os.environ["LQ_ENV_GATEWAY_WRITER_TOKEN"]
    target_repo = os.environ["GITHUB_REPOSITORY"]
    limit = int(os.environ.get("LQ_ENV_REQUEST_MAX_PER_RUN", "30"))

    checkout = os.environ.get("LQ_ENV_REQUEST_CHECKOUT")
    source = LocalRequestRepo(source_repo, checkout) if checkout else PublicRequestRepo(source_repo)
    target = GitHub(target_repo, token)
    head = source.head_sha()
    items = source.request_files(head)
    terminal_ids = terminal_receipt_ids(target)
    blocked_lanes: set[str] = set()
    processed = 0

    for item in items:
        if processed >= limit:
            break
        lane = item["lane_from_path"]
        if lane in blocked_lanes:
            continue
        try:
            lane, terminal = process_one(
                target, source, source_repo, head, item, terminal_ids
            )
        except Exception as exc:
            print(
                json.dumps(
                    {
                        "path": item["path"],
                        "ok": False,
                        "error": f"{type(exc).__name__}: {exc}",
                    },
                    ensure_ascii=False,
                )
            )
            blocked_lanes.add(lane)
            continue

        processed += 1
        print(
            json.dumps(
                {
                    "path": item["path"],
                    "lane": lane,
                    "terminal": terminal,
                },
                ensure_ascii=False,
            )
        )
        if not terminal:
            blocked_lanes.add(lane)

    print(
        json.dumps(
            {
                "source_head": head,
                "request_count": len(items),
                "processed": processed,
                "blocked_lanes": sorted(blocked_lanes),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
