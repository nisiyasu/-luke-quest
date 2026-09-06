# REQ-127 — iPhone Black Screen Autonomous Detection & Recovery

STATUS: IN_PROGRESS
PRIORITY: P0
OWNER_PRIORITY: ABSOLUTE_CURRENT
CREATED_AT: 2026-09-07T08:20:00+09:00

## OWNER REPORT

- iPhone Home Screen PWA opens to a black screen.
- Earlier during the incident audio could still play while the world was black.
- After later recovery attempts even audio stopped.
- Returning from another app can briefly show the top HUD, then the screen becomes black again.
- Owner explicitly requires this incident to be the highest-priority queue item and to be fixed autonomously, without requiring repeated manual visual confirmation for every iteration.

## OBJECTIVE

Restore LUKE QUEST to a visibly playable public state on iPhone and permanently close the verification gap that allowed browser/CI gates to pass while the Owner could still see a black screen.

## REQUIRED EXECUTION

1. Treat this requirement as WIP=1 and higher priority than every READY item.
2. Preserve the current incident recovery branch/history. Do not destroy post-baseline work.
3. Continue autonomous diagnosis and repair until all machine-verifiable completion gates pass.
4. Do not declare iPhone physical PASS without Owner evidence. Machine verification and Owner physical verification must remain distinct.
5. Minimize blind rollbacks. Prefer evidence-producing diagnostics.

## AUTONOMOUS DIAGNOSTIC GATES

The public-build/browser test path must capture at minimum:

- startup JavaScript `error` events;
- `unhandledrejection` events;
- current screen/map state when available;
- existence and computed visibility of `#app`, `.gameShell`, `.world`, `.tile`, `.player`;
- element bounding rectangles and non-zero geometry;
- `document.elementsFromPoint()` at viewport center to identify opaque full-screen occluders;
- page/background -> foreground resume behavior;
- Service Worker registration/controller state where available;
- screenshot of the rendered world at iPhone portrait dimensions;
- image-level black/near-black coverage check sufficient to fail CI when the gameplay viewport is effectively black.

## RECOVERY POLICY

- If Service Worker/cache corruption is suspected, use a reversible network-first/no-cache or unregister/purge recovery path.
- If DOM is alive but presentation becomes black, identify the topmost covering/composited layer before applying broad style changes.
- If WebKit-specific composition is implicated, isolate costly visual features one subsystem at a time: backdrop filters, ambient layer, tile depth filters/isolation, large transformed layers.
- Any emergency safe mode must be presentation-only and must not mutate save, progression, collision, combat, or canonical input authority.

## REQUIRED CI / AUTOMATION HARDENING

Add an automated iPhone-sized visual-liveness gate that does more than DOM-presence assertions. It must:

1. launch the assembled public build at an iPhone portrait viewport;
2. reach a deterministic world state;
3. save a screenshot artifact;
4. assert that the world/gameplay region is not effectively black/blank;
5. exercise at least one visibility/background-resume cycle when supported;
6. fail with useful diagnostics instead of only `PASS/FAIL`.

## ACCEPTANCE CRITERIA

Machine-verifiable completion requires all of the following:

- public Pages deployment SUCCESS;
- assembled browser startup PASS;
- no uncaught startup errors / unhandled rejections in the deterministic test path;
- deterministic world exists with visible tiles and player geometry;
- screenshot-based visual-liveness gate PASS at iPhone portrait size;
- resume/visibility regression gate PASS where the test runner supports it;
- Service Worker/cache state is deterministic and cannot silently serve an obsolete broken shell;
- no gameplay/save/input regression in existing required gates;
- CURRENT.md records exact commit, Pages run, diagnostics, remaining physical-verification status.

Physical completion remains:

`IOS_PHYSICAL_VERIFICATION=PENDING`

until the Owner actually confirms the public iPhone build is visibly restored.

## INCIDENT BASELINE

- Owner reports the game was still working around 04:00 JST on 2026-09-07.
- `9e6cb5732aff2c98b4008f2019615769495fc9c6` at 03:56:57 JST was used as a recovery baseline.
- Restoring that baseline and successfully deploying Pages did not visibly fix the Owner's Home Screen PWA.
- Therefore the incident cannot currently be attributed solely to post-03:56:57 repository changes.
- A Service Worker purge/unregister hotfix was started at `c989f545a07096a894f67184aa6d3c93c69e3e5a`; this is not yet proof of root cause or physical recovery.

## DO NOT

- do not mark DONE merely because Pages/CI succeeds;
- do not repeatedly ask the Owner to test after every speculative micro-change;
- do not overwrite or delete the preserved incident branch;
- do not re-enable unrelated feature work until the black-screen incident is machine-stable enough to resume safely.
