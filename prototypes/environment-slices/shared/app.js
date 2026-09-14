import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const sceneType = document.body.dataset.scene || 'castle';
const scene = new THREE.Scene();
scene.background = new THREE.Color(sceneType === 'dungeon' ? 0x0e1117 : sceneType === 'town' ? 0xc9dded : 0xb8cddd);
scene.fog = new THREE.Fog(scene.background, sceneType === 'dungeon' ? 24 : 42, sceneType === 'dungeon' ? 74 : 105);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = sceneType === 'dungeon' ? 1.35 : 1.1;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 180);
const target = new THREE.Vector3(0, 4, -4);
if (sceneType === 'castle') camera.position.set(24, 20, 31);
if (sceneType === 'town') camera.position.set(24, 17, 29);
if (sceneType === 'dungeon') camera.position.set(19, 12, 27);
camera.lookAt(target);

const hemi = new THREE.HemisphereLight(sceneType === 'dungeon' ? 0x50637d : 0xe5f3ff, sceneType === 'dungeon' ? 0x160e0a : 0x6c654f, sceneType === 'dungeon' ? 0.45 : 1.75);
scene.add(hemi);
if (sceneType !== 'dungeon') {
  const sun = new THREE.DirectionalLight(0xffedcf, 3.1);
  sun.position.set(-24, 35, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -50; sun.shadow.camera.right = 50; sun.shadow.camera.top = 45; sun.shadow.camera.bottom = -45;
  scene.add(sun);
}

function mat(color, rough=0.85, metal=0) { return new THREE.MeshStandardMaterial({color, roughness:rough, metalness:metal}); }
const M = {
  stone: mat(0x858b89), stoneDark: mat(0x525a5a), stoneLight: mat(0xa9aaa0),
  roof: mat(0x6f3f35), roofBlue: mat(0x465a64), wood: mat(0x755039), woodDark: mat(0x3f2d24),
  plaster: mat(0xc9b998), grass: mat(0x617b4c), dirt: mat(0x8e7656), cobble: mat(0x73736c),
  gold: mat(0xc69d48,0.4,0.25), black: mat(0x23272b), blue: mat(0x315b82), skin: mat(0xc88f6d),
  moss: mat(0x415a38), cave: mat(0x414445), cave2: mat(0x2d3133), ember: new THREE.MeshStandardMaterial({color:0xff8d3a,emissive:0xff5a16,emissiveIntensity:4})
};

function box(name, x,y,z, sx,sy,sz, material, cast=true) {
  const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), material); o.name=name; o.position.set(x,y,z); o.castShadow=cast; o.receiveShadow=true; scene.add(o); return o;
}
function cyl(name,x,y,z,r,h,material,segments=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),material);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
function cone(name,x,y,z,r,h,material,segments=10){const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,segments),material);o.name=name;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
function label(text, subtitle){document.querySelector('#title').textContent=text;document.querySelector('#subtitle').textContent=subtitle;}
function addPlayer(x=0,z=9){
  const g=new THREE.Group();g.name='shared-player';g.position.set(x,0,z);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.48,.6,1.55,8),M.blue);body.position.y=1.15;body.castShadow=true;g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.47,12,8),M.skin);head.position.y=2.28;head.castShadow=true;g.add(head);
  const hair=new THREE.Mesh(new THREE.ConeGeometry(.58,.72,9),mat(0x234b70));hair.position.y=2.72;hair.rotation.y=.35;hair.castShadow=true;g.add(hair);
  const sword=new THREE.Mesh(new THREE.BoxGeometry(.12,1.6,.12),M.stoneLight);sword.position.set(.62,1.05,.05);sword.rotation.z=-.25;sword.castShadow=true;g.add(sword);
  scene.add(g);return g;
}
function tree(x,z,s=1){cyl('tree-trunk',x,1.2*s,z,.25*s,2.4*s,M.wood,8);cone('tree-crown',x,3.1*s,z,1.6*s,3.8*s,mat(0x3e6843),9);}
function banner(x,y,z,rot=0){const pole=box('banner-pole',x,y,z,.12,4.4,.12,M.woodDark);pole.rotation.y=rot;const flag=box('banner',x,y+.8,z+.03,1.25,1.65,.08,mat(0x7c2637));flag.rotation.y=rot;}

function castle(){
  label('CASTLE SLICE / BASELINE v1','城郭・門・塔・中庭。Outdoor Coreから分離した最初の実動ベースライン');
  box('ground',0,-.55,0,74,1,70,M.grass,false);
  box('road',0,.02,14,11,.18,43,M.dirt,false);
  box('courtyard',0,.05,-8,30,.22,24,M.cobble,false);
  // curtain walls
  box('wall-left',-14,4,-10,3,9,35,M.stone);box('wall-right',14,4,-10,3,9,35,M.stone);box('wall-back',0,4,-27,31,9,3,M.stoneDark);
  // gatehouse framing a deep passage
  box('gate-left',-5,5,4,7,11,6,M.stone);box('gate-right',5,5,4,7,11,6,M.stone);
  box('gate-top',0,9,4,4,3,6,M.stoneDark);
  box('gate-floor',0,.22,4,4,.3,9,M.cobble,false);
  // towers and roofs
  [-14,14].forEach(x=>{cyl('tower',x,5,-1,5.1,11,M.stone,12);cone('tower-roof',x,12,-1,6.1,5,M.roofBlue,12);});
  cyl('keep',0,8,-22,8,16,M.stoneLight,12);cone('keep-roof',0,18,-22,9.2,6,M.roofBlue,12);
  box('keep-door',0,2.2,-14.1,2.5,4.4,.35,M.woodDark);
  for(let x=-10;x<=10;x+=5){box('crenel',x,9,-27,2,2,2,M.stoneLight);}
  banner(-4,8.4,6.7);banner(4,8.4,6.7);
  // foreground depth
  tree(-23,7,1.25);tree(23,10,1.2);tree(-26,-15,1.0);tree(25,-18,1.0);
  addPlayer(0,15);
  document.body.dataset.ready='castle-baseline-v1';
}

