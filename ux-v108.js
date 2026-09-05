(() => {
'use strict';

/* LUKE QUEST v0.108 route-edge navigation markers.
   Reinforces first-time route readability without changing gates or story logic. */

const ROUTES={
 town:{bottom:'王都近郊'},
 field:{top:'魔物の森',bottom:'王都アルディア'},
 forest:{top:'森の深部',bottom:'王都近郊'},
 deepForest:{top:'霧の追跡路',bottom:'森の入口'},
 mistTrail:{top:'魔王軍・監視区域',bottom:'森の深部'},
 observation:{top:'北の退避路',bottom:'霧の追跡路'},
 evacRoute:{top:'北の崖道',bottom:'監視区域'},
 cliffRoad:{bottom:'北の退避路'}
};
const style=document.createElement('style');
style.textContent=`
.lqRouteEdge{position:absolute;z-index:18;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;pointer-events:none;padding:5px 10px;border-radius:999px;background:#07111fbd;border:1px solid #e8d5773d;box-shadow:0 4px 14px #0008;color:#e9edf0;font-size:8px;font-weight:900;letter-spacing:.04em;backdrop-filter:blur(2px)}
.lqRouteEdge.top{top:45px}.lqRouteEdge.bottom{bottom:16px}.lqRouteEdge i{font-style:normal;color:#f4d96d;font-size:11px;animation:lqRoutePulse .9s ease-in-out infinite alternate}.lqRouteEdge small{color:#7f95a5;font-size:7px;letter-spacing:.12em}
@keyframes lqRoutePulse{to{transform:translateY(-2px);filter:brightness(1.25)}}.lqRouteEdge.bottom i{animation-name:lqRoutePulseDown}@keyframes lqRoutePulseDown{to{transform:translateY(2px);filter:brightness(1.25)}}
@media(max-height:700px){.lqRouteEdge.top{top:39px}.lqRouteEdge.bottom{bottom:10px}}@media(prefers-reduced-motion:reduce){.lqRouteEdge i{animation:none}}
`;
document.head.appendChild(style);
function addRouteEdges(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const shell=app.querySelector('.gameShell'),r=ROUTES[s.map];if(!shell||!r||shell.querySelector('.lqRouteEdge'))return;
 if(r.top){const e=document.createElement('div');e.className='lqRouteEdge top';e.innerHTML=`<i>▲</i><span>${r.top}</span><small>NEXT AREA</small>`;shell.appendChild(e);}
 if(r.bottom){const e=document.createElement('div');e.className='lqRouteEdge bottom';e.innerHTML=`<i>▼</i><span>${r.bottom}</span>`;shell.appendChild(e);}
}
const renderV107=render;render=function(){const r=renderV107();addRouteEdges();return r;};
queueMicrotask(addRouteEdges);
window.LQ_ROUTE_EDGE_STATUS={majorRoutes:true,logicUntouched:true};
})();