(() => {
'use strict';

/* LUKE QUEST v0.76 investigation discovery feedback.
   Announces newly unlocked clue-journal evidence without exposing future/hidden canon. */

const CLUE_FLAGS={
 leonSeen:'レオンを発見',
 glennTraceSeen:'接触禁止命令',
 observationEntered:'魔王軍の監視区域',
 glennSeen:'グレンの不可解な態度',
 leonInjurySeen:'レオンの負傷痕',
 escapeProofSeen:'外された封鎖杭',
 withdrawProofSeen:'追撃禁止の撤収命令'
};
let clueToast=null;

const style=document.createElement('style');
style.textContent=`
.lqClueToast{position:absolute;z-index:59;right:10px;top:78px;width:min(260px,72%);padding:8px 10px 8px 35px;border-radius:10px;background:linear-gradient(135deg,#1d1d2fef,#101928ef);border:1px solid #c9a85e77;box-shadow:0 8px 23px #000b;pointer-events:none;animation:lqClueToast 1.8s ease both}.lqClueToast:before{content:"?";position:absolute;left:9px;top:10px;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#66542d;color:#ffe8a1;border:1px solid #c7a85c;font-weight:950;font-size:10px}.lqClueToast small{display:block;color:#8196aa;font-size:7px;letter-spacing:.15em}.lqClueToast b{display:block;color:#f5dfa0;font-size:10px;margin-top:2px}@keyframes lqClueToast{0%{opacity:0;transform:translateX(12px)}12%,80%{opacity:1;transform:none}100%{opacity:0;transform:translateX(5px)}}
`;
document.head.appendChild(style);

function snapshot(){return Object.fromEntries(Object.keys(CLUE_FLAGS).map(k=>[k,!!s.flags?.[k]]));}
function detect(before){for(const [k,label] of Object.entries(CLUE_FLAGS))if(!before[k]&&s.flags?.[k]){clueToast=label;break;}}
function showClueToast(){
 if(!clueToast||s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell)return;
 const old=shell.querySelector('.lqClueToast');if(old)old.remove();const label=clueToast;clueToast=null;
 const el=document.createElement('div');el.className='lqClueToast';el.innerHTML=`<small>NEW INVESTIGATION CLUE</small><b>${label}</b>`;shell.appendChild(el);if(window.LQ_sfx)window.LQ_sfx('menu');setTimeout(()=>el.remove(),1850);
}
const actionV75=action;action=function(){const before=snapshot();const r=actionV75();detect(before);requestAnimationFrame(showClueToast);return r;};
const checkGateV75=checkGate;checkGate=function(){const before=snapshot();const r=checkGateV75();detect(before);requestAnimationFrame(showClueToast);return r;};
const worldV75=world;world=function(){worldV75();showClueToast();};
const renderV75=render;render=function(){const r=renderV75();showClueToast();return r;};
window.LQ_CLUE_DISCOVERY_STATUS={unlockToast:true,flags:Object.keys(CLUE_FLAGS)};
})();
