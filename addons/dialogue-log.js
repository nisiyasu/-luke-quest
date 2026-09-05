(() => {
'use strict';

/* Collision-safe add-on: recent dialogue log for story readability. */
s.dialogHistory=Array.isArray(s.dialogHistory)?s.dialogHistory.filter(x=>x&&typeof x.text==='string').slice(-30):[];
let lastDialogKey='';
const style=document.createElement('style');style.textContent=`
.lqDialogueHistory{display:grid;gap:5px}.lqDialogueHistoryRow{padding:6px 7px;border-radius:7px;background:#0a1925;border:1px solid #ffffff0e}.lqDialogueHistoryRow b{display:block;color:#dfca82;font-size:8px;margin-bottom:2px}.lqDialogueHistoryRow span{display:block;color:#acbdc8;font-size:8px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.lqDialogueHistoryEmpty{color:#71869a;font-size:8px}.lqDialogueHistoryCount{float:right;color:#71899b;font-size:7px}
`;document.head.appendChild(style);
function captureDialog(){
 const d=s.dialog;if(!d?.text)return;const key=`${d.name||''}|${d.text}`;if(key===lastDialogKey)return;lastDialogKey=key;const prev=s.dialogHistory.at(-1);if(prev&&`${prev.name||''}|${prev.text}`===key)return;s.dialogHistory.push({name:d.name||'SYSTEM',text:d.text});s.dialogHistory=s.dialogHistory.slice(-30);save();
}
function addLog(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqDialogueLogSection'))return;const rows=s.dialogHistory.slice(-8).reverse();const sec=document.createElement('div');sec.className='lqPauseSection lqDialogueLogSection';sec.innerHTML=`<h3>RECENT DIALOGUE <span class=lqDialogueHistoryCount>LAST ${rows.length}</span></h3>${rows.length?`<div class=lqDialogueHistory>${rows.map(x=>`<div class=lqDialogueHistoryRow><b>${String(x.name).replace(/[<>]/g,'')}</b><span>${String(x.text).replace(/[<>]/g,'')}</span></div>`).join('')}</div>`:'<div class=lqDialogueHistoryEmpty>まだ会話記録はありません。</div>'}`;const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const renderD=render;render=function(){captureDialog();const r=renderD();addLog();return r;};const worldD=world;world=function(){worldD();addLog();};window.LQ_DIALOGUE_LOG_STATUS={maxSaved:30,menuVisible:8};save();captureDialog();addLog();
})();
