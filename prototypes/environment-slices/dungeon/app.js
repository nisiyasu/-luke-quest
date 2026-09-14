import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x10151b);scene.fog=new THREE.Fog(0x10151b,28,72);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.65;document.body.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,130);camera.position.set(0,7.2,28);camera.lookAt(0,2.7,-12);
scene.add(new THREE.HemisphereLight(0x607994,0x1b1210,1.25));const fill=new THREE.DirectionalLight(0x8296a8,.85);fill.position.set(-8,14,18);scene.add(fill);
const mat=(c,r=.88,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const M={floor:mat(0x34383a),wall:mat(0x464b4d),dark:mat(0x292d30),stone:mat(0x666963),stone2:mat(0x85847a),wood:mat(0x513225),blue:mat(0x315b82),skin:mat(0xc88f6d),rune:new THREE.MeshStandardMaterial({color:0x62bfd3,emissive:0x287f9a,emissiveIntensity:2.2}),flame:new THREE.MeshStandardMaterial({color:0xffb15a,emissive:0xff651c,emissiveIntensity:4.5})};
function box(n,x,y,z,sx,sy,sz,m){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m);o.name=n;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function cyl(n,x,y,z,r,h,m,s=10){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.name=n;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
function cone(n,x,y,z,r,h,m,s=8){const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,s),m);o.name=n;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o}
box('floor',0,-.35,-4,18,.7,70,M.floor);box('left-wall',-9,4,-4,2,9,70,M.wall);box('right-wall',9,4,-4,2,9,70,M.wall);box('back-wall',0,4,-36,18,9,2,M.dark);
for(let z=20;z>=-28;z-=8){box('rib-left',-7.6,5.4,z,1.15,5,1.2,M.stone);box('rib-right',7.6,5.4,z,1.15,5,1.2,M.stone);box('rib-top',0,7.65,z,16.2,1,1.2,M.stone)}
// Chamber end: dais + rune altar
for(let i=0;i<4;i++)box('step',0,.05+i*.32,-29+i*1.25,8-i*.75,.5,2.3,M.stone);
box('altar',0,2.25,-32,4.2,3.6,2.6,M.stone2);box('rune',0,2.45,-30.66,1.8,1.8,.12,M.rune);
for(const p of [[-5,-15],[5,-15],[-5,-27],[5,-27]])cyl('pillar',p[0],2.8,p[1],1.2,5.6,M.stone,9);
for(const p of [[-6,16],[6,8],[-6,0],[6,-8],[-6,-18],[6,-26]]){box('torch',p[0],3.0,p[1],.18,1.7,.18,M.wood);const f=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),M.flame);f.position.set(p[0],3.95,p[1]);scene.add(f);const l=new THREE.PointLight(0xff7b32,10,19,1.8);l.position.set(p[0],4,p[1]);l.castShadow=true;l.shadow.mapSize.set(512,512);scene.add(l)}
for(const p of [[-6.5,21],[6.5,19],[-6.3,7],[6.4,-2],[-6,-12],[6,-20]])cone('stalagmite',p[0],1.15,p[1],1.15,2.3,M.dark,7);
const player=new THREE.Group();player.position.set(0,0,19);const body=new THREE.Mesh(new THREE.CylinderGeometry(.48,.6,1.55,8),M.blue);body.position.y=1.15;body.castShadow=true;player.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.47,12,8),M.skin);head.position.y=2.28;head.castShadow=true;player.add(head);const hair=new THREE.Mesh(new THREE.ConeGeometry(.58,.72,9),mat(0x234b70));hair.position.y=2.72;hair.castShadow=true;player.add(hair);scene.add(player);
document.querySelector('#title').textContent='DUNGEON SLICE / BASELINE v1.1';document.querySelector('#subtitle').textContent='地下通路・石造リブ・祭壇・松明。共通Coreを屋内へ展開する現在地';document.body.dataset.ready='dungeon-baseline-v1';
function animate(){requestAnimationFrame(animate);renderer.render(scene,camera)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
