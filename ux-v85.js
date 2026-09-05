(() => {
'use strict';

/* LUKE QUEST v0.85 physical route signpost.
   Adds an examinable landmark near the Royal Capital field entrance. */

const SIGN={x:13,y:16,kind:'lqFieldSignpost',name:'王都街道の道標'};
if(!MAPS.field.npcs.some(n=>n.kind===SIGN.kind))MAPS.field.npcs.push({...SIGN,e:'',text:'木の道標には矢印が刻まれている。\n↑ 北東：魔物の森\n← 南西：王都アルディア\nルーク「こういう案内、全部の危険地帯に置いてほしいです。」'});

const npcClassV84=npcClass;
npcClass=function(n){return n?.kind===SIGN.kind?'npc lqFieldSignpost':npcClassV84(n);};
const style=document.createElement('style');
style.textContent=`
.lqFieldSignpost{width:44px;height:46px;font-size:0;overflow:visible;filter:drop-shadow(0 5px 3px #0008)}.lqFieldSignpost:before{content:"";position:absolute;left:18px;top:10px;width:8px;height:36px;background:linear-gradient(90deg,#644227,#9b6b3d 52%,#54371f);border:1px solid #3c2818;border-radius:2px}.lqFieldSignpost:after{content:"↗";position:absolute;left:2px;top:3px;width:39px;height:19px;border-radius:3px;background:linear-gradient(#a87843,#72502f);border:2px solid #4b321f;color:#f2d69b;display:grid;place-items:center;font-size:14px;font-weight:950;text-shadow:0 1px #3c281a;box-shadow:0 3px 5px #0006}
`;
document.head.appendChild(style);
window.LQ_ROUTE_SIGN_STATUS={fieldEntrance:true,directions:['魔物の森','王都アルディア']};
if(s.screen==='world'&&s.map==='field')render();
})();
