from __future__ import annotations

import argparse
import json
import subprocess
import time
from pathlib import PurePosixPath

RECEIPT_BRANCH = "refs/heads/gateway/request-receipts"


def git(repo: str, *args: str, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        ["git", "-C", repo, *args],
        text=True,
        encoding="utf-8",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=check,
    )


def remote_receipt_head(repo: str) -> str | None:
    result = git(repo, "ls-remote", "origin", RECEIPT_BRANCH)
    line = result.stdout.strip()
    return line.split()[0] if line else None


def read_at(repo: str, commit: str, path: str) -> str | None:
    probe = git(repo, "cat-file", "-e", f"{commit}^{{commit}}", check=False)
    if probe.returncode != 0:
        fetched = git(repo, "fetch", "--quiet", "origin", commit, check=False)
        if fetched.returncode != 0:
            return None
    shown = git(repo, "show", f"{commit}:{path}", check=False)
    return shown.stdout if shown.returncode == 0 else None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--request-id", required=True)
    ap.add_argument("--timeout-seconds", type=int, default=600)
    ap.add_argument("--interval-seconds", type=int, default=10)
    args = ap.parse_args()

    if "/" in args.request_id or ".." in args.request_id:
        raise SystemExit("invalid request id")
    terminal_path = PurePosixPath(
        "receipts", "terminal", args.request_id + ".json"
    ).as_posix()
    pending_path = PurePosixPath(
        "receipts", "pending", args.request_id + ".json"
    ).as_posix()
    deadline = time.monotonic() + args.timeout_seconds
    last_head = None

    while time.monotonic() < deadline:
        head = remote_receipt_head(args.repo)
        if head:
            raw = read_at(args.repo, head, terminal_path)
            if raw:
                receipt = json.loads(raw)
                print(json.dumps(receipt, ensure_ascii=False))
                return 0 if receipt.get("ok") is True else 3
            if head != last_head:
                pending = read_at(args.repo, head, pending_path)
                status = "PENDING" if pending else "WAITING"
                print(json.dumps(
                    {"status": status, "request_id": args.request_id,
                     "receipt_head": head},
                    ensure_ascii=False,
                ), flush=True)
                last_head = head
        time.sleep(max(1, args.interval_seconds))

    # A wait timeout is NOT a run endpoint: the request is still NONTERMINAL.
    print(json.dumps(
        {"status": "TIMEOUT", "request_id": args.request_id,
         "timeout_seconds": args.timeout_seconds,
         "terminal": False,
         "next_action": "CONTINUE_WAITING_SAME_REQUEST_ID"},
        ensure_ascii=False,
    ))
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
