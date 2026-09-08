# REQ-140 — iPhone Compositor Black-Screen Recovery

## PRIORITY
P0 / OWNER DIRECT

## STATUS
VERIFY

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

## SAVE RESCUE
The same recovery lineage also provides a fail-safe `lukeQuestV2` rescue surface:
- standalone PWA can copy/export the existing save without mutating it;
- a fresh Safari context opened with `?save-rescue=1` can accept pasted JSON or a readable file;
- restore validates the save shape before writing, verifies `localStorage` after writing, and only then reloads;
- malformed input does not overwrite the current save.

## ACCEPTANCE
- JS syntax / Pages build PASS.
- Public build includes the recovery addon.
- Existing P0 touch/fullscreen regression remains PASS.
- Render-liveness remains PASS.
- No duplicate pointer/touch/action handlers introduced.
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner tests the deployed iPhone PWA.

## MACHINE / PUBLIC VERIFICATION
- P0 Touch Diagnostic run `34220306982`: SUCCESS on implementation checkpoint `e72d795b7a0012387339a75dd5ead4a58c1923d2`.
- GitHub Pages run `34220399635`: SUCCESS on descendant metadata checkpoint `f834907e4292b7ae58e3306a149d9b3e7ddef43f`; runtime files are unchanged from the P0-gated implementation lineage.
- Render Liveness run `34220399555`: SUCCESS on `f834907e4292b7ae58e3306a149d9b3e7ddef43f`, including Chromium and WebKit iPhone-sized world capture/pixel classification.
- `IOS_PHYSICAL_VERIFICATION=PENDING`.

## NON-GOALS
- Do not redesign gameplay.
- Do not remove fullscreen UI.
- Do not claim root cause proven solely from CI.
- Do not claim iPhone physical PASS from automation.
