(() => {
'use strict';

/* Collision-safe add-on: tiny terrain-aware step particles for movement feel. */
const style=document.createElement('style');style.textContent=`
.lqStepFx{position:absolute;z-index:19;width:14px;height:8px;left:50%;top:57%;margin-left:-7px;pointer-events:none;opacity:0;animation:lqStepFx .48s ease-out both}.lqStepFx:before,.lqStepFx:after{content:"";position:absolute;bottom:0;width:5px;height:3px;border-radius:50%;background:#d8c69a88}.lqStepFx:before{left:1px;transform:rotate(-18deg)}.lqStepFx:after{right:1px;transform:rotate(18deg)}.lqStepFx.leaf:before,.lqStepFx.leaf:after{width:6px;height:3px;border-radius:90% 10% 90% 10%;background:#8ea86599}.lqStepFx.mist:before,.lqStepFx.mist:after{width:8px;height:2px;background:#d8eef077;filter:blur(1px)}.lqStepFx.ash:before,.lqStepFx.ash:after{width:4px;height:4px;background:#8f8a8299}@keyframes lqStepFx{0%{opacity:.75;transform:translateY(3px) scale(.75)}100%{opacity:0;transform:translateY(-7px) scale(1.35)}}@media (prefers-reduced-motion:reduce){.lqStepFx{display:none}}
`;document.head.appendChild(style);
const OUTDOOR=new Set(['town','field','forest','deepForest','mistTrail','observation','evacuation','evacRoute','cliff','cliffRoad','northCliffRoad','windcutPass']);
let last={map:s.map,x:s.x,y:s.y};
function kindFor(map=s.map){if(['forest','deepForest'].includes(map))return'leaf';if(['mistTrail','evacuation','evacRoute','cliff','cliffRoad','northCliffRoad','windcutPass'].includes(map))return'mist';if(map==='observation')return'ash';return'dust';}
function stepFx(){
 const changed=s.screen==='world'&&(s.map!==last.map||s.x!==last.x||s.y!==last.y);const sameMap=s.map===last.map;
 last={map:s.map,x:s.x,y:s.y};if(!changed||!sameMap||!OUTDOOR.has(s.map))return;
 const shell=app.querySelector('.gameShell');if(!shell)return;const fx=document.createElement('div');fx.className=`lqStepFx ${kindFor()}`;shell.appendChild(fx);setTimeout(()=>fx.remove(),520);
}
const renderBase=render;render=function(){const r=renderBase();stepFx();return r;};
window.LQ_FOOTSTEP_PARTICLE_STATUS={terrainAware:true,presentationOnly:true,reducedMotion:true,mapKeyCoverage:[...OUTDOOR],hasMap:(map)=>OUTDOOR.has(map),kindFor:(map)=>OUTDOOR.has(map)?kindFor(map):null};
})();
