# REQ-060 — Cross-Browser Save Transfer

STATUS: IN_PROGRESS
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

Use a versioned transfer envelope such as:

```json
{
  "format": "LUKE_QUEST_SAVE_TRANSFER",
  "version": 1,
  "createdAt": "ISO timestamp",
  "state": { "...": "sanitized game state" }
}
```

Transport encoding may be URL-safe base64 over UTF-8 JSON or an equivalently copy-safe text representation.

Reuse the existing manual-backup safety contract where possible:
- plain-object validation;
- dangerous-key sanitization;
- canonical numeric-field normalization;
- legacy/default migration;
- invalid-map safe fallback.

Do not import arbitrary object prototypes, arrays, malformed JSON, invalid transfer envelopes, unsupported versions, or dangerous keys.

## 3. UI REQUIREMENTS

### Title screen

The import path MUST be available in a completely fresh browser where `lukeQuestV2` and manual slots do not exist.

Provide a compact `SAVE TRANSFER` area with:
- paste/input area;
- IMPORT button;
- clear success/error feedback.

Do not hide transfer import merely because no local save exists.

### World / pause menu

Provide an export path with:
- `COPY SAVE CODE` or equivalent;
- fallback selectable text if clipboard access is unavailable/denied;
- concise explanation that the code can be pasted into another browser/device.

An import path may also be exposed from pause/menu if it remains safe and compact.

## 4. IMPORT SAFETY

Import must:
- reject malformed/empty payloads without mutating `s` or localStorage;
- reject wrong format/version;
- sanitize dangerous keys before merge;
- normalize canonical numeric fields using current DEFAULT contract;
- merge flags conservatively;
- reset volatile UI/combat presentation state to a safe world/title continuation state;
- fall back to safe town coordinates if imported map is unavailable;
- stop movement before applying imported state;
- call canonical `save()` after successful application;
- preserve backward compatibility with current saves and manual slots.

Do not silently delete existing local progress on invalid import.

## 5. EXPORT SAFETY

Export current playable progress, not transient UI/battle garbage.

At minimum remove/reset volatile fields consistent with existing manual `snapshot()` behavior:
- pause/menu open state;
- shop open state;
- transient victory/defeat result;
- active dialogue if necessary for stable transfer;
- screen should resume safely;
- include `createdAt` / saved timestamp.

Do not include secrets or account credentials. LUKE QUEST currently has no account credential requirement for this transfer.

## 6. TEST REQUIREMENTS

Fail closed with automated acceptance covering at least:

1. export produces expected format/version and a non-empty portable code;
2. round-trip encode/decode preserves representative story progress, map/position, stats and flags;
3. Unicode-safe encoding/decoding works;
4. fresh-browser title UI exposes import controls without an existing local save;
5. valid import writes canonical autosave and yields playable state;
6. malformed code rejects without state/save mutation;
7. wrong format/version rejects;
8. array/primitive state rejects;
9. `__proto__`, `constructor`, `prototype` cannot pollute imported state/flags;
10. invalid numeric fields normalize through current DEFAULT schema;
11. invalid/removed map falls back safely;
12. existing manual backup contract remains intact;
13. assembled browser smoke PASS;
14. 390x844 touch/fullscreen regression PASS;
15. Pages deploy SUCCESS.

## 7. COMPLETION CONDITION

Automated implementation is complete only when:
- transfer UI is in the assembled public build;
- valid cross-browser code round-trip is proven by browser/runtime acceptance;
- invalid payloads fail closed;
- existing save/manual-backup behavior remains intact;
- Pages succeeds.

Physical iPhone copy/paste feel remains `IOS_PHYSICAL_VERIFICATION=PENDING` until genuinely observed.

## 8. DO NOT REPEAT / DO NOT FAKE

- Do not call manual slots "cross-browser"; they are localStorage-local.
- Do not require the destination browser to already have a save before IMPORT appears.
- Do not treat JSON parse success as valid state.
- Do not overwrite existing progress when validation fails.
- Do not claim cloud sync; this is explicit portable transfer, not server synchronization.
- Do not claim iPhone physical PASS from headless automation.
- Completing this requirement is a checkpoint, not a stop condition; run GATE C and continue when safe work remains.
