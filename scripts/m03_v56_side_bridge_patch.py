from pathlib import Path
p=Path('prototypes/modern-3d/index.html')
s=p.read_text()
old="const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(4.9,-4.7,Math.PI/2-.16,false);"
new="const bridgeMain=bridgeAt(-1.35,1.1,0,true);const bridgeRight=bridgeAt(4.9,-4.7,Math.PI/2-.16,false);bridgeRight.position.y=1.08;"
if old not in s:
    raise SystemExit('side bridge anchor missing')
s=s.replace(old,new,1)
s=s.replace('M03 Composition Rebuild v55','M03 Composition Rebuild v56',1)
s=s.replace("m03-quality-regate-v55-bridge-world","m03-quality-regate-v56-side-bridge",1)
p.write_text(s)
