from pathlib import Path
p=Path('prototypes/modern-3d/index.html')
s=p.read_text()
repls={
"nearFieldMass(-6.15,11.6,4.25,1.25,.18);nearFieldMass(4.85,12.0,3.65,.95,-.14);nearFieldMass(-5.2,7.7,2.75,.85,.31);nearFieldMass(7.4,7.8,3.45,1.08,-.18);nearFieldMass(-8.0,7.2,3.35,1.02,.16);":"nearFieldMass(-8.1,12.4,2.55,.92,.18);nearFieldMass(5.15,12.0,4.15,1.10,-.14);nearFieldMass(-7.6,7.9,1.85,.70,.31);nearFieldMass(7.1,7.8,4.05,1.18,-.18);nearFieldMass(-9.4,7.0,2.05,.76,.16);",
"nearFieldMass(-7.25,16.2,4.15,1.18,.23);nearFieldMass(6.55,16.0,3.95,1.12,-.21);nearFieldMass(-8.75,12.8,2.65,.82,.12);nearFieldMass(8.35,12.7,2.55,.78,-.10);":"nearFieldMass(-9.0,16.4,2.45,.86,.23);nearFieldMass(6.45,16.0,4.35,1.18,-.21);nearFieldMass(-10.0,12.9,1.75,.66,.12);nearFieldMass(8.15,12.7,3.05,.88,-.10);",
"const waterLower=createTargetWaterV3({width:9.6,depth:17.5,seed:317});waterLower.position.set(-3.55,.04,8.8);scene.add(waterLower);":"const waterLower=createTargetWaterV3({width:8.6,depth:20.5,seed:317});waterLower.position.set(-4.65,.04,9.6);waterLower.rotation.y=.08;scene.add(waterLower);",
"const waterUpperRight=createTargetWaterV3({width:7.0,depth:19,seed:331});waterUpperRight.position.set(7.2,.05,-8.3);waterUpperRight.rotation.y=-.34;scene.add(waterUpperRight);":"const waterUpperRight=createTargetWaterV3({width:9.4,depth:18.5,seed:331});waterUpperRight.position.set(4.45,.05,-8.2);waterUpperRight.rotation.y=-.20;scene.add(waterUpperRight);",
"bank(533,10,12,8.9,1.55,-11.0,1,-Math.PI/2);":"bank(533,6.8,9.0,9.8,1.55,-11.4,1,-Math.PI/2);",
"bank(607,3.2,3.4,7.0,1.42,-9.2,1,-.20);":"bank(607,2.4,2.8,8.0,1.42,-9.5,1,-.20);"
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit('missing anchor: '+old[:100])
    s=s.replace(old,new,1)
s=s.replace('M03 Composition Rebuild v58','M03 Composition Rebuild v59',1)
s=s.replace("m03-quality-regate-v58-river-composition","m03-quality-regate-v59-water-topology",1)
p.write_text(s)
