(() => {
'use strict';

/* LUKE QUEST v0.43 evacuation-route clue art and a distinct demon-army guard field silhouette. */

const V43_SKINS={
 '血のついた岩':'lqPropBloodRock',
 '外された封鎖杭':'lqPropRemovedStake',
 '撤収命令の切れ端':'lqPropOrderScrap',
 '魔王軍の見張り':'lqDemonGuard'
};
for(const map of Object.values(MAPS))for(const n of map.npcs||[])if(V43_SKINS[n.name])n.e='';

const npcClassV42=npcClass;
npcClass=function(n){const skin=V43_SKINS[n?.name];return skin?`npc lqV43Sprite ${skin}`:npcClassV42(n);};

const style=document.createElement('style');
style.textContent=`
.lqV43Sprite{width:44px;height:46px;font-size:0;overflow:visible;filter:drop-shadow(0 4px 3px #0009)}
.lqV43Sprite:before,.lqV43Sprite:after{content:"";position:absolute;pointer-events:none}
.lqPropBloodRock:before{left:5px;top:14px;width:35px;height:26px;border-radius:52% 60% 35% 45%;background:linear-gradient(145deg,#777873,#4b4d49 60%,#343632);border:2px solid #292b28;box-shadow:inset 7px 4px #94958d55}
.lqPropBloodRock:after{left:17px;top:20px;width:17px;height:9px;border-radius:60% 40% 55% 45%;background:#711f26c9;box-shadow:7px 8px 0 -4px #8f2930;transform:rotate(12deg)}
.lqPropRemovedStake:before{left:5px;top:20px;width:37px;height:8px;background:linear-gradient(#8a6b46,#4b3828);border:2px solid #302319;transform:rotate(-23deg);box-shadow:1px 12px 0 -1px #4f3a29,-7px 6px 0 -1px #75573a}
.lqPropRemovedStake:after{left:29px;top:7px;width:8px;height:31px;background:#6a4d32;border:2px solid #332318;clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);transform:rotate(34deg)}
.lqPropOrderScrap:before{left:9px;top:7px;width:28px;height:34px;background:linear-gradient(150deg,#d7c79d,#aa956f);border:2px solid #6e5d42;clip-path:polygon(0 0,84% 0,100% 15%,91% 31%,100% 49%,90% 66%,100% 83%,80% 100%,0 94%,7% 73%,0 52%,7% 33%);transform:rotate(7deg);box-shadow:0 3px 6px #0007}
.lqPropOrderScrap:after{left:15px;top:15px;width:17px;height:2px;background:#4a4030;box-shadow:0 6px #4a4030,0 12px #4a4030;transform:rotate(7deg)}
.lqDemonGuard:before{left:9px;top:2px;width:26px;height:22px;border-radius:48% 48% 40% 40%;background:linear-gradient(#3e4652 0 28%,#8e7268 29% 100%);border:2px solid #171b22;box-shadow:inset 0 4px #69758366}
.lqDemonGuard:after{left:5px;top:20px;width:34px;height:26px;border-radius:8px 8px 4px 4px;background:linear-gradient(90deg,#262b33,#555f69 45%,#20252c);border:2px solid #11151a;box-shadow:inset 0 -7px #12161b88,0 0 0 2px #73405355}
.lqDemonGuard{background:linear-gradient(150deg,transparent 0 44%,#2d1831 45% 54%,transparent 55%),linear-gradient(#7e5160,#3b2631);background-size:36px 7px,7px 31px;background-repeat:no-repeat;background-position:4px 4px,36px 13px;animation:lqGuardIdle 1.7s ease-in-out infinite alternate}@keyframes lqGuardIdle{to{transform:translateY(-1px)}}
`;
document.head.appendChild(style);

window.LQ_V43_VISUAL_STATUS={evacuationClues:['血のついた岩','外された封鎖杭','撤収命令の切れ端'],demonGuardOriginalCss:true};
if(s.screen==='world')render();
})();
