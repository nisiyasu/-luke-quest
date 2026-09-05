(() => {
'use strict';

/* Collision-safe add-on: optional boss bestiary record. */
const BOSS_NAME='苔角の森王';
const style=document.createElement('style');style.textContent=`
.lqBossBestiary{grid-column:1/-1!important;background:linear-gradient(135deg,#202b1b,#111b14)!important;border-color:#8ca65d55!important}.lqBossBestiary .lqMonsterHead span:before{content:"BOSS ";display:inline-block;margin-right:5px;padding:1px 4px;border-radius:999px;background:#5b6737;color:#e5efa8;font-size:6px;letter-spacing:.08em}.lqBossBestiary .lqMonsterArea{color:#9eb875!important}
`;document.head.appendChild(style);
function addBossRecord(){
 if(!s.pauseOpen||!s.seenEnemies?.includes(BOSS_NAME))return;const grid=app.querySelector('.lqBestiaryGrid');if(!grid||grid.querySelector('.lqBossBestiary'))return;const kills=s.enemyDefeats?.[BOSS_NAME]||0;const e=document.createElement('div');e.className='lqBestiaryEntry lqDetailed lqBossBestiary';e.innerHTML=`<div class=lqMonsterHead><span>${BOSS_NAME}</span><em>×${kills}</em></div><div class=lqMonsterMeta><span>HP <b>72</b></span><span>ATK <b>7-11</b></span><span>EXP <b>45</b></span><span>G <b>60</b></span><span class=lqMonsterArea>魔物の森・任意強敵</span></div>`;grid.appendChild(e);
}
const worldBB=world;world=function(){worldBB();addBossRecord();};const renderBB=render;render=function(){const r=renderBB();queueMicrotask(addBossRecord);return r;};window.LQ_BOSS_BESTIARY_STATUS={forestLord:true};addBossRecord();
})();
