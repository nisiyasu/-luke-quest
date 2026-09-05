# REQ-014 — NPC Dialogue Progression

- ID: REQ-014
- PRIORITY: P1
- STATUS: VERIFY
- TITLE: ストーリー進行で町人会話が変化するNPCリアクション

## PURPOSE
DIRECTIVEの最終完成像にある「ゲーム進行による町人会話変化」を、既存ストーリーcanonを増やさず実プレイへ導入する。王都アルディアと王都近郊の既存NPCが、ルークの追跡状況に応じて自然に反応することで、世界が静止して見える問題を減らす。

## SCOPE
対象NPC:
- 王都アルディア: 旅好きの老人
- 王都アルディア: 道具屋のミナ
- 王都アルディア: 神殿の見習い
- 王都近郊: 畑仕事の青年

進行判定は既存stateのみを使う:
- `s.wins`
- `leonSeen`
- `mistEntered` / `glennTraceSeen`
- `observationEntered` / `glennSeen`
- `evacEntered` / `withdrawProofSeen`

## IMPLEMENTATION
- `addons/npc-dialogue-progression.js` で既存NPCを名前で安全に解決し、stage別台詞へ差し替える。
- MAP構造、NPC位置、collision、story flag生成、報酬、battle mechanicsは変更しない。
- `action()` 前と `world()` / `render()` 周辺でprojectionを同期し、flag更新後の再描画でも最新stageを反映する。
- protected story secretは台詞へ追加しない。
- 未知NPCや将来追加NPCは触らない。
- `window.LQ_NPC_DIALOGUE_PROGRESSION_STATUS` でruntime状態を公開する。

## COMPLETION CONDITIONS
- [x] 4既存NPCに複数段階の進行台詞。
- [x] 既存canonical flagsのみ使用。
- [x] NPC位置/collision/種類を変更しない。
- [x] protected story secretsを早期開示しない。
- [x] unknown/future NPCを変更しない。
- [x] runtime status marker。
- [x] add-on contract guardを追加。
- [ ] Pages workflow / assembled browser regression確認。
- [ ] Owner subjective iPhone verification。未主張。

## DO NOT
- グレンとルークの血縁、ルークの父、エリシアの全過去、エレノアの誘拐関与、水晶反応の完全理由を台詞で明かさない。
- 新しいstory flagを作って本編分岐を捏造しない。
- MAPS全体を置換しない。
- NPCの位置やcollisionを変更しない。
- Owner iPhone実機確認前にDONE扱いしない。
