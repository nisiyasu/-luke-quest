# REQ-079 — Save Transfer Age Preview

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / PLAYER-UX / SAFETY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FOLLOW_THROUGH
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Cross-browser save transfer is now a real player workflow. The existing import preview shows LV/location/HP/MP/G, but it does not tell the player when the portable SAVE CODE was created. When multiple codes/files exist, importing a stale copy can silently roll the adventure backward after the existing overwrite confirmation.

## 1. REQUIRED BEHAVIOR

- For a valid SAVE CODE, IMPORT PREVIEW also shows a compact transfer creation time derived from the existing transfer envelope `createdAt`.
- Use the existing REQ-060 `decodeEnvelope()` plus `prepareImportedState()` authorities. Do not add a second parser or schema.
- A missing/invalid `createdAt` must fall back to a neutral label rather than making an otherwise valid legacy-compatible transfer unusable.
- Preview remains read-only and must not mutate canonical state/localStorage/economy/inventory/progression.
- Existing REQ-062 overwrite confirmation remains the final destructive-action authority.
- File load continues to use the same textarea/input preview path.
- Do not expose protected story secrets.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. valid exported code preview includes LV/location/HP/MP/G and a creation-time label;
2. parsed creation time comes from the same envelope accepted by REQ-060;
3. invalid code still fails closed;
4. missing/invalid timestamp uses a neutral fallback without state mutation;
5. no duplicate preview nodes/listeners;
6. existing save-transfer/overwrite/import-preview regressions remain PASS;
7. assembled browser smoke PASS;
8. 390x844 touch/fullscreen visual-liveness PASS;
9. Pages deploy SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C, and continue while safe useful work remains.
