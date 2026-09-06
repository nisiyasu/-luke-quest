# REQ-060 — Cross-Browser Save Transfer

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / TRANSFER / PLAYER-VISIBLE / IOS / DIRECTIVE-AUTHORIZED
OWNER_REQUEST: RECENT_PLAYER_PAIN_POINT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Recent real play exposed a concrete usability gap: LUKE QUEST autosave and manual backup slots live in browser-local `localStorage`, so progress saved in one browser does not automatically appear in another browser or device.

Build a safe, player-visible transfer path that lets the player carry progress between browsers without requiring an account or cloud backend.

## 1. SCOPE

Add a versioned SAVE TRANSFER feature on top of the existing canonical save/manual-backup system.

Required player flow:

Browser A:
1. open LUKE QUEST with existing progress;
2. obtain a portable SAVE CODE representing a sanitized current snapshot;
3. copy the code using Clipboard API when available, with a visible/manual fallback.

Browser B / fresh browser:
1. open LUKE QUEST even with no local save;
2. title screen exposes SAVE TRANSFER import UI;
3. paste the SAVE CODE;
4. import validates format and state before mutating canonical state;
5. successful import stores canonical autosave and makes the imported progress playable via Continue / immediate safe load.

## 2. ARCHITECTURE

Do not redesign autosave. Keep `lukeQuestV2` as canonical browser-local autosave.

Use a versioned transfer envelope:

```json
{
  "format": "LUKE_QUEST_SAVE_TRANSFER",
  "version": 1,
  "createdAt": "ISO timestamp",
  "state": { "...": "sanitized game state" }
}
```

Transport encoding is URL-safe base64 over UTF-8 JSON.

Reuse the existing manual-backup safety contract where possible:
- plain-object validation;
- dangerous-key sanitization;
- canonical numeric-field normalization;
- legacy/default migration;
- invalid-map safe fallback.

## 3. IMPLEMENTATION

### `addons/save-transfer.js`

- versioned `LUKE_QUEST_SAVE_TRANSFER` v1 envelope;
- UTF-8-safe URL-safe base64 encode/decode;
- field/world snapshot export with volatile battle/menu/dialogue state removed;
- Clipboard API copy when available plus visible textarea/manual-copy fallback;
- title-screen SAVE TRANSFER import UI available independently of existing local save/manual slots;
- pause-menu SAVE TRANSFER export/import UI;
- malformed/wrong-format/wrong-version/non-object payload rejection before canonical mutation;
- dangerous-key sanitization for state and flags;
- current DEFAULT numeric normalization via the existing manual-backup contract;
- missing/removed map fallback to safe town coordinates;
- movement stop + canonical `save()` + safe world resume after successful import;
- existing `lukeQuestV2` autosave and two manual localStorage slots remain unchanged.

### `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-save-transfer-smoke.js`

Fail-closed runtime acceptance covers:
- status/format/version contract;
- export code creation;
- representative story/map/position/stats/flags round trip;
- Japanese Unicode round trip;
- malformed payload no-mutation rejection;
- wrong format/version rejection;
- array state rejection;
- `__proto__` / `constructor` / `prototype` sanitization;
- canonical numeric normalization;
- invalid-map town fallback;
- valid import canonical localStorage write;
- existing manual two-slot backup contract preservation;
- title import UI existence in the no-prior-save scenario.

## 4. CHECKPOINTS

- requirement registration: `7b2f2f77995912a6f66c7b2170d83461edcdb6a9`
- queue activation / REQ-059 blocker synchronization: `54d6f6d505c118eb3050d394b6fd8126aafd7c90`
- implementation: `b570a3363adda31017f3903b64341137a41c4c0a`
- dedicated acceptance: `e7254bd6882f40e50fcb911afa603f8b26e2896b`

## 5. VERIFICATION

GitHub Pages workflow run `34015168161`: SUCCESS.

Observed successful steps include:
- sequential JavaScript validation: PASS;
- collision-safe add-on validation: PASS;
- static regression guard: PASS;
- add-on contract guard: PASS;
- PWA/raster/Luke asset validation: PASS;
- assembled browser smoke: PASS;
- REQ-060 fail-closed smoke executed inside the assembled `?lqSmoke=1` build without runtime failure: PASS;
- 390x844 floating-touch + iPhone world visual-liveness regression: PASS;
- Pages upload: PASS;
- Pages deploy: PASS.

The public build therefore contains the SAVE TRANSFER add-on through the workflow's versioned-patch/add-on injection step.

Physical iPhone clipboard/paste feel remains `IOS_PHYSICAL_VERIFICATION=PENDING` and is not claimed from automation.

## 6. TEST REQUIREMENTS

1. export produces expected format/version and a non-empty portable code — PASS
2. round-trip encode/decode preserves representative story progress, map/position, stats and flags — PASS
3. Unicode-safe encoding/decoding works — PASS
4. fresh-browser title UI exposes import controls without an existing local save — PASS (assembled runtime acceptance)
5. valid import writes canonical autosave and yields playable state — PASS
6. malformed code rejects without state/save mutation — PASS
7. wrong format/version rejects — PASS
8. array/primitive state rejects — PASS
9. `__proto__`, `constructor`, `prototype` cannot pollute imported state/flags — PASS
10. invalid numeric fields normalize through current DEFAULT schema — PASS
11. invalid/removed map falls back safely — PASS
12. existing manual backup contract remains intact — PASS
13. assembled browser smoke — PASS
14. 390x844 touch/fullscreen regression — PASS
15. Pages deploy — PASS (`34015168161`)

## 7. COMPLETION CONDITION

Automated implementation, transfer round-trip safety, assembled browser regression and Pages publication are satisfied. Physical iPhone copy/paste feel remains pending, therefore STATUS is VERIFY rather than DONE.

## 8. DO NOT REPEAT / DO NOT FAKE

- Do not call manual slots "cross-browser"; they are localStorage-local.
- Do not require the destination browser to already have a save before IMPORT appears.
- Do not treat JSON parse success as valid state.
- Do not overwrite existing progress when validation fails.
- Do not claim cloud sync; this is explicit portable transfer, not server synchronization.
- Do not claim iPhone physical PASS from headless automation.
- Completing this requirement is a checkpoint, not a stop condition; run GATE C and continue when safe work remains.
