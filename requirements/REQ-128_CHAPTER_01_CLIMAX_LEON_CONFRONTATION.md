# REQ-128 — Chapter 1 Climax / Leon Confrontation

- ID: `REQ-128`
- TITLE: `Chapter 1 Climax — Leon Confrontation / Sister Interruption / Return to Aldia`
- PRIORITY: `P1`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-07 JST`
- TYPE: `PLAYER_VISIBLE / STORY / CHAPTER_01 / CLIMAX / BATTLE / HANDOFF`
- REPOSITORY: `nisiyasu/-luke-quest`
- CANONICAL_BRANCH: `main`
- OWNER_AUTHORITY: `STORY_CANON.md / CHAPTER_01_CORE_CONFIRMED`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

---

## 0. PURPOSE

Implement the Owner-confirmed Chapter 1 climax as an actual playable, recoverable sequence using the existing Chapter 1 route and current runtime authorities.

This requirement exists because `STORY_CANON.md` permits confirmed story beats to be implemented only through an explicit dedicated Requirement. It must not invent Chapter 2.

---

## 1. FRESH-AUDIT REQUIREMENT

Before implementation, fresh-read and inspect at minimum:

1. repository metadata / default branch / HEAD;
2. `AUTONOMOUS_DEV_DIRECTIVE.md`;
3. `STORY_CANON.md`;
4. `WORK_MANAGER.md` / `WORK_QUEUE.md` / `CURRENT.md`;
5. current Chapter 1 north-route maps and transition authority;
6. current Leon encounter/dialogue authority;
7. battle entry/exit and defeat/recovery authority;
8. dialogue/cutscene/fade/audio authorities;
9. save/autosave/migration authorities;
10. REQ-021 / REQ-022 / REQ-001 input/fullscreen authorities.

Recover actual current behavior before editing. Reuse existing published maps and systems where possible. Do not extend the generic north pursuit route merely to stage this climax.

---

## 2. CONFIRMED STORY BEATS

The following meaning is fixed by Owner-approved Story Canon and must remain true:

1. Luke eventually reaches Leon during Chapter 1.
2. Leon learns that Luke was chosen as the hero.
3. Leon's accumulated resentment, pressure and identity collapse erupt.
4. Leon attacks Luke.
5. Luke does not want to fight; his behavior remains defensive, confused and non-hostile.
6. Leon's sister physically steps between them.
7. Leon accidentally wounds his sister.
8. The injury is **not fatal** at this point.
9. Leon immediately regains awareness of what he is doing.
10. Luke prioritizes helping the injured sister rather than condemning Leon.
11. Eleanor remains outwardly benevolent; her hidden past is not revealed.
12. Luke, Leon, Leon's sister and Eleanor return to the kingdom.
13. This return is the end of Chapter 1.

---

## 3. PROTECTED UNKNOWN / DO NOT INVENT

The following remain `PENDING` and must not be autonomously fixed by this Requirement:

- Leon's sister's name;
- her exact age;
- her detailed personality beyond confirmed family concern / future role boundaries;
- her exact future spell list;
- exact formal party-join chapter/timing;
- Chapter 2 events, objective, villain moves or travel route.

Use a neutral story label such as `レオンの妹` where a visible identifier is required.

---

## 4. PLAYABLE CLIMAX DESIGN BOUNDARY

### A. Reach Leon

Use the current approved Chapter 1 playable route and existing Leon-facing location/encounter authority. Do not create another generic north pursuit extension unless fresh implementation reality proves a tiny staging map is strictly necessary and canon-safe.

The player must be able to reach the climax without walkthrough knowledge or a hidden unmarked prerequisite.

### B. Revelation and confrontation

The scene must clearly communicate that Leon learns Luke was chosen as hero and emotionally breaks under accumulated pressure. Avoid turning Leon into a cartoon villain; his attack is an emotional collapse rooted in already-established pressure and inferiority.

### C. Defensive combat

Prefer an interactive confrontation using existing canonical battle systems if safe. The gameplay must communicate that Luke is defending rather than trying to kill Leon.

Required safety:

- no permanent tutorial/reward leak;
- no accidental Leon death state;
- no ordinary random-battle reward framing for the confrontation;
- battle exit must deterministically enter the sister-interruption story beat;
- player defeat/retry path must not corrupt canonical Chapter 1 state.

If the current battle engine cannot safely represent a nonlethal defensive duel without invasive mutation, use the smallest interactive canon-compatible alternative and record the constraint. Do not fake a normal kill battle.

### D. Sister interruption

After the confrontation reaches its approved trigger, Leon's sister physically enters between them. Leon accidentally wounds her. Keep the injury visibly serious enough to stop the conflict but explicitly nonfatal at this point.

Do not sexualize, sensationalize or graphically depict the injury.

### E. Emotional resolution

Leon immediately recognizes what he has done. Luke's priority is helping her, not condemning Leon. Preserve Luke's natural personality and restraint.

### F. Return / Chapter 1 end

Resolve the sequence into a safe return to Aldia/kingdom using current transition/save authorities. Eleanor remains publicly benevolent. End Chapter 1 clearly without inventing Chapter 2 content.

A chapter-end card or equivalent presentation is allowed. The next-state objective must not fabricate Chapter 2. A neutral `Chapter 1 complete / continuation pending` state is acceptable if current architecture requires a post-climax landing state.

---

## 5. INPUT / MOBILE / SAVE SAFETY

Protect:

- REQ-021 Tap Anywhere Action;
- REQ-022 iPhone Fullscreen World UI;
- REQ-001 Dynamic Touch Controller;
- current canonical `action()`;
- central movement stop/cleanup;
- save/autosave/import/manual-backup compatibility;
- existing Chapter 1 progress flags unless a minimal new climax flag is required.

Cutscene/dialogue/battle transitions must clean active movement/pointer ownership and must not leave the player walking during story beats.

Existing progressed saves must not be rewound into the climax. If a new completion flag is required, migrate/infer old later-progress states conservatively.

---

## 6. PRESENTATION QUALITY

This is a Chapter climax, not another ordinary NPC dialogue.

Use existing safe presentation authorities where compatible:

- dialogue portraits / staging;
- fade/transition;
- restrained camera focus;
- existing original audio/ambient/SFX;
- controlled pause/silence;
- battle feedback;
- readable iPhone portrait layout;
- chapter-end title/card.

Do not copy another game's scene, dialogue, music or cinematic staging.

---

## 7. REQUIRED AUTOMATED VERIFICATION

Before promotion to `VERIFY`, prove at minimum:

- JavaScript syntax / addon contract;
- assembled public script order;
- current route can reach the climax trigger;
- Leon learns Luke is Hero before the attack;
- confrontation is nonlethal and deterministic;
- no ordinary battle reward/state leak;
- sister interruption occurs exactly once;
- injury state is nonfatal;
- Leon exits attack state / conflict stops;
- Luke prioritizes aid in resulting dialogue/state;
- return-to-kingdom state is reachable;
- Chapter 1 completion is persisted safely;
- no Chapter 2 content is invented;
- save/load round-trip;
- REQ-021 / REQ-022 / REQ-001 regression coverage;
- 390x844 browser/touch/fullscreen coverage;
- render-liveness where applicable;
- Pages deployment SUCCESS.

Do not claim physical iPhone PASS from CI.

---

## 8. COMPLETION CONDITIONS

Move to `VERIFY` only when:

- the confirmed Chapter 1 climax is playable end-to-end;
- the sequence uses actual current Chapter 1 reality rather than a disconnected demo;
- Leon remains sympathetic/tragic rather than rewritten as an evil caricature;
- the confrontation cannot accidentally resolve as a normal lethal/reward battle;
- sister interruption and nonfatal wound occur once and persist correctly;
- return to the kingdom completes Chapter 1;
- no Chapter 2 story is invented;
- P0 touch/fullscreen/input authorities remain healthy;
- relevant browser and Pages gates succeed;
- `IOS_PHYSICAL_VERIFICATION` remains `PENDING` until Owner confirms device behavior.

---

## 9. IMPLEMENTATION / VERIFICATION CHECKPOINT

- Runtime checkpoint: `8b7700df1c0c884bd6afc4ed7035d8db1162eaeb` — existing `windStairRidge` north boundary starts the Chapter 1 climax; no extra chase map was added.
- Nonlethal confrontation is a dedicated defensive interaction (`身を守る` / `呼びかける`) and deliberately bypasses normal `win()` / EXP / G / wins reward authority.
- Browser audit found and repaired the real `front()` API shape mismatch at `c6840d9d34a3a3c4682c812fe7c0f7d168075461`.
- Smoke timing was aligned to the exact visible hero-revelation / sister-injury beats at `60b8eeb5ba01a10afa32ec8c72aaa475f54c29bf`.
- REQ-128 Chapter 1 Climax Gate run `34087353989`: SUCCESS on `60b8eeb5...`.
- Pages run `34087354048` (#1241): SUCCESS on `60b8eeb5...`.
- REQ-121 route regression run `34087354051`: SUCCESS on `60b8eeb5...`.
- Render Liveness run `34087354020`: SUCCESS on `60b8eeb5...`.
- Sister remains visible only as `レオンの妹`; no name/age was invented.
- Chapter 2 remains unimplemented/uninvented.
- `IOS_PHYSICAL_VERIFICATION=PENDING`.

---

## 10. DO NOT

- Do not name Leon's sister autonomously.
- Do not decide her age autonomously.
- Do not formally add Leon or his sister to the party in an unapproved chapter.
- Do not invent Chapter 2.
- Do not reveal Eleanor's hidden crimes/past.
- Do not reveal Glenn's protected family relation.
- Do not make Leon a normal killable enemy with EXP/G/drop rewards.
- Do not create a duplicate input/battle/save authority.
- Do not regress existing progressed saves.
- Do not extend the generic north pursuit route merely because more map can be built.

EOF
