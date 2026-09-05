(() => {
'use strict';

/* Spoiler-safe worldbuilding: a physical Royal Capital notice board whose public postings react to known progress. */
if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqTownRumorBoard')){
 MAPS.town.npcs.push({x:1,y:7,e:'',name:'王都掲示板',kind:'lqTownRumorBoard',text:'王都の連絡掲示板。'});
}
const npcClassBase=npcClass;npcClass=function(n){if(n?.kind==='lqTownRumorBoard')return'npc lqTownRumorBoard';return npcClassBase(n);};
const style=document.createElement('style');style.textContent=`
.lqTownRumorBoard{width:44px;height:43px;font-size:0;border:4px solid #694a32;border-radius:4px;background:linear-gradient(#b28c5f,#86613f);box-shadow:0 5px 7px #0007,inset 0 0 0 2px #d0af7944}.lqTownRumorBoard:before{content:'';position:absolute;left:5px;right:5px;top:5px;bottom:9px;background:linear-gradient(6deg,#e7d6a6 0 44%,transparent 45%),linear-gradient(-7deg,transparent 0 48%,#d8c48e 49% 78%,transparent 79%);filter:drop-shadow(0 1px 1px #0004)}.lqTownRumorBoard:after{content:'';position:absolute;left:7px;right:7px;bottom:-11px;height:13px;border-left:5px solid #5a412e;border-right:5px solid #5a412e}
`;
document.head.appendChild(style);
function ahead(){if(s.screen!=='world'||s.map!=='town')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqTownRumorBoard');}
function lines(){
 const out=['【南門守備隊】街道に出る者は薬草と帰還時刻を確認すること。','【商業組合】市場の荷車は中央通りを塞がないようお願いします。'];
 if(s.wins>=2)out.push('【冒険者向け】森の入口周辺で魔物増加。単独での深追いは禁止。');
 if(s.flags?.leonSeen)out.push('【神殿連絡】勇者候補レオンに関する憶測を広めないこと。公式発表を待つこと。');
 if(s.flags?.glennTraceSeen)out.push('【守備隊追記】北方で未確認の軍装痕跡。住民は街道から外れないこと。');
 if(s.flags?.observationEntered)out.push('【緊急】北方監視を強化中。魔王軍に関する情報は守備隊詰所へ。');
 if(s.flags?.evacEntered)out.push('【通行注意】北の旧退避路は現在一般利用を推奨しない。');
 return out.slice(-5);
}
const actionBase=action;action=function(){if(!s.dialog&&ahead()){stopMoving();s.dialog={name:'王都掲示板',text:lines().join('\n\n')+'\n\nルーク「掲示板って、町全体の心配事が一枚に詰まってますね……。」'};return render();}return actionBase();};
window.LQ_TOWN_RUMOR_BOARD_STATUS={map:'town',storyReactive:true,spoilerSafe:true,publicKnowledgeOnly:true};
})();