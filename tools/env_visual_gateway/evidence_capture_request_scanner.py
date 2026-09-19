from __future__ import annotations

import base64
import hashlib
import json
import os
import pathlib
import urllib.parse
import urllib.request
from datetime import datetime, timezone

API = "https://api.github.com"
REQUEST_ROOT = pathlib.Path(os.environ["LQ_ENV_REQUEST_CHECKOUT"])
REPO = os.environ["GITHUB_REPOSITORY"]
TOKEN = os.environ["GITHUB_TOKEN"]

LANES = {
    "village": {
        "control_branch": "control/lease-village",
        "implementation_branch": "environment/village",
        "children": set(range(54, 68)),
        "runtime_dir": "prototypes/modern-3d",
        "page_path": "village-g0.html",
        "parent_issue": 51,
        "target_path": "references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "e6536371eddcc7fb5cf5803568216f008011a5f1",
        "ready_mode": "visual-ready",
    },
    "castle": {
        "control_branch": "control/lease-castle",
        "implementation_branch": "environment/castle",
        "children": set(range(68, 82)),
        "runtime_dir": "prototypes/modern-3d",
        "page_path": "castle-g0.html",
        "parent_issue": 52,
        "target_path": "references/target-quality/environments/CASTLE_INTERIOR_TARGET_OWNER_20260914.png",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "573c13225471820d063043a37e3ee26fad389d63",
        "ready_mode": "visual-ready",
    },
    "dungeon": {
        "control_branch": "control/lease-dungeon",
        "implementation_branch": "environment/dungeon",
        "children": set(range(82, 96)),
        "runtime_dir": ".",
        "page_path": "dungeon-g0.html",
        "parent_issue": 53,
        "target_path": "references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png",
        "target_source_commit_sha": "0d225f77944eb54eed648b76f00869879f4284ff",
        "target_blob_sha": "198d0f5f3da115b70218ae8180d5f8363d744959",
        "ready_mode": "load",
    },
}

def canonical(v):
    return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def request_json(method, path):
    req = urllib.request.Request(API + "/repos/" + REPO + path, method=method)
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "lq-env-evidence-capture-scanner")
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
        return json.loads(raw.decode("utf-8")) if raw else None

def content(branch, path):
    q = urllib.parse.urlencode({"ref": branch})
    obj = request_json("GET", "/contents/" + urllib.parse.quote(path, safe="/") + "?" + q)
    return base64.b64decode(obj["content"])

def json_file(branch, path):
    return json.loads(content(branch, path).decode("utf-8"))

def ref(branch):
    return request_json("GET", "/git/ref/" + urllib.parse.quote("heads/" + branch, safe="/"))["object"]["sha"]

def parse_time(value):
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()

def artifact_exists(name):
    q = urllib.parse.urlencode({"name": name, "per_page": 100})
    obj = request_json("GET", "/actions/artifacts?" + q)
    return any(not a.get("expired") for a in obj.get("artifacts", []))

def validate_hash(req):
    supplied = req.get("request_sha256")
    normalized = dict(req)
    normalized["request_sha256"] = ""
    actual = hashlib.sha256(canonical(normalized).encode("utf-8")).hexdigest()
    return supplied == actual

def target_identity(cfg):
    return {
        "target_source_commit_sha": cfg["target_source_commit_sha"],
        "target_blob_sha": cfg["target_blob_sha"],
    }

def candidate(path):
    req = json.loads(path.read_text(encoding="utf-8"))
    lane = path.parent.name
    cfg = LANES[lane]
    if req.get("schema") != "LUKE_QUEST_ENV_EVIDENCE_CAPTURE_REQUEST:v1":
        return None, "schema"
    if req.get("lane_id") != lane or req.get("expected_target_identity") != target_identity(cfg):
        return None, "identity"
    if not validate_hash(req):
        return None, "hash"
    if path.name != str(req.get("request_id")) + ".json":
        return None, "filename"
    child = req.get("child_issue")
    if child not in cfg["children"]:
        return None, "child"

    lease = json_file(cfg["control_branch"], "lease-state.json")
    if lease.get("PRODUCTION_ENABLED") is not True:
        return None, "lane-production-disabled"
    if lease.get("LEASE_STATUS") != "ACTIVE":
        return None, "lease-not-active"
    if lease.get("OWNER_RUN_ID") != req.get("owner_run_id"):
        return None, "owner"
    if int(lease.get("LEASE_EPOCH", -1)) != int(req.get("lease_epoch", -2)):
        return None, "epoch"
    if parse_time(lease.get("LEASE_UNTIL")) is not None and parse_time(lease.get("LEASE_UNTIL")) <= datetime.now(timezone.utc).timestamp():
        return None, "expired"
    if lease.get("ACTIVE_OPERATION_ID") is not None:
        return None, "active-operation"

    current_head = ref(cfg["implementation_branch"])
    if current_head != req.get("implementation_head"):
        return None, "head"

    adoption = json_file(cfg["control_branch"], "adoptions/" + str(req["adoption_id"]) + ".json")
    if adoption.get("STATE") != "IDENTIFIERS_RESERVED":
        return None, "adoption-state"
    checks = {
        "EVIDENCE_ID": req.get("evidence_id"),
        "ADOPTION_ID": req.get("adoption_id"),
        "CHILD_ISSUE": child,
        "OWNER_RUN_ID": req.get("owner_run_id"),
        "LEASE_EPOCH": req.get("lease_epoch"),
        "IMPLEMENTATION_HEAD": current_head,
    }
    for k, v in checks.items():
        if adoption.get(k) != v:
            return None, "adoption-" + k.lower()

    artifact_name = "lq-env-evidence-" + req["request_id"]
    if artifact_exists(artifact_name):
        return None, "already-captured"

    return {
        "request_id": req["request_id"],
        "lane_id": lane,
        "implementation_sha": current_head,
        "child_issue": child,
        "runtime_dir": cfg["runtime_dir"],
        "page_path": cfg["page_path"],
        "parent_issue": cfg["parent_issue"],
        "target_path": cfg["target_path"],
        "target_source_commit": cfg["target_source_commit_sha"],
        "target_blob_sha": cfg["target_blob_sha"],
        "ready_mode": cfg["ready_mode"],
        "artifact_name": artifact_name,
    }, None

def main():
    chosen = []
    used_lanes = set()
    for path in sorted(REQUEST_ROOT.glob("evidence-requests/*/*.json")):
        lane = path.parent.name
        if lane not in LANES or lane in used_lanes:
            continue
        try:
            item, reason = candidate(path)
        except Exception as exc:
            print(json.dumps({"path": str(path), "eligible": False, "reason": type(exc).__name__ + ": " + str(exc)}))
            continue
        if item:
            chosen.append(item)
            used_lanes.add(lane)
            print(json.dumps({"path": str(path), "eligible": True, "request_id": item["request_id"]}))
        else:
            print(json.dumps({"path": str(path), "eligible": False, "reason": reason}))
    matrix = {"include": chosen}
    output = os.environ.get("GITHUB_OUTPUT")
    if output:
        with open(output, "a", encoding="utf-8") as f:
            f.write("matrix=" + json.dumps(matrix, separators=(",", ":")) + "\n")
            f.write("count=" + str(len(chosen)) + "\n")
    print(json.dumps({"matrix": matrix, "count": len(chosen)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
