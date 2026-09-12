from pathlib import Path
p=Path('prototypes/modern-3d/index.html')
s=p.read_text()
old="const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(4.9,-4.7,Math.PI/2-.16,false);bridgeRight.position.y=1.08;"
new="const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(3.6,-6.1,Math.PI/2-.16,false);bridgeRight.position.y=.78;bank(880,3.8,3.4,.75,1.03,-6.0,1,.05);bank(887,4.2,3.8,6.25,1.45,-6.2,1,-.04);"
if old not in s:
    raise SystemExit('v56 side bridge anchor missing')
s=s.replace(old,new,1)
s=s.replace('M03 Composition Rebuild v56','M03 Composition Rebuild v57',1)
s=s.replace("m03-quality-regate-v56-side-bridge","m03-quality-regate-v57-side-bridge-landings",1)
p.write_text(s)
