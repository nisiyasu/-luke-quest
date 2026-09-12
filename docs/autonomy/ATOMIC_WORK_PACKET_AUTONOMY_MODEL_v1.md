# ATOMIC WORK PACKET AUTONOMY MODEL v1

Document ID: LQ-AUTONOMY-ATOMIC-WORK-PACKET-V1-20260912
Status: CANONICAL REFERENCE / NOT A BTC IMPLEMENTATION AUTHORITY
Origin: LUKE QUEST autonomous-development redesign, 2026-09-12

## 0. Anti-drift invariant

Parent #12 must not carry a manually maintained duplicate `CURRENT_STAGE` / `CURRENT_PACKET` as execution authority. Parent #12 is a static program index and points to one machine-managed `WORK_PACKET_ROUTER:v1` comment. The router is the sole current-work pointer. Issue Sync projections may mirror that state for chat/control visibility, but they are projections rather than execution authority.

## 1. Why this exists

The previous LUKE QUEST operating pattern relied too heavily on one large boot/prompt plus a long-running model session to interpret the whole project, select the next action, implement it, verify it, and decide whether it was complete.

That approach can work for small/simple tasks, but it is structurally weak for complex software, games, and quantitative systems because:
- too many requirements compete for attention inside one session;
- current state changes while the original long prompt remains static;
- implementation, review, acceptance and project management collapse into one model judgment;
- partial progress can be mislabeled as completion;
- a green CI run or one screenshot can accidentally substitute for actual product quality;
- long sessions are hard to resume, audit, hand off between models, or roll back safely.

The corrective principle is:

> Do not require one model session to remain globally intelligent for the whole project. Break the project into bounded, evidence-backed units that can each be completed and verified independently, then connect those units with a router.

This is the Atomic Work Packet model.

## 2. Core architecture

### A. Canonical boot / architecture docs = constitution
Contain durable project-wide rules, safety boundaries, architecture constraints, branch policy and non-negotiable invariants. They are not the immediate task list.

### B. Parent Issue / Epic = index and routing surface
Holds the program identity and a pointer to the current execution router. It must not duplicate a manually maintained current-stage value that can drift.

### C. Work Packet Router = sole current-work pointer
One machine-managed record identifies exactly one `CURRENT_PACKET_ISSUE`.

The router decides *what is current*. It does not contain the detailed implementation prompt.

### D. Atomic Work Packet Issue = executable work contract
One Issue should represent one bounded outcome that an AI can reasonably implement, verify, repair and complete within a limited session/run.

Every packet carries:
- OBJECTIVE
- EXECUTION PROMPT
- DO / DO NOT constraints where useful
- ACCEPTANCE CHECKLIST
- EVIDENCE REQUIRED
- FAIL ROUTING
- NEXT_PACKET_ID
- STOP RULE

### E. Evidence = acceptance input
Commits, tests, browser/runtime evidence, screenshots, metrics, artifacts and comparisons determine completion. The model's narrative confidence does not.

### F. Review / adversarial gate = independent rejection function
Important gates should include a second pass whose role is to falsify tentative PASS labels and search for hidden objective defects.

### G. Scheduled Task = dispatcher, not giant brain
The scheduled launcher should stay short:
1. boot canonical rules;
2. read Parent/router fresh;
3. load the single current packet;
4. execute until acceptance or causal failure;
5. PASS -> advance router;
6. FAIL -> stay or route to earliest causal packet.

## 3. Why this resembles professional software development

This model maps naturally to established software-delivery concepts:

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

The important point is not the names. The important point is that complex work is decomposed into independently testable, reviewable and resumable units.

## 4. Packet sizing rule

A packet is too large if it asks the executor to redesign multiple unrelated subsystems, hold many acceptance domains in mind at once, or rely on a long uninterrupted session.

A packet is too small if it only encodes a mechanical micro-edit with no meaningful independently testable outcome.

Preferred size:

> One coherent outcome that can be implemented -> verified -> repaired -> accepted without requiring the executor to solve the whole project simultaneously.

## 5. Completion rule

A packet does not complete because one run ended, one commit exists, CI is green, one screenshot exists, or the model says the direction improved.

A packet completes only when every mandatory acceptance condition and evidence requirement is satisfied.

