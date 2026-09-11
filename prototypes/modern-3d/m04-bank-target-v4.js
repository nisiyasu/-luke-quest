import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function deform(g,r,a=.22){const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*(1+(r()-.5)*a),y*(1+(r()-.5)*a*.72),z*(1+(r()-.5)*a))}p.needsUpdate=true;g.computeVertexNormals();return g}
function shadows(root){root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});return root}

const grass=new THREE.MeshStandardMaterial({color:0x668947,roughness:.99,side:THREE.DoubleSide});
const soil=new THREE.MeshStandardMaterial({color:0x514332,roughness:1});
const moss=new THREE.MeshStandardMaterial({color:0x587941,roughness:1});
const rockMats=[0x515b59,0x67706a,0x77776b,0x5e665f,0x6c7065].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.95}));
const fernMats=[0x315d2e,0x6f984b].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.98,side:THREE.DoubleSide}));

function makeFernPatch(r,scale=.7,count=14){
  const g=new THREE.Group();
  const blade=new THREE.PlaneGeometry(.17,1,1,3);
  for(let i=0;i<count;i++){
    const a=r()*Math.PI*2,rad=Math.sqrt(r())*.76*scale,h=(.55+r()*.65)*scale;
    const m=new THREE.Mesh(blade,fernMats[i%2]);
    m.position.set(Math.cos(a)*rad,h*.43,Math.sin(a)*rad);
    m.rotation.set(-(.22+r()*.42),-a,0);
    m.scale.set(.72+r()*.42,h,1);
    m.castShadow=false;m.receiveShadow=true;g.add(m);
  }
  return g;
}

function makeOrganicTop(r,seed,width,depth,facing){
  const cols=18;
  const vertices=[];
  const indices=[];
  for(let i=0;i<=cols;i++){
    const t=i/cols;
    const x=-width*.5+t*width;
    const wave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14+(r()-.5)*.12;
    const front=facing*(depth*.5-.42+wave);
    const back=-facing*(depth*.5-(r()-.5)*.25);
    const yFront=.08+Math.sin(t*Math.PI*2.2)*.06+(r()-.5)*.05;
    const yBack=.02+(r()-.5)*.05;
    vertices.push(x,yBack,back,x,yFront,front);
    if(i<cols){const a=i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,c,d,b)}
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geo.setIndex(indices);geo.computeVertexNormals();
  const top=new THREE.Mesh(geo,grass);top.receiveShadow=true;
  return top;
}

export function createTargetBankV4({seed=1,width=12,depth=8,facing=1}={}){
  const r=rng(seed),g=new THREE.Group();
  g.name=`bank_target_v4_${seed}`;

  // Continuous irregular top surface. The front edge itself meanders, eliminating the prior block/slab silhouette.
  g.add(makeOrganicTop(r,seed,width,depth,facing));

  // Broken cliff face: three staggered depth bands make an uneven natural terrace, not a straight retaining wall.
  const bands=[
    {z:depth*.5-.28,y:-.40,scale:.98},
    {z:depth*.5-.55,y:-.90,scale:.78},
    {z:depth*.5-.82,y:-1.30,scale:.58}
  ];
  bands.forEach((band,bi)=>{
    const count=Math.max(8,Math.ceil(width/(bi===0?.78:1.02)));
    for(let i=0;i<count;i++){
      if(bi>0 && (i+bi)%4===1) continue;
      const t=(i+.5)/count;
      const x=-width*.5+t*width+(r()-.5)*.34;
      const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14;
      const radius=(.46+r()*.34)*band.scale;
      const geo=deform(new THREE.IcosahedronGeometry(radius,1),r,.30);
      const rock=new THREE.Mesh(geo,rockMats[(i+bi+seed)%rockMats.length]);
      rock.scale.set(1.08+r()*.46,.74+r()*.40,.84+r()*.42);
      rock.position.set(x,band.y+(r()-.5)*.18,facing*(band.z+edgeWave)+(r()-.5)*.14);
      rock.rotation.set((r()-.5)*.28,r()*Math.PI,(r()-.5)*.22);
      g.add(rock);
      if(bi===0 && i%2===0){
        const cap=new THREE.Mesh(new THREE.SphereGeometry(radius*.66,8,5,0,Math.PI*2,0,Math.PI*.48),moss);
        cap.scale.set(1.18,.24,.92);
        cap.position.set(rock.position.x,rock.position.y+radius*.44,rock.position.z-facing*.06);
        g.add(cap);
      }
    }
  });

  // Soil pockets interrupt the rock rhythm and provide attachment zones for vegetation.
  for(let i=0;i<6;i++){
    const patch=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(.58+r()*.30,1),r,.26),soil);
    patch.scale.set(1.35,.38,.70);
    const t=(i+.5)/6;
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42;
    patch.position.set(-width*.43+i*width*.172+(r()-.5)*.28,-.24-r()*.25,facing*(depth*.5-.32+edgeWave)+(r()-.5)*.26);
    patch.rotation.y=r()*Math.PI;g.add(patch);
  }

  // Clustered lip plants follow the same irregular edge, leaving deliberate breathing gaps.
  const clusters=Math.max(8,Math.ceil(width/1.18));
  for(let i=0;i<clusters;i++){
    if(i%5===3) continue;
    const t=i/Math.max(1,clusters-1);
    const edgeWave=Math.sin(t*Math.PI*3+seed*.19)*.42+Math.sin(t*Math.PI*7+seed*.07)*.14;
    const fern=makeFernPatch(r,.50+r()*.30,12+(i%3)*3);
    fern.position.set(-width*.45+t*width*.90+(r()-.5)*.28,.10+(r()-.5)*.07,facing*(depth*.5-.58+edgeWave));
    fern.rotation.y=r()*Math.PI*2;g.add(fern);
  }

  // Embedded top stones visually connect cliff face and playable ground.
  for(let i=0;i<9;i++){
    const rad=.20+r()*.28;
    const stone=new THREE.Mesh(deform(new THREE.IcosahedronGeometry(rad,1),r,.27),rockMats[(i+seed)%rockMats.length]);
    stone.scale.set(1.22,.58,1.02);
    stone.position.set((r()-.5)*width*.82,.18+(r()-.5)*.04,(r()-.5)*depth*.52-facing*.70);
    stone.rotation.y=r()*Math.PI;g.add(stone);
  }

  g.userData={assetId:'bank_target_v4',version:'4.1.0',seed,stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'continuous irregular forest-bank silhouette with staggered boulder terraces, soil pockets, moss and clustered fern lip'};
  return shadows(g);
}
