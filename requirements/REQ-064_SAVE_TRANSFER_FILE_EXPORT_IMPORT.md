# REQ-064 — Save Transfer File Export / Import

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / CROSS-DEVICE / PLAYER-UX
OWNER_REQUEST: DIRECT_FOLLOW_THROUGH_FROM_CROSS_BROWSER_SAVE_TRANSFER
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

REQ-060 established portable SAVE CODE transfer across browser-local storage boundaries. The Owner's current concern is continuing the same story/progress in another browser or device.

Long SAVE CODE copy/paste is valid but can be awkward on iPhone. Add a second portable path that uses a small save-transfer file while preserving the exact same canonical transfer authority and safety gates.

## 1. REQUIRED BEHAVIOR

In the existing SAVE TRANSFER UI:

- on a resumable field save, player can download a portable LUKE QUEST save-transfer file;
- on title and pause/menu transfer UI, player can choose that file and import it;
- the file payload is the existing REQ-060 SAVE CODE text, not a second competing save schema;
- file import must feed the existing `.lqTransferCode` input and existing IMPORT action rather than creating a parallel state merge path;
- REQ-062 existing-progress overwrite confirmation must therefore still apply to file imports;
- malformed/empty/oversized/unreadable files fail closed without changing canonical save/state;
- normal SAVE CODE copy/paste remains available;
- manual backup system remains independent and intact.

## 2. UX

Menu/world transfer box:
- keep `COPY SAVE CODE` and `IMPORT`;
- add `DOWNLOAD SAVE FILE`;
- add `LOAD SAVE FILE`.

Fresh title transfer box:
- keep code paste + IMPORT;
- add `LOAD SAVE FILE` so a new browser/device can recover without first creating local progress.

Use a clear extension such as `.lqsave.txt`. Do not rely on browser-specific File System Access APIs.

## 3. SAFETY

- File export must call the existing REQ-060 export authority.
- File import must not directly assign `s`, merge flags, or write localStorage.
- File import must route through the same existing import button/event path so REQ-062 can intercept it.
- Reject files above a conservative bounded size before reading/processing.
- Importing a file must never silently overwrite resumable local progress.

## 4. TEST REQUIREMENTS

Automated acceptance must prove at minimum:

1. file export payload equals a valid existing SAVE CODE;
2. file load populates the existing transfer textarea;
3. file load routes through existing IMPORT action rather than direct merge;
4. fresh-browser file load path is present on title;
5. existing resumable progress still requires REQ-062 two-step confirmation;
6. malformed/empty/oversized file fails closed;
7. REQ-060 save-code round trip remains PASS;
8. REQ-061 Continue validity remains PASS;
9. REQ-062 overwrite guard remains PASS;
10. REQ-063 bootstrap guard remains PASS;
11. assembled title/world browser smoke PASS;
12. 390x844 touch/fullscreen regression PASS;
13. Pages deploy SUCCESS.

## 5. NO-FAKE / NO-STOP

- Do not invent a second save format.
- Do not bypass existing import validation or overwrite guard.
- Do not claim iPhone physical PASS from headless CI.
- Completion is a checkpoint, not a stop condition. Run GATE C and continue when safe work remains.

## 6. IMPLEMENTATION / VERIFICATION EVIDENCE

- Existing `addons/save-transfer.js` was extended rather than creating a second save authority.
- File payload is exactly the existing REQ-060 SAVE CODE plus a trailing newline.
- Menu/world transfer UI now exposes `DOWNLOAD SAVE FILE` and `LOAD SAVE FILE`; title recovery UI exposes `LOAD SAVE FILE` while export remains unavailable without a resumable field state.
- File import validates through existing `prepareImportedState()`, writes the validated code into the existing `.lqTransferCode` textarea, dispatches the existing input path, then clicks the existing `.import` button.
- This preserves REQ-062 capture-phase overwrite protection; dedicated acceptance proves an existing resumable local adventure arms the two-step overwrite guard rather than being silently replaced.
- File size is bounded to 256 KiB and empty, malformed, oversized or unreadable payloads fail closed before canonical state mutation.
- Checkpoints:
  - `ae412c30a8fdfa13259dabb6d723f98aa61f5d9b` — requirement registration.
  - `9a114954165b9d6b6bb9a749e6773f732c694b00` — implementation.
  - `130790d261da03b9299962a2e0bf15fa6eaf7c25` — dedicated runtime acceptance.
- Pages workflow run `34016621862`: SUCCESS.
- The run passed addon syntax/contract/static gates, REQ-063 bootstrap regression, assembled browser runtime including REQ-064 dedicated file-transfer acceptance, 390x844 touch/fullscreen visual-liveness, upload and deployment.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
