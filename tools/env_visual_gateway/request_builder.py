from __future__ import annotations

import argparse
import hashlib
import json
import uuid
from datetime import datetime, timezone

TARGETS = {
    "village": {
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "e6536371eddcc7fb5cf5803568216f008011a5f1",
    },
    "castle": {
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "573c13225471820d063043a37e3ee26fad389d63",
    },
    "dungeon": {
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "198d0f5f3da115b70218ae8180d5f8363d744959",
    },
}


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def main():
    p=argparse.ArgumentParser()
    p.add_argument("--lane", choices=sorted(TARGETS), required=True)
    p.add_argument("--owner-run-id", required=True)
    p.add_argument("--lease-epoch", type=int, required=True)
    p.add_argument("--operation-id", required=True)
    p.add_argument("--operation-type", required=True)
    p.add_argument("--expected-lane-head")
    p.add_argument("--payload-json", default="{}")
    p.add_argument("--request-id")
    p.add_argument("--output", required=True)
    a=p.parse_args()

    payload=json.loads(a.payload_json)
    req={
        "schema":"LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id":a.request_id or str(uuid.uuid4()),
        "lane_id":a.lane,
        "owner_run_id":a.owner_run_id,
        "lease_epoch":a.lease_epoch,
        "operation_id":a.operation_id,
        "operation_type":a.operation_type,
        "expected_lane_head":a.expected_lane_head,
        "expected_target_identity":TARGETS[a.lane],
        "payload":payload,
        "created_at":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),
        "request_sha256":"",
    }
    req["request_sha256"]=hashlib.sha256(canonical(req).encode("utf-8")).hexdigest()
    with open(a.output,"w",encoding="utf-8") as f:
        json.dump(req,f,ensure_ascii=False,indent=2,sort_keys=True)
        f.write("\n")
    print(canonical(req))


if __name__=="__main__":
    main()
