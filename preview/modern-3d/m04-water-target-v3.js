import * as THREE from 'three';
import './ui-quality-v51b.js';

function rng(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function shoreRibbon(width,z,seed=1,opacity=.54){const r=rng(seed),segments=84,v=[],idx=[];for(let i=0;i<=segments;i++){const x=-width/2+width*i/segments;const wave=Math.sin(i*.39+seed)*.085+Math.sin(i*.16+seed*.3)*.05+(r()-.5)*.035;const w=.07+r()*.095;v.push(x,.025,z+wave-w,x,.025,z+wave+w);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;idx.push(a,c,b,b,c,d)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xf5ffff,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}))}
function sparkleField(width,depth,seed=1,count=380,size=.075,opacity=.9){const r=rng(seed),g=new THREE.BufferGeometry(),positions=[],colors=[];const cs=[new THREE.Color(0xffffff),new THREE.Color(0xe9fbff),new THREE.Color(0xaee8ff),new THREE.Color(0xffffff),new THREE.Color(0x8ad2f4)];for(let i=0;i<count;i++){positions.push((r()-.5)*width,.05,(r()-.5)*depth);const c=cs[i%cs.length];colors.push(c.r,c.g,c.b)}g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return new THREE.Points(g,new THREE.PointsMaterial({size,vertexColors:true,transparent:true,opacity,depthWrite:false,sizeAttenuation:true}))}
function foamRing(radius=.45){const geo=new THREE.RingGeometry(radius*.98,radius*1.28,28,1);const mat=new THREE.MeshBasicMaterial({color:0xf6ffff,transparent:true,opacity:.58,depthWrite:false,side:THREE.DoubleSide});const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;return m}
function resolveQuality(requested){if(requested&&requested!=='auto')return requested==='practical'?'practical':'high';try{return new URLSearchParams(location.search).get('quality')==='practical'?'practical':'high'}catch{return'high'}}

export function createTargetWaterV3({width=28,depth=6.2,seed=11,quality='auto'}={}){
  const g=new THREE.Group();
  const resolvedQuality=resolveQuality(quality),practical=resolvedQuality==='practical';
  const segmentsX=practical?52:96,segmentsY=practical?20:40;
  const crossAxis=width<depth?1:0;
  const uniforms={
    uTime:{value:0},
    uDeep:{value:new THREE.Color(0x08708f)},
    uMid:{value:new THREE.Color(0x18a5bf)},
    uShallow:{value:new THREE.Color(0x76d9d3)},
    uSky:{value:new THREE.Color(0xb5d2d6)},
    uSun:{value:new THREE.Color(0xffe8bc)},
    uSunDir:{value:new THREE.Vector3(-.34,.88,.31).normalize()},
    uReflectionStrength:{value:practical?.25:.42},
    uSparkleStrength:{value:practical?.52:.90},
    uWaveStrength:{value:practical?.70:.96},
    uCausticStrength:{value:practical?.27:.54},
    uFoamStrength:{value:practical?.78:1.34},
    uDepthContrast:{value:practical?.96:1.10},
    uCrossAxis:{value:crossAxis}
  };
  // v3.12: the previous shader irregularized only the long bank sides. Integrated HQ evidence
  // exposed hard rectangular river/pool end caps. Both cross-bank and longitudinal end distance
  // fields are now irregularized and participate in discard + shore foam, so all four boundaries
  // read as authored shoreline without changing route/collision authority or adding another pass.
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,
    vertexShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform float uTime;uniform float uWaveStrength;void main(){vUv=uv;vec3 p=position;float w=(sin((p.x+uTime*.58)*1.20)*.045+cos((p.y-uTime*.30)*2.05)*.034+sin((p.x*.41+p.y*.77+uTime*.37)*3.2)*.015)*uWaveStrength;p.z+=w;vWave=w;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:`varying vec2 vUv;varying float vWave;varying vec3 vWorld;uniform vec3 uDeep;uniform vec3 uMid;uniform vec3 uShallow;uniform vec3 uSky;uniform vec3 uSun;uniform vec3 uSunDir;uniform float uTime;uniform float uReflectionStrength;uniform float uSparkleStrength;uniform float uWaveStrength;uniform float uCausticStrength;uniform float uFoamStrength;uniform float uDepthContrast;uniform float uCrossAxis;void main(){float crossCoord=mix(vUv.y,vUv.x,uCrossAxis);float alongCoord=mix(vUv.x,vUv.y,uCrossAxis);float bankJitter=.022*sin(alongCoord*19.0+1.7)+.015*sin(alongCoord*43.0+4.1)+.009*sin(alongCoord*91.0);float endJitter=.020*sin(crossCoord*17.0+2.1)+.013*sin(crossCoord*41.0+.7)+.008*sin(crossCoord*79.0+4.8);float crossEdge=min(crossCoord,1.-crossCoord)-bankJitter;float alongEdge=min(alongCoord,1.-alongCoord)-endJitter;if(crossEdge<.006||alongEdge<.008)discard;float crossShore=1.-smoothstep(.020,.145,crossEdge);float endShore=1.-smoothstep(.024,.118,alongEdge);float shore=max(crossShore,endShore*.92);float basin=smoothstep(.01,.49,min(crossCoord,1.-crossCoord))*smoothstep(.012,.30,min(alongCoord,1.-alongCoord));float a=.5+.5*sin(vUv.x*17.3+sin(vUv.y*10.7+uTime*.26)*1.35-uTime*.58);float b=.5+.5*cos(vUv.y*20.1+sin(vUv.x*8.9-uTime*.21)*1.22+uTime*.39);float patches=a*b;float nx=(cos((vUv.x*19.0+uTime*.42))*0.16+sin((vUv.y*27.0-uTime*.31))*0.10)*uWaveStrength;float nz=(sin((vUv.y*23.0-uTime*.36))*0.15+cos((vUv.x*31.0+uTime*.27))*0.09)*uWaveStrength;vec3 n=normalize(vec3(nx,1.0,nz));vec3 viewDir=normalize(cameraPosition-vWorld);float fresnel=pow(1.-clamp(dot(n,viewDir),0.,1.),2.75);vec3 reflectedSun=reflect(-uSunDir,n);float sunSpec=pow(max(dot(reflectedSun,viewDir),0.),practical_placeholder);float r1=.5+.5*sin(vUv.x*82.0+sin(vUv.y*23.0+uTime*.31)*2.4-uTime*1.05);float r2=.5+.5*cos(vUv.y*71.0+sin(vUv.x*31.0-uTime*.22)*1.8+uTime*.76);float spark=pow(r1*r2,5.0);float lace=.5+.5*sin(vUv.x*43.0+vUv.y*31.0+sin((vUv.x-vUv.y)*18.0)*1.1-uTime*.66);lace=pow(lace,12.0);float foamNoise=.5+.5*sin(alongCoord*42.0+crossCoord*17.0+sin(crossCoord*19.0)*2.0-uTime*.9);float foam=shore*(.20+.80*pow(foamNoise,6.2))*uFoamStrength;float ca1=.5+.5*sin(vUv.x*47.0+vUv.y*29.0+uTime*.35+sin(vUv.y*13.0)*1.6);float ca2=.5+.5*cos(vUv.x*31.0-vUv.y*41.0-uTime*.28+sin(vUv.x*17.0)*1.2);float caustic=pow(ca1*ca2,2.8)*(1.-basin)*uCausticStrength;float flowRibbon=pow(.5+.5*sin(alongCoord*63.0+sin(crossCoord*22.0)*2.4-uTime*1.45),9.0)*(0.22+0.78*basin);float depthMix=clamp((basin*.72+(.16-.16*patches))*uDepthContrast,0.,1.);vec3 c=mix(uShallow,uMid,clamp(basin*.88,0.,1.));c=mix(c,uDeep,depthMix*.60);c=mix(c,uShallow,clamp(shore*.42+abs(vWave)*.66,0.,.54));float skyMix=clamp((.025+fresnel*.76)*uReflectionStrength,0.,.30);c=mix(c,uSky,skyMix);c+=uSun*sunSpec*uReflectionStrength*.58;c+=vec3(.54,.86,.88)*caustic;c=mix(c,vec3(.96,1.0,1.0),min(.66,(spark*.58+lace*.24)*uSparkleStrength+foam*.48));c=mix(c,vec3(.78,.98,1.0),flowRibbon*.20);float alpha=.965+shore*.025+clamp(basin*.008,0.,.008);gl_FragColor=vec4(c,alpha);}`.replace('practical_placeholder',practical?'44.0':'66.0')});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth,segmentsX,segmentsY),mat);mesh.rotation.x=-Math.PI/2;mesh.receiveShadow=true;g.add(mesh);
  g.add(shoreRibbon(width,depth*.47,seed+1,practical?.56:.78),shoreRibbon(width,-depth*.47,seed+2,practical?.56:.78));
  const area=Math.max(1,width*depth),sparkCount=practical?Math.max(100,Math.floor(area*.66)):Math.max(250,Math.floor(area*1.42));
  g.add(sparkleField(width*.95,depth*.87,seed+40,sparkCount,practical?.052:.064,practical?.56:.76));
  const rr=rng(seed*7+3),rockMat=new THREE.MeshStandardMaterial({color:0x66716e,roughness:.94});
  const rockCount=practical?5:9;
  for(let i=0;i<rockCount;i++){const rad=.18+rr()*.33,x=(rr()-.5)*width*.75,z=(rr()-.5)*depth*.66;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(rad,1),rockMat);rock.position.set(x,.03,z);rock.scale.set(1.15,.62,.92);rock.rotation.y=rr()*Math.PI;rock.castShadow=!practical;rock.receiveShadow=true;g.add(rock);if(i<(practical?2:5)){const ring=foamRing(rad*1.25);ring.position.set(x,.052,z);ring.scale.set(1.2,.86,1);g.add(ring)}}
  g.userData={assetId:'water_target_v3',version:'3.13.0',stage:'M04_REGATE',source:'repo-procedural',qualityPreset:resolvedQuality,reflectionMethod:'single-pass analytic wave-normal Fresnel sky reflection + directional sun specular; no planar RTT/SSR',performanceIntent:practical?'52x20 surface grid, reduced sparkle/caustic/shore foam, fewer rocks, no rock cast shadows':'96x40 surface grid, denser sparkle/caustic/shore foam, full shoreline rock shadows',resourceBudget:{surfaceSegments:[segmentsX,segmentsY],sparkleCount:sparkCount,rockCount,rockCastShadows:!practical,reflectionStrength:uniforms.uReflectionStrength.value,waveStrength:uniforms.uWaveStrength.value,causticStrength:uniforms.uCausticStrength.value,foamStrength:uniforms.uFoamStrength.value},intent:'v3.13 luminous turquoise river with four-edge organic clipping, brighter basin, stronger shore foam/caustic breakup and directional flow ribbons; preserves traversal authority and single-pass performance',update:t=>uniforms.uTime.value=t};
  return g;
}
