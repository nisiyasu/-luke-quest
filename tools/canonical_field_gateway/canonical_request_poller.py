from __future__ import annotations

import argparse
import json
import os
import pathlib
import re
import subprocess
from datetime import datetime, timezone

HERE = pathlib.Path(__file__).resolve().parent
import sys
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "env_visual_gateway"))

from canonical_gateway import CanonicalFieldGateway  # noqa: E402
import fenced_gateway as base  # noqa: E402

RECEIPT_BRANCH = "gateway/canonical-field-request-receipts"
RECEIPT_SCHEMA = "LUKE_QUEST_CANONICAL_FIELD_GATEWAY_RECEIPT:v1"
REQUEST_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")


def now_rfc3339() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def json_bytes(value: dict) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True)
        + "\n"
    ).encode("utf-8")


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
            raise RuntimeError(
                f"request checkout HEAD drifted expected={head_sha} actual={actual}"
            )
        out = []
        for path in sorted(self.root.glob("field-requests/*.json")):
            rel = path.relative_to(self.root).as_posix()
            blob_sha = self._git("rev-parse", f"HEAD:{rel}")
            content = path.read_bytes()
            self._blobs[blob_sha] = content
            out.append(
                {
                    "path": rel,
                    "blob_sha": blob_sha,
                }
            )
        return out

    def read_blob(self, blob_sha: str) -> bytes:
        return self._blobs[blob_sha]


def safe_request_id(value: str) -> str:
    if not REQUEST_ID_RE.fullmatch(value):
        raise base.RequestRejected("invalid request_id")
    return value


def receipt_path(request_id: str, terminal: bool) -> str:
    state = "terminal" if terminal else "pending"
    return f"receipts/{state}/{safe_request_id(request_id)}.json"


def read_receipt(gh: base.GitHub, request_id: str) -> dict | None:
    for terminal in (True, False):
        try:
            return gh.json_file(
                RECEIPT_BRANCH,
                receipt_path(request_id, terminal),
            )
        except base.ApiError as exc:
            if exc.status != 404:
                raise
    return None


def write_receipt(gh: base.GitHub, receipt: dict) -> None:
    gh.cas_write_files(
        RECEIPT_BRANCH,
        {
            receipt_path(
                receipt["request_id"],
                receipt.get("terminal") is True,
            ): json_bytes(receipt)
        },
        "canonical field gateway receipt: " + receipt["request_id"],
    )


def terminal_ids(gh: base.GitHub) -> set[str]:
    head = gh.ref(RECEIPT_BRANCH)
    tree = gh.request("GET", f"/git/trees/{head}?recursive=1")
    prefix = "receipts/terminal/"
    out = set()
    for entry in tree.get("tree", []):
        path = entry.get("path", "")
        if (
            entry.get("type") == "blob"
            and path.startswith(prefix)
            and path.endswith(".json")
        ):
            out.add(path[len(prefix):-5])
    return out


def classify_terminal(exc: Exception) -> bool:
    if isinstance(
        exc,
        (
            base.RequestRejected,
            base.StaleEpoch,
            base.HeadMismatch,
        ),
    ):
        return True
    if isinstance(
        exc,
        (
            base.LeaseUnavailable,
            base.ActiveOperation,
            base.CasConflict,
        ),
    ):
        return False
    if isinstance(exc, base.ApiError):
        return exc.status in {400, 401, 403, 404, 409, 422}
    if isinstance(exc, base.GatewayError):
        return False
    return False


def process_one(
    target: base.GitHub,
    request_repo: LocalRequestRepo,
    source_repo: str,
    source_head: str,
    item: dict,
    done: set[str],
) -> None:
    raw = request_repo.read_blob(item["blob_sha"])
    req = json.loads(raw.decode("utf-8"))
    request_id = safe_request_id(str(req.get("request_id") or ""))
    if pathlib.PurePosixPath(item["path"]).name != request_id + ".json":
        raise base.RequestRejected("request filename mismatch")
    if req.get("lane_id") != "field":
        raise base.RequestRejected("canonical request lane must be field")
    if request_id in done:
        return

    previous = read_receipt(target, request_id)
    if previous and previous.get("terminal") is True:
        return
    if (
        previous
        and previous.get("source_blob_sha") != item["blob_sha"]
    ):
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
        return

    source = {
        "repository": source_repo,
        "ref": "main",
        "commit_sha": source_head,
        "path": item["path"],
        "blob_sha": item["blob_sha"],
    }
    gateway = CanonicalFieldGateway(
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
            "lane_id": "field",
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
    except Exception as exc:
        receipt = {
            "schema": RECEIPT_SCHEMA,
            "request_id": request_id,
            "operation_id": req.get("operation_id"),
            "lane_id": "field",
            "request_sha256": req.get("request_sha256"),
            "source_repository": source_repo,
            "source_commit_sha": source_head,
            "source_path": item["path"],
            "source_blob_sha": item["blob_sha"],
            "ok": False,
            "terminal": classify_terminal(exc),
            "processed_at": now_rfc3339(),
            "error": f"{type(exc).__name__}: {exc}",
        }
    write_receipt(target, receipt)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--request-checkout", required=True)
    p.add_argument(
        "--request-repository",
        default="nisiyasu/luke-env-gateway-requests",
    )
    args = p.parse_args()

    if os.environ.get(
        "LQ_CANONICAL_FIELD_GATEWAY_PRODUCTION_ENABLED",
        "false",
    ).lower() != "true":
        print("canonical field gateway global kill switch is false")
        return

    target = base.GitHub(
        os.environ["GITHUB_REPOSITORY"],
        os.environ["GITHUB_TOKEN"],
    )
    request_repo = LocalRequestRepo(
        args.request_repository,
        args.request_checkout,
    )
    source_head = request_repo.head_sha()
    done = terminal_ids(target)
    for item in request_repo.request_files(source_head):
        process_one(
            target,
            request_repo,
            args.request_repository,
            source_head,
            item,
            done,
        )


if __name__ == "__main__":
    main()
