<!--
Sync Impact Report
==================
Version change: (unfilled template) → 1.0.0
Bump rationale: Initial ratification. No prior ratified version existed; the file held
only the unfilled core scaffold.

Modified principles: N/A (initial adoption)

Added sections:
- Core Principles (six principles, replacing the five-slot scaffold):
  I. Exact Target Authority
  II. Composition Before Detail
  III. Coordinate and Anchor Discipline
  IV. Evidence-Gated Acceptance
  V. Playable Scene, Not a Poster
  VI. Fail Closed and Route Back
- Scope and Authority Constraints (SECTION_2)
- Verification Workflow and Gates (SECTION_3)
- Governance

Removed sections: None (scaffold placeholders only)

Templates requiring alignment: none modified by this command. Dependent templates
(spec, plan, tasks) read this constitution at runtime.

Follow-up TODOs: None. All placeholders resolved from user input.
-->

# LUKE QUEST Visual Reconstruction Planning Constitution

## Core Principles

### I. Exact Target Authority

The owner-approved visual reference is durable authority, not a loose mood board.

- The current first-experiment target identity is fixed as:
  - source branch: `prototype/modern-3d`
  - source commit: `90635ceff9d35d69f80da350df1e6ea0610657dd`
  - path: `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png`
  - blob SHA: `b7281e6580689a7a22cfa3b67d500950e4af7285`
- Every spec, plan, task, and evidence record MUST cite the target by this full identity
  (branch, commit, path, blob SHA). Citing the path alone is insufficient.
- A different image, a crop, a resized substitute, a re-encoded copy, or any later visual MUST
  NOT replace the authority silently. Replacing the authority requires an explicit owner
  decision recorded as a constitution amendment (see Governance) that states the new identity
  in full.
- Any artifact that references a target whose blob SHA does not match the authority is
  invalid for acceptance purposes.

Rationale: reconstruction fidelity is only measurable against a single, immutable reference.
Drift in the reference invalidates every downstream comparison and makes "PASS" meaningless.

### II. Composition Before Detail

Composition gates MUST be established and accepted before any detail work begins.

- The following MUST be established, measured, and accepted first, in this order of
  precedence: camera framing, horizon line, vanishing direction, player scale, floor/terrain
  route, and major silhouettes.
- Only after the composition gate is accepted MAY work proceed to medium props, small props,
  materials, lighting, post-processing, or polish.
- Later decoration MUST NOT be used to compensate for, mask, or argue around a failed earlier
  composition gate. A composition failure is fixed at the composition layer.
- Every major component MUST carry a stable component identity (a named, unique ID) and a
  measurable screen-space placement recorded per Principle III.

Rationale: composition errors propagate through every subsequent layer; detail work built on
a wrong horizon or scale is wasted and creates false confidence.

### III. Coordinate and Anchor Discipline

Critical target elements MUST be represented as normalized screen-space geometry.

- Each critical element MUST be specified with a normalized ROI/anchor expressed as
  `x%`, `y%`, `width%`, `height%` relative to the canonical comparison viewport
  (Principle IV), plus a depth/layer intent (e.g., background, midground, foreground,
  player layer) wherever depth ordering is meaningful.
- The same component identity MUST refer to the same visual object across every gate,
  spec, plan, task, and evidence record. Renaming or re-pointing an identity requires an
  explicit, recorded change with justification.
- Silent reference swapping — re-targeting an identity, ROI, or anchor so that a metric
  passes — is prohibited. A changed ROI MUST be recorded as a change and re-verified from
  the earliest affected gate.

Rationale: normalized coordinates make placement claims testable and viewport-independent;
stable identities make gate results comparable over time instead of re-argued each cycle.

### IV. Evidence-Gated Acceptance

Visual PASS is granted only by fresh, traceable, same-region visual evidence.

- The following are NEVER sufficient for a visual PASS on their own: code existence, commit
  existence, CI green, or the mere existence of a screenshot.
- The canonical comparison viewport is `941x1672`, `DPR=1`, no crop, no padding,
  `fullPage=false`. This MAY be changed only by explicit owner decision recorded as a
  constitution amendment.
- A PASS REQUIRES all of the following, recorded together:
  1. Fresh Target and Actual evidence captured at the exact implementation HEAD under review
     (no reuse of evidence from a prior HEAD).
  2. Same-region comparison: Target and Actual crops MUST use identical normalized ROIs.
  3. Coordinate audit: measured Actual placement versus specified ROI/anchor for every
     critical element in the gate.
  4. Composition audit: framing, horizon, vanishing direction, player scale, terrain route,
     and major silhouettes checked against Principle II acceptance.
  5. Explicit visual comparison: a written, element-by-element comparison verdict, not a
     summary adjective.
- Evidence identity (target identity per Principle I, capture viewport, capture timestamp)
  and the implementation HEAD (commit SHA) MUST be recorded so that any PASS can be traced
  and reproduced.

Rationale: proxies for visual correctness (green CI, a commit landing) measure process, not
outcome. Only evidence bound to a specific HEAD and region can be audited later.

### V. Playable Scene, Not a Poster

The deliverable is a playable game scene, not a static rendering.

- Existing player, camera, movement, and traversal behavior MUST be preserved unless a
  separately approved requirement explicitly changes it. Visual reconstruction work is not,
  by itself, authorization to alter gameplay behavior.
