(() => {
'use strict';

/* LUKE QUEST v0.41 original lightweight NPC field sprites.
   Replaces several human emoji with original CSS-drawn chibi silhouettes. */

const NPC_SKINS={
 '旅好きの老人':'lqNpcElder',
 '畑仕事の青年':'lqNpcFarmer',
 '道具屋のミナ':'lqNpcMina',
 '南門宿の主人':'lqNpcInnkeeper',
 '神殿の見習い':'lqNpcNovice'
};
for(const map of Object.values(MAPS))for(const n of map.npcs||[])if(NPC_SKINS[n.name])n.e='';

const npcClassV40=npcClass;
npcClass=function(n){const skin=NPC_SKINS[n?.name];return skin?`npc lqHumanNpc ${skin}`:npcClassV40(n);};

const style=document.createElement('style');
style.textContent=`
.lqHumanNpc{width:40px;height:46px;font-size:0;overflow:visible;filter:drop-shadow(0 4px 3px #0008)}
.lqHumanNpc:before{content:"";position:absolute;left:10px;top:2px;width:20px;height:20px;border-radius:48% 48% 45% 45%;background:#e4b98d;border:2px solid #6b4935;box-shadow:inset 0 -3px #c9956f}
.lqHumanNpc:after{content:"";position:absolute;left:6px;top:20px;width:28px;height:25px;border-radius:9px 9px 5px 5px;background:#46668a;border:2px solid #24394f;box-shadow:inset 0 -7px #24394f55}
.lqNpcElder:before{background:linear-gradient(#ddd8cb 0 28%,#dfb486 29%);border-color:#77736b}.lqNpcElder:after{background:linear-gradient(#786e72,#4c4952);border-color:#34323a}.lqNpcElder{background:linear-gradient(#c5beb2,#766f69);background-size:3px 22px;background-repeat:no-repeat;background-position:35px 22px}
.lqNpcFarmer:before{background:linear-gradient(#6b4b2f 0 28%,#daa978 29%);border-color:#5b412e}.lqNpcFarmer:after{background:linear-gradient(#718d45,#465f32);border-color:#304225}.lqNpcFarmer{background:linear-gradient(#d7b153,#947027);background-size:34px 5px;background-repeat:no-repeat;background-position:3px 4px}
.lqNpcMina:before{background:linear-gradient(#5f3a2f 0 34%,#e1ad82 35%);border-color:#57342c}.lqNpcMina:after{background:linear-gradient(#345d68,#213e49);border-color:#19303a}.lqNpcMina{background:linear-gradient(#e5c26b,#a07c30);background-size:11px 8px;background-repeat:no-repeat;background-position:14px 26px}
.lqNpcInnkeeper:before{background:linear-gradient(#4f382c 0 28%,#d4a175 29%);border-color:#493127}.lqNpcInnkeeper:after{background:linear-gradient(#744a31,#4c3022);border-color:#362219}.lqNpcInnkeeper{background:linear-gradient(#eee0bc,#baa77e);background-size:20px 13px;background-repeat:no-repeat;background-position:10px 24px}
.lqNpcNovice:before{background:linear-gradient(#c1b08b 0 30%,#e2b487 31%);border-color:#6d6250}.lqNpcNovice:after{background:linear-gradient(#d5d9de,#8e9aa6);border-color:#66727c}.lqNpcNovice{background:linear-gradient(#4f72aa,#2c4e83);background-size:8px 18px;background-repeat:no-repeat;background-position:16px 24px}
.lqHumanNpc{animation:lqNpcIdle 1.8s ease-in-out infinite alternate}@keyframes lqNpcIdle{from{transform:translateY(0)}to{transform:translateY(-2px)}}
`;
document.head.appendChild(style);

window.LQ_NPC_VISUAL_STATUS={originalCssChibi:['旅好きの老人','畑仕事の青年','道具屋のミナ','南門宿の主人','神殿の見習い'],remainingEmojiNpcs:true};
if(s.screen==='world')render();
})();
