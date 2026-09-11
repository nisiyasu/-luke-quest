import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shadow(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const bark=new THREE.MeshStandardMaterial({color:0x513622,roughness:.98});
const barkDark=new THREE.MeshStandardMaterial({color:0x332519,roughness:.99});
const foliage=[
  new THREE.MeshStandardMaterial({color:0x153f29,roughness:.96,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x285f35,roughness:.94,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x477f42,roughness:.92,side:THREE.DoubleSide}),
  new THREE.MeshStandardMaterial({color:0x74a557,roughness:.90,side:THREE.DoubleSide})
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
  const h=(5.6+r()*.8)*scale;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.18*scale,.42*scale,h,12),bark);
  trunk.position.y=h*.5;root.add(trunk);
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2,rt=new THREE.Mesh(new THREE.CylinderGeometry(.055*scale,.14*scale,.95*scale,7),i%2?barkDark:bark);
    rt.position.set(Math.cos(a)*.38*scale,.08*scale,Math.sin(a)*.38*scale);rt.rotation.set(0,-a,Math.PI/2.12);root.add(rt);
  }

  const branchData=[],fanData=[[],[],[],[]];
  const levels=14;
  for(let lv=0;lv<levels;lv++){
    const n=lv/(levels-1),y=(.62+h*(.058*lv))*scale;
    const tierRadius=(2.2*(1-Math.pow(n,.78))+.28)*scale;
    const branches=10+(lv%3);
    for(let i=0;i<branches;i++){
      const a=i/branches*Math.PI*2+(lv%2)*.19+(r()-.5)*.12;
      const len=tierRadius*(.82+r()*.22);
      branchData.push({a,len,y});
      const pads=5;
      for(let p=0;p<pads;p++){
        const d=len*(.24+p*.145),side=(p%2?1:-1),mat=(lv+i+p)%4;
        fanData[mat].push({
          x:Math.cos(a)*d+Math.cos(a+Math.PI/2)*side*.08*scale,
          y:y-(.03+p*.018)*scale,
          z:Math.sin(a)*d+Math.sin(a+Math.PI/2)*side*.08*scale,
          rx:-.32-(1-n)*.08-r()*.08,
          ry:-a+Math.PI/2+(r()-.5)*.11,
          rz:(r()-.5)*.08,
          sx:(.48+r()*.10)*scale,
          sz:(.55+r()*.13)*scale
        });
      }
    }
  }

  const bgeo=new THREE.CylinderGeometry(.025*scale,.064*scale,1,6);
  const branches=new THREE.InstancedMesh(bgeo,barkDark,branchData.length);
  branchData.forEach((v,i)=>{dummy.position.set(Math.cos(v.a)*v.len*.46,v.y,Math.sin(v.a)*v.len*.46);dummy.rotation.set(.10,-v.a,Math.PI/2.03);dummy.scale.set(1,v.len,1);dummy.updateMatrix();branches.setMatrixAt(i,dummy.matrix)});
  branches.instanceMatrix.needsUpdate=true;root.add(branches);

  foliage.forEach((mat,mi)=>{
    const arr=fanData[mi],mesh=new THREE.InstancedMesh(FAN,mat,arr.length);
    arr.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.rotation.set(v.rx,v.ry,v.rz);dummy.scale.set(v.sx,1,v.sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;root.add(mesh);
  });

  const crownGeo=new THREE.ConeGeometry(1,1,10),crown=new THREE.InstancedMesh(crownGeo,foliage[1],8);
  for(let i=0;i<8;i++){
    const rad=(.66-i*.058)*scale;
    dummy.position.set((r()-.5)*.055*scale,h-.82*scale+i*.15*scale,(r()-.5)*.055*scale);
    dummy.rotation.set(0,r()*Math.PI,0);dummy.scale.set(rad,.82*scale,rad);dummy.updateMatrix();crown.setMatrixAt(i,dummy.matrix);
  }
  crown.instanceMatrix.needsUpdate=true;root.add(crown);

  const skirt=new THREE.InstancedMesh(FAN,foliage[0],18);
  for(let i=0;i<18;i++){
    const a=i/18*Math.PI*2+(r()-.5)*.09,rad=(.48+r()*.40)*scale;
    dummy.position.set(Math.cos(a)*rad,.30*scale,Math.sin(a)*rad);dummy.rotation.set(-.44,-a+Math.PI/2,(r()-.5)*.08);dummy.scale.set(.62*scale,1,.75*scale);dummy.updateMatrix();skirt.setMatrixAt(i,dummy.matrix);
  }
  skirt.instanceMatrix.needsUpdate=true;root.add(skirt);

  root.rotation.y=r()*Math.PI*2;
  root.userData={assetId:'conifer_target_v31',version:'3.1.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',rendering:'instanced-overlapping-fans',intent:'fuller soft layered conifer silhouette with shorter overlapping fan fronds, reduced radial spike appearance and target-facing color variation'};
  return shadow(root);
}
