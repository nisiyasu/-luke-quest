# REQ-065 — Autosave Quarantine Recovery UI

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / RECOVERY / PLAYER-UX / DATA-SAFETY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FROM_REQ-063_RECOVERY_GAP
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

REQ-063 prevents malformed or structurally invalid canonical autosaves from crashing the whole game by quarantining the original raw payload to `lukeQuestAutosaveQuarantineV1` before removing the canonical key.

That safety behavior creates a player-facing recovery gap: after safe boot, CONTINUE may disappear with no explanation even though the original corrupt raw payload was deliberately preserved.

Make that recovery state visible and exportable without pretending malformed data can be semantically repaired.

## 1. REQUIRED BEHAVIOR

When a valid quarantine record exists and the game is on title:

- show a compact recovery notice explaining that the previous local autosave could not be loaded safely and was preserved;
- show the recorded reason and timestamp when available;
- offer `DOWNLOAD QUARANTINE` to export the preserved record/raw payload for later inspection/recovery;
- offer `DISMISS NOTICE` to hide the notice without deleting the quarantine record;
- keep NEW GAME, legitimate CONTINUE, REQ-060/064 transfer recovery and all other title controls usable;
- never automatically restore malformed raw data into canonical state;
- never delete quarantine merely because the notice is dismissed;
- if the quarantine record itself is malformed/unreadable, fail closed and do not crash title;
- if no valid quarantine exists, render no notice.

## 2. ARCHITECTURE

Implement as a late title UI add-on reading the bounded REQ-063 quarantine key. Do not modify the pre-bootstrap guard's safety semantics.

The download artifact should contain a JSON recovery package with at minimum:
- quarantine format/version;
- exported timestamp;
- original quarantine timestamp/reason/raw when available.

Use Blob/object URL/anchor download; no File System Access API dependency.

## 3. SAFETY

- No direct canonical `lukeQuestV2` write from this UI.
- No automatic `JSON.parse(raw)` recovery attempt.
- Dismissal is session/UI-only or a separate notice-state key; quarantine evidence remains intact.
- Download failure must not mutate storage.
- Title must remain bootable if quarantine storage is inaccessible.

## 4. TEST REQUIREMENTS

Automated acceptance must prove:

1. no quarantine -> no notice;
2. valid quarantine -> title notice visible with reason/timestamp;
3. malformed quarantine record -> title remains safe and no false recovery claim;
4. dismissal hides notice but preserves quarantine storage;
5. recovery package preserves original raw payload/reason/timestamp;
6. download/export helper does not write canonical save;
7. REQ-061 Continue validity remains correct;
8. REQ-060/064 title transfer recovery remains present;
9. REQ-063 bootstrap guard regression remains PASS;
10. assembled title/world browser smoke PASS;
11. 390x844 touch/fullscreen regression PASS;
12. Pages deploy SUCCESS.

## 5. NO-FAKE / NO-STOP

- Quarantine visibility is not semantic save repair.
- Do not claim the corrupt autosave is playable unless a separate valid import/recovery actually succeeds.
- Do not delete the only preserved corrupt payload.
- Do not claim iPhone physical PASS from CI.
- Completion is a checkpoint, not a stop condition. Run GATE C and continue when safe work remains.

## 6. IMPLEMENTATION / VERIFICATION EVIDENCE

- Implemented `addons/autosave-quarantine-recovery.js` as a title-only late recovery UI; REQ-063 pre-bootstrap quarantine semantics remain unchanged.
- A valid `lukeQuestAutosaveQuarantineV1` record now renders a compact `SAVE RECOVERY` notice with reason/timestamp and explicit statement that the raw source was preserved.
- `DOWNLOAD QUARANTINE` exports a versioned JSON recovery package containing original quarantine timestamp, reason and raw payload without writing canonical `lukeQuestV2`.
- `DISMISS NOTICE` records only the signature of the current quarantine and removes the notice; the quarantine record itself remains intact.
- Malformed/unreadable quarantine records fail closed and do not create a false recovery notice or crash title.
- Existing REQ-060/064 title transfer controls remain independently present and usable.
- Dedicated runtime acceptance: `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-autosave-quarantine-recovery-smoke.js`.
- Checkpoints:
  - `942601233a9efc07cba01ffe85716d6359b6c4ee` — requirement registration.
  - `6c8aef599b9016d0edd4927a9e0848ac8ef96d3a` — recovery UI implementation.
  - `a45d3790fc7dfe9049e2a821e5e0bfa27f0ba0d5` — dedicated runtime acceptance.
- Pages workflow run `34016802177`: SUCCESS.
- The run passed JavaScript/add-on/static gates, REQ-063 bootstrap regression, assembled browser smoke including REQ-065 dedicated acceptance, 390x844 touch/fullscreen visual-liveness, upload and deployment.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
