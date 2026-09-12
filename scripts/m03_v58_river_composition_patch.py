from pathlib import Path
p=Path('prototypes/modern-3d/index.html')
s=p.read_text()
repls={
"bank(607,5.0,5.2,4.95,1.34,-8.5,1,-.20);":"bank(607,3.2,3.4,7.0,1.42,-9.2,1,-.20);",
"const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(3.6,-6.1,Math.PI/2-.16,false);bridgeRight.position.y=.78;bank(880,3.8,3.4,.75,1.03,-6.0,1,.05);bank(887,4.2,3.8,6.25,1.45,-6.2,1,-.04);":"const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(3.25,-7.0,Math.PI/2-.16,false);bridgeRight.position.y=.72;bank(880,2.5,2.7,.35,1.02,-7.0,1,.05);bank(887,2.8,2.9,6.20,1.48,-7.1,1,-.04);",
"const waterLower=createTargetWaterV3({seed:171,width:7.2,depth:17.5,practical:practicalPreset});waterLower.position.set(-1.35,.04,8.8);scene.add(waterLower);":"const waterLower=createTargetWaterV3({seed:171,width:9.6,depth:17.5,practical:practicalPreset});waterLower.position.set(-3.55,.04,8.8);scene.add(waterLower);"
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit('missing anchor: '+old[:90])
    s=s.replace(old,new,1)
s=s.replace('M03 Composition Rebuild v57','M03 Composition Rebuild v58',1)
s=s.replace("m03-quality-regate-v57-side-bridge-landings","m03-quality-regate-v58-river-composition",1)
p.write_text(s)
