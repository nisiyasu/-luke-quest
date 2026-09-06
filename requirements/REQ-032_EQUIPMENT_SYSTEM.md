# REQ-032 — 武器・防具・装備システム

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: GAMEPLAY / EQUIPMENT / SAVE / UI
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

`AUTONOMOUS_DEV_DIRECTIVE.md` の最終完成像には「武器」「防具」「装備」が含まれる。

fresh core inventoryではプレイヤー攻撃値 `s.atk` は存在し、MP/技や戦闘拡張も存在するが、武器・防具の所有、装備変更、永続保存というcanonical equipment modelは確認できない。

したがって、既存戦闘を壊さずに最初の安全なequipment checkpointを追加する。

## PURPOSE

プレイヤーが武器と防具を所有・装備変更でき、装備効果が既存戦闘能力へ反映され、save/continue後も維持される状態を作る。

## SCOPE

最初のcheckpointでは以下を実装する。

- persistent equipment state
- weapon slot 1
- armor slot 1
- owned equipment inventory
- equipment change UI
- weapon bonusを既存 `s.atk` 系へ反映
- armor bonusを最大HP `s.mh` へ安全に反映
- 王城門衛詰所の予備装備箱から最初のupgrade一式をcanonical Actionで受け取る
- old save migration

## INITIAL EQUIPMENT

基礎装備:
- `旅人の短剣` / weapon / ATK +0
- `旅装` / armor / 最大HP +0

取得可能な最初のupgrade:
- `訓練用鉄剣` / weapon / ATK +3
- `革の胸当て` / armor / 最大HP +6

数値は最初のequipment foundationとして小さく保ち、既存戦闘バランスを破壊しない。

## ACQUISITION

REQ-025の `aldiaCastleGatehouse` に一般的な `門衛予備装備箱` を追加してよい。

canonical Actionで初回のみ:
- 訓練用鉄剣
- 革の胸当て

を所有状態へ追加する。

重要story flagや秘密設定へ接続しない。
取得済みの場合は再取得せず、装備箱が空または貸出済みであることを伝える。

## EQUIPMENT STATE

optional save fieldsとして少なくとも以下に相当する状態を持つ。

- `s.equipment.weapon`
- `s.equipment.armor`
- `s.equipmentOwned`

old saveにfieldが存在しない場合は安全に初期化する。

## STAT INTEGRATION

### Weapon

既存 `s.atk` をdamage single sourceとして維持する。

装備変更時は:

`current s.atk - old weapon bonus + new weapon bonus`

の差分反映を行い、既存level-upで加算された基礎ATKを失わない。

これにより通常攻撃だけでなく `s.atk` を参照する既存技も自然に装備効果を受ける。

### Armor

最初のcheckpointでは複雑な敵damage wrapperを増やさず、armor bonusを最大HPへ反映する。

装備変更時は:

`current s.mh - old armor HP bonus + new armor HP bonus`

とし、現在HPは新しい最大HPを超えないようclampする。

level-upによる最大HP増加を失わない。

## UI

既存MENU / 冒険メモを破壊しない。

MENUを開いた時に明示的な `装備` controlを追加し、そこからowned equipmentを選べる。

- buttonはexplicit interactive controlとして扱う
- Tap Anywhere Actionを誤発火させない
- iPhone fullscreen world上のdialogue/menu構造と共存
- equipped itemを視覚的に識別可能
- 未所有装備は選択不可

## STATUS FEEDBACK

world HUD/statusまたはequipment menu内で最低限:
- current weapon
- current armor
- resulting ATK
- resulting max HP

を確認できる。

常時HUDを過密にしない。

## SAVE SAFETY

- existing `lukeQuestV2` save keyを変更しない
- optional fieldsのみ追加
- old save compatibility維持
- continue後に装備状態とstat bonusが二重適用されない
- equipment normalizationを複数回実行してもstatが増殖しない

## WRAPPER SAFETY

既存の:
- battle
- attack
- MP / 蒼閃
- level-up
- enemy drop
- fullscreen UI
- Tap Anywhere Action
- Dynamic Touch Controller

のwrapper chainを破壊しない。

可能な限り既存 `s.atk` / `s.mh` をそのままdownstream single sourceとして利用し、攻撃処理を丸ごと複製しない。

## TEST REQUIREMENTS

1. old save相当stateでequipment fieldsが安全に初期化される
2. default equipmentで既存ATK/最大HPが変化しない
3. 門衛詰所に予備装備箱が存在
4. canonical Actionでupgrade一式を初回取得
5. 再Actionで二重取得なし
6. equipment menuでowned weaponを装備可能
7. weapon切替でATKが正確に+3 / 元へ戻すと-3
8. armor切替で最大HPが正確に+6 / 元へ戻すと-6
9. repeated normalization/renderでbonus二重加算なし
10. save JSONにequipment stateが保存される
11. existing attack / 蒼閃がcurrent `s.atk` と整合
12. level-up由来statを装備変更で失わない構造
13. explicit equipment buttonsでworld Action誤発火なし
14. static/add-on/browser regression PASS
15. Dynamic Touch regression PASS
16. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pagesで装備取得・装備変更・stat反映・save persistenceが成立
- existing combat/input/save compatibility維持
- automated browser regression PASS
- Owner physical iPhone verification前はVERIFYでよい
