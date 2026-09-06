(() => {
'use strict';

/* Collision-safe add-on: warm landmark lights and hostile-route torches for PS1-era scene depth. */
const style=document.createElement('style');
style.textContent=`
.lqMapLight{position:absolute;z-index:6;width:20px;height:26px;pointer-events:none;transform:translate(-50%,-80%)}
.lqMapLight::before{content:'';position:absolute;left:50%;bottom:3px;width:7px;height:11px;transform:translateX(-50%);border-radius:55% 55% 45% 45%;background:linear-gradient(#fff7b2,#ffb43f 56%,#d85b25);box-shadow:0 0 8px #ffd36acc,0 0 18px #ff9d3f88}
.lqMapLight::after{content:'';position:absolute;left:50%;bottom:-2px;width:28px;height:13px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,#ffd26a38 0%,#ffb64d16 45%,transparent 72%);filter:blur(1px)}
.lqMapLight.hostile::before{background:linear-gradient(#e4e8ff,#8f83ff 48%,#6539a8);box-shadow:0 0 8px #a99affcc,0 0 18px #7655d488}
.lqMapLight.hostile::after{background:radial-gradient(ellipse,#8b79ff34 0%,#6245c318 48%,transparent 73%)}
.lqMapLight.camp::before{width:12px;height:9px;bottom:2px;border-radius:60% 40% 55% 45%;background:linear-gradient(#fff5a0,#ff9b31 55%,#a93d22);box-shadow:0 0 10px #ffc75ecc,0 0 25px #ff7f3380;animation:lqFireFlicker .78s ease-in-out infinite alternate}
.lqMapLight.camp.spent::before{width:13px;height:5px;background:linear-gradient(#8f8177,#554e49);box-shadow:0 0 4px #aaa5;animation:none;filter:none}
.lqMapLight.camp.spent::after{width:22px;height:9px;background:radial-gradient(ellipse,#a8988130 0%,transparent 68%)}
.lqMapLight.wind{width:30px;height:30px;transform:translate(-50%,-62%)}
.lqMapLight.wind::before{left:50%;bottom:8px;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle,#f4ffff 0 18%,#bdefff 30%,#83c7dc66 58%,transparent 72%);box-shadow:0 0 7px #d8f8ffcc,0 0 18px #8fd6e877;animation:lqWindGlint 2.4s ease-in-out infinite alternate}
.lqMapLight.wind::after{left:50%;bottom:7px;width:42px;height:10px;border-radius:50%;background:linear-gradient(90deg,transparent,#c9f4ff45 35%,#efffff88 50%,#c9f4ff45 65%,transparent);filter:blur(.4px);transform:translateX(-50%) rotate(-8deg);animation:lqWindGlintTrail 2.4s ease-in-out infinite alternate}
.lqMapLight.cliff{width:30px;height:30px;transform:translate(-50%,-64%)}
.lqMapLight.cliff::before{left:50%;bottom:7px;width:10px;height:8px;border-radius:48%;background:radial-gradient(circle,#f1f5ef 0 16%,#c8d3ca 34%,#7f989173 62%,transparent 74%);box-shadow:0 0 7px #d7e1dbb8,0 0 16px #8ca8a06b;animation:lqCliffGlint 3.1s ease-in-out infinite alternate}
.lqMapLight.cliff::after{left:50%;bottom:6px;width:34px;height:12px;border-radius:50%;background:radial-gradient(ellipse,#dce8e26b 0 18%,#8fa9a13b 40%,transparent 70%);filter:blur(.6px);transform:translateX(-50%) rotate(7deg);animation:lqCliffGlintTrail 3.1s ease-in-out infinite alternate}
@keyframes lqFireFlicker{from{transform:translateX(-50%) scale(.92,1.04);filter:brightness(.95)}to{transform:translateX(-50%) scale(1.07,.9);filter:brightness(1.14)}}
@keyframes lqWindGlint{from{opacity:.45;transform:translateX(-50%) scale(.82)}to{opacity:.95;transform:translateX(-50%) scale(1.1)}}
@keyframes lqWindGlintTrail{from{opacity:.28;transform:translateX(-50%) rotate(-8deg) scaleX(.82)}to{opacity:.72;transform:translateX(-50%) rotate(-8deg) scaleX(1.06)}}
@keyframes lqCliffGlint{from{opacity:.34;transform:translateX(-50%) scale(.88)}to{opacity:.8;transform:translateX(-50%) scale(1.05)}}
@keyframes lqCliffGlintTrail{from{opacity:.2;transform:translateX(-50%) rotate(7deg) scale(.9)}to{opacity:.56;transform:translateX(-50%) rotate(7deg) scale(1.04)}}
@media(prefers-reduced-motion:reduce){.lqMapLight.camp::before,.lqMapLight.wind::before,.lqMapLight.wind::after,.lqMapLight.cliff::before,.lqMapLight.cliff::after{animation:none}}
`;
document.head.appendChild(style);

const LIGHTS={
 town:[{x:5,y:10},{x:12,y:10},{x:5,y:13},{x:12,y:13}],
 forest:[{x:12,y:11,type:'camp'}],
 observation:[{x:6,y:6,type:'hostile'},{x:25,y:6,type:'hostile'},{x:6,y:16,type:'hostile'},{x:25,y:16,type:'hostile'}],
 northCliffRoad:[{x:15,y:12,type:'cliff'},{x:10,y:1,type:'cliff'}],
 windcutPass:[{x:15,y:13,type:'wind'},{x:10,y:1,type:'wind'}],
 northRidgeApproach:[{x:7,y:16,type:'cliff'},{x:10,y:1,type:'wind'}],
 windShelf:[{x:8,y:16,type:'cliff'},{x:15,y:13,type:'wind'},{x:10,y:1,type:'wind'}],
 skylineTraverse:[{x:9,y:16,type:'cliff'},{x:15,y:12,type:'wind'},{x:10,y:1,type:'wind'}]
};

function specsFor(mapId){return Array.isArray(LIGHTS[mapId])?LIGHTS[mapId]:[];}
function hasMap(mapId){return Object.prototype.hasOwnProperty.call(LIGHTS,mapId);}
function countFor(mapId){return specsFor(mapId).length;}
function typesFor(mapId){return specsFor(mapId).map(spec=>spec.type||'warm');}
function addLights(){
 if(s.screen!=='world')return;
 const worldEl=app.querySelector('.world');if(!worldEl)return;
 worldEl.querySelectorAll('.lqMapLight').forEach(n=>n.remove());
 const specs=specsFor(s.map);
 for(const spec of specs){
  const e=document.createElement('div');
  const spent=spec.type==='camp'&&!!s.flags?.forestCampRested;
  e.className=`lqMapLight ${spec.type||''}${spent?' spent':''}`;
  e.style.left=`${spec.x*TS+TS/2}px`;
  e.style.top=`${spec.y*TS+TS/2}px`;
  worldEl.appendChild(e);
 }
}

const worldBase=world;
world=function(){const r=worldBase();addLights();return r;};
const renderBase=render;
render=function(){const r=renderBase();addLights();return r;};
if(s.screen==='world')addLights();
window.LQ_WORLD_LANDMARK_LIGHT_STATUS={
 townLamps:4,
 forestCampGlow:1,
 campReflectsRestState:true,
 observationTorches:4,
 northCliffRoadGlints:2,
 northCliffRoadStyle:'cliff',
 windcutPassGlints:2,
 windcutPassStyle:'wind',
 northRidgeApproachGlints:2,
 northRidgeApproachStyles:['cliff','wind'],
 windShelfGlints:3,
 windShelfStyles:['cliff','wind','wind'],
 skylineTraverseGlints:3,
 skylineTraverseStyles:['cliff','wind','wind'],
 presentationOnly:true,
 pointerSafe:true,
 hasMap,
 specsFor,
 countFor,
 typesFor
};
})();
