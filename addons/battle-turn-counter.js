(() => {
'use strict';

/* Collision-safe add-on: compact battle turn counter for command readability. */
const style=document.createElement('style');style.textContent=`.lqTurnCounter{position:absolute;z-index:9;right:10px;top:44px;padding:3px 7px;border-radius:999px;background:#081421cc;border:1px solid #ffffff18;color:#879caf;font-size:7px;font-weight:900;letter-spacing:.12em;pointer-events:none}.lqTurnCounter b{color:#e7d58c;font-size:9px;margin-left:3px}`;document.head.appendChild(style);
function addCounter(){if(s.screen!=='battle')return;const scene=app.querySelector('.battleScene');if(!scene||scene.querySelector('.lqTurnCounter'))return;const e=document.createElement('div');e.className='lqTurnCounter';e.innerHTML=`TURN <b>${Math.max(1,(s.lqBattleMeta?.turns||0)+1)}</b>`;scene.appendChild(e);}
const battleT=battle;battle=function(){const r=battleT();addCounter();return r;};const renderT=render;render=function(){const r=renderT();addCounter();return r;};window.LQ_BATTLE_TURN_STATUS={visible:true};if(s.screen==='battle')addCounter();
})();
