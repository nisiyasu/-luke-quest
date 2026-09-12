# ATOMIC WORK PACKET AUTONOMY MODEL v1

Document ID: LQ-AUTONOMY-ATOMIC-WORK-PACKET-V1-20260912
Status: CANONICAL REFERENCE / NOT A BTC IMPLEMENTATION AUTHORITY
Origin: LUKE QUEST autonomous-development redesign, 2026-09-12
Preservation state: COMPLETE

## 0. Anti-drift invariant

Parent #12 must not carry a manually maintained duplicate `CURRENT_STAGE` / `CURRENT_PACKET` as execution authority. Parent #12 is a static program index and points to one machine-managed `WORK_PACKET_ROUTER:v1` comment. The router is the sole current-work pointer. Issue Sync projections may mirror that state for chat/control visibility, but they are projections rather than execution authority.

## 1. Why this exists

The previous LUKE QUEST operating pattern relied too heavily on one large boot/prompt plus a long-running model session to interpret the whole project, select the next action, implement it, verify it, and decide whether it was complete.

That approach can work for small/simple tasks, but it is structurally weak for complex software, games, and quantitative systems because too many requirements compete for attention, state changes while the prompt remains static, and implementation/review/acceptance/project-management collapse into one model judgment.

The corrective principle is:

> Do not require one model session to remain globally intelligent for the whole project. Break the project into bounded, evidence-backed units that can each be completed and verified independently, then connect those units with a router.

## 2. Core architecture

- Canonical boot / architecture docs = constitution.
- Parent Issue / Epic = static program index and router entrypoint.
- Work Packet Router = sole current-work pointer.
- Atomic Work Packet Issue = bounded executable work contract.
- Evidence = acceptance input.
- Adversarial gate = independent rejection function.
- Scheduled Task = dispatcher, not giant brain.

Every packet carries:
- OBJECTIVE
- EXECUTION PROMPT
- DO / DO NOT constraints where useful
- ACCEPTANCE CHECKLIST
- EVIDENCE REQUIRED
- FAIL ROUTING
- NEXT_PACKET_ID
- STOP RULE

## 3. Professional software-development correspondence

| Atomic model | Professional analogue |
|---|---|
| Parent Issue | Epic / program increment |
| Work Packet | Story / task / ticket |
| Acceptance Checklist | Acceptance Criteria / Definition of Done |
| Required Evidence | Tests / QA evidence / telemetry |
| Fail Routing | Defect triage / root-cause routing |
| Router | Work queue / project manager / scheduler |
| Adversarial rejector | Code review / QA / release gate |
| Canonical boot | Architecture standards / engineering handbook |

## 4. Packet sizing rule

Preferred size:

> One coherent outcome that can be implemented -> verified -> repaired -> accepted without requiring the executor to solve the whole project simultaneously.

## 5. Completion rule

A packet does not complete because one run ended, one commit exists, CI is green, one screenshot exists, or the model says the direction improved.

A packet completes only when every mandatory acceptance condition and evidence requirement is satisfied.

If it fails:
- same root cause -> continue the same packet;
- upstream/different root cause -> route to the earliest causal packet;
- never hide upstream failure as downstream polish.

## 6. State ownership

For LUKE QUEST:
- Parent #12 = program index;
- Parent #12 `WORK_PACKET_ROUTER:v1` comment = sole current-packet authority;
- current packet Issue = immediate execution authority;
- stage Issues = broader stage authority;
- Issue Sync projection = chat/control projection only.

Do not manually duplicate `CURRENT_PACKET` across authoritative surfaces.

## 7. Giant-prompt anti-pattern

Search key: `GIANT_PROMPT_ANTI_PATTERN`

Bad:
`giant specification -> model interprets everything -> model self-selects work -> model self-accepts completion`

Preferred:
`canonical rules -> router -> atomic packet -> evidence -> acceptance/reject -> router transition`

## 8. LUKE QUEST transformation

Search key: `LUKE_QUEST_ATOMIC_PACKET_TRANSFORMATION`

On 2026-09-12 LUKE QUEST was converted from broad M00-M12 long-session execution toward 25 bounded Atomic Work Packet Issues (#26-#50).

The key change was not merely more detailed prompts. The detailed prompt, completion line, evidence contract and failure routing moved into the Issue that owns the work.

## 9. BTC Whale Edge Engine application candidate

Search keys:
- `BTC_ATOMIC_WORK_PACKET_MAPPING`
- `BTC_PROMOTION_GATE_PACKET_MODEL`
- `QUANT_ATOMIC_EXECUTION`

This is preservation only. It does NOT alter or supersede the BTC repository, 360/369 plan, current design, Promotion Gate or Owner decisions.

A future BTC conversion should map the lifecycle into bounded packets such as:
1. Hypothesis definition
2. Data quality
3. Feature implementation
4. IS experiment
5. Robustness / multiple testing
6. OOS
7. Walk-forward
8. Execution realism
9. Risk / safety
10. Paper trading
11. Live promotion

Critical separation:

> Implementing a feature and proving that feature has trading value must be different packets.

> Passing IS must not imply OOS/WF/Paper/Live approval.

This is compatible with the existing Promotion Gate philosophy and can make the 360/369 program more executable by AI without requiring one session to hold the whole quant lifecycle in working context.

## 10. Multi-model handoff

The next executor should need only canonical rules, router/current packet, packet inputs/evidence and current code/data state, not the full chat history.

## 11. Retrieval contract

If Owner later asks:
- LUKE QUESTで見つけた自律開発方式
- 長いプロンプトをやめた話
- Issueごとに完成条件を持たせるやつ
- プロ開発みたいなWork Packet方式
- BTCならどう当てはめると言ってたか

search/retrieve this document using:
- `ATOMIC_WORK_PACKET_AUTONOMY_MODEL`
- `GIANT_PROMPT_ANTI_PATTERN`
- `LUKE_QUEST_ATOMIC_PACKET_TRANSFORMATION`
- `BTC_ATOMIC_WORK_PACKET_MAPPING`
- `QUANT_ATOMIC_EXECUTION`

Retrieval should prefer this GitHub document over reconstructing the design from chat memory.

## 12. Adoption boundary

LUKE QUEST: actively adopted through #26-#50 and Parent #12 router.

BTC Whale Edge Engine: application candidate only. BTC-specific fresh-state review and explicit adoption are required before changing its canonical workflow, issues, Promotion Gate or 360/369 plan.
