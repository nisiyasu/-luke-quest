(() => {
'use strict';

/* LUKE QUEST v0.61 treasure opened-state presentation.
   Opened chests remain physically visible with a distinct open-lid state instead of vanishing. */

const OPENED_CHESTS=[
 {map:'field',sourceKind:'lqFieldChest',flag:'fieldChestOpened'},
 {map:'forest',sourceKind:'lqForestCache',flag:'forestCacheOpened'},
 {map:'deepForest',sourceKind:'lqDeepCache',flag:'deepCacheOpened'}
];

const visibleNpcsV60=visibleNpcs;
visibleNpcs=function(m){
 const out=visibleNpcsV60(m).slice();
 const mapKey=Object.keys(MAPS).find(k=>MAPS[k]===m);
 for(const c of OPENED_CHESTS){
   if(c.map!==mapKey||!s.flags?.[c.flag])continue;
   const raw=m.npcs.find(n=>n.kind===c.sourceKind);if(!raw)continue;
   if(!out.some(n=>n.kind===`opened:${c.sourceKind}`))out.push({...raw,kind:`opened:${c.sourceKind}`,e:'',text:'中は空っぽだ。\nルーク「開けた後の箱って、ちょっとだけ達成感がありますね。」'});
 }
 return out;
};

const npcClassV60=npcClass;
npcClass=function(n){return String(n?.kind||'').startsWith('opened:lq')?'npc lqOpenedChestNpc':npcClassV60(n);};

const style=document.createElement('style');
style.textContent=`
.lqOpenedChestNpc{width:46px;height:42px;font-size:0;overflow:visible;filter:drop-shadow(0 7px 4px #0007)}.lqOpenedChestNpc:before{content:"";position:absolute;left:3px;bottom:3px;width:40px;height:23px;border-radius:5px 5px 7px 7px;background:linear-gradient(90deg,#5e351f,#8a5029 45%,#744124);border:3px solid #b68b3c;box-shadow:inset 0 -7px #3d211777}.lqOpenedChestNpc:after{content:"";position:absolute;left:2px;top:-5px;width:40px;height:20px;border-radius:18px 18px 4px 4px;background:linear-gradient(#8f542d,#5d351f);border:3px solid #b68b3c;transform-origin:50% 100%;transform:rotateX(62deg) translateY(-5px);box-shadow:0 -3px 6px #0007}.lqOpenedChestNpc{background:linear-gradient(#8e7438,#5a421d);background-size:8px 9px;background-repeat:no-repeat;background-position:19px 22px}
`;
document.head.appendChild(style);
window.LQ_TREASURE_OPEN_STATE_STATUS={persistentVisibleOpenChests:true,count:OPENED_CHESTS.length};
if(s.screen==='world')render();
})();
