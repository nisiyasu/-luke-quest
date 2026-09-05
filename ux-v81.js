(() => {
'use strict';

/* LUKE QUEST v0.81 first optional sidequest.
   Adds a small Royal Capital -> field -> Royal Capital loop independent of locked main-story canon. */

s.flags=s.flags||{};
s.flags.elderCharmQuest??=false;
s.flags.elderCharmFound??=false;
s.flags.elderCharmComplete??=false;

const CHARM={x:4,y:15,kind:'lqSilverClasp',name:'銀色の留め具'};
if(!MAPS.field.npcs.some(n=>n.kind===CHARM.kind))MAPS.field.npcs.push({...CHARM,e:'',text:''});

const visibleNpcsV80=visibleNpcs;
visibleNpcs=function(m){return visibleNpcsV80(m).filter(n=>n.kind!==CHARM.kind||s.flags.elderCharmQuest&&!s.flags.elderCharmFound);};
const npcClassV80=npcClass;
npcClass=function(n){return n?.kind===CHARM.kind?'npc lqSilverClasp':npcClassV80(n);};

const style=document.createElement('style');
style.textContent=`
.lqSilverClasp{width:38px;height:42px;font-size:0;filter:none}.lqSilverClasp:before{content:"";position:absolute;left:10px;top:10px;width:19px;height:22px;border:3px solid #dce5ea;border-radius:50% 50% 45% 45%;box-shadow:inset 0 0 0 3px #647482,0 0 8px #d9efff88;transform:rotate(18deg)}.lqSilverClasp:after{content:"";position:absolute;left:17px;top:4px;width:6px;height:9px;border-radius:3px;background:#e8eef0;border:1px solid #768691;box-shadow:0 25px 0 -1px #b7c3c9;animation:lqClaspGlint 1.5s ease-in-out infinite alternate}@keyframes lqClaspGlint{to{filter:brightness(1.55);box-shadow:0 25px 0 -1px #dce7eb,0 0 7px #fff}}
.lqQuestBadge{display:inline-block;padding:2px 5px;margin-left:5px;border-radius:999px;background:#3e3420;color:#efd982;font-size:7px;font-weight:950;letter-spacing:.08em}
`;
document.head.appendChild(style);

function elderAhead(){if(s.screen!=='world'||s.map!=='town')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.name==='旅好きの老人');}
function claspAhead(){if(s.screen!=='world'||s.map!=='field')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind===CHARM.kind);}
function handleElderQuest(){
 stopMoving();
 if(s.flags.elderCharmComplete){s.dialog={name:'旅好きの老人',text:'あの留め具はまた旅に連れていくよ。物は帰ってきたが、拾ってくれた人への借りは残る。\nルーク「借りは薬草でも歓迎です。」'};return render();}
 if(s.flags.elderCharmFound){s.flags.elderCharmComplete=true;s.gold+=30;s.potions+=1;save();s.dialog={name:'旅好きの老人',text:'「これだ。長い旅でずっと使ってきた銀留め具だ。」\nお礼に 30G と 薬草1個を受け取った。\nルーク「勇者の仕事より、こういうのの方が向いてる気がします。」'};return render();}
 if(!s.flags.elderCharmQuest){s.flags.elderCharmQuest=true;save();s.dialog={name:'旅好きの老人',text:'王都近郊で銀色の留め具を落としてしまってな。南門を出て、街道から少し西へ外れた草地だ。\n急ぎではない。見つけたら持ってきてくれ。\nルーク「魔王討伐より具体的で助かります。」'};return render();}
 s.dialog={name:'旅好きの老人',text:'銀留め具は王都近郊の街道から少し西だ。草に紛れるが、日が当たれば光るはずだ。'};render();
}
function collectClasp(){stopMoving();s.flags.elderCharmFound=true;save();s.dialog={name:'銀色の留め具',text:'草むらで古い銀留め具を見つけた。細かな傷が多いが、大切に使われていたようだ。\n王都の旅好きの老人へ届けよう。'};render();}

const actionV80=action;
action=function(){if(!s.dialog&&claspAhead())return collectClasp();if(!s.dialog&&elderAhead())return handleElderQuest();return actionV80();};

function addQuestJournal(){
 if(!s.pauseOpen||!s.flags.elderCharmQuest||s.flags.elderCharmComplete)return;
 const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqSideQuestSection'))return;
 const sec=document.createElement('div');sec.className='lqPauseSection lqSideQuestSection';sec.innerHTML=`<h3>SIDE QUEST <span class=lqQuestBadge>OPTIONAL</span></h3><div class=lqGoodDetail><b style="color:#e8d18b">旅人の銀留め具</b><br>${s.flags.elderCharmFound?'留め具を見つけた。王都の旅好きの老人へ返そう。':'王都近郊の街道西側で、銀色に光る落とし物を探そう。'}</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const worldV80=world;world=function(){worldV80();addQuestJournal();};
const renderV80=render;render=function(){const r=renderV80();addQuestJournal();return r;};
window.LQ_SIDEQUEST_STATUS={elderSilverClasp:true,reward:'30G + 薬草1'};
if(s.screen==='world')render();
})();
