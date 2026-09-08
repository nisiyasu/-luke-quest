# REQ-140 — iPhone Compositor Black-Screen Recovery

## PRIORITY
P0 / OWNER DIRECT

## STATUS
IN_PROGRESS

## OWNER OBSERVED FAILURE
On physical iPhone PWA / Home Screen launch, the game can remain black. Earlier observations included audio continuing while pixels were black and HUD briefly flashing on app resume. Machine/Public CI has remained green, so physical iPhone verification is still authoritative for closure.

## FRESH ROOT-CAUSE EVIDENCE
Current production fullscreen world CSS contains a full-viewport `.gameShell` with `background:#000`, multiple `backdrop-filter` / `-webkit-backdrop-filter` surfaces, and a transformed world plane. The current render-liveness checks use lower compositor pressure than a physical DPR=3 iPhone. This makes an iOS WebKit compositor/backing-store failure a credible P0 candidate even when DOM/JS remain alive.

## IMPLEMENTATION INTENT
Apply a minimal, reversible iPhone-world compositor budget reduction without changing canonical gameplay, story, map coordinates, collision, save semantics, action ownership, or movement ownership.

Required recovery behavior on `body.lqWorldFullscreen`:
- disable backdrop blur surfaces in the world/fullscreen path;
- remove permanent `will-change` promotion from the large `.world` plane;
- disable character `filter:drop-shadow` compositor cost on this path;
- avoid pure-black fallback paint on the fullscreen shell so compositor failure is visually distinguishable from body/world background;
- remove stale `.lqIntroBackdrop` after leaving intro;
- preserve HUD, MENU, A, Dynamic Touch Controller, dialogue, tap-anywhere action, drag movement, safe-area layout, and 100dvh fullscreen behavior.

## ACCEPTANCE
- JS syntax / Pages build PASS.
- Public build includes the recovery addon.
- Existing P0 touch/fullscreen regression remains PASS.
- Render-liveness remains PASS.
- No duplicate pointer/touch/action handlers introduced.
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner tests the deployed iPhone PWA.

## NON-GOALS
- Do not redesign gameplay.
- Do not remove fullscreen UI.
- Do not claim root cause proven solely from CI.
- Do not claim iPhone physical PASS from automation.