function house(x,z,w=6,d=6,h=4,roofColor=M.roof){
  box('house',x,h/2,z,w,h,d,M.plaster);box('beam',x,h*.55,z+d/2+.05,w,.26,.18,M.woodDark);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.72,3.1,4),roofColor);roof.name='roof';roof.position.set(x,h+1.5,z);roof.rotation.y=Math.PI/4;roof.castShadow=true;roof.receiveShadow=true;scene.add(roof);
  box('door',x-.9,1,z+d/2+.08,1.2,2.1,.16,M.woodDark);box('window',x+1.25,2,z+d/2+.1,1.1,1.05,.12,mat(0x7db0c7,.25));
}
function town(){
  label('TOWN SLICE / BASELINE v1','街路・広場・家並み・商店。Castleと建築資産は共有しつつ別レーンで検証');
  box('ground',0,-.55,0,78,1,72,M.grass,false);
  box('main-street',0,.02,5,12,.18,58,M.cobble,false);box('plaza',0,.04,-11,28,.2,22,M.cobble,false);
  house(-10,8,7,7,4.8);house(10,7,7,7,5.2,M.roofBlue);house(-12,-15,8,6,5.7,M.roofBlue);house(12,-16,7,7,4.6);house(-18,-1,6,6,4.2);house(18,-2,6,6,4.4);
  // fountain
  cyl('fountain-basin',0,.55,-10,3.2,1,M.stone,16);cyl('fountain-core',0,1.6,-10,.65,2.6,M.stoneLight,12);cyl('water',0,1.05,-10,2.55,.1,mat(0x3b91ad,.18),20);
  // market
  for(const x of [-7,7]){box('stall',x,1.1,-3,4,2.2,2.4,M.wood);box('awning',x,2.8,-3,4.6,.18,3,mat(x<0?0xa34c45:0x466b86));}
  // lamps and barrels
  for(const x of [-5,5]){cyl('lamp-post',x,2.1,4,.12,4.2,M.black,8);const glow=new THREE.PointLight(0xffc872,.8,8);glow.position.set(x,4.1,4);scene.add(glow);}
  for(const p of [[-16,6],[15,5],[-9,-7],[10,-8]]) cyl('barrel',p[0],.65,p[1],.55,1.3,M.wood,10);
  tree(-25,14,1.05);tree(25,15,1.05);tree(-26,-22,1.0);tree(25,-23,1.0);
  addPlayer(0,17);
  document.body.dataset.ready='town-baseline-v1';
}

function dungeon(){
  label('DUNGEON SLICE / BASELINE v1','地下通路・部屋・松明・狭所照明。共通Coreを屋内環境へ持ち込む検証線');
  box('floor',0,-.45,0,34,.8,66,M.cave2,false);
  // corridor walls then chamber
  box('left-wall',-9,4,9,3,9,39,M.cave);box('right-wall',9,4,9,3,9,39,M.cave);
  box('rear-left',-12,4,-19,9,9,18,M.cave);box('rear-right',12,4,-19,9,9,18,M.cave);box('rear-wall',0,4,-28,18,9,3,M.cave2);
  // ceiling ribs / arch rhythm
  for(let z=20;z>=-18;z-=8){box('rib-left',-7.6,6,z,1.1,4,1.1,M.stoneDark);box('rib-right',7.6,6,z,1.1,4,1.1,M.stoneDark);box('rib-top',0,7.6,z,16,1.1,1.1,M.stoneDark);}
  // altar and stairs
  for(let i=0;i<4;i++) box('altar-step',0,.25+i*.35,-23+i*1.15,7-i*.7,.45,2.1,M.stone);
  box('altar',0,2.1,-25,4,3,2.5,M.stoneLight);box('rune',0,2.4,-23.72,1.7,1.7,.08,mat(0x4ba6bc,.3));
  // rocks / pillars
  for(const p of [[-5,-8],[5,-8],[-5,-20],[5,-20]]) cyl('pillar',p[0],2.6,p[1],1.25,5.2,M.stoneDark,8);
  // torches with coherent warm pools
  for(const p of [[-6,14],[6,6],[-6,-4],[6,-14]]){
    box('torch',p[0],3,p[1],.18,1.7,.18,M.woodDark);
    const flame=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),M.ember);flame.position.set(p[0],3.9,p[1]);scene.add(flame);
    const light=new THREE.PointLight(0xff7a32,7.5,17,2);light.position.set(p[0],4,p[1]);light.castShadow=true;scene.add(light);
  }
  // stalagmites
  for(const p of [[-6,21],[6,18],[-6,0],[6,-2],[-7,-26],[7,-25]]) cone('stalagmite',p[0],1,p[1],1.1,2.2,M.cave,7);
  addPlayer(0,20);
  document.body.dataset.ready='dungeon-baseline-v1';
}

if(sceneType==='castle') castle();
if(sceneType==='town') town();
if(sceneType==='dungeon') dungeon();

const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();if(sceneType==='dungeon'){scene.traverse(o=>{if(o.isPointLight)o.intensity*=0.997+Math.sin(t*7+o.position.z)*0.003;});}renderer.render(scene,camera);}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
