(() => {
'use strict';

/* LUKE QUEST v0.15 first treasure-chest patch.
   Adds one persistent field treasure without changing map collision geometry. */

s.flags=s.flags||{};
s.flags.fieldChestOpened ??= false;

if(MAPS.field&&!MAPS.field.npcs.some(n=>n.kind==='lqFieldChest')){
  MAPS.field.npcs.push({x:16,y:13,e:'🎁',name:'古びた旅人の宝箱',kind:'lqFieldChest',text:''});
}

const visibleNpcsV14=visibleNpcs;
visibleNpcs=function(m){
  return visibleNpcsV14(m).filter(n=>!(n.kind==='lqFieldChest'&&s.flags.fieldChestOpened));
};

function fieldChestAhead(){
  if(s.screen!=='world'||s.map!=='field')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqFieldChest')||null;
}

function openFieldChest(){
  stopMoving();
  if(s.flags.fieldChestOpened)return;
  s.flags.fieldChestOpened=true;
  s.gold+=18;
  s.potions+=1;
  s.dialog={name:'古びた旅人の宝箱',text:`宝箱を開けた！\n18G と 薬草1個を手に入れた。\nルーク「誰のか分からない宝箱を開けるの、勇者業界では合法なんでしょうか……？」`};
  render();
}

const actionV14=action;
action=function(){
  if(!s.dialog&&fieldChestAhead())return openFieldChest();
  return actionV14();
};

window.LQ_TREASURE_STATUS={fieldChest:{rewardGold:18,rewardPotions:1,flag:'fieldChestOpened'}};

if(s.screen==='world'&&s.map==='field')render();

})();
