# REQ-063 — Canonical Autosave Bootstrap Hardening

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / BOOTSTRAP / RECOVERY / DATA-SAFETY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FROM_SAVE_INTEGRITY_AUDIT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT

The base runtime currently initializes state with an unguarded bootstrap parse:

```js
let s=Object.assign({},DEFAULT,JSON.parse(localStorage.getItem('lukeQuestV2')||'{}'));
```

This executes before late `addons/*.js` are loaded. A malformed canonical autosave can therefore throw during page bootstrap and prevent the game, REQ-049/050/051 manual-backup protections, REQ-060 save transfer, and all later recovery UI from loading.

Additionally, dangerous own keys in a parsed canonical object should not be allowed to reach the base `Object.assign` merge boundary unfiltered.

## 1. REQUIRED BEHAVIOR

Before the base inline game script executes in the published assembled Pages build:

- inspect `localStorage['lukeQuestV2']` if present;
- valid plain-object JSON remains available to the base runtime;
- malformed JSON is quarantined rather than crashing bootstrap;
- primitive/array/null canonical payloads are quarantined rather than merged as state;
- dangerous top-level keys `__proto__`, `constructor`, `prototype` are removed before base merge;
- dangerous nested flag keys are removed before base flag merge;
- changed sanitized canonical payload is rewritten only when needed;
- unrecoverable raw payload is preserved in a dedicated quarantine record before canonical key removal;
- game then boots to a safe default title state;
- fresh title retains REQ-060 SAVE TRANSFER recovery/import path;
- legitimate existing saves remain resumable.

Do not silently destroy the only corrupt raw payload. Preserve recovery evidence.

## 2. ARCHITECTURE

A late add-on is insufficient because the crash can occur before add-ons load.

Use a small pre-bootstrap script that is injected by the Pages assembly workflow immediately before the base inline game script.

Preferred source:

`prelude/autosave-bootstrap-guard.js`

Published ordering must be:

```text
prelude/autosave-bootstrap-guard.js
→ base inline runtime / DEFAULT + JSON.parse
→ sequential ux patches
→ addons
```

The prelude must not depend on `DEFAULT`, `s`, `app`, add-ons, or patched runtime globals.

## 3. QUARANTINE

Use a bounded recovery record key such as:

`lukeQuestAutosaveQuarantineV1`

The record should contain at minimum:
- timestamp;
- reason;
- original raw autosave string.

One latest quarantine record is sufficient. Do not create unbounded localStorage growth.

## 4. TEST REQUIREMENTS

Automated acceptance must prove at minimum:

1. no canonical key → no mutation/error;
2. valid plain-object save preserved;
3. malformed JSON → quarantine + canonical removal;
4. primitive/array/null → quarantine + canonical removal;
5. dangerous top-level keys removed while safe fields survive;
6. dangerous flags keys removed while safe flags survive;
7. quarantine retains original raw payload/reason/timestamp;
8. prelude is actually injected before the base bootstrap script in assembled `index.html`;
9. normal assembled browser title/world smoke PASS;
10. REQ-060/061/062 save-transfer/Continue contracts remain PASS;
11. 390x844 touch/fullscreen regression PASS;
12. Pages deploy SUCCESS.

## 5. NO-FAKE / NO-STOP

- A late add-on-only fix is not sufficient.
- A Node unit test without proving assembled script order is not sufficient.
- Do not claim recovery of semantic progress from malformed JSON; only quarantine and safe boot are required.
- Physical iPhone observation remains PENDING unless actually observed.
- Completion is a checkpoint, not a stop condition. Run GATE C and continue when safe work remains.
