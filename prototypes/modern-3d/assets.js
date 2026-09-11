import * as THREE from 'three';

function seeded(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function canvasTexture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');paint(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function shadow(o){o.traverse?.(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return o}
function beam(g,w,h,d,mat,x,y,z,rotZ=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.rotation.z=rotZ;g.add(m);return m}

export function makeWoodTexture(seed=11){const r=seeded(seed);return canvasTexture(256,256,(x,w,h)=>{x.fillStyle='#8a582e';x.fillRect(0,0,w,h);for(let i=0;i<95;i++){const y=r()*h,amp=2+r()*8;x.strokeStyle=`rgba(${55+Math.floor(r()*35)},${28+Math.floor(r()*22)},${12+Math.floor(r()*14)},${.12+r()*.2})`;x.lineWidth=.5+r()*1.5;x.beginPath();for(let px=0;px<=w;px+=8)x.lineTo(px,y+Math.sin(px*.035+r()*5)*amp);x.stroke()}for(let i=0;i<12;i++){x.strokeStyle='rgba(54,28,14,.34)';x.lineWidth=1.2;x.beginPath();x.ellipse(r()*w,r()*h,5+r()*15,2+r()*5,r()*.5,0,Math.PI*2);x.stroke()}})}
export function makeBarkTexture(seed=29){const r=seeded(seed);return canvasTexture(128,256,(x,w,h)=>{x.fillStyle='#5d402a';x.fillRect(0,0,w,h);for(let i=0;i<75;i++){const xx=r()*w;x.strokeStyle=`rgba(${40+Math.floor(r()*35)},${24+Math.floor(r()*20)},${12+Math.floor(r()*12)},${.16+r()*.25})`;x.lineWidth=1+r()*3;x.beginPath();x.moveTo(xx,0);for(let y=0;y<h;y+=18)x.lineTo(xx+Math.sin(y*.05+r()*5)*(2+r()*4),y);x.stroke()}})}
export function makeGrassTexture(seed=47){const r=seeded(seed);return canvasTexture(256,256,(x,w,h)=>{x.fillStyle='#617f3c';x.fillRect(0,0,w,h);for(let i=0;i<110;i++){const cx=r()*w,cy=r()*h,rr=4+r()*25;x.fillStyle=`rgba(${40+Math.floor(r()*55)},${75+Math.floor(r()*65)},${25+Math.floor(r()*35)},${.08+r()*.18})`;x.beginPath();x.arc(cx,cy,rr,0,Math.PI*2);x.fill()}for(let i=0;i<90;i++){x.strokeStyle=`rgba(210,200,120,${.04+r()*.1})`;x.beginPath();const cx=r()*w,cy=r()*h;x.moveTo(cx,cy+6);x.lineTo(cx+(r()-.5)*4,cy-5-r()*6);x.stroke()}})}
export function makeCliffTexture(seed=73){const r=seeded(seed);return canvasTexture(256,256,(x,w,h)=>{x.fillStyle='#74766d';x.fillRect(0,0,w,h);for(let y=12;y<h;y+=18+r()*12){x.strokeStyle=`rgba(55,58,54,${.15+r()*.18})`;x.lineWidth=1+r()*2;x.beginPath();x.moveTo(0,y);for(let px=0;px<w;px+=16)x.lineTo(px,y+(r()-.5)*7);x.stroke()}for(let i=0;i<45;i++){x.fillStyle=`rgba(${90+Math.floor(r()*55)},${85+Math.floor(r()*45)},${70+Math.floor(r()*30)},${.06+r()*.15})`;x.fillRect(r()*w,r()*h,5+r()*30,2+r()*10)}})}

const woodTex=makeWoodTexture();woodTex.repeat.set(2.2,.45);const barkTex=makeBarkTexture();barkTex.repeat.set(1.4,2.4);const grassTex=makeGrassTexture();grassTex.repeat.set(4,4);const cliffTex=makeCliffTexture();cliffTex.repeat.set(3,1.4);
const woodMat=new THREE.MeshStandardMaterial({map:woodTex,color:0xb97a3f,roughness:.78,metalness:0}),woodDark=new THREE.MeshStandardMaterial({map:woodTex,color:0x70401f,roughness:.88,metalness:0}),ironMat=new THREE.MeshStandardMaterial({color:0x3b4143,roughness:.45,metalness:.68}),barkMat=new THREE.MeshStandardMaterial({map:barkTex,color:0x745038,roughness:1,metalness:0});
const foliageMats=[0x184d34,0x21613e,0x2b7046].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.93,metalness:0})),rockMats=[0x777a73,0x686d68,0x85877e].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.94,metalness:0})),mossMat=new THREE.MeshStandardMaterial({color:0x566a37,roughness:1,metalness:0});

