# REQ-082 — 北の崖道・通常エンカウント統合

STATUS: VERIFY
PRIORITY: P1
TYPE: GAMEPLAY / BATTLE-INTEGRATION / WORLD-CONTINUITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY

REQ-081で `northCliffRoad` はwalkableな第一章本線地域として公開されたが、fresh base combat realityでは `encounterMap()` の対象は `field / forest / deepForest / mistTrail / observation / evacRoute` に限定されている。

このままでは新しい本線地域だけ通常エンカウントがなく、既存の探索→戦闘リズムから不自然に外れる。

## PURPOSE

北の崖道を既存canonical random encounter systemへ接続する。

新しい正式敵アートを必要とする新敵は作らず、直前地域 `evacRoute` の既存敵poolを再利用して、REQ-006の既存original enemy art coverageを壊さない。

## REQUIREMENTS

- `encounterMap()` が `northCliffRoad` をtrueとして扱う。
- `enemyPool()` は `northCliffRoad` で既存 `EVAC_ENEMIES` を返す。
- 新敵名・仮emoji敵を増やさない。
- 崖道entry直後にはencounter graceを設定し、遷移直後の即戦闘を避ける。
- 崖道から退避路へ戻る時も安全なgraceを維持する。
- canonical `startBattle / enemyTurn / win / runAway` を複製しない。
- REQ-001 battle-transition stale pointer cleanupを維持する。
- save compatibilityを変更しない。
- protected canonを変更しない。

## ACCEPTANCE

- [x] `encounterMap()` northCliffRoad=true
- [x] `enemyPool()` northCliffRoad returns exact existing EVAC_ENEMIES authority
- [x] entry/return grace present
- [x] no new enemy identity/art dependency
- [x] assembled browser regression PASS
- [x] 390x844 floating-touch/fullscreen regression PASS
- [x] Pages SUCCESS
- [ ] Owner physical iPhone feel remains PENDING

## IMPLEMENTATION / VERIFICATION EVIDENCE

- Registration: `7182c406366e7e172232a31cfbd7bf9059737959`.
- Activation: `e34c930f71be1b2df24fafd2e524e4e3b3bc4612`.
- Canonical encounter integration: `370c234eacb2d5ece7e002424ec873819f2faf41`.
- Dedicated acceptance added: `6ec7fdef82f019f66489e0649b7ead31796472d6`.
- Pages/assembled gate added: `be83533abedca61b4cfcf239de40d4db8943b805`.
- Acceptance semantics repair: `3182d05ddd1d20466bf3c600270b46943554d0fd`; the test now correctly accounts for `move()` consuming one configured encounter-grace count after a successful transition instead of falsely requiring the pre-move value to remain unchanged.
- GitHub Pages run `34025554356` for HEAD `3182d05ddd1d20466bf3c600270b46943554d0fd`: SUCCESS.
- The successful run passed sequential patch validation, collision-safe add-ons, static regression, add-on contract, autosave/PWA/raster/Luke gates, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, dedicated REQ-081 north cliff road smoke, dedicated REQ-082 north cliff encounters smoke, upload and Pages deploy.
- No Owner physical iPhone PASS is claimed.
