from __future__ import annotations

import base64
import hashlib
import io
import json
import os
import pathlib
import sys
import time
import traceback
import zipfile

ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/"tools"/"env_visual_gateway"))
import fenced_gateway as gw

TEST_CONTROL="test/env-visual-gateway-v1-control"
TEST_IMPLEMENTATION="test/env-visual-gateway-v1-implementation"
TEST_EVIDENCE="test/env-visual-gateway-v1-evidence"
TEST_PARENT=98
TEST_CHILD=99
PROGRESS_COMMENT=5745746112

TARGET={
    "target_source_commit_sha":"0d225f77944eb54eed648b76f00869879f4284ff",
    "target_blob_sha":"198d0f5f3da115b70218ae8180d5f8363d744959",
}

gw.ALLOWED_LANES={
    "dungeon":{
        "parent":TEST_PARENT,
        "children":{TEST_CHILD},
        "implementation_branch":TEST_IMPLEMENTATION,
        "control_branch":TEST_CONTROL,
        "target_source_commit_sha":TARGET["target_source_commit_sha"],
        "target_path":"references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png",
        "target_blob_sha":TARGET["target_blob_sha"],
    }
}
gw.EVIDENCE_BRANCH=TEST_EVIDENCE


def sha(data:bytes)->str:
    return hashlib.sha256(data).hexdigest()


def make_req(run_id, owner, epoch, op_id, op_type, *, expected_head=None, payload=None):
    req={
        "schema":"LUKE_QUEST_ENV_GATEWAY_REQUEST:v1",
        "request_id":f"REQ-{run_id}-{op_id}",
        "lane_id":"dungeon",
        "owner_run_id":owner,
        "lease_epoch":epoch,
        "operation_id":f"{run_id}-{op_id}",
        "operation_type":op_type,
        "expected_lane_head":expected_head,
        "expected_target_identity":TARGET,
        "payload":payload or {},
        "created_at":str(time.time()),
        "request_sha256":"",
    }
    req["request_sha256"]=gw.sha256_text(gw.canonical(req))
    return req


