# CREDENTIAL_BOUNDARY_TEST:v1 / PRE-CUTOVER FAIL EVIDENCE

**Date:** 2026-09-20 JST  
**Result:** FAIL / boundary not yet satisfied  
**Scope:** test-only canary resources, production Environment Lanes untouched

## Test

Current Scheduled Agent GitHub connection was used against Target Repository `nisiyasu/-luke-quest`.

### Contents direct-write canary

Branch:
`test/env-visual-credential-boundary-canary`

File:
`AGENT_DIRECT_WRITE_CANARY.txt`

Commit:
`0c293c5b96ac9e03f4839cc5cf781e0f6b463d09`

Result:
**WRITE SUCCEEDED**

Expected after cutover:
**WRITE MUST BE DENIED**

### Issue direct-write canary

Infrastructure Issue:
`#98`

Comment:
`5745772476`

Result:
**WRITE SUCCEEDED**

Expected after cutover:
**WRITE MUST BE DENIED**

## Interpretation

The current Scheduled Agent credential still has direct Target Repository mutation capability.

Therefore the contract requirement

`FENCED MUTATION GATEWAY = sole persistent mutation entry point`

is not yet enforceable at credential level.

Prompt instructions alone do not satisfy this requirement.

## Production safety

No production Environment implementation/control/evidence branch was used for this canary.

Village / Castle / Dungeon existing Scheduled Runs remain ACTIVE by Owner direction.

New Gateway production cutover remains disabled.

## Required retest

After credential separation, repeat:

1. direct Target branch write → DENIED
2. direct Environment Issue write → DENIED
3. Request Channel write → ALLOWED
4. Gateway request consume → ALLOWED
5. Gateway allowlisted mutation → ALLOWED
6. stale Epoch → DENIED

Only then record `CREDENTIAL_BOUNDARY_TEST:v1 = PASS`.
