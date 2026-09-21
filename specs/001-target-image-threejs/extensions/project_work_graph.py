#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, pathlib, subprocess, sys, time

HERE = pathlib.Path(__file__).resolve().parent
FEATURE = HERE.parent

def gh(args, expect_json=True):
    p = subprocess.run(["gh", *args], text=True, capture_output=True, encoding="utf-8")
    if p.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {p.stderr.strip()}")
    return json.loads(p.stdout) if expect_json and p.stdout.strip() else p.stdout.strip()

def item_field(item, name):
    for k, v in item.items():
        if k.lower() == name.lower():
            return v
    return None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    graph = json.loads((FEATURE / "issue-graph.json").read_text(encoding="utf-8"))
    state = json.loads((FEATURE / "issue-numbers.json").read_text(encoding="utf-8"))
    repo = state["repository"]
    owner = state["project"]["owner"]
    project = str(state["project"]["number"])
    parent = int(state["parent"]["number"])

    by_key = {x["key"]: x for x in state["subissues"]}
    desired = [state["parent"], *state["subissues"]]
    ops, applied, unchanged = [], [], []

    current_subs = gh(["api", f"repos/{repo}/issues/{parent}/sub_issues?per_page=100"])
    current_sub_nums = {int(x["number"]) for x in current_subs}
    for x in state["subissues"]:
        n = int(x["number"])
        if n in current_sub_nums:
            unchanged.append(f"subissue:{parent}->{n}")
            continue
        ops.append({"type":"subissue_add","parent":parent,"child":n})
        if args.apply:
            issue = gh(["api", f"repos/{repo}/issues/{n}"])
            gh(["api","--method","POST",f"repos/{repo}/issues/{parent}/sub_issues",
                "-F",f"sub_issue_id={int(issue['id'])}"])
            applied.append(f"subissue:{parent}->{n}")
            time.sleep(0.8)

    for blocked_key, blocker_key in graph["dependencies"]:
        blocked = int(by_key[blocked_key]["number"])
        blocker = int(by_key[blocker_key]["number"])
        cur = gh(["api", f"repos/{repo}/issues/{blocked}/dependencies/blocked_by?per_page=100"])
        cur_nums = {int(x["number"]) for x in cur}
        if blocker in cur_nums:
            unchanged.append(f"dep:{blocked}<-{blocker}")
            continue
        ops.append({"type":"dependency_add","blocked":blocked,"blocker":blocker})
        if args.apply:
            blocker_issue = gh(["api", f"repos/{repo}/issues/{blocker}"])
            gh(["api","--method","POST",f"repos/{repo}/issues/{blocked}/dependencies/blocked_by",
                "-F",f"issue_id={int(blocker_issue['id'])}"])
            applied.append(f"dep:{blocked}<-{blocker}")
            time.sleep(0.8)

    items_doc = gh(["project","item-list",project,"--owner",owner,"--limit","200","--format","json"])
    items = items_doc.get("items", [])
    by_url = {x.get("content",{}).get("url"): x for x in items if x.get("content")}
    for x in desired:
        n = int(x["number"])
        url = f"https://github.com/{repo}/issues/{n}"
        if url not in by_url:
            ops.append({"type":"project_item_add","issue":n})
            if args.apply:
                gh(["project","item-add",project,"--owner",owner,"--url",url,"--format","json"])
                applied.append(f"project_item:{n}")
                time.sleep(0.8)
        else:
            unchanged.append(f"project_item:{n}")

    items_doc = gh(["project","item-list",project,"--owner",owner,"--limit","200","--format","json"])
    items = items_doc.get("items", [])
    by_url = {x.get("content",{}).get("url"): x for x in items if x.get("content")}

    field_map = [
        ("Priority","priority"),
        ("Gate","gate"),
        ("Lane","lane"),
        ("Work Type","work_type"),
        ("Owner Attention","owner_attention"),
    ]
    for x in desired:
        n = int(x["number"])
        url = f"https://github.com/{repo}/issues/{n}"
        item = by_url.get(url, {})
        for field, attr in field_map:
            wanted = x.get(attr)
            if wanted is None:
                continue
            current = item_field(item, field)
            if current == wanted:
                unchanged.append(f"field:{n}:{field}={wanted}")
                continue
            ops.append({"type":"field_set","issue":n,"field":field,"value":wanted,"current":current})
            if args.apply:
                gh(["project","item-edit",project,"--owner",owner,"--url",url,
                    "--field",field,"--value",str(wanted),"--format","json"])
                applied.append(f"field:{n}:{field}={wanted}")
                time.sleep(0.8)

    result = {
        "schema":"LQ_SPEC_KIT_WORK_GRAPH_EXTENSION_REPORT:v1",
        "mode":"APPLY" if args.apply else "DRY_RUN",
        "repo":repo,
        "parent_issue":parent,
        "project_number":int(project),
        "planned_mutations":ops,
        "planned_count":len(ops),
        "applied":applied,
        "applied_count":len(applied),
        "unchanged_count":len(unchanged),
        "delete_operations":0,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    sys.exit(main())
