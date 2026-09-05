(() => {
'use strict';

/* LUKE QUEST v0.88 monster defeat records. */

s.enemyDefeats=s.enemyDefeats&&typeof s.enemyDefeats==='object'?s.enemyDefeats:{};
const winV87=win;
win=function(){const name=s.enemy?.n;const r=winV87();if(name){s.enemyDefeats[name]=(s.enemyDefeats[name]||0)+1;save();}return r;};

const style=document.createElement('style');
style.textContent=`
.lqBestiaryEntry{display:flex;justify-content:space-between;gap:5px}.lqBestiaryEntry em{font-style:normal;color:#e1c972;font-size:7px;flex:0 0 auto}
`;
document.head.appendChild(style);
function decorateBestiaryCounts(){
 if(!s.pauseOpen)return;for(const el of app.querySelectorAll('.lqBestiaryEntry')){if(el.dataset.kills==='1')continue;const raw=el.textContent.trim();const count=s.enemyDefeats?.[raw]||0;el.dataset.kills='1';el.innerHTML=`<span>${raw}</span><em>×${count}</em>`;}
}
const worldV87=world;world=function(){worldV87();decorateBestiaryCounts();};
const renderV87=render;render=function(){const r=renderV87();decorateBestiaryCounts();return r;};
window.LQ_BESTIARY_STATUS=Object.assign({},window.LQ_BESTIARY_STATUS,{defeatCounts:true});
save();decorateBestiaryCounts();
})();
