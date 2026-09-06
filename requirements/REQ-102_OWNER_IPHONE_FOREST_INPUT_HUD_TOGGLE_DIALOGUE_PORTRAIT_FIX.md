# REQ-102 — Owner iPhone Forest Input / HUD Toggle / Dialogue Portrait Fix

STATUS: VERIFY
PRIORITY: P0
ORDER: 0
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
MODE: PLAYER_VISIBLE_BUGFIX_AND_ASSET_INTEGRATION
IOS_PHYSICAL_VERIFICATION: PENDING

## OWNER EVIDENCE

Owner public iPhone screenshot / physical play report on 2026-09-06 identified four current player-visible defects/requests. Treat the physical report as authoritative over prior VERIFY claims.

## 1. P0 BUG — 魔物の森で移動できない

Owner report: `魔物の森動けない`.

Freshly reproduce and diagnose on the public-build-equivalent assembled runtime before claiming a fix.

Required investigation includes, at minimum:

- current map/location state for 魔物の森 / forest entry/depth aliases
- unified world touch surface
- tap-vs-drag arbitration
- Dynamic Touch pointerdown / pointermove / pointerup lifecycle
- dead zone
- pointerId ownership
- movement timer / canonical movement path
- collision / canWalk / spawn tile validity
- overlay or transparent element intercepting pointer events
- dialogue/objective/HUD/menu layers accidentally blocking world input
- render/DOM reconstruction and listener survival
- map transition cleanup
- any regression introduced by recent iPhone HUD/camera work

Acceptance:

- player can move normally in 魔物の森 on iPhone portrait equivalent
- drag enters Movement mode and continues while held
- direction can change while held
- pointerup/cancel/blur/visibilitychange stops immediately
- tap still invokes canonical Action exactly once when appropriate
- no stuck movement
- no movement loss after render or map transition
- collision remains correct
- public Pages build contains the fix

Do not work around the bug by disabling collision, widening walkable terrain globally, or bypassing canonical movement/input authority.

## 2. P0 BUG — 上部表示の重なりがまだ直っていない

Prior REQ-092 automated PASS is not sufficient. Owner physical screenshot shows the top overlays still visibly collide/overlap.

Freshly re-audit the actual current public layout, including:

- status HUD
- location label
- objective bar
- MUSIC toggle
- victory/record indicator
- any top shell/navigation residue
- iOS safe-area-inset-top
- Safari / in-app dynamic viewport

Required result:

- no visual overlap between top UI elements on iPhone portrait
- critical player/world content remains visible below/around overlays
- do not restore the old vertical stacked layout
- do not reserve a huge fixed top region
- preserve fullscreen-world intent
- preserve 100dvh / viewport-fit=cover / safe-area behavior
- black-screen regression must not return

Owner screenshot is authoritative evidence that REQ-092 remains physically incomplete for this aspect.

## 3. P0 UX — 上部表示をタップでON/OFFできるようにする

Owner cannot see the upper field adequately because the top HUD occupies too much of the world view.

Add a clear, touch-friendly HUD visibility toggle associated with the upper display.

Required behavior:

- user can tap the top HUD/toggle affordance to collapse/hide the nonessential upper information overlay
- user can tap again to restore it
- essential mode/interaction safety must remain available
- toggle must not trigger canonical world Action behind it
- toggle must not begin Dynamic Touch movement
- collapsed state should materially restore visible world area, not merely reduce opacity by a tiny amount
- expanded state must retain safe-area handling and no overlap
- dialogue, battle, menu, shop and other modal layers must remain usable
- choose sensible persistence only if it does not create stale/broken layout; document the choice in the requirement result

Prefer a compact collapse/expand control and avoid adding another large permanent UI block.

## 4. P0 VISUAL — アップロード済み画像の顔部分を会話ポートレートへ採用

Owner has already uploaded the intended image into repository assets. Do NOT generate a new image for this request.

Canonical source asset discovered from fresh GitHub history:

`assets/images/03334052-E944-4DE4-9C61-48F011193E46.png`

Source commit:

`77c9764256d7d13cba23268be7f8f558eed51fca` (`Add files via upload`)

Required work:

- inspect this exact uploaded source image
- identify the intended character face region from the source image itself
- crop/extract an appropriate face portrait for dialogue presentation
- preserve the original source asset
- create a derived dialogue portrait asset with a stable descriptive path/name if binary tooling permits
- otherwise use a robust crop presentation from the original asset only if it is visually equivalent and does not distort the source
- replace the current speaking-face portrait for the intended character with this Owner-provided face
- do not replace field sprite unless separately required
- do not invent or generate a substitute asset
- keep aspect ratio and avoid stretching
- verify portrait is crisp and correctly framed on iPhone

