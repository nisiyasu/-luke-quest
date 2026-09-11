import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function markShadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const barkDark=new THREE.MeshStandardMaterial({color:0x3e2c20,roughness:.99});
const barkWarm=new THREE.MeshStandardMaterial({color:0x60402a,roughness:.98});
const needleDeep=new THREE.MeshStandardMaterial({color:0x123c29,roughness:.96,side:THREE.DoubleSide});
const needleMid=new THREE.MeshStandardMaterial({color:0x286b3c,roughness:.94,side:THREE.DoubleSide});
const needleSun=new THREE.MeshStandardMaterial({color:0x60964f,roughness:.91,side:THREE.DoubleSide});
const fernDark=new THREE.MeshStandardMaterial({color:0x315d2e,roughness:.98,side:THREE.DoubleSide});
const fernLight=new THREE.MeshStandardMaterial({color:0x739b4b,roughness:.98,side:THREE.DoubleSide});

function frondGeometry(){
  const g=new THREE.BufferGeometry();
  const v=new Float32Array([
    0,0,0, -.30,.02,.34, -.18,.035,.72, 0,.045,1.0,
    .18,.035,.72, .30,.02,.34, 0,0,0
  ]);
  g.setAttribute('position',new THREE.BufferAttribute(v,3));
  g.setIndex([0,1,2,0,2,3,0,3,4,0,4,5]);
  g.computeVertexNormals();
  return g;
}

const FROND=frondGeometry();

export function createTargetConifer({seed=1,scale=1}={}){
  const r=rng(seed),g=new THREE.Group(),dummy=new THREE.Object3D();
  g.name=`conifer_target_v3_${seed}`;
  const h=(5.9+r()*.9)*scale;

  const trunkGeo=new THREE.CylinderGeometry(.17*scale,.38*scale,h,11);
  const trunk=new THREE.Mesh(trunkGeo,barkWarm);trunk.position.y=h*.5;g.add(trunk);
  const rootGeo=new THREE.CylinderGeometry(.07*scale,.15*scale,1,7);
  for(let i=0;i<7;i++){
    const root=new THREE.Mesh(rootGeo,i%2?barkDark:barkWarm),a=i/7*Math.PI*2;
    root.position.set(Math.cos(a)*.40*scale,.08*scale,Math.sin(a)*.40*scale);
    root.rotation.set(0,-a,Math.PI/2.18);root.scale.y=.72+r()*.35;g.add(root);
  }

  const branchSpecs=[];
  const frondSpecs=[[],[],[]];
  const levels=12;
  for(let lv=0;lv<levels;lv++){
    const n=lv/(levels-1),y=(.82+lv*h*.061)*scale;
    const radius=(2.05*(1-n*.78)+.20)*scale;
    const count=9+(lv%4);
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2+(lv%2)*.17+(r()-.5)*.17;
      const len=radius*(.78+r()*.30);
      branchSpecs.push({x:Math.cos(a)*len*.38,y,z:Math.sin(a)*len*.38,a,len,drop:.08+n*.05});
      for(let sp=0;sp<4;sp++){
        const d=len*(.32+sp*.19),mi=(lv+i+sp)%3;
        frondSpecs[mi].push({
          x:Math.cos(a)*d,
          y:y+(sp-1.5)*.065*scale,
          z:Math.sin(a)*d,
          rx:-.22-r()*.15-(lv<4?.08:0),
          ry:-a+Math.PI/2+(r()-.5)*.15,
          rz:(r()-.5)*.13,
          sx:(.56+r()*.18)*scale,
          sz:(.72+r()*.26)*scale
        });
      }
    }
  }

  const branchGeo=new THREE.CylinderGeometry(.026*scale,.065*scale,1,6);
  const branches=new THREE.InstancedMesh(branchGeo,barkDark,branchSpecs.length);
  branchSpecs.forEach((v,i)=>{
    dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.drop,-v.a,Math.PI/2.05);dummy.scale.set(1,v.len,1);dummy.updateMatrix();branches.setMatrixAt(i,dummy.matrix);
  });
  branches.instanceMatrix.needsUpdate=true;g.add(branches);

  [needleDeep,needleMid,needleSun].forEach((mat,mi)=>{
    const list=frondSpecs[mi],mesh=new THREE.InstancedMesh(FROND,mat,list.length);
    list.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.rx,v.ry,v.rz);dummy.scale.set(v.sx,1,v.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;g.add(mesh);
  });

  const crownGeo=new THREE.ConeGeometry(1,1,8);
  const crown=new THREE.InstancedMesh(crownGeo,needleMid,9);
  for(let i=0;i<9;i++){
    const rad=(.68-i*.052)*scale;
    dummy.position.set((r()-.5)*.08*scale,h-.98*scale+i*.17*scale,(r()-.5)*.08*scale);
    dummy.rotation.set(0,r()*Math.PI,0);dummy.scale.set(rad,.95*scale,rad);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);
  }
  crown.instanceMatrix.needsUpdate=true;g.add(crown);

  const skirt=new THREE.InstancedMesh(FROND,needleDeep,14);
  for(let i=0;i<14;i++){
    const a=i/14*Math.PI*2+(r()-.5)*.12,rad=(.62+r()*.32)*scale;
    dummy.position.set(Math.cos(a)*rad,.38*scale,Math.sin(a)*rad);
    dummy.rotation.set(-.38,-a+Math.PI/2,(r()-.5)*.12);
    dummy.scale.set(.68*scale,1,1.05*scale);dummy.updateMatrix();skirt.setMatrixAt(i,dummy.matrix);
  }
  skirt.instanceMatrix.needsUpdate=true;g.add(skirt);

  g.rotation.y=r()*Math.PI*2;
  g.userData={assetId:'conifer_target_v3',version:'3.0.0',seed,stage:'M04_PRODUCTION_CANDIDATE',rendering:'instanced-layered-fronds',source:'repo-procedural'};
  return markShadows(g);
}

export function createTargetFernPatch({seed=1,scale=1,count=18}={}){
  const r=rng(seed),g=new THREE.Group(),dummy=new THREE.Object3D();
  const blade=new THREE.PlaneGeometry(.18,1.0,1,4);
  const groups=[[],[]];
  for(let i=0;i<count;i++){
    const a=r()*Math.PI*2,rad=Math.sqrt(r())*.78*scale,h=(.55+r()*.65)*scale;
    groups[i%2].push({x:Math.cos(a)*rad,z:Math.sin(a)*rad,a,h,lean:.22+r()*.36});
  }
  [fernDark,fernLight].forEach((mat,mi)=>{
    const list=groups[mi],mesh=new THREE.InstancedMesh(blade,mat,list.length);
    list.forEach((v,i)=>{
      dummy.position.set(v.x,v.h*.46,v.z);dummy.rotation.set(-v.lean,-v.a,0);dummy.scale.set(.72+r()*.45,v.h,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;g.add(mesh);
  });
  g.userData={assetId:'fern_patch_target_v1',version:'1.0.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural'};
  return g;
}

export function targetAssetMetadata(){
  return {
    conifer_target_v3:{version:'3.0.0',provenance:'repo-procedural',intent:'lush layered target-facing conifer silhouette'},
    fern_patch_target_v1:{version:'1.0.0',provenance:'repo-procedural',intent:'dense near-ground vegetation micro-layer'}
  };
}
