import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shadow(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const bark=new THREE.MeshStandardMaterial({color:0x68482e,roughness:.98});
const barkDark=new THREE.MeshStandardMaterial({color:0x44301f,roughness:.99});
const foliage=[
  new THREE.MeshStandardMaterial({color:0x245a34,roughness:.96,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x377744,roughness:.94,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x568f4f,roughness:.92,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x86b866,roughness:.90,side:THREE.DoubleSide})
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

  // M06 variation contract: each seed gets a recognizable silhouette family instead of a repeated cloned cone.
  const family=seed%4;
  const h=(5.25+r()*1.05+(family===1?.45:family===3?-.25:0))*scale;
  const trunkLeanX=(r()-.5)*.075, trunkLeanZ=(r()-.5)*.075;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.17*scale,.43*scale,h,12),bark);
  trunk.position.y=h*.5;trunk.rotation.x=trunkLeanX;trunk.rotation.z=trunkLeanZ;root.add(trunk);
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2,rt=new THREE.Mesh(new THREE.CylinderGeometry(.055*scale,.14*scale,.95*scale,7),i%2?barkDark:bark);
    rt.position.set(Math.cos(a)*.38*scale,.08*scale,Math.sin(a)*.38*scale);rt.rotation.set(0,-a,Math.PI/2.12);root.add(rt);
  }

  const branchData=[],fanData=[[],[],[],[]];
  const levels=family===0?14:family===1?15:family===2?13:12;
  const crownBias=family===0?1:family===1?.90:family===2?1.12:.82;
  for(let lv=0;lv<levels;lv++){
    const n=lv/(levels-1),y=(.60+h*(.058*lv)*(14/levels))*scale;
    const broadness=family===0?1:family===1?.88:family===2?1.16:.96;
    const tierRadius=(2.2*(1-Math.pow(n,.78))+.28)*scale*broadness;
    const branches=9+((lv+family)%4);
    for(let i=0;i<branches;i++){
      // Deliberate sparse windows and a few bare lower limbs break the uniform bottle-brush rhythm.
      if((lv<4 && (i+seed+lv)%11===3) || (family===3 && lv%4===1 && i%7===2)) continue;
      const a=i/branches*Math.PI*2+(lv%2)*.19+(r()-.5)*.16;
      const len=tierRadius*(.76+r()*.30);
      const droop=.07+(1-n)*(.08+r()*.11)+(family===2?.04:0);
      branchData.push({a,len,y,droop});
      const pads=4+((i+lv+family)%3);
      for(let p=0;p<pads;p++){
        const d=len*(.22+p*(.56/Math.max(1,pads-1))),side=(p%2?1:-1),mat=(lv+i+p+family)%4;
        fanData[mat].push({
          x:Math.cos(a)*d+Math.cos(a+Math.PI/2)*side*(.07+r()*.035)*scale,
          y:y-(.025+p*.017)*scale-d*droop,
          z:Math.sin(a)*d+Math.sin(a+Math.PI/2)*side*(.07+r()*.035)*scale,
          rx:-.29-(1-n)*.11-r()*.10,
          ry:-a+Math.PI/2+(r()-.5)*.15,
          rz:(r()-.5)*.11,
          sx:(.43+r()*.16)*scale*(family===2?1.08:1),
          sz:(.50+r()*.19)*scale
        });
      }
    }
  }

  const bgeo=new THREE.CylinderGeometry(.025*scale,.064*scale,1,6);
  const branches=new THREE.InstancedMesh(bgeo,barkDark,branchData.length);
  branchData.forEach((v,i)=>{dummy.position.set(Math.cos(v.a)*v.len*.46,v.y-v.len*v.droop*.20,Math.sin(v.a)*v.len*.46);dummy.rotation.set(.10+v.droop,-v.a,Math.PI/2.03);dummy.scale.set(1,v.len,1);dummy.updateMatrix();branches.setMatrixAt(i,dummy.matrix)});
  branches.instanceMatrix.needsUpdate=true;root.add(branches);

  foliage.forEach((mat,mi)=>{
    const arr=fanData[mi],mesh=new THREE.InstancedMesh(FAN,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.rx,v.ry,v.rz);dummy.scale.set(v.sx*.82,1,v.sz*.82);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });

  // M04 quality re-gate v3.3: directional fans plus compact volume clusters carry mature crown mass.
  const tuftGeo=new THREE.IcosahedronGeometry(.34*scale,1),tuftData=[[],[],[]];
  branchData.forEach((v,bi)=>{
    for(const q of [.54,.78,.96]){
      if(q>.9 && bi%3===1) continue;
      const d=v.len*q,mi=(bi+(q>.9?2:q>.7?1:0))%3;
      tuftData[mi].push({x:Math.cos(v.a)*d,y:v.y-d*v.droop+(.02+(bi%4)*.018)*scale,z:Math.sin(v.a)*d,ry:v.a+(bi%5)*.17,sx:(.86+(bi%5)*.07)*(family===2?1.08:1),sy:.58+(bi%4)*.07,sz:.72+((bi+2)%5)*.06});
    }
  });
  [foliage[0],foliage[1],foliage[2]].forEach((mat,mi)=>{
    const arr=tuftData[mi],mesh=new THREE.InstancedMesh(tuftGeo,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set((i%5-.2)*.025,v.ry,(i%7-.3)*.018);dummy.scale.set(v.sx,v.sy,v.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });
  const crownGeo=new THREE.ConeGeometry(1,1,10),crownCount=family===3?6:8,crown=new THREE.InstancedMesh(crownGeo,foliage[1],crownCount);
  let crownDriftX=0,crownDriftZ=0;
  for(let i=0;i<crownCount;i++){
    crownDriftX+=(r()-.5)*.035*scale;crownDriftZ+=(r()-.5)*.035*scale;
    const rad=(.66-i*.058)*scale*crownBias;
    dummy.position.set(crownDriftX,h-.82*scale+i*.15*scale,crownDriftZ);
    dummy.rotation.set(0,r()*Math.PI,(r()-.5)*.035);dummy.scale.set(rad,.82*scale,rad);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);
  }
  crown.instanceMatrix.needsUpdate=true;root.add(crown);

  const skirtCount=family===1?14:family===2?20:17;
  const skirt=new THREE.InstancedMesh(FAN,foliage[0],skirtCount);
  for(let i=0;i<skirtCount;i++){
    const a=i/skirtCount*Math.PI*2+(r()-.5)*.13,rad=(.45+r()*.48)*scale;
    dummy.position.set(Math.cos(a)*rad,.28*scale+(r()-.5)*.05*scale,Math.sin(a)*rad);dummy.rotation.set(-.40-r()*.10,-a+Math.PI/2,(r()-.5)*.12);dummy.scale.set((.55+r()*.15)*scale,1,(.68+r()*.18)*scale);dummy.updateMatrix();skirt.setMatrixAt(i,dummy.matrix);
  }
  skirt.instanceMatrix.needsUpdate=true;root.add(skirt);

  // A small number of dead branch stubs gives mature trees age and prevents foliage-only repetition.
  const deadCount=2+(seed%3);
  for(let i=0;i<deadCount;i++){
    const a=r()*Math.PI*2,len=(.45+r()*.55)*scale,y=(.85+r()*1.45)*scale;
    const dead=new THREE.Mesh(new THREE.CylinderGeometry(.018*scale,.045*scale,len,5),barkDark);
    dead.position.set(Math.cos(a)*len*.42,y,Math.sin(a)*len*.42);dead.rotation.set(.16+r()*.18,-a,Math.PI/2.08);root.add(dead);
  }

  root.rotation.y=r()*Math.PI*2;
  root.userData={assetId:'conifer_target_v31',version:'3.3.0',seed,stage:'M06_FINISH_CANDIDATE',source:'repo-procedural',rendering:'instanced-fans-plus-volumetric-tufts',variationFamily:family,intent:'seed-driven mature conifer families with compact volumetric foliage masses layered over directional needle fans, varied height, breadth, sparse windows, droop, crown drift, skirt density and dead branch detail'};
  return shadow(root);
}
