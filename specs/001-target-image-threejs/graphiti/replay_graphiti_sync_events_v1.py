from __future__ import annotations

import argparse
import json
import subprocess
import tempfile
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--python", required=True)
    ap.add_argument("--wrapper", required=True)
    ap.add_argument("--env-file", required=True)
    ap.add_argument("--events-dir", required=True)
    ap.add_argument("--group-id")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    events_dir = Path(args.events_dir)
    events = []

    for p in events_dir.glob("*.json"):
        data = json.loads(p.read_text(encoding="utf-8"))
        if data.get("schema") != "LQ_GRAPHITI_SYNC_EVENT_V2":
            continue
        if args.group_id and data.get("group_id") != args.group_id:
            continue
        events.append((data.get("valid_at", ""), data.get("observed_at", ""), data["event_id"], p))

    events.sort(key=lambda x: (x[0], x[1], x[2]))

    receipts = []
    with tempfile.TemporaryDirectory(prefix="lq_graphiti_replay_") as td:
        td_path = Path(td)
        for _, _, event_id, event_path in events:
            receipt_path = td_path / f"{event_id}.json"
            cmd = [
                args.python,
                args.wrapper,
                "--env-file", args.env_file,
                "sync-event",
                str(event_path),
                "--out", str(receipt_path),
            ]
            p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
            if p.returncode != 0:
                result = {
                    "schema": "LQ_GRAPHITI_EVENT_REPLAY_REPORT_V1",
                    "status": "FAIL",
                    "failed_event_id": event_id,
                    "stderr": p.stderr,
                    "stdout": p.stdout,
                    "completed": receipts,
                }
                Path(args.out).write_text(
                    json.dumps(result, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                    newline="\n",
                )
                return p.returncode
            receipts.append(json.loads(receipt_path.read_text(encoding="utf-8")))

    result = {
        "schema": "LQ_GRAPHITI_EVENT_REPLAY_REPORT_V1",
        "status": "PASS",
        "group_id": args.group_id,
        "event_count": len(events),
        "receipts": receipts,
    }
    Path(args.out).write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(json.dumps({"status": "PASS", "event_count": len(events)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
