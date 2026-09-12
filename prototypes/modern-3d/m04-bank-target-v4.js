import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function makeBankGrassMap(seed=417){
  const r=rng(seed),c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  x.fillStyle='#668b43';x.fillRect(0,0,256,256);
  for(let i=0;i<95;i++){const px=r()*256,py=r()*256,rad=7+r()*29,g=x.createRadialGradient(px,py,0,px,py,rad);g.addColorStop(0,i%4===0?'rgba(202,194,104,.18)':i%3===0?'rgba(38,82,39,.22)':'rgba(121,156,66,.20)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,rad,0,Math.PI*2);x.fill()}
  for(let i=0;i<3000;i++){const px=r()*256,py=r()*256,l=.7+r()*2.8;x.strokeStyle=i%7===0?'rgba(222,214,126,.30)':i%3===0?'rgba(41,79,35,.36)':'rgba(113,151,65,.34)';x.lineWidth=.4+r()*.75;x.beginPath();x.moveTo(px,py);x.lineTo(px+(r()-.5)*2.3,py-l);x.stroke()}
  for(let i=0;i<150;i++){x.fillStyle=i%4===0?'rgba(82,63,39,.22)':'rgba(234,225,159,.20)';x.beginPath();x.arc(r()*256,r()*256,.5+r()*1.25,0,Math.PI*2);x.fill()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4.5,3.5);t.anisotropy=4;return t;
}
function deform(g,r,a=.22){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(r()-.5)*a),y*(1+(r()-.5)*a*.72),z*(1+(r()-.5)*a))}p.needsUpdate=true;g.computeVertexNormals();return g}
function shadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const grass=new THREE.MeshStandardMaterial({color:0xffffff,map:makeBankGrassMap(417),roughness:.99,side:THREE.DoubleSide});
const soil=new THREE.MeshStandardMaterial({color:0x514332,roughness:1});
const moss=new THREE.MeshStandardMaterial({color:0x587941,roughness:1});
const mossLight=new THREE.MeshStandardMaterial({color:0x719552,roughness:1});
const rootMat=new THREE.MeshStandardMaterial({color:0x4b3427,roughness:1});
const rockMats=[0x625f56,0x756f61,0x857d6d,0x68665e,0x777365,0x595c57].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.97,metalness:0}));
const fernMats=[0x315d2e,0x6f984b].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98,side:THREE.DoubleSide}));

