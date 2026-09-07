# REQ-127 — iPhone PWA Persistent Black Screen Recovery

PRIORITY: P0
STATUS: VERIFY
OWNER_EVIDENCE: 2026-09-07 iPhone Home Screen PWA remains black after rollback to a known-working ~04:00 JST code point; audio later disappeared; foreground resume briefly flashes the top HUD before returning black.

## Problem
The public LUKE QUEST iPhone Home Screen PWA can present a persistent black screen even when the DOM/game state appears alive. Existing automated checks validate DOM geometry and runtime markers but do not prove that pixels are actually painted.

## Fresh incident facts
- Owner reports the game was working on-device until roughly 04:00 JST.
- main was rolled back to commit `9e6cb5732aff2c98b4008f2019615769495fc9c6` (2026-09-07 03:56:57 JST) and Pages deployment succeeded, but the device symptom did not change.
- Emergency service-worker purge/unregister commit `c989f545a07096a894f67184aa6d3c93c69e3e5a` was deployed successfully.
- Owner symptom before that purge: black world, then no audio, with top HUD briefly visible on app foreground/resume before black returns.
- Therefore code-after-04:00 alone is not a sufficient explanation. PWA/WebKit/cache/compositor state remains plausible.
- Corrected Chromium 390x844 rendered-world evidence proves the assembled world actually paints outside the Owner iPhone PWA path.
- Public Pages assembly historically used stable external runtime script URLs (`ux-v*.js`, `addons/*.js`, prelude), so stale WebApp/HTTP asset caching remains a concrete recovery target even after source rollback.
- Playwright WebKit 26.0 now also proves the assembled world paints through a Safari-family WebKit engine at 390x844 with no page errors and valid shell/world/player geometry.
- Remaining uncertainty is narrowed to the physical iPhone Home Screen PWA container / persisted client state. Machine-verifiable recovery work is complete; physical verification remains Owner-only.

## Requirements
1. Preserve current known-good gameplay logic while diagnosing.
2. Add an automated 390x844 rendered-pixel liveness check, not just DOM/geometry checks.
3. The diagnostic must launch the assembled game with the same ordered patch/add-on injection used by Pages.
4. Capture a real screenshot after world smoke startup.
5. Analyze PNG pixels and report dark/near-black ratio and basic color diversity using repository-owned code with no external package dependency.
6. Fail diagnostic CI if the screenshot is effectively black or near-uniform dark output.
7. Preserve screenshot artifact or equivalent evidence when practical.
8. Add runtime diagnostics for iPhone-only follow-up if automated Chromium remains visually healthy: uncaught error/unhandled rejection capture, computed world/player geometry, visibility/opacity, and topmost elements at viewport center.
9. Do not claim physical iPhone PASS from Chromium or CI.
10. Do not restore rolled-back post-04:00 feature commits until black-screen root cause is isolated.
11. Public recovery deployment must version runtime script URLs by build SHA so an installed PWA cannot silently reuse a prior runtime asset solely because its path is unchanged.
12. Black-screen startup diagnostics must use a dedicated REQ-127 world mode rather than global `lqSmoke=1`, because the latter intentionally executes many historical subsystem smoke tests and is not a clean production-like error baseline.
13. A Safari-family WebKit engine must execute the same deterministic 390x844 world proof and rendered-pixel liveness gate before REQ-127 may leave IN_PROGRESS.
14. Emergency Service Worker recovery must purge CacheStorage, perform a one-shot versioned client navigation to bypass a stale Home Screen document, avoid navigation loops, and unregister itself without a persistent fetch handler.

