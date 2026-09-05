(() => {
'use strict';

/* Collision-safe add-on: short battle encounter title card with no battle-mechanic changes. */
const style=document.createElement('style');style.textContent=`
.lqBattleIntro{position:absolute;z-index:58;left:50%;top:16%;transform:translate(-50%,-8px) scale(.98);width:min(86%,430px);padding:12px 18px 11px;text-align:center;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent,#160f18e8 12%,#201420f5 50%,#160f18e8 88%,transparent);border-top:1px solid #d58b6d88;border-bottom:1px solid #d58b6d66;box-shadow:0 10px 25px #0009;transition:opacity .2s ease,transform .2s ease}.lqBattleIntro.show{opacity:1;transform:translate(-50%,0) scale(1)}.lqBattleIntro small{display:block;color:#d9a889;font-size:9px;font-weight:950;letter-spacing:.28em}.lqBattleIntro strong{display:block;margin-top:3px;color:#fff1dc;font-size:20px;font-weight:950;letter-spacing:.05em;text-shadow:0 2px 8px #000}.lqBattleIntro::after{content:'';display:block;width:58px;height:1px;margin:7px auto 0;background:linear-gradient(90deg,transparent,#e4a67e,transparent)}@media (prefers-reduced-motion:reduce){.lqBattleIntro{transition:none}}
`;document.head.appendChild(style);
let lastEnemy='',hideTimer=0;
function showIntro(){
 if(s.screen!=='battle'||!s.enemy)return;const shell=app.querySelector('.gameShell');if(!shell)return;const key=`${s.enemy.n||'ENEMY'}:${s.enemy.hp??''}`;
 if(key===lastEnemy)return;lastEnemy=key;
 let el=shell.querySelector('.lqBattleIntro');if(!el){el=document.createElement('div');el.className='lqBattleIntro';shell.appendChild(el);}el.innerHTML=`<small>ENCOUNTER</small><strong>${s.enemy.n||'UNKNOWN ENEMY'}</strong>`;
 clearTimeout(hideTimer);requestAnimationFrame(()=>el.classList.add('show'));hideTimer=setTimeout(()=>el.classList.remove('show'),1250);
}
const battleBase=battle;battle=function(){const r=battleBase();showIntro();return r;};
const renderBase=render;render=function(){const r=renderBase();if(s.screen!=='battle')lastEnemy='';else showIntro();return r;};
window.LQ_BATTLE_INTRO_STATUS={cinematic:true,mechanicsUntouched:true,reducedMotion:true};
showIntro();
})();
