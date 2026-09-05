(() => {
'use strict';

/* Collision-safe add-on: persistent one-time treasure chests with original CSS-drawn world art. */
const CHESTS=[
 {id:'townSupply',map:'town',x:15,y:5,flag:'lqChestTownSupply',name:'路地の補給箱',gold:12},
 {id:'fieldTraveler',map:'field',x:18,y:10,flag:'lqChestFieldTraveler',name:'古い旅人箱',gold:18},
 {id:'forestMoss',map:'forest',x:20,y:15,flag:'lqChestForestMoss',name:'苔むした探索箱',gold:25}
];

s.flags=s.flags||{};
const style=document.createElement('style');style.textContent=`
.lqTreasureChest{position:absolute;width:34px;height:30px;z-index:6;pointer-events:none;filter:drop-shadow(0 5px 3px #0009)}
.lqTreasureChest .body{position:absolute;left:3px;right:3px;bottom:1px;height:18px;border:2px solid #3d2412;border-radius:3px 3px 6px 6px;background:linear-gradient(90deg,#7d481e,#b06c2c 46%,#8a4d1f);box-shadow:inset 0 -4px #5b3218,inset 0 2px #d69342}
.lqTreasureChest .lid{position:absolute;left:2px;right:2px;top:1px;height:12px;border:2px solid #3d2412;border-radius:8px 8px 2px 2px;background:linear-gradient(#c27a31,#7d471d);transform-origin:50% 100%;transition:transform .18s ease,top .18s ease}
.lqTreasureChest .band{position:absolute;left:14px;top:2px;width:6px;height:26px;background:linear-gradient(90deg,#9a7b3a,#f0ca62,#927337);border-left:1px solid #5d481f;border-right:1px solid #5d481f}
.lqTreasureChest .lock{position:absolute;left:12px;top:13px;width:10px;height:8px;border-radius:2px;background:#e2b84e;border:2px solid #6c531d}
.lqTreasureChest.open .lid{top:-5px;transform:rotateX(58deg) skewX(-8deg);filter:brightness(.8)}
.lqTreasureChest.open .body{filter:saturate(.55) brightness(.78)}
.lqTreasureChest.open .lock{opacity:.35}
.lqTreasureChest.open:after{content:'';position:absolute;left:6px;right:6px;top:10px;height:5px;background:#120d08;border-radius:50%;opacity:.75}
`;document.head.appendChild(style);

function currentChestList(){return CHESTS.filter(c=>c.map===s.map);}
function isOpen(c){return !!s.flags?.[c.flag];}
function chestAt(x,y){return currentChestList().find(c=>c.x===x&&c.y===y)||null;}
function chestAhead(){if(s.screen!=='world')return null;const p=front();return chestAt(p.x,p.y);}
function renderChests(){
 const worldEl=app.querySelector('.world');if(!worldEl)return;
 worldEl.querySelectorAll('.lqTreasureChest').forEach(n=>n.remove());
 if(s.screen!=='world')return;
 for(const c of currentChestList()){
  const el=document.createElement('div');el.className=`lqTreasureChest${isOpen(c)?' open':''}`;el.dataset.chest=c.id;el.dataset.open=isOpen(c)?'true':'false';el.style.left=`${c.x*TS+7}px`;el.style.top=`${c.y*TS+10}px`;el.innerHTML='<span class=body></span><span class=lid></span><span class=band></span><span class=lock></span>';worldEl.appendChild(el);
 }
}
function openChest(c){
 stopMoving();
 if(isOpen(c)){
  s.dialog={name:c.name,text:'中は空っぽだ。\nルーク「二回目も出たら、それはそれで怖いです。」'};
  render();return true;
 }
 s.flags[c.flag]=true;s.gold=(Number(s.gold)||0)+c.gold;save();window.LQ_sfx?.('item');
 s.dialog={name:c.name,text:`宝箱を開けた！ ${c.gold}Gを手に入れた。\nルーク「探索、ちゃんと得するんですね。」`};render();return true;
}

const actionChestBase=action;action=function(){if(!s.dialog){const c=chestAhead();if(c)return openChest(c);}return actionChestBase();};
const moveChestBase=move;move=function(d){
 if(s.screen==='world'){
  const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d];
  if(delta&&chestAt(s.x+delta[0],s.y+delta[1])){stopMoving();return;}
 }
 return moveChestBase(d);
};
const worldChestBase=world;world=function(){const r=worldChestBase();renderChests();return r;};
const renderChestBase=render;render=function(){const r=renderChestBase();queueMicrotask(renderChests);return r;};
window.LQ_TREASURE_CHEST_STATUS={stage:'persistent-original-css-chests',count:CHESTS.length,maps:[...new Set(CHESTS.map(c=>c.map))],ids:CHESTS.map(c=>c.id),oneTimeRewards:true,saveFlags:CHESTS.map(c=>c.flag),collision:true};
renderChests();
})();
