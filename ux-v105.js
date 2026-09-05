(() => {
'use strict';

/* LUKE QUEST v0.105 terrain-aware footstep feedback.
   Gives movement a small console-RPG surface response without changing movement logic. */

const style=document.createElement('style');
style.textContent=`
.lqStepFx{position:absolute;z-index:15;width:18px;height:8px;pointer-events:none;transform:translate(-50%,-50%);animation:lqStepFade .55s ease-out forwards}
.lqStepFx:before,.lqStepFx:after{content:"";position:absolute;bottom:0;width:5px;height:3px;border-radius:50%;background:#d9cfaa99;box-shadow:0 0 3px #0005}
.lqStepFx:before{left:2px;transform:rotate(-18deg)}.lqStepFx:after{right:2px;transform:rotate(18deg)}
.lqStepFx.leaf:before,.lqStepFx.leaf:after{width:6px;height:4px;border-radius:70% 20%;background:#b8743f;box-shadow:none}.lqStepFx.mist:before,.lqStepFx.mist:after{width:9px;height:3px;background:#c8eee75c;filter:blur(2px)}.lqStepFx.stone:before,.lqStepFx.stone:after{background:#b9b2a488}.lqStepFx.ash:before,.lqStepFx.ash:after{background:#aaa39a70}
@keyframes lqStepFade{0%{opacity:.72;transform:translate(-50%,-30%) scale(.7)}100%{opacity:0;transform:translate(-50%,-85%) scale(1.35)}}
@media (prefers-reduced-motion:reduce){.lqStepFx{animation-duration:.2s}}
`;
document.head.appendChild(style);

let prevMap=s.map,prevX=s.x,prevY=s.y,stepSide=0;
function terrainFx(){
 if(s.map==='forest'||s.map==='deepForest')return 'leaf';
 if(s.map==='mistTrail')return 'mist';
 if(s.map==='observation'||s.map==='evacRoute')return 'ash';
 if(s.map==='town'||/Interior|Temple|Shop|Inn/i.test(s.map||''))return 'stone';
 return 'dust';
}
function addStepFx(moved){
 if(!moved||s.screen!=='world')return;
 const shell=app.querySelector('.gameShell'),player=app.querySelector('.player');if(!shell||!player)return;
 const sr=shell.getBoundingClientRect(),pr=player.getBoundingClientRect();
 const fx=document.createElement('span');fx.className=`lqStepFx ${terrainFx()}`;
 stepSide^=1;fx.style.left=`${pr.left-sr.left+pr.width/2+(stepSide?5:-5)}px`;fx.style.top=`${pr.bottom-sr.top-3}px`;
 shell.appendChild(fx);setTimeout(()=>fx.remove(),650);
}
const renderV104=render;render=function(){
 const moved=s.screen==='world'&&s.map===prevMap&&(s.x!==prevX||s.y!==prevY);
 const r=renderV104();addStepFx(moved);prevMap=s.map;prevX=s.x;prevY=s.y;return r;
};
window.LQ_FOOTSTEP_STATUS={terrainAware:true,movementLogicUntouched:true};
})();