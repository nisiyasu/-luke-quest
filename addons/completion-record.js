(() => {
'use strict';

/* Collision-safe add-on: completed side-content record in the adventure menu. */
const style=document.createElement('style');
style.textContent=`.lqCompletionRows{display:grid;gap:5px}.lqCompletionRow{display:flex;justify-content:space-between;gap:8px;padding:6px 7px;border-radius:7px;background:#10251d;border:1px solid #79b48533;color:#b9d4bf;font-size:8px}.lqCompletionRow b{color:#e6dda6}.lqCompletionCheck{color:#7ed18e;font-weight:1000}`;
document.head.appendChild(style);

const COMPLETION_DEFS=[
 {flag:'elderCharmComplete',type:'SIDE QUEST',name:'旅人の銀留め具'},
 {flag:'forestBountyComplete',type:'BOUNTY',name:'魔物の森・安全確認'},
 {flag:'lqHerbSampleQuestDone',type:'SIDE QUEST',name:'森の薬草標本'}
];

function completionRows(flags=s.flags||{}){
 return COMPLETION_DEFS.filter(def=>flags?.[def.flag]).map(def=>[def.type,def.name,def.flag]);
}

function addCompletionRecord(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const done=completionRows();
 if(!done.length)return;
 const panel=app.querySelector('.lqPausePanel');
 if(!panel||panel.querySelector('.lqCompletionSection'))return;
 const sec=document.createElement('div');
 sec.className='lqPauseSection lqCompletionSection';
 sec.innerHTML=`<h3>COMPLETED</h3><div class=lqCompletionRows>${done.map(([type,name,flag])=>`<div class=lqCompletionRow data-completion-flag="${flag}"><span><b>${type}</b>　${name}</span><span class=lqCompletionCheck>✓</span></div>`).join('')}</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');
 panel.insertBefore(sec,buttons);
}

const worldC=world;
world=function(){worldC();addCompletionRecord();};
const renderC=render;
render=function(){const r=renderC();addCompletionRecord();return r;};

window.LQ_COMPLETION_RECORD_STATUS={
 presentationOnly:true,
 canonicalFlags:COMPLETION_DEFS.map(x=>x.flag),
 supports:{elderCharm:true,forestBounty:true,forestHerbSample:true},
 rowBuilder:completionRows,
 noQuestMutation:true
};
if(s.pauseOpen)addCompletionRecord();
})();