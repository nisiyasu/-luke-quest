from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

SECRET_PATTERNS = [
    re.compile(r"ghp_[A-Za-z0-9]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"(?i)\b(password|token|secret|pat)\b\s*[:=]\s*[^\s]{8,}"),
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    ap.add_argument("--manifest", default="GRAPHITI_HYDRATION_MANIFEST_v3.json")
    args = ap.parse_args()

    root = Path(args.root)
    manifest_path = root / args.manifest
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    checks = []
    failures = []

    for name, meta in manifest["files"].items():
        p = root / name
        if not p.exists():
            failures.append(f"missing:{name}")
            continue
        actual = sha256(p)
        ok = actual == meta["sha256"]
        checks.append({"file": name, "expected": meta["sha256"], "actual": actual, "ok": ok})
        if not ok:
            failures.append(f"sha256:{name}")

    handoff_name = manifest["handoff_file"]
    handoff = (root / handoff_name).read_text(encoding="utf-8")
    start_marker = manifest["handoff_start_marker"]
    end_marker = manifest["handoff_end_marker"]
    start_count = handoff.count(start_marker)
    end_count = handoff.count(end_marker)
    if start_count != 1:
        failures.append(f"start_marker_count:{start_count}")
    if end_count != 1:
        failures.append(f"end_marker_count:{end_count}")

    for name in manifest["files"]:
        p = root / name
        if not p.exists() or p.suffix.lower() not in {".md", ".json", ".py", ".txt"}:
            continue
        text = p.read_text(encoding="utf-8", errors="strict")
        for pattern in SECRET_PATTERNS:
            if pattern.search(text):
                failures.append(f"secret_pattern:{name}:{pattern.pattern}")

    required_pins = manifest.get("version_pins", {})
    req_name = manifest.get("requirements_lock_file")
    if req_name:
        req = (root / req_name).read_text(encoding="utf-8")
        for pkg, ver in required_pins.items():
            if pkg == "wrapper":
                continue
            needle = f"{pkg}=={ver}"
            if needle not in req:
                failures.append(f"missing_pin:{needle}")

    result = {
        "schema": "LQ_GRAPHITI_HYDRATION_BUNDLE_VERIFY_V1",
        "status": "PASS" if not failures else "FAIL",
        "manifest": str(manifest_path),
        "checks": checks,
        "start_marker_count": start_count,
        "end_marker_count": end_count,
        "failures": failures,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
