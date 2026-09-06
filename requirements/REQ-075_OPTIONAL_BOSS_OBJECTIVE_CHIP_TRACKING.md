# REQ-075 — Optional Boss Objective Chip Tracking

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / HUD / OPTIONAL-BOSS / SPOILER-SAFE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh post-REQ-074 audit found that the pause-menu ADVENTURE JOURNAL tracks the discovered optional boss correctly, but the compact world `SIDE` objective chip tracked only Elder Charm, Forest Bounty and Forest Herb Sample.

That created inconsistent guidance: after the player discovered the giant hoofprints, the journal knew what to do next but the world HUD did not.

## 1. REQUIRED BEHAVIOR

- Never reveal the optional boss objective before `forestMiniBossWarned`.
- When `forestMiniBossWarned && !forestMiniBossDefeated`, the world SIDE chip guides the player to investigate the giant hoofprints again.
- After `forestMiniBossDefeated`, the boss objective disappears from the world chip; completion remains available in journal/records.
- Existing optional-chip precedence for Elder Charm, Forest Bounty and Herb Sample remains unchanged.
- Read-only projection only. No flags, battle, reward, inventory, key items or story are mutated.
- Existing world input overlays, tap/drag, fullscreen and iPhone geometry remain intact.

## 2. ACCEPTANCE

Automated acceptance proves:
1. no pre-discovery spoiler text;
2. warned/not-defeated state returns a clear repeat-investigation objective;
3. defeated state returns no boss chip;
4. original three optional chip families remain present and keep precedence;
5. projection does not mutate flags;
6. syntax/static/add-on contracts PASS;
7. assembled browser smoke PASS;
8. 390x844 touch/fullscreen visual-liveness PASS;
9. Pages deployment SUCCESS.

## 3. IMPLEMENTATION / VERIFICATION EVIDENCE

- `addons/optional-objective-chip.js` now treats the discovered optional boss as the fourth tracked SIDE family, after the three existing families so their precedence is preserved.
- The new projection is exactly `forestMiniBossWarned && !forestMiniBossDefeated` and displays `魔物の森・入口で巨大な蹄跡をもう一度調べる`.
- After `forestMiniBossDefeated`, the optional boss contributes no active world chip.
- `window.LQ_OPTIONAL_OBJECTIVE_TEST.optionalText` exposes the pure read-only projection for regression tests.
- `window.LQ_OPTIONAL_OBJECTIVE_STATUS` now declares `forestMiniBoss` and `spoilerSafe:true`.
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-optional-boss-chip-smoke.js` participates in the assembled `?lqSmoke=1` browser run. It checks spoiler safety, discovered objective, defeated cleanup, original-family precedence, state non-mutation and status contract, then restores original test state.
- Checkpoints:
  - `3bf6b5a3d44c4ee844de64c22220cbe4c7f307bf` — register REQ-075.
  - `94d97b3025a0431220df4fa8e033a7c87db4b74a` — implement world SIDE chip tracking.
  - `a30923836c839bf0ae34f112704d145d447f1544` — assembled-browser regression gate.
- GitHub Pages workflow run `34019286555`: SUCCESS. Sequential/add-on syntax, static regression, add-on contract, assembled browser smoke, 390x844 floating-touch/fullscreen visual-liveness, upload and Pages deployment all succeeded.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device PASS is claimed.

## 4. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if any safe useful work remains.
