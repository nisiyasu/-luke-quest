# REQ-091 — iPhone Field UI Occlusion / Safe Player Visibility / Controller Transparency Fix

STATUS: SUPERSEDED
SUPERSEDED_BY: REQ-085
PRIORITY: P0
TYPE: UI / LAYOUT / TOUCH / MOBILE REGRESSION
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. SUPERSESSION / RECOVERY NOTE

This requirement was created concurrently while the Owner's newer combined request was being registered as `REQ-085_IPHONE_FIELD_UI_OCCLUSION_CAMERA_FRAMING.md`.

REQ-091 captured the first three Owner defects and produced valid implementation checkpoints for:

- top overlay compaction / non-overlap
- HUD-safe player visibility near the north edge
- lower-opacity Dynamic Touch Controller presentation

The Owner then explicitly added a fourth requirement: a modest field camera zoom-out so more surrounding terrain is visible. REQ-085 is therefore the complete and newer Owner-authority superset.

Do not delete or redo the valid REQ-091 implementation. Its committed work is reused as part of REQ-085 completion. Do not select REQ-091 independently again.

Implementation history reused by REQ-085 includes:

- `46e6fc97ec93209db0e2efcc7850910fbecf1f6d` — HUD occlusion / player safe visibility
- `995523d2036365035f5b16e33d6c8f54e9be2c59` and later opacity hardening — controller transparency
- `20c9016d8495c1c3eb7279d5a16606bd3ccb09ab` — compact top overlays / fallback controls
- `4a611a10352bc5d2a2f8138db0daf33929042cab` — north-edge player visibility
- Pages run `34031126525` — SUCCESS for the pre-zoom-out integrated state

## 1. ORIGINAL OWNER PHYSICAL DEFECT EVIDENCE

OwnerのiPhone実機スクリーンショットと直接報告を最優先の物理証拠として扱う。

Owner報告:

- 画面上部がメニュー/UI同士で重なっている。
- フィールドとHUD/UIが被っており、キャラクターが画面上部へ移動するとUIの裏へ入り見えなくなる。
- Dynamic Touch Controllerが濃すぎるため、もっと半透明にする。

既存REQ-021 / REQ-022 / REQ-001がVERIFYでも、この新しいOwner実機証拠を理由に本件をP0で再修正する。自動テストの過去PASSを物理証拠より優先しない。

## 2. REQUIRED REPAIR

### A. Top overlay non-overlap

iPhone portraitで上部のSTATUS/HUD、MUSIC、その他floating UIが互いに重ならず、文字・数値・操作要素が潰れないようにする。

- iOS safe-area / notchを考慮する。
- Safari dynamic viewport / visualViewport変化を考慮する。
- 既存100dvh fullscreen worldを維持する。
- この修正のために旧縦積みレイアウトや巨大な固定上部/下部専用枠を復活させない。
- MENU/A/quest/objective/dialogueなど既存overlayとの競合を確認する。

### B. Player safe visible region

worldを全画面化することと、playerをHUDの裏へ隠すことは別問題として扱う。

- playerがマップ上端方向へ移動しても、主要HUDの完全な裏側へ入り見失わない。
- camera recenter / clampとHUD safe zoneを統合して調整する。
- map座標、collision、story/save semanticsは変更しない。
- 小さいmapでも大きいmapでも既存camera clampを壊さない。
- playerだけでなく進行方向の最低限の視界も確保する。

### C. Dynamic Touch Controller transparency

Dynamic Touch Controllerを現在より明確に半透明化し、フィールド視認性を優先する。

- controllerの存在と4方向は認識可能にする。
- active directionはneutral状態より明瞭に見えるようにする。
- touch hit-area / dead-zone / pointer ownership / movement logicは変更しない。
- visual opacityのみを主として調整し、REQ-001の操作安全性を弱めない。
- idle/neutralはかなり薄く、active directionのみ必要十分な視認性を持たせてよい。

## 3. MUST PRESERVE

- REQ-021: short tap → canonical `action()` exactly once。
- drag / long-hold drag → movement。
- drag release → Actionを発火しない。
- REQ-001: pointerId、dead zone、pointercancel、blur、visibilitychange、dialogue/battle/map transition、DOM rerender cleanup、中央`stopMoving()`。
- REQ-022: viewport-primary 100dvh world + floating overlays。
- REQ-034: black-world repair、明示world geometry、transparent controls plane、visual-liveness gate。
- safe-area対応。
- save/canon/story/battle semantics。

## 4. REQUIRED IMPLEMENTATION AUDIT

fresh HEADから最低限以下を確認してから修正する。

- `addons/zzzz-iphone-fullscreen-world-ui.js`
- `addons/floating-touch-controller.js`
- `addons/zzz-floating-touch-smoke.js`
- `.github/workflows/pages.yml`
- relevant rendered HUD/menu/music markup/CSS

重複した第三のlayout/controller systemを新設せず、既存authorityを修正する。

## 5. AUTOMATED ACCEPTANCE

390x844相当のiPhone portrait assembled browserで最低限次をfail-closed確認する。

- [x] top HUD / auxiliary top UIの重要矩形が互いに不正に重ならない。
- [x] top HUD / auxiliary controlsがsafe viewport内にある。
- [x] playerを北端/画面上側へ寄せたケースでplayer rectが主要HUDの遮蔽領域に埋没しない。
- [x] playerがviewport内で視認可能。
- [x] controller neutral visualが従来より明確に低opacity。
- [x] active directionはneutralより識別しやすい。
- [x] controller hit area / movement behaviorは不変。
- [x] tap vs drag PASS。
- [x] pointerup / pointercancel / blur / visibility / dialogue / battle / map transition cleanup PASS。
- [x] controls plane remains transparent。
- [x] world geometry / painted tiles / player geometry visual-liveness PASS。
- [x] objective / MENU / A / dialogueとの重大な衝突なし。
- [x] JavaScript syntax / assembled browser regression PASS。
- [x] Pages build/deploy SUCCESS for the integrated pre-zoom-out state.

## 6. COMPLETION / PHYSICAL VERIFICATION BOUNDARY

REQ-091 is not independently completed or selected further because it is superseded by REQ-085. Its valid implementation is retained and integrated there.

Owner実機確認は自動でPASSにしない。

`IOS_PHYSICAL_VERIFICATION = PENDING`
