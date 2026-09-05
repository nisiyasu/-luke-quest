# REQ-002 — Luke Formal Dialogue Artwork Integration

STATUS: IN_PROGRESS
PRIORITY: P0
TYPE: VISUAL / DIALOGUE / CHARACTER_CANON
OWNER_REQUEST: CONFIRMED

## OWNER REQUEST

ルークが喋る時に表示されるグラフィックを、仮素材・簡易SVG・古い別人画像ではなく、Owner承認済みの正式な生成画像へ変更する。

これは現在の最優先IN_PROGRESS requirementとする。

## PURPOSE

会話シーンでルークが「ゲーム内でちゃんと存在している人物」に見えるよう、正式ビジュアル基準に一致する高品質画像を実際の公開ゲームへ統合する。

画像をチャットで生成しただけ、repositoryへ置いただけ、source guardを追加しただけでは完了しない。

公開版の会話シーンで実際に正しいルークが表示されることが目的。

## LUKE OFFICIAL VISUAL CANON

Owner承認済みのルーク基準:

- 若い王道ファンタジー主人公
- 深い青髪
- 青系の瞳
- 青を主軸にした衣装
- 青いマントまたはスカーフ/クローク要素
- 銀系の鎧
- 青・銀・必要に応じて金の装飾
- 清潔感のある高品質ファンタジー騎士デザイン
- 臆病で天然な性格と、いざという時の勇気の両方を乗せられる人物像

茶髪、まったく別の鎧、別人の顔、安価な簡易キャラ、既存作品キャラのコピーをルークとして採用しない。

Ownerが以前提示し「これがルーク」とした青髪・青/銀鎧・青マント系の高品質画像を最上位参照とする。

## BODY COMPOSITION RULE

顔だけは禁止。

会話用正式画像は原則として:

- 全身
- または少なくとも膝上以上

とし、服、鎧、武器、体格、シルエットが見えること。

顔だけの丸アイコン、簡易バストアップだけで「正式化完了」としない。

小さいiPhone画面ではUI上で必要に応じてcrop/positionを調整してよいが、source artwork自体は人物全体の存在感を持たせる。

## CURRENT REPOSITORY REALITY AT REGISTRATION

Fresh CURRENTにより、現時点で以下が存在することが記録されている:

- `assets/portraits/luke-full.webp`
- dialogue portrait infrastructure
- `showDialoguePortrait()` 系の表示経路
- `ux-v29.js` にLuke portrait source guard / canonical source lock系の防御
- Pages上でportrait表示経路自体は存在する

しかしCURRENTは、現在serveされているLuke assetをOwner承認の最終正式artとしては扱っていない。

したがって、このREQは「portrait infrastructureを作る」だけではなく、実際の正式artを最終表示へ入れ替える案件。

既存のsource guardが正しい新assetの邪魔をする場合は、安全に更新する。

## IMAGE GENERATION / SOURCE RULE

必要な場合は画像生成を使用してよい。

ただし完了は以下を意味する:

1. 正式ビジュアル基準に一致する画像が用意される
2. Owner承認済み参照と整合する
3. 完全オリジナルである
4. Web用形式へ変換/最適化される
5. repositoryから公開可能になる
6. game codeがそのassetを参照する
7. GitHub Pages公開版のdialogueで実際に表示される

チャット上に画像が表示された時点では未完了。

## ASSET FORMAT

利用可能な安全な形式を選ぶ:

- WebP preferred when practical
- PNG acceptable
- SVGは高品質正式artを維持できる場合のみ
- Data URI/Base64等はconnector/binary transport制約に対する次善策として使用可

既存で検証済みのbinary transport / build-time asset pathがある場合はそれを優先する。

画像はiPhoneでのロードを悪化させないよう適切に縮小・圧縮する。

## DIALOGUE UI INTEGRATION

正式Luke artを会話UIへ統合する。

最低条件:

- 名前表示と整合
- dialogue windowと干渉しない
- 人物の大部分が見える
- iPhone portrait viewportで台詞本文を潰さない
- Lukeが話していることが明確
- transparent background assetなら背景との馴染みを確認
- 必要に応じてleft/right placementへ将来拡張可能
- Leon/Glenn等の正式立ち絵追加を阻害しない構造

## SOURCE GUARD / FALLBACK

既存のwrong-Luke regression防止機構を維持または改善する。

