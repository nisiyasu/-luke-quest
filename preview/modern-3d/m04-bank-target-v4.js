import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function makeBankGrassMap(seed=417){
  const r=rng(seed),c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
  x.fillStyle='#587c3b';x.fillRect(0,0,512,512);
  // v4.7 M04 regate: multi-scale forest-floor color breakup, not a single pale lawn field.
  for(let i=0;i<230;i++){const px=r()*512,py=r()*512,rad=12+r()*58,g=x.createRadialGradient(px,py,0,px,py,rad);g.addColorStop(0,i%5===0?'rgba(212,199,106,.20)':i%4===0?'rgba(31,69,32,.30)':i%3===0?'rgba(103,145,56,.28)':'rgba(83,121,48,.24)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,rad,0,Math.PI*2);x.fill()}
  for(let i=0;i<7600;i++){const px=r()*512,py=r()*512,l=1+r()*4.5;x.strokeStyle=i%9===0?'rgba(223,213,132,.34)':i%4===0?'rgba(35,72,31,.42)':'rgba(113,153,64,.38)';x.lineWidth=.45+r()*1.05;x.beginPath();x.moveTo(px,py);x.lineTo(px+(r()-.5)*3.1,py-l);x.stroke()}
  for(let i=0;i<420;i++){x.fillStyle=i%7===0?'rgba(238,225,176,.55)':i%4===0?'rgba(82,58,36,.28)':'rgba(176,194,102,.26)';x.beginPath();x.arc(r()*512,r()*512,.7+r()*2.0,0,Math.PI*2);x.fill()}
  // small irregular clover/leaf marks give the ground a readable vegetated surface at portrait distance.
  for(let i=0;i<260;i++){const px=r()*512,py=r()*512,rad=1.2+r()*2.2;x.fillStyle=i%5===0?'rgba(225,220,169,.40)':'rgba(42,92,39,.42)';for(let p=0;p<3;p++){const a=p*Math.PI*2/3+r()*.25;x.beginPath();x.ellipse(px+Math.cos(a)*rad,py+Math.sin(a)*rad,rad*1.15,rad*.68,a,0,Math.PI*2);x.fill()}}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5.2,4.2);t.anisotropy=8;return t;
}
function deform(g,r,a=.22){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(r()-.5)*a),y*(1+(r()-.5)*a*.72),z*(1+(r()-.5)*a))}p.needsUpdate=true;g.computeVertexNormals();return g}
function shadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const grass=new THREE.MeshStandardMaterial({color:0xf8ffe9,map:makeBankGrassMap(417),roughness:.97,side:THREE.DoubleSide});
const soil=new THREE.MeshStandardMaterial({color:0x514332,roughness:1});
const soilLight=new THREE.MeshStandardMaterial({color:0x70563a,roughness:1,side:THREE.DoubleSide});
const moss=new THREE.MeshStandardMaterial({color:0x587941,roughness:1});
const mossLight=new THREE.MeshStandardMaterial({color:0x719552,roughness:1});
const rootMat=new THREE.MeshStandardMaterial({color:0x4b3427,roughness:1});
const rockMats=[0x5d6159,0x777266,0x898171,0x62675f,0x75786a,0x555d56].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.96,metalness:0}));
const fernMats=[0x2b5a2b,0x689445,0x487838].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98,side:THREE.DoubleSide}));
const topGrassMats=[0x315c2d,0x477b38,0x71954b].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
const flowerMats=[0xf4ead5,0xdcc8f2,0xf1df83].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.92,side:THREE.DoubleSide}));

function makeFernPatch(r,scale=.7,count=14){
  const g=new THREE.Group(),verts=[],idx=[];
  const addTri=(a,b,c)=>{const n=verts.length/3;verts.push(...a,...b,...c);idx.push(n,n+1,n+2)};
  const stemW=.028;verts.push(-stemW,0,0,stemW,0,0,stemW,0,1.05,-stemW,0,1.05);idx.push(0,1,2,0,2,3);
  for(let j=0;j<6;j++){const z=.16+j*.14,span=.22*(1-j*.07),tip=z+.17;addTri([-stemW,0,z],[-span,0,z+.055],[0,0,tip]);addTri([stemW,0,z],[span,0,z+.055],[0,0,tip])}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();
  const groups=[[],[],[]],dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){const a=r()*Math.PI*2,rad=Math.sqrt(r())*.76*scale,h=(.55+r()*.55)*scale,w=(.65+r()*.35)*scale;groups[i%3].push({x:Math.cos(a)*rad,z:Math.sin(a)*rad,a,h,w,lean:.42+r()*.30,twist:r()-.5 })}
  fernMats.forEach((mat,mi)=>{const list=groups[mi],mesh=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((v,i)=>{dummy.position.set(v.x,.02*scale,v.z);dummy.rotation.set(-v.lean,-v.a+Math.PI/2,v.twist);dummy.scale.set(v.w,1,v.h);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;g.add(mesh)});
  return g;
}
function makeOrganicTop(r,seed,width,depth,facing){
  const cols=32,rows=9,vertices=[],indices=[],uvs=[];
  for(let i=0;i<=cols;i++){
    const tx=i/cols,baseX=-width*.5+tx*width;
    const frontWave=Math.sin(tx*Math.PI*3+seed*.19)*.42+Math.sin(tx*Math.PI*7+seed*.07)*.14+(r()-.5)*.08;
    const backWave=Math.sin(tx*Math.PI*2.35+seed*.23)*.23+Math.sin(tx*Math.PI*5.2+seed*.09)*.09;
    const front=facing*(depth*.5-.42+frontWave),back=-facing*(depth*.5-.18+backWave);
    for(let j=0;j<=rows;j++){
      const tz=j/rows,sideInfluence=Math.pow(Math.abs(tx-.5)*2,5.5),sideSign=tx<.5?-1:1;
      const sideWave=Math.sin(tz*Math.PI*3.1+seed*.17+sideSign*.8)*.22+Math.sin(tz*Math.PI*6.3+seed*.07)*.07;
      const x=baseX+sideSign*sideInfluence*sideWave,z=THREE.MathUtils.lerp(back,front,tz);
      const centerLift=Math.sin(Math.PI*tz)*(.14+.065*Math.sin(tx*Math.PI*4+seed*.11));
      const crossRoll=Math.sin(tx*Math.PI*2.1+tz*Math.PI*1.7+seed*.13)*.075;
      const macroRoll=Math.sin(tx*Math.PI*1.35+seed*.21)*Math.sin(tz*Math.PI)*.055;
      const micro=(r()-.5)*.032,frontLift=tz*tz*(.045+.030*Math.sin(tx*Math.PI*2.2));
      vertices.push(x,.015+centerLift+crossRoll+macroRoll+micro+frontLift,z);uvs.push(tx,tz);
    }
  }
  const stride=rows+1;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=i*stride+j,b=a+1,c=(i+1)*stride+j,d=c+1;indices.push(a,c,b,c,d,b)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
  const top=new THREE.Mesh(geo,grass);top.receiveShadow=true;return top;
}
function addTopMicrodetail(g,r,width,depth,facing){
  const bladeGeo=new THREE.ConeGeometry(.038,.30,5,1,false),dummy=new THREE.Object3D(),lists=[[],[],[]];
  const count=Math.max(150,Math.floor(width*16));
  for(let i=0;i<count;i++){const x=(r()-.5)*width*.88,z=(r()-.5)*depth*.64-facing*.28;if(r()<.10)continue;lists[i%3].push({x,z,h:.45+r()*.70,s:.55+r()*.65,ry:r()*Math.PI})}
  lists.forEach((list,mi)=>{const mesh=new THREE.InstancedMesh(bladeGeo,topGrassMats[mi],list.length);list.forEach((v,i)=>{dummy.position.set(v.x,.12+v.h*.09,v.z);dummy.rotation.set((i%3-1)*.10,v.ry,(i%5-2)*.04);dummy.scale.set(v.s,v.h,v.s);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;g.add(mesh)});
  for(let i=0;i<22;i++){const radius=.15+r()*.36,patch=new THREE.Mesh(new THREE.CircleGeometry(radius,10),i%3===0?soilLight:soil);patch.rotation.x=-Math.PI/2;patch.position.set((r()-.5)*width*.80,.105+(r()-.5)*.02,(r()-.5)*depth*.52-facing*.38);patch.scale.set(1.5,.65,1);g.add(patch)}
  // flower/leaf islands create clustered high-frequency accents instead of uniformly repeated spikes.
  const petalGeo=new THREE.CircleGeometry(.045,7),stemGeo=new THREE.CylinderGeometry(.008,.012,.16,5),flowerGroups=[[],[],[]];
  const islandCount=Math.max(10,Math.floor(width*1.35));
  for(let k=0;k<islandCount;k++){
    const cx=(r()-.5)*width*.76,cz=(r()-.5)*depth*.50-facing*.32,n=2+Math.floor(r()*5);
    for(let j=0;j<n;j++)flowerGroups[(k+j)%3].push({x:cx+(r()-.5)*.42,z:cz+(r()-.5)*.42,s:.70+r()*.75,ry:r()*Math.PI});
  }
  flowerGroups.forEach((list,mi)=>{const petals=new THREE.InstancedMesh(petalGeo,flowerMats[mi],list.length),stems=new THREE.InstancedMesh(stemGeo,fernMats[0],list.length);list.forEach((v,i)=>{dummy.position.set(v.x,.24,v.z);dummy.rotation.set(-Math.PI/2,0,v.ry);dummy.scale.set(v.s,v.s,v.s);dummy.updateMatrix();petals.setMatrixAt(i,dummy.matrix);dummy.position.set(v.x,.16,v.z);dummy.rotation.set(0,0,0);dummy.scale.set(.7,.9,.7);dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix)});petals.instanceMatrix.needsUpdate=true;stems.instanceMatrix.needsUpdate=true;petals.castShadow=false;stems.castShadow=false;g.add(stems,petals)});
}

export function createTargetBankV4({seed=1,width=12,depth=8,facing=1}={}){
  const r=rng(seed),g=new THREE.Group();g.name=`bank_target_v4_${seed}`;
  g.add(makeOrganicTop(r,seed,width,depth,facing));addTopMicrodetail(g,r,width,depth,facing);
  const bands=[{z:depth*.5-.28,y:-.34,scale:.90},{z:depth*.5-.53,y:-.76,scale:.72},{z:depth*.5-.76,y:-1.13,scale:.54},{z:depth*.5-.94,y:-1.42,scale:.38}];
  bands.forEach((band,bi)=>{const count=Math.max(10,Math.ceil(width/(bi===0?.62:.78)));for(let i=0;i<count;i++){if(bi>1&&(i+bi)%5===1)continue;const t=(i+.5)/count,x=-width*.5+t*width+(r()-.5)*.30,edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14,radius=(.34+r()*.27)*band.scale,geo=deform(new THREE.IcosahedronGeometry(radius,2),r,.18),rock=new THREE.Mesh(geo,rockMats[(i+bi+seed)%rockMats.length]);rock.scale.set(1.12+r()*.38,.74+r()*.34,.86+r()*.34);rock.position.set(x,band.y+(r()-.5)*.14,facing*(band.z+edgeWave)+(r()-.5)*.12);rock.rotation.set((r()-.5)*.24,r()*Math.PI,(r()-.5)*.18);g.add(rock);if(bi===0&&i%2===0){const cap=new THREE.Mesh(new THREE.SphereGeometry(radius*.72,12,7,0,Math.PI*2,0,Math.PI*.50),i%4===0?mossLight:moss);cap.scale.set(1.16,.20,.94);cap.position.set(rock.position.x,rock.position.y+radius*.43,rock.position.z-facing*.05);cap.rotation.y=r()*Math.PI;g.add(cap)}}});
  for(let i=0;i<8;i++){const patch=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(.44+r()*.22,2),r,.17),soil);patch.scale.set(1.42,.30,.74);const t=(i+.5)/8,edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;patch.position.set(-width*.45+i*width*.128+(r()-.5)*.24,-.20-r()*.22,facing*(depth*.5-.31+edgeWave)+(r()-.5)*.22);patch.rotation.y=r()*Math.PI;g.add(patch)}
  const clusters=Math.max(12,Math.ceil(width/.82));for(let i=0;i<clusters;i++){if(i%7===5)continue;const t=i/Math.max(1,clusters-1),edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14,fern=makeFernPatch(r,.50+r()*.38,14+(i%3)*5);fern.position.set(-width*.45+t*width*.90+(r()-.5)*.24,.10+(r()-.5)*.07,facing*(depth*.5-.55+edgeWave));fern.rotation.y=r()*Math.PI*2;g.add(fern)}
  for(let i=0;i<15;i++){const rad=.16+r()*.23,stone=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,2),r,.16),rockMats[(i+seed)%rockMats.length]);stone.scale.set(1.18,.56,1.04);stone.position.set((r()-.5)*width*.84,.16+(r()-.5)*.04,(r()-.5)*depth*.54-facing*.64);stone.rotation.y=r()*Math.PI;g.add(stone)}
  for(let i=0;i<22;i++){const rad=.07+r()*.10,pebble=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.16),rockMats[(i+seed+2)%rockMats.length]),t=r(),edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;pebble.scale.set(1.3,.55,1.0);pebble.position.set(-width*.47+t*width*.94,.11+r()*.05,facing*(depth*.5-.50+edgeWave)+(r()-.5)*.32);pebble.rotation.y=r()*Math.PI;g.add(pebble)}
  const toeCount=Math.max(12,Math.ceil(width/.72));for(let i=0;i<toeCount;i++){if((i+seed)%7===2)continue;const t=(i+.35)/toeCount,edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14,rad=.13+r()*.18,toe=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.20),rockMats[(i+seed+3)%rockMats.length]);toe.scale.set(1.45,.46,.92);toe.position.set(-width*.5+t*width+(r()-.5)*.25,-1.48+r()*.16,facing*(depth*.5-1.03+edgeWave)+(r()-.5)*.18);toe.rotation.y=r()*Math.PI;g.add(toe);if(i%3===0){const shelf=new THREE.Mesh(new THREE.CircleGeometry(rad*(1.15+r()*.35),10),i%2?moss:mossLight);shelf.rotation.x=-Math.PI/2;shelf.position.set(toe.position.x,toe.position.y+rad*.25,toe.position.z-facing*.03);shelf.scale.set(1.25,.72,1);g.add(shelf)}}
  const rootCount=Math.max(5,Math.floor(width/2.1));for(let i=0;i<rootCount;i++){const t=(i+.55)/rootCount,edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42,len=.65+r()*.75,root=new THREE.Mesh(new THREE.CylinderGeometry(.028+r()*.025,.055+r()*.035,len,6),rootMat);root.position.set(-width*.46+t*width*.92,-.34-len*.34,facing*(depth*.5-.42+edgeWave));root.rotation.z=(r()-.5)*.28;root.rotation.x=facing*(.10+r()*.18);g.add(root)}
  g.userData={assetId:'bank_target_v4',version:'4.7.0',seed,stage:'M04_QUALITY_REGATE',source:'repo-procedural',intent:'target-facing forest bank with multi-scale mottled ground texture, clustered flower and fern understory, irregular macro-relief, layered cliff terraces, shoreline rubble, moss shelves and roots; v4.7 specifically removes pale-lawn/repeated-spike reads while preserving the v4.6 world silhouette and collision-neutral visual geometry'};
  return shadows(g);
}