export function createProductionBridge(){
  const g=new THREE.Group();g.name='bridge_principal_v1';
  const boardCount=22,depth=6.8,step=depth/boardCount;
  const deckMats=[
    woodMat,
    new THREE.MeshStandardMaterial({map:woodTex,color:0xa96a34,roughness:.84,metalness:0}),
    new THREE.MeshStandardMaterial({map:woodTex,color:0xc58a4b,roughness:.8,metalness:0})
  ];
  for(let i=0;i<boardCount;i++){
    const z=-depth/2+step*(i+.5),j=Math.sin(i*2.71)*.025;
    const b=beam(g,3.48,.19,step*.92,deckMats[i%deckMats.length],j,.34,z);
    b.rotation.y=Math.sin(i*1.91)*.009;b.position.y+=Math.sin(i*1.37)*.014;
    if(i%5===1){const seam=beam(g,3.16,.015,.018,woodDark,0,.445,z+step*.31);seam.castShadow=false}
  }
  // M06 finish: the bridge must read as a load-bearing structure, not a floating deck.
  // Cross-beams, lower stringers and diagonal trestle braces visibly connect the deck to the banks/water.
  for(const z of[-2.35,0,2.35]){
    beam(g,3.92,.24,.30,woodDark,0,.03,z);
    for(const x of[-1.18,1.18]){
      const pier=new THREE.Mesh(new THREE.CylinderGeometry(.24,.34,1.55,10),woodDark);pier.position.set(x,-.54,z);g.add(pier);
      const shoe=new THREE.Mesh(new THREE.CylinderGeometry(.42,.52,.26,10),rockMats[(z===0?1:2)]);shoe.position.set(x,-1.28,z);shoe.scale.z=1.15;g.add(shoe);
      const collar=new THREE.Mesh(new THREE.TorusGeometry(.29,.042,6,16),ironMat);collar.rotation.x=Math.PI/2;collar.position.set(x,-.02,z);g.add(collar);
    }
    const braceL=beam(g,.16,.16,2.7,woodDark,-.92,-.42,z);braceL.rotation.x=Math.PI/3.7;braceL.rotation.z=.08;
    const braceR=beam(g,.16,.16,2.7,woodDark,.92,-.42,z);braceR.rotation.x=-Math.PI/3.7;braceR.rotation.z=-.08;
  }
  for(const x of[-1.58,1.58]){
    beam(g,.26,.34,7,woodDark,x,.16,0);
    for(const z of[-3.05,-1.5,0,1.5,3.05]){
      beam(g,.28,1.42,.28,woodDark,x,.78,z);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(.23,.29,.18,10),woodMat);cap.position.set(x,1.52,z);g.add(cap);
      const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.075,10),ironMat);bolt.rotation.z=Math.PI/2;bolt.position.set(x+(x<0?-.155:.155),.83,z);g.add(bolt);
    }
    beam(g,.22,.18,6.65,woodMat,x,1.34,0);
    beam(g,.12,.12,6.45,woodDark,x,.93,0);
    for(let z=-2.65;z<2.8;z+=1.35){const brace=beam(g,.13,.13,1.7,woodDark,x,.86,z+.55);brace.rotation.x=Math.PI/4}
  }
  for(const z of[-3.25,3.25])for(const x of[-1.58,1.58]){
    const footing=new THREE.Mesh(new THREE.CylinderGeometry(.35,.43,1.28,10),woodDark);footing.position.set(x,-.10,z);g.add(footing);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(.39,.045,6,16),ironMat);collar.rotation.x=Math.PI/2;collar.position.set(x,.28,z);g.add(collar);
  }
  // End abutments and sacrificial wear planks eliminate the visual seam where bridge meets terrain.
  const abutmentMat=new THREE.MeshStandardMaterial({color:0x6f7166,roughness:.98,metalness:0});
  for(const z of[-3.58,3.58]){
    const abut=new THREE.Mesh(new THREE.BoxGeometry(4.25,.62,.82),abutmentMat);abut.position.set(0,-.17,z);abut.rotation.y=.01*Math.sign(z);g.add(abut);
    const wear=beam(g,3.62,.11,.42,woodDark,0,.45,z-Math.sign(z)*.22);wear.rotation.y=.012*Math.sign(z);
    for(const x of[-1.45,-.5,.5,1.45]){
      const peg=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.055,8),ironMat);peg.position.set(x,.515,z-Math.sign(z)*.22);g.add(peg);
    }
  }
  for(const z of[-3.38,3.38]){const sill=beam(g,3.7,.18,.38,woodDark,0,.08,z);sill.rotation.y=.01*Math.sign(z)}
  g.userData={assetId:'bridge_principal_v1',version:'1.2.0',stage:'M06_FINISH_CANDIDATE',source:'repo-procedural',intent:'load-bearing warm timber bridge with visible trestles, stone shoes, bank abutments, capped posts, iron collars, dual rails and deck wear'};
  return shadow(g)
}

export function createConifer({seed=1,scale=1}={}){const r=seeded(seed),g=new THREE.Group();g.name=`conifer_family_v1_${seed}`;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.19*scale,.36*scale,4.2*scale,9),barkMat);trunk.position.y=2.1*scale;g.add(trunk);for(let level=0;level<7;level++){const y=(1.15+level*.52)*scale,rad=(1.48-level*.13)*scale,count=5+(level%3);for(let i=0;i<count;i++){const a=i/count*Math.PI*2+r()*.32,len=rad*(.75+r()*.38),branch=new THREE.Mesh(new THREE.CylinderGeometry(.035*scale,.07*scale,len,6),barkMat);branch.position.set(Math.cos(a)*len*.36,y,Math.sin(a)*len*.36);branch.rotation.z=Math.PI/2.2;branch.rotation.y=-a;g.add(branch);const fol=new THREE.Mesh(new THREE.DodecahedronGeometry((.38+r()*.18)*scale,0),foliageMats[(level+i)%3]);fol.scale.set(.72+r()*.28,1.35+r()*.48,.72+r()*.3);fol.position.set(Math.cos(a)*len*.78,y+(r()-.4)*.18*scale,Math.sin(a)*len*.78);fol.rotation.y=a+r();g.add(fol)}}for(let i=0;i<5;i++){const top=new THREE.Mesh(new THREE.DodecahedronGeometry((.42-i*.045)*scale,0),foliageMats[i%3]);top.scale.set(.75,1.45,.75);top.position.y=(4.15+i*.3)*scale;top.rotation.y=r()*Math.PI;g.add(top)}const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.58*scale,.76*scale,.09*scale,11),mossMat);skirt.position.y=.045*scale;g.add(skirt);g.rotation.y=r()*Math.PI*2;g.userData={assetId:'conifer_family_v1',version:'1.0.0',seed};return shadow(g)}

