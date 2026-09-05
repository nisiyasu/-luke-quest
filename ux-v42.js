(() => {
'use strict';

/* LUKE QUEST v0.42 original clue / world prop sprites.
   Replaces several story-clue emoji with lightweight original CSS-drawn props. */

const PROP_SKINS={
 '消えかけの焚き火':'lqPropCampfire',
 '黒い羽根':'lqPropFeather',
 '折れた訓練剣':'lqPropBrokenSword',
 '金色の糸':'lqPropGoldenThread',
 '乱れた足跡':'lqPropFootprints',
 '黒鉄の命令標':'lqPropOrderMarker',
 '規律正しい軍靴跡':'lqPropBootprints',
 '捨てられた包帯':'lqPropBandage'
};

for(const map of Object.values(MAPS))for(const n of map.npcs||[])if(PROP_SKINS[n.name])n.e='';

const npcClassV41=npcClass;
npcClass=function(n){const skin=PROP_SKINS[n?.name];return skin?`npc lqWorldProp ${skin}`:npcClassV41(n);};

const style=document.createElement('style');
style.textContent=`
.lqWorldProp{width:44px;height:44px;font-size:0;overflow:visible;filter:drop-shadow(0 4px 3px #0008)}
.lqWorldProp:before,.lqWorldProp:after{content:"";position:absolute;pointer-events:none}
.lqPropCampfire:before{left:8px;bottom:7px;width:28px;height:9px;border-radius:50%;background:radial-gradient(ellipse,#2f2118 0 38%,#8e5833 40% 64%,transparent 66%);box-shadow:-7px 1px 0 -2px #6b4931,7px 1px 0 -2px #6b4931;transform:rotate(-4deg)}
.lqPropCampfire:after{left:11px;bottom:13px;width:22px;height:25px;border-radius:50% 50% 48% 48%;background:radial-gradient(circle at 50% 75%,#fff6ae 0 13%,#efac46 16% 34%,#b6492d 38% 58%,transparent 61%);filter:drop-shadow(0 0 7px #ef8c3c99);animation:lqPropFlame .75s ease-in-out infinite alternate}@keyframes lqPropFlame{to{transform:scale(.86,1.1) translateY(-2px);opacity:.88}}
.lqPropFeather:before{left:12px;top:5px;width:12px;height:34px;border-radius:90% 8% 90% 8%;background:linear-gradient(135deg,#262834,#080b13 60%,#4b5260);transform:rotate(28deg);box-shadow:inset 4px -2px #68708055}
.lqPropFeather:after{left:21px;top:8px;width:2px;height:31px;background:#a7a194;transform:rotate(28deg);transform-origin:bottom}
.lqPropBrokenSword:before{left:19px;top:4px;width:7px;height:28px;background:linear-gradient(90deg,#8997a5,#f1f5f7 45%,#66727d);clip-path:polygon(0 0,100% 0,80% 78%,100% 88%,35% 100%,16% 73%);transform:rotate(42deg);border-radius:2px}
.lqPropBrokenSword:after{left:9px;top:27px;width:26px;height:7px;background:#a47a35;border:2px solid #5a4020;border-radius:3px;transform:rotate(42deg);box-shadow:7px 8px 0 -2px #5f4030}
.lqPropGoldenThread:before{left:7px;top:13px;width:31px;height:18px;border:3px solid #e7bf52;border-color:#e7bf52 transparent #b78627 #f0d777;border-radius:50%;transform:rotate(-18deg);box-shadow:0 0 5px #e8c15a66}
.lqPropGoldenThread:after{left:13px;top:18px;width:23px;height:13px;border:2px solid #f4d97e;border-color:transparent #f4d97e #a77b21 transparent;border-radius:50%;transform:rotate(21deg)}
.lqPropFootprints:before,.lqPropBootprints:before{left:6px;top:5px;width:11px;height:18px;border-radius:55% 55% 40% 40%;background:#30261fbb;box-shadow:17px 11px 0 #30261fbb,4px 27px 0 #30261faa;transform:rotate(-25deg)}
.lqPropBootprints:before{background:#191d22dd;box-shadow:17px 11px 0 #191d22dd,4px 27px 0 #191d22cc;border:2px solid #5d626755}
.lqPropOrderMarker:before{left:18px;top:4px;width:6px;height:37px;background:linear-gradient(#494c51,#202226);border:1px solid #0d0e10;border-radius:2px}
.lqPropOrderMarker:after{left:5px;top:3px;width:31px;height:24px;background:linear-gradient(135deg,#3d4148,#15171b);border:2px solid #777d84;clip-path:polygon(0 0,100% 0,92% 85%,50% 100%,8% 85%);box-shadow:inset 0 0 0 2px #1e2025}
.lqPropBandage:before{left:7px;top:12px;width:30px;height:18px;border-radius:50%;background:repeating-linear-gradient(15deg,#ddd6c4 0 5px,#b9b09d 5px 7px);border:2px solid #8d8578;transform:rotate(-12deg)}
.lqPropBandage:after{left:19px;top:17px;width:15px;height:7px;border-radius:50%;background:#7a2d2d88;transform:rotate(8deg)}
.lqWorldProp{animation:lqPropIdle 2.2s ease-in-out infinite alternate}@keyframes lqPropIdle{from{translate:0 0}to{translate:0 -1px}}
`;
document.head.appendChild(style);

window.LQ_WORLD_PROP_VISUAL_STATUS={
 originalCssProps:Object.keys(PROP_SKINS),
 replacedEmojiCount:Object.keys(PROP_SKINS).length
};
if(s.screen==='world')render();
})();
