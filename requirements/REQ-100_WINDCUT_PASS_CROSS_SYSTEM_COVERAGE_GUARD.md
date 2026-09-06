# REQ-100 — 風切り峠・cross-system coverage self-audit guard

STATUS: VERIFY
PRIORITY: P1
TYPE: QUALITY-GATE / SELF-AUDIT / MAP-INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: NOT_REQUIRED_FOR_GATE

## WHY

REQ-093でcanonical `windcutPass` を追加した後、local guidance、regional battle backdrop、area title、world ambience、cloud shadow、terrain footstepをREQ-094〜099で段階的に接続した。

新規map追加時にpresentation registryだけcanonical map keyが抜ける問題は、直前の`northCliffRoad`でも連続して発生した実績がある。個別修復だけでは将来の編集で再発してもOwner実機指摘まで気付けないため、現在正式化済みの風切り峠についてcross-system integrationをPages公開前にfail-closed監査する。

## PURPOSE

canonical `windcutPass` が主要な地域presentation/導線systemから再び脱落した場合、assembled runtime smokeで機械的に検知して公開前に失敗させる。

## REQUIRED COVERAGE

最低限、以下を同時に確認する。

- `MAPS.windcutPass` exists
- `LQ_WINDCUT_GUIDANCE_STATUS.map === 'windcutPass'`
- `LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS.hasMap('windcutPass') === true`
- `LQ_AREA_TITLE_STATUS.hasMap('windcutPass') === true`
- `LQ_WORLD_AMBIENT_STATUS.typeFor('windcutPass') === 'fog'`
- `LQ_WORLD_CLOUD_STATUS.classFor('windcutPass') === 'mist'`
- `LQ_FOOTSTEP_PARTICLE_STATUS.kindFor('windcutPass') === 'mist'`
- 既存`northCliffRoad` coverageも同時に保持されている

## SAFETY

- CI/runtime smoke only。通常プレイのstory/save/battle/movementへmutationを加えない。
- 各presentation moduleのauthorityを統合・置換しない。
- Owner physical verificationを自動PASS扱いしない。
- legacy aliasを削除しない。

## ACCEPTANCE

- [x] dedicated late-loading fail-closed smoke exists
- [x] canonical map existence checked
- [x] local guidance checked
- [x] battle backdrop checked
- [x] area title checked
- [x] ambient checked
- [x] cloud shadow checked
- [x] footstep checked
- [x] northCliff continuity regression checked
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen regression PASS
- [x] Pages SUCCESS

## VERIFIED EVIDENCE

- Implementation checkpoint: `54cc6773a29c9bacdb8ea12fbd1966620e275453`
- Pages workflow run: `34033921077` / SUCCESS
- Workflow assembled browser smoke: PASS
- Workflow floating touch + iPhone world visual-liveness smoke: PASS
- Guard is smoke-only and reports `gameplayMutation:false`.

## NO-STOP

REQ-100の実装・PASS・VERIFYは終了理由ではない。fresh HEAD → GATE C → 次の安全な仕事へ進む。