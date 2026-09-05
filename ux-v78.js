(() => {
'use strict';

/* LUKE QUEST v0.78 level-up feedback.
   Shows concrete stat growth when a victory crosses the next-level threshold. */

const style=document.createElement('style');
style.textContent=`
.lqLevelStats{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:6px 0}.lqLevelStat{padding:5px 6px;border-radius:7px;background:#172a22;border:1px solid #7ec28d33;color:#aee6b8;font-size:8px}.lqLevelStat b{display:block;color:#eef8ee;font-size:10px;margin-top:1px}.lqLevelHeal{grid-column:1/-1;color:#bee9d0;background:#173229}
`;
document.head.appendChild(style);

function addLevelStats(){
 const v=s.victoryResult;if(!v?.levelUp||!v.statGain)return;
 const panel=app.querySelector('.lqVictoryPanel');const level=panel?.querySelector('.lqVictoryLevel');if(!panel||!level||panel.querySelector('.lqLevelStats'))return;
 const g=v.statGain;const d=document.createElement('div');d.className='lqLevelStats';d.innerHTML=`<div class=lqLevelStat>MAX HP<b>+${g.maxHp}</b></div><div class=lqLevelStat>ATK<b>+${g.atk}</b></div><div class="lqLevelStat lqLevelHeal">HP FULL RECOVERY　${s.hp}/${s.mh}</div>`;level.after(d);
}

const winV77=win;
win=function(){
 const before={lv:s.lv,mh:s.mh,atk:s.atk};const r=winV77();
 if(s.victoryResult&&s.lv>before.lv){s.victoryResult.statGain={maxHp:s.mh-before.mh,atk:s.atk-before.atk};addLevelStats();}
 return r;
};
const worldV77=world;world=function(){worldV77();addLevelStats();};
const renderV77=render;render=function(){const r=renderV77();addLevelStats();return r;};
window.LQ_LEVELUP_PRESENTATION_STATUS={statBreakdown:true,fullHealShown:true};
addLevelStats();
})();
