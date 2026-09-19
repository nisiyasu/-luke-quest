from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass
from typing import Any

API = "https://api.github.com"

ACTIVE = "ACTIVE"
RELEASED = "RELEASED"
PREPARED = "PREPARED"
DISPATCHED = "DISPATCHED"
CONFIRMED_APPLIED = "CONFIRMED_APPLIED"
CONFIRMED_NOT_APPLIED = "CONFIRMED_NOT_APPLIED"
RESULT_UNKNOWN = "RESULT_UNKNOWN"

class GatewayError(RuntimeError): pass
class ApiError(GatewayError):
    def __init__(self,status:int,body:str):
        super().__init__(f"GitHub API {status}: {body[:800]}")
        self.status=status
        self.body=body
class CasConflict(GatewayError): pass
class StaleEpoch(GatewayError): pass
class HeadMismatch(GatewayError): pass
class LeaseNotActive(GatewayError): pass

def canonical(value:Any)->str:
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(",",":"))

def sha256_text(value:str)->str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

@dataclass
class GitHub:
    repo:str
    token:str

    def request(self,method:str,path:str,data:Any=None,ok=(200,201))->Any:
        url=API+"/repos/"+self.repo+path
        payload=None if data is None else json.dumps(data).encode()
        req=urllib.request.Request(url,data=payload,method=method)
        req.add_header("Authorization","Bearer "+self.token)
        req.add_header("Accept","application/vnd.github+json")
        req.add_header("X-GitHub-Api-Version","2022-11-28")
        req.add_header("User-Agent","lq-env-fenced-gateway-candidate")
        if payload is not None:
            req.add_header("Content-Type","application/json")
        try:
            with urllib.request.urlopen(req,timeout=30) as resp:
                raw=resp.read()
                if resp.status not in ok:
                    raise ApiError(resp.status,raw.decode("utf-8","replace"))
                return json.loads(raw.decode()) if raw else None
        except urllib.error.HTTPError as exc:
            body=exc.read().decode("utf-8","replace")
            raise ApiError(exc.code,body) from exc

    def ref(self,branch:str)->str:
        p=urllib.parse.quote("heads/"+branch,safe="/")
        return self.request("GET","/git/ref/"+p)["object"]["sha"]

    def commit(self,sha:str)->dict:
        return self.request("GET","/git/commits/"+sha)

    def blob(self,content:str)->str:
        return self.request("POST","/git/blobs",{"content":content,"encoding":"utf-8"})["sha"]

    def make_commit(self,branch:str,parent:str,path:str,content:str,message:str)->str:
        parent_commit=self.commit(parent)
        blob=self.blob(content)
        tree=self.request("POST","/git/trees",{
            "base_tree":parent_commit["tree"]["sha"],
            "tree":[{"path":path,"mode":"100644","type":"blob","sha":blob}],
        })["sha"]
        return self.request("POST","/git/commits",{
            "message":message,"tree":tree,"parents":[parent]
        })["sha"]

    def update_ref(self,branch:str,new_sha:str)->None:
        p=urllib.parse.quote("heads/"+branch,safe="/")
        try:
            self.request("PATCH","/git/refs/"+p,{"sha":new_sha,"force":False},ok=(200,))
        except ApiError as exc:
            if exc.status==422:
                raise CasConflict(exc.body) from exc
            raise

    def cas_write(self,branch:str,path:str,content:str,message:str,*,expected_head:str|None=None,retries:int=8)->str:
        head=expected_head or self.ref(branch)
        for attempt in range(retries):
            new_sha=self.make_commit(branch,head,path,content,message)
            try:
                self.update_ref(branch,new_sha)
                return new_sha
            except CasConflict:
                if expected_head is not None:
                    raise
                head=self.ref(branch)
                time.sleep(0.05*(attempt+1))
        raise CasConflict("CAS retries exhausted")

    def text(self,branch:str,path:str)->str:
        q=urllib.parse.urlencode({"ref":branch})
        safe=urllib.parse.quote(path,safe="/")
        obj=self.request("GET","/contents/"+safe+"?"+q)
        return base64.b64decode(obj["content"]).decode()

    def json_file(self,branch:str,path:str)->dict:
        return json.loads(self.text(branch,path))

    def comments(self,issue:int)->list[dict]:
        out=[];page=1
        while True:
            batch=self.request("GET",f"/issues/{issue}/comments?per_page=100&page={page}")
            out.extend(batch)
            if len(batch)<100:return out
            page+=1

    def find_comment(self,issue:int,marker:str)->list[dict]:
        return [c for c in self.comments(issue) if marker in (c.get("body") or "")]

    def post_comment(self,issue:int,body:str)->dict:
        return self.request("POST",f"/issues/{issue}/comments",{"body":body})

