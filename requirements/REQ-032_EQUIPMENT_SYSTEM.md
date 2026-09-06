# REQ-032 — 既存武器・防具・装備システム正式監査

STATUS: VERIFY
PRIORITY: P1
TYPE: GAMEPLAY / EQUIPMENT / SAVE / UI / REGRESSION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## SELF-REPAIR NOTICE

本REQ登録時のinventory判断に誤りがあった。

当初は装備システムが未実装と判断したが、fresh commit/historyおよび実ファイルの再監査により、既に以下が実装済みであることを確認した。

- `ux-v31.js`: weapon / armor / DEF / shop purchase / equipment ownership
- `ux-v40.js`: 冒険メニューからの装備切替
- `addons/advanced-equipment.js`: Tier II weapon / armor / purchase / sell / equipment switching

したがって、別系統の新装備モデルを追加する方針は撤回した。
誤って追加した並行実装 `addons/zz-equipment-system.js` とその専用smokeは削除し、既存canonical equipment chainを正本として扱う。

この修正は機能の後退ではなく、二重state / 二重stat補正 / save incompatibilityを防ぐためのself-repairである。

## PURPOSE

既存の装備機能を新規再実装せず、fresh public build上で正式に監査・回帰固定する。

最低限、以下が一つのcanonical chainとして成立していることを確認する。

- weapon state
- armor state
- equipment ownership
- shop purchase
- equipment switching
- ATK bonus
- DEF bonus
- Tier II progression
- save persistence
- existing battle / MP skill / input compatibility

## CANONICAL STATE

既存実装を維持する。

- `s.weapon`
- `s.armor`
- `s.def`
- `s.equipmentOwned` (array)
- `s.atk`

別形式の `s.equipment.weapon` 等を並行導入しない。

## EXISTING EQUIPMENT FOUNDATION

### Base equipment
- `旅人の短剣` / weapon / ATK +0
- `旅人服` / armor / DEF +0

### Tier I shop upgrades
- `青銅の剣` / ATK +3
- `革の旅装` / DEF +2

### Tier II upgrades
- `鉄の剣` / ATK +6
- `補強革鎧` / DEF +4

既存価格、売却価格、shop semanticsをこの監査のために変更しない。

## STAT INTEGRATION

### Weapon
既存 `s.atk` をcanonical attack statとして維持する。
装備切替は旧bonusを除いて新bonusを加える差分方式で行われ、既存level-up由来のATKを失わないこと。

### Armor
既存 `s.def` をcanonical defense statとして維持する。
敵damageは既存DEF reduction semanticsへ接続されていること。

本監査のためにarmorを最大HP方式へ作り替えない。

## UI

既存UIを正本とする。

- shop panelで装備購入状態を確認可能
- adventure/pause menuのEQUIPMENT sectionからowned gearを切替可能
- Tier II equipmentも同じ装備chainへ接続
- equipped stateが視認可能

新しい別MENU/dialogue equipment UIを並行追加しない。

## SAVE SAFETY

- existing `lukeQuestV2` save keyを変更しない
- old saveで `def / weapon / armor / equipmentOwned` が欠ける場合の既存初期化を維持
- save後にcurrent weapon / armor / ownership / ATK / DEFが保持される
- equipment切替を繰り返してbonusが増殖しない

## WRAPPER SAFETY

既存の:
- battle
- attack
- enemyTurn
- MP / 蒼閃
- level-up
- enemy drop
- shop
- pause/menu
- fullscreen UI
- Tap Anywhere Action
- Dynamic Touch Controller

を破壊しない。

## TEST REQUIREMENTS

1. fresh runtimeで `s.weapon / s.armor / s.def / s.equipmentOwned` が有効
2. canonical equipment statusがweapon/armor/DEF/shopを示す
3. Tier I `青銅の剣` をowned状態から装備するとATKが基礎値+3
4. `旅人の短剣`へ戻すとATKが正確に元へ戻る
5. Tier II `鉄の剣` 装備でATKが基礎値+6
6. Tier I `革の旅装` 装備でDEFが基礎値+2
7. `旅人服`へ戻すとDEFが正確に元へ戻る
8. Tier II `補強革鎧` 装備でDEFが基礎値+4
9. repeated equipment switchingでbonus二重加算なし
10. save JSONにweapon / armor / equipmentOwned / ATK / DEFが保存される
11. shop purchase APIs / menu equipment APIsが存在
12. Tier II systemがsame canonical fieldsへ接続
13. JavaScript/static/add-on/browser regression PASS
14. Dynamic Touch regression PASS
15. Pages deploy SUCCESS

## AUTOMATED VERIFICATION / SELF-REPAIR RESULT

- Repository history reconstruction proved that equipment was already implemented before REQ-032 registration.
- The accidentally introduced parallel equipment implementation and its smoke probe were removed rather than preserved as a second state model.
- `addons/zzzzzzzzzzzzzzz-existing-equipment-smoke.js` now audits the pre-existing canonical equipment chain directly.
- The audit exposed a real pre-existing cross-tier defect: after equipping Tier II `鉄の剣` / `補強革鎧`, switching back to base/Tier I equipment delegated to `ux-v40.js`, which did not know Tier II bonuses and therefore failed to subtract stale ATK/DEF bonuses.
- `addons/advanced-equipment.js` was hardened so one known-gear delta reconciler handles base, Tier I and Tier II transitions using the same `s.weapon / s.armor / s.atk / s.def` fields.
- Acceptance covers Tier I weapon +3 and revert, Tier II weapon +6 and revert, Tier I armor +2 and revert, Tier II armor +4 and revert, repeated switching with no bonus accumulation, equipment capability APIs/status, and save persistence.
- Pages run `34005710946` for checkpoint `ef94f4c1eff9a11a85b8f388033ec06aacc5162f`: SUCCESS through sequential syntax validation, 99 add-on validation, static regression, add-on contract, PWA/assets, assembled browser smoke, Dynamic Touch smoke, upload and GitHub Pages deploy.
- `IOS_PHYSICAL_VERIFICATION = PENDING`.

## COMPLETION CONDITION

- duplicate equipment implementationがrepositoryから除去済み
- existing canonical equipment chainがassembled browser acceptanceでPASS
- public Pages buildでexisting gameplay/input/save compatibilityを維持
- Owner physical iPhone / subjective UI verification前はVERIFYでよい

## DO NOT REPEAT

- core fileだけ見て装備が未実装と判断しない
- `ux-v*.js` と `addons/*.js` とcommit historyをinventoryしてから新システムを登録する
- existing `s.weapon / s.armor / s.def / equipmentOwned[]` と競合する第二のequipment stateを作らない
- test failureを理由に本体仕様を都合よく変えない
