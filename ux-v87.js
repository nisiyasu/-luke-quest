(() => {
'use strict';

/* LUKE QUEST v0.87 discovered-enemy bestiary.
   Records encountered enemies and exposes only discovered entries in the adventure menu. */

s.seenEnemies=Array.isArray(s.seenEnemies)?Array.from(new Set(s.seenEnemies)):[];
const ALL_ENEMY_NAMES=[...ENEMIES,...FOREST_ENEMIES,...DEEP_ENEMIES,...MIST_ENEMIES,...OBS_ENEMIES,...EVAC_ENEMIES].map(e=>e.n);

const startBattleV86=startBattle;
startBattle=function(){const r=startBattleV86();if(s.enemy&&!s.seenEnemies.includes(s.enemy.n)){s.seenEnemies.push(s.enemy.n);save();}return r;};

const style=document.createElement('style');
style.textContent=`
.lqBestiaryGrid{display:grid;grid-template-columns:1fr 1fr;gap:5px}.lqBestiaryEntry{padding:5px 7px;border-radius:7px;background:#0b1b27;border:1px solid #ffffff10;color:#c5d3dc;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lqBestiaryEntry:before{content:"◆";color:#718ba0;font-size:6px;margin-right:5px}.lqBestiaryCount{float:right;color:#8399ab;font-size:8px}.lqBestiaryEmpty{color:#71879a;font-size:9px}.lqBestiaryHint{font-size:7px;color:#60778b;margin-top:6px;text-align:right}
`;
document.head.appendChild(style);

function addBestiary(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqBestiarySection'))return;
 const seen=s.seenEnemies.filter(n=>ALL_ENEMY_NAMES.includes(n));const sec=document.createElement('div');sec.className='lqPauseSection lqBestiarySection';
 sec.innerHTML=`<h3>MONSTER RECORD <span class=lqBestiaryCount>${seen.length}/${ALL_ENEMY_NAMES.length}</span></h3>${seen.length?`<div class=lqBestiaryGrid>${seen.map(n=>`<div class=lqBestiaryEntry>${n}</div>`).join('')}</div>`:'<div class=lqBestiaryEmpty>まだ魔物と遭遇していない。</div>'}<div class=lqBestiaryHint>遭遇した魔物のみ記録</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const worldV86=world;world=function(){worldV86();addBestiary();};
const renderV86=render;render=function(){const r=renderV86();addBestiary();return r;};
window.LQ_BESTIARY_STATUS={discoveryOnly:true,totalCoreEnemies:ALL_ENEMY_NAMES.length};
save();if(s.pauseOpen)addBestiary();
})();
