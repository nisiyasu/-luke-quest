# Clarify / クラリファイ: 仕様曖昧性の解消記録

## 結論

Owner要件 v1.0 と追加決定「旧視覚実装を改修せず白箱から再構築する」を基に、実装前に次を固定する。

1. **主要シルエット85%以上**は、canonical viewで生成した二値maskのIntersection over Union（IoU）を第一計測方式とする。
2. **主対象占有率±5%**はTarget ROI面積に対するActual ROI面積の相対差として計測する。
3. **P0中心差2%**はviewport幅・高さそれぞれに対するnormalized center coordinate差で判定する。
4. **人間視覚評価4以上**は全12項目を記録し、P0/P1に直接関係する項目およびoverall impressionを4以上とする。その他の項目で3以下がある場合は残差異として明記する。
5. **追加2視点**はcanonical viewと明確に異なる左右/前後の視差が得られる位置とし、同じcameraの微小移動で代替しない。
6. **iPhone 13相当 / iPhone 15 Pro相当 / 現行Pro相当**は実機profileとしてテスト時に具体的機種・OS・browser buildをEvidenceへ保存する。製品要件の端末階層は維持する。
7. **旧コード削除**はarchive/tag作成と再利用候補inventory完了後にのみ実行する。削除を先にしない。
8. **Three.js**はPlanの第一候補。Technical Spikeで要求未達ならPlayCanvas/Babylon.js等との置換比較Gateを発火する。
9. **WebGPU**はcapability checkと実機比較で採否を決め、OS/browser名だけで選択しない。
10. **Reference Set更新**はOwner decisionが必要。実装側は自動更新しない。

## 未解決扱いにしない事項

上記はOwner要件の意味を変更するのではなく、測定方法と実行順を具体化するclarificationとして扱う。許容値そのものはOwner要件 v1.0を維持する。
