# Visual Evidence Contract / 視覚証拠契約

1. Targetはfull identityで固定する。
2. Actualはexact implementation HEADから生成する。
3. Canonical comparisonは941x1672 / DPR=1 / no crop / no padding / fullPage=false。
4. P0中心差: x/y各2%以内。
5. 主対象占有率差: ±5%以内。
6. horizon/reference line: 2%以内。
7. P0 occlusion order: 100%一致。
8. major silhouette: mask IoU 85%以上。
9. AIの主観評価だけでPASSしない。
10. human visual scoreとnumeric metricsの両方を保存する。
11. Evidence SetにTarget, Actual, overlay/diff, measurement, verdict, residual gapsを含む。
12. 後段変更で前段metricが外れた場合、前段GateをINVALIDATEDとして再OPENする。
13. iPhone最終Gateは物理実機captureを必須とする。
