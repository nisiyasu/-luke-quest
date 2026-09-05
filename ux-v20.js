(() => {
'use strict';

/* LUKE QUEST v0.20 forest atmosphere pass.
   Adds layered canopy shadows, leaf litter, mushrooms, fallen logs, light shafts and route clues
   to 魔物の森・入口/深部 without changing collision or story triggers. */

const tileClassV19=tileClass;
tileClass=function(c){
  const base=tileClassV19(c);
  if(!['forest','deepForest'].includes(s.map))return base;
  if(c==='.')return `${base} lqForestGroundDetail`;
  if(c==='*')return `${base} lqForestTreeDetail`;
  return base;
};

const style=document.createElement('style');
style.textContent=`
.tile.lqForestGroundDetail{background:
 radial-gradient(ellipse at 15% 28%,#8f7745 0 3px,transparent 4px),
 radial-gradient(ellipse at 74% 67%,#61733c 0 3px,transparent 4px),
 linear-gradient(135deg,#315f35,#274e30)}
.deep.tile.lqForestGroundDetail{background:
 radial-gradient(ellipse at 15% 28%,#665936 0 3px,transparent 4px),
 radial-gradient(ellipse at 74% 67%,#385739 0 3px,transparent 4px),
 linear-gradient(135deg,#1f472d,#173b29)}
.tile.lqForestTreeDetail{background:radial-gradient(circle at 50% 38%,#4f9146 0 22%,#326f39 24% 44%,#235430 46% 70%,#183d27 72%);filter:drop-shadow(0 5px 4px #0b2118aa)}
.lqCanopyShadow{position:absolute;z-index:2;border-radius:50%;background:radial-gradient(ellipse,#071b1388 0 45%,transparent 72%);filter:blur(4px);pointer-events:none}
.lqLightShaft{position:absolute;z-index:4;width:78px;height:170px;background:linear-gradient(160deg,#fff0ad00 0,#fff0ad22 25%,#fff0ad45 58%,#fff0ad00 100%);clip-path:polygon(35% 0,65% 0,100% 100%,0 100%);filter:blur(2px);pointer-events:none}
.lqFallenLog{position:absolute;z-index:4;width:112px;height:25px;border-radius:14px;background:linear-gradient(#76502f,#4b321f);border:3px solid #9c7146;box-shadow:0 6px 9px #0008;transform:rotate(-7deg);pointer-events:none}
.lqFallenLog:after{content:"";position:absolute;right:-8px;top:2px;width:24px;height:17px;border-radius:50%;background:radial-gradient(circle,#8c6b47 0 18%,#5f452d 21% 45%,#aa7e51 49% 55%,#5b4028 60%);border:2px solid #b98b5b}
.lqMushrooms{position:absolute;z-index:5;width:52px;height:28px;background:
 radial-gradient(ellipse at 18% 48%,#df7668 0 7px,transparent 8px),
 radial-gradient(ellipse at 52% 31%,#edd17d 0 6px,transparent 7px),
 radial-gradient(ellipse at 81% 58%,#aa83df 0 7px,transparent 8px);filter:drop-shadow(0 3px 2px #0006);pointer-events:none}
.lqLeafPatch{position:absolute;z-index:3;width:72px;height:32px;background:
 radial-gradient(ellipse at 10% 30%,#b07838 0 5px,transparent 6px),
 radial-gradient(ellipse at 32% 62%,#8f5d30 0 5px,transparent 6px),
 radial-gradient(ellipse at 56% 34%,#c49748 0 5px,transparent 6px),
 radial-gradient(ellipse at 82% 66%,#77512e 0 5px,transparent 6px);opacity:.8;pointer-events:none}
.lqForestTrailMark{position:absolute;z-index:6;width:15px;height:44px;background:#5b4127;border-radius:4px;box-shadow:0 4px 7px #0008;pointer-events:none}
.lqForestTrailMark:before{content:"足跡 →";position:absolute;left:-22px;top:-15px;background:#65472c;border:2px solid #ba8951;color:#f4e1ac;border-radius:5px;padding:3px 6px;font-size:9px;font-weight:900;white-space:nowrap}
`;
document.head.appendChild(style);

function fd(cls,x,y,w,h){const n=document.createElement('div');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;if(w)n.style.width=`${w}px`;if(h)n.style.height=`${h}px`;return n;}
function decorateForestAtmosphere(){
  if(s.screen!=='world'||!['forest','deepForest'].includes(s.map))return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqForestAtmosphereMarker'))return;
  const marker=document.createElement('i');marker.className='lqForestAtmosphereMarker';marker.hidden=true;w.appendChild(marker);

  const deep=s.map==='deepForest';
  const shadows=deep?[[2,2,180,100],[12,3,220,120],[4,12,200,110],[15,14,240,120]]:[[2,2,180,100],[12,2,200,110],[5,11,220,120],[15,12,190,100]];
  for(const [x,y,ww,hh] of shadows)w.appendChild(fd('lqCanopyShadow',x,y,ww,hh));
  const shafts=deep?[[7,4],[18,9]]:[[8,3],[17,9]];
  for(const [x,y] of shafts)w.appendChild(fd('lqLightShaft',x,y));
  const logs=deep?[[4,9],[17,16]]:[[5,6],[15,14]];
  for(const [x,y] of logs)w.appendChild(fd('lqFallenLog',x,y));
  const mush=deep?[[8,7],[20,5],[13,17]]:[[4,12],[17,5],[19,15]];
  for(const [x,y] of mush)w.appendChild(fd('lqMushrooms',x,y));
  const leaves=deep?[[3,5],[14,8],[8,15],[19,18]]:[[3,4],[13,7],[8,14],[18,16]];
  for(const [x,y] of leaves)w.appendChild(fd('lqLeafPatch',x,y));
  if(!deep)w.appendChild(fd('lqForestTrailMark',10.7,16.6));
}

const worldV19=world;
world=function(){worldV19();decorateForestAtmosphere();};
const renderV19=render;
render=function(){const r=renderV19();if(s.screen==='world')decorateForestAtmosphere();return r;};

window.LQ_FOREST_VISUAL_DENSITY={canopyShadows:4,lightShafts:2,fallenLogs:2,mushroomClusters:3,leafPatches:4};
if(s.screen==='world')render();
})();
