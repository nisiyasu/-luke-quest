import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shoreRibbon(width,z,seed=1,opacity=.54){const r=rng(seed),segments=84,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.39+seed)*.085+Math.sin(i*.16+seed*.3)*.05+(r()-.5)*.035;const w=.07+r()*.095;v.push(x,.025,z+wave-w,x,.025,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xf5ffff,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}
function sparkleField(width,depth,seed=1,count=380,size=.075,opacity=.9){const r=rng(seed),g=new THREE.BufferGeometry(),positions=[],colors=[];const cs=[new THREE.Color(0xffffff),new THREE.Color(0xd5ffff),new THREE.Color(0x8ffff5),new THREE.Color(0xffffff),new THREE.Color(0x9bdcff)];for(let i=0;i<count;i++){positions.push((r()-.5)*width,.05,(r()-.5)*depth);const c=cs[i%cs.length];colors.push(c.r,c.g,c.b)}g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity,depthWrite:false,sizeAttenuation:true}))}
function foamRing(radius=.45){const geo=new THREE.RingGeometry(radius*.98,radius*1.28,28,1);const mat=new THREE.MeshBasicMaterial({color:0xf6ffff,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;return m}

export function createTargetWaterV3({width=28,depth=6.2,seed=11,quality='high'}={}){
  const g=new THREE.Group();
  const practical=quality==='practical';
  const segmentsX=practical?58:92,segmentsY=practical?22:36;
  const uniforms={
    uTime:{value:0},
    uDeep:{value:new THREE.Color(0x07516f)},
    uMid:{value:new THREE.Color(0x0b839b)},
    uShallow:{value:new THREE.Color(0x54c8ba)},
    uSky:{value:new THREE.Color(0xb8d4d2)},
    uSun:{value:new THREE.Color(0xffe2ad)},
    uReflectionStrength:{value:practical?.22:.31},
    uSparkleStrength:{value:practical?.36:.48}
  };
  // M07 reflection method: analytic Fresnel-like sky + directional sun-lobe reflection.
  // It intentionally avoids planar render-to-texture/SSR so the practical mobile preset has no second scene render.
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform float uTime;void main(){vUv=uv;vec3 p=position;float w=sin((p.x+uTime*.58)*1.20)*.045+cos((p.y-uTime*.30)*2.05)*.034+sin((p.x*.41+p.y*.77+uTime*.37)*3.2)*.015;p.z+=w;vWave=w;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uSky;uniform vec3 uSun;uniform float uTime;uniform float uReflectionStrength;uniform float uSparkleStrength;void main(){float edge=min(vUv.y,1.-vUv.y);float shore=1.-smoothstep(.025,.20,edge);float a=.5+.5*sin(vUv.x*17.3+sin(vUv.y*10.7+uTime*.26)*1.35-uTime*.58);float b=.5+.5*cos(vUv.y*20.1+sin(vUv.x*8.9-uTime*.21)*1.22+uTime*.39);float patches=a*b;float r1=.5+.5*sin(vUv.x*82.0+sin(vUv.y*23.0+uTime*.31)*2.4-uTime*1.05);float r2=.5+.5*cos(vUv.y*71.0+sin(vUv.x*31.0-uTime*.22)*1.8+uTime*.76);float spark=pow(r1*r2,4.4);float lace=.5+.5*sin(vUv.x*43.0+vUv.y*31.0+sin((vUv.x-vUv.y)*18.0)*1.1-uTime*.66);lace=pow(lace,12.0);float foam=shore*(.28+.72*pow(.5+.5*sin(vUv.x*38.0+sin(vUv.y*19.0)*2.0-uTime*.9),6.0));vec3 c=mix(uDeep,uMid,.48+patches*.15);c=mix(c,uShallow,shore*.48+abs(vWave)*1.55+patches*.10);vec3 viewDir=normalize(cameraPosition-vWorld);float fresnel=pow(1.-clamp(abs(viewDir.y),0.,1.),2.15);float directional=pow(max(0.,sin(vUv.x*19.0-vUv.y*8.0+uTime*.18)*.5+.5),15.0)*(1.-shore*.55);c=mix(c,uSky,clamp((.10+fresnel)*uReflectionStrength,0.,.42));c+=uSun*directional*uReflectionStrength*.24;c=mix(c,vec3(0.91,1.0,0.98),min(.56,(spark*.60+lace*.25)*uSparkleStrength+foam*.26));gl_FragColor=vec4(c,.94+shore*.045);}`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,segmentsX,segmentsY),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(shoreRibbon(width,depth*.47,seed+1,practical?.38:.48),shoreRibbon(width,-depth*.47,seed+2,practical?.38:.48));
  const area=Math.max(1,width*depth),sparkCount=practical?Math.max(120,Math.floor(area*.8)):Math.max(240,Math.floor(area*1.55));
  g.add(sparkleField(width*.95,depth*.87,seed+40,sparkCount,practical?.055:.065,practical?.55:.68));
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x586461,roughness:.94});
  const rockCount=practical?5:7;
  for(let i=0;i<rockCount;i++){const rad=.18+rr()*.33,x=(rr()-.5)*width*.75,z=(rr()-.5)*depth*.66;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set(x,.03,z);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=true;rock.receiveShadow=true;g.add(rock);if(i<(practical?3:5)){const ring=foamRing(rad*1.25);ring.position.set(x,.052,z);ring.scale.set(1.2,.86,1);g.add(ring)}}
  g.userData={assetId:'water_target_v3',version:'3.5.0',stage:'M07_IN_PROGRESS',source:'repo-procedural',qualityPreset:quality,reflectionMethod:'analytic Fresnel-like sky reflection + directional sun lobe; no planar RTT/SSR',performanceIntent:practical?'reduced mesh subdivisions/sparkles/shore opacity for mobile practical preset':'higher subdivisions/sparkle density for high-quality preset',intent:'natural turquoise river with depth bands, restrained analytic reflection, irregular shoreline foam and non-grid glints; avoids flat blue plate and excessive emissive bloom',update:t=>uniforms.uTime.value=t};
  return g;
}
