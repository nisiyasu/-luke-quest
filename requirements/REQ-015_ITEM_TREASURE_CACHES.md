# REQ-015 — Item Treasure Caches

- ID: REQ-015
- PRIORITY: P1
- STATUS: IN_PROGRESS
- TITLE: 宝箱探索を実アイテム報酬へ拡張

## PURPOSE
既存REQ-012のGold宝箱を壊さず、DIRECTIVEのtreasure/inventory要件を一段進める。中盤の探索ルートに一度だけ取得できる補給キャッシュを追加し、Goldだけでなく実際に戦闘・ショップで使われている消耗品を探索報酬として獲得できるようにする。

## SCOPE
追加キャッシュ:
- 魔物の森・深部: 薬草束 / 薬草×2 / `lqItemCacheDeepHerbs`
- 霧の追跡路: 退避用ポーチ / 煙玉×1 / `lqItemCacheMistSmoke`
- 魔王軍・監視区域: 隠し補給箱 / 45G / `lqItemCacheObservationGold`

既存inventory fieldをそのまま使う:
- 薬草 = `s.potions`
- 煙玉 = `s.smokeBombs`
- Gold = `s.gold`

## IMPLEMENTATION RULES
- `addons/item-treasure-caches.js` の独立IIFEで実装する。
- 既存 `addons/treasure-chests.js` と既存3宝箱、そのsave flags、報酬を変更しない。
- 各cacheは独自persistent flagを持ち、取得はexactly-once。
- 正面隣接 `front()` + `action()` で取得。
- 未取得cacheはworld上に小型補給箱として描画し、取得後は開いた/空の状態を残す。
- cache tileはcollision対象にする。
- DOMは `pointer-events:none` でDynamic Touch Controllerを奪わない。
- reward適用後に `save()` する。
- 既存shop/戦闘が参照する `s.potions` / `s.smokeBombs` を使い、別inventory authorityを作らない。
- protected story canonは扱わない。

## COMPLETION CONDITIONS
- [ ] 3地域にunique cacheを追加。
- [ ] 薬草×2、煙玉×1、45Gの3種類報酬。
- [ ] 3 unique persistent flags。
- [ ] exactly-once reward。
- [ ] opened-state visual persists。
- [ ] collision。
- [ ] touch passthrough。
- [ ] `save()` persistence。
- [ ] runtime status marker。
- [ ] generic add-on syntax/static/browser/touch regression PASS。
- [ ] Pages deploy PASS。
- [ ] Owner subjective iPhone verification。未主張。

## DO NOT
- 既存REQ-012の3宝箱を削除・移動・報酬変更しない。
- 新しいinventory authorityを作らない。
- 同じcacheから報酬を再取得できるようにしない。
- cache DOMでtouch inputを奪わない。
- Owner iPhone実機確認前にDONE扱いしない。
