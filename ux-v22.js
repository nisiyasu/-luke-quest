(() => {
'use strict';

/* LUKE QUEST v0.22 treasure presentation upgrade.
   Replaces the field chest emoji with an original CSS-drawn wooden/gold chest while preserving v0.15 rewards/state. */

const npcClassV21=npcClass;
npcClass=function(n){
  if(n?.kind==='lqFieldChest')return'npc lqTreasureChestNpc';
  return npcClassV21(n);
};

const chest=MAPS.field?.npcs?.find(n=>n.kind==='lqFieldChest');
if(chest)chest.e='';

const style=document.createElement('style');
style.textContent=`
.lqTreasureChestNpc{width:46px;height:42px;font-size:0;overflow:visible;filter:drop-shadow(0 7px 4px #0007)}
.lqTreasureChestNpc:before{content:"";position:absolute;left:3px;bottom:3px;width:40px;height:24px;border-radius:5px 5px 7px 7px;background:linear-gradient(90deg,#6e3e20 0 12%,#9b5c2b 13% 44%,#b26b31 45% 55%,#8b4f26 56% 87%,#62371d 88%);border:3px solid #d4a43e;box-shadow:inset 0 -7px #4a281777,inset 0 4px #e0994933}
.lqTreasureChestNpc:after{content:"";position:absolute;left:3px;top:2px;width:40px;height:21px;border-radius:19px 19px 5px 5px;background:linear-gradient(180deg,#a86631,#6f3d20);border:3px solid #d4a43e;box-shadow:inset 0 5px #e69a4a44;transform-origin:50% 100%;animation:lqChestIdle 1.7s ease-in-out infinite alternate}
.lqTreasureChestNpc{background:linear-gradient(#f2c759,#c28d24);background-size:8px 11px;background-repeat:no-repeat;background-position:19px 22px;border-radius:3px;z-index:7}
@keyframes lqChestIdle{from{transform:translateY(0)}to{transform:translateY(-2px)}}
.lqTreasureChestNpc .lqChestHint{display:none}
.lqTreasureChestNpc:hover{filter:drop-shadow(0 7px 4px #0007) brightness(1.08)}
`;
document.head.appendChild(style);

const worldV21=world;
world=function(){
  worldV21();
  if(s.screen==='world'&&s.map==='field'&&!s.flags?.fieldChestOpened){
    const m=MAPS.field;
    const npcs=Array.from(app.querySelectorAll('.npc'));
    const target=npcs.find(el=>Math.abs(parseFloat(el.style.left)-(16*TS+5))<1&&Math.abs(parseFloat(el.style.top)-(13*TS+3))<1);
    if(target)target.classList.add('lqTreasureChestNpc');
  }
};

window.LQ_TREASURE_VISUAL_STATUS={fieldChest:'original CSS wooden-gold chest',emojiPlaceholder:false};
if(s.screen==='world')render();
})();
