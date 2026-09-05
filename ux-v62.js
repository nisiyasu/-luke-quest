(() => {
'use strict';

/* LUKE QUEST v0.62 world atmosphere layer.
   Adds region-specific light/vignette/weather cues above maps without changing collision or story. */

const style=document.createElement('style');
style.textContent=`
.lqWorldAtmosphere{position:absolute;inset:0;z-index:18;pointer-events:none;overflow:hidden;border-radius:14px}.lqWorldAtmosphere:before,.lqWorldAtmosphere:after{content:"";position:absolute;inset:0}
.lqAtmo-town:before{background:radial-gradient(circle at 24% 15%,#fff5c818 0 11%,transparent 26%),radial-gradient(circle at 78% 42%,#ffe69c12 0 10%,transparent 25%)}.lqAtmo-town:after{box-shadow:inset 0 0 54px #14203b33}
.lqAtmo-field:before{background:linear-gradient(155deg,#fff6bd18 0 13%,transparent 27%),radial-gradient(ellipse at 70% 85%,#6c91431b 0 17%,transparent 38%)}.lqAtmo-field:after{box-shadow:inset 0 0 48px #1434232c}
.lqAtmo-forest:before,.lqAtmo-deepForest:before{background:radial-gradient(ellipse at 18% 5%,#dff2af14 0 8%,transparent 22%),linear-gradient(107deg,transparent 0 26%,#fff6b813 27% 30%,transparent 31% 61%,#fff6b80c 62% 65%,transparent 66%)}.lqAtmo-forest:after{box-shadow:inset 0 0 70px #061b0d88}.lqAtmo-deepForest:after{box-shadow:inset 0 0 95px #020d0799;background:#07150b16}
.lqAtmo-mistTrail:before{inset:-15%;background:radial-gradient(ellipse at 20% 38%,#d8e9e932 0 13%,transparent 29%),radial-gradient(ellipse at 67% 56%,#e4efef29 0 18%,transparent 35%),radial-gradient(ellipse at 82% 20%,#d4e3e325 0 12%,transparent 27%);animation:lqWorldMist 7s ease-in-out infinite alternate}@keyframes lqWorldMist{to{transform:translateX(7%) translateY(-2%)}}.lqAtmo-mistTrail:after{box-shadow:inset 0 0 64px #0e262888}
.lqAtmo-observation:before,.lqAtmo-evacRoute:before{background:radial-gradient(circle at 15% 24%,#f3b06b16 0 2px,transparent 3px),radial-gradient(circle at 74% 55%,#ef9b5d16 0 2px,transparent 3px),radial-gradient(circle at 55% 16%,#e68d5312 0 1px,transparent 2px);background-size:71px 63px,83px 76px,59px 71px;animation:lqAshFall 5s linear infinite}@keyframes lqAshFall{to{background-position:8px 64px,-9px 76px,5px 71px}}.lqAtmo-observation:after{box-shadow:inset 0 0 70px #1a111899}.lqAtmo-evacRoute:after{box-shadow:inset 0 0 66px #14191888}
.lqAtmo-cliffRoad:before{background:linear-gradient(165deg,#dceafa14 0 18%,transparent 33%),radial-gradient(ellipse at 70% 15%,#edf5ff17 0 12%,transparent 28%)}.lqAtmo-cliffRoad:after{box-shadow:inset 0 0 65px #1b27358c}
@media(prefers-reduced-motion:reduce){.lqWorldAtmosphere:before{animation:none!important}}
`;
document.head.appendChild(style);

function addWorldAtmosphere(){
 if(s.screen!=='world')return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqWorldAtmosphere'))return;
 if(['innInterior','shopInterior','templeInterior'].includes(s.map))return;
 const a=document.createElement('div');a.className=`lqWorldAtmosphere lqAtmo-${s.map}`;shell.appendChild(a);
}

const worldV61=world;world=function(){worldV61();addWorldAtmosphere();};
const renderV61=render;render=function(){const r=renderV61();if(s.screen==='world')addWorldAtmosphere();return r;};
window.LQ_WORLD_ATMOSPHERE_STATUS={regionalOverlay:true,reducedMotionSafe:true};
if(s.screen==='world')addWorldAtmosphere();
})();
