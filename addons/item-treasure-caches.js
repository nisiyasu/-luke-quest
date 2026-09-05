(() => {
'use strict';

/* Collision-safe add-on: persistent item-bearing exploration caches. */
const CACHES=[
 {id:'deepHerbs',map:'deepForest',x:18,y:19,flag:'lqItemCacheDeepHerbs',name:'森奥の薬草束',reward:{type:'herb',count:2,label:'薬草×2'}},
 {id:'mistSmoke',map:'mistTrail',x:10,y:21,flag:'lqItemCacheMistSmoke',name:'退避用ポーチ',reward:{type:'smoke',count:1,label:'煙玉×1'}},
 {id:'observationGold',map:'observation',x:25,y:20,flag:'lqItemCacheObservationGold',name:'隠し補給箱',reward:{type:'gold',count:45,label:'45G'}}
];
s.flags=s.flags||{};

const style=document.createElement('style');style.textContent=`
.lqItemCache{position:absolute;width:32px;height:28px;z-index:6;pointer-events:none;filter:drop-shadow(0 5px 3px #0009)}
.lqItemCache .pack{position:absolute;left:3px;right:3px;bottom:2px;height:20px;border:2px solid #263426;border-radius:5px;background:linear-gradient(135deg,#496447,#758761 48%,#3f5842);box-shadow:inset 0 -4px #304434,inset 0 2px #9aac82}
.lqItemCache .strap{position:absolute;left:13px;top:2px;width:6px;height:24px;border-radius:3px;background:linear-gradient(#d3bb70,#8b7139);box-shadow:0 0 0 1px #4e3d20}
.lqItemCache .flap{position:absolute;left:5px;right:5px;top:3px;height:10px;border:2px solid #273628;border-radius:6px 6px 3px 3px;background:#607551;transform-origin:50% 100%;transition:transform .16s ease,top .16s ease}
.lqItemCache.open .flap{top:-3px;transform:rotateX(60deg);filter:brightness(.75)}
.lqItemCache.open .pack{filter:saturate(.45) brightness(.72)}
.lqItemCache.open:after{content:'';position:absolute;left:7px;right:7px;top:9px;height:5px;background:#11170f;border-radius:50%;opacity:.8}
`;document.head.appendChild(style);

function listHere(){return CACHES.filter(c=>c.map===s.map);}
function isOpen(c){return !!s.flags?.[c.flag];}
function cacheAt(x,y){return listHere().find(c=>c.x===x&&c.y===y)||null;}
function cacheAhead(){if(s.screen!=='world')return null;const p=front();return cacheAt(p.x,p.y);}
function renderCaches(){
 const worldEl=app.querySelector('.world');if(!worldEl)return;
 worldEl.querySelectorAll('.lqItemCache').forEach(n=>n.remove());
 if(s.screen!=='world')return;
 for(const c of listHere()){
  const el=document.createElement('div');el.className=`lqItemCache${isOpen(c)?' open':''}`;el.dataset.cache=c.id;el.dataset.open=isOpen(c)?'true':'false';el.style.left=`${c.x*TS+8}px`;el.style.top=`${c.y*TS+11}px`;el.innerHTML='<span class=pack></span><span class=strap></span><span class=flap></span>';worldEl.appendChild(el);
 }
}
function grantReward(c){
 const r=c.reward;
 if(r.type==='herb')s.potions=(Number(s.potions)||0)+r.count;
 else if(r.type==='smoke')s.smokeBombs=(Number(s.smokeBombs)||0)+r.count;
 else if(r.type==='gold')s.gold=(Number(s.gold)||0)+r.count;
 else return false;
 return true;
}
function openCache(c){
 stopMoving();
 if(isOpen(c)){
  s.dialog={name:c.name,text:'中は空っぽだ。\nルーク「補給品は補給したら、さすがに増えませんよね。」'};render();return true;
 }
 if(!grantReward(c))return false;
 s.flags[c.flag]=true;save();window.LQ_sfx?.('item');
 s.dialog={name:c.name,text:`補給キャッシュを開けた！ ${c.reward.label}を手に入れた。\nルーク「宝箱に実用品。こういう現実的な優しさ、好きです。」`};render();return true;
}
const actionCacheBase=action;action=function(){if(!s.dialog){const c=cacheAhead();if(c)return openCache(c);}return actionCacheBase();};
const moveCacheBase=move;move=function(d){
 if(s.screen==='world'){
  const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d];
  if(delta&&cacheAt(s.x+delta[0],s.y+delta[1])){stopMoving();return;}
 }
 return moveCacheBase(d);
};
const worldCacheBase=world;world=function(){const r=worldCacheBase();renderCaches();return r;};
const renderCacheBase=render;render=function(){const r=renderCacheBase();queueMicrotask(renderCaches);return r;};
window.LQ_ITEM_TREASURE_CACHE_STATUS={stage:'persistent-item-treasure-caches',count:CACHES.length,maps:CACHES.map(c=>c.map),ids:CACHES.map(c=>c.id),flags:CACHES.map(c=>c.flag),rewardTypes:CACHES.map(c=>c.reward.type),oneTimeRewards:true,collision:true,touchPassthrough:true,usesCanonicalInventory:true};
renderCaches();
})();