If it fails:
- same root cause -> continue the same packet;
- different/root upstream cause -> route to the earliest causal packet;
- do not hide upstream failure as downstream polish.

## 6. State ownership and anti-drift rule

There must be one execution pointer.

For LUKE QUEST:
- Parent #12 is the program index;
- Parent #12 comment `WORK_PACKET_ROUTER:v1` is the sole current-packet authority;
- current packet Issue is the immediate execution authority;
- stage Issues preserve broader stage rules;
- Issue Sync projection is a chat/control projection, not the execution source of truth.

Do not manually duplicate `CURRENT_PACKET` across multiple authoritative surfaces. Other surfaces should link to or project from the router.

## 7. Giant-prompt anti-pattern

Search/retrieval key: `GIANT_PROMPT_ANTI_PATTERN`

A giant prompt is useful as a specification or constitution, but should not itself be the complete execution plan for a complex system.

Bad pattern:
`giant specification -> model interprets everything -> model self-selects work -> model self-accepts completion`

Preferred pattern:
`canonical rules -> router -> atomic packet -> evidence -> acceptance/reject -> router transition`

## 8. LUKE QUEST result

Search/retrieval key: `LUKE_QUEST_ATOMIC_PACKET_TRANSFORMATION`

On 2026-09-12 LUKE QUEST was converted from broad M00-M12 long-session execution toward 25 bounded Atomic Work Packet Issues (#26-#50).

The redesign was motivated by visible quality failures that survived previous technical PASS claims, including bridge/world continuity and evidence-quality problems.

The key change was not merely 'more detailed prompts'. It was moving the detailed prompt, completion line and failure routing into the specific Issue that owns the work.

## 9. BTC Whale Edge Engine application candidate

Search/retrieval keys:
- `BTC_ATOMIC_WORK_PACKET_MAPPING`
- `BTC_PROMOTION_GATE_PACKET_MODEL`
- `QUANT_ATOMIC_EXECUTION`

This section is a preserved application candidate only. It does NOT alter or supersede the BTC repository, 360/369 plan, current design, Promotion Gate, or Owner decisions.

For a quant system, giant instructions such as 'build a profitable strategy' are especially unsafe because implementation correctness, statistical validity, execution realism and live-risk approval are different domains.

A future BTC conversion should map the existing lifecycle / Promotion Gate into bounded packets such as:
1. Hypothesis definition packet
2. Data-quality packet
3. Feature implementation packet
4. IS experiment packet
5. Robustness / multiple-testing packet
6. OOS packet
7. Walk-forward packet
8. Execution realism packet
9. Risk / safety packet
10. Paper-trading packet
11. Live-promotion packet

Important separation:

> Implementing a feature and proving that feature has trading value must be different packets.

Likewise:

> Passing IS must not imply OOS/WF/Paper/Live approval.

This matches the existing Promotion Gate philosophy and can make the 360/369 program more executable by AI without requiring one model session to hold the entire quant lifecycle in working context.

## 10. Why this helps multi-model handoff

Atomic packets make model substitution safer. The next executor does not need the full conversational history. It needs canonical rules, the router/current packet, packet inputs/evidence, and current code/data state.

## 11. Retrieval contract

If Owner later asks things like:
- 'LUKE QUESTで見つけた自律開発方式は？'
- '長いプロンプトをやめた話'
- 'Issueごとに完成条件を持たせるやつ'
- 'プロ開発みたいなWork Packet方式'
- 'BTCならどう当てはめると言ってた？'

retrieve/search this document by one of:
- `ATOMIC_WORK_PACKET_AUTONOMY_MODEL`
- `GIANT_PROMPT_ANTI_PATTERN`
- `LUKE_QUEST_ATOMIC_PACKET_TRANSFORMATION`
- `BTC_ATOMIC_WORK_PACKET_MAPPING`
- `QUANT_ATOMIC_EXECUTION`

Retrieval must prefer this GitHub document over reconstructing the operating model from chat memory. If a later project-specific adoption supersedes it, the newer project authority must be cited explicitly.

## 12. Adoption boundary

LUKE QUEST: model is actively adopted through #26-#50 and Parent #12 router.

BTC Whale Edge Engine: preserved as an application candidate only. A BTC-specific fresh-state review and explicit adoption decision are required before changing its canonical workflow, issues, Promotion Gate or 360/369 plan.