## Checkpoints
- `c989f545a07096a894f67184aa6d3c93c69e3e5a`: deployed emergency service-worker cache purge + unregister; Pages SUCCESS.
- `ddb925f8f0cc71e9367772415e2af9f738f2a780`: added dependency-free PNG rendered-pixel black-screen checker.
- `bf51dd2a531a0cd0b7dccc67542819f783ceefbc`: added dedicated 390x844 render-liveness workflow using assembled Pages injection order, real Chromium screenshot, pixel metrics, and retained diagnostic artifact.
- `ef184888e647f6e897c5cf49b092339b50fbfb27`: corrected false-positive title capture by requiring proven `world` state before pixel PASS.
- Render run `34066818698`: SUCCESS with real 390x844 world pixels; near-black ratio `0.264698`, bright ratio `0.624803`, mean luminance `87.353`, quantized color bins `634`.
- `79b0cae02055027ef6bac1dca23df4f266d8093a`: added runtime diagnostics for errors/rejections, world/player geometry, center-stack occluders, lifecycle/resume, visual viewport and service-worker state.
- `971c57b6edac4f20a7dc45c3b1b0971e3773edc3`: aligned the diagnostic addon with the repository IIFE contract after Pages correctly failed closed on the initial formatting mismatch.
- `6c9fff529569633d9cf33f7d45fb214a33eb7c6d`: added isolated `lqReq127RenderSmoke=1` deterministic world mode so black-screen diagnostics no longer trigger every historical `lqSmoke=1` test at once.
- `16590c9711a3d91f1bd75da0ae73528faf4f40f8`: switched the dedicated render diagnostic to clean world mode and build-SHA-versioned runtime URLs.
- Render run `34070096956`: SUCCESS on the clean REQ-127 world path with diagnostics and pixel gate enabled.
- `b40204e6ff6cb0b71c999d3053c043978e13e5a2`: added a post-Pages recovery deployment that reassembles the exact successful source with build-SHA-versioned prelude/patch/addon URLs, reruns the clean 390x844 world pixel gate, then deploys that immutable-URL artifact.
- Failed one-shot cache-bust workflow was not an implementation failure: GitHub Actions token was denied permission to update workflow files. It is superseded by the connector-authored recovery workflow and must not be retried as the recovery mechanism.
- `af1056f04cc41c4f53af0b412a92c1793a2ea9eb`: added a Playwright WebKit 390x844 world-state/screenshot diagnostic.
- `8522119ed2b7f241858fc0540597a1d82b8ec7a4`: promoted WebKit world proof and pixel analysis into the required render-liveness workflow.
- `66beaa16272e353f039164028e8de9b34c185528`: hardened the emergency Service Worker to purge cache, force a one-shot `?lqPwaRecovery=20260907-r2` navigation for existing same-scope clients, then unregister with no fetch handler.
- Standard Pages run `34072962526`: SUCCESS on `66beaa16272e353f039164028e8de9b34c185528`.
- Cache-busted recovery run `34073013636`: SUCCESS on the same source commit.
- Render run `34072962506`: SUCCESS. Chromium metrics: near-black `0.265555`, bright `0.629679`, mean luminance `87.889`, color bins `626`. WebKit metrics: near-black `0.259062`, bright `0.643335`, mean luminance `90.467`, color bins `621`. WebKit proved `screen=world`, `map=town`, 288 tiles, visible non-zero shell/world/player geometry, and no page errors. Evidence artifact ID `10001098641` retained for 14 days.

## Completion conditions
- Automated rendered-pixel diagnostic exists and has run on the public-build assembly path. PASS.
- Result is recorded as PASS/FAIL with measured evidence. PASS.
- If automated render FAILS, repair until PASS before normal feature work resumes. PASS on both Chromium and WebKit.
- If automated render PASSES while Owner iPhone remains black, narrow incident to iPhone/PWA/WebKit-specific path and ship safe runtime diagnostics/recovery without falsifying physical verification. PASS; physical iPhone Home Screen container remains the only unverified boundary.
- A cache-busted recovery artifact is deployed successfully after the normal Pages workflow, with all runtime JS URLs versioned by the exact build SHA. PASS.
- Pages deployment remains successful. PASS.
- WORK_QUEUE.md and CURRENT.md reflect this P0 incident and recovery state. Pending synchronization checkpoint in this transition to VERIFY.
- IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms the actual device no longer goes black.
