import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function markShadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}
function deform(g,r,a=.18){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(r()-.5)*a),y*(1+(r()-.5)*a*.65),z*(1+(r()-.5)*a))}p.needsUpdate=true;g.computeVertexNormals();return g}

const barkDark=new THREE.MeshStandardMaterial({color:0x3e2c20,roughness:.99});
const barkWarm=new THREE.MeshStandardMaterial({color:0x60402a,roughness:.98});
const needleDeep=new THREE.MeshStandardMaterial({color:0x123c29,roughness:.96,side:THREE.DoubleSide});
const needleMid=new THREE.MeshStandardMaterial({color:0x286b3c,roughness:.94,side:THREE.DoubleSide});
const needleSun=new THREE.MeshStandardMaterial({color:0x60964f,roughness:.91,side:THREE.DoubleSide});
const fernDark=new THREE.MeshStandardMaterial({color:0x315d2e,roughness:.98,side:THREE.DoubleSide});
const fernLight=new THREE.MeshStandardMaterial({color:0x739b4b,roughness:.98,side:THREE.DoubleSide});
const targetGrass=new THREE.MeshStandardMaterial({color:0x678d45,roughness:.99});
const targetSoil=new THREE.MeshStandardMaterial({color:0x55442f,roughness:1});
const targetMoss=new THREE.MeshStandardMaterial({color:0x56733e,roughness:1});
const targetRock=[0x626968,0x74786f,0x4f5b59,0x777366,0x59615d].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.94}));

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

export function createTargetFernPatch({seed=1,scale=1,count=18,radius=.72}={}){
  const r=rng(seed),g=new THREE.Group(),dummy=new THREE.Object3D();
  const verts=[],idx=[];
  const addTri=(a,b,c)=>{const n=verts.length/3;verts.push(...a,...b,...c);idx.push(n,n+1,n+2)};
  const stemW=.028;
  verts.push(-stemW,0,0, stemW,0,0, stemW,0,1.05, -stemW,0,1.05);idx.push(0,1,2,0,2,3);
  for(let j=0;j<6;j++){
    const z=.16+j*.14,span=.22*(1-j*.07),tip=z+.17;
    addTri([-stemW,0,z],[-span,0,z+.055],[0,0,tip]);
    addTri([stemW,0,z],[span,0,z+.055],[0,0,tip]);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();
  const groups=[[],[]];
  for(let i=0;i<count;i++){
    const a=r()*Math.PI*2,rad=Math.sqrt(r())*radius*scale;
    const len=(.38+r()*.30)*scale,w=(.72+r()*.28)*scale;
    groups[i%2].push({x:Math.cos(a)*rad,z:Math.sin(a)*rad,a,len,w,lean:.42+r()*.30,twist:(r()-.5)*.42});
  }
  [fernDark,fernLight].forEach((mat,mi)=>{
    const list=groups[mi],mesh=new THREE.InstancedMesh(geo,mat,list.length);
    list.forEach((v,i)=>{dummy.position.set(v.x,.025*scale,v.z);dummy.rotation.set(-v.lean,-v.a+Math.PI/2,v.twist);dummy.scale.set(v.w,1,v.len);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});
    mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;g.add(mesh);
  });
  g.userData={assetId:'fern_patch_target_v3',version:'3.0.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'compound fern leaflets with configurable organic ground spread'};
  return g;
}
export function createTargetBank({seed=1,width=12,depth=8,facing=1}={}){
  const r=rng(seed),g=new THREE.Group();
  g.name=`bank_target_v3_${seed}`;

  const topGeo=new THREE.PlaneGeometry(width,depth,24,18),p=topGeo.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),y=p.getY(i);
    const z=Math.sin(x*.46+seed*.07)*.12+Math.cos(y*.62-seed*.03)*.09+Math.sin((x+y)*.31)*.055+(r()-.5)*.045;
    p.setZ(i,z);
  }
  p.needsUpdate=true;topGeo.computeVertexNormals();
  const top=new THREE.Mesh(topGeo,targetGrass);top.rotation.x=-Math.PI/2;top.receiveShadow=true;g.add(top);

  const edgeZ=facing*(depth*.5-.18);
  const back=new THREE.Mesh(new THREE.BoxGeometry(width*.98,1.7,.55),targetSoil);
  back.position.set(0,-.72,edgeZ-facing*.12);g.add(back);

  const columns=Math.max(8,Math.ceil(width/.82));
  for(let i=0;i<columns;i++){
    const x=-width*.5+(i+.5)*width/columns+(r()-.5)*.18;
    const layers=2+(i%4===0?1:0);
    for(let layer=0;layer<layers;layer++){
      const rad=.47+r()*.32;
      const geo=deform(new THREE.IcosahedronGeometry(rad,2),r,.20);
      const rock=new THREE.Mesh(geo,targetRock[(i+layer+seed)%targetRock.length]);
      rock.scale.set(1.05+r()*.32,.72+r()*.34,.78+r()*.38);
      rock.position.set(x+(r()-.5)*.16,-.44-layer*.56,edgeZ+(r()-.5)*.20);
      rock.rotation.set((r()-.5)*.24,r()*Math.PI,(r()-.5)*.18);g.add(rock);
      if(layer===0&&i%2===0){
        const mossCap=new THREE.Mesh(new THREE.SphereGeometry(rad*.62,9,6,0,Math.PI*2,0,Math.PI*.5),targetMoss);
        mossCap.scale.set(1.15,.26,.85);mossCap.position.set(rock.position.x,rock.position.y+rad*.42,rock.position.z-facing*.08);g.add(mossCap);
      }
    }
  }

  const lipCount=Math.max(7,Math.ceil(width/1.15));
  for(let i=0;i<lipCount;i++){
    const fern=createTargetFernPatch({seed:seed*31+i*17,scale:.46+r()*.28,count:12});
    fern.position.set(-width*.46+i*(width*.92/Math.max(1,lipCount-1))+(r()-.5)*.24,.03,edgeZ-facing*(.30+r()*.38));
    fern.rotation.y=r()*Math.PI*2;g.add(fern);
  }

  g.userData={assetId:'bank_target_v3',version:'3.0.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'organic smooth cliff bank with moss and fern lip'};
  return markShadows(g);
}

export function targetAssetMetadata(){
  return {
    conifer_target_v3:{version:'3.0.0',provenance:'repo-procedural',intent:'lush layered target-facing conifer silhouette'},
    fern_patch_target_v1:{version:'1.0.0',provenance:'repo-procedural',intent:'dense near-ground vegetation micro-layer'},
    bank_target_v3:{version:'3.0.0',provenance:'repo-procedural',intent:'organic smooth cliff bank with moss and fern lip'}
  };
}
