# REQ-090 — 北の崖道・cross-system coverage self-audit guard

STATUS: VERIFY
PRIORITY: P1
TYPE: QUALITY-GATE / SELF-AUDIT / MAP-INTEGRATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: NOT_REQUIRED_FOR_GATE

## WHY

REQ-081でcanonical `northCliffRoad` を追加した後、battle backdrop、area title、world ambience、cloud shadow、footstepの複数presentation systemで旧 `cliffRoad` aliasだけが残り、canonical map keyが未登録になる取りこぼしが連続して見つかった。

個別修復だけでは、将来の編集で同じmap coverage driftが再発してもOwner実機指摘まで気付かない可能性がある。Owner方針「指摘される前に自己監査し、自分で修正する」に合わせ、既に正式化済みの北の崖道についてcross-system integrationをassembled browserでfail-closed監査する。

## PURPOSE

canonical `northCliffRoad` が主要な地域presentation/導線systemから再び脱落した場合、Pages公開前のassembled browser smokeで検知して失敗させる。

## REQUIRED COVERAGE

assembled smoke時に最低限、以下を同時に確認する。

- `MAPS.northCliffRoad` exists
- `LQ_NORTH_CLIFF_GUIDANCE_STATUS.map === 'northCliffRoad'`
- `LQ_ADVENTURE_JOURNAL_STATUS.northCliffLocationAware === true`
- `LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS.hasMap('northCliffRoad') === true`
- `LQ_AREA_TITLE_STATUS.hasMap('northCliffRoad') === true`
- `LQ_WORLD_AMBIENT_STATUS.typeFor('northCliffRoad') === 'fog'`
- `LQ_WORLD_CLOUD_STATUS.classFor('northCliffRoad') === 'mist'`
- `LQ_FOOTSTEP_PARTICLE_STATUS.kindFor('northCliffRoad') === 'mist'`

## SAFETY

- CI/runtime smoke only。通常プレイのstory/save/battle/movementへ新しいmutationを加えない。
- presentation modulesのauthorityを統合・置換しない。各systemは既存single sourceを維持する。
- Owner physical verificationを自動PASS扱いしない。
- このguard自体を理由に既存legacy aliasを削除しない。

## ACCEPTANCE

- [x] dedicated late-loading fail-closed smoke exists
- [x] canonical map existence checked
- [x] local guidance checked
- [x] journal location awareness checked
- [x] battle backdrop checked
- [x] area title checked
- [x] ambient checked
- [x] cloud shadow checked
- [x] footstep checked
- [x] assembled browser PASS
- [x] 390x844 touch/fullscreen regression PASS
- [x] Pages SUCCESS

## VERIFIED EVIDENCE

- Requirement registration checkpoint: `3d0be92ae86357cbad1c28d166dfdf845471da57`.
- Cross-system fail-closed smoke checkpoint: `06ad6bedbc4f1b3af75f45bfad0381c8e4c3a6a9` (`Gate REQ-090 north cliff cross-system coverage`).
- Smoke is active only under `?lqSmoke=1`; ordinary play receives no state/gameplay mutation from the guard.
- The guard checks canonical map existence plus local guidance, journal location awareness, regional battle backdrop, area title, world ambience, cloud shadow and terrain footstep coverage in one assembled runtime.
- Pages workflow run `34028025355`: SUCCESS. Collision-safe add-ons, static regression, add-on contract, assembled browser, 390x844 touch/fullscreen visual-liveness, north-cliff road/encounter browser smokes, upload and Pages deploy all SUCCESS.
- This quality gate does not claim Owner physical iPhone verification and does not require it for automated VERIFY.

## NO-STOP

REQ-090の実装・PASS・VERIFYは終了理由ではない。fresh HEAD → GATE C → 次の安全な仕事へ進む。
