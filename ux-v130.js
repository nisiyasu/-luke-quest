(() => {
'use strict';

/* LUKE QUEST v0.130 original story clue sprites.
   Replaces eight early investigation emoji markers with original lightweight field props. */
const CLUES={
 '消えかけの焚き火':'lqClueFire','黒い羽根':'lqClueFeather','折れた訓練剣':'lqClueSword','金色の糸':'lqClueThread','乱れた足跡':'lqClueTracks','黒鉄の命令標':'lqClueOrder','規律正しい軍靴跡':'lqClueBoots','捨てられた包帯':'lqClueBandage'
};
const npcClassV129=npcClass;npcClass=function(n){const base=npcClassV129(n),x=CLUES[n?.name];return x?`${base} lqStoryClue ${x}`:base;};
const style=document.createElement('style');style.textContent=`
.npc.lqStoryClue{font-size:0!important;width:44px;height:44px;filter:drop-shadow(0 5px 3px #0008)}.npc.lqStoryClue:before,.npc.lqStoryClue:after{content:"";position:absolute;display:block}
.lqClueFire:before{left:7px;top:27px;width:30px;height:9px;border-radius:50%;background:#30251e;box-shadow:0 4px 0 -1px #1b1511}.lqClueFire:after{left:13px;top:7px;width:18px;height:26px;background:radial-gradient(circle at 50% 75%,#ffe58a 0 14%,#ff9e31 15% 37%,#c84726 38% 57%,transparent 59%);filter:drop-shadow(0 0 5px #ff8736);animation:lqClueFlame .7s ease-in-out infinite alternate}@keyframes lqClueFlame{to{transform:scaleX(.86) translateY(2px)}}
.lqClueFeather:before{left:10px;top:6px;width:23px;height:32px;background:linear-gradient(135deg,#323749,#0f121b 70%);clip-path:polygon(80% 0,100% 13%,74% 42%,87% 53%,62% 62%,72% 77%,41% 72%,18% 100%,28% 66%,0 57%,32% 42%,18% 25%,54% 28%);transform:rotate(18deg);border-radius:50%}.lqClueFeather:after{left:20px;top:19px;width:2px;height:23px;background:#777d8f;transform:rotate(31deg)}
.lqClueSword:before{left:20px;top:3px;width:5px;height:34px;border-radius:2px;background:linear-gradient(90deg,#8996a1,#e1e6e9,#75818b);transform:rotate(42deg);box-shadow:0 0 2px #fff5}.lqClueSword:after{left:8px;top:25px;width:28px;height:5px;border-radius:3px;background:#a87a3e;transform:rotate(42deg);box-shadow:9px 8px 0 -1px #5a3d27}
.lqClueThread:before{left:7px;top:17px;width:31px;height:13px;border:2px solid #e4c267;border-color:#e4c267 transparent #d8ad4e #f0d984;border-radius:50%;transform:rotate(-17deg)}.lqClueThread:after{left:11px;top:12px;width:22px;height:20px;border:1px solid #f0d984;border-color:transparent #f0d984 transparent #d8ad4e;border-radius:50%;transform:rotate(21deg)}
.lqClueTracks:before{left:9px;top:4px;width:11px;height:18px;border-radius:55% 55% 45% 45%;background:#5b4939;transform:rotate(-22deg);box-shadow:17px 18px 0 #5b4939}.lqClueTracks:after{left:9px;top:20px;width:7px;height:9px;border-radius:50%;background:#5b4939;transform:rotate(-22deg);box-shadow:21px 16px 0 #5b4939}
.lqClueOrder:before{left:19px;top:4px;width:5px;height:37px;background:#373a40;border-radius:2px;box-shadow:2px 0 #17191c}.lqClueOrder:after{left:8px;top:6px;width:28px;height:21px;background:linear-gradient(135deg,#292f36,#12161b);clip-path:polygon(0 0,100% 7%,78% 50%,100% 93%,0 100%);border-left:2px solid #89919a;box-shadow:inset 0 0 0 1px #58616b}
.lqClueBoots:before{left:7px;top:15px;width:13px;height:24px;border-radius:4px 4px 8px 3px;background:#3a3028;border:2px solid #706052;transform:rotate(12deg);box-shadow:18px -8px 0 -1px #3a3028}.lqClueBoots:after{left:5px;top:32px;width:20px;height:7px;border-radius:7px 4px 5px 3px;background:#241e1a;transform:rotate(8deg);box-shadow:18px -8px 0 -1px #241e1a}
.lqClueBandage:before{left:5px;top:13px;width:34px;height:17px;border-radius:50%;border:6px solid #dad4c8;border-left-color:#9d5f58;transform:rotate(-12deg);box-sizing:border-box}.lqClueBandage:after{left:14px;top:15px;width:17px;height:13px;background:#dfd8cb;transform:rotate(24deg);box-shadow:inset 4px 0 #a15c56}
@media(prefers-reduced-motion:reduce){.lqClueFire:after{animation:none}}
`;document.head.appendChild(style);
window.LQ_STORY_CLUE_ART_STATUS={originalCssSprites:Object.keys(CLUES).length,emojiPresentationRemoved:true,storyCanonUntouched:true};if(s.screen==='world')render();
})();