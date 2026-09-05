(() => {
'use strict';

/* Collision-safe add-on: completed side-content record in the adventure menu. */
const style=document.createElement('style');
style.textContent=`.lqCompletionRows{display:grid;gap:5px}.lqCompletionRow{display:flex;justify-content:space-between;gap:8px;padding:6px 7px;border-radius:7px;background:#10251d;border:1px solid #79b48533;color:#b9d4bf;font-size:8px}.lqCompletionRow b{color:#e6dda6}.lqCompletionCheck{color:#7ed18e;font-weight:1000}`;document.head.appendChild(style);
function addCompletionRecord(){
 if(!s.pauseOpen||s.screen!=='world')return;const done=[];if(s.flags?.elderCharmComplete)done.push(['SIDE QUEST','旅人の銀留め具']);if(s.flags?.forestBountyComplete)done.push(['BOUNTY','魔物の森・安全確認']);if(!done.length)return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqCompletionSection'))return;const sec=document.createElement('div');sec.className='lqPauseSection lqCompletionSection';sec.innerHTML=`<h3>COMPLETED</h3><div class=lqCompletionRows>${done.map(([type,name])=>`<div class=lqCompletionRow><span><b>${type}</b>　${name}</span><span class=lqCompletionCheck>✓</span></div>`).join('')}</div>`;const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const worldC=world;world=function(){worldC();addCompletionRecord();};const renderC=render;render=function(){const r=renderC();addCompletionRecord();return r;};window.LQ_COMPLETION_RECORD_STATUS={sideQuest:true,bounty:true};if(s.pauseOpen)addCompletionRecord();
})();
