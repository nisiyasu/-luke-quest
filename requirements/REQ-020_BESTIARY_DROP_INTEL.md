# REQ-020 — BESTIARY DROP INTEL

- PRIORITY: P2
- STATUS: VERIFY
- OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE §§28, 35, 48 / queue selection rule 8
- DEPENDS_ON: REQ-017
- TYPE: combat knowledge / collection loop / menu readability

## GOAL
REQ-017で追加した敵ドロップを、既存の発見済みモンスター図鑑へ接続する。

プレイヤーが「この敵を倒すと何が狙えるか」をゲーム内で確認できるようにし、戦闘・収集・探索の循環をつなぐ。

## SCOPE
- REQ-017の18通常敵について、drop labelをsingle sourceから図鑑へ投影する。
- 図鑑の既存 HP / ATK / EXP / G / 地域表示を保持する。
- 発見済み図鑑entryだけに `DROP 薬草` または `DROP 煙玉` を追加する。
- drop chanceの数値は表示しない。初期バランスがOwner確認前であり、確率をUI契約として固定しないため。
- 未登録敵・bossは `DROP —` として安全fallbackし、嘘のdropを表示しない。

## AUTHORITY
- `addons/enemy-drop-system.js` のdrop registryをruntime statusへread-only projectionとして公開する。
- `addons/bestiary-details.js` はそのprojectionを読むだけにする。
- 図鑑側に第2のdrop tableを複製しない。

## SAFETY
- drop確率・報酬・戦闘数値を変更しない。
- inventoryを変更しない。
- discovery条件を緩めず、未発見敵を先に見せない。
- protected story canonを変更しない。

## VERIFICATION
1. 18 enemy drop labels exported from REQ-017 authority
2. bestiary reads runtime projection rather than duplicate table
3. existing HP/ATK/EXP/G/area retained
4. discovered-only behavior retained
5. no probability numbers rendered
6. unknown/boss safe fallback retained
7. no combat/inventory numeric mutation in bestiary add-on
8. static/addon/browser/touch/Pages pipeline green

## IMPLEMENTATION CHECKPOINTS
- Requirement definition: `6b92dafd97277c884a3986d032a00c9fab8e6546`
- Read-only drop-label projection: `a8d24c072c095cda428fac359c6a13c86e318188`
- Bestiary UI integration: `0a6d466698a6717bfd88459408054fc8b4de19b3`
- Queue transition: `fd1fc7d4d785cc2b60be52572496bc096cde7beb`
- Modular REQ-020 regression: `1709144b734bcea0fb644c0177ff1bc8e45dfa84`
- Static regression modular-loader checkpoint: `08f762972dd3de896a92eae203be69577bbf2edc`

## AUTOMATED VERIFICATION RESULT
- GitHub Pages workflow run `33993594188`: SUCCESS.
- REQ-020 modular regression loaded by static regression harness: PASS.
- 18 drop labels source from REQ-017 authority: PASS.
- duplicate drop table in bestiary: NOT PRESENT.
- HP / ATK / EXP / G / area display contracts retained: PASS.
- probability display forbidden: PASS.
- unknown-enemy `—` fallback: PASS.
- bestiary combat/inventory mutation guard: PASS.
- assembled browser smoke + floating touch pointer-drag smoke: PASS.
- artifact upload and Pages deployment: PASS.
- physical iPhone / subjective readability remains Owner-side and is not claimed.

## COMPLETION
- implementation committed: SATISFIED
- explicit regression contracts added: SATISFIED
- latest Pages SUCCESS: SATISFIED
- state: VERIFY pending Owner iPhone readability/subjective usefulness check
