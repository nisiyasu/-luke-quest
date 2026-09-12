import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shadow(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const bark=new THREE.MeshStandardMaterial({color:0x624229,roughness:.98});
const barkDark=new THREE.MeshStandardMaterial({color:0x3f2b1c,roughness:.99});
const foliage=[
  new THREE.MeshStandardMaterial({color:0x153f28,roughness:.97,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x2a6338,roughness:.95,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x477f42,roughness:.93,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x789f55,roughness:.91,side:THREE.DoubleSide})
];
const groundMoss=[
  new THREE.MeshStandardMaterial({color:0x385c31,roughness:1,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x617d3d,roughness:1,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x796d42,roughness:1,side:THREE.DoubleSide})
];
const pebbleMat=new THREE.MeshStandardMaterial({color:0x77746b,roughness:.98});

function fanGeo(){
  const g=new THREE.BufferGeometry();
  const v=new Float32Array([
     0,0,0,   -.34,.015,.24,  -.42,.035,.52,  -.22,.055,.78,   0,.065,.94,
     .22,.055,.78, .42,.035,.52, .34,.015,.24
  ]);
  g.setAttribute('position',new THREE.BufferAttribute(v,3));
  g.setIndex([0,1,2,0,2,3,0,3,4,0,4,5,0,5,6,0,6,7]);
  g.computeVertexNormals();
  return g;
}
const FAN=fanGeo();

function addGroundCollar(root,r,scale,family){
  // v3.7: every tree now grows out of an irregular authored ground collar instead of
  // terminating as the same bare cylinder on a flat field. This is collision-neutral
  // and intentionally low-profile so existing traversal/massing stays unchanged.
  const dummy=new THREE.Object3D();
  const patchGeo=new THREE.CircleGeometry(.34*scale,9);
  const patchLists=[[],[],[]];
  const patchCount=10+(family%3)*2;
  for(let i=0;i<patchCount;i++){
    const a=r()*Math.PI*2,rad=(.22+r()*.88)*scale;
    patchLists[i%3].push({x:Math.cos(a)*rad,z:Math.sin(a)*rad,ry:r()*Math.PI,sx:.72+r()*.72,sz:.45+r()*.70,y:.018+r()*.012});
  }
  patchLists.forEach((list,mi)=>{
    const mesh=new THREE.InstancedMesh(patchGeo,groundMoss[mi],list.length);
    list.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(-Math.PI/2,v.ry,0);dummy.scale.set(v.sx,v.sz,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;mesh.castShadow=false;root.add(mesh);
  });
  const stoneGeo=new THREE.IcosahedronGeometry(.12*scale,1),stones=new THREE.InstancedMesh(stoneGeo,pebbleMat,5+family);
  for(let i=0;i<stones.count;i++){
    const a=r()*Math.PI*2,rad=(.46+r()*.72)*scale;
    dummy.position.set(Math.cos(a)*rad,.065*scale,Math.sin(a)*rad);dummy.rotation.set((r()-.5)*.2,r()*Math.PI,(r()-.5)*.2);dummy.scale.set(.75+r()*.75,.45+r()*.35,.70+r()*.65);dummy.updateMatrix();stones.setMatrixAt(i,dummy.matrix);
  }
  stones.instanceMatrix.needsUpdate=true;stones.castShadow=true;stones.receiveShadow=true;root.add(stones);

  // Two seed-driven sapling/fern fans make neighbouring tree bases read as grouped ecology,
  // not cloned isolated props. Deliberate gaps keep the route legible.
  const fanCount=8+(family%2)*4,baseFans=new THREE.InstancedMesh(FAN,foliage[(family+1)%3],fanCount);
  for(let i=0;i<fanCount;i++){
    const side=i%2?-1:1,a=side*(.62+r()*.62)+(r()-.5)*.30,rad=(.48+r()*.58)*scale;
    dummy.position.set(Math.cos(a)*rad,.05*scale,Math.sin(a)*rad);dummy.rotation.set(-.62-r()*.18,-a+Math.PI/2,(r()-.5)*.22);dummy.scale.set((.18+r()*.11)*scale,1,(.30+r()*.18)*scale);dummy.updateMatrix();baseFans.setMatrixAt(i,dummy.matrix);
  }
  baseFans.instanceMatrix.needsUpdate=true;baseFans.receiveShadow=true;baseFans.castShadow=false;root.add(baseFans);
}

export function createTargetConiferV31({seed=1,scale=1}={}){
  const r=rng(seed),root=new THREE.Group(),dummy=new THREE.Object3D();
  root.name=`conifer_target_v31_${seed}`;

  // Five silhouette families + seed-specific missing sectors prevent cloned-tree rhythm.
  const family=seed%5;
  const h=(5.05+r()*1.28+(family===1?.52:family===3?-.28:family===4?.22:0))*scale;
  const trunkLeanX=(r()-.5)*.09,trunkLeanZ=(r()-.5)*.09;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry((.145+(family===4?.025:0))*scale,(.38+(family===2?.06:0))*scale,h,12),bark);
  trunk.position.y=h*.5;trunk.rotation.x=trunkLeanX;trunk.rotation.z=trunkLeanZ;root.add(trunk);
  for(let i=0;i<8;i++){
    if(family===3&&i===2)continue;
    const a=i/8*Math.PI*2,rt=new THREE.Mesh(new THREE.CylinderGeometry(.05*scale,.14*scale,.96*scale,7),i%2?barkDark:bark);
    rt.position.set(Math.cos(a)*.37*scale,.08*scale,Math.sin(a)*.37*scale);rt.rotation.set(0,-a,Math.PI/2.12);root.add(rt);
  }

  const branchData=[],fanData=[[],[],[],[]],tipData=[[],[],[]];
  const levels=[16,18,15,14,17][family];
  const crownBias=[1,.90,1.10,.82,.96][family];
  const missingSector=((seed*0.61803398875)%1)*Math.PI*2;
  for(let lv=0;lv<levels;lv++){
    const n=lv/(levels-1),y=(.58+h*(.056*lv)*(16/levels))*scale;
    const broadness=[1,.86,1.15,.94,1.04][family];
    const tierRadius=(2.18*(1-Math.pow(n,.80))+.24)*scale*broadness;
    const branches=9+((lv+family)%5);
    for(let i=0;i<branches;i++){
      const a=i/branches*Math.PI*2+(lv%2)*.17+(r()-.5)*.20;
      const sectorDelta=Math.atan2(Math.sin(a-missingSector),Math.cos(a-missingSector));
      const intentionalWindow=Math.abs(sectorDelta)<(.20+(family===3?.17:.05)) && lv>2 && lv<levels-3;
      if(intentionalWindow||(lv<5&&(i+seed+lv)%11===3)||(family===3&&lv%4===1&&i%6===2))continue;
      const len=tierRadius*(.72+r()*.34)*(family===4&&i%3===0?1.10:1);
      const droop=.06+(1-n)*(.07+r()*.11)+(family===2?.04:family===1?-.015:0);
      branchData.push({a,len,y,droop,n});
      const pads=4+((i+lv+family)%4);
      for(let p=0;p<pads;p++){
        const d=len*(.18+p*(.67/Math.max(1,pads-1))),side=(p%2?1:-1),mat=(lv+i+p+family)%4;
        const outer=p===pads-1;
        fanData[mat].push({
          x:Math.cos(a)*d+Math.cos(a+Math.PI/2)*side*(.055+r()*.055)*scale,
          y:y-(.018+p*.014)*scale-d*droop,
          z:Math.sin(a)*d+Math.sin(a+Math.PI/2)*side*(.055+r()*.055)*scale,
          rx:-.25-(1-n)*.13-r()*.13,
          ry:-a+Math.PI/2+(r()-.5)*.19,
          rz:(r()-.5)*.15,
          sx:(.36+r()*.18)*scale*(family===2?1.08:1)*(outer?1.12:1),
          sz:(.50+r()*.23)*scale*(outer?1.15:1)
        });
      }
      const tm=(lv+i+family)%3;
      tipData[tm].push({x:Math.cos(a)*len,y:y-len*droop,z:Math.sin(a)*len,rx:-.40-(1-n)*.08,ry:-a+Math.PI/2,rz:(r()-.5)*.20,sx:(.25+r()*.12)*scale,sz:(.42+r()*.17)*scale});
    }
  }

  const bgeo=new THREE.CylinderGeometry(.023*scale,.062*scale,1,6);
  const branches=new THREE.InstancedMesh(bgeo,barkDark,branchData.length);
  branchData.forEach((v,i)=>{dummy.position.set(Math.cos(v.a)*v.len*.46,v.y-v.len*v.droop*.20,Math.sin(v.a)*v.len*.46);dummy.rotation.set(.10+v.droop,-v.a,Math.PI/2.03);dummy.scale.set(1,v.len,1);dummy.updateMatrix();branches.setMatrixAt(i,dummy.matrix)});
  branches.instanceMatrix.needsUpdate=true;root.add(branches);

  foliage.forEach((mat,mi)=>{
    const arr=fanData[mi],mesh=new THREE.InstancedMesh(FAN,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.rx,v.ry,v.rz);dummy.scale.set(v.sx*.78,1,v.sz*.84);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });
  [foliage[0],foliage[1],foliage[2]].forEach((mat,mi)=>{
    const arr=tipData[mi],mesh=new THREE.InstancedMesh(FAN,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.rx,v.ry,v.rz);dummy.scale.set(v.sx,1,v.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });

  // Small needle masses add volume, but the silhouette is led by articulated branch fans rather than stacked cones.
  const tuftGeo=new THREE.ConeGeometry(.29*scale,.58*scale,9,1,false),tuftData=[[],[],[]];
  branchData.forEach((v,bi)=>{
    for(const q of [.56,.80,.97]){
      if(q>.9&&bi%3===1)continue;
      const d=v.len*q,mi=(bi+(q>.9?2:q>.7?1:0))%3;
      tuftData[mi].push({x:Math.cos(v.a)*d,y:v.y-d*v.droop+(.055+(bi%4)*.018)*scale,z:Math.sin(v.a)*d,ry:v.a+(bi%5)*.16,sx:(.80+(bi%5)*.055)*(family===2?1.06:1),sy:.62+(bi%4)*.065,sz:.74+((bi+2)%5)*.045});
    }
  });
  [foliage[0],foliage[1],foliage[2]].forEach((mat,mi)=>{
    const arr=tuftData[mi],mesh=new THREE.InstancedMesh(tuftGeo,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set((i%5-.2)*.018,v.ry,(i%7-.3)*.016);dummy.scale.set(v.sx,v.sy,v.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });

  // v3.7 crown: family-specific crown density/drift plus a directional opening avoids one repeated top silhouette.
  const crownGeo=new THREE.ConeGeometry(1,1,12),crownCount=family===3?2:family===1?4:3,crown=new THREE.InstancedMesh(crownGeo,foliage[1],crownCount);
  let crownDriftX=0,crownDriftZ=0;
  for(let i=0;i<crownCount;i++){
    crownDriftX+=(r()-.5)*.040*scale;crownDriftZ+=(r()-.5)*.040*scale;
    const rad=(.36-i*.050)*scale*crownBias;
    dummy.position.set(crownDriftX,h-.61*scale+i*.17*scale,crownDriftZ);
    dummy.rotation.set(0,r()*Math.PI,(r()-.5)*.055);dummy.scale.set(rad,.46*scale,rad);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);
  }
  crown.instanceMatrix.needsUpdate=true;root.add(crown);
  const crownFanCount=24+(seed%9)+(family===2?8:family===3?-4:0),crownFans=new THREE.InstancedMesh(FAN,foliage[2],crownFanCount);
  for(let i=0;i<crownFanCount;i++){
    const t=i/Math.max(1,crownFanCount-1),a=i*2.3999632297+(r()-.5)*.28;
    if(Math.abs(Math.atan2(Math.sin(a-missingSector),Math.cos(a-missingSector)))<.18&&i%2===0)continue;
    const vertical=.22+t*.92,rad=(.54*(1-t*.70)+.10)*scale*crownBias;
    dummy.position.set(Math.cos(a)*rad,h-(1.18-vertical*.80)*scale,Math.sin(a)*rad);
    dummy.rotation.set(-.56+(r()-.5)*.18,-a+Math.PI/2,(r()-.5)*.24);
    dummy.scale.set((.23+r()*.12)*scale,1,(.42+r()*.20)*scale*(1-t*.22));dummy.updateMatrix();crownFans.setMatrixAt(i,dummy.matrix);
  }
  crownFans.instanceMatrix.needsUpdate=true;root.add(crownFans);

  const skirtCount=[18,14,23,12,20][family];
  const skirt=new THREE.InstancedMesh(FAN,foliage[0],skirtCount);
  for(let i=0;i<skirtCount;i++){
    const a=i/skirtCount*Math.PI*2+(r()-.5)*.16;
    const sectorDelta=Math.atan2(Math.sin(a-missingSector),Math.cos(a-missingSector));
    const rad=(.40+r()*.56)*scale;
    const suppress=Math.abs(sectorDelta)<.28&&i%2===0;
    dummy.position.set(Math.cos(a)*rad,.27*scale+(r()-.5)*.06*scale,Math.sin(a)*rad);dummy.rotation.set(-.39-r()*.13,-a+Math.PI/2,(r()-.5)*.15);dummy.scale.set((suppress?.16:.50+r()*.18)*scale,1,(suppress?.28:.68+r()*.22)*scale);dummy.updateMatrix();skirt.setMatrixAt(i,dummy.matrix);
  }
  skirt.instanceMatrix.needsUpdate=true;root.add(skirt);

  const deadCount=2+(seed%4);
  for(let i=0;i<deadCount;i++){
    const a=r()*Math.PI*2,len=(.42+r()*.62)*scale,y=(.78+r()*1.65)*scale;
    const dead=new THREE.Mesh(new THREE.CylinderGeometry(.018*scale,.045*scale,len,5),barkDark);
    dead.position.set(Math.cos(a)*len*.42,y,Math.sin(a)*len*.42);dead.rotation.set(.16+r()*.22,-a,Math.PI/2.08);root.add(dead);
  }

  addGroundCollar(root,r,scale,family);
  root.rotation.y=r()*Math.PI*2;
  root.userData={assetId:'conifer_target_v31',version:'3.7.0',seed,stage:'M04_REGATE_CANDIDATE',source:'repo-procedural',rendering:'instanced-directional-fans-plus-seed-windows-plus-ground-ecology',variationFamily:family,intent:'five seed-driven mature conifer families with intentional crown/branch openings, family-specific height/breadth/skirt language, and collision-neutral moss/stone/fern ground collars to reduce clone rhythm and hard tree-to-terrain joins'};
  return shadow(root);
}
