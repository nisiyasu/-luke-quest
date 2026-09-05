(() => {
'use strict';

/* LUKE QUEST v0.104 map-specific ambient field effects.
   Lightweight atmosphere for the PS1-early 2D JRPG presentation target. */

const style=document.createElement('style');
style.textContent=`
.lqAmbient{position:absolute;inset:0;z-index:14;overflow:hidden;pointer-events:none;border-radius:inherit;mix-blend-mode:screen}
.lqAmbient i{position:absolute;display:block;opacity:0;will-change:transform,opacity}
.lqAmbient.field i{width:3px;height:9px;border-radius:80% 10% 80% 10%;background:#d9f1b4;box-shadow:0 0 4px #f8ffd2;animation:lqSeed 7s linear infinite}
.lqAmbient.forest i,.lqAmbient.deepForest i{width:7px;height:5px;border-radius:70% 20% 70% 20%;background:#d58b45;box-shadow:inset 0 0 0 1px #5d3a1f;animation:lqLeaf 8s linear infinite}
.lqAmbient.deepForest i:nth-child(3n){width:4px;height:4px;border-radius:50%;background:#c9ff83;box-shadow:0 0 7px #9bff63;animation:lqFirefly 4.5s ease-in-out infinite}
.lqAmbient.mistTrail i{width:38%;height:13px;border-radius:50%;background:linear-gradient(90deg,transparent,#d9fff426,transparent);filter:blur(4px);animation:lqMist 9s ease-in-out infinite}
.lqAmbient.observation i,.lqAmbient.evacRoute i{width:3px;height:3px;border-radius:50%;background:#d7c5a1;box-shadow:0 0 3px #f2d6a1;animation:lqAsh 6.5s linear infinite}
.lqAmbient.town i{width:3px;height:3px;border-radius:50%;background:#ffe6a0;box-shadow:0 0 5px #ffd46b;animation:lqMote 5.5s ease-in-out infinite}
.lqAmbient.cliffRoad i{width:18px;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,#e7efff77);animation:lqWind 4.8s linear infinite}
@keyframes lqSeed{0%{transform:translate3d(-12vw,-12px,0) rotate(0);opacity:0}12%{opacity:.55}100%{transform:translate3d(34vw,105vh,0) rotate(310deg);opacity:0}}
@keyframes lqLeaf{0%{transform:translate3d(-8vw,-16px,0) rotate(0);opacity:0}10%{opacity:.55}55%{transform:translate3d(10vw,48vh,0) rotate(190deg)}100%{transform:translate3d(-5vw,105vh,0) rotate(390deg);opacity:0}}
@keyframes lqFirefly{0%,100%{transform:translate3d(0,8px,0);opacity:.08}45%{transform:translate3d(13px,-8px,0);opacity:.72}}
@keyframes lqMist{0%,100%{transform:translateX(-18%);opacity:.08}50%{transform:translateX(165%);opacity:.3}}
@keyframes lqAsh{0%{transform:translate3d(0,-12px,0);opacity:0}15%{opacity:.45}100%{transform:translate3d(22px,105vh,0);opacity:0}}
@keyframes lqMote{0%,100%{transform:translate3d(0,5px,0);opacity:.05}45%{transform:translate3d(7px,-12px,0);opacity:.4}}
@keyframes lqWind{0%{transform:translate3d(-20vw,0,0);opacity:0}20%{opacity:.3}100%{transform:translate3d(120vw,-8px,0);opacity:0}}
@media (prefers-reduced-motion:reduce){.lqAmbient i{animation:none!important;opacity:.08!important}}
`;
document.head.appendChild(style);

const THEMES={town:'town',field:'field',forest:'forest',deepForest:'deepForest',mistTrail:'mistTrail',observation:'observation',evacRoute:'evacRoute',cliffRoad:'cliffRoad'};
function ambientCount(theme){if(theme==='mistTrail')return 5;if(theme==='town')return 7;if(theme==='deepForest')return 12;return 9;}
function addAmbient(){
 if(s.screen!=='world')return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqAmbient'))return;
 const theme=THEMES[s.map];if(!theme)return;
 const layer=document.createElement('div');layer.className=`lqAmbient ${theme}`;layer.setAttribute('aria-hidden','true');
 const n=ambientCount(theme);
 for(let i=0;i<n;i++){
  const p=document.createElement('i');
  p.style.left=`${(i*37+11)%96}%`;p.style.top=`${(i*53+7)%88}%`;
  p.style.animationDelay=`-${((i*.73)%6).toFixed(2)}s`;p.style.animationDuration=`${(4.7+(i%5)*.73).toFixed(2)}s`;
  layer.appendChild(p);
 }
 shell.appendChild(layer);
}
const renderV103=render;render=function(){const r=renderV103();addAmbient();return r;};
queueMicrotask(addAmbient);
window.LQ_AMBIENT_STATUS={mapSpecific:true,reducedMotionAware:true,pointerSafe:true};
})();