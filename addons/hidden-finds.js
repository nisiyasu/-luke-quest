(() => {
'use strict';

/* Collision-safe add-on: subtle one-time hidden finds for exploration. */
const FINDS=[
 {id:'townFountainCoin',map:'town',x:7,y:10,flag:'lqFindTownFountainCoin',name:'噴水脇の落とし物',gold:5},
 {id:'fieldGrassCoin',map:'field',x:4,y:14,flag:'lqFindFieldGrassCoin',name:'草むらの古銭',gold:8},
 {id:'deepRootCoin',map:'deepForest',x:20,y:17,flag:'lqFindDeepRootCoin',name:'根元の光る小銭',gold:11}
];
s.flags=s.flags||{};
const style=document.createElement('style');style.textContent=`
.lqHiddenFind{position:absolute;width:22px;height:22px;z-index:5;pointer-events:none;opacity:.72;filter:drop-shadow(0 0 4px #e7e6ad)}
.lqHiddenFind:before,.lqHiddenFind:after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff6b0;border-radius:99px;box-shadow:0 0 5px #f7df73}
.lqHiddenFind:before{width:3px;height:13px}.lqHiddenFind:after{width:13px;height:3px}.lqHiddenFind .dot{position:absolute;left:9px;top:9px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 7px #fff7a8}
@keyframes lqHiddenFindPulse{0%,100%{opacity:.32;transform:scale(.75) rotate(0)}50%{opacity:1;transform:scale(1.05) rotate(45deg)}}
.lqHiddenFind{animation:lqHiddenFindPulse 1.45s ease-in-out infinite}
@media(prefers-reduced-motion:reduce){.lqHiddenFind{animation:none;opacity:.8}}
`;document.head.appendChild(style);

function currentFinds(){return FINDS.filter(f=>f.map===s.map&&!s.flags?.[f.flag]);}
function findAt(x,y){return currentFinds().find(f=>f.x===x&&f.y===y)||null;}
function findAhead(){if(s.screen!=='world')return null;const p=front();return findAt(p.x,p.y);}
function renderFinds(){
 const worldEl=app.querySelector('.world');if(!worldEl)return;
 worldEl.querySelectorAll('.lqHiddenFind').forEach(n=>n.remove());
 if(s.screen!=='world')return;
 for(const f of currentFinds()){
  const el=document.createElement('div');el.className='lqHiddenFind';el.dataset.find=f.id;el.style.left=`${f.x*TS+13}px`;el.style.top=`${f.y*TS+13}px`;el.innerHTML='<span class=dot></span>';worldEl.appendChild(el);
 }
}
function collectFind(f){
 stopMoving();
 if(s.flags?.[f.flag])return false;
 s.flags[f.flag]=true;s.gold=(Number(s.gold)||0)+f.gold;save();window.LQ_sfx?.('item');
 s.dialog={name:f.name,text:`小さな光を調べた。 ${f.gold}Gを見つけた。\nルーク「こういうの、見逃したら地味に悔しいやつです。」`};render();return true;
}
const actionFindBase=action;action=function(){if(!s.dialog){const f=findAhead();if(f)return collectFind(f);}return actionFindBase();};
const worldFindBase=world;world=function(){const r=worldFindBase();renderFinds();return r;};
const renderFindBase=render;render=function(){const r=renderFindBase();queueMicrotask(renderFinds);return r;};
window.LQ_HIDDEN_FIND_STATUS={stage:'subtle-persistent-sparkle-finds',count:FINDS.length,maps:[...new Set(FINDS.map(f=>f.map))],ids:FINDS.map(f=>f.id),flags:FINDS.map(f=>f.flag),oneTimeRewards:true,touchPassthrough:true};
renderFinds();
})();
