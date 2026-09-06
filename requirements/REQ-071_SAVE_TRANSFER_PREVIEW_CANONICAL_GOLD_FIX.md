# REQ-071 — Save Transfer Preview Canonical Gold Fix

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / TRANSFER / CONSISTENCY-BUG / TEST-QUALITY
OWNER_REQUEST: SELF_AUDIT_REPAIR
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT

Fresh canonical base audit found that LUKE QUEST uses `gold` as the player currency field (`DEFAULT.gold`, status UI `s.gold`, enemy rewards, shops and manual backups). REQ-068 import preview instead rendered `next.g`, and its dedicated smoke also injected/asserted `s.g`. Therefore implementation and test could agree with each other while disagreeing with canonical runtime state, producing a false-green preview that can show `0G` for real saves.

## 1. REQUIRED REPAIR

- Import preview must use canonical `gold` first.
- Legacy/noncanonical `g` may be accepted only as a compatibility fallback if `gold` is genuinely absent/non-finite; it must not override valid canonical `gold`.
- Dedicated acceptance must construct/assert a real canonical `gold` save, not create a fake `g` property.
- Add an adversarial case where both `gold` and `g` exist with different values and prove canonical `gold` wins.
- No mutation to transfer schema, autosave, economy or import behavior.

## 2. COMPLETION

Targeted acceptance + assembled browser regression + 390x844 touch/world regression + Pages SUCCESS. Then mark VERIFY and continue.

## 3. IMPLEMENTATION / VERIFICATION EVIDENCE

- `addons/save-transfer-preview.js` now resolves currency through `canonicalGold(next)`: valid canonical `gold` wins; legacy/noncanonical `g` is fallback only when canonical `gold` is absent/non-finite.
- The REQ-068 dedicated smoke was hardened to use real canonical `s.gold=321` and explicitly delete `s.g` before export, so the test can no longer become green by inventing the same wrong alias as the implementation.
- Adversarial field-boundary checks prove `{gold:654,g:999}` resolves to `654`, legacy `{g:999}` remains a compatibility fallback, and invalid canonical gold can safely fall back.
- An initial adversarial-test revision incorrectly assumed a nonexistent `LQ1:` wire prefix; self-audit fetched the real REQ-060 base64url envelope implementation and repaired the test before accepting CI evidence.
- Checkpoints:
  - `24fa3d25688f74daee821afdd529b4c4786410d0` — requirement registration.
  - `582148dac57d6afa116f716ddece804c60d5d171` — canonical `gold` implementation repair.
  - `a5bed27ed21f82fbf0c1cd1bb8d12c366fe322e5` — first smoke hardening attempt.
  - `93fe2cc973b85b2c837ae40af69f01ce60781b55` — repaired adversarial acceptance using the actual REQ-060 contract.
- Pages workflow run `34018266479`: SUCCESS. Sequential patches, collision-safe add-ons, static/add-on contracts, REQ-063 guard, raster/Luke asset checks, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, upload and Pages deployment all passed.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
