# LUKE QUEST Durable Visual Evidence Store v1

**PRODUCTION_ENABLED: false**

This branch is the append-only durable evidence store defined by:

`docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

Production Environment evidence publication is not enabled until the production Fenced Mutation Gateway and credential boundary are proven.

Canonical path shape:

`evidence/<LANE_ID>/issue-<CHILD_ISSUE>/<EVIDENCE_ID>/`

Rules:

- append-only evidence sets
- no force-push overwrite
- expected-HEAD conditional publication
- candidate manifest and adoption record remain separate
- durable read-back verification before PASS/adoption
- Village / Castle / Dungeon publication conflict must preserve all sets

This initialization file is infrastructure only. It is not evidence and does not enable any production lane.
