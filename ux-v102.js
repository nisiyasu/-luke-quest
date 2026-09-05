(() => {
'use strict';

/* LUKE QUEST v0.102 optional monster bounty.
   Adds a second independent side activity: accept at the Royal Capital noticeboard, defeat 3 forest enemies, claim 50G. */

s.flags=s.flags||{};s.flags.forestBountyAccepted??=false;s.flags.forestBountyComplete??=false;
s.forestBountyKills=Number.isFinite(Number(s.forestBountyKills))?Math.max(0,Math.floor(Number(s.forestBountyKills))):0;
const BOARD={x:15,y:10,e:'',name:'王都討伐掲示板',kind:'lqBountyBoard',text:''};
if(!MAPS.town.npcs.some(n=>n.kind===BOARD.kind))MAPS.town.npcs.push({...BOARD});

const npcClassV101=npcClass;npcClass=function(n){return n?.kind===BOARD.kind?'npc lqBountyBoard':npcClassV101(n);};
const style=document.createElement('style');
style.textContent=`
.lqBountyBoard{width:44px;height:46px;font-size:0;filter:drop-shadow(0 5px 4px #0007)}.lqBountyBoard:before{content:"";position:absolute;left:3px;top:3px;width:38px;height:32px;background:linear-gradient(#7e5d3c,#543b2a);border:3px solid #a47b50;box-shadow:inset 0 0 0 2px #39291f}.lqBountyBoard:after{content:"!";position:absolute;left:12px;top:9px;width:20px;height:19px;background:#d8c9a1;color:#6b302d;display:grid;place-items:center;font-size:14px;font-weight:1000;box-shadow:-7px 5px 0 -3px #c7b58d,8px 5px 0 -3px #bda980}.lqBountyProgress{height:6px;margin-top:5px;background:#1a2933;border-radius:99px;overflow:hidden}.lqBountyProgress i{display:block;height:100%;background:linear-gradient(90deg,#a15d4d,#dc9a5b)}
`;
document.head.appendChild(style);

const winV101=win;
win=function(){const battleMap=s.map;const r=winV101();if(battleMap==='forest'&&s.flags.forestBountyAccepted&&!s.flags.forestBountyComplete){s.forestBountyKills=Math.min(3,s.forestBountyKills+1);save();}return r;};
function boardAhead(){if(s.screen!=='world'||s.map!=='town')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind===BOARD.kind);}
function useBoard(){
 stopMoving();
 if(s.flags.forestBountyComplete){s.dialog={name:'王都討伐掲示板',text:'「魔物の森・安全確認」\n完了印が押されている。\nルーク「紙にハンコがあると急に仕事した感が出ますね。」'};return render();}
 if(!s.flags.forestBountyAccepted){s.flags.forestBountyAccepted=true;s.forestBountyKills=0;save();s.dialog={name:'王都討伐掲示板',text:'依頼：魔物の森で魔物を3体討伐し、安全な街道を確保せよ。\n報酬：50G\n依頼を引き受けた。'};return render();}
 if(s.forestBountyKills>=3){s.flags.forestBountyComplete=true;s.gold+=50;save();s.dialog={name:'王都討伐掲示板',text:'討伐記録が確認された。\n報酬 50Gを受け取った！\nルーク「勇者の肩書きより、こっちの方が給料の仕組みが分かりやすいです。」'};return render();}
 s.dialog={name:'王都討伐掲示板',text:`「魔物の森・安全確認」\n進捗 ${s.forestBountyKills}/3\n魔物の森であと${3-s.forestBountyKills}体。`};render();
}
const actionV101=action;action=function(){if(!s.dialog&&boardAhead())return useBoard();return actionV101();};
function addBountyMenu(){
 if(!s.pauseOpen||!s.flags.forestBountyAccepted||s.flags.forestBountyComplete)return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqBountySection'))return;
 const p=Math.min(100,100*s.forestBountyKills/3);const sec=document.createElement('div');sec.className='lqPauseSection lqBountySection';sec.innerHTML=`<h3>BOUNTY <span class=lqQuestBadge>OPTIONAL</span></h3><div class=lqGoodDetail><b style="color:#e3cb8d">魔物の森・安全確認</b><br>森の魔物を3体討伐する。 ${s.forestBountyKills}/3</div><div class=lqBountyProgress><i style="width:${p}%"></i></div>`;const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const worldV101=world;world=function(){worldV101();addBountyMenu();};const renderV101=render;render=function(){const r=renderV101();addBountyMenu();return r;};
window.LQ_BOUNTY_STATUS={forestBounty:{target:3,rewardGold:50}};
save();if(s.screen==='world')render();
})();
