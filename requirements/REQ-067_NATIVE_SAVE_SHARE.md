# REQ-067 — Native Save Share

STATUS: VERIFY
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

## 5. IMPLEMENTATION / VERIFICATION EVIDENCE

- Added `addons/save-transfer-native-share.js` as an additive transport/presentation layer over the existing `window.LQ_SAVE_TRANSFER_STATUS`; it does not create a second save schema or state merge path.
- World/pause SAVE TRANSFER now receives `SHARE SAVE FILE`; title transfer intentionally remains import-only.
- Native file sharing is used only when both `navigator.share` and `navigator.canShare({files})` explicitly support the generated `File`.
- The shared `File` name uses the existing REQ-064 `.lqsave.txt` naming authority and its bytes are created from the exact existing REQ-064 `exportFilePayload()` output.
- Unsupported native file share and non-cancellation native share failures fall back to the existing REQ-064 download authority. `AbortError` is treated as a non-destructive cancellation.
- Added dedicated fail-closed runtime acceptance `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-native-save-share-smoke.js` proving supported file share payload identity, no canonical-state mutation, unsupported-share download fallback, no duplicate share buttons, and no invalid title export button.
- Checkpoints:
  - `dfef7baf13aa41ce0eb2937ebef11a938a6954a2` — requirement registration.
  - `d5a87c6a2833b1850e3e151813002140cb445b40` — native share implementation.
  - `f2aeb9bbfeccc1422dac00a1b4b1dc6448aa0872` — dedicated acceptance.
- Pages workflow run `34017657791`: SUCCESS. Sequential patch validation, add-on/static/contract guards, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, upload and Pages deploy all passed.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
