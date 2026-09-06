(() => {
'use strict';

/* Collision-safe add-on: lightweight regional ambience to increase map depth without changing collision or gameplay. */
const style=document.createElement('style');style.textContent=`
.lqAmbientLayer{position:absolute;inset:0;z-index:6;overflow:hidden;pointer-events:none;border-radius:inherit}.lqAmbientLayer span{position:absolute;display:block;opacity:.34;will-change:transform,opacity}.lqAmbientLayer.motes span{width:3px;height:3px;border-radius:50%;background:#fff4b0;box-shadow:0 0 7px #ffe88b;animation:lqMote 5.8s linear infinite}.lqAmbientLayer.leaves span{width:6px;height:3px;border-radius:80% 15% 80% 15%;background:#90ad5e;animation:lqLeaf 6.6s linear infinite}.lqAmbientLayer.fog span{width:42%;height:20px;border-radius:50%;background:linear-gradient(90deg,transparent,#d9eef333,transparent);filter:blur(4px);animation:lqFog 8s ease-in-out infinite}.lqAmbientLayer.embers span{width:3px;height:5px;border-radius:50% 50% 30% 30%;background:#ffb05c;box-shadow:0 0 6px #ff7733;animation:lqEmber 4.6s ease-out infinite}@keyframes lqMote{0%{transform:translate3d(0,10px,0);opacity:0}20%{opacity:.34}100%{transform:translate3d(18px,-90px,0);opacity:0}}@keyframes lqLeaf{0%{transform:translate3d(-12px,-18px,0) rotate(0);opacity:0}15%{opacity:.38}100%{transform:translate3d(110px,140px,0) rotate(380deg);opacity:0}}@keyframes lqFog{0%,100%{transform:translateX(-10%);opacity:.13}50%{transform:translateX(85%);opacity:.27}}@keyframes lqEmber{0%{transform:translateY(10px) scale(.8);opacity:0}20%{opacity:.42}100%{transform:translateY(-110px) translateX(12px) scale(.3);opacity:0}}@media (prefers-reduced-motion:reduce){.lqAmbientLayer span{animation:none!important;opacity:.12!important}}
`;document.head.appendChild(style);
const TYPE={town:'motes',field:'motes',forest:'leaves',deepForest:'leaves',mistTrail:'fog',observation:'embers',evacRoute:'fog',cliffRoad:'fog',northCliffRoad:'fog',windcutPass:'fog'};
let lastMap=null;
function build(){
 if(s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell)return;const kind=TYPE[s.map];
 let layer=shell.querySelector('.lqAmbientLayer');
 if(!kind){if(layer)layer.remove();lastMap=s.map;return;}
 if(layer&&lastMap===s.map)return;
 if(layer)layer.remove();layer=document.createElement('div');layer.className=`lqAmbientLayer ${kind}`;
 const count=kind==='fog'?4:7;for(let i=0;i<count;i++){const p=document.createElement('span');p.style.left=`${8+(i*13)%82}%`;p.style.top=`${12+(i*17)%74}%`;p.style.animationDelay=`-${(i*0.73).toFixed(2)}s`;p.style.animationDuration=`${(4.8+(i%3)*1.1).toFixed(1)}s`;layer.appendChild(p);}shell.appendChild(layer);lastMap=s.map;
}
const renderBase=render;render=function(){const r=renderBase();build();return r;};
window.LQ_WORLD_AMBIENT_STATUS={regional:true,nonInteractive:true,reducedMotion:true,hasMap:(map)=>Object.prototype.hasOwnProperty.call(TYPE,map),typeFor:(map)=>TYPE[map]||null};
build();
})();
