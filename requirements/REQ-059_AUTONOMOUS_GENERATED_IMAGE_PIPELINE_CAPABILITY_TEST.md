# REQ-059 — Autonomous Generated Image Pipeline Capability Test

STATUS: READY
PRIORITY: P0
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
MODE: CAPABILITY_TEST / IMPLEMENTATION_IF_PROVEN / CONTINUE_AFTER_RESULT

## 0. OWNER DIRECTIVE

This is the newest direct Owner request and MUST preempt lower-priority autonomous work under the repository authority rules.

Owner intent:

> AI内部で画像生成し、その生成画像をLUKE QUESTへ自律的に組み込めるかを最優先で実地検証する。
> 結果はこのファイルへ証拠付きで記載する。
> 成功・失敗・BLOCKEDのどの場合でも、この検証結果を記録したことを理由に実行を止めない。
> まだ安全に実行可能な仕事があるならGATE Cに従い次の仕事へ進み続ける。

## 0.1 ID COLLISION REPAIR

This Owner P0 was originally registered as `REQ-058` by direct hot insert. Before the next autonomous boot completed, the ongoing autonomous loop independently allocated `REQ-058` to `Accessory Equipment Foundation`, implemented it, published it, and synchronized queue/CURRENT around that ID.

Fresh boot detected two distinct requirement files carrying the same logical ID. To preserve already-published accessory history without rewriting its implementation lineage, this Owner P0 is repair-forward renumbered to `REQ-059`. The original Owner intent, priority and required result semantics are unchanged. The duplicate old filename is to be removed after this repaired copy is committed.

## 1. IMMEDIATE QUEUE CONTROL

At the next fresh boot/recovery:

1. Fresh-fetch actual default branch, HEAD, WORK_MANAGER.md, WORK_QUEUE.md, CURRENT.md, AUTONOMOUS_DEV_DIRECTIVE.md and EXECUTION_SELF_AUDIT_GUARD.md.
2. If another lower-priority requirement is IN_PROGRESS, safely checkpoint/suspend/advance it according to WIP_LIMIT=1 and Owner-P0 preemption rules.
3. Register REQ-059 in WORK_QUEUE.md as the highest current executable Owner P0 item if it is not already present.
4. Move REQ-059 to IN_PROGRESS before the capability experiment.
5. Do not delete or lose any existing queue item while inserting this P0.

The act of registering this requirement in the queue is itself part of the acceptance evidence. If the system cannot safely promote this hot insert, record that fact here as a process defect and repair the queue-control mechanism before proceeding when safe.

## 2. QUESTION TO PROVE, NOT ASSUME

Determine by execution, not speculation, whether the current autonomous Scheduled Task / ChatGPT execution environment can perform the complete chain:

1. Generate a new raster image with the available image-generation capability.
2. Obtain or otherwise transport the generated image bytes in the same run or through a durable handoff available to the autonomous system.
3. Store the raster asset in GitHub as a real binary asset, preferably WebP or PNG, under an appropriate LUKE QUEST asset path.
4. Wire that asset into a safe, isolated game presentation surface.
5. Verify the asset loads in the assembled application and does not break existing iPhone/fullscreen/touch behavior.
6. Commit and deploy through the normal Pages pipeline when repository policy permits.

Do NOT mark this PASS merely because image generation exists in ChatGPT, because GitHub accepts base64 blobs, because another repository succeeded historically, or because an SVG can be generated. The end-to-end raster path must be exercised in this environment.

## 3. REFERENCE SUCCESS CASE TO INVESTIGATE

Use `nisiyasu/-` as a historical reference only. Freshly inspect the relevant evidence before relying on it.

Known historical patterns to verify:

- Base64 WebP chunks stored in JS such as `assets/runtime/home_00.js` through `home_05.js`, accumulated into `window.__LCC_HOME`, then converted by `assets-init.js` via `data:image/webp;base64,...`.
- Later direct raster assets under `assets/images/`, including WebP files.
- Historical commits around `42314f31...`, `3ee42fa0...`, `2150eb1f...`, and `e63be103...` may contain useful evidence, but fresh repository evidence outranks this note.

The historical repository proves that raster transport/integration has existed somewhere in the Owner's projects. It does NOT by itself prove that the current Scheduled Task runtime can access generated-image bytes.

## 4. PREFERRED TRANSPORT ORDER

Test the smallest, cleanest safe path first.

### PATH A — DIRECT BINARY / GIT BLOB

