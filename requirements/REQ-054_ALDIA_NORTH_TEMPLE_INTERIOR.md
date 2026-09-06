# REQ-054 — Aldia North Temple Interior

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: WORLD / BUILDING-INTERIOR / CANON-CONSISTENCY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive explicitly requires a temple/building interior. Fresh canonical world audit found that Aldia already contains two direct temple references:

- the traveling elder warns: `北の神殿には近づきすぎるなよ。最近、偉い人ほど笑顔が怖い。`
- the existing `神殿の見習い` says the crystal behaved strangely and mentions Eleanor.

However there is no walkable Aldia temple interior in the current MAPS/add-on inventory. The setting exists in dialogue but not as a playable place.

This requirement materializes that already-established place without revealing protected truth, adding new story decisions, changing gates, or inventing rewards.

## REQUIRED BEHAVIOR

1. Add a clearly visible and reachable `北の神殿` entrance in Aldia town.
2. Enter via canonical world Action from an adjacent reachable tile.
3. Add a compact walkable interior map with:
   - safe floor/walls/exit;
   - one temple attendant NPC;
   - one crystal/altar interaction matching the already-established crystal reference;
   - one quiet side-prop interaction for environmental storytelling.
4. Dialogue may reinforce existing mystery but must not reveal the King/Eleanor truth or future protected plot.
5. No reward, stat increase, healing, shop function, quest completion, or new mandatory gate in this requirement.
6. Exit safely back to Aldia near the entrance without collision trapping.
7. Touch tap Action and keyboard/canonical `action()` must share the same interaction path; do not add a separate touch handler.
8. Register the interior in `LQ_BUILDING_INTERIORS` and expose a small status contract for regression testing.
9. Do not conflict with existing civilian home/castle/inn/town add-ons or existing NPC coordinates.

## ACCEPTANCE

- temple map exists and is walkable;
- town entrance coordinate is reachable and unique;
- canonical Action enters the temple;
- attendant + crystal/altar + side prop exist and are interactable;
- protected canon is unchanged and no reward is introduced;
- exit returns to a safe town coordinate;
- building-interior/status contract is exposed;
- assembled browser + 390x844 touch/world regression + Pages remain green.

## DO NOT REPEAT

- do not invent a second temple if a canonical interior later appears during fresh recovery;
- do not reveal protected plot truth;
- do not add a healing/reward loop merely because this is a temple;
- do not create a separate input system;
- do not claim physical iPhone PASS from automation.