- The canonical target composition is judged from an explicit, documented verification
  camera/vantage. That vantage MUST be specified (position, orientation, projection
  parameters) so it can be reproduced for every capture.
- Playability MAY introduce additional camera behavior (follow, orbit, transitions), but that
  behavior MUST NOT destroy or make unreachable the verified composition state. The
  verification vantage MUST remain attainable in the running game.

Rationale: a scene that matches the target only in a screenshot but breaks under play has not
met the goal; a scene that plays but cannot present the verified composition has not either.

### VI. Fail Closed and Route Back

Gate failure halts downstream work and routes back to the earliest causal gate.

- If any visual gate fails, all downstream advancement MUST stop. No detail, polish, or
  later-gate work proceeds on top of a failed gate.
- The failure MUST be routed back to the earliest gate that causes it, not to the gate
  where it was observed. Fixing symptoms at a later gate is prohibited.
- Success MUST NOT be declared using approximation language. Terms such as "similar",
  "inspired by", "close", "close enough", "roughly matches", "in the spirit of", or
  equivalents are not acceptance verdicts. The only acceptance verdicts are PASS and FAIL,
  each backed by the evidence required in Principle IV.
- Absence of evidence is FAIL, not "pending PASS".

Rationale: an open-by-default gate accumulates unverified assumptions; routing to the causal
gate prevents repeated downstream rework.

## Scope and Authority Constraints

- This constitution governs ONLY the isolated Spec Kit planning workspace for reconstructing
  the owner-approved static target image as a playable game scene.
- Work under this constitution is planning and specification. It MUST NOT implement
  application code and MUST NOT modify application source, tests, CI/CD workflows, branches,
  git configuration, or deployment files.
- The only file this governance workflow writes is `.specify/memory/constitution.md`.
  Downstream Spec Kit commands (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`) write
  their own artifacts under `.specify/` or `specs/` per their definitions; none of them
  authorize application changes.
- Authority hierarchy, highest first: (1) this constitution; (2) the target identity in
  Principle I; (3) accepted gate records and their evidence; (4) spec, plan, and task
  artifacts; (5) informal discussion. A lower item MUST NOT override a higher one.
- Owner decisions that change any authority (target identity, canonical viewport,
  verification vantage) MUST be recorded as amendments to this constitution before they take
  effect.

## Verification Workflow and Gates

Gates are ordered. Each gate MUST be accepted with Principle IV evidence before the next opens.

1. **Gate 0 — Target Lock**: Confirm the target identity (Principle I) and canonical viewport
   (Principle IV). Record the verification camera/vantage (Principle V). Produce the initial
   component-identity list with normalized ROIs (Principle III).
2. **Gate 1 — Composition**: Camera framing, horizon, vanishing direction, player scale,
   floor/terrain route, and major silhouettes (Principle II). No prop, material, or lighting
   work MAY begin until this gate is PASS.
3. **Gate 2 — Medium Props**: Medium-scale scene elements placed against their ROIs.
4. **Gate 3 — Small Props**: Small-scale elements placed against their ROIs.
5. **Gate 4 — Materials and Lighting**: Surface treatment and lighting matched to the target
   within the accepted composition.
6. **Gate 5 — Polish and Playability**: Final detail, plus confirmation that player, camera,
   movement, and traversal behavior are preserved and the verification vantage remains
   attainable (Principle V).

Gate rules:

- Every gate record MUST include: gate number, implementation HEAD SHA, target identity,
  capture viewport, per-component coordinate audit, composition audit, explicit visual
  comparison, and a PASS/FAIL verdict.
- A FAIL at gate N reopens gate N and closes gates N+1 and above until gate N is PASS again
  (Principle VI). If the root cause is at gate M < N, gate M reopens instead and all gates
  above M close.
- Changing any ROI, anchor, or component identity after a gate is PASS invalidates that PASS
  and every later gate for the affected components.
- Specs and plans produced in this workspace MUST map each requirement to a gate and to the
  component identities it affects.

## Governance

- This constitution supersedes all other practices, conventions, and informal agreements
  within the isolated planning workspace.
- **Amendment procedure**: An amendment MUST be proposed in writing with the exact text
  change, the rationale, and the owner's explicit approval. Changes to any authority item
  (target identity, canonical viewport, verification vantage) additionally MUST state the
  old and new values in full and MUST reopen all gates from Gate 0.
- **Versioning policy**: Semantic versioning `MAJOR.MINOR.PATCH`.
  - MAJOR: removal or redefinition of a principle, or change to an authority item in
    Principle I or Principle IV.
  - MINOR: new principle or section, or materially expanded guidance.
  - PATCH: clarification, wording, or typo fix with no semantic change.
- **Compliance review**: Every spec, plan, task list, and gate record produced in this
  workspace MUST be checked against all six principles before it is considered complete.
  Any artifact that cites a target identity other than Principle I, a viewport other than
  Principle IV, or declares success with approximation language MUST be rejected and
  returned for correction.
- **Complexity justification**: Any deviation from the gate order in Verification Workflow
  and Gates MUST be justified in writing and approved by the owner; unjustified deviations
  are treated as gate failures.

**Version**: 1.0.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21
