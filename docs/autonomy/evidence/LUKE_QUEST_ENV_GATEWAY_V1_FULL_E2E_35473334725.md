# Production Gateway v1 Isolated Full E2E Evidence

**Run:** `35473334725`  
**Conclusion:** PASS  
**Head:** `77882005b53f9dea15060ccb0bd3527d9739f243`  
**Artifact:** `10593617003 / gateway-v1-isolated-full-e2e-35473334725`  
**Artifact digest:** `sha256:63c6a4dc77f9d72ddc5be6158ba32a6351ba76564b4b3f3ad08896ed7de8db65`  
**Durable Evidence Set SHA256:** `bee3ce7fe7247c9d68920bf74dd2591200b613a671887dc5e9cd6cb084309081`

## Test-only resources

- Parent harness: #98
- Child harness: #99
- Control: `test/env-visual-gateway-v1-control`
- Implementation: `test/env-visual-gateway-v1-implementation`
- Evidence: `test/env-visual-gateway-v1-evidence`

## Passed sequence

1. LEASE_ACQUIRE: PASS / epoch 1
2. ISSUE_COMMENT: PASS
3. IMPLEMENTATION_FILE_UPDATE: PASS / CAS head `b40083f9212233bb565665d05fb8924527fbdf4a`
4. LEASE_HEARTBEAT: PASS
5. EVIDENCE_IDENTIFIERS_RESERVE: PASS
   - EVIDENCE_ID `EV-35473334725`
   - ADOPTION_ID `AD-35473334725`
6. DURABLE_EVIDENCE_PUBLISH: PASS
7. fresh read-back / evidence-set hash: PASS
8. EVIDENCE_ADOPT: PASS / `CONFIRMED_APPLIED`
9. ISSUE_CLOSE #99: PASS
10. PARENT_PROGRESS_UPDATE #98 comment `5745746112`: PASS
11. Adoption state `COMPLETE`: PASS
12. LEASE_RELEASE: PASS
13. New owner acquisition: PASS / epoch 2
14. old epoch 1 mutation: REJECTED / PASS
15. FINAL_RELEASE: PASS

## Production isolation check

After this run, production Control Branches remain:

- village: `RELEASED / PRODUCTION_ENABLED=false`, lease blob `5ba74e2f34b0f9138a2fa0e5e2789b7af77a75d8`
- castle: `RELEASED / PRODUCTION_ENABLED=false`, lease blob `ce9028c47e9f2fd2069ddba55b247f7beebe65ec`
- dungeon: `RELEASED / PRODUCTION_ENABLED=false`, lease blob `1b6291b509aaf5c5ceba695c736fef3cca4e7b57`
- production evidence store README blob: `00a0a522ea8008af6a6705e67d394b9f3422ba53`

No production Environment Lane was enabled by this test.

## Gateway implementation identity

`tools/env_visual_gateway/fenced_gateway.py` blob:
`29c56e9321fb39fb12bc41f7b92dd3ca7ba3b5c2`
