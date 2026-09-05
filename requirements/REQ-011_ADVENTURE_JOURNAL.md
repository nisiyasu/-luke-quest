# REQ-011 — Adventure Journal / Objective Tracking

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: UX / STORY NAVIGATION / IPHONE
SOURCE: Owner-authorized continuous development under AUTONOMOUS_DEV_DIRECTIVE.md

## PURPOSE

LUKE QUESTの現在のメイン目的、既に判明した手掛かり、進行中サブクエストを、iPhoneの冒険メニューから一目で確認できる「冒険ジャーナル」として整理する。

プレイヤーが久しぶりに再開した時や、王都→森→霧→監視区域→退避路と進んだ時に、次に何をすべきか分からなくならないことを最重要とする。

## SAFETY / CANON

- 未来のストーリー情報を先出ししない。
- 未取得の秘密、グレンとルークの血縁、エリシアの過去、エレノアの真相、水晶異常反応の完全理由を表示しない。
- 既にプレイヤーがゲーム内で確認済みのflagだけを「手掛かり」として表示する。
- presentation-onlyを基本とし、戦闘・移動・セーブ・イベントflagの意味を変更しない。
- localStorageの既存セーブ互換性を壊さない。

## MAIN OBJECTIVE

既存ゲームのopenMenu()が持つ目的判定と矛盾しないよう、現在stateからメイン目的を表示する。

最低限、以下の進行を追跡する。

1. 王都近郊で2勝して森へ進む準備
2. 魔物の森へ向かう
3. 森深部へ進む
4. 深部でレオンを探す
5. レオン発見後、北の霧へ追う
6. 霧の追跡路で魔王軍の痕跡を調べる
7. 魔王軍監視区域へ進む
8. 監視区域でグレン隊長を探す
9. 北の封鎖線を越えてレオンを追う
10. 北の退避路でレオンと魔王軍の痕跡を調べる
11. 撤収命令確認後、北の崖道へ進む

## DISCOVERED CLUES

取得済みflagだけを使って、少なくとも以下を表示対象にする。

- leonSeen: レオン本人を森深部で発見した
- glennTraceSeen: 魔王軍がレオンへの直接接触を禁じている痕跡を確認した
- glennSeen: グレン本人がレオンを追い詰めない命令を出している場面を確認した
- leonInjurySeen: 退避路でレオンの負傷痕跡を確認した
- escapeProofSeen: グレン隊長命令で北側通路が空けられていた証拠を確認した
- withdrawProofSeen: レオン追撃禁止の撤収命令を確認した

未取得flagの内容は伏せ字や予告としても表示しない。

## SIDE QUEST TRACKING

既存のoptional-objective-chip.jsと整合させ、少なくとも以下を追跡する。

### Elder Charm
- elderCharmQuest && !elderCharmComplete
- elderCharmFound前: 王都近郊で銀留め具を探す
- elderCharmFound後: 銀留め具を老人へ返す
- elderCharmComplete後: 完了表示

### Forest Bounty
- forestBountyAccepted
- forestBountyKills / 3を表示
- 3体到達後は掲示板報酬受取を案内
- forestBountyComplete後: 完了表示

### Forest Herb Sample
- lqHerbSampleQuestAsked
- forestClearingHerbHarvested前: 森入口の木漏れ日の空地で薬草を探す
- harvest後: 神殿見習いへ届ける
- lqHerbSampleQuestDone後: 完了表示

進行中サブクエストがない場合も、ジャーナル自体は壊れず「進行中なし」と表示してよい。

## UI

- 既存 `.lqPausePanel` 内へ `.lqPauseSection` として追加する。
- menu-section-nav.jsが自動的にセクションナビへ拾える構造にする。
- iPhone縦画面で読める文字サイズ・行間・カード構造にする。
- MAIN / CLUES / SIDEを視覚的に区別する。
- pointer操作を阻害しない。
- world HUDを常時さらに圧迫しない。詳細情報はpause menu内に置く。

## RUNTIME ARCHITECTURE

- collision-safe add-onとして `addons/adventure-journal.js` に実装する。
- `world()` / `render()` を既存add-on方式で安全にwrapし、pause menuが描画された後にsectionを差し込む。
- 同一sectionを重複生成しない。
- `s.pauseOpen && s.screen==='world'` の時だけ詳細sectionを追加する。
- `window.LQ_ADVENTURE_JOURNAL_STATUS` を公開し、main objective / discovered clues / side quests / spoiler-safeであることを示す。

## TEST / CONTRACT

最低限の自動契約として以下を固定する。

- `addons/adventure-journal.js` が存在
- strict-mode IIFE
- `.lqAdventureJournalSection`
- `LQ_ADVENTURE_JOURNAL_STATUS`
- main objective進行に `withdrawProofSeen`, `evacEntered`, `glennSeen`, `observationEntered`, `glennTraceSeen`, `mistEntered`, `leonSeen`, `wins` を参照
- discovered clue表示はflag取得済み条件を持つ
- 3系統のside quest stateを参照
- pause panelへ1回だけsectionを差し込むduplicate guard
- protected secret stringsを含めない

## COMPLETION CONDITION

- 冒険メニューからMAIN目的を確認できる
- 取得済み手掛かりだけ確認できる
- 既存3系統のサブクエ進捗を確認できる
- 未取得ストーリー秘密を漏らさない
- 既存menu navigationに自然に統合される
- add-on syntax PASS
- static regression PASS
- add-on contract PASS
- assembled browser smoke PASS
- floating touch smoke PASS
- GitHub Pages deployment SUCCESS
- Owner物理iPhone確認が未実施の場合、実装完了後は VERIFY とする

## DO NOT REPEAT

- 未取得の秘密をジャーナルに先出ししない
- openMenuの既存目的と矛盾する別ストーリーを発明しない
- side quest flagを勝手に完了させない
- pause menuを置換して既存装備・図鑑・save等を消さない
- world HUDへ巨大常駐パネルを追加しない
