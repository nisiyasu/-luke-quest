(() => {
'use strict';

/* LUKE QUEST v0.93 defeat recovery presentation.
   Adds a proper defeat beat before the existing safe Royal Capital recovery state. */

s.lqDefeatResult=false;
const style=document.createElement('style');
style.textContent=`
.lqDefeatOverlay{position:absolute;inset:0;z-index:61;display:flex;align-items:center;justify-content:center;padding:15px;background:radial-gradient(circle at 50% 42%,#3d2023dd,#030609f4 68%);backdrop-filter:blur(3px)}.lqDefeatPanel{width:min(360px,92%);padding:16px;border-radius:14px;background:linear-gradient(180deg,#24171b,#100e13);border:2px solid #875357;box-shadow:0 17px 40px #000e;text-align:center;animation:lqDefeatIn .38s ease both}@keyframes lqDefeatIn{from{opacity:0;filter:blur(5px);transform:scale(1.04)}to{opacity:1;filter:none;transform:none}}.lqDefeatKicker{color:#806b72;font-size:8px;letter-spacing:.28em}.lqDefeatTitle{font-family:Georgia,serif;color:#d9b4b4;font-size:25px;font-weight:900;margin:4px 0}.lqDefeatCopy{color:#bbaeb1;font-size:10px;line-height:1.6;margin:8px 0 12px}.lqDefeatBtn{width:100%;min-height:48px;border-radius:10px;border:1px solid #8c626655;background:#483036;color:#f1dddd;font-weight:900}.lqDefeatHint{font-size:7px;color:#685b60;margin-top:6px}
`;
document.head.appendChild(style);
function addDefeatOverlay(){if(!s.lqDefeatResult||s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqDefeatOverlay'))return;shell.insertAdjacentHTML('beforeend','<div class=lqDefeatOverlay><div class=lqDefeatPanel><div class=lqDefeatKicker>BATTLE LOST</div><div class=lqDefeatTitle>DEFEATED</div><div class=lqDefeatCopy>意識を失ったルークは、王都の旅人たちに助けられ<br>南門宿まで運ばれた。</div><button class=lqDefeatBtn onclick=lqCloseDefeat()>目を覚ます</button><div class=lqDefeatHint>Aボタンでも続行</div></div></div>');}
window.lqCloseDefeat=function(){s.lqDefeatResult=false;render();};
const enemyTurnV92=enemyTurn;
enemyTurn=function(g=false){const wasBattle=s.screen==='battle',hp=s.hp;const r=enemyTurnV92(g);if(wasBattle&&hp>0&&s.screen==='world'&&s.map==='town'&&s.hp===s.mh&&s.dialog?.name==='南門宿の主人'){s.lqDefeatResult=true;save();addDefeatOverlay();}return r;};
const moveV92=move;move=function(d){if(s.lqDefeatResult){stopMoving();return}return moveV92(d);};
const actionV92=action;action=function(){if(s.lqDefeatResult){stopMoving();return lqCloseDefeat();}return actionV92();};
const worldV92=world;world=function(){worldV92();addDefeatOverlay();};const renderV92=render;render=function(){const r=renderV92();addDefeatOverlay();return r;};
window.LQ_DEFEAT_PRESENTATION_STATUS={overlay:true,recoveryRulesChanged:false};
addDefeatOverlay();
})();