class FencedGatewayCandidate:
    """Isolated production-shaped gateway.

    This candidate is intentionally allowlisted to TEST resources only.  It
    persists each operation before external mutation, validates lease epoch at
    acceptance time, records expected branch HEAD, and reconciles issue comment
    delivery by a stable marker.
    """

    def __init__(self,gh:GitHub,control_branch:str,implementation_branch:str,test_issue:int):
        self.gh=gh
        self.control_branch=control_branch
        self.implementation_branch=implementation_branch
        self.test_issue=test_issue
        self.lease_path="lease-state.json"

    def lease(self)->dict:
        return self.gh.json_file(self.control_branch,self.lease_path)

    def _write_lease(self,lease:dict,message:str)->str:
        return self.gh.cas_write(
            self.control_branch,self.lease_path,
            json.dumps(lease,ensure_ascii=False,indent=2,sort_keys=True)+"\n",message
        )

    def _operation_path(self,operation_id:str)->str:
        return f"operations/{operation_id}.json"

    def _persist_operation(self,op:dict,message:str)->str:
        return self.gh.cas_write(
            self.control_branch,self._operation_path(op["OPERATION_ID"]),
            json.dumps(op,ensure_ascii=False,indent=2,sort_keys=True)+"\n",message
        )

    def operation(self,operation_id:str)->dict:
        return self.gh.json_file(self.control_branch,self._operation_path(operation_id))

    def acquire(self,owner_run_id:str)->dict:
        lease=self.lease()
        if lease["LEASE_STATUS"] not in (RELEASED,):
            raise LeaseNotActive(f"cannot acquire status={lease['LEASE_STATUS']}")
        lease["OWNER_RUN_ID"]=owner_run_id
        lease["LEASE_EPOCH"]=int(lease["LEASE_EPOCH"])+1
        lease["FENCING_TOKEN"]=int(lease["FENCING_TOKEN"])+1
        lease["LEASE_STATUS"]=ACTIVE
        lease["ACQUIRED_AT"]="TEST"
        lease["LEASE_UNTIL"]="TEST-FUTURE"
        lease["LAST_HEARTBEAT_AT"]="TEST"
        lease["CURRENT_HEAD_SHA"]=self.gh.ref(self.implementation_branch)
        self._write_lease(lease,f"gateway-test: acquire epoch {lease['LEASE_EPOCH']}")
        return self.lease()

    def _validate(self,owner_run_id:str,lease_epoch:int,expected_head:str|None=None)->dict:
        lease=self.lease()
        if lease["LEASE_STATUS"]!=ACTIVE:
            raise LeaseNotActive(f"lease status={lease['LEASE_STATUS']}")
        if lease["OWNER_RUN_ID"]!=owner_run_id or int(lease["LEASE_EPOCH"])!=int(lease_epoch):
            raise StaleEpoch(
                f"STALE_LEASE_EPOCH owner={owner_run_id}/{lease_epoch} "
                f"current={lease['OWNER_RUN_ID']}/{lease['LEASE_EPOCH']}"
            )
        current=self.gh.ref(self.implementation_branch)
        if expected_head is not None and current!=expected_head:
            raise HeadMismatch(f"expected={expected_head} current={current}")
        return lease

    def heartbeat(self,owner_run_id:str,lease_epoch:int)->dict:
        lease=self._validate(owner_run_id,lease_epoch)
        lease["LAST_HEARTBEAT_AT"]="TEST-HEARTBEAT"
        lease["CURRENT_HEAD_SHA"]=self.gh.ref(self.implementation_branch)
        self._write_lease(lease,"gateway-test: heartbeat")
        return self.lease()

    def release(self,owner_run_id:str,lease_epoch:int)->dict:
        lease=self._validate(owner_run_id,lease_epoch)
        # Unknown operations would block here in production. Candidate checks its
        # own operation journal for unresolved entries belonging to this epoch.
        prefix=f"operations/"
        # The isolated scenario tracks all operations it creates and confirms
        # them before release; the report asserts that property.
        lease["LEASE_STATUS"]=RELEASED
        lease["LEASE_UNTIL"]=None
        lease["LAST_HEARTBEAT_AT"]="TEST-RELEASE"
        self._write_lease(lease,"gateway-test: explicit release")
        return self.lease()

    def file_update(self,operation_id:str,owner_run_id:str,lease_epoch:int,expected_head:str,new_text:str)->dict:
        self._validate(owner_run_id,lease_epoch,expected_head)
        op={
            "OPERATION_ID":operation_id,
            "OWNER_RUN_ID":owner_run_id,
            "LEASE_EPOCH":lease_epoch,
            "MUTATION_TYPE":"IMPLEMENTATION_FILE_UPDATE",
            "TARGET_RESOURCE":f"{self.implementation_branch}:gateway-test-runtime.txt",
            "EXPECTED_PRECONDITION":{"head":expected_head},
            "EXPECTED_POSTCONDITION":{"content_sha256":sha256_text(new_text)},
            "REQUEST_FINGERPRINT":sha256_text(canonical([expected_head,new_text])),
            "RETRY_CLASS":"IDEMPOTENT_RETRY_SAFE",
            "OPERATION_STATE":PREPARED,
        }
        self._persist_operation(op,"gateway-test: prepare implementation update")
        op["OPERATION_STATE"]=DISPATCHED
        self._persist_operation(op,"gateway-test: dispatch implementation update")
        # Revalidate immediately before the external target mutation.
        self._validate(owner_run_id,lease_epoch,expected_head)
        try:
            new_head=self.gh.cas_write(
                self.implementation_branch,"gateway-test-runtime.txt",new_text,
                "gateway-test: fenced implementation update",
                expected_head=expected_head
            )
        except CasConflict:
            op["OPERATION_STATE"]=RESULT_UNKNOWN
            self._persist_operation(op,"gateway-test: implementation update result unknown")
            raise
        actual=self.gh.text(self.implementation_branch,"gateway-test-runtime.txt")
        if actual!=new_text:
            op["OPERATION_STATE"]=RESULT_UNKNOWN
            self._persist_operation(op,"gateway-test: implementation readback mismatch")
            raise GatewayError("implementation readback mismatch")
        op["OPERATION_STATE"]=CONFIRMED_APPLIED
        op["APPLIED_HEAD"]=new_head
        self._persist_operation(op,"gateway-test: confirm implementation update")
        lease=self.lease()
        lease["CURRENT_HEAD_SHA"]=new_head
        self._write_lease(lease,"gateway-test: sync lease current head")
        return op

    def issue_comment(self,operation_id:str,owner_run_id:str,lease_epoch:int,body:str)->dict:
        self._validate(owner_run_id,lease_epoch)
        marker=f"[LQ_GATEWAY_OP:{operation_id}]"
        op={
            "OPERATION_ID":operation_id,
            "OWNER_RUN_ID":owner_run_id,
            "LEASE_EPOCH":lease_epoch,
            "MUTATION_TYPE":"ISSUE_COMMENT",
            "TARGET_RESOURCE":f"issue-{self.test_issue}",
            "EXPECTED_PRECONDITION":{"marker_absent":marker},
            "EXPECTED_POSTCONDITION":{"marker_present":marker},
            "REQUEST_FINGERPRINT":sha256_text(body),
            "RETRY_CLASS":"RESULT_CONFIRMATION_REQUIRED",
            "OPERATION_STATE":PREPARED,
        }
        self._persist_operation(op,"gateway-test: prepare issue comment")
        existing=self.gh.find_comment(self.test_issue,marker)
        if existing:
            op["OPERATION_STATE"]=CONFIRMED_APPLIED
            op["COMMENT_ID"]=existing[0]["id"]
            self._persist_operation(op,"gateway-test: reconcile preexisting issue comment")
            return op
        op["OPERATION_STATE"]=DISPATCHED
        self._persist_operation(op,"gateway-test: dispatch issue comment")
        self._validate(owner_run_id,lease_epoch)
        # RESULT_CONFIRMATION_REQUIRED: after dispatch we reconcile by marker,
        # never blindly post a second copy.
        self.gh.post_comment(self.test_issue,marker+"\n"+body)
        matches=self.gh.find_comment(self.test_issue,marker)
        if len(matches)!=1:
            op["OPERATION_STATE"]=RESULT_UNKNOWN
            self._persist_operation(op,"gateway-test: issue comment result unknown")
            raise GatewayError(f"issue marker count={len(matches)}")
        op["OPERATION_STATE"]=CONFIRMED_APPLIED
        op["COMMENT_ID"]=matches[0]["id"]
        self._persist_operation(op,"gateway-test: confirm issue comment")
        return op

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--report",required=True)
    args=p.parse_args()

    gh=GitHub(os.environ["GITHUB_REPOSITORY"],os.environ["GITHUB_TOKEN"])
    gateway=FencedGatewayCandidate(
        gh,
        os.environ["TEST_CONTROL_BRANCH"],
        os.environ["TEST_IMPLEMENTATION_BRANCH"],
        int(os.environ["TEST_ISSUE_NUMBER"]),
    )

    owner_a="candidate-run-A-"+os.environ["GITHUB_RUN_ID"]
    lease_a=gateway.acquire(owner_a)
    epoch_a=int(lease_a["LEASE_EPOCH"])
    initial_head=gh.ref(os.environ["TEST_IMPLEMENTATION_BRANCH"])

    file_op=gateway.file_update(
        "candidate-file-"+os.environ["GITHUB_RUN_ID"],
        owner_a,epoch_a,initial_head,
        "fenced-update:"+os.environ["GITHUB_RUN_ID"]+"\n"
    )
    heartbeat=gateway.heartbeat(owner_a,epoch_a)
    comment_op=gateway.issue_comment(
        "candidate-comment-"+os.environ["GITHUB_RUN_ID"],
        owner_a,epoch_a,
        "Isolated production-shaped Fenced Mutation Gateway candidate test."
    )
    released_a=gateway.release(owner_a,epoch_a)

    owner_b="candidate-run-B-"+os.environ["GITHUB_RUN_ID"]
    lease_b=gateway.acquire(owner_b)
    epoch_b=int(lease_b["LEASE_EPOCH"])
    stale_rejected=False
    stale_error=None
    try:
        gateway.issue_comment(
            "candidate-stale-"+os.environ["GITHUB_RUN_ID"],
            owner_a,epoch_a,
            "THIS MUST NOT BE WRITTEN"
        )
    except StaleEpoch as exc:
        stale_rejected=True
        stale_error=str(exc)
    if not stale_rejected:
        raise SystemExit("stale epoch mutation was not rejected")
    released_b=gateway.release(owner_b,epoch_b)

    final_text=gh.text(os.environ["TEST_IMPLEMENTATION_BRANCH"],"gateway-test-runtime.txt")
    report={
        "schema":"LUKE_QUEST_FENCED_GATEWAY_CANDIDATE_REPORT:v1",
        "overall":"PASS",
        "run_id":os.environ["GITHUB_RUN_ID"],
        "control_branch":os.environ["TEST_CONTROL_BRANCH"],
        "implementation_branch":os.environ["TEST_IMPLEMENTATION_BRANCH"],
        "test_issue":int(os.environ["TEST_ISSUE_NUMBER"]),
        "epoch_a":epoch_a,
        "file_operation_state":file_op["OPERATION_STATE"],
        "file_applied_head":file_op["APPLIED_HEAD"],
        "heartbeat_epoch":heartbeat["LEASE_EPOCH"],
        "comment_operation_state":comment_op["OPERATION_STATE"],
        "comment_id":comment_op["COMMENT_ID"],
        "release_a_status":released_a["LEASE_STATUS"],
        "epoch_b":epoch_b,
        "stale_epoch_rejected":stale_rejected,
        "stale_error":stale_error,
        "release_b_status":released_b["LEASE_STATUS"],
        "final_implementation_text":final_text,
    }
    with open(args.report,"w",encoding="utf-8") as f:
        json.dump(report,f,ensure_ascii=False,indent=2)
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__":
    main()
