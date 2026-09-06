# REQ-126 — AMBIENT MUSIC VOLUME CONTROL

STATUS: VERIFY
PRIORITY: P2
TYPE: PLAYER_VISIBLE / AUDIO / ACCESSIBILITY / UX
SOURCE_REQUIREMENT: `requirements/REQ-036_ORIGINAL_AMBIENT_MUSIC.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

REQ-036 provides explicit MUSIC ON/OFF, but fresh implementation audit found no in-game volume control. Every synthesized voice previously used a fixed gain and relied on device volume.

REQ-126 adds compact in-game ambient-music volume control without changing autoplay safety, SFX ownership, gameplay state, save schema, story, or touch authority.

## 1. IMPLEMENTED BEHAVIOR

Implementation:
- `addons/original-ambient-music.js`
- implementation commit `f0c31a4e48b6de25f5e59b118250ec194188ebec`
- acceptance-smoke commit `194ed85065652ac83c176b1a01b431a384f6e82e`

World music UI now exposes a compact `VOL LOW / MID / HIGH` button beside the existing MUSIC toggle.

- exact volume levels: LOW / MID / HIGH
- default: MID
- bounded multipliers: LOW `0.55`, MID `0.78`, HIGH `1.0`
- preference storage: `lq-music-volume-v1`, independent from MUSIC ON/OFF storage
- pressing volume cycles level only; it does not create/unlock an AudioContext and does not start music
- control exists only in world gameplay
- real `button.lqExplicitControl`, preserving world-action exclusion
- compact safe-area overlay; no document-flow row

Ambient oscillator gain is multiplied by the bounded selected level. Existing SFX ownership is untouched and no second AudioContext is created.

## 2. AUTOMATED ACCEPTANCE

`addons/zzzzzzzzzzzz-original-ambient-music-smoke.js` verifies:

1. levels exactly `LOW,MID,HIGH` and default MID;
2. all multipliers finite, positive and <=1;
3. volume button exists inside world `gameShell` and is an explicit control;
4. cycling volume changes level without unlocking or starting music;
5. volume storage key is separate from MUSIC preference;
6. original synth / no external audio remains true;
7. autoplay remains false and pre-gesture unlocked remains false;
8. safe/wild themes remain present;
9. world viewport remains >80% height;
10. input wrappers and existing SFX ownership remain unchanged.

Public gate:
- Pages run `34064647550`: SUCCESS
- sequential patches v08-v80: PASS
- sequential patches v81-v120: PASS
- sequential patches v121-plus: PASS
- collision-safe add-ons: PASS
- static regression guard: PASS
- add-on contract guard: PASS
- REQ-063 autosave bootstrap: PASS
- PWA validation: PASS
- raster / approved Luke asset validation: PASS
- assembled browser smoke: PASS
- 390x844 floating touch + iPhone world visual-liveness: PASS
- REQ-081 north cliff road: PASS
- REQ-082 north cliff encounters: PASS
- upload/deploy GitHub Pages: PASS

## 3. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES_AUTOMATED_PUBLIC
PUBLIC_PAGES_GATE: PASS
PUBLIC_PAGES_RUN: `34064647550`
IOS_PHYSICAL_AUDIO_VERIFICATION: PENDING
TOUCH_AUTHORITY_CHANGED: NO
SFX_OWNERSHIP_CHANGED: NO
SAVE_CHANGED: NO
STORY_CHANGED: NO

Remain `VERIFY` until Owner physical/subjetive iPhone sound and UI check or project verification policy allows automated/public acceptance to close it.

EOF
