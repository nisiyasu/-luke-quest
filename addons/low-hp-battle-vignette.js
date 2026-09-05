(() => {
'use strict';

/* Collision-safe add-on: low-HP battle danger vignette. Presentation only. */
const style=document.createElement('style');style.textContent=`
.lqLowHpVignette{position:absolute;inset:0;z-index:31;pointer-events:none;border-radius:inherit;opacity:0;box-shadow:inset 0 0 44px 18px #781d2a00;transition:opacity .18s ease}.lqLowHpVignette.on{opacity:1;animation:lqLowHpPulse 1.25s ease-in-out infinite}@keyframes lqLowHpPulse{0%,100%{box-shadow:inset 0 0 42px 14px #7c18284d}50%{box-shadow:inset 0 0 58px 22px #9e21376b}}@media (prefers-reduced-motion:reduce){.lqLowHpVignette.on{animation:none;box-shadow:inset 0 0 44px 16px #8b203455}}
`;document.head.appendChild(style);
function sync(){const shell=app.querySelector('.gameShell');if(!shell)return;let el=shell.querySelector('.lqLowHpVignette');if(!el){el=document.createElement('div');el.className='lqLowHpVignette';shell.appendChild(el);}const low=s.screen==='battle'&&Number(s.mh)>0&&Number(s.hp)/Number(s.mh)<=.28;el.classList.toggle('on',!!low);}
const battleBase=battle;battle=function(){const r=battleBase();sync();return r;};const renderBase=render;render=function(){const r=renderBase();sync();return r;};
window.LQ_LOW_HP_VIGNETTE_STATUS={threshold:.28,presentationOnly:true,reducedMotion:true};sync();
})();
