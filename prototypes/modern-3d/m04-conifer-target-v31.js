import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shadow(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const bark=new THREE.MeshStandardMaterial({color:0x624229,roughness:.98});
const barkDark=new THREE.MeshStandardMaterial({color:0x3f2b1c,roughness:.99});
const foliage=[
  new THREE.MeshStandardMaterial({color:0x1b4d2e,roughness:.97,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x2d6839,roughness:.95,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x477f42,roughness:.93,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x729f55,roughness:.91,side:THREE.DoubleSide})
];

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

export function createTargetConiferV31({seed=1,scale=1}={}){
  const r=rng(seed),root=new THREE.Group(),dummy=new THREE.Object3D();
  root.name=`conifer_target_v31_${seed}`;

  // Four silhouette families prevent cloned-tree rhythm in the actual runtime forest wall.
  const family=seed%4;
  const h=(5.35+r()*1.12+(family===1?.42:family===3?-.20:0))*scale;
  const trunkLeanX=(r()-.5)*.075,trunkLeanZ=(r()-.5)*.075;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16*scale,.42*scale,h,12),bark);
  trunk.position.y=h*.5;trunk.rotation.x=trunkLeanX;trunk.rotation.z=trunkLeanZ;root.add(trunk);
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2,rt=new THREE.Mesh(new THREE.CylinderGeometry(.05*scale,.14*scale,.96*scale,7),i%2?barkDark:bark);
    rt.position.set(Math.cos(a)*.37*scale,.08*scale,Math.sin(a)*.37*scale);rt.rotation.set(0,-a,Math.PI/2.12);root.add(rt);
  }

  const branchData=[],fanData=[[],[],[],[]],tipData=[[],[],[]];
  const levels=family===0?16:family===1?17:family===2?15:14;
  const crownBias=family===0?1:family===1?.91:family===2?1.10:.84;
  for(let lv=0;lv<levels;lv++){
    const n=lv/(levels-1),y=(.58+h*(.056*lv)*(16/levels))*scale;
    const broadness=family===0?1:family===1?.88:family===2?1.14:.96;
    const tierRadius=(2.18*(1-Math.pow(n,.80))+.24)*scale*broadness;
    const branches=10+((lv+family)%4);
    for(let i=0;i<branches;i++){
      if((lv<5&&(i+seed+lv)%12===3)||(family===3&&lv%4===1&&i%7===2))continue;
      const a=i/branches*Math.PI*2+(lv%2)*.17+(r()-.5)*.18;
      const len=tierRadius*(.76+r()*.29);
      const droop=.065+(1-n)*(.07+r()*.105)+(family===2?.035:0);
      branchData.push({a,len,y,droop,n});
      const pads=5+((i+lv+family)%3);
      for(let p=0;p<pads;p++){
        const d=len*(.18+p*(.66/Math.max(1,pads-1))),side=(p%2?1:-1),mat=(lv+i+p+family)%4;
        const outer=p===pads-1;
        fanData[mat].push({
          x:Math.cos(a)*d+Math.cos(a+Math.PI/2)*side*(.06+r()*.04)*scale,
          y:y-(.018+p*.014)*scale-d*droop,
          z:Math.sin(a)*d+Math.sin(a+Math.PI/2)*side*(.06+r()*.04)*scale,
          rx:-.25-(1-n)*.13-r()*.11,
          ry:-a+Math.PI/2+(r()-.5)*.17,
          rz:(r()-.5)*.13,
          sx:(.38+r()*.15)*scale*(family===2?1.06:1)*(outer?1.10:1),
          sz:(.52+r()*.20)*scale*(outer?1.13:1)
        });
      }
      const tm=(lv+i+family)%3;
      tipData[tm].push({x:Math.cos(a)*len,y:y-len*droop,z:Math.sin(a)*len,rx:-.40-(1-n)*.08,ry:-a+Math.PI/2,rz:(r()-.5)*.18,sx:(.27+r()*.10)*scale,sz:(.44+r()*.14)*scale});
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

  // v3.6 crown: only a tiny core remains volumetric. A ragged fan crown now carries the visible top silhouette.
  const crownGeo=new THREE.ConeGeometry(1,1,12),crownCount=3,crown=new THREE.InstancedMesh(crownGeo,foliage[1],crownCount);
  let crownDriftX=0,crownDriftZ=0;
  for(let i=0;i<crownCount;i++){
    crownDriftX+=(r()-.5)*.028*scale;crownDriftZ+=(r()-.5)*.028*scale;
    const rad=(.36-i*.055)*scale*crownBias;
    dummy.position.set(crownDriftX,h-.61*scale+i*.17*scale,crownDriftZ);
    dummy.rotation.set(0,r()*Math.PI,(r()-.5)*.045);dummy.scale.set(rad,.48*scale,rad);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);
  }
  crown.instanceMatrix.needsUpdate=true;root.add(crown);
  const crownFanCount=28+(seed%7),crownFans=new THREE.InstancedMesh(FAN,foliage[2],crownFanCount);
  for(let i=0;i<crownFanCount;i++){
    const t=i/Math.max(1,crownFanCount-1),a=i*2.3999632297+(r()-.5)*.22;
    const vertical=.22+t*.92,rad=(.54*(1-t*.70)+.10)*scale*crownBias;
    dummy.position.set(Math.cos(a)*rad,h-(1.18-vertical*.80)*scale,Math.sin(a)*rad);
    dummy.rotation.set(-.56+(r()-.5)*.16,-a+Math.PI/2,(r()-.5)*.22);
    dummy.scale.set((.24+r()*.11)*scale,1,(.43+r()*.18)*scale*(1-t*.22));dummy.updateMatrix();crownFans.setMatrixAt(i,dummy.matrix);
  }
  crownFans.instanceMatrix.needsUpdate=true;root.add(crownFans);

  const skirtCount=family===1?16:family===2?22:19;
  const skirt=new THREE.InstancedMesh(FAN,foliage[0],skirtCount);
  for(let i=0;i<skirtCount;i++){
    const a=i/skirtCount*Math.PI*2+(r()-.5)*.13,rad=(.43+r()*.50)*scale;
    dummy.position.set(Math.cos(a)*rad,.27*scale+(r()-.5)*.05*scale,Math.sin(a)*rad);dummy.rotation.set(-.39-r()*.11,-a+Math.PI/2,(r()-.5)*.12);dummy.scale.set((.52+r()*.15)*scale,1,(.70+r()*.19)*scale);dummy.updateMatrix();skirt.setMatrixAt(i,dummy.matrix);
  }
  skirt.instanceMatrix.needsUpdate=true;root.add(skirt);

  const deadCount=2+(seed%3);
  for(let i=0;i<deadCount;i++){
    const a=r()*Math.PI*2,len=(.45+r()*.55)*scale,y=(.85+r()*1.45)*scale;
    const dead=new THREE.Mesh(new THREE.CylinderGeometry(.018*scale,.045*scale,len,5),barkDark);
    dead.position.set(Math.cos(a)*len*.42,y,Math.sin(a)*len*.42);dead.rotation.set(.16+r()*.18,-a,Math.PI/2.08);root.add(dead);
  }

  root.rotation.y=r()*Math.PI*2;
  root.userData={assetId:'conifer_target_v31',version:'3.6.0',seed,stage:'M04_REGATE_CANDIDATE',source:'repo-procedural',rendering:'instanced-directional-fans-plus-fine-tip-sprays-plus-small-tufts-plus-ragged-fan-crown',variationFamily:family,intent:'seed-driven mature conifer families with branch-led silhouettes; v3.6 removes the dominant stacked-cone crown rhythm by replacing it with a small volumetric core and irregular articulated crown sprays while preserving prior height/breadth/windows/droop/skirt/dead-branch variation'};
  return shadow(root);
}
