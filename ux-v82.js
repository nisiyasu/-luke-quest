(() => {
'use strict';

/* LUKE QUEST v0.82 sidequest NPC marker.
   Adds classic quest-state punctuation above the Royal Capital elder. */

const style=document.createElement('style');
style.textContent=`
.npc.lqQuestNpc:before{content:"!";position:absolute;left:50%;top:-18px;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#e1bc4d;color:#18202a;border:2px solid #fff1ad;box-shadow:0 3px 8px #0009;font-size:11px;font-weight:1000;z-index:21;animation:lqQuestMark .75s ease-in-out infinite alternate}@keyframes lqQuestMark{to{translate:0 -2px}}.npc.lqQuestNpc.ready:before{content:"?";background:#62b779;color:#07170d;border-color:#b9f1c6}.npc.lqQuestNpc.done:before{content:"✓";background:#556979;color:#d7e1e8;border-color:#8da0ae;animation:none}
`;
document.head.appendChild(style);

function markQuestElder(){
 if(s.screen!=='world'||s.map!=='town')return;
 const elder=MAPS.town.npcs.find(n=>n.name==='旅好きの老人');if(!elder)return;
 const left=elder.x*TS+5,top=elder.y*TS+3;
 for(const el of app.querySelectorAll('.world .npc')){
   if(Math.abs(parseFloat(el.style.left)-left)>1||Math.abs(parseFloat(el.style.top)-top)>1)continue;
   el.classList.add('lqQuestNpc');
   if(s.flags?.elderCharmComplete)el.classList.add('done');else if(s.flags?.elderCharmFound)el.classList.add('ready');
   break;
 }
}
const worldV81=world;world=function(){worldV81();markQuestElder();};
const renderV81=render;render=function(){const r=renderV81();if(s.screen==='world')markQuestElder();return r;};
window.LQ_SIDEQUEST_MARKER_STATUS={offer:'!',returnReady:'?',complete:'check'};
if(s.screen==='world')markQuestElder();
})();
