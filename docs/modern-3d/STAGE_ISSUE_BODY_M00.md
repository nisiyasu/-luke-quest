# M00 — 独立プロトタイプの準備

Parent: `[EPIC][MODERN-3D] LUKE QUEST Modern 3D Visual Prototype — M00–M12`
Document: `docs/modern-3d/LUKE_QUEST_MODERN_3D_EXECUTION_PLAN_v2.md`
Status at registration: `NOT_STARTED`

## 原文
入力：本書、参照2画像、Gold/mainの最新状態。
作業：SHA固定、適用ルール、既存未コミット作業、CI・公開トリガーを確認。隔離した作業場所を作る。参照画像とREADME、進行記録を置く。既存ゲームの全履歴を無目的に読まない。
成果物：作業場所・開始SHA・起動方針・画像。
合格：本線を上書きせず、参照画像へアクセスできる。

## 最新Owner画像裁定
- `MINIMUM_QUALITY_LINE.png` = 最低ライン
- `TARGET_PS1_FINAL.png` = 本命最終TARGET
- 2枚目到達だけで完成扱いしない

## 前提工程
なし。これは最初の実行工程。

## 未達時の戻り先
M00のまま。隔離・参照・実行能力・開始SHAが証拠付きで成立するまでM01へ進まない。

## M00で必ず確認する実行能力
通常チャット/runtimeで実際に利用できる手段を確認する。
- Three.js実装ファイルの作成・更新
- 3D素材制作または利用可能な代替手段
- ブラウザ/WebGL実行
- スクリーンショット取得
- 必要な動画/動作証拠の取得可否

使えない能力を「使えた」「確認済み」と報告しない。阻害要因を記録し、安全に進められる独立作業は進める。

## Close gate
Issue登録だけではCLOSEしない。上記合格条件を証拠で満たした時のみDONE候補。

## 各回の作業記録
各セッションのコメントに、`docs/modern-3d/ISSUE_WORK_LOG_TEMPLATE.md` の形式で以下を残す。
- 実施内容
- commit
- 画面・動画証拠
- 検証結果
- 未完了
- 正確な次の一手