If character identity cannot be determined safely from current dialogue/asset wiring, inspect existing portrait registry and current speaking portrait references first. Do not guess blindly. Use code/reference context to map the Owner-provided asset to the portrait being replaced.

## REGRESSION PROTECTION

Must preserve:

- REQ-021 Tap Anywhere canonical Action
- REQ-001 Dynamic Touch Controller
- REQ-022 fullscreen world
- REQ-034 black-screen repair
- REQ-092 camera zoom-out / safe player visibility improvements that are actually working
- dialogue progression
- save compatibility
- map transitions
- battle/menu/shop input exclusion

## MANDATORY TEST / ACCEPTANCE

At minimum run public-build-equivalent assembled tests at iPhone portrait approximately 390x844 and relevant runtime/browser regressions.

Verify all of the following:

1. 魔物の森で実際に上下左右へ移動できる
2. tap vs drag remains correct
3. pointerup/cancel/blur/visibilitychange stops movement
4. no overlay intercept prevents forest movement
5. top HUD elements do not overlap
6. top HUD can be collapsed and restored by touch
7. HUD toggle does not leak world Action or movement
8. collapsed HUD materially increases visible upper-world area
9. player remains visible near north/top map edges
10. dialogue uses the Owner-uploaded face crop from `assets/images/03334052-E944-4DE4-9C61-48F011193E46.png`
11. portrait is not stretched or badly framed
12. world visual-liveness PASS
13. assembled browser regression PASS
14. relevant touch/fullscreen regression PASS
15. Pages workflow SUCCESS
16. public-build inclusion verified

Automated tests must not mark Owner physical verification as complete.

`IOS_PHYSICAL_VERIFICATION = PENDING` until Owner confirms on the actual iPhone.

## QUEUE / EXECUTION INSTRUCTION

This is the newest direct Owner P0 hot insert and therefore outranks older general priority/order, including VERIFY items and blocked REQ-059.

If a lower-priority IN_PROGRESS item exists, safely checkpoint/suspend/advance it according to WORK_MANAGER authority before switching.

Registration is not implementation completion. The next autonomous execution must select this requirement first, implement it, test it, deploy it, then continue the normal persistent autonomous work loop rather than stopping after this REQ.

## IMPLEMENTATION RESULT — 2026-09-06

- Root cause of the apparent forest movement lock was the field -> forest canonical spawn at `(11,18)`, directly below blocked tree tile `(11,17)`. The Owner naturally dragged north toward the displayed north objective, but the first north move was collision-blocked, making the entrance feel immobile.
- Preserved the canonical forest collision map and shifted only the transition spawn one passable tile right to `(12,18)`, where the immediate north tile `(12,17)` is open.
- Re-stacked mobile top overlays so the status card uses the available width, location chips reserve room for the compact HUD toggle, MUSIC moves to its own row position, and objective width reserves the MUSIC area instead of colliding with it.
- Added compact `HUD ▲ / HUD ▼` touch toggle. Collapsed mode fully hides the status/location/objective/MUSIC overlays and restores upper-world visibility. Toggle is a real button with `data-lq-no-global-action`, so unified world tap/drag authority excludes it.
- Routed Luke dialogue portrait presentation to Owner source `assets/images/03334052-E944-4DE4-9C61-48F011193E46.png` and applies non-stretched `object-fit: cover` face framing. Original source is preserved; no generated substitute was created. Final subjective face framing remains Owner iPhone visual verification PENDING.
- Added fail-closed assembled runtime smoke covering the forest north lane, canonical collision preservation, HUD toggle cycle/exclusion, Owner portrait route and no-generated-substitute invariant.

### CHECKPOINTS

- implementation: `58f56708cc493e2d176fc283ea6850b995a30510`
- regression gate: `d3318687ae8e7a50421a08eab47467ed68baedcd`
- Pages workflow: run `34039338259` SUCCESS

### AUTOMATED VERIFICATION

- JavaScript/add-on syntax: PASS
- static regression guard: PASS
- add-on contract guard: PASS
- assembled browser game smoke: PASS
- 390x844 floating touch + fullscreen visual liveness smoke: PASS
- REQ-102 fail-closed runtime guard within the 390x844 path: PASS
- REQ-081 north cliff regression: PASS
- REQ-082 encounter regression: PASS
- Pages upload/deploy: PASS

### REMAINING OWNER CHECK

`IOS_PHYSICAL_VERIFICATION = PENDING`

Verify on the actual iPhone that forest movement feels normal in all four directions, expanded top UI no longer overlaps, HUD collapse/restore is comfortable, and the Owner-provided Luke face crop is framed as intended.