(() => {
'use strict';

/* LUKE QUEST v0.119 original treasure chest sprite.
   Replaces the first field chest emoji with a purpose-built lightweight game sprite. */

const npcClassV118=npcClass;npcClass=function(n){const base=npcClassV118(n);return n?.kind==='lqFieldChest'?`${base} lqTreasureChest`:base;};
const style=document.createElement('style');
style.textContent=`
.npc.lqTreasureChest{font-size:0!important;width:44px;height:42px;filter:drop-shadow(0 6px 4px #0008);transform-origin:50% 100%;animation:lqChestIdle 1.8s ease-in-out infinite alternate}.npc.lqTreasureChest:before{content:"";position:absolute;left:3px;top:17px;width:38px;height:22px;border-radius:3px 3px 7px 7px;background:linear-gradient(#9a5b27,#663819 58%,#4b2915);border:3px solid #c18a43;box-shadow:inset 0 -5px #2f1b10,inset 0 4px #d69647}.npc.lqTreasureChest:after{content:"";position:absolute;left:5px;top:7px;width:34px;height:17px;border-radius:15px 15px 3px 3px;background:linear-gradient(#a9672c,#754119);border:3px solid #d09a4c;box-shadow:inset 0 -4px #492713,0 7px 0 -5px #e0b35b}.npc.lqTreasureChest{background:linear-gradient(#e4c66a,#9d742e);background-size:8px 11px;background-repeat:no-repeat;background-position:18px 25px;border-radius:2px}.npc.lqTreasureChest:hover{filter:drop-shadow(0 6px 4px #0008) brightness(1.05)}@keyframes lqChestIdle{to{transform:translateY(-1px)}}@media(prefers-reduced-motion:reduce){.npc.lqTreasureChest{animation:none}}
`;
document.head.appendChild(style);
window.LQ_TREASURE_ART_STATUS={fieldChest:'original-css-sprite',emojiPresentationRemoved:true};
if(s.screen==='world'&&s.map==='field')render();
})();