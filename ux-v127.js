(() => {
'use strict';

/* LUKE QUEST v0.127 hidden forest treasure.
   Adds a second persistent exploration reward off the main forest route. */
s.flags=s.flags||{};s.flags.forestChestOpened??=false;
const FOREST_CHEST={x:6,y:2,e:'',name:'苔むした探索者の宝箱',kind:'lqForestChest',text:''};
if(MAPS.forest&&!MAPS.forest.npcs.some(n=>n.kind===FOREST_CHEST.kind))MAPS.forest.npcs.push({...FOREST_CHEST});
const visibleNpcsV126=visibleNpcs;visibleNpcs=function(m){return visibleNpcsV126(m).filter(n=>!(n.kind==='lqForestChest'&&s.flags.forestChestOpened));};
const npcClassV126=npcClass;npcClass=function(n){const base=npcClassV126(n);return n?.kind==='lqForestChest'?`${base} lqTreasureChest lqForestTreasure`:base;};
function forestChestAhead(){if(s.screen!=='world'||s.map!=='forest'||s.dialog)return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqForestChest');}
function openForestChest(){stopMoving();if(s.flags.forestChestOpened)return;s.flags.forestChestOpened=true;s.gold+=24;s.potions+=1;save();s.dialog={name:'苔むした探索者の宝箱',text:'古い留め金を外した。\n24G と 薬草1個を手に入れた！\nルーク「森の奥に宝箱を置いた人、回収する予定だったんでしょうか。……ごめんなさい。」'};render();}
const actionV126=action;action=function(){if(forestChestAhead())return openForestChest();return actionV126();};
const style=document.createElement('style');style.textContent=`.npc.lqForestTreasure:before{filter:saturate(.8) brightness(.86)}.npc.lqForestTreasure:after{filter:saturate(.75) brightness(.88)}.npc.lqForestTreasure{box-shadow:0 -2px 0 -1px #5d7d3d,5px -1px 0 -2px #77954d}`;document.head.appendChild(style);
window.LQ_TREASURE_STATUS=Object.assign({},window.LQ_TREASURE_STATUS,{forestChest:{rewardGold:24,rewardPotions:1,flag:'forestChestOpened'}});
if(s.screen==='world'&&s.map==='forest')render();
})();