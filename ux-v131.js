(() => {
'use strict';

/* LUKE QUEST v0.131 expanded original NPC field sprites.
   Replaces eight additional human/soldier emoji markers with lightweight original chibi silhouettes. */
const SKINS={
 '薬草を摘む娘':'lqNpcHerbGirl','王都警備兵':'lqNpcGuard','見習い兵士':'lqNpcTrainee','怖がりな冒険者':'lqNpcAdventurer','負傷した兵士':'lqNpcWounded','魔王軍の若い兵士':'lqNpcDemonSoldier','疲弊した魔王軍兵':'lqNpcDemonTired','王国の斥候':'lqNpcScout'
};
for(const map of Object.values(MAPS))for(const n of map.npcs||[])if(SKINS[n.name])n.e='';
const npcClassV130=npcClass;npcClass=function(n){const skin=SKINS[n?.name];return skin?`npc lqHumanNpc lqNpcV131 ${skin}`:npcClassV130(n);};
const style=document.createElement('style');style.textContent=`
.lqNpcV131{width:40px;height:46px;font-size:0;overflow:visible;filter:drop-shadow(0 4px 3px #0008)}.lqNpcV131:before{content:"";position:absolute;left:10px;top:2px;width:20px;height:20px;border-radius:48% 48% 45% 45%;background:#ddb083;border:2px solid #574334;box-shadow:inset 0 -3px #bd8e68}.lqNpcV131:after{content:"";position:absolute;left:6px;top:20px;width:28px;height:25px;border-radius:9px 9px 5px 5px;border:2px solid #273645;box-shadow:inset 0 -7px #17253255}
.lqNpcHerbGirl:before{background:linear-gradient(#6d4938 0 34%,#e0ae84 35%);border-color:#55362c}.lqNpcHerbGirl:after{background:linear-gradient(#789752,#486537);border-color:#344b29}.lqNpcHerbGirl{background:radial-gradient(ellipse at 15% 77%,#7faf5d 0 5px,transparent 6px),radial-gradient(ellipse at 80% 79%,#92bd64 0 5px,transparent 6px)}
.lqNpcGuard:before,.lqNpcTrainee:before,.lqNpcScout:before{background:linear-gradient(#7c8790 0 28%,#d9a778 29%);border-color:#56616a}.lqNpcGuard:after{background:linear-gradient(#466784,#273f58);border-color:#1c3044}.lqNpcTrainee:after{background:linear-gradient(#71819a,#485970);border-color:#334457}.lqNpcScout:after{background:linear-gradient(#5e7557,#384c36);border-color:#273827}.lqNpcGuard{background:linear-gradient(#c3cad0,#687782);background-size:4px 30px;background-repeat:no-repeat;background-position:34px 15px}.lqNpcTrainee{background:linear-gradient(#a9afb5,#59636d);background-size:17px 4px;background-repeat:no-repeat;background-position:11px 25px}.lqNpcScout{background:linear-gradient(#7e6949,#4b3b28);background-size:28px 5px;background-repeat:no-repeat;background-position:6px 6px}
.lqNpcAdventurer:before{background:linear-gradient(#8a6140 0 30%,#daa579 31%);border-color:#62452f}.lqNpcAdventurer:after{background:linear-gradient(#9b6b48,#5f412e);border-color:#443024}.lqNpcAdventurer{background:linear-gradient(#6e4a32,#36261d);background-size:9px 21px;background-repeat:no-repeat;background-position:31px 23px}
.lqNpcWounded:before{background:linear-gradient(#6b5947 0 28%,#d6a276 29%);border-color:#5a4839}.lqNpcWounded:after{background:linear-gradient(#6c7684,#404b58);border-color:#2e3945}.lqNpcWounded{transform:rotate(-4deg)}.lqNpcWounded:after{box-shadow:inset 0 -7px #17253255,9px -8px 0 -7px #e5ddd0}
.lqNpcDemonSoldier:before,.lqNpcDemonTired:before{background:linear-gradient(#343741 0 34%,#b38c75 35%);border-color:#20232a}.lqNpcDemonSoldier:after{background:linear-gradient(#523f61,#30283c);border-color:#211c29}.lqNpcDemonTired:after{background:linear-gradient(#4d4655,#302c35);border-color:#211f26}.lqNpcDemonSoldier{background:linear-gradient(35deg,transparent 47%,#8f778e 48% 55%,transparent 56%);background-size:23px 30px;background-repeat:no-repeat;background-position:25px 15px}.lqNpcDemonTired{filter:drop-shadow(0 4px 3px #0008) saturate(.72);transform:rotate(3deg)}
`;document.head.appendChild(style);
window.LQ_NPC_VISUAL_STATUS=Object.assign({},window.LQ_NPC_VISUAL_STATUS,{v131OriginalCssChibi:Object.keys(SKINS),remainingEmojiNpcs:true});if(s.screen==='world')render();
})();