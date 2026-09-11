import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function deform(g,r,a=.22){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(r()-.5)*a),y*(1+(r()-.5)*a*.72),z*(1+(r()-.5)*a))}p.needsUpdate=true;g.computeVertexNormals();return g}
function shadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const grass=new THREE.MeshStandardMaterial({color:0x668947,roughness:.99});
const grassDark=new THREE.MeshStandardMaterial({color:0x486b39,roughness:1});
const soil=new THREE.MeshStandardMaterial({color:0x514332,roughness:1});
const moss=new THREE.MeshStandardMaterial({color:0x587941,roughness:1});
const rockMats=[0x515b59,0x67706a,0x77776b,0x5e665f,0x6c7065].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.95}));
const fernMats=[0x315d2e,0x6f984b].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98,side:THREE.DoubleSide}));

function makeFernPatch(r,scale=.7,count=14){
  const g=new THREE.Group();
  const blade=new THREE.PlaneGeometry(.17,1,1,3);
  for(let i=0;i<count;i++){
    const a=r()*Math.PI*2,rad=Math.sqrt(r())*.76*scale,h=(.55+r()*.65)*scale;
    const m=new THREE.Mesh(blade,fernMats[i%2]);
    m.position.set(Math.cos(a)*rad,h*.43,Math.sin(a)*rad);
    m.rotation.set(-(.22+r()*.42),-a,0);
    m.scale.set(.72+r()*.42,h,1);
    m.castShadow=false;m.receiveShadow=true;g.add(m);
  }
  return g;
}

export function createTargetBankV4({seed=1,width=12,depth=8,facing=1}={}){
  const r=rng(seed),g=new THREE.Group();
  g.name=`bank_target_v4_${seed}`;

  // Irregular stepped top: overlapping low-poly land masses replace the old rectangular slab silhouette.
  const segments=7;
  const segW=width/segments;
  for(let i=0;i<segments;i++){
    const x=-width*.5+(i+.5)*segW;
    const zJ=(r()-.5)*1.25;
    const yJ=(r()-.5)*.20;
    const w=segW*(1.32+r()*.30),d=depth*(.72+r()*.20);
    const geo=deform(new THREE.BoxGeometry(w,.55,d,3,2,4),r,.13);
    const land=new THREE.Mesh(geo,i%3===0?grassDark:grass);
    land.position.set(x,yJ,zJ-facing*.22);
    land.rotation.y=(r()-.5)*.11;
    g.add(land);
  }

  // Broken cliff face: three depth bands create foreground/midground overlap instead of one straight wall.
  const bands=[
    {z:depth*.5-.16,y:-.48,scale:.95},
    {z:depth*.5-.48,y:-1.00,scale:.78},
    {z:depth*.5-.76,y:-1.42,scale:.60}
  ];
  bands.forEach((band,bi)=>{
    const count=Math.max(8,Math.ceil(width/(bi===0?.82:1.08)));
    for(let i=0;i<count;i++){
      if(bi>0 && (i+bi)%4===1) continue;
      const t=(i+.5)/count;
      const x=-width*.5+t*width+(r()-.5)*.30;
      const edgeWave=Math.sin(t*Math.PI*3+seed*.17)*.34+Math.sin(t*Math.PI*7)*.13;
      const radius=(.48+r()*.34)*band.scale;
      const geo=deform(new THREE.IcosahedronGeometry(radius,1),r,.28);
      const rock=new THREE.Mesh(geo,rockMats[(i+bi+seed)%rockMats.length]);
      rock.scale.set(1.15+r()*.42,.78+r()*.42,.86+r()*.40);
      rock.position.set(x,band.y+(r()-.5)*.16,facing*(band.z+edgeWave)+(r()-.5)*.12);
      rock.rotation.set((r()-.5)*.28,r()*Math.PI,(r()-.5)*.22);
      g.add(rock);
      if(bi===0 && i%2===0){
        const cap=new THREE.Mesh(new THREE.SphereGeometry(radius*.68,8,5,0,Math.PI*2,0,Math.PI*.48),moss);
        cap.scale.set(1.18,.25,.92);
        cap.position.set(rock.position.x,rock.position.y+radius*.46,rock.position.z-facing*.06);
        g.add(cap);
      }
    }
  });

  // Soil pockets break the rock row and give plants readable attachment points.
  for(let i=0;i<5;i++){
    const patch=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(.68+r()*.35,1),r,.24),soil);
    patch.scale.set(1.45,.42,.72);
    patch.position.set(-width*.36+i*width*.18+(r()-.5)*.28,-.32-r()*.28,facing*(depth*.5-.18)+(r()-.5)*.34);
    patch.rotation.y=r()*Math.PI;g.add(patch);
  }

  // Dense but clustered lip vegetation. Empty gaps are intentional so the silhouette remains readable.
  const clusters=Math.max(7,Math.ceil(width/1.35));
  for(let i=0;i<clusters;i++){
    if(i%5===3) continue;
    const t=i/Math.max(1,clusters-1);
    const fern=makeFernPatch(r,.50+r()*.30,12+(i%3)*3);
    fern.position.set(-width*.44+t*width*.88+(r()-.5)*.30,.12+(r()-.5)*.08,facing*(depth*.5-.54-Math.sin(t*Math.PI*3)*.18));
    fern.rotation.y=r()*Math.PI*2;g.add(fern);
  }

  // A few embedded stones on the top plane connect the cliff face to the playable ground.
  for(let i=0;i<8;i++){
    const rad=.22+r()*.30;
    const stone=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.26),rockMats[(i+seed)%rockMats.length]);
    stone.scale.set(1.25,.62,1.05);
    stone.position.set((r()-.5)*width*.80,.28,(r()-.5)*depth*.55-facing*.55);
    stone.rotation.y=r()*Math.PI;g.add(stone);
  }

  g.userData={assetId:'bank_target_v4',version:'4.0.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'irregular terraced forest bank with broken cliff silhouette, moss, soil pockets and clustered fern lip'};
  return shadows(g);
}
