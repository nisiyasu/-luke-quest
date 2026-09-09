# REQ-147 — Battle UX Restore / In-Battle Victory Dismiss Flow

- ID: `REQ-147`
- PRIORITY: `P0 / OWNER_DIRECT`
- STATUS: `READY`
- CREATED_AT: `2026-09-09 JST`
- TYPE: `BATTLE_UX / IPHONE / VICTORY_FLOW`
- EXECUTION_NOW: `NO — queue immediately after REQ-146`

## 1. OWNER DIRECT REQUEST

Owner reported three concrete physical-play UX problems:

1. Restore the battle UI toward its initial/useful layout because `集中斬り` currently requires scrolling to reach and is inconvenient.
2. Display `VICTORY` over the battle screen. Current behavior returns to the map first and shows victory on top of the world, which is wrong.
3. When the VICTORY display is dismissed, dismiss/consume Luke's post-battle comment at the same time. Requiring a second separate close action is inconvenient.

These are direct player-experience corrections, not optional polish.

## 2. BATTLE COMMAND LAYOUT

On iPhone portrait:

- primary battle commands, including `集中斬り`, must be discoverable without vertical scrolling;
- restore the earlier useful command density/layout rather than compressing the scene in a way that hides core actions;
- retain touch target safety and avoid horizontal overflow;
- do not regress REQ-134/135/136 battle touch/log behavior.

## 3. VICTORY PRESENTATION ORDER

Victory presentation must be ordered as:

`battle remains visible -> VICTORY/result overlay -> dismiss -> battle cleanup -> world`

Do not transition to `world` before the victory/result presentation is dismissed.

Preserve canonical `win()` as the sole reward/progression authority. Do not create a second reward path or duplicate EXP, gold, drop or level-up mutation.

REQ-137 reward summary and REQ-138 level-up summary semantics must remain correct and exactly-once.

## 4. LUKE POST-BATTLE COMMENT

The battle-end Luke comment must not require an additional standalone dismissal after VICTORY.

Acceptable implementation shapes include:

- include the Luke comment inside the same victory/result overlay and consume both with one dismiss; or
- preserve the existing generated comment internally but clear/consume it atomically when the victory overlay is dismissed.

There must be no stale world dialogue left behind after the single result-dismiss interaction.

## 5. ACCEPTANCE EVIDENCE

Before claiming implementation complete:

1. At an iPhone portrait viewport, `集中斬り` is visible/selectable without scrolling the battle command region.
2. A successful canonical battle victory leaves the battle scene visibly present behind the VICTORY/result overlay.
3. One result-dismiss action removes both VICTORY and Luke's post-battle comment and transitions cleanly to world.
4. There is no second post-battle dialogue requiring another tap solely to close Luke's comment.
5. EXP / gold / drops / level-up rewards occur exactly once.
6. Escape, defeat and non-victory battle cleanup remain unchanged unless necessary for a shared safety fix.
7. Browser regression, Pages workflow and public build inclusion pass.
8. `IOS_PHYSICAL_VERIFICATION` remains `PENDING` until Owner verifies on a real iPhone.

## 6. QUEUE ORDER

REQ-147 is the second new Owner-direct P0. Execute it immediately after REQ-146 and before resuming the pre-existing REQ-145 Gold challenger lane.

This registration checkpoint does **not** implement the battle changes. It records the Owner request in canonical repository-managed work so it cannot be lost between autonomous sessions.
