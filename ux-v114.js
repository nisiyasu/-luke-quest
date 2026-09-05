(() => {
'use strict';

/* LUKE QUEST v0.114 original interior prop sprites.
   Replaces major interior emoji props with lightweight CSS-drawn furniture/fixtures. */

const PROP_CLASSES={
 '暖炉':'lqPropFireplace','客室のベッド':'lqPropBed','食堂のテーブル':'lqPropTable','旅人の本棚':'lqPropBooks',
 '薬草棚':'lqPropHerbShelf','旅用品の棚':'lqPropTravelShelf','仕入れ箱':'lqPropCrate','商人の天秤':'lqPropScale',
 '勇者選定の祭壇':'lqPropAltar','祈りの燭台':'lqPropCandles','神殿の掲示板':'lqPropNotice','礼拝席':'lqPropPew','奥の聖堂':'lqPropSanctum'
};
const npcClassV113=npcClass;npcClass=function(n){const base=npcClassV113(n),extra=PROP_CLASSES[n?.name];return extra?`${base} lqInteriorProp ${extra}`:base;};
const style=document.createElement('style');
style.textContent=`
.npc.lqInteriorProp{font-size:0!important;width:44px;height:46px;filter:drop-shadow(0 5px 4px #0007)}.npc.lqInteriorProp:before,.npc.lqInteriorProp:after{content:"";position:absolute;display:block}
.lqPropFireplace:before{left:4px;top:5px;width:36px;height:36px;border-radius:5px 5px 2px 2px;background:linear-gradient(#67503e 0 19%,#3a2b24 20% 100%);border:3px solid #84674e;box-shadow:inset 0 -5px #211714}.lqPropFireplace:after{left:13px;top:20px;width:18px;height:16px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 70%,#fff0a0 0 13%,#ffb42c 14% 42%,#e44e27 43% 64%,transparent 65%);filter:drop-shadow(0 0 5px #ff8a32)}
.lqPropBed:before{left:2px;top:13px;width:40px;height:25px;border-radius:7px 7px 4px 4px;background:linear-gradient(90deg,#ece3c6 0 24%,#496f92 25% 100%);border:2px solid #775438;box-shadow:inset 0 -5px #2d4f70}.lqPropBed:after{left:4px;top:10px;width:12px;height:10px;border-radius:5px;background:#f4ecd5;border:1px solid #c6b99c}
.lqPropTable:before{left:4px;top:13px;width:36px;height:12px;border-radius:50%;background:radial-gradient(ellipse,#b98552,#704827 70%);border:2px solid #c49a68}.lqPropTable:after{left:18px;top:23px;width:8px;height:17px;background:#704827;box-shadow:-12px 12px 0 -2px #51321e,12px 12px 0 -2px #51321e}
.lqPropBooks:before,.lqPropHerbShelf:before,.lqPropTravelShelf:before{left:5px;top:3px;width:34px;height:39px;background:linear-gradient(90deg,#664224,#8b6036 50%,#5b391f);border:3px solid #a07648;box-shadow:inset 0 -11px #3d291c,inset 0 -14px #bb8a4f,inset 0 -25px #3d291c,inset 0 -28px #bb8a4f}.lqPropBooks:after{left:10px;top:8px;width:4px;height:9px;background:#a94444;box-shadow:5px 0 #466d9c,10px 0 #c09543,15px 0 #6a9a5d,19px 0 #8a518f,2px 14px #d1b36a,7px 14px #536f91,13px 14px #8a4d43,18px 14px #65965b}.lqPropHerbShelf:after{left:10px;top:9px;width:7px;height:7px;border-radius:50% 50% 45% 45%;background:#709d53;box-shadow:10px 1px #4f813e,18px -1px #8eaa5e,2px 15px #5b8b46,13px 15px #81a65e,21px 14px #466f38}.lqPropTravelShelf:after{left:10px;top:9px;width:8px;height:7px;border-radius:2px;background:#b2a58c;box-shadow:12px 0 #816e5b,20px 2px #c09959,3px 15px #765c43,14px 14px #a18d73,22px 15px #5b7180}
.lqPropCrate:before{left:5px;top:7px;width:34px;height:32px;background:repeating-linear-gradient(0deg,#97673d 0 8px,#80532f 8px 11px);border:3px solid #b88655;box-shadow:inset 0 0 0 2px #5a391f}.lqPropCrate:after{left:8px;top:21px;width:28px;height:3px;background:#d0a16a;transform:rotate(-32deg)}
.lqPropScale:before{left:20px;top:5px;width:4px;height:32px;background:#c59b4e;border-radius:2px;box-shadow:-13px 12px 0 -1px #9d793d,13px 12px 0 -1px #9d793d}.lqPropScale:after{left:7px;top:12px;width:30px;height:3px;background:#d6b663;box-shadow:0 22px 0 4px #735434}
.lqPropAltar:before{left:4px;top:18px;width:36px;height:22px;background:linear-gradient(#d8d4ca,#8a8790);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%);border-radius:3px;box-shadow:inset 0 5px #ffffff36}.lqPropAltar:after{left:15px;top:4px;width:14px;height:17px;background:linear-gradient(135deg,#c9f6ff,#6bc7ec 45%,#6e69ce);clip-path:polygon(50% 0,100% 38%,78% 100%,22% 100%,0 38%);filter:drop-shadow(0 0 7px #8deaff)}
.lqPropCandles:before{left:7px;top:12px;width:30px;height:4px;background:#a47c42;box-shadow:0 18px 0 2px #64482c}.lqPropCandles:after{left:9px;top:5px;width:4px;height:14px;background:#e7dfc5;box-shadow:8px 2px #e7dfc5,16px 0 #e7dfc5,24px 3px #e7dfc5;filter:drop-shadow(0 -4px 3px #ffc247)}
.lqPropNotice:before{left:5px;top:5px;width:34px;height:32px;background:#8d633b;border:3px solid #b58b5c;box-shadow:inset 0 0 0 2px #50351f}.lqPropNotice:after{left:11px;top:10px;width:11px;height:14px;background:#d9c9a4;box-shadow:10px 4px #c9b486,4px 17px 0 -2px #bca574}
.lqPropPew:before{left:2px;top:14px;width:40px;height:13px;border-radius:3px;background:linear-gradient(#9a734b,#5d4029);box-shadow:inset 0 3px #bc9266}.lqPropPew:after{left:5px;top:25px;width:5px;height:15px;background:#5a3d28;box-shadow:29px 0 #5a3d28}
.lqPropSanctum:before{left:8px;top:1px;width:28px;height:42px;border-radius:14px 14px 2px 2px;background:linear-gradient(90deg,#44372e,#715d4b 48%,#3c3028);border:3px solid #9a846d;box-shadow:inset 0 0 0 2px #271f1b}.lqPropSanctum:after{left:28px;top:23px;width:5px;height:5px;border-radius:50%;background:#d5b662;box-shadow:0 0 5px #f0d581}
`;
document.head.appendChild(style);
window.LQ_INTERIOR_PROP_STATUS={originalCssProps:Object.keys(PROP_CLASSES).length,emojiPresentationReplaced:true,majorCharacterArtUntouched:true};
if(s.screen==='world')render();
})();