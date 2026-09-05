(() => {
'use strict';

/* LUKE QUEST v0.116 original exterior entrance markers.
   Replaces emoji entrance NPCs for the inn, shop and temple with distinct doorway/facade sprites. */

const npcClassV115=npcClass;npcClass=function(n){
 const base=npcClassV115(n);if(n?.kind==='lqInnDoor')return`${base} lqExteriorEntrance lqInnEntrance`;if(n?.kind==='lqShopDoor')return`${base} lqExteriorEntrance lqShopEntrance`;if(n?.kind==='lqTempleDoor')return`${base} lqExteriorEntrance lqTempleEntrance`;return base;
};
const style=document.createElement('style');
style.textContent=`
.npc.lqExteriorEntrance{font-size:0!important;width:44px;height:48px;filter:drop-shadow(0 6px 4px #0008)}.npc.lqExteriorEntrance:before,.npc.lqExteriorEntrance:after{content:"";position:absolute;display:block}
.lqInnEntrance:before{left:5px;top:4px;width:34px;height:42px;border-radius:15px 15px 2px 2px;background:linear-gradient(90deg,#56351f,#8c5c35 47%,#472b1a);border:3px solid #c09258;box-shadow:inset 0 0 0 2px #342015}.lqInnEntrance:after{left:11px;top:-3px;width:22px;height:10px;background:#d5a14d;clip-path:polygon(50% 0,100% 100%,0 100%);box-shadow:0 13px 0 -4px #e4c478}
.lqShopEntrance:before{left:5px;top:6px;width:34px;height:40px;border-radius:6px 6px 2px 2px;background:linear-gradient(90deg,#5c4932,#95784c 50%,#51402c);border:3px solid #c9a663;box-shadow:inset 0 0 0 2px #35291d}.lqShopEntrance:after{left:3px;top:1px;width:38px;height:9px;border-radius:3px;background:repeating-linear-gradient(90deg,#6e8e69 0 7px,#e0d19a 7px 14px);border:1px solid #d6c37f}
.lqTempleEntrance:before{left:7px;top:5px;width:30px;height:41px;border-radius:15px 15px 2px 2px;background:linear-gradient(90deg,#45525d,#778792 48%,#3d4852);border:3px solid #c0cdd3;box-shadow:inset 0 0 0 2px #29333b,0 0 10px #a9e8ff1f}.lqTempleEntrance:after{left:4px;top:-2px;width:36px;height:15px;background:linear-gradient(#c6d1d6,#73828c);clip-path:polygon(50% 0,100% 100%,70% 100%,50% 55%,30% 100%,0 100%);filter:drop-shadow(0 2px 2px #0007)}
`;
document.head.appendChild(style);
window.LQ_EXTERIOR_ENTRANCE_STATUS={inn:true,shop:true,temple:true,emojiPresentationRemoved:true};
if(s.screen==='world')render();
})();