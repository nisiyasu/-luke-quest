import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shoreRibbon(width,z,seed=1,opacity=.28){const r=rng(seed),segments=76,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.43+seed)*.08+Math.sin(i*.17)*.04+(r()-.5)*.03;const w=.055+r()*.07;v.push(x,.022,z+wave-w,x,.022,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xe2fff8,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}

function sparkleField(width,depth,seed=1,count=170){
  const r=rng(seed),g=new THREE.BufferGeometry(),positions=[],sizes=[],colors=[];
  const cA=new THREE.Color(0xc8fff5),cB=new THREE.Color(0x64d7d0),cC=new THREE.Color(0xffffff);
  for(let i=0;i<count;i++){
    positions.push((r()-.5)*width,.035,(r()-.5)*depth);
    sizes.push(.5+r()*1.35);
    const c=i%7===0?cC:i%3===0?cA:cB;colors.push(c.r,c.g,c.b);
  }
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const mat=new THREE.PointsMaterial({size:.055,vertexColors:true,transparent:true,opacity:.62,depthWrite:false,sizeAttenuation:true});
  return new THREE.Points(g,mat);
}

export function createTargetWaterV3({width=28,depth=6.2,seed=11}={}){
  const g=new THREE.Group();
  const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(0x05435d)},uMid:{value:new THREE.Color(0x087b92)},uShallow:{value:new THREE.Color(0x4fc6be)},uSky:{value:new THREE.Color(0xb7efe6)}};
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying float vWave;uniform float uTime;void main(){vUv=uv;vec3 p=position;float w=sin((p.x+uTime*.62)*1.18)*.043+cos((p.y-uTime*.31)*2.03)*.030+sin((p.x*.53+p.y*.71+uTime*.44)*3.4)*.014;p.z+=w;vWave=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader:`varying vec2 vUv;varying float vWave;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uSky;uniform float uTime;float sat(float x){return clamp(x,0.,1.);}void main(){float edge=min(vUv.y,1.-vUv.y);float shore=1.-smoothstep(.015,.20,edge);float n1=sin(vUv.x*31.+sin(vUv.y*10.+uTime*.42)*2.1-uTime*1.15);float n2=sin(vUv.x*17.-vUv.y*24.+sin(vUv.x*8.-uTime*.35)*1.7+uTime*.72);float cells=pow(sat(.58+.24*n1+.18*n2),5.0);float soft=.5+.5*sin(vUv.x*11.3+vUv.y*7.7-uTime*.45);float glint=pow(sat(sin(vUv.x*83.+vUv.y*19.-uTime*2.9)*.5+.5),22.0);vec3 c=mix(uDeep,uMid,.43+soft*.10);c=mix(c,uShallow,shore*.42+cells*.30+abs(vWave)*1.45);c=mix(c,uSky,cells*.20+glint*.38);gl_FragColor=vec4(c,.91+shore*.045);}`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,80,30),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(shoreRibbon(width,depth*.47,seed+1,.36),shoreRibbon(width,-depth*.47,seed+2,.36));
  g.add(sparkleField(width*.94,depth*.86,seed+40,Math.max(110,Math.floor(width*depth*.8))));
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x586461,roughness:.94});
  for(let i=0;i<7;i++){const rad=.18+rr()*.33;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set((rr()-.5)*width*.75,.03,(rr()-.5)*depth*.66);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=true;rock.receiveShadow=true;g.add(rock)}
  g.userData={assetId:'water_target_v3',version:'3.1.0',stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'layered teal river with organic caustic clusters, shore foam, sparkles and embedded stones without grid-like streak artifacts',update:t=>uniforms.uTime.value=t};
  return g;
}
