# LUKE QUEST CURRENT

- UPDATED_AT: `2026-09-08 20:22 JST`
- REPOSITORY: `nisiyasu/-luke-quest`
- ACTIVE_BRANCH: `main`
- LATEST_IMPLEMENTATION_COMMIT_SHA: `e72d795b7a0012387339a75dd5ead4a58c1923d2`
- LATEST_VERIFIED_RUNTIME_HEAD_SHA: `7f6b0936deb105dbf0dd34d2082ab7b7cc0cbc1c`
- LATEST_METADATA_COMMIT_SHA: `e72d795b7a0012387339a75dd5ead4a58c1923d2`
- PAGES_URL: https://nisiyasu.github.io/-luke-quest/
- CURRENT_BUILD_STATUS: `REQ-140 IN_PROGRESS. Prior REQ-140 implementation head 7f6b0936 has exact-head Pages + Render Liveness SUCCESS. New checkpoint e72d795b wires REQ-140 changes into the P0 Touch Diagnostic; exact-head P0/Pages/Render are currently running and must pass before promotion.`
- ACTIVE_REQUIREMENT_ID: `REQ-140`
- ACTIVE_REQUIREMENT_PATH: `requirements/REQ-140_IPHONE_COMPOSITOR_BLACK_SCREEN_RECOVERY.md`
- WORK_MANAGEMENT_MODE: `QUEUE_CONTROLLED / HEAD_FIRST_RECOVERY / WIP_LIMIT_1 / OWNER_DIRECT_P0_PREEMPTION`
- RECENT_CHECKPOINTS: `7f6b0936 add text/file save rescue import; 35b106ff standalone PWA save rescue export panel; 8a75077e reduce iPhone compositor pressure; cd726a3e register REQ-140; e72d795b include REQ-140 in P0 Touch gate.`
- TESTS_AND_VERIFICATION: `Fresh boot found CURRENT and WORK_QUEUE stale behind actual REQ-140 commits. Exact-head 7f6b0936 Pages 34219778689 SUCCESS and Render Liveness succeeded. P0 Touch had not run on REQ-140 paths, so e72d795b expanded p0-touch-diagnostic path coverage to the compositor recovery addon, save-rescue addon, and REQ-140 requirement. P0 Touch run 34220306982 is in progress. No iPhone physical PASS is claimed.`
- KNOWN_ISSUES: `Owner-reported physical iPhone standalone/PWA black-screen/compositor failure is the active P0 issue. Machine/public regression must remain green. REQ-021/022/001 and REQ-023 still require Owner physical iPhone confirmation. Chapter 2 remains intentionally undesigned.`
- BLOCKERS: `No machine-side hard blocker. REQ-140 final player-visible proof requires Owner physical iPhone verification after machine/public gates are green.`
- NEXT_ACTION: `Wait for exact-head e72d795b P0 Touch, Pages and Render Liveness results. If green, promote REQ-140 machine/public state to VERIFY, repair WORK_QUEUE to register REQ-140, refresh CURRENT, then continue safe audit/work while physical iPhone verification remains pending.`
- NEXT_ACTION_COMPLETION_CONDITION: `P0 Touch + Pages + Render Liveness all SUCCESS on the REQ-140 lineage, WORK_QUEUE/CURRENT match fresh HEAD reality, and no physical-iPhone claim is made without Owner evidence.`
- DO_NOT_REPEAT: `Do not trust pre-REQ-140 CURRENT as reality. Do not leave REQ-140 outside P0 touch regression coverage. Do not add duplicate tap handlers. Do not alter canonical action() for compositor/presentation work. Do not delete or overwrite save data without explicit validated restore. Do not claim physical iPhone black-screen recovery from headless CI.`

## SELF-AUDIT GUARD

