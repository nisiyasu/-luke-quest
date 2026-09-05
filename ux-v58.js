(() => {
'use strict';

/* LUKE QUEST v0.58 live objective compass.
   Adds a compact direction cue toward the current main-route target on large outdoor maps. */

const TARGETS={
 town:()=>({x:9,y:14,label:'南門'}),
 field:()=>({x:20,y:0,label:s.wins<2?'草原で2勝':'魔物の森'}),
 forest:()=>({x:11,y:0,label:'森の深部'}),
 deepForest:()=>s.flags?.leonSeen?({x:12,y:0,label:'北の霧'}):({x:13,y:5,label:'レオン'}),
 mistTrail:()=>s.flags?.glennTraceSeen?({x:13,y:0,label:'監視区域'}):({x:13,y:4,label:'魔王軍の痕跡'}),
 observation:()=>s.flags?.glennSeen?({x:15,y:0,label:'北の封鎖線'}):({x:15,y:5,label:'グレン'}),
 evacRoute:()=>({x:14,y:0,label:s.flags?.withdrawProofSeen?'北の崖道':'退避路の痕跡'})
};

const style=document.createElement('style');
style.textContent=`
.lqObjectiveCompass{position:absolute;z-index:23;left:50%;top:45px;transform:translateX(-50%);display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:10px;background:#07111fdc;border:1px solid #e1c45e55;box-shadow:0 4px 12px #0008;pointer-events:none;max-width:68%;white-space:nowrap}.lqCompassArrow{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:#66562a;color:#ffe69a;border:1px solid #d7bd6866;font-size:14px;font-weight:1000}.lqCompassCopy{overflow:hidden}.lqCompassCopy small{display:block;color:#778ea2;font-size:7px;letter-spacing:.13em}.lqCompassCopy b{display:block;color:#eef3f6;font-size:9px;overflow:hidden;text-overflow:ellipsis}.lqObjectiveCompass.near{border-color:#8fd69b77}.lqObjectiveCompass.near .lqCompassArrow{background:#285638;color:#baf0c3}@media(max-width:390px){.lqObjectiveCompass{top:43px;padding:4px 7px;max-width:62%}.lqCompassCopy b{font-size:8px}}
`;
document.head.appendChild(style);

function arrowFor(dx,dy){
 const ax=Math.abs(dx),ay=Math.abs(dy);
 if(ax<=1&&ay<=1)return'◆';
 if(ax>ay*1.7)return dx>0?'→':'←';
 if(ay>ax*1.7)return dy>0?'↓':'↑';
 if(dx>0&&dy>0)return'↘';if(dx>0&&dy<0)return'↗';if(dx<0&&dy>0)return'↙';return'↖';
}
function addObjectiveCompass(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const factory=TARGETS[s.map];if(!factory)return;
 const t=factory();if(!t)return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqObjectiveCompass'))return;
 const dx=t.x-s.x,dy=t.y-s.y,dist=Math.abs(dx)+Math.abs(dy);
 const box=document.createElement('div');box.className=`lqObjectiveCompass${dist<=3?' near':''}`;
 box.innerHTML=`<span class=lqCompassArrow>${arrowFor(dx,dy)}</span><span class=lqCompassCopy><small>NEXT</small><b>${t.label}</b></span>`;
 shell.appendChild(box);
}

const worldV57=world;world=function(){worldV57();addObjectiveCompass();};
const renderV57=render;render=function(){const r=renderV57();if(s.screen==='world')addObjectiveCompass();return r;};
window.LQ_GUIDANCE_STATUS=Object.assign({},window.LQ_GUIDANCE_STATUS,{liveObjectiveCompass:true});
if(s.screen==='world')addObjectiveCompass();
})();