function deform(geometry,r,amount=.18){const p=geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),m=1+(r()-.5)*amount;p.setXYZ(i,x*m,y*(1+(r()-.5)*amount*.65),z*m)}p.needsUpdate=true;geometry.computeVertexNormals();return geometry}
export function createRockCluster({seed=1,scale=1}={}){
  const r=seeded(seed),g=new THREE.Group();g.name=`rock_cluster_v1_${seed}`;
  const count=4+Math.floor(r()*3);
  const lichenMats=[
    new THREE.MeshStandardMaterial({color:0x65764a,roughness:1}),
    new THREE.MeshStandardMaterial({color:0x7d8153,roughness:1})
  ];
  for(let i=0;i<count;i++){
    const radius=(.34+r()*.52)*scale;
    const geo=deform(new THREE.IcosahedronGeometry(radius,2),r,.22);
    const m=new THREE.Mesh(geo,rockMats[i%rockMats.length]);
    const sx=.72+r()*.72,sy=.46+r()*.52,sz=.70+r()*.68;
    m.scale.set(sx,sy,sz);
    m.position.set((r()-.5)*1.55*scale,radius*sy*.42,(r()-.5)*1.28*scale);
    m.rotation.set((r()-.5)*.42,r()*Math.PI,(r()-.5)*.34);
    g.add(m);
    if(i%2===0){
      const cap=new THREE.Mesh(new THREE.CircleGeometry(radius*(.34+r()*.16),12),lichenMats[i%lichenMats.length]);
      cap.rotation.x=-Math.PI/2;cap.position.set(m.position.x,m.position.y+radius*sy*.74,m.position.z);cap.rotation.z=r()*Math.PI;g.add(cap);
    }
  }
  const moss=new THREE.Mesh(new THREE.CircleGeometry(.86*scale,20),mossMat);moss.rotation.x=-Math.PI/2;moss.position.y=.018;g.add(moss);
  for(let i=0;i<6;i++){const peb=new THREE.Mesh(deform(new THREE.IcosahedronGeometry((.08+r()*.12)*scale,1),r,.18),rockMats[(i+1)%rockMats.length]);peb.scale.y=.55+r()*.25;peb.position.set((r()-.5)*1.75*scale,.05*scale,(r()-.5)*1.45*scale);peb.rotation.y=r()*Math.PI;g.add(peb)}
  g.userData={assetId:'rock_cluster_v1',version:'1.1.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'rounded layered boulder cluster with lichen caps, moss footprint and pebble breakup'};
  return shadow(g)
}

export function createTerrainPatch({seed=1,width=8,depth=7,cliff=false}={}){const r=seeded(seed),g=new THREE.Group();const geo=new THREE.PlaneGeometry(width,depth,14,12),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),edge=Math.abs(x)/(width*.5);p.setZ(i,(Math.sin(x*1.7+y*.8)*.08+(r()-.5)*.08)*(1-edge*.35))}geo.computeVertexNormals();const top=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:grassTex,color:0x91a955,roughness:.96}));top.rotation.x=-Math.PI/2;top.receiveShadow=true;g.add(top);if(cliff){const face=new THREE.Mesh(new THREE.BoxGeometry(width,1.9,.7),new THREE.MeshStandardMaterial({map:cliffTex,color:0x8b8a7e,roughness:.98}));face.position.set(0,-.93,depth*.49);g.add(face);for(let i=0;i<6;i++){const ledge=new THREE.Mesh(new THREE.BoxGeometry(.7+r()*1.4,.08,.18+r()*.22),mossMat);ledge.position.set((r()-.5)*width*.85,-.2-r()*1.25,depth*.18+r()*.35);g.add(ledge)}}g.userData={assetId:'terrain_grass_cliff_v1',version:'1.0.0'};return shadow(g)}

export function createWaterSurface({width=8,depth=6}={}){const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(0x0c5f7d)},uShallow:{value:new THREE.Color(0x31b9c8)}};const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,vertexShader:`varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.z+=sin((p.x+uTime*.9)*2.1)*.035+cos((p.y-uTime*.7)*2.8)*.025;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 uDeep;uniform vec3 uShallow;uniform float uTime;void main(){float ripple=.5+.5*sin(vUv.x*35.+vUv.y*24.+uTime*2.);vec3 c=mix(uDeep,uShallow,.22+vUv.y*.28+ripple*.06);gl_FragColor=vec4(c,.83);}`});const m=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,32,24),mat);m.rotation.x=-Math.PI/2;m.userData={assetId:'water_river_v1',version:'1.0.0',update:t=>uniforms.uTime.value=t};return m}

export function createLukeCharacter({scale=1}={}){
  const g=new THREE.Group();g.name='luke_player_v1';
  const skin=new THREE.MeshStandardMaterial({color:0xf0c9ac,roughness:.7});
  const navy=new THREE.MeshStandardMaterial({color:0x263f68,roughness:.78});
  const coat=new THREE.MeshStandardMaterial({color:0xe9e4d6,roughness:.86});
  const coatShade=new THREE.MeshStandardMaterial({color:0xbec7c8,roughness:.88});
  const boots=new THREE.MeshStandardMaterial({color:0x3c2c26,roughness:.92});
  const hair=new THREE.MeshStandardMaterial({color:0x1660d9,roughness:.38});
  const hairDark=new THREE.MeshStandardMaterial({color:0x123c9f,roughness:.48});
  const belt=new THREE.MeshStandardMaterial({color:0x8b6236,roughness:.82});
  const gold=new THREE.MeshStandardMaterial({color:0xd7ad48,roughness:.48,metalness:.18});
  const hips=new THREE.Group();hips.position.y=.91*scale;g.add(hips);

  const pelvis=new THREE.Mesh(new THREE.BoxGeometry(.42*scale,.18*scale,.30*scale),navy);pelvis.position.y=.15*scale;hips.add(pelvis);
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.255*scale,.48*scale,6,12),coat);torso.scale.set(1.08,1,.78);torso.position.y=.63*scale;hips.add(torso);
  const chest=new THREE.Mesh(new THREE.BoxGeometry(.42*scale,.30*scale,.10*scale),navy);chest.position.set(0,.67*scale,-.22*scale);hips.add(chest);
  const beltMesh=new THREE.Mesh(new THREE.CylinderGeometry(.29*scale,.31*scale,.105*scale,16),belt);beltMesh.position.y=.32*scale;hips.add(beltMesh);
  const buckle=new THREE.Mesh(new THREE.BoxGeometry(.13*scale,.10*scale,.055*scale),gold);buckle.position.set(0,.32*scale,-.30*scale);hips.add(buckle);

  const coatTailGeo=new THREE.BoxGeometry(.22*scale,.48*scale,.08*scale);
  for(const x of[-.15,.15]){const tail=new THREE.Mesh(coatTailGeo,coatShade);tail.position.set(x,.08*scale,.16*scale);tail.rotation.x=-.10;tail.rotation.z=x<0?-.08:.08;hips.add(tail)}
  const crest=new THREE.Mesh(new THREE.OctahedronGeometry(.105*scale,0),gold);crest.scale.set(.75,1.15,.30);crest.position.set(0,.66*scale,-.285*scale);hips.add(crest);

  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.10*scale,.115*scale,.16*scale,10),skin);neck.position.y=1.03*scale;hips.add(neck);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.30*scale,18,14),skin);head.scale.set(.88,1.02,.84);head.position.y=1.30*scale;hips.add(head);
  const earGeo=new THREE.SphereGeometry(.055*scale,8,6);for(const x of[-.255,.255]){const ear=new THREE.Mesh(earGeo,skin);ear.position.set(x,1.30*scale,0);hips.add(ear)}

  for(let i=0;i<11;i++){
    const a=i/11*Math.PI*2;
    const lock=new THREE.Mesh(new THREE.ConeGeometry((.105+(i%3)*.012)*scale,(.38+(i%4)*.055)*scale,7),i%3===0?hairDark:hair);
    lock.position.set(Math.cos(a)*.225*scale,1.51*scale,Math.sin(a)*.215*scale);
    lock.rotation.z=Math.cos(a)*.47;lock.rotation.x=Math.sin(a)*.47;lock.rotation.y=-a*.32;hips.add(lock);
  }
  const fringeGeo=new THREE.ConeGeometry(.08*scale,.28*scale,6);
  for(const [x,rz] of [[-.14,-.18],[-.045,-.07],[.055,.08],[.145,.19]]){const f=new THREE.Mesh(fringeGeo,hair);f.position.set(x*scale,1.43*scale,-.235*scale);f.rotation.x=-.62;f.rotation.z=rz;hips.add(f)}

  const limb=(x,y,upperMat,side)=>{const pivot=new THREE.Group();pivot.position.set(x*scale,y*scale,0);const sleeve=new THREE.Mesh(new THREE.CapsuleGeometry(.085*scale,.27*scale,4,8),upperMat);sleeve.position.y=-.17*scale;pivot.add(sleeve);const hand=new THREE.Mesh(new THREE.SphereGeometry(.095*scale,9,7),skin);hand.scale.set(.85,1,.8);hand.position.y=-.43*scale;pivot.add(hand);const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.105*scale,.095*scale,.10*scale,9),navy);cuff.position.y=-.34*scale;pivot.add(cuff);hips.add(pivot);pivot.rotation.z=side*.05;return pivot};
  const armL=limb(-.36,.88,coat,-1),armR=limb(.36,.88,coat,1);
  const leg=(x)=>{const pivot=new THREE.Group();pivot.position.set(x*scale,.24*scale,0);const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.105*scale,.30*scale,4,8),navy);thigh.position.y=-.20*scale;pivot.add(thigh);const boot=new THREE.Mesh(new THREE.CapsuleGeometry(.115*scale,.25*scale,4,8),boots);boot.position.set(0,-.49*scale,.015*scale);pivot.add(boot);const foot=new THREE.Mesh(new THREE.BoxGeometry(.22*scale,.15*scale,.38*scale),boots);foot.position.set(0,-.66*scale,-.07*scale);foot.rotation.x=-.05;pivot.add(foot);hips.add(pivot);return pivot};
  const legL=leg(-.15),legR=leg(.15);

  const shoulderGeo=new THREE.SphereGeometry(.13*scale,10,8);for(const x of[-.35,.35]){const s=new THREE.Mesh(shoulderGeo,navy);s.scale.set(1.05,.72,.82);s.position.set(x,.90*scale,0);hips.add(s)}
  g.userData={assetId:'luke_player_v1',version:'1.1.0',stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',rig:'procedural hierarchical pivots',intent:'stylized blue-haired JRPG hero with readable coat silhouette, crest, layered hair, hands and boots',animate:(t,speed=1)=>{const swing=Math.sin(t*7*speed)*.48;armL.rotation.x=swing;armR.rotation.x=-swing;legL.rotation.x=-swing*.72;legR.rotation.x=swing*.72;hips.position.y=(.91+.024*Math.abs(Math.sin(t*7*speed)))*scale;hips.rotation.z=Math.sin(t*7*speed)*.012}};
  return shadow(g)
}

export function createSign(){const g=new THREE.Group();beam(g,.17,1.45,.17,woodDark,0,.72,0);const board=beam(g,1.35,.55,.12,woodMat,0,1.28,0);const cap=beam(g,1.48,.08,.14,woodDark,0,1.58,0);g.userData={assetId:'sign_v1',version:'1.0.0'};return shadow(g)}

export function assetMetadata(){return{bridge:'bridge_principal_v1@1.2.0',conifer:'conifer_family_v1@1.0.0',rocks:'rock_cluster_v1@1.1.0',terrain:'terrain_grass_cliff_v1@1.0.0',water:'water_river_v1@1.0.0',player:'luke_player_v1@1.1.0',sign:'sign_v1@1.0.0'}}
