(() => {
'use strict';

/* LUKE QUEST v0.66 treasure pickup presentation.
   Adds a short console-style reward card when a persistent chest is opened. */

const CHEST_FLAGS={fieldChestOpened:{gold:18,potions:1},forestCacheOpened:{gold:24,potions:1},deepCacheOpened:{gold:38,potions:1}};
let pendingTreasureToast=null;

const style=document.createElement('style');
style.textContent=`
.lqTreasureToast{position:absolute;z-index:58;left:50%;top:72px;transform:translateX(-50%);width:min(310px,84%);padding:9px 11px;border-radius:11px;background:linear-gradient(180deg,#263b31f5,#10231bf5);border:1px solid #d9c16b88;box-shadow:0 9px 25px #000b,inset 0 0 22px #d3bd5a12;pointer-events:none;animation:lqTreasureToast 1.55s ease both}.lqTreasureToast small{display:block;color:#a4b6ab;font-size:7px;letter-spacing:.16em}.lqTreasureToast b{display:block;color:#ffecad;font-size:13px;margin-top:2px}.lqTreasureToast span{display:block;color:#bcd5c2;font-size:9px;margin-top:3px}@keyframes lqTreasureToast{0%{opacity:0;transform:translate(-50%,-9px) scale(.95)}14%,78%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-5px) scale(.99)}}
`;
document.head.appendChild(style);

function showTreasureToast(){
 if(!pendingTreasureToast||s.screen!=='world')return;
 const shell=app.querySelector('.gameShell');if(!shell)return;
 const old=shell.querySelector('.lqTreasureToast');if(old)old.remove();
 const t=pendingTreasureToast;pendingTreasureToast=null;
 const el=document.createElement('div');el.className='lqTreasureToast';el.innerHTML=`<small>TREASURE GET</small><b>${t.gold}G　＋　薬草 ${t.potions}</b><span>探索報酬を獲得</span>`;shell.appendChild(el);setTimeout(()=>el.remove(),1600);
}

const actionV65=action;
action=function(){
 const before=Object.fromEntries(Object.keys(CHEST_FLAGS).map(k=>[k,!!s.flags?.[k]]));
 const r=actionV65();
 for(const [flag,reward] of Object.entries(CHEST_FLAGS))if(!before[flag]&&s.flags?.[flag]){pendingTreasureToast=reward;break;}
 requestAnimationFrame(showTreasureToast);return r;
};
const worldV65=world;world=function(){worldV65();showTreasureToast();};
const renderV65=render;render=function(){const r=renderV65();showTreasureToast();return r;};
window.LQ_TREASURE_PRESENTATION_STATUS={pickupToast:true};
})();
