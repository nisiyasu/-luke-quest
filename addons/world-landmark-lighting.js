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
@keyframes lqFireFlicker{from{transform:translateX(-50%) scale(.92,1.04);filter:brightness(.95)}to{transform:translateX(-50%) scale(1.07,.9);filter:brightness(1.14)}}
@media(prefers-reduced-motion:reduce){.lqMapLight.camp::before{animation:none}}
`;
document.head.appendChild(style);

const LIGHTS={
 town:[{x:5,y:10},{x:12,y:10},{x:5,y:13},{x:12,y:13}],
 forest:[{x:12,y:11,type:'camp'}],
 observation:[{x:6,y:6,type:'hostile'},{x:25,y:6,type:'hostile'},{x:6,y:16,type:'hostile'},{x:25,y:16,type:'hostile'}]
};

function addLights(){
 if(s.screen!=='world')return;
 const worldEl=app.querySelector('.world');if(!worldEl)return;
 worldEl.querySelectorAll('.lqMapLight').forEach(n=>n.remove());
 const specs=LIGHTS[s.map]||[];
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
window.LQ_WORLD_LANDMARK_LIGHT_STATUS={townLamps:4,forestCampGlow:1,campReflectsRestState:true,observationTorches:4,presentationOnly:true};
})();
