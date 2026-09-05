(() => {
'use strict';

/* Collision-safe content add-on: turns the central fountain landmark into a physical readable object. */
if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqTownFountain')){
 MAPS.town.npcs.push({
  x:8,y:8,e:'',name:'王都中央噴水',kind:'lqTownFountain',
  text:'石造りの噴水。縁には「旅人にも、住む者にも、同じ水を」と刻まれている。\nルーク「こういう立派な言葉、僕が読むと急に『水筒を忘れるな』に聞こえるんですよね。」'
 });
}
const npcClassBase=npcClass;
npcClass=function(n){if(n?.kind==='lqTownFountain')return'npc lqTownFountainNpc';return npcClassBase(n);};
const style=document.createElement('style');
style.textContent=`
.lqTownFountainNpc{width:52px;height:52px;font-size:0;border-radius:50%;background:radial-gradient(circle,#cfeff2 0 12%,#71bdc8 13% 34%,#3c8797 35% 50%,#aeb9b7 51% 64%,#707b7c 65%);border:3px solid #c0cac7;box-shadow:0 7px 9px #0008,inset 0 0 8px #eaffff77;transform:translate(-5px,-5px)}
.lqTownFountainNpc:before{content:'';position:absolute;left:50%;top:8px;width:12px;height:28px;transform:translateX(-50%);border-left:2px solid #baf4ff99;border-right:2px solid #baf4ff66;border-radius:50%;filter:drop-shadow(0 0 4px #baf4ff88);animation:lqFountainNpcJet 1.4s ease-in-out infinite alternate}
.lqTownFountainNpc:after{content:'A';position:absolute;right:-7px;top:-8px;width:17px;height:17px;border-radius:50%;display:grid;place-items:center;background:#f0d36c;color:#1b2530;border:2px solid #fff4c5;font-size:8px;font-weight:950;opacity:0;transition:opacity .15s}
.lqTownFountainNpc.lqFacingNpc:after{opacity:1}
@keyframes lqFountainNpcJet{from{height:23px;opacity:.7}to{height:31px;opacity:1}}
@media(prefers-reduced-motion:reduce){.lqTownFountainNpc:before{animation:none;height:27px}}
`;
document.head.appendChild(style);
window.LQ_TOWN_FOUNTAIN_INTERACTION_STATUS={physical:true,readable:true,storySafe:true,reward:false};
})();
