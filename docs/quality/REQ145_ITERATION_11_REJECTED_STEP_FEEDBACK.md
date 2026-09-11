# REQ-145 Iteration 11 — REJECTED world step feedback

STATUS: `REJECTED / REVERTED`
REQUIREMENT: `REQ-145`
BRANCH: `experiment/gold-vertical-slice`

## Intent

Improve movement-time game feel without adding input, movement, collision, save, story, battle, or progression authority.

## Experiment

A presentation-only addon observed canonical world position changes after render and emitted short-lived pointer-transparent footfall cues near Luke's feet.

EXPERIMENT_COMMIT: `f24cdd11783709f2a687bb578a3235e030ed784e`
REVERT_COMMIT: `2aee27d0f5ea735499b0b80d16378ae6e8eb1c9a`

## Evidence

On the experiment head:

- `P0 Touch Diagnostic`: SUCCESS.
- `REQ-145 Gold Vertical Slice Challenger`: SUCCESS.
- `REQ-023 Evacuation Guidance Gate`: FAILURE in the isolated REQ-023 browser flow.

The direct parent lineage had a green REQ-023 gate. After deleting the step-feedback addon, the exact revert head `2aee27d0f5ea735499b0b80d16378ae6e8eb1c9a` returned `REQ-023 Evacuation Guidance Gate` to SUCCESS and retained `P0 Touch Diagnostic` SUCCESS. The clean revert head also completed `REQ-145 Gold Vertical Slice Challenger` SUCCESS.

## Decision

Reject this implementation. Do not promote or recreate the MutationObserver + transient footstep-node approach merely because its local/P0/Gold gates are green. A Gold quality iteration may not trade away protected evacuation-route guidance reliability.

## Do not repeat

- Do not add repeated movement-time DOM node creation as a cosmetic improvement without proving REQ-023 and the complete Gold gate set.
- Do not treat the REQ-145 Challenger alone as sufficient evidence when a protected dedicated gate is red.
- Do not dismiss a new regression as flaky when the parent is green and the candidate is red.
- Prefer the next movement/first-10-seconds improvement to reuse existing DOM/CSS presentation surfaces, with no new gameplay authority and no per-step DOM churn.

OWNER_EXPERIENCE_PASS: `PENDING`
IOS_PHYSICAL_VERIFICATION: `PENDING`
