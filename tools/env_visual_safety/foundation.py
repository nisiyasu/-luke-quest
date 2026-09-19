from __future__ import annotations

import contextlib
import hashlib
import json
import os
from pathlib import Path
from typing import Any, Dict

try:
    import fcntl
except ImportError as exc:
    raise RuntimeError("env_visual_safety requires a POSIX runner with fcntl") from exc

ACTIVE = "ACTIVE"
RELEASED = "RELEASED"
PREPARED = "PREPARED"
DISPATCHED = "DISPATCHED"
RESULT_UNKNOWN = "RESULT_UNKNOWN"
CONFIRMED_APPLIED = "CONFIRMED_APPLIED"
CONFIRMED_NOT_APPLIED = "CONFIRMED_NOT_APPLIED"
RECONCILIATION_REQUIRED = "RECONCILIATION_REQUIRED"
IDENTIFIERS_RESERVED = "IDENTIFIERS_RESERVED"
DURABLE_STORED_NOT_ADOPTED = "DURABLE_STORED_NOT_ADOPTED"
ADOPTED_CHILD_NOT_CLOSED = "ADOPTED_CHILD_NOT_CLOSED"
CHILD_CLOSED_PARENT_NOT_ADVANCED = "CHILD_CLOSED_PARENT_NOT_ADVANCED"
COMPLETE = "COMPLETE"
IDEMPOTENT_RETRY_SAFE = "IDEMPOTENT_RETRY_SAFE"
RESULT_CONFIRMATION_REQUIRED = "RESULT_CONFIRMATION_REQUIRED"

class SafetyError(RuntimeError): pass
class StaleLeaseEpoch(SafetyError): pass
class StaleGatewayInstance(SafetyError): pass
class TakeoverBlocked(SafetyError): pass
class IdentityMismatch(SafetyError): pass
class ReadbackRequired(SafetyError): pass
class ConcurrentPublication(SafetyError): pass

def _sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

def _canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def evidence_set_hash(files: Dict[str, str]) -> str:
    index = [{"path": path, "sha256": _sha256_text(content)} for path, content in sorted(files.items())]
    return _sha256_text(_canonical_json(index))

class JsonSafetyStore:
    def __init__(self, path: Path):
        self.path = Path(path)
        self.lock_path = self.path.with_suffix(self.path.suffix + ".lock")
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self._write({"lanes": {}, "operations": {}, "targets": {}, "evidence": {}, "publication": {"head": 0, "sets": {}}})

    def _read(self) -> Dict[str, Any]:
        return json.loads(self.path.read_text(encoding="utf-8"))

    def _write(self, state: Dict[str, Any]) -> None:
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
        os.replace(tmp, self.path)

    @contextlib.contextmanager
    def transaction(self):
        self.lock_path.touch(exist_ok=True)
        with self.lock_path.open("r+") as lock:
            fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
            state = self._read()
            try:
                yield state
                self._write(state)
            finally:
                fcntl.flock(lock.fileno(), fcntl.LOCK_UN)

