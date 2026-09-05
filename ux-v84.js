(() => {
'use strict';

/* LUKE QUEST v0.84 sidequest completion presentation. */

let questCompleteToast=false;
const style=document.createElement('style');
style.textContent=`
.lqQuestComplete{position:absolute;z-index:60;left:50%;top:28%;transform:translate(-50%,-50%);width:min(330px,86%);padding:13px;border-radius:13px;background:linear-gradient(180deg,#263822f5,#101d18f5);border:2px solid #dfc267;box-shadow:0 12px 34px #000c,inset 0 0 25px #e0c65b14;text-align:center;pointer-events:none;animation:lqQuestComplete 2.05s ease both}.lqQuestComplete small{display:block;color:#9fb0a3;font-size:8px;letter-spacing:.2em}.lqQuestComplete b{display:block;color:#ffe99e;font-family:Georgia,serif;font-size:18px;margin:3px 0}.lqQuestComplete span{display:block;color:#bed1c2;font-size:9px}@keyframes lqQuestComplete{0%{opacity:0;transform:translate(-50%,-40%) scale(.94)}12%,82%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-58%) scale(.98)}}
`;
document.head.appendChild(style);
function showQuestComplete(){if(!questCompleteToast||s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell)return;questCompleteToast=false;const el=document.createElement('div');el.className='lqQuestComplete';el.innerHTML='<small>SIDE QUEST COMPLETE</small><b>旅人の銀留め具</b><span>30G ＋ 薬草1個</span>';shell.appendChild(el);window.LQ_sfx?.('chest');setTimeout(()=>el.remove(),2100);}
const actionV83=action;
action=function(){const before=!!s.flags?.elderCharmComplete;const r=actionV83();if(!before&&s.flags?.elderCharmComplete){questCompleteToast=true;requestAnimationFrame(showQuestComplete);}return r;};
const worldV83=world;world=function(){worldV83();showQuestComplete();};
const renderV83=render;render=function(){const r=renderV83();showQuestComplete();return r;};
window.LQ_SIDEQUEST_PRESENTATION_STATUS={completionBanner:true};
})();
