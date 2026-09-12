from pathlib import Path

p = Path('prototypes/modern-3d/index.html')
s = p.read_text()
anchor = "bridgeBankSill(-4.03,1.03,7601);bridgeBankSill(6.10,-.26,7641);"
if anchor not in s:
    raise SystemExit('bridge sill anchor missing')
insert = r'''bridgeBankSill(-4.03,1.03,7601);bridgeBankSill(6.10,-.26,7641);
// v55 quality-regate: terrain shoulders receive both bridge landings.
bank(771,5.3,4.8,-4.55,1.05,-4.65,1,.10);
bank(779,4.8,4.5,1.88,1.00,-4.55,1,-.10);
bank(787,5.5,4.6,-4.65,-.22,6.70,-1,.08);
bank(797,5.0,4.3,1.95,-.24,6.62,-1,-.09);
const landingFernN1=createTargetFernPatch({seed:801,count:26,radius:1.55});landingFernN1.position.set(-4.15,1.10,-4.15);scene.add(landingFernN1);
const landingFernN2=createTargetFernPatch({seed:809,count:24,radius:1.45});landingFernN2.position.set(1.45,1.08,-4.12);scene.add(landingFernN2);
const landingFernS1=createTargetFernPatch({seed:821,count:24,radius:1.50});landingFernS1.position.set(-4.10,-.14,6.30);scene.add(landingFernS1);
const landingFernS2=createTargetFernPatch({seed:827,count:22,radius:1.42});landingFernS2.position.set(1.40,-.14,6.24);scene.add(landingFernS2);
for(const [i,x,z,y,sc] of [[0,-3.82,-3.92,1.05,.48],[1,1.12,-3.94,1.03,.46],[2,-3.86,6.12,-.20,.50],[3,1.16,6.08,-.20,.47]]){const r=createRockCluster({seed:8300+i*23,scale:sc});r.position.set(x,y,z);scene.add(r);}'''
s = s.replace(anchor, insert, 1)
dup = "pathRibbon([[-1.35,-2.0],[-2.0,-3.6],[-3.4,-5.1],[-2.7,-6.8],[-1.4,-8.5],[-2.2,-10.4]],.72,1.13);pathRibbon([[-2.2,-10.35],[-1.0,-11.2],[.2,-12.1],[1.0,-13.0]],.64,2.28);pathRibbon([[-1.35,6.0],[-.75,7.8],[-1.8,9.8],[-.55,12.0],[-1.35,15.4]],1.08,-.20);"
if dup in s:
    s = s.replace(dup, "pathRibbon([[-2.2,-10.35],[-1.0,-11.2],[.2,-12.1],[1.0,-13.0]],.64,2.28);", 1)
s = s.replace('M03 Composition Rebuild v49', 'M03 Composition Rebuild v55', 1)
s = s.replace("document.documentElement.dataset.m05Variant='m03-composition-v42-wide-massing'", "document.documentElement.dataset.m05Variant='m03-quality-regate-v55-bridge-world'", 1)
p.write_text(s)
