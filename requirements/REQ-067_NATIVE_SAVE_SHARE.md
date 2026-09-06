# REQ-067 — Native Save Share

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / CROSS-DEVICE / PLAYER-UX / IOS
OWNER_REQUEST: DIRECT_FOLLOW_THROUGH_FROM_CROSS_BROWSER_SAVE_TRANSFER
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

The Owner's real-play concern is carrying the same LUKE QUEST progress into another browser/device. REQ-060 and REQ-064 already provide SAVE CODE and `.lqsave.txt` download/load. On iPhone, add the shortest reversible handoff available: native Web Share of the existing save-transfer file, without creating another save schema or cloud backend.

## 1. REQUIRED BEHAVIOR

- World/pause SAVE TRANSFER UI exposes `SHARE SAVE FILE`.
- The shared file payload is exactly the existing REQ-060/064 SAVE CODE file payload.
- Prefer native file share only when `navigator.share` and `navigator.canShare({files:[file]})` support it.
- If native file share is unavailable, fail gracefully by falling back to the already-existing SAVE FILE download path rather than leaving a dead button.
- User cancellation (`AbortError`) is not treated as a destructive/error state.
- Sharing never mutates canonical autosave, state, flags, economy or progression.
- No second transfer schema, no direct import path, no bypass of REQ-062 overwrite protection.
- Title import remains LOAD-only because a fresh title has no exportable field snapshot.

## 2. IMPLEMENTATION SHAPE

Prefer a small additive wrapper around `window.LQ_SAVE_TRANSFER_STATUS` rather than duplicating save-transfer authority. Export/share must call the existing `exportFilePayload()` and `transferFileName()` authorities.

## 3. TEST REQUIREMENTS

Automated acceptance must prove:

1. native-share capability detection is fail-closed;
2. supported file share receives a `.lqsave.txt` `File` whose text equals the existing transfer file payload;
3. share cancellation makes no canonical mutation;
4. unsupported native file share falls back to existing download authority;
5. title does not expose an invalid export/share button;
6. no duplicate buttons/listeners after render reruns;
7. REQ-060/062/064 transfer contracts remain intact;
8. assembled browser smoke PASS;
9. 390x844 touch/fullscreen regression PASS;
10. Pages deploy SUCCESS.

## 4. NO-FAKE / NO-STOP

- Do not call this cloud save.
- Do not claim iPhone physical PASS from headless CI.
- Do not invent another save format.
- Completion is a checkpoint, not a stop condition; run GATE C and continue.
