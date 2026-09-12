# LUKE QUEST Modern 3D — Atomic Work Packet Contract v1

## Purpose
Turn autonomous development into bounded executable work instead of asking one long session to interpret the entire program.

## Core rule
One Work Packet Issue = one concrete outcome + explicit acceptance conditions + required evidence + failure routing.

A packet is intentionally small enough for a focused autonomous session. If it cannot be completed in one run, keep the same packet open and record the exact next action; never silently advance.

## Required Issue fields
Every Work Packet Issue contains:
1. PACKET_ID and parent stage.
2. OBJECTIVE — one concrete outcome.
3. EXECUTION PROMPT — direct imperative instructions.
4. Bounded DO / DO NOT rules where useful.
5. ACCEPTANCE CHECKLIST — every item must pass before close.
6. EVIDENCE REQUIRED — exact runtime/screenshot/test/commit evidence.
7. FAIL ROUTING — where to continue or return.
8. NEXT_PACKET_ID.
9. STOP RULE — missing evidence or partial improvement is not completion.

## Global execution rules
- Parent #12 is the router/index, not the detailed implementation prompt.
- Original M00–M12 Issues remain stage containers and durable stage authority.
- The `CURRENT_PACKET_ISSUE` selected by Parent #12 is the only immediate autonomous execution prompt.
- Canonical boot and Parent Stage authority still apply for safety, branch reality, continuity and no-fake-completion.
- Fresh exact-HEAD evidence beats historical PASS labels.
- CI SUCCESS, screenshot existence, or 'directionally improved' never substitutes for packet acceptance evidence.
- Objective visual defects are repaired autonomously; Owner is not the defect detector.
- `MINIMUM_QUALITY_LINE.png` is a hard floor; `TARGET_PS1_FINAL.png` is final visual authority.
- Closed historical packets may be reopened when a later gate routes a causal defect back to them.

## Execution loop
Parent #12 -> `WORK_PACKET_ROUTER:v1` -> CURRENT_PACKET Issue -> execute -> verify acceptance checklist.

- PASS: record evidence, close packet, move router to NEXT_PACKET_ID.
- FAIL same cause: keep packet open and continue exact next action.
- FAIL due to another causal subsystem: route to earliest causal packet/stage and update Parent #12 router.

## Anti-loop
If the same material gap survives two evidence-backed attempts with only minor improvement, change approach or reclassify the causal packet/stage instead of repeating tiny parameter nudges.