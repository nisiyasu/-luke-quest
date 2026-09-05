(() => {
'use strict';

/* LUKE QUEST v0.95 interior-prop de-emoji pass.
   Replaces service-building prop emoji with original CSS furniture/object sprites. */

const PROP_BY_NAME={
 '暖炉':'lqPropHearth','客室のベッド':'lqPropBed','食堂のテーブル':'lqPropDining','旅人の本棚':'lqPropBooks',
 '薬草棚':'lqPropHerbShelf','旅用品の棚':'lqPropTravelShelf','仕入れ箱':'lqPropCrate','商人の天秤':'lqPropScale',
 '勇者選定の祭壇':'lqPropAltar','祈りの燭台':'lqPropCandles','神殿の掲示板':'lqPropNotice','礼拝席':'lqPropPew','奥の聖堂':'lqPropSanctum'
};
for(const key of ['innInterior','shopInterior','templeInterior'])for(const n of MAPS[key]?.npcs||[])if(PROP_BY_NAME[n.name])n.e='';
const npcClassV94=npcClass;
npcClass=function(n){const k=PROP_BY_NAME[n?.name];return k?`npc lqInteriorObject ${k}`:npcClassV94(n);};

const style=document.createElement('style');
style.textContent=`
.lqInteriorObject{width:44px;height:44px;font-size:0;overflow:visible;filter:drop-shadow(0 5px 3px #0007)}.lqInteriorObject:before,.lqInteriorObject:after{content:"";position:absolute;pointer-events:none}
.lqPropHearth:before{left:4px;top:12px;width:36px;height:30px;border-radius:7px 7px 2px 2px;background:linear-gradient(#6a5b50,#3d332e);border:3px solid #887668;box-shadow:inset 0 -8px #221d1a}.lqPropHearth:after{left:12px;top:21px;width:20px;height:18px;border-radius:50% 50% 25% 25%;background:radial-gradient(circle at 50% 78%,#ffe095 0 14%,#df823c 18% 40%,#8b3226 45% 62%,transparent 64%);filter:drop-shadow(0 0 7px #e6813b99);animation:lqHearth .8s ease-in-out infinite alternate}@keyframes lqHearth{to{transform:scale(.9,1.08)}}
.lqPropBed:before{left:3px;top:13px;width:39px;height:26px;border-radius:8px 8px 4px 4px;background:linear-gradient(90deg,#dfd6bc 0 27%,#466c91 28% 100%);border:2px solid #6c5139;box-shadow:inset 0 -6px #27496455}.lqPropBed:after{left:4px;top:10px;width:14px;height:12px;border-radius:7px;background:#eee8d7;border:1px solid #a79c87}
.lqPropDining:before{left:3px;top:15px;width:38px;height:21px;border-radius:6px;background:linear-gradient(#a87848,#68452b);border:2px solid #4e321f;box-shadow:6px 13px 0 -4px #4d3525,-6px 13px 0 -4px #4d3525}.lqPropDining:after{left:11px;top:18px;width:22px;height:5px;border-radius:50%;background:#d1b17377}
.lqPropBooks:before,.lqPropHerbShelf:before,.lqPropTravelShelf:before{left:4px;top:4px;width:36px;height:38px;border-radius:4px;background:linear-gradient(#745338,#463426);border:3px solid #9b744e;box-shadow:inset 0 11px #30271f,inset 0 23px #30271f}.lqPropBooks:after{left:9px;top:8px;width:25px;height:27px;background:repeating-linear-gradient(90deg,#80535a 0 3px,#d0ad61 4px 6px,#526b7b 7px 10px,#5f7a4f 11px 14px)}.lqPropHerbShelf:after{left:9px;top:8px;width:25px;height:27px;background:radial-gradient(circle,#7ea45b 0 3px,transparent 4px);background-size:9px 12px}.lqPropTravelShelf:after{left:9px;top:8px;width:25px;height:27px;background:repeating-linear-gradient(135deg,#85745f 0 5px,#4c5d63 6px 10px,#a9814d 11px 14px)}
.lqPropCrate:before{inset:7px 4px 3px;background:linear-gradient(135deg,#967047,#67462e);border:3px solid #4b3222;box-shadow:inset 0 0 0 3px #b08a5b}.lqPropCrate:after{left:21px;top:9px;width:3px;height:30px;background:#4d3423;transform:rotate(35deg)}
.lqPropScale:before{left:20px;top:6px;width:4px;height:31px;background:#b68b46;box-shadow:-12px 10px 0 -1px #b68b46,12px 10px 0 -1px #b68b46}.lqPropScale:after{left:5px;top:20px;width:34px;height:10px;border-bottom:3px solid #d2ac62;border-radius:0 0 50% 50%;box-shadow:0 9px 0 -4px #72552f}
.lqPropAltar:before{left:5px;top:16px;width:34px;height:25px;background:linear-gradient(#cbd4d9,#77858e);border:2px solid #e7eef0;clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}.lqPropAltar:after{left:15px;top:2px;width:15px;height:18px;background:conic-gradient(#8ae4ed,#6d75d8,#c879d3,#e5d878,#8ae4ed);clip-path:polygon(50% 0,100% 45%,75% 100%,25% 100%,0 45%);filter:drop-shadow(0 0 8px #8ddde399)}
.lqPropCandles:before{left:9px;top:16px;width:26px;height:24px;background:linear-gradient(90deg,#d9d0b7 0 5px,transparent 6px 10px,#eee1c3 11px 16px,transparent 17px 21px,#cbbfa6 22px 26px);box-shadow:0 4px #6b5740}.lqPropCandles:after{left:11px;top:9px;width:5px;height:8px;border-radius:50% 50% 45% 45%;background:#ffc65e;box-shadow:11px 1px #ffd16f,22px -1px #eeb655;filter:drop-shadow(0 0 4px #f5bb58)}
.lqPropNotice:before{left:4px;top:5px;width:36px;height:34px;background:linear-gradient(#765b42,#493928);border:3px solid #a98257}.lqPropNotice:after{left:10px;top:10px;width:25px;height:21px;background:#d9cca5;clip-path:polygon(0 0,100% 3%,96% 100%,3% 96%);box-shadow:0 0 0 1px #75674c}
.lqPropPew:before{left:3px;top:13px;width:39px;height:20px;background:linear-gradient(#815d3d,#4c3626);border:2px solid #a77c50;box-shadow:5px 12px 0 -3px #3e2c20,-5px 12px 0 -3px #3e2c20}.lqPropPew:after{left:5px;top:7px;width:34px;height:10px;background:#68482f;border:2px solid #916643}
.lqPropSanctum:before{left:5px;top:2px;width:34px;height:42px;border-radius:16px 16px 2px 2px;background:linear-gradient(90deg,#45525e,#778794 48%,#3d4853);border:3px solid #aab7c0;box-shadow:inset 0 0 0 3px #27333d}.lqPropSanctum:after{left:21px;top:8px;width:3px;height:29px;background:#c8aa57;box-shadow:-6px 7px 0 -1px #c8aa57,6px 7px 0 -1px #c8aa57}
`;
document.head.appendChild(style);
window.LQ_INTERIOR_PROP_STATUS={originalCssProps:Object.keys(PROP_BY_NAME),emojiRemoved:Object.keys(PROP_BY_NAME).length};
if(s.screen==='world')render();
})();
