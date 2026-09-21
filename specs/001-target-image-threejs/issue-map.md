# Issue Map / Taskstoissues後のIssue構造

## Parent

**AI見本画像→iPhone高精細3Dゲーム画面 再構築 v1**

## Sub-issues

0. **Spec Kit計画耐久化・工程正本固定** — T001-T004
1. **安全な作り直し・旧視覚実装退避** — T005-T012
2. **G0 見本画像・ランドマーク・証拠基盤** — T013-T024
3. **Three.js / WebGPU 技術実証** — T025-T035
4. **G1 ホワイトボックス構図** — T036-T048
5. **G2 3D成立性・複数視点** — T049-T054
6. **G3 モデル・材質** — T055-T060
7. **G4 照明・色** — T061-T066
8. **G5 背景・装飾** — T067-T071
9. **G6 iPhone実機・性能・ライフサイクル** — T072-T086
10. **G7 最終視覚収束** — T087-T094
11. **Taskstoissues・Sub-issues・Dependencies・Projects v2** — T095-T101
12. **必要なSpec Kit Extension** — T102-T104
13. **Agent実装・Test・CI・Review** — T105-T108
14. **Converge最終収束** — T109-T114

## Dependencies

- 1 blocked by 0
- 2 blocked by 1
- 3 blocked by 1
- 4 blocked by 2 and 3
- 5 blocked by 4
- 6 blocked by 5
- 7 blocked by 6
- 8 blocked by 7
- 9 can start technical checks after 3 but final PASS blocked by 8
- 10 blocked by 8 and 9
- 11 is generated after Analyze PASS; implementation-ready Issue state depends on relevant Gate prerequisites
- 12 blocked by 11
- 13 blocked by 12 and all implementation prerequisites
- 14 blocked by 10 and 13

## Projects v2 fields

- Status: Backlog / Ready / In Progress / Review / Blocked / Done
- Priority: P0 / P1 / P2
- Gate: G0 / G1 / G2 / G3 / G4 / G5 / G6 / G7 / WorkGraph / Converge
- Lane: Visual Rebuild
- Work Type: Planning / Infrastructure / Scene / Art / Runtime / Verification / Management
- Owner Attention: No / Review / Decision Required

Projects v2は表示・運用面であり、Issueのcompletion truthを上書きしない。

## Current execution stop

この実行では Sub-issues / Dependencies / Projects v2 の投影と、Required Spec Kit Extension の実装・検証までを行う。
T105以降のゲーム実装は別Owner GOまで開始しない。