class SafetyFoundation:
    def __init__(self, store: JsonSafetyStore):
        self.store = store

    def create_lane(self, lane_id: str, owner_run_id: str, *, lease_epoch: int = 1, gateway_instance_id: str = "gateway-1", head_sha: str = "head-0") -> None:
        with self.store.transaction() as s:
            if lane_id in s["lanes"]:
                return
            s["lanes"][lane_id] = {
                "LANE_ID": lane_id,
                "OWNER_RUN_ID": owner_run_id,
                "LEASE_EPOCH": lease_epoch,
                "LEASE_STATUS": ACTIVE,
                "LEASE_UNTIL": "TEST-FUTURE",
                "CURRENT_HEAD_SHA": head_sha,
                "GATEWAY_GENERATION": 1,
                "GATEWAY_INSTANCE_ID": gateway_instance_id,
            }

    def lane(self, lane_id: str) -> Dict[str, Any]:
        with self.store.transaction() as s:
            return dict(s["lanes"][lane_id])

    def _validate(self, state: Dict[str, Any], lane_id: str, owner_run_id: str, lease_epoch: int, gateway_generation: int) -> Dict[str, Any]:
        lane = state["lanes"][lane_id]
        if lane["LEASE_STATUS"] != ACTIVE or lane["OWNER_RUN_ID"] != owner_run_id:
            raise StaleLeaseEpoch("owner/status no longer active")
        if lane["LEASE_EPOCH"] != lease_epoch:
            raise StaleLeaseEpoch(f"STALE_LEASE_EPOCH owned={lease_epoch} current={lane['LEASE_EPOCH']}")
        if lane["GATEWAY_GENERATION"] != gateway_generation:
            raise StaleGatewayInstance(f"stale gateway generation={gateway_generation} current={lane['GATEWAY_GENERATION']}")
        return lane

    def restart_gateway(self, lane_id: str, new_instance_id: str) -> int:
        with self.store.transaction() as s:
            lane = s["lanes"][lane_id]
            lane["GATEWAY_GENERATION"] += 1
            lane["GATEWAY_INSTANCE_ID"] = new_instance_id
            return lane["GATEWAY_GENERATION"]

    def prepare_operation(self, *, operation_id: str, lane_id: str, owner_run_id: str, lease_epoch: int, gateway_generation: int, target: str, mutation_type: str, expected_precondition: str, expected_postcondition: str, retry_class: str) -> None:
        with self.store.transaction() as s:
            self._validate(s, lane_id, owner_run_id, lease_epoch, gateway_generation)
            fingerprint = _sha256_text(_canonical_json([lane_id, owner_run_id, lease_epoch, target, mutation_type, expected_precondition, expected_postcondition, retry_class]))
            existing = s["operations"].get(operation_id)
            if existing:
                if existing["REQUEST_FINGERPRINT"] != fingerprint:
                    raise SafetyError("operation id reused with different request")
                return
            s["operations"][operation_id] = {
                "OPERATION_ID": operation_id,
                "LANE_ID": lane_id,
                "OWNER_RUN_ID": owner_run_id,
                "LEASE_EPOCH": lease_epoch,
                "TARGET_RESOURCE": target,
                "MUTATION_TYPE": mutation_type,
                "EXPECTED_PRECONDITION": expected_precondition,
                "EXPECTED_POSTCONDITION": expected_postcondition,
                "REQUEST_FINGERPRINT": fingerprint,
                "RETRY_CLASS": retry_class,
                "OPERATION_STATE": PREPARED,
                "PENDING_EXTERNAL_DELIVERY": False,
            }
            s["targets"].setdefault(target, expected_precondition)

    def dispatch_operation(self, operation_id: str, *, owner_run_id: str, lease_epoch: int, gateway_generation: int, outcome: str) -> None:
        with self.store.transaction() as s:
            op = s["operations"][operation_id]
            self._validate(s, op["LANE_ID"], owner_run_id, lease_epoch, gateway_generation)
            if op["OPERATION_STATE"] in (CONFIRMED_APPLIED, CONFIRMED_NOT_APPLIED):
                return
            op["OPERATION_STATE"] = DISPATCHED
            target = op["TARGET_RESOURCE"]
            if outcome in ("applied", "applied_response_lost"):
                s["targets"][target] = op["EXPECTED_POSTCONDITION"]
                op["PENDING_EXTERNAL_DELIVERY"] = False
            elif outcome == "not_applied":
                s["targets"][target] = op["EXPECTED_PRECONDITION"]
                op["PENDING_EXTERNAL_DELIVERY"] = False
            elif outcome == "not_applied_response_lost":
                s["targets"][target] = op["EXPECTED_PRECONDITION"]
                op["PENDING_EXTERNAL_DELIVERY"] = True
            else:
                raise ValueError(outcome)
            if outcome == "applied":
                op["OPERATION_STATE"] = CONFIRMED_APPLIED
            elif outcome == "not_applied":
                op["OPERATION_STATE"] = CONFIRMED_NOT_APPLIED
            else:
                op["OPERATION_STATE"] = RESULT_UNKNOWN

    def reconcile_operation(self, operation_id: str) -> str:
        with self.store.transaction() as s:
            op = s["operations"][operation_id]
            current = s["targets"][op["TARGET_RESOURCE"]]
            if current == op["EXPECTED_POSTCONDITION"]:
                op["OPERATION_STATE"] = CONFIRMED_APPLIED
            elif current == op["EXPECTED_PRECONDITION"] and not op["PENDING_EXTERNAL_DELIVERY"]:
                op["OPERATION_STATE"] = CONFIRMED_NOT_APPLIED
            else:
                op["OPERATION_STATE"] = RESULT_UNKNOWN
            return op["OPERATION_STATE"]

    def confirm_request_will_not_apply(self, operation_id: str) -> None:
        with self.store.transaction() as s:
            op = s["operations"][operation_id]
            if s["targets"][op["TARGET_RESOURCE"]] != op["EXPECTED_PRECONDITION"]:
                raise SafetyError("target no longer at expected precondition")
            op["PENDING_EXTERNAL_DELIVERY"] = False
            op["OPERATION_STATE"] = CONFIRMED_NOT_APPLIED

    def operation_state(self, operation_id: str) -> str:
        with self.store.transaction() as s:
            return s["operations"][operation_id]["OPERATION_STATE"]

    def takeover(self, lane_id: str, new_owner_run_id: str) -> int:
        with self.store.transaction() as s:
            unresolved = [op for op in s["operations"].values() if op["LANE_ID"] == lane_id and op["OPERATION_STATE"] in (DISPATCHED, RESULT_UNKNOWN, RECONCILIATION_REQUIRED)]
            if unresolved:
                raise TakeoverBlocked("unresolved operation blocks lease takeover: " + ",".join(op["OPERATION_ID"] for op in unresolved))
            lane = s["lanes"][lane_id]
            lane["LEASE_EPOCH"] += 1
            lane["OWNER_RUN_ID"] = new_owner_run_id
            lane["LEASE_STATUS"] = ACTIVE
            lane["GATEWAY_GENERATION"] += 1
            lane["GATEWAY_INSTANCE_ID"] = f"takeover-{new_owner_run_id}"
            return lane["LEASE_EPOCH"]

    def reserve_evidence(self, *, lane_id: str, child_issue: int, evidence_id: str, adoption_id: str, identity: Dict[str, str], owner_run_id: str, lease_epoch: int, gateway_generation: int) -> None:
        with self.store.transaction() as s:
            self._validate(s, lane_id, owner_run_id, lease_epoch, gateway_generation)
            existing = s["evidence"].get(adoption_id)
            if existing:
                if existing["EVIDENCE_ID"] != evidence_id or existing["IDENTITY"] != identity or existing["LANE_ID"] != lane_id or existing["CHILD_ISSUE"] != child_issue:
                    raise SafetyError("adoption id reused with different evidence identity")
                return
            if any(e["EVIDENCE_ID"] == evidence_id and aid != adoption_id for aid, e in s["evidence"].items()):
                raise SafetyError("evidence id already bound to another adoption id")
            s["evidence"][adoption_id] = {
                "EVIDENCE_ID": evidence_id,
                "ADOPTION_ID": adoption_id,
                "LANE_ID": lane_id,
                "CHILD_ISSUE": child_issue,
                "IDENTITY": dict(identity),
                "STATE": IDENTIFIERS_RESERVED,
                "DURABLE_URI": None,
                "DURABLE_SET_SHA256": None,
                "READBACK_VERIFIED": False,
            }

    def evidence_record(self, adoption_id: str) -> Dict[str, Any]:
        with self.store.transaction() as s:
            return dict(s["evidence"][adoption_id])

    def store_evidence(self, adoption_id: str, files: Dict[str, str], *, expected_publication_head: int | None = None) -> int:
        with self.store.transaction() as s:
            e = s["evidence"][adoption_id]
            path = f"evidence/{e['LANE_ID']}/issue-{e['CHILD_ISSUE']}/{e['EVIDENCE_ID']}/"
            pub = s["publication"]
            if path in pub["sets"]:
                old = pub["sets"][path]
                if old["files"] != files:
                    raise SafetyError("append-only evidence path collision")
                e["STATE"] = DURABLE_STORED_NOT_ADOPTED
                e["DURABLE_URI"] = path
                e["DURABLE_SET_SHA256"] = old["set_hash"]
                return pub["head"]
            if expected_publication_head is not None and pub["head"] != expected_publication_head:
                raise ConcurrentPublication(f"expected publication head {expected_publication_head}, current {pub['head']}")
            set_hash = evidence_set_hash(files)
            pub["sets"][path] = {"files": dict(files), "set_hash": set_hash, "adoption_id": adoption_id}
            pub["head"] += 1
            e["STATE"] = DURABLE_STORED_NOT_ADOPTED
            e["DURABLE_URI"] = path
            e["DURABLE_SET_SHA256"] = set_hash
            return pub["head"]

    def publication_head(self) -> int:
        with self.store.transaction() as s:
            return int(s["publication"]["head"])

    def publication_paths(self) -> list[str]:
        with self.store.transaction() as s:
            return sorted(s["publication"]["sets"].keys())

    def verify_evidence_readback(self, adoption_id: str) -> None:
        with self.store.transaction() as s:
            e = s["evidence"][adoption_id]
            if not e["DURABLE_URI"]:
                raise ReadbackRequired("evidence not stored")
            stored = s["publication"]["sets"][e["DURABLE_URI"]]
            actual_hash = evidence_set_hash(stored["files"])
            if actual_hash != e["DURABLE_SET_SHA256"]:
                raise SafetyError("durable evidence read-back hash mismatch")
            e["READBACK_VERIFIED"] = True

    def adopt_evidence(self, adoption_id: str, *, current_identity: Dict[str, str], owner_run_id: str, lease_epoch: int, gateway_generation: int) -> None:
        with self.store.transaction() as s:
            e = s["evidence"][adoption_id]
            self._validate(s, e["LANE_ID"], owner_run_id, lease_epoch, gateway_generation)
            if not e["READBACK_VERIFIED"]:
                raise ReadbackRequired("durable evidence must be fresh-read and verified")
            if e["IDENTITY"] != current_identity:
                raise IdentityMismatch("evidence identity does not match current acceptance identity")
            if e["STATE"] in (ADOPTED_CHILD_NOT_CLOSED, CHILD_CLOSED_PARENT_NOT_ADVANCED, COMPLETE):
                return
            e["STATE"] = ADOPTED_CHILD_NOT_CLOSED

    def close_child(self, adoption_id: str) -> None:
        with self.store.transaction() as s:
            e = s["evidence"][adoption_id]
            if e["STATE"] in (CHILD_CLOSED_PARENT_NOT_ADVANCED, COMPLETE):
                return
            if e["STATE"] != ADOPTED_CHILD_NOT_CLOSED:
                raise SafetyError("child cannot close before evidence adoption")
            e["STATE"] = CHILD_CLOSED_PARENT_NOT_ADVANCED

    def advance_parent(self, adoption_id: str) -> None:
        with self.store.transaction() as s:
            e = s["evidence"][adoption_id]
            if e["STATE"] == COMPLETE:
                return
            if e["STATE"] != CHILD_CLOSED_PARENT_NOT_ADVANCED:
                raise SafetyError("parent cannot advance before child close")
            e["STATE"] = COMPLETE

    def historical_evidence_valid(self, adoption_id: str) -> bool:
        with self.store.transaction() as s:
            return s["evidence"][adoption_id]["STATE"] in (ADOPTED_CHILD_NOT_CLOSED, CHILD_CLOSED_PARENT_NOT_ADVANCED, COMPLETE)
