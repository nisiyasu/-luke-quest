import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function ribbon(width,z,seed=1,opacity=.28){const r=rng(seed),segments=70,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.43+seed)*.08+Math.sin(i*.17)*.04+(r()-.5)*.03;const w=.07+r()*.08;v.push(x,.022,z+wave-w,x,.022,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xd7fff5,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}

export function createTargetWaterV3({width=28,depth=6.2,seed=11}={}){
  const g=new THREE.Group();
  const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(0x063f57)},uMid:{value:new THREE.Color(0x087c8d)},uShallow:{value:new THREE.Color(0x5bc5b8)},uSky:{value:new THREE.Color(0xb8d9cf)}};
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying vec3 vWorld;varying float vWave;uniform float uTime;void main(){vUv=uv;vec3 p=position;float w=sin((p.x+uTime*.70)*1.30)*.045+cos((p.y-uTime*.38)*2.15)*.032+sin((p.x*.62+p.y+uTime*.48)*4.0)*.015;p.z+=w;vWave=w;vec4 wp=modelMatrix*vec4(p,1.);vWorld=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader:`varying vec2 vUv;varying vec3 vWorld;varying float vWave;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uSky;uniform float uTime;float line(float x,float w){return 1.-smoothstep(w,w+.035,abs(x));}void main(){float edge=min(vUv.y,1.-vUv.y);float shore=1.-smoothstep(.02,.22,edge);float broad=.5+.5*sin(vUv.x*20.-uTime*1.4+sin(vUv.y*9.)*.8);float fine=.5+.5*sin(vUv.x*70.+vUv.y*33.+uTime*2.6);float streak=line(sin(vUv.x*42.+vUv.y*16.-uTime*2.1),.22)*(0.25+0.75*broad);float glint=pow(max(0.,sin(vUv.x*115.-vUv.y*47.+uTime*4.6)),18.);vec3 c=mix(uDeep,uMid,.42+fine*.07);c=mix(c,uShallow,shore*.43+abs(vWave)*1.8);c=mix(c,uSky,streak*.17+glint*.42);float alpha=.88+shore*.055;gl_FragColor=vec4(c,alpha);}`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,80,30),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(ribbon(width,depth*.47,seed+1,.35),ribbon(width,-depth*.47,seed+2,.35));
  for(let i=0;i<4;i++){const z=(-.28+i*.19)*depth;const r=ribbon(width*.76,z,seed+20+i,.10+i*.018);r.scale.x=.88;r.position.x=(i%2?1:-1)*width*.025;g.add(r)}
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x596462,roughness:.92});
  for(let i=0;i<7;i++){const rad=.18+rr()*.33;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set((rr()-.5)*width*.75,.03,(rr()-.5)*depth*.66);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=true;rock.receiveShadow=true;g.add(rock)}
  g.userData={assetId:'water_target_v3',version:'3.0.0',stage:'M04_PRODUCTION_CANDIDATE',source:'repo-procedural',intent:'layered teal river with shore foam, directional surface streaks, glints and embedded stones',update:t=>uniforms.uTime.value=t};
  return g;
}
