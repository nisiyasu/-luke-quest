# M10 Measurement — CI proxy and package verification

Source evidence: run `34666950635`, candidate `1d82ed62c3e60c7e2fed3052f8d0c33e5c0c3758`.
Physical iPhone measurement is not claimed; `IOS_PHYSICAL_VERIFICATION` remains `PENDING`.

| Surface | Preset | Source DPR | Effective DPR | Shadow | Median ms | p95 ms | Calls | Triangles | Textures | Samples | PNG bytes |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| source | high | 1.50 | 1.50 | 2048 | 1683.30 | 2216.60 | 6202 | 727743 | 4 | 24 | 411501 |
| source | practical | 2.00 | 1.25 | 1024 | 1316.60 | 1916.60 | 6081 | 669014 | 4 | 51 | 404620 |
| package | high | 1.50 | 1.50 | 2048 | 1250.00 | 1583.20 | 6202 | 727743 | 4 | 36 | 411475 |
| package | practical | 2.00 | 1.25 | 1024 | 1016.60 | 1283.30 | 6169 | 706579 | 4 | 60 | 408461 |

- HIGH and PRACTICAL are measured separately.
- Source and single-HTML package both booted, moved and rendered at 390×844.
- Browser CI values are proxy evidence, not physical iPhone results.
