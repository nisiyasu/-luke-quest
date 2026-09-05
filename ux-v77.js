(() => {
'use strict';

/* LUKE QUEST v0.77 progression readability.
   Adds compact EXP-to-next-level bars to the adventure menu and victory results. */

const style=document.createElement('style');
style.textContent=`
.lqExpProgress{margin-top:7px}.lqExpHead{display:flex;justify-content:space-between;color:#8398aa;font-size:8px;margin-bottom:3px}.lqExpHead b{color:#d7e1e7;font-size:8px}.lqExpTrack{height:6px;border-radius:99px;background:#172634;border:1px solid #ffffff0f;overflow:hidden}.lqExpFill{height:100%;border-radius:99px;background:linear-gradient(90deg,#6f61b4,#a68be2);box-shadow:0 0 7px #987bd277;transition:width .2s}.lqVictoryExp{margin:7px 0 2px;padding:7px;border-radius:8px;background:#081520;border:1px solid #ffffff12;text-align:left}.lqVictoryExp .lqExpHead{margin-bottom:4px}
`;
document.head.appendChild(style);

function expPct(){return Math.max(0,Math.min(100,100*(s.xp||0)/Math.max(1,s.nx||1)));}
function barMarkup(){return `<div class=lqExpHead><span>EXP TO NEXT</span><b>${s.xp||0} / ${s.nx||1}</b></div><div class=lqExpTrack><div class=lqExpFill style="width:${expPct()}%"></div></div>`;}
function addProgressBars(){
 if(s.screen==='world'&&s.pauseOpen){
   const hero=app.querySelector('.lqPauseHeroCopy');if(hero&&!hero.querySelector('.lqExpProgress')){const d=document.createElement('div');d.className='lqExpProgress';d.innerHTML=barMarkup();hero.appendChild(d);}
 }
 if(s.screen==='world'&&s.victoryResult){
   const panel=app.querySelector('.lqVictoryPanel');const rewards=panel?.querySelector('.lqVictoryRewards');if(panel&&rewards&&!panel.querySelector('.lqVictoryExp')){const d=document.createElement('div');d.className='lqVictoryExp';d.innerHTML=barMarkup();rewards.after(d);}
 }
}
const worldV76=world;world=function(){worldV76();addProgressBars();};
const renderV76=render;render=function(){const r=renderV76();addProgressBars();return r;};
window.LQ_EXP_UI_STATUS={menuBar:true,victoryBar:true};
addProgressBars();
})();
