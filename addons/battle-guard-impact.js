(() => {
'use strict';

/* Presentation-only battle feedback: guarding now produces a brief shield stance pulse. */
const style=document.createElement('style');style.textContent=`
.lqGuardPulse{position:absolute;z-index:35;left:50%;bottom:18%;width:108px;height:108px;transform:translateX(-50%);pointer-events:none;animation:lqGuardPulse .52s ease-out forwards}.lqGuardPulse:before{content:'';position:absolute;inset:10px;border:3px solid #b9d7ed;border-radius:50%;box-shadow:0 0 0 4px #6c9cb044,0 0 22px #a9d9f188,inset 0 0 18px #8cc0dc44}.lqGuardPulse:after{content:'';position:absolute;left:34px;top:24px;width:40px;height:49px;clip-path:polygon(50% 0,92% 14%,84% 70%,50% 100%,16% 70%,8% 14%);background:linear-gradient(135deg,#dcebf1,#7898a8 55%,#b6ced8);border:2px solid #eef7fa;filter:drop-shadow(0 4px 4px #0007)}@keyframes lqGuardPulse{0%{opacity:0;transform:translateX(-50%) scale(.75)}25%{opacity:1;transform:translateX(-50%) scale(1.04)}100%{opacity:0;transform:translateX(-50%) scale(1.18)}}@media(prefers-reduced-motion:reduce){.lqGuardPulse{animation:none;opacity:.7}}
`;
document.head.appendChild(style);
function pulse(){if(s.screen!=='battle')return;const shell=app.querySelector('.gameShell')||app.querySelector('.card');if(!shell)return;const old=shell.querySelector('.lqGuardPulse');old?.remove();const e=document.createElement('div');e.className='lqGuardPulse';shell.appendChild(e);setTimeout(()=>e.remove(),650);}
const guardBase=guard;guard=function(){const r=guardBase();if(s.screen==='battle')setTimeout(pulse,0);return r;};
window.LQ_GUARD_FEEDBACK_STATUS={active:true,presentationOnly:true,reducedMotion:true};
})();