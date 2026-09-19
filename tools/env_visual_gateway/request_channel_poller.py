from __future__ import annotations

import base64
import json
import os
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
                if len(parts) == 3 and parts[1] in {"village", "castle", "dungeon"}:
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


def json_bytes(value: dict) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    ).encode("utf-8")
def receipt_path(request_id: str) -> str:
    safe = request_id.replace("/", "_").replace("..", "_")
    return "receipts/" + safe + ".json"


def read_receipt(gh: GitHub, request_id: str) -> dict | None:
    try:
        return gh.json_file(RECEIPT_BRANCH, receipt_path(request_id))
    except ApiError as exc:
        if exc.status == 404:
            return None
        raise


def write_receipt(gh: GitHub, receipt: dict) -> None:
    gh.cas_write_files(
        RECEIPT_BRANCH,
        {receipt_path(receipt["request_id"]): json_bytes(receipt)},
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
    request_repo: PublicRequestRepo,
    source_repo: str,
    source_head: str,
    item: dict,
) -> tuple[str, bool]:
    raw = request_repo.read_blob(item["blob_sha"])
    req = json.loads(raw.decode("utf-8"))
    request_id = str(req.get("request_id") or "")
    lane_id = str(req.get("lane_id") or "")

    if not request_id:
        raise RequestRejected("request_id required")
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

    source = PublicRequestRepo(source_repo)
    target = GitHub(target_repo, token)
    head = source.head_sha()
    items = source.request_files(head)
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
                target, source, source_repo, head, item
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
