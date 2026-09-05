(() => {
'use strict';

/* Collision-safe add-on: broad slow cloud shadows make outdoor maps feel less flat without adding DOM-heavy particles. */
const OUTDOOR=new Set(['town','field','forest','deepForest','mistTrail','observation','evacuation','cliff']);
const style=document.createElement('style');
style.textContent=`
.lqCloudShadowLayer{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none;mix-blend-mode:multiply;opacity:.32}
.lqCloudShadow{position:absolute;left:-45%;width:58%;height:30%;border-radius:50%;background:radial-gradient(ellipse,#17232c70 0%,#1b29335c 38%,transparent 72%);filter:blur(13px);transform:rotate(-8deg);animation:lqCloudSweep 22s linear infinite}
.lqCloudShadow.s1{top:10%}.lqCloudShadow.s2{top:55%;animation-delay:-11s;animation-duration:29s;width:48%;opacity:.66}
.lqCloudShadowLayer.forest{opacity:.2}.lqCloudShadowLayer.mist{opacity:.13}.lqCloudShadowLayer.hostile{opacity:.24}.lqCloudShadowLayer.hostile .lqCloudShadow{background:radial-gradient(ellipse,#17132d88 0%,#241b4055 38%,transparent 72%)}
@keyframes lqCloudSweep{0%{transform:translateX(-20%) rotate(-8deg)}100%{transform:translateX(290%) rotate(-8deg)}}
@media(prefers-reduced-motion:reduce){.lqCloudShadow{animation:none;opacity:.18;left:22%}.lqCloudShadow.s2{left:55%}}
`;
document.head.appendChild(style);
function cloudClass(){if(['forest','deepForest'].includes(s.map))return'forest';if(['mistTrail','cliff'].includes(s.map))return'mist';if(['observation','evacuation'].includes(s.map))return'hostile';return'';}
function addClouds(){
 if(s.screen!=='world'||!OUTDOOR.has(s.map))return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqCloudShadowLayer'))return;
 const layer=document.createElement('div');layer.className=`lqCloudShadowLayer ${cloudClass()}`;layer.innerHTML='<i class="lqCloudShadow s1"></i><i class="lqCloudShadow s2"></i>';w.appendChild(layer);
}
const worldBase=world;world=function(){const r=worldBase();addClouds();return r;};
const renderBase=render;render=function(){const r=renderBase();addClouds();return r;};
if(s.screen==='world')addClouds();
window.LQ_WORLD_CLOUD_STATUS={maps:[...OUTDOOR],broadLayers:2,presentationOnly:true,reducedMotion:true};
})();
