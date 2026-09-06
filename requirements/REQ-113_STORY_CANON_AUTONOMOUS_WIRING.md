# REQ-113 — STORY CANON AUTONOMOUS WIRING

- ID: `REQ-113`
- TITLE: `Story Canon Autonomous Wiring / Main-Story Beat Guard`
- PRIORITY: `P1`
- STATUS: `READY`
- OWNER_REQUEST_DATE: `2026-09-07 JST`
- OWNER_INTENT: `STORY_CANON.md を自律開発へ正式配線し、章設計を無視したレオン北追跡の無限延長を止める。`

## 1. Problem

`STORY_CANON.md` が新規作成され、第1章の主要CanonとクライマックスがOwner承認済みになったが、現時点の `AUTONOMOUS_DEV_DIRECTIVE.md` からは未配線である。

そのため、別の自律実行セッションが `STORY_CANON.md` を知らないまま、従来の「次に安全に作れる本筋」を局所生成し、レオン追跡ルートをさらに北へ延長する危険がある。

## 2. Required change

fresh HEADを取得した上で `AUTONOMOUS_DEV_DIRECTIVE.md` を安全に更新し、少なくとも以下を正式ルール化する。

1. 毎回のBOOTで `STORY_CANON.md` を必ずfresh-loadする。
2. Main-story requirementは `STORY_CANON.md` の `CONFIRMED` Story Beat / Canonに従う。
3. `PENDING` / `NOT_DESIGNED` の事項を自律実装で勝手に確定しない。
4. Story Beatを消化せず「レオンの痕跡がさらに北へ続く」という理由だけで新しい本筋追跡マップを追加しない。
5. 第1章は、レオンとの再会 → ルーク勇者認定を知る → レオン激昂 → ルーク防御 → 妹が体を張って止め負傷 → レオンが我に返る → 王国帰還、へ収束させる。
6. 第2章が `NOT_DESIGNED` の間は、第2章の本筋を自律創作して先行実装しない。代わりに安全な非本筋改善・既存Story Beat実装・不具合修正を選択できる。
7. 既存 `AUTONOMOUS_DEV_DIRECTIVE.md` の固定世界観・protected reveal rulesは維持する。矛盾がある場合は勝手に片方を破壊せず、Owner-approved `STORY_CANON.md` の新規確定事項を明示的に統合する。

## 3. Non-goals

- 第2章を自律的に設計しない。
- 妹の名前・年齢・細かな性格を勝手に決めない。
- 今日の配線作業そのものを理由に、第1章クライマックスを即実装し始めない。
- 既存ゲームプレイ、input、save schema、Pages公開挙動を変更しない。

## 4. Completion conditions

- [ ] fresh `AUTONOMOUS_DEV_DIRECTIVE.md` と `STORY_CANON.md` を取得してから編集する。
- [ ] Directiveのmandatory boot/read listに `STORY_CANON.md` が入っている。
- [ ] Main-story生成がCONFIRMED Story Beat駆動になっている。
- [ ] PENDING/NOT_DESIGNEDを自律確定しないguardが明記されている。
- [ ] 無目的な北追跡延長禁止が明記されている。
- [ ] 第2章未設計中の安全な代替作業選択ルールがある。
- [ ] Story Canonの既存protected reveal rulesを保持する。
- [ ] fresh再取得で変更を確認する。
- [ ] `WORK_QUEUE.md` / `CURRENT.md` を実行結果に同期する。

## 5. Execution note

このREQはストーリー本文の実装ではなく、**自律開発ガバナンス配線**である。

Ownerは「配線もキューに入れておく」ことを明示した。したがってWIP=1とfresh realityを守り、他のIN_PROGRESSがある場合は安全に競合を避けること。

EOF
