# REQ-126 — AMBIENT MUSIC VOLUME CONTROL

STATUS: IN_PROGRESS
PRIORITY: P2
TYPE: PLAYER_VISIBLE / AUDIO / ACCESSIBILITY / UX
SOURCE_REQUIREMENT: `requirements/REQ-036_ORIGINAL_AMBIENT_MUSIC.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

REQ-036 provides explicit MUSIC ON/OFF, but fresh implementation audit found no in-game volume control. Every synthesized voice currently uses a fixed gain and relies on device volume.

Add a compact in-game ambient-music volume control without changing autoplay safety, SFX ownership, gameplay state, save schema, story, or touch authority.

## 1. REQUIRED BEHAVIOR

- world music UI exposes a compact volume control beside the existing MUSIC toggle;
- volume offers three understandable levels: LOW / MID / HIGH;
- default is MID;
- volume choice persists in localStorage independently from music ON/OFF preference;
- changing volume never starts audio by itself and therefore never bypasses user-gesture/autoplay policy;
- no volume control is shown outside world gameplay;
- control is a real button and therefore remains excluded from world-action pointer handling.

## 2. AUDIO SAFETY

- preserve REQ-036 original-synth/no-external-audio model;
- preserve existing SFX `LQ_sfx` ownership;
- do not create a second AudioContext just for volume;
- apply volume as a bounded multiplier to ambient tone gain only;
- do not permit zero/negative/NaN/unbounded gain;
- no autoplay and no implicit MUSIC ON from changing volume.

## 3. UI SAFETY

- no permanent document-flow row;
- safe-area aware overlay inside gameShell;
- compact iPhone portrait footprint;
- no map/world viewport shrink;
- no touch-controller/menu/action overlap introduced.

## 4. AUTOMATED ACCEPTANCE

Verify at minimum:

1. volume levels are exactly LOW/MID/HIGH;
2. default level is MID;
3. all multipliers are finite, positive and <= 1;
4. volume button exists in world gameShell and is an explicit control;
5. cycling volume does not unlock/start music;
6. selected level is persisted separately from ON/OFF preference;
7. existing REQ-036 autoplay false / SFX ownership / two-theme checks remain PASS;
8. assembled browser and 390x844 touch/fullscreen regression pass;
9. public Pages deployment succeeds before VERIFY.

## 5. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PUBLIC_PAGES_GATE: PENDING
IOS_PHYSICAL_AUDIO_VERIFICATION: PENDING

EOF