def main():
    token=os.environ["GITHUB_TOKEN"]
    repo=os.environ["GITHUB_REPOSITORY"]
    run_id=os.environ["GITHUB_RUN_ID"]
    report_path=pathlib.Path(os.environ["REPORT_PATH"])
    gh=gw.GitHub(repo,token)
    gate=gw.Gateway(gh,production_enabled=True)
    results=[]

    owner_a=f"gateway-v1-e2e-A-{run_id}"
    owner_b=f"gateway-v1-e2e-B-{run_id}"

    acquire=gate.apply(make_req(run_id,owner_a,0,"acquire","LEASE_ACQUIRE",payload={"ttl_seconds":1800}))
    epoch=int(acquire["lease"]["LEASE_EPOCH"])
    results.append({"step":"LEASE_ACQUIRE","status":"PASS","epoch":epoch})

    comment=gate.apply(make_req(
        run_id,owner_a,epoch,"comment","ISSUE_COMMENT",
        payload={"issue_number":TEST_CHILD,"body":"Production Gateway v1 isolated E2E comment mutation."}
    ))
    results.append({"step":"ISSUE_COMMENT","status":"PASS","comment_id":comment.get("COMMENT_ID")})

    head0=gh.ref(TEST_IMPLEMENTATION)
    update=gate.apply(make_req(
        run_id,owner_a,epoch,"file","IMPLEMENTATION_FILE_UPDATE",
        expected_head=head0,
        payload={"path":"gateway-v1-test-runtime.txt","encoding":"utf-8","content":f"gateway-v1-e2e:{run_id}\n"}
    ))
    head1=update["APPLIED_HEAD"]
    results.append({"step":"IMPLEMENTATION_FILE_UPDATE","status":"PASS","head":head1})

    heartbeat=gate.apply(make_req(run_id,owner_a,epoch,"heartbeat","LEASE_HEARTBEAT",payload={"ttl_seconds":1800}))
    results.append({"step":"LEASE_HEARTBEAT","status":"PASS","epoch":heartbeat["lease"]["LEASE_EPOCH"]})

    evidence_id=f"EV-{run_id}"
    adoption_id=f"AD-{run_id}"
    reserve=gate.apply(make_req(
        run_id,owner_a,epoch,"reserve","EVIDENCE_IDENTIFIERS_RESERVE",
        expected_head=head1,
        payload={
            "child_issue":TEST_CHILD,
            "evidence_id":evidence_id,
            "adoption_id":adoption_id,
            "evaluation_contract_sha256":"isolated-test-contract-v1",
        }
    ))
    results.append({"step":"EVIDENCE_IDENTIFIERS_RESERVE","status":"PASS","evidence_id":evidence_id,"adoption_id":adoption_id})

    target_bytes=b"isolated-target-image-bytes"
    actual_bytes=b"isolated-actual-image-bytes"
    target_sha=sha(target_bytes)
    actual_sha=sha(actual_bytes)
    settings_bytes=(
        json.dumps(
            {"viewport":{"width":941,"height":1672,"dpr":1},"test_only":True},
            sort_keys=True,
        )+"\n"
    ).encode()
    contract_bytes=b"TEST ONLY contract snapshot\n"
    runtime_audit_bytes=(json.dumps({"test_only":True},sort_keys=True)+"\n").encode()
    manifest={
        "schema":"LUKE_QUEST_ENV_EVIDENCE_CANDIDATE:v2",
        "lane_id":"dungeon",
        "parent_issue":TEST_PARENT,
        "child_issue":TEST_CHILD,
        "actual_head_sha":head1,
        "runtime_build_sha":head1,
        "target_source_commit_sha":TARGET["target_source_commit_sha"],
        "target_blob_sha":TARGET["target_blob_sha"],
        "target_dimensions":[941,1672],
        "actual_dimensions":[941,1672],
        "target_image_sha256":target_sha,
        "actual_image_sha256":actual_sha,
        "evidence_settings_sha256":sha(settings_bytes),
        "evaluation_contract_snapshot_sha256":sha(contract_bytes),
        "runtime_audit_sha256":sha(runtime_audit_bytes),
        "visual_comparison_performed":False,
    }
    coordinate={"status":"PASS","objects":1,"test_only":True}
    visual={
        "status":"PASS",
        "visual_comparison_performed":True,
        "target_image_sha256":target_sha,
        "actual_image_sha256":actual_sha,
        "test_only":True,
    }

    artifact_members={
        "target.png":target_bytes,
        "actual.png":actual_bytes,
        "coordinate-audit.json":json.dumps(
            {"status":"PENDING_SAME_ROI_VISUAL_AUDIT","test_only":True},
            sort_keys=True,
        ).encode(),
        "evidence-manifest.candidate.json":(
            json.dumps(manifest,sort_keys=True)+"\n"
        ).encode(),
        "evidence-settings.json":settings_bytes,
        "evaluation-contract-snapshot.md":contract_bytes,
        "runtime-audit.json":runtime_audit_bytes,
        "implementation-head.txt":(head1+"\n").encode(),
        "target-source-commit.txt":(
            TARGET["target_source_commit_sha"]+"\n"
        ).encode(),
    }
    artifact_buffer=io.BytesIO()
    with zipfile.ZipFile(
        artifact_buffer,"w",compression=zipfile.ZIP_DEFLATED
    ) as zf:
        for name,content in sorted(artifact_members.items()):
            zf.writestr(name,content)
    artifact_bytes=artifact_buffer.getvalue()
    capture_request_id=f"fixture-{run_id}"
    artifact_id=int(run_id)
    fixture_metadata={
        "id":artifact_id,
        "name":"lq-env-evidence-"+capture_request_id,
        "expired":False,
        "digest":"sha256:"+sha(artifact_bytes),
        "created_at":"2026-09-20T00:00:00Z",
        "updated_at":"2026-09-20T00:00:00Z",
        "workflow_run":{"id":artifact_id,"head_sha":"test-only"},
    }

    original_metadata=gh.artifact_metadata
    original_zip=gh.artifact_zip
    gh.artifact_metadata=lambda requested: (
        fixture_metadata if int(requested)==artifact_id
        else original_metadata(requested)
    )
    gh.artifact_zip=lambda requested: (
        artifact_bytes if int(requested)==artifact_id
        else original_zip(requested)
    )
    evidence_head=gh.ref(TEST_EVIDENCE)
    try:
        publish=gate.apply(make_req(
            run_id,owner_a,epoch,"publish",
            "DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT",
            expected_head=head1,
            payload={
                "child_issue":TEST_CHILD,
                "evidence_id":evidence_id,
                "adoption_id":adoption_id,
                "expected_evidence_head":evidence_head,
                "capture_request_id":capture_request_id,
                "artifact_id":artifact_id,
                "visual_audit":visual,
                "coordinate_audit":coordinate,
            }
        ))
    finally:
        gh.artifact_metadata=original_metadata
        gh.artifact_zip=original_zip

    set_hash=publish["DURABLE_EVIDENCE_SET_SHA256"]
    results.append({
        "step":"DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT",
        "status":"PASS",
        "set_hash":set_hash,
        "artifact_digest":fixture_metadata["digest"],
    })

    adopt=gate.apply(make_req(
        run_id,owner_a,epoch,"adopt","EVIDENCE_ADOPT",
        expected_head=head1,
        payload={
            "child_issue":TEST_CHILD,
            "evidence_id":evidence_id,
            "adoption_id":adoption_id,
            "durable_evidence_set_sha256":set_hash,
        }
    ))
    results.append({"step":"EVIDENCE_ADOPT","status":"PASS","operation_state":adopt["OPERATION_STATE"]})

    close=gate.apply(make_req(
        run_id,owner_a,epoch,"close","ISSUE_CLOSE",
        payload={"issue_number":TEST_CHILD,"adoption_id":adoption_id}
    ))
    results.append({"step":"ISSUE_CLOSE","status":"PASS","issue_state":close["ISSUE_STATE"]})

    progress_body=f"""ENV_GATEWAY_V1_FULL_ADOPTION_TEST:v1

- RUN_ID: {run_id}
- TEST_CHILD_ISSUE: #{TEST_CHILD}
- EVIDENCE_ID: {evidence_id}
- ADOPTION_ID: {adoption_id}
- DURABLE_EVIDENCE_SET_SHA256: {set_hash}
- STATE: COMPLETE
- PRODUCTION_ENVIRONMENT_MUTATION: NONE
"""
    parent=gate.apply(make_req(
        run_id,owner_a,epoch,"parent","PARENT_PROGRESS_UPDATE",
        payload={
            "issue_number":TEST_PARENT,
            "comment_id":PROGRESS_COMMENT,
            "body":progress_body,
            "adoption_id":adoption_id,
        }
    ))
    results.append({"step":"PARENT_PROGRESS_UPDATE","status":"PASS","comment_id":parent["COMMENT_ID"]})

    final_adoption=gate.adoption_record("dungeon",adoption_id)
    assert final_adoption["STATE"]=="COMPLETE"
    results.append({"step":"ADOPTION_COMPLETE","status":"PASS","state":final_adoption["STATE"]})

    release=gate.apply(make_req(run_id,owner_a,epoch,"release","LEASE_RELEASE"))
    results.append({"step":"LEASE_RELEASE","status":"PASS","state":release["lease"]["LEASE_STATUS"]})

    acquire_b=gate.apply(make_req(run_id,owner_b,0,"acquire-b","LEASE_ACQUIRE",payload={"ttl_seconds":1800}))
    epoch_b=int(acquire_b["lease"]["LEASE_EPOCH"])
    stale_rejected=False
    stale_error=""
    try:
        gate.apply(make_req(
            run_id,owner_a,epoch,"stale","ISSUE_COMMENT",
            payload={"issue_number":TEST_PARENT,"body":"THIS STALE WRITE MUST NOT APPEAR"}
        ))
    except gw.StaleEpoch as exc:
        stale_rejected=True
        stale_error=str(exc)
    assert stale_rejected
    results.append({"step":"STALE_EPOCH_REJECTION","status":"PASS","old_epoch":epoch,"current_epoch":epoch_b,"error":stale_error})

    release_b=gate.apply(make_req(run_id,owner_b,epoch_b,"release-b","LEASE_RELEASE"))
    results.append({"step":"FINAL_RELEASE","status":"PASS","state":release_b["lease"]["LEASE_STATUS"]})

    report={
        "schema":"LUKE_QUEST_ENV_GATEWAY_V1_FULL_E2E_REPORT:v1",
        "overall":"PASS",
        "run_id":run_id,
        "test_only":True,
        "resources":{
            "parent_issue":TEST_PARENT,
            "child_issue":TEST_CHILD,
            "control_branch":TEST_CONTROL,
            "implementation_branch":TEST_IMPLEMENTATION,
            "evidence_branch":TEST_EVIDENCE,
        },
        "steps":results,
    }
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))


if __name__=="__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        raise

# E2E_TRIGGER_VERSION: 1
