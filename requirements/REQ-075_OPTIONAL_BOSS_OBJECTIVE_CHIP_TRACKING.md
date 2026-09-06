# REQ-075 — Optional Boss Objective Chip Tracking

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / HUD / OPTIONAL-BOSS / SPOILER-SAFE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh post-REQ-074 audit found that the pause-menu ADVENTURE JOURNAL now tracks the discovered optional boss correctly, but the compact world `SIDE` objective chip still tracks only Elder Charm, Forest Bounty and Forest Herb Sample.

That creates inconsistent guidance: after the player discovers the giant hoofprints, the journal knows what to do next but the world HUD does not.

## 1. REQUIRED BEHAVIOR

- Never reveal the optional boss objective before `forestMiniBossWarned`.
- When `forestMiniBossWarned && !forestMiniBossDefeated`, the world SIDE chip must guide the player to investigate the giant hoofprints again.
- After `forestMiniBossDefeated`, the boss objective disappears from the world chip; completion remains available in journal/records.
- Preserve existing optional-chip precedence for already active Elder Charm, Forest Bounty and Herb Sample tasks. Do not unexpectedly replace a higher-existing active chip.
- Read-only projection only. Do not mutate flags, battle, reward, inventory, key items or story.
- Existing world input overlays, tap/drag, fullscreen and iPhone geometry must remain intact.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. no pre-discovery spoiler text;
2. warned/not-defeated state returns a clear repeat-investigation objective;
3. defeated state returns no boss chip;
4. original three optional chip families remain present and keep precedence;
5. projection does not mutate flags;
6. syntax/static/add-on contracts PASS;
7. assembled browser smoke PASS;
8. 390x844 touch/fullscreen visual-liveness PASS;
9. Pages deployment SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if any safe useful work remains.
