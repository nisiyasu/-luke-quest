(() => {
'use strict';

/* LUKE QUEST v0.86 enemy drop-table seed.
   Adds a lightweight herb-drop layer to regular battles and reports it in victory results. */

const DROP_RATE_BY_MAP={field:.10,forest:.14,deepForest:.16,mistTrail:.15,observation:.12,evacRoute:.13,cliffRoad:.14};

const style=document.createElement('style');
style.textContent=`
.lqVictoryDrop{margin:6px 0;padding:7px 9px;border-radius:8px;background:linear-gradient(90deg,#173323,#10251b);border:1px solid #6fbd7e44;color:#bce9c4;font-size:9px;font-weight:900;text-align:left}.lqVictoryDrop b{color:#e7f4d8;margin-left:5px}.lqDropSpark{display:inline-block;color:#dceb8c;margin-right:4px;animation:lqDropSpark .75s ease-in-out infinite alternate}@keyframes lqDropSpark{to{filter:brightness(1.5);transform:scale(1.12)}}
`;
document.head.appendChild(style);

function addDropToVictory(){
 const v=s.victoryResult;if(!v?.drop)return;
 const panel=app.querySelector('.lqVictoryPanel');const rewards=panel?.querySelector('.lqVictoryRewards');if(!panel||!rewards||panel.querySelector('.lqVictoryDrop'))return;
 const d=document.createElement('div');d.className='lqVictoryDrop';d.innerHTML=`<span class=lqDropSpark>✦</span>DROP <b>${v.drop}</b>`;rewards.after(d);
}

const winV85=win;
win=function(){
 const mapBefore=s.map;const enemyBefore=s.enemy?.n;const roll=enemyBefore&&Math.random()<(DROP_RATE_BY_MAP[mapBefore]||.1);
 const r=winV85();
 if(roll&&s.screen==='world'){
   s.potions=(s.potions||0)+1;
   if(s.victoryResult)s.victoryResult.drop='薬草 ×1';
   save();addDropToVictory();
 }
 return r;
};
const worldV85=world;world=function(){worldV85();addDropToVictory();};
const renderV85=render;render=function(){const r=renderV85();addDropToVictory();return r;};
window.LQ_DROP_TABLE_STATUS={item:'薬草',rates:DROP_RATE_BY_MAP};
addDropToVictory();
})();