function makeFernPatch(r,scale=.7,count=14){
  const g=new THREE.Group(),verts=[],idx=[];
  const addTri=(a,b,c)=>{const n=verts.length/3;verts.push(...a,...b,...c);idx.push(n,n+1,n+2)};
  const stemW=.028;verts.push(-stemW,0,0,stemW,0,0,stemW,0,1.05,-stemW,0,1.05);idx.push(0,1,2,0,2,3);
  for(let j=0;j<6;j++){const z=.16+j*.14,span=.22*(1-j*.07),tip=z+.17;addTri([-stemW,0,z],[-span,0,z+.055],[0,0,tip]);addTri([stemW,0,z],[span,0,z+.055],[0,0,tip])}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();
  const groups=[[],[]],dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){const a=r()*Math.PI*2,rad=Math.sqrt(r())*.76*scale,h=(.55+r()*.55)*scale,w=(.65+r()*.35)*scale;groups[i%2].push({x:Math.cos(a)*rad,z:Math.sin(a)*rad,a,h,w,lean:.42+r()*.30,twist:r()-.5 })}
  [fernMats[0],fernMats[1]].forEach((mat,mi)=>{const list=groups[mi],mesh=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((v,i)=>{dummy.position.set(v.x,.02*scale,v.z);dummy.rotation.set(-v.lean,-v.a+Math.PI/2,v.twist);dummy.scale.set(v.w,1,v.h);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;g.add(mesh)});
  return g;
}
function makeOrganicTop(r,seed,width,depth,facing){
  const cols=24;
  const vertices=[];
  const indices=[];
  const uvs=[];
  for(let i=0;i<=cols;i++){
    const t=i/cols;
    const x=-width*.5+t*width;
    const wave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14+(r()-.5)*.12;
    const front=facing*(depth*.5-.42+wave);
    const back=-facing*(depth*.5-(r()-.5)*.25);
    const yFront=.08+Math.sin(t*Math.PI*2.2)*.06+(r()-.5)*.05;
    const yBack=.02+(r()-.5)*.05;
    vertices.push(x,yBack,back,x,yFront,front);uvs.push(t,0,t,1);
    if(i<cols){const a=i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,c,d,b)}
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(indices);geo.computeVertexNormals();
  const top=new THREE.Mesh(geo,grass);top.receiveShadow=true;
  return top;
}

export function createTargetBankV4({seed=1,width=12,depth=8,facing=1}={}){
  const r=rng(seed),g=new THREE.Group();
  g.name=`bank_target_v4_${seed}`;

  // Continuous irregular top surface. The front edge itself meanders, eliminating the prior block/slab silhouette.
  g.add(makeOrganicTop(r,seed,width,depth,facing));

  // M06 finish: smaller overlapping terraces keep the cliff face organic while maintaining readable elevation.
  const bands=[
    {z:depth*.5-.28,y:-.34,scale:.90},
    {z:depth*.5-.53,y:-.76,scale:.72},
    {z:depth*.5-.76,y:-1.13,scale:.54},
    {z:depth*.5-.94,y:-1.42,scale:.38}
  ];
  bands.forEach((band,bi)=>{
    const count=Math.max(10,Math.ceil(width/(bi===0?.62:.78)));
    for(let i=0;i<count;i++){
      if(bi>1 && (i+bi)%5===1) continue;
      const t=(i+.5)/count;
      const x=-width*.5+t*width+(r()-.5)*.30;
      const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14;
      const radius=(.34+r()*.27)*band.scale;
      const geo=deform(new THREE.IcosahedronGeometry(radius,2),r,.18);
      const rock=new THREE.Mesh(geo,rockMats[(i+bi+seed)%rockMats.length]);
      rock.scale.set(1.12+r()*.38,.74+r()*.34,.86+r()*.34);
      rock.position.set(x,band.y+(r()-.5)*.14,facing*(band.z+edgeWave)+(r()-.5)*.12);
      rock.rotation.set((r()-.5)*.24,r()*Math.PI,(r()-.5)*.18);
      g.add(rock);
      if(bi===0 && i%2===0){
        const cap=new THREE.Mesh(new THREE.SphereGeometry(radius*.72,12,7,0,Math.PI*2,0,Math.PI*.50),i%4===0?mossLight:moss);
        cap.scale.set(1.16,.20,.94);
        cap.position.set(rock.position.x,rock.position.y+radius*.43,rock.position.z-facing*.05);
        cap.rotation.y=r()*Math.PI;g.add(cap);
      }
    }
  });

  // Soil pockets interrupt the rock rhythm and provide attachment zones for vegetation.
  for(let i=0;i<8;i++){
    const patch=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(.44+r()*.22,2),r,.17),soil);
    patch.scale.set(1.42,.30,.74);
    const t=(i+.5)/8;
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;
    patch.position.set(-width*.45+i*width*.128+(r()-.5)*.24,-.20-r()*.22,facing*(depth*.5-.31+edgeWave)+(r()-.5)*.22);
    patch.rotation.y=r()*Math.PI;g.add(patch);
  }

  // Clustered lip plants follow the same irregular edge, leaving deliberate breathing gaps.
  const clusters=Math.max(10,Math.ceil(width/.98));
  for(let i=0;i<clusters;i++){
    if(i%6===4) continue;
    const t=i/Math.max(1,clusters-1);
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14;
    const fern=makeFernPatch(r,.50+r()*.34,13+(i%3)*4);
    fern.position.set(-width*.45+t*width*.90+(r()-.5)*.24,.10+(r()-.5)*.07,facing*(depth*.5-.55+edgeWave));
    fern.rotation.y=r()*Math.PI*2;g.add(fern);
  }

  // Embedded top stones visually connect cliff face and playable ground.
  for(let i=0;i<13;i++){
    const rad=.16+r()*.23;
    const stone=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,2),r,.16),rockMats[(i+seed)%rockMats.length]);
    stone.scale.set(1.18,.56,1.04);
    stone.position.set((r()-.5)*width*.84,.16+(r()-.5)*.04,(r()-.5)*depth*.54-facing*.64);
    stone.rotation.y=r()*Math.PI;g.add(stone);
  }

  // Small moss/pebble breakup prevents a repeated boulder-wall rhythm at canonical portrait distance.
  for(let i=0;i<18;i++){
    const rad=.07+r()*.10;
    const pebble=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.16),rockMats[(i+seed+2)%rockMats.length]);
    const t=r();
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;
    pebble.scale.set(1.3,.55,1.0);
    pebble.position.set(-width*.47+t*width*.94,.11+r()*.05,facing*(depth*.5-.50+edgeWave)+(r()-.5)*.32);
    pebble.rotation.y=r()*Math.PI;g.add(pebble);
  }

  // M06 shoreline/contact finish. A broken toe of wet-looking stones closes the visible gap between bank wall and water plane.
  const toeCount=Math.max(12,Math.ceil(width/.72));
  for(let i=0;i<toeCount;i++){
    if((i+seed)%7===2) continue;
    const t=(i+.35)/toeCount;
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14;
    const rad=.13+r()*.18;
    const toe=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.20),rockMats[(i+seed+3)%rockMats.length]);
    toe.scale.set(1.45,.46,.92);
    toe.position.set(-width*.5+t*width+(r()-.5)*.25,-1.48+r()*.16,facing*(depth*.5-1.03+edgeWave)+(r()-.5)*.18);
    toe.rotation.y=r()*Math.PI;g.add(toe);
    if(i%3===0){
      const shelf=new THREE.Mesh(new THREE.CircleGeometry(rad*(1.15+r()*.35),10),i%2?moss:mossLight);
      shelf.rotation.x=-Math.PI/2;shelf.position.set(toe.position.x,toe.position.y+rad*.25,toe.position.z-facing*.03);shelf.scale.set(1.25,.72,1);g.add(shelf);
    }
  }

  // Sparse exposed roots break the repeated rock-only cliff language and visually bind grass cap to cliff face.
  const rootCount=Math.max(5,Math.floor(width/2.1));
  for(let i=0;i<rootCount;i++){
    const t=(i+.55)/rootCount;
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;
    const len=.65+r()*.75;
    const root=new THREE.Mesh(new THREE.CylinderGeometry(.028+r()*.025,.055+r()*.035,len,6),rootMat);
    root.position.set(-width*.46+t*width*.92,-.34-len*.34,facing*(depth*.5-.42+edgeWave));
    root.rotation.z=(r()-.5)*.28;root.rotation.x=facing*(.10+r()*.18);g.add(root);
  }

  g.userData={assetId:'bank_target_v4',version:'4.3.0',seed,stage:'M06_FINISH_CANDIDATE',source:'repo-procedural',intent:'continuous irregular forest bank with layered cliff terraces, soil and fern lip, shoreline toe rubble, moss shelves and exposed roots to remove water/cliff seams'};
  return shadows(g);
}
