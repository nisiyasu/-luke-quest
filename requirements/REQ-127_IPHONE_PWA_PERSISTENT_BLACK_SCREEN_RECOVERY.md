# REQ-127 — iPhone PWA Persistent Black Screen Recovery

PRIORITY: P0
STATUS: IN_PROGRESS
OWNER_EVIDENCE: 2026-09-07 iPhone Home Screen PWA remains black after rollback to a known-working ~04:00 JST code point; audio later disappeared; foreground resume briefly flashes the top HUD before returning black.

## Problem
The public LUKE QUEST iPhone Home Screen PWA can present a persistent black screen even when the DOM/game state appears alive. Existing automated checks validate DOM geometry and runtime markers but do not prove that pixels are actually painted.

## Fresh incident facts
- Owner reports the game was working on-device until roughly 04:00 JST.
- main was rolled back to commit `9e6cb5732aff2c98b4008f2019615769495fc9c6` (2026-09-07 03:56:57 JST) and Pages deployment succeeded, but the device symptom did not change.
- Emergency service-worker purge/unregister commit `c989f545a07096a894f67184aa6d3c93c69e3e5a` was deployed successfully.
- Owner symptom before that purge: black world, then no audio, with top HUD briefly visible on app foreground/resume before black returns.
- Therefore code-after-04:00 alone is not a sufficient explanation. PWA/WebKit/cache/compositor state remains plausible.

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

## Checkpoints
- `c989f545a07096a894f67184aa6d3c93c69e3e5a`: deployed emergency service-worker cache purge + unregister; Pages SUCCESS.
- `ddb925f8f0cc71e9367772415e2af9f738f2a780`: added dependency-free PNG rendered-pixel black-screen checker.
- `bf51dd2a531a0cd0b7dccc67542819f783ceefbc`: added dedicated 390x844 render-liveness workflow using assembled Pages injection order, real Chromium screenshot, pixel metrics, and retained diagnostic artifact.
- This checkpoint intentionally triggers the newly added diagnostic workflow on a subsequent push so its measured result can be inspected before further speculative gameplay rollback.

## Completion conditions
- Automated rendered-pixel diagnostic exists and has run on the public-build assembly path.
- Result is recorded as PASS/FAIL with measured evidence.
- If automated render FAILS, repair until PASS before normal feature work resumes.
- If automated render PASSES while Owner iPhone remains black, narrow incident to iPhone/PWA/WebKit-specific path and ship safe runtime diagnostics/recovery without falsifying physical verification.
- Pages deployment remains successful.
- WORK_QUEUE.md and CURRENT.md reflect this P0 incident and recovery state.
- IOS_PHYSICAL_VERIFICATION remains PENDING until Owner confirms the actual device no longer goes black.
