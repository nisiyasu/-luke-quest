# Visual Evidence Storage Contract v1

TASK: T023
ISSUE: #139
STATUS: IMPLEMENTED

This directory defines the machine-readable save format for #101 gate evidence.

## Durable storage

Evidence remains on the existing append-only branch evidence/visual-verification.
The canonical set location is:

evidence/visual-rebuild/issue-<issue_number>/<evidence_set_id>/

Each set stores raw artifacts plus:

- evidence-set.json conforming to $defs.evidenceSet
- gate-record.json conforming to $defs.gateRecord
- evidence-set-index.json generated/read back by the existing Fenced Gateway

No new evidence repository or competing SSOT is introduced.

## PASS invariant

A Gate Record may say PASS only when:

1. the Evidence Set is complete,
2. exact_head_verified=true,
3. the Evidence Set implementation HEAD equals the exact evaluated implementation HEAD,
4. blocking_gaps is empty.

If implementation HEAD changes after capture, create a new Evidence Set and Gate Record. Never overwrite an adopted or durable set.

## Required evidence content

The contract covers Target identity, Target/Actual images, overlay or diff, landmark measurements, silhouette metrics, human visual ratings, exact implementation HEAD, device/profile, canonical viewport, verdict, residual gaps and timestamp.

The raw artifact names enforced by the current Gateway remain authoritative. This schema adds machine-readable metadata and gate-decision structure around that existing storage path.
