import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shoreRibbon(width,z,seed=1,opacity=.28){const r=rng(seed),segments=76,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.43+seed)*.08+Math.sin(i*.17)*.04+(r()-.5)*.03;const w=.055+r()*.07;v.push(x,.022,z+wave-w,x,.022,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xe7fff9,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}
function sparkleField(width,depth,seed=1,count=220){const r=rng(seed),g=new THREE.BufferGeometry(),positions=[],colors=[];const cs=[new THREE.Color(0xc8fff5),new THREE.Color(0x68ddd2),new THREE.Color(0xffffff),new THREE.Color(0x31abc2)];for(let i=0;i<count;i++){positions.push((r()-.5)*width,.035,(r()-.5)*depth);const c=cs[i%cs.length];colors.push(c.r,c.g,c.b)}g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return new THREE.Points(g,new THREE.PointsMaterial({size:.052,vertexColors:true,transparent:true,opacity:.68,depthWrite:false,sizeAttenuation:true}))}
function foamRing(radius=.45){const geo=new THREE.RingGeometry(radius*.98,radius*1.18,18,1);const mat=new THREE.MeshBasicMaterial({color:0xe4fff8,transparent:true,opacity:.24,depthWrite:false,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;return m}

export function createTargetWaterV3({width=28,depth=6.2,seed=11}={}){
  const g=new THREE.Group();
  const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(0x05435d)},uMid:{value:new THREE.Color(0x087b92)},uShallow:{value:new THREE.Color(0x48bdb7)},uLight:{value:new THREE.Color(0x8be9df)}};
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying float vWave;uniform float uTime;void main(){vUv=uv;vec3 p=position;float w=sin((p.x+uTime*.58)*1.20)*.042+cos((p.y-uTime*.30)*2.05)*.030+sin((p.x*.41+p.y*.77+uTime*.37)*3.2)*.012;p.z+=w;vWave=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader:`varying vec2 vUv;varying float vWave;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uLight;uniform float uTime;void main(){float edge=min(vUv.y,1.-vUv.y);float shore=1.-smoothstep(.02,.18,edge);float a=.5+.5*sin(vUv.x*15.7+sin(vUv.y*9.2+uTime*.24)*1.2-uTime*.53);float b=.5+.5*cos(vUv.y*18.4+sin(vUv.x*7.6-uTime*.19)*1.1+uTime*.34);float patches=a*b;float ripples=.5+.5*sin(vUv.x*27.0+vUv.y*4.5+sin(vUv.y*15.0)*.45-uTime*.72);vec3 c=mix(uDeep,uMid,.38+patches*.12);c=mix(c,uShallow,shore*.44+abs(vWave)*1.35+patches*.08);c=mix(c,uLight,pow(ripples,14.)*.16);gl_FragColor=vec4(c,.91+shore*.045);}`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,80,30),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(shoreRibbon(width,depth*.47,seed+1,.38),shoreRibbon(width,-depth*.47,seed+2,.38));
  g.add(sparkleField(width*.94,depth*.86,seed+40,Math.max(150,Math.floor(width*depth*1.05))));
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x586461,roughness:.94});
  for(let i=0;i<7;i++){const rad=.18+rr()*.33,x=(rr()-.5)*width*.75,z=(rr()-.5)*depth*.66;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set(x,.03,z);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=true;rock.receiveShadow=true;g.add(rock);if(i<5){const ring=foamRing(rad*1.25);ring.position.set(x,.045,z);ring.scale.set(1.2,.86,1);g.add(ring)}}
  g.userData={assetId:'water_target_v3',version:'3.2.0',stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'layered teal river with soft non-linear surface variation, shoreline foam, rock foam rings and high-frequency sparkles; no grid streaks',update:t=>uniforms.uTime.value=t};
  return g;
}
