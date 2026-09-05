(() => {
'use strict';

/* LUKE QUEST v0.132 four-direction interim Leon/Glenn field sprites.
   Adds visibly distinct front/back/left/right CSS field representations and facing-player behavior.
   These are explicitly INTERIM, not formal approved character art. */
const MAJOR={'レオン':'leon','グレン隊長':'glenn'};
for(const map of Object.values(MAPS))for(const n of map.npcs||[])if(MAJOR[n.name])n.e='';
const npcClassV131=npcClass;npcClass=function(n){const key=MAJOR[n?.name];return key?`npc lqMajorFieldNpc lq${key==='leon'?'Leon':'Glenn'}Field`:npcClassV131(n);};
const style=document.createElement('style');style.textContent=`
.lqMajorFieldNpc{width:42px;height:48px;font-size:0!important;overflow:visible;filter:drop-shadow(0 5px 3px #0009);transition:transform .12s ease}.lqMajorFieldNpc:before,.lqMajorFieldNpc:after{content:"";position:absolute;display:block}.lqMajorFieldNpc:before{left:10px;top:3px;width:22px;height:21px;border-radius:48% 48% 44% 44%;z-index:2}.lqMajorFieldNpc:after{left:6px;top:21px;width:30px;height:27px;border-radius:8px 8px 5px 5px;z-index:1}
.lqLeonField:before{background:linear-gradient(#f2e4b5 0 34%,#dfb584 35%);border:2px solid #9a7d50;box-shadow:inset 0 -3px #c9956d}.lqLeonField:after{background:linear-gradient(#eef2f5 0 28%,#5179a7 29% 66%,#2f4c72 67%);border:2px solid #b8c8d7;box-shadow:inset 0 -7px #213a5c}.lqLeonField{background:linear-gradient(#d7b85a,#785a23);background-size:5px 26px;background-repeat:no-repeat;background-position:33px 19px}
.lqGlennField:before{background:linear-gradient(#20252c 0 34%,#b48b75 35%);border:2px solid #14181d;box-shadow:inset 0 -3px #8d6555}.lqGlennField:after{background:linear-gradient(#4a3c51,#272432 64%,#191923);border:2px solid #75617c;box-shadow:inset 0 -7px #13131b}.lqGlennField{background:linear-gradient(#8e788b,#413646);background-size:5px 29px;background-repeat:no-repeat;background-position:4px 17px}
.lqMajorFieldNpc.face-up:before{background-position:center;filter:brightness(.72)}.lqMajorFieldNpc.face-up:after{border-top-width:4px;box-shadow:inset 0 -7px #1115,inset 0 5px #ffffff12}.lqMajorFieldNpc.face-left{transform:scaleX(.94) translateX(-1px)}.lqMajorFieldNpc.face-left:before{border-radius:58% 40% 48% 42%;transform:translateX(-3px)}.lqMajorFieldNpc.face-left:after{transform:skewY(2deg) translateX(-2px)}.lqMajorFieldNpc.face-right{transform:scaleX(.94) translateX(1px)}.lqMajorFieldNpc.face-right:before{border-radius:40% 58% 42% 48%;transform:translateX(3px)}.lqMajorFieldNpc.face-right:after{transform:skewY(-2deg) translateX(2px)}
.lqMajorFieldNpc.face-down:before{box-shadow:inset 0 -3px #c9956d,5px 10px 0 -8px #19212a,-5px 10px 0 -8px #19212a}.lqGlennField.face-down:before{box-shadow:inset 0 -3px #8d6555,5px 10px 0 -8px #101419,-5px 10px 0 -8px #101419}
`;
document.head.appendChild(style);
function faceFrom(n){const dx=s.x-n.x,dy=s.y-n.y;if(Math.abs(dx)>Math.abs(dy))return dx<0?'left':'right';return dy<0?'up':'down';}
function orientMajor(){
 if(s.screen!=='world')return;const majors=currentNpcs().filter(n=>MAJOR[n.name]);if(!majors.length)return;const els=[...app.querySelectorAll('.lqMajorFieldNpc')];for(const n of majors){let best=null,dist=1e9;for(const el of els){const x=parseFloat(el.style.left),y=parseFloat(el.style.top),d=Math.abs(x-(n.x*TS+5))+Math.abs(y-(n.y*TS+3));if(d<dist){dist=d;best=el;}}if(!best)continue;best.classList.remove('face-up','face-down','face-left','face-right');best.classList.add(`face-${faceFrom(n)}`);}}
const renderV131=render;render=function(){const r=renderV131();orientMajor();return r;};queueMicrotask(orientMajor);
window.LQ_MAJOR_FIELD_DIRECTION_STATUS={leon:{directions:4,art:'INTERIM_CSS'},glenn:{directions:4,art:'INTERIM_CSS'},formalArtIntegrated:false};
})();