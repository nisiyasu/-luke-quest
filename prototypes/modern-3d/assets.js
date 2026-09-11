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
  for(const z of[-3.38,3.38]){const sill=beam(g,3.7,.18,.38,woodDark,0,.08,z);sill.rotation.y=.01*Math.sign(z)}
  g.userData={assetId:'bridge_principal_v1',version:'1.1.0',stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'denser warm timber bridge with capped posts, collars, dual rails and deck wear'};
  return shadow(g)
}

export function createConifer({seed=1,scale=1}={}){const r=seeded(seed),g=new THREE.Group();g.name=`conifer_family_v1_${seed}`;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.19*scale,.36*scale,4.2*scale,9),barkMat);trunk.position.y=2.1*scale;g.add(trunk);for(let level=0;level<7;level++){const y=(1.15+level*.52)*scale,rad=(1.48-level*.13)*scale,count=5+(level%3);for(let i=0;i<count;i++){const a=i/count*Math.PI*2+r()*.32,len=rad*(.75+r()*.38),branch=new THREE.Mesh(new THREE.CylinderGeometry(.035*scale,.07*scale,len,6),barkMat);branch.position.set(Math.cos(a)*len*.36,y,Math.sin(a)*len*.36);branch.rotation.z=Math.PI/2.2;branch.rotation.y=-a;g.add(branch);const fol=new THREE.Mesh(new THREE.DodecahedronGeometry((.38+r()*.18)*scale,0),foliageMats[(level+i)%3]);fol.scale.set(.72+r()*.28,1.35+r()*.48,.72+r()*.3);fol.position.set(Math.cos(a)*len*.78,y+(r()-.4)*.18*scale,Math.sin(a)*len*.78);fol.rotation.y=a+r();g.add(fol)}}for(let i=0;i<5;i++){const top=new THREE.Mesh(new THREE.DodecahedronGeometry((.42-i*.045)*scale,0),foliageMats[i%3]);top.scale.set(.75,1.45,.75);top.position.y=(4.15+i*.3)*scale;top.rotation.y=r()*Math.PI;g.add(top)}const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.58*scale,.76*scale,.09*scale,11),mossMat);skirt.position.y=.045*scale;g.add(skirt);g.rotation.y=r()*Math.PI*2;g.userData={assetId:'conifer_family_v1',version:'1.0.0',seed};return shadow(g)}

function deform(geometry,r,amount=.18){const p=geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),m=1+(r()-.5)*amount;p.setXYZ(i,x*m,y*(1+(r()-.5)*amount*.65),z*m)}p.needsUpdate=true;geometry.computeVertexNormals();return geometry}
export function createRockCluster({seed=1,scale=1}={}){const r=seeded(seed),g=new THREE.Group();g.name=`rock_cluster_v1_${seed}`;const count=3+Math.floor(r()*3);for(let i=0;i<count;i++){const geo=deform(new THREE.DodecahedronGeometry((.42+r()*.48)*scale,1),r,.28),m=new THREE.Mesh(geo,rockMats[i%3]);m.scale.set(.8+r()*.7,.55+r()*.65,.75+r()*.8);m.position.set((r()-.5)*1.45*scale,m.scale.y*.28,(r()-.5)*1.2*scale);m.rotation.set(r()*.35,r()*Math.PI,r()*.25);g.add(m)}const moss=new THREE.Mesh(new THREE.CircleGeometry(.72*scale,14),mossMat);moss.rotation.x=-Math.PI/2;moss.position.y=.018;g.add(moss);g.userData={assetId:'rock_cluster_v1',version:'1.0.0',seed};return shadow(g)}

export function createTerrainPatch({seed=1,width=8,depth=7,cliff=false}={}){const r=seeded(seed),g=new THREE.Group();const geo=new THREE.PlaneGeometry(width,depth,14,12),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),edge=Math.abs(x)/(width*.5);p.setZ(i,(Math.sin(x*1.7+y*.8)*.08+(r()-.5)*.08)*(1-edge*.35))}geo.computeVertexNormals();const top=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:grassTex,color:0x91a955,roughness:.96}));top.rotation.x=-Math.PI/2;top.receiveShadow=true;g.add(top);if(cliff){const face=new THREE.Mesh(new THREE.BoxGeometry(width,1.9,.7),new THREE.MeshStandardMaterial({map:cliffTex,color:0x8b8a7e,roughness:.98}));face.position.set(0,-.93,depth*.49);g.add(face);for(let i=0;i<6;i++){const ledge=new THREE.Mesh(new THREE.BoxGeometry(.7+r()*1.4,.08,.18+r()*.22),mossMat);ledge.position.set((r()-.5)*width*.85,-.2-r()*1.25,depth*.18+r()*.35);g.add(ledge)}}g.userData={assetId:'terrain_grass_cliff_v1',version:'1.0.0'};return shadow(g)}

export function createWaterSurface({width=8,depth=6}={}){const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(0x0c5f7d)},uShallow:{value:new THREE.Color(0x31b9c8)}};const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,vertexShader:`varying vec2 vUv;uniform float uTime;void main(){vUv=uv;vec3 p=position;p.z+=sin((p.x+uTime*.9)*2.1)*.035+cos((p.y-uTime*.7)*2.8)*.025;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 uDeep;uniform vec3 uShallow;uniform float uTime;void main(){float ripple=.5+.5*sin(vUv.x*35.+vUv.y*24.+uTime*2.);vec3 c=mix(uDeep,uShallow,.22+vUv.y*.28+ripple*.06);gl_FragColor=vec4(c,.83);}`});const m=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,32,24),mat);m.rotation.x=-Math.PI/2;m.userData={assetId:'water_river_v1',version:'1.0.0',update:t=>uniforms.uTime.value=t};return m}

export function createLukeCharacter({scale=1}={}){const g=new THREE.Group();g.name='luke_player_v1';const skin=new THREE.MeshStandardMaterial({color:0xf0c9ac,roughness:.68}),shirt=new THREE.MeshStandardMaterial({color:0x2f4a71,roughness:.78}),coat=new THREE.MeshStandardMaterial({color:0xe4e1d4,roughness:.82}),boots=new THREE.MeshStandardMaterial({color:0x403329,roughness:.9}),hairMat=new THREE.MeshStandardMaterial({color:0x185bd9,roughness:.42}),belt=new THREE.MeshStandardMaterial({color:0x8d673a,roughness:.75});const hips=new THREE.Group();hips.position.y=1.0*scale;g.add(hips);const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.32*scale,.52*scale,5,10),coat);torso.position.y=.55*scale;hips.add(torso);const beltMesh=new THREE.Mesh(new THREE.CylinderGeometry(.34*scale,.34*scale,.12*scale,12),belt);beltMesh.position.y=.19*scale;hips.add(beltMesh);const head=new THREE.Mesh(new THREE.SphereGeometry(.32*scale,16,12),skin);head.scale.set(.9,1.03,.88);head.position.y=1.35*scale;hips.add(head);for(let i=0;i<7;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(.12*scale,.46*scale,6),hairMat);const a=(i/7)*Math.PI*2;h.position.set(Math.cos(a)*.22*scale,1.56*scale,Math.sin(a)*.22*scale);h.rotation.z=Math.cos(a)*.4;h.rotation.x=Math.sin(a)*.4;hips.add(h)}const limb=(x,y,mat)=>{const pivot=new THREE.Group();pivot.position.set(x*scale,y*scale,0);const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(.095*scale,.48*scale,4,8),mat);mesh.position.y=-.3*scale;pivot.add(mesh);hips.add(pivot);return pivot};const armL=limb(-.39,.9,shirt),armR=limb(.39,.9,shirt),legL=limb(-.17,.18,boots),legR=limb(.17,.18,boots);for(const [x,leg] of [[-.17,legL],[.17,legR]]){const foot=new THREE.Mesh(new THREE.BoxGeometry(.2*scale,.14*scale,.38*scale),boots);foot.position.set(0,-.64*scale,.09*scale);leg.add(foot)}g.userData={assetId:'luke_player_v1',version:'1.0.0',rig:'procedural hierarchical pivots',animate:(t,speed=1)=>{const swing=Math.sin(t*7*speed)*.55;armL.rotation.x=swing;armR.rotation.x=-swing;legL.rotation.x=-swing*.75;legR.rotation.x=swing*.75;hips.position.y=(1+.025*Math.abs(Math.sin(t*7*speed)))*scale}};return shadow(g)}

export function createSign(){const g=new THREE.Group();beam(g,.17,1.45,.17,woodDark,0,.72,0);const board=beam(g,1.35,.55,.12,woodMat,0,1.28,0);const cap=beam(g,1.48,.08,.14,woodDark,0,1.58,0);g.userData={assetId:'sign_v1',version:'1.0.0'};return shadow(g)}

export function assetMetadata(){return{bridge:'bridge_principal_v1@1.1.0',conifer:'conifer_family_v1@1.0.0',rocks:'rock_cluster_v1@1.0.0',terrain:'terrain_grass_cliff_v1@1.0.0',water:'water_river_v1@1.0.0',player:'luke_player_v1@1.0.0',sign:'sign_v1@1.0.0'}}
