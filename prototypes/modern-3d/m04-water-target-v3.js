import * as THREE from 'three';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shoreRibbon(width,z,seed=1,opacity=.54){const r=rng(seed),segments=84,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.39+seed)*.085+Math.sin(i*.16+seed*.3)*.05+(r()-.5)*.035;const w=.07+r()*.095;v.push(x,.025,z+wave-w,x,.025,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xf5ffff,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}
function sparkleField(width,depth,seed=1,count=380,size=.075,opacity=.9){const r=rng(seed),g=new THREE.BufferGeometry(),positions=[],colors=[];const cs=[new THREE.Color(0xffffff),new THREE.Color(0xd7f5ff),new THREE.Color(0x8fcff5),new THREE.Color(0xffffff),new THREE.Color(0x76ace7)];for(let i=0;i<count;i++){positions.push((r()-.5)*width,.05,(r()-.5)*depth);const c=cs[i%cs.length];colors.push(c.r,c.g,c.b)}g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity,depthWrite:false,sizeAttenuation:true}))}
function foamRing(radius=.45){const geo=new THREE.RingGeometry(radius*.98,radius*1.28,28,1);const mat=new THREE.MeshBasicMaterial({color:0xf6ffff,transparent:true,opacity:.52,depthWrite:false,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;return m}
function resolveQuality(requested){if(requested&&requested!=='auto')return requested==='practical'?'practical':'high';try{return new URLSearchParams(location.search).get('quality')==='practical'?'practical':'high'}catch{return'high'}}

export function createTargetWaterV3({width=28,depth=6.2,seed=11,quality='auto'}={}){
  const g=new THREE.Group();
  const resolvedQuality=resolveQuality(quality),practical=resolvedQuality==='practical';
  const segmentsX=practical?52:96,segmentsY=practical?20:40;
  const uniforms={
    uTime:{value:0},
    uDeep:{value:new THREE.Color(0x086a9a)},
    uMid:{value:new THREE.Color(0x159ac3)},
    uShallow:{value:new THREE.Color(0x7fd5cf)},
    uSky:{value:new THREE.Color(0xb9d2d7)},
    uSun:{value:new THREE.Color(0xffe0a6)},
    uSunDir:{value:new THREE.Vector3(-.34,.88,.31).normalize()},
    uReflectionStrength:{value:practical?.22:.42},
    uSparkleStrength:{value:practical?.36:.72},
    uWaveStrength:{value:practical?.68:.94},
    uCausticStrength:{value:practical?.15:.26},
    uFoamStrength:{value:practical?.58:.90},
    uDepthContrast:{value:practical?.98:1.12}
  };
  // M07 reflection method: single-pass analytic reflection. A wave-derived pseudo normal drives
  // Fresnel sky reflection and a directional sun specular lobe. No planar RTT/SSR is used, so
  // the practical preset avoids a second scene render while the high preset spends more geometry,
  // caustic breakup and sparkle density on water detail. Shore/depth response is non-emissive.
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform float uTime;uniform float uWaveStrength;void main(){vUv=uv;vec3 p=position;float w=(sin((p.x+uTime*.58)*1.20)*.045+cos((p.y-uTime*.30)*2.05)*.034+sin((p.x*.41+p.y*.77+uTime*.37)*3.2)*.015)*uWaveStrength;p.z+=w;vWave=w;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uSky;uniform vec3 uSun;uniform vec3 uSunDir;uniform float uTime;uniform float uReflectionStrength;uniform float uSparkleStrength;uniform float uWaveStrength;uniform float uCausticStrength;uniform float uFoamStrength;uniform float uDepthContrast;void main(){float edge=min(vUv.y,1.-vUv.y);float shore=1.-smoothstep(.025,.235,edge);float basin=smoothstep(.01,.49,min(vUv.y,1.-vUv.y));float a=.5+.5*sin(vUv.x*17.3+sin(vUv.y*10.7+uTime*.26)*1.35-uTime*.58);float b=.5+.5*cos(vUv.y*20.1+sin(vUv.x*8.9-uTime*.21)*1.22+uTime*.39);float patches=a*b;float nx=(cos((vUv.x*19.0+uTime*.42))*0.16+sin((vUv.y*27.0-uTime*.31))*0.10)*uWaveStrength;float nz=(sin((vUv.y*23.0-uTime*.36))*0.15+cos((vUv.x*31.0+uTime*.27))*0.09)*uWaveStrength;vec3 n=normalize(vec3(nx,1.0,nz));vec3 viewDir=normalize(cameraPosition-vWorld);float fresnel=pow(1.-clamp(dot(n,viewDir),0.,1.),2.75);vec3 reflectedSun=reflect(-uSunDir,n);float sunSpec=pow(max(dot(reflectedSun,viewDir),0.),practical_placeholder);float r1=.5+.5*sin(vUv.x*82.0+sin(vUv.y*23.0+uTime*.31)*2.4-uTime*1.05);float r2=.5+.5*cos(vUv.y*71.0+sin(vUv.x*31.0-uTime*.22)*1.8+uTime*.76);float spark=pow(r1*r2,5.15);float lace=.5+.5*sin(vUv.x*43.0+vUv.y*31.0+sin((vUv.x-vUv.y)*18.0)*1.1-uTime*.66);lace=pow(lace,13.5);float foamNoise=.5+.5*sin(vUv.x*38.0+sin(vUv.y*19.0)*2.0-uTime*.9);float foam=shore*(.16+.84*pow(foamNoise,7.0))*uFoamStrength;float ca1=.5+.5*sin(vUv.x*47.0+vUv.y*29.0+uTime*.35+sin(vUv.y*13.0)*1.6);float ca2=.5+.5*cos(vUv.x*31.0-vUv.y*41.0-uTime*.28+sin(vUv.x*17.0)*1.2);float caustic=pow(ca1*ca2,3.2)*(1.-basin)*uCausticStrength;float depthMix=clamp((basin*.80+(.20-.20*patches))*uDepthContrast,0.,1.);vec3 c=mix(uShallow,uMid,clamp(basin*.92,0.,1.));c=mix(c,uDeep,depthMix*.52);c=mix(c,uShallow,clamp(shore*.48+abs(vWave)*.78,0.,.57));float skyMix=clamp((.022+fresnel*.80)*uReflectionStrength,0.,.31);c=mix(c,uSky,skyMix);c+=uSun*sunSpec*uReflectionStrength*.52;c+=vec3(.50,.80,.80)*caustic;c=mix(c,vec3(.94,1.0,1.0),min(.53,(spark*.54+lace*.20)*uSparkleStrength+foam*.40));c*=.995;float alpha=.955+shore*.030+clamp(basin*.010,0.,.010);gl_FragColor=vec4(c,alpha);}`.replace('practical_placeholder',practical?'48.0':'72.0')});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,segmentsX,segmentsY),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(shoreRibbon(width,depth*.47,seed+1,practical?.50:.72),shoreRibbon(width,-depth*.47,seed+2,practical?.50:.72));
  const area=Math.max(1,width*depth),sparkCount=practical?Math.max(80,Math.floor(area*.56)):Math.max(210,Math.floor(area*1.22));
  g.add(sparkleField(width*.95,depth*.87,seed+40,sparkCount,practical?.050:.061,practical?.48:.68));
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x586461,roughness:.94});
  const rockCount=practical?5:9;
  for(let i=0;i<rockCount;i++){const rad=.18+rr()*.33,x=(rr()-.5)*width*.75,z=(rr()-.5)*depth*.66;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set(x,.03,z);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=!practical;rock.receiveShadow=true;g.add(rock);if(i<(practical?2:5)){const ring=foamRing(rad*1.25);ring.position.set(x,.052,z);ring.scale.set(1.2,.86,1);g.add(ring)}}
  g.userData={assetId:'water_target_v3',version:'3.8.2',stage:'M07_IN_PROGRESS',source:'repo-procedural',qualityPreset:resolvedQuality,reflectionMethod:'single-pass analytic wave-normal Fresnel sky reflection + directional sun specular; no planar RTT/SSR',performanceIntent:practical?'52x20 surface grid, reduced sparkle/caustic/shore foam, fewer rocks, no rock cast shadows':'96x40 surface grid, denser sparkle/caustic/shore foam, full shoreline rock shadows',resourceBudget:{surfaceSegments:[segmentsX,segmentsY],sparkleCount:sparkCount,rockCount,rockCastShadows:!practical,reflectionStrength:uniforms.uReflectionStrength.value,waveStrength:uniforms.uWaveStrength.value,causticStrength:uniforms.uCausticStrength.value,foamStrength:uniforms.uFoamStrength.value},intent:'target-derived river with stronger readable turquoise shallows, brighter broken shoreline foam and sky/sun response while retaining a deep basin, restrained non-emissive caustics, moving reflection and grounded rocks; lifts the overly dark navy read seen in M07 evidence without flattening depth',update:t=>uniforms.uTime.value=t};
  return g;
}
