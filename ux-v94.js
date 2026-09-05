(() => {
'use strict';

/* LUKE QUEST v0.94 Royal Capital population pass.
   Adds three original ordinary townsfolk to make the capital feel inhabited. */

const TOWNSFOLK=[
 {x:2,y:11,e:'',name:'パン屋のトーマ',kind:'lqBaker',text:'朝焼け前から窯を使ってるから、勇者より起きるのは早いぞ。魔物は倒せないけどパンなら膨らませられる。'},
 {x:10,y:11,e:'',name:'王都巡回兵',kind:'lqPatrolGuard',text:'南門の外は魔物が増えている。道標と街道を見失うな。勇者でも迷子は捜索対象だ。'},
 {x:15,y:6,e:'',name:'井戸端のリナ',kind:'lqWaterCarrier',text:'神殿の水晶、町中で噂になってるわよ。「壊れた」派と「奇跡」派で市場が真っ二つ。あなた本人はどっち派？\nルーク「修理見積もり待ち派です。」'}
];
for(const n of TOWNSFOLK)if(!MAPS.town.npcs.some(q=>q.kind===n.kind))MAPS.town.npcs.push({...n});

const npcClassV93=npcClass;
npcClass=function(n){if(['lqBaker','lqPatrolGuard','lqWaterCarrier'].includes(n?.kind))return`npc lqTownsperson ${n.kind}`;return npcClassV93(n);};

const style=document.createElement('style');
style.textContent=`
.lqTownsperson{width:40px;height:46px;font-size:0;filter:drop-shadow(0 4px 3px #0007)}.lqTownsperson:before{content:"";position:absolute;left:10px;top:2px;width:20px;height:20px;border-radius:48%;background:linear-gradient(#694638 0 30%,#dca47e 31%);border:2px solid #4a3028}.lqTownsperson:after{content:"";position:absolute;left:6px;top:20px;width:28px;height:25px;border-radius:8px 8px 5px 5px;border:2px solid #26323d;box-shadow:inset 0 -7px #0002}.lqBaker:after{background:linear-gradient(#d7bd82,#8d714b)}.lqBaker{background:linear-gradient(#f0e6ce,#c6bca5);background-size:23px 8px;background-position:9px 0;background-repeat:no-repeat}.lqPatrolGuard:before{background:linear-gradient(#586775 0 36%,#c89975 37%);border-color:#29323a}.lqPatrolGuard:after{background:linear-gradient(#536a7c,#304657);border-color:#a7b6be;box-shadow:inset 0 -8px #253440}.lqWaterCarrier:before{background:linear-gradient(#81593f 0 35%,#d8a17a 36%)}.lqWaterCarrier:after{background:linear-gradient(#6d7896,#4b5675)}.lqWaterCarrier{background:radial-gradient(ellipse at 88% 70%,#798b8f 0 18%,#3c5155 19% 23%,transparent 24%)}
`;
document.head.appendChild(style);

function refreshTownfolk(){for(const n of MAPS.town.npcs){if(n.kind==='lqPatrolGuard'&&s.flags?.leonSeen)n.text='森まで入ったのか。帰路も確保しておけ。英雄譚では省かれるが、戻って報告するまでが任務だ。';if(n.kind==='lqWaterCarrier'&&s.flags?.glennSeen)n.text='魔王軍の人と話したって本当？ 人間だから善、魔族だから悪って、井戸端の噂ほど単純じゃないのかもね。';}}
const worldV93=world;world=function(){refreshTownfolk();worldV93();};const renderV93=render;render=function(){refreshTownfolk();return renderV93();};
window.LQ_TOWN_POPULATION_STATUS={newOrdinaryNpcs:TOWNSFOLK.length};
if(s.screen==='world')render();
})();
