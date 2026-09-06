# REQ-091 — iPhone Field UI Occlusion / Safe Player Visibility / Controller Transparency Fix

STATUS: IN_PROGRESS
PRIORITY: P0
TYPE: UI / LAYOUT / TOUCH / MOBILE REGRESSION
OWNER_REQUEST: DIRECT_OWNER_HOT_INSERT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. OWNER PHYSICAL DEFECT EVIDENCE

OwnerのiPhone実機スクリーンショットと直接報告を最優先の物理証拠として扱う。

Owner報告:

- 画面上部がメニュー/UI同士で重なっている。
- フィールドとHUD/UIが被っており、キャラクターが画面上部へ移動するとUIの裏へ入り見えなくなる。
- Dynamic Touch Controllerが濃すぎるため、もっと半透明にする。

既存REQ-021 / REQ-022 / REQ-001がVERIFYでも、この新しいOwner実機証拠を理由に本件をP0で再修正する。自動テストの過去PASSを物理証拠より優先しない。

## 1. REQUIRED REPAIR

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

## 2. MUST PRESERVE

- REQ-021: short tap → canonical `action()` exactly once。
- drag / long-hold drag → movement。
- drag release → Actionを発火しない。
- REQ-001: pointerId、dead zone、pointercancel、blur、visibilitychange、dialogue/battle/map transition、DOM rerender cleanup、中央`stopMoving()`。
- REQ-022: viewport-primary 100dvh world + floating overlays。
- REQ-034: black-world repair、明示world geometry、transparent controls plane、visual-liveness gate。
- safe-area対応。
- save/canon/story/battle semantics。

## 3. REQUIRED IMPLEMENTATION AUDIT

fresh HEADから最低限以下を確認してから修正する。

- `addons/zzzz-iphone-fullscreen-world-ui.js`
- `addons/floating-touch-controller.js`
- `addons/zzz-floating-touch-smoke.js`
- `.github/workflows/pages.yml`
- relevant rendered HUD/menu/music markup/CSS

重複した第三のlayout/controller systemを新設せず、既存authorityを修正する。

## 4. AUTOMATED ACCEPTANCE

390x844相当のiPhone portrait assembled browserで最低限次をfail-closed確認する。

- [ ] top HUD / auxiliary top UIの重要矩形が互いに不正に重ならない。
- [ ] top HUD / auxiliary controlsがsafe viewport内にある。
- [ ] playerを北端/画面上側へ寄せたケースでplayer rectが主要HUDの遮蔽領域に埋没しない。
- [ ] playerがviewport内で視認可能。
- [ ] controller neutral visualが従来より明確に低opacity。
- [ ] active directionはneutralより識別しやすい。
- [ ] controller hit area / movement behaviorは不変。
- [ ] tap vs drag PASS。
- [ ] pointerup / pointercancel / blur / visibility / dialogue / battle / map transition cleanup PASS。
- [ ] controls plane remains transparent。
- [ ] world geometry / painted tiles / player geometry visual-liveness PASS。
- [ ] objective / MENU / A / dialogueとの重大な衝突なし。
- [ ] JavaScript syntax / assembled browser regression PASS。
- [ ] Pages build/deploy SUCCESS。

## 5. COMPLETION RULE

コード変更だけ、CIの一部PASSだけ、またはCURRENT更新だけでは完了にしない。

IMPLEMENTATION_COMPLETEに必要:

1. implementation committed
2. relevant automated acceptance PASS
3. 390x844 touch/fullscreen visual-liveness PASS
4. Pages SUCCESS
5. public build inclusion confirmed
6. WORK_QUEUE/CURRENT synchronized

Owner実機確認は自動でPASSにしない。

`IOS_PHYSICAL_VERIFICATION = PENDING` を維持し、Ownerが公開版を物理確認した時だけ更新する。

## 6. QUEUE / PREEMPTION

このREQは最新Owner直接要望のP0 hot insert。

- WORK_QUEUEへORDER 0として登録する。
- lower-priority IN_PROGRESSがあれば安全にcheckpoint/suspendしてpreemptする。
- REQ-059のBLOCKEDは本件を止めない。
- 登録だけで終了しない。直ちに実装へ進む。

## 7. NO-STOP

REQ-091の実装、commit、Pages SUCCESS、VERIFY化は実行終了条件ではない。

完了後はfresh HEAD → GATE C → 次の安全な仕事へ進む。
