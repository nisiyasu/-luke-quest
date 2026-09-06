# REQ-080 — Save Transfer Overwrite Comparison

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / PLAYER-SAFETY / UX
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FOLLOW_THROUGH
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

REQ-062 already prevents one-tap replacement of an existing resumable browser-local adventure. REQ-068/071/079 now shows the incoming SAVE CODE summary and creation time. The remaining safety gap was that the destructive confirmation message did not identify the current local adventure being replaced, making stale-code rollback harder to judge on a small iPhone screen.

## 1. REQUIRED BEHAVIOR

- When REQ-062 arms the second-tap overwrite confirmation, show a compact CURRENT vs IMPORT comparison.
- CURRENT is derived read-only from the current canonical runtime state; IMPORT reuses existing REQ-060 `prepareImportedState()` authority.
- Minimum visible comparison: LV, location, and G for current and imported saves; imported creation time remains visible through the existing REQ-079 preview.
- No second import parser or bypass of `prepareImportedState()`.
- No canonical state/localStorage mutation while merely arming/rendering comparison.
- Existing 12-second REQ-062 expiry, code-change disarm, fresh-browser one-step import, invalid-code fail-closed behavior and final import authority remain unchanged.
- Summary failure falls back to the previous safe overwrite warning.
- No protected story spoilers.

## 2. ACCEPTANCE

Automated acceptance proved:
1. existing resumable progress + valid SAVE CODE arms confirmation without mutation;
2. armed feedback includes CURRENT and IMPORT LV/location/G summaries;
3. imported summary is prepared through existing transfer authority;
4. second identical click executes existing import authority;
5. changed code and expired confirmation disarm safely;
6. fresh/non-resumable browser remains one-step;
7. invalid code remains fail-closed;
8. no duplicate import parser/path was introduced;
9. assembled browser smoke PASS;
10. 390x844 touch/fullscreen visual-liveness PASS;
11. Pages deploy SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C, and continue while safe useful work remains.

## 4. IMPLEMENTATION / VERIFICATION EVIDENCE

- Requirement registration: `941872ab016c53f099f48cdd4abbbf3c75e47426`.
- CURRENT vs IMPORT comparison implemented inside the existing REQ-062 guard at `7815e505421abbce47e13f35a212ee428cc3b2e7`.
- Existing REQ-062 browser smoke extended with comparison/read-only/preparation-authority gates at `bf07a75294cf60f87d1fb29c39d55a813c2dde16`.
- GitHub Pages run `34022037838` for HEAD `bf07a75294cf60f87d1fb29c39d55a813c2dde16`: SUCCESS.
- Sequential patch validation, collision-safe add-ons, static/contract/autosave/PWA/raster/Luke gates, assembled browser smoke, 390x844 touch/fullscreen visual-liveness, upload and deploy all SUCCESS.
- IOS_PHYSICAL_VERIFICATION remains PENDING; no physical-device PASS is claimed.