Preferred if the current run can access generated-image bytes:

image generation
→ generated file/bytes
→ base64 encoding if required
→ GitHub blob creation with binary-safe/base64 transport
→ tree entry under LUKE QUEST assets
→ commit
→ runtime wiring
→ acceptance

### PATH B — HISTORICAL BASE64 CHUNK FALLBACK

If direct binary commit is unavailable but the generated image bytes/base64 are accessible, reproduce the proven historical transport pattern safely:

image bytes
→ base64
→ bounded text chunks
→ JS/runtime reconstruction
→ `data:image/webp;base64,...` or equivalent
→ acceptance

Do not use PATH B if the generated-image bytes themselves are unavailable. Fabricating placeholder base64 or substituting an SVG is not a PASS.

## 5. SAFE TEST ASSET

Do not overwrite Owner-approved Luke art or other canonical assets merely to test capability.

Prefer a clearly isolated test asset and presentation surface, for example:

`assets/images/generated-pipeline-probe-REQ-059.webp`

or an equivalent non-destructive path.

The test image should be visibly identifiable as a LUKE QUEST pipeline probe but must not alter protected story canon, progression, saves, combat balance, or Owner-approved final art.

After capability is proven, either keep the probe only if useful/documented or remove its player-visible wiring safely while preserving the evidence required by this requirement.

## 6. REQUIRED RESULT RECORD IN THIS FILE

Before advancing REQ-059 to VERIFY/DONE/BLOCKED, append/update a `RESULT` section in THIS FILE containing at minimum:

- RESULT: PASS / PARTIAL / FAIL / BLOCKED
- tested HEAD SHA
- execution timestamp in Asia/Tokyo
- image-generation step: PASS/FAIL and evidence
- generated-byte/file acquisition: PASS/FAIL and evidence
- GitHub transport method actually used
- resulting asset path, if any
- resulting blob/file SHA or equivalent identity evidence, if available
- code/wiring commit SHA(s), if any
- acceptance/test results
- Pages run/result, if applicable
- whether the raster asset was visibly loaded by the assembled app
- exact blocker/root cause if incomplete
- whether PATH A or PATH B was used
- next repair/action if not fully proven

No vague completion language. Separate observed facts from inference.

## 7. IF IMAGE GENERATION TOOL IS NOT AVAILABLE TO THE SCHEDULED RUN

Do not stop the whole autonomous development loop.

Record exactly:

- which capability/tool was unavailable,
- whether byte/file acquisition or generation itself was the missing link,
- what parts of the transport chain were independently proven,
- the smallest architecture change needed to make it autonomous.

Then mark only REQ-059 as BLOCKED/PARTIAL as appropriate, synchronize queue/CURRENT, and continue another safe independent requirement under GATE C.

## 8. SUCCESS CONSEQUENCE

If and only if the full raster end-to-end path is proven, use the result to unblock/formalize autonomous art production for existing Owner requests such as:

- REQ-004 Leon formal dialogue/full-body art
- REQ-005 Glen formal dialogue/full-body art

Do not automatically claim those two requests DONE just because the pipeline probe succeeds. They remain separate art/quality requirements and must be executed and verified against their own acceptance criteria.

## 9. CONTINUE / NO-STOP RULE

Completing this capability test is a checkpoint, NOT a termination condition.

After recording the result in this file:

1. fresh-fetch HEAD,
2. synchronize WORK_QUEUE/CURRENT as needed,
3. run GATE C,
4. if any safe useful executable work remains, select it and continue.

Forbidden stop reasons include:

- "REQ-059 finished"
- "result recorded"
- "image generated"
- "asset committed"
- "Pages succeeded"
- "pipeline is blocked"
- "Owner can now review"

Only the repository's explicit stop conditions may end execution.

## 10. ACCEPTANCE

REQ-059 is not considered fully proven until all of the following observed facts are recorded in this file:

- [ ] generated raster image created by the autonomous execution environment
- [ ] generated raster bytes/file acquired by that execution environment
- [ ] binary-safe transport to GitHub succeeded
- [ ] real raster asset exists in LUKE QUEST repository
- [ ] application wiring loads that exact asset
- [ ] regression/assembled acceptance passes
- [ ] Pages result recorded if applicable
- [ ] RESULT section written with evidence
- [ ] execution continued through GATE C after the result checkpoint when safe work remained

## RESULT

RESULT: PENDING_EXECUTION

This section MUST be replaced/extended by the autonomous executor with observed evidence from the actual capability test.
