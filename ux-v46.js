(() => {
'use strict';

/* LUKE QUEST v0.46 exploration reward pass.
   Adds persistent optional treasure caches to forest regions so detours have tangible rewards. */

s.flags=s.flags||{};
s.flags.forestCacheOpened ??= false;
s.flags.deepCacheOpened ??= false;

const TREASURES=[
 {map:'forest',x:20,y:16,kind:'lqForestCache',name:'苔むした旅人箱',flag:'forestCacheOpened',gold:24,potions:1},
 {map:'deepForest',x:22,y:15,kind:'lqDeepCache',name:'古い探索隊の箱',flag:'deepCacheOpened',gold:38,potions:1}
];
for(const t of TREASURES){
 const list=MAPS[t.map]?.npcs;if(!list)continue;
 if(!list.some(n=>n.kind===t.kind))list.push({x:t.x,y:t.y,e:'',name:t.name,kind:t.kind,text:''});
}

const visibleNpcsV45=visibleNpcs;
visibleNpcs=function(m){
 return visibleNpcsV45(m).filter(n=>{
   const t=TREASURES.find(x=>x.kind===n.kind);
   return !t||!s.flags[t.flag];
 });
};

const npcClassV45=npcClass;
npcClass=function(n){
 if(n?.kind==='lqForestCache')return'npc lqTreasureChestNpc lqForestCache';
 if(n?.kind==='lqDeepCache')return'npc lqTreasureChestNpc lqDeepCache';
 return npcClassV45(n);
};

const style=document.createElement('style');
style.textContent=`
.lqForestCache:before{filter:hue-rotate(18deg) saturate(.82);box-shadow:inset 0 -7px #4a281777,inset 0 4px #e0994933,0 0 0 2px #42663766}.lqForestCache:after{filter:hue-rotate(12deg) saturate(.85)}
.lqDeepCache:before{filter:brightness(.76) saturate(.78);border-color:#b79557}.lqDeepCache:after{filter:brightness(.72) saturate(.72);border-color:#b79557}.lqDeepCache{filter:drop-shadow(0 7px 4px #0009) drop-shadow(0 0 5px #7a9a7280)}
`;
document.head.appendChild(style);

function treasureAhead(){
 if(s.screen!=='world')return null;
 const p=front();const n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);
 if(!n)return null;
 const t=TREASURES.find(x=>x.kind===n.kind);return t?{n,t}:null;
}
function openTreasure(entry){
 stopMoving();const {t}=entry;if(s.flags[t.flag])return;
 s.flags[t.flag]=true;s.gold+=t.gold;s.potions+=t.potions;
 const joke=t.map==='forest'?'ルーク「宝箱って、森で自然発生するものなんですかね……。」':'ルーク「誰かの探索資金だったら申し訳ない。生きて帰って返せるようにします。」';
 s.dialog={name:t.name,text:`箱を開けた！\n${t.gold}G と 薬草${t.potions}個を手に入れた。\n${joke}`};
 render();
}
const actionV45=action;
action=function(){if(!s.dialog){const entry=treasureAhead();if(entry)return openTreasure(entry);}return actionV45();};

window.LQ_TREASURE_STATUS=Object.assign({},window.LQ_TREASURE_STATUS,{
 forestCache:{flag:'forestCacheOpened',rewardGold:24,rewardPotions:1},
 deepCache:{flag:'deepCacheOpened',rewardGold:38,rewardPotions:1}
});
if(s.screen==='world')render();
})();