旧仮SVG、旧別人画像、茶髪placeholder等へsilent fallbackして「正常」と見せない。

asset load failure時には:

- broken image iconを放置しない
- 何がfallbackなのかコード上明確にする
- fallbackを正式品質として報告しない

既存 `ux-v29.js` のcanonical source guardがある場合、正式新asset pathを正本として扱うよう整合させる。

## RESPONSIVE LAYOUT

最低限以下を確認する:

- iPhone portrait
- narrow viewport
- desktop browser

人物が極端に小さすぎないこと。

台詞windowを完全に覆わないこと。

画像の重要部分がviewport外へ不自然に切れないこと。

必要なら `object-fit`, `object-position`, max-height, responsive clamp等を利用する。

## PERFORMANCE

会話開始のたびに巨大画像を再decodeさせる構造を避ける。

同じLuke assetはbrowser cacheを利用できる通常asset pathを優先する。

画像容量と品質のバランスを取る。

## TEST REQUIREMENTS

### TEST 1 — SOURCE
会話Luke portraitの実際のsourceが正式asset pathである。

### TEST 2 — NO OLD LUKE
旧仮SVG/別人assetが通常のLuke dialogueで表示されない。

### TEST 3 — DIALOGUE RENDER
Luke dialogueを開くと正式画像が表示され、dialogue textとnameplateも正常。

### TEST 4 — MULTIPLE DIALOGUES
複数のLuke dialogueを連続表示してもsourceが崩れない。

### TEST 5 — OTHER SPEAKERS
Luke正式化によってLeon/Glenn/other portrait routingが壊れない。

### TEST 6 — CLOSE/REOPEN
会話終了後に再度会話してもportrait stateが残留/消失しない。

### TEST 7 — MOBILE LAYOUT
narrow/mobile viewportで画像と台詞が実用的に共存。

### TEST 8 — ASSET ACCESS
GitHub Pagesの公開asset URLが404にならない。

### TEST 9 — JS VALIDITY
変更したJS patchが `node --check` 等の既存syntax gateを通過。

### TEST 10 — RUNTIME REGRESSION
既存browser regression suiteがPASSし、movement/battle/save等を破壊しない。

## PAGES COMPLETION

実装commitだけでは完了しない。

少なくとも:

- workflow successfully builds
- Pages deploy succeeds
- published game references the new asset

を確認する。

## OWNER VISUAL VERIFICATION

Ownerの物理iPhone/主観的な見た目確認がまだの場合:

`STATUS: VERIFY`

へ移して次のREADY作業を進めてよい。

自動テストだけで:

`Owner visual approval = PASS`

とは書かない。

## COMPLETION CONDITION

以下を満たすこと:

- Owner承認ビジュアル基準と一致する正式Luke artworkを使用
- 顔だけではなく全身または人物の大部分が見えるsource art
- repository-safeなassetとして保存/供給
- web用に最適化
- dialogue codeが実際に正式assetを参照
- old/wrong Lukeが通常経路で出ない
- asset pathがPages上で有効
- dialogue runtimeで実際に表示
- iPhone向けresponsive layoutが破綻しない
- syntax/static/runtime regression PASS
- Pages deployment SUCCESS

Ownerによる最終視覚確認が未完ならDONEではなくVERIFYでよい。

## NOT COMPLETION

以下は完了ではない:

- 画像をチャットで生成しただけ
- image generation resultをrepositoryへ入れていない
- repositoryへ置いたがcodeが参照していない
- simple SVG placeholder
- face-only icon
- source guardを追加しただけ
- 旧 `luke-full.webp` を正しいと仮定しただけ
- Pages未公開
- visual approval未確認なのにOwner承認済みと報告

## DO NOT REPEAT

- 正式デザインと違うLukeを出さない
- 茶髪/別鎧の過去placeholderを復活させない
- 顔だけで正式化完了としない
- 生成しただけで統合完了としない
- asset 404を残さない
- fallback artworkを正式品質扱いしない
- Lukeだけ直して他speaker portrait routingを壊さない

## NEXT IMPLEMENTATION START

Fresh HEADから以下を最初に確認する:

1. current `assets/portraits/luke-full.webp` の由来・表示実体
2. `ux-v29.js` のLuke source guard
3. dialogue portrait routing
4. workflowのasset publication path
5. existing approved/generation asset transport mechanism

その後、実際の正式Luke artへ安全に置換し、公開版へ統合する。