- SELF_AUDIT_GUARD: `LOADED / APPLIED`
- BOOT_REALITY_AUDIT: `SELF_REPAIR — fresh HEAD was five commits ahead of stale CURRENT metadata and contained active P0 REQ-140.`
- OWNER_PRIORITY_AUDIT: `REQ-140 physical iPhone black-screen recovery is a newer Owner-direct P0 issue; existing REQ-021/022/001 protections remain mandatory regressions and are being re-audited through P0 Touch.`
- CONTINUE_GATE_LAST_RESULT: `CONTINUE — active safe work exists.`
- EXECUTION_DEGRADATION_STATUS: `NONE`
- PREEMPTED_REQUIREMENT: `NONE; REQ-140 is current owner-direct P0 work.`
- SELF_REPAIR_ACTIONS: `Recovered REQ-140 from fresh commits/requirement; reconnected its paths to P0 Touch Diagnostic; repaired CURRENT to fresh HEAD reality.`

## P0 INPUT / FULLSCREEN PROTECTION

- TOUCH_CONTROLLER_STATUS: `REQ-001 VERIFY / re-audit running on REQ-140 lineage`
- TOUCH_CONTROLLER_BEHAVIOR: `pointerId ownership; dead zone; short tap arbitration; live drag direction switching; central stopMoving cleanup; pointercancel/blur/pagehide/visibility/map/battle/dialogue safety; visualViewport clamp.`
- TOUCH_CONTROLLER_KNOWN_ISSUES: `No known machine regression before REQ-140. Exact-head P0 re-audit is running. IOS physical verification PENDING.`
- TOUCH_CONTROLLER_IOS_VERIFICATION: `PENDING`
- TAP_ANYWHERE_ACTION_STATUS: `REQ-021 VERIFY / canonical short tap -> action() exactly once; drag/cancel/stale release no Action; UI controls excluded; exact-head REQ-140 P0 re-audit running.`
- IPHONE_FULLSCREEN_UI_STATUS: `REQ-022 VERIFY / 100dvh + safe-area overlays + visualViewport-aware world framing; REQ-140 presentation changes are being regression-gated.`

## REQ-140 IPHONE COMPOSITOR BLACK-SCREEN RECOVERY

- STATUS: `IN_PROGRESS`
- OWNER_OBSERVED_FAILURE: `Physical iPhone standalone/PWA can render a black world surface while audio continues; HUD may flash briefly on resume.`
- IMPLEMENTATION: `Reduce large-layer compositor pressure in world/fullscreen mode: remove backdrop blur/filter pressure, permanent large-layer will-change, character drop shadows, pure-black shell fallback, and stale intro backdrop. Preserve world HUD/MENU/A/dialogue/dynamic controller/tap-anywhere/drag behavior.`
- SAVE_RESCUE: `Standalone PWA can export/copy lukeQuestV2. Fresh Safari context with ?save-rescue=1 accepts pasted JSON or a readable file, validates before writing, verifies localStorage after write, then reloads.`
- MACHINE_PUBLIC_STATUS: `7f6b0936 Pages + Render green; e72d795b P0/Pages/Render pending.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## REQ-023 NORTH EVACUATION GUIDANCE

- STATUS: `VERIFY`
- MACHINE_PUBLIC_STATUS: `PASS on current pre-REQ-140 lineage; generic exact-head workflow remains enabled.`
- CURRENT_BEHAVIOR: `Required withdrawProof target is visually guided; objective updates immediately after acquisition; next instruction directs player back to the north exit.`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## RECENT MOBILE / BATTLE UX LINEAGE

- REQ-134: `VERIFY — iPhone battle command layout/touch targets; machine/public PASS; physical PENDING.`
- REQ-135: `VERIFY — battle command touch/focus/disabled feedback; machine/public PASS; physical PENDING.`
- REQ-136: `VERIFY — latest battle-log follow + live semantics; machine/public PASS; physical PENDING.`
- REQ-137: `VERIFY — canonical post-victory dialogue includes defeated enemy + exact EXP/G once; physical PENDING.`
- REQ-138: `VERIFY — canonical level-up transition surfaced once as LV before→after; physical PENDING.`
- REQ-139: `VERIFY — world dialogue close hint says タップ / Aで閉じる while retaining canonical action() and zero new input handlers; physical PENDING.`

## STORY PROTECTION

- Chapter 1 approved canon and implementation remain protected.
- Chapter 2 is `NOT_DESIGNED`; do not invent continuation.
- Safe autonomous work may improve Chapter-1 gameplay, usability, presentation, robustness, accessibility, system depth, or visual quality without changing protected story facts.
