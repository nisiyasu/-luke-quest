(() => {
'use strict';

const QUARANTINE_KEY='lukeQuestAutosaveQuarantineV1';
const NOTICE_DISMISSED_KEY='lukeQuestAutosaveQuarantineNoticeDismissedV1';
const FORMAT='LUKE_QUEST_AUTOSAVE_QUARANTINE_RECOVERY';
const VERSION=1;

function readQuarantine(){
 let rawRecord;
 try{rawRecord=localStorage.getItem(QUARANTINE_KEY);}catch{return null;}
 if(!rawRecord)return null;
 let record;
 try{record=JSON.parse(rawRecord);}catch{return null;}
 if(!record||typeof record!=='object'||Array.isArray(record))return null;
 if(typeof record.raw!=='string'||!record.raw.length)return null;
 const reason=typeof record.reason==='string'&&record.reason?record.reason:'unknown';
 const timestamp=typeof record.timestamp==='string'&&record.timestamp?record.timestamp:null;
 return{reason,timestamp,raw:record.raw,storedRecord:rawRecord};
}
function quarantineSignature(q){
 if(!q)return'';
 let h=2166136261;
 const source=`${q.timestamp||''}|${q.reason}|${q.raw}`;
 for(let i=0;i<source.length;i++){h^=source.charCodeAt(i);h=Math.imul(h,16777619);}
 return(h>>>0).toString(16).padStart(8,'0');
}
function isDismissed(q){
 const sig=quarantineSignature(q);if(!sig)return true;
 try{return localStorage.getItem(NOTICE_DISMISSED_KEY)===sig;}catch{return false;}
}
function dismiss(q){
 const sig=quarantineSignature(q);if(!sig)return;
 try{localStorage.setItem(NOTICE_DISMISSED_KEY,sig);}catch{}
 document.querySelector('.lqQuarantineNotice')?.remove();
}
function recoveryPackage(q){
 if(!q)throw new Error('quarantine unavailable');
 return JSON.stringify({
  format:FORMAT,
  version:VERSION,
  exportedAt:new Date().toISOString(),
  quarantine:{timestamp:q.timestamp,reason:q.reason,raw:q.raw}
 },null,2)+'\n';
}
function recoveryFileName(now=new Date()){
 return`luke-quest-quarantine-${now.toISOString().replace(/[:.]/g,'-')}.json`;
}
function downloadRecovery(q){
 try{
  const payload=recoveryPackage(q),blob=new Blob([payload],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=recoveryFileName();a.hidden=true;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);return true;
 }catch{return false;}
}
function safeTime(timestamp){
 if(!timestamp)return'日時不明';
 const d=new Date(timestamp);if(Number.isNaN(d.getTime()))return timestamp;
 try{return d.toLocaleString('ja-JP');}catch{return timestamp;}
}
function addNotice(){
 if(s.screen!=='title')return;
 if(app.querySelector('.lqQuarantineNotice'))return;
 const q=readQuarantine();if(!q||isDismissed(q))return;
 const stage=app.querySelector('.lqTitleStage')||app.querySelector('.card');if(!stage)return;
 const notice=document.createElement('section');notice.className='lqQuarantineNotice';notice.setAttribute('role','status');
 const title=document.createElement('strong');title.textContent='SAVE RECOVERY';
 const message=document.createElement('p');message.textContent='前回のローカルセーブは安全に読み込めなかったため隔離しました。元データは残っています。';
 const meta=document.createElement('small');meta.textContent=`理由: ${q.reason} / ${safeTime(q.timestamp)}`;
 const actions=document.createElement('div');actions.className='lqQuarantineActions';
 const dl=document.createElement('button');dl.type='button';dl.className='download';dl.textContent='DOWNLOAD QUARANTINE';
 const close=document.createElement('button');close.type='button';close.className='dismiss';close.textContent='DISMISS NOTICE';
 const feedback=document.createElement('span');feedback.className='lqQuarantineFeedback';feedback.setAttribute('aria-live','polite');
 dl.addEventListener('click',()=>{feedback.textContent=downloadRecovery(q)?'隔離データを書き出しました。':'書き出しに失敗しました。隔離データは削除していません。';});
 close.addEventListener('click',()=>dismiss(q));
 actions.append(dl,close);notice.append(title,message,meta,actions,feedback);stage.appendChild(notice);
}

const style=document.createElement('style');style.textContent=`
.lqQuarantineNotice{margin:7px auto 0;max-width:360px;padding:9px;border-radius:10px;border:1px solid #ffbd5d66;background:linear-gradient(180deg,#2a1c0dd9,#130e09e8);color:#f5e9d5;text-align:left;box-shadow:0 8px 22px #0007}.lqQuarantineNotice strong{display:block;color:#ffd17a;font-size:9px;letter-spacing:.12em}.lqQuarantineNotice p{margin:5px 0 4px;font-size:8px;line-height:1.45}.lqQuarantineNotice small{display:block;color:#cbb99d;font-size:7px;line-height:1.35;overflow-wrap:anywhere}.lqQuarantineActions{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:7px}.lqQuarantineActions button{min-height:34px;border:1px solid #ffffff20;border-radius:8px;background:#49331d;color:#ffe7bd;font-size:7px;font-weight:900}.lqQuarantineFeedback{display:block;min-height:11px;margin-top:4px;color:#d9c39f;font-size:7px;line-height:1.3}
`;document.head.appendChild(style);

const titleBase=title;title=function(){const out=titleBase();addNotice();return out;};
const renderBase=render;render=function(){const out=renderBase();addNotice();return out;};
window.LQ_AUTOSAVE_QUARANTINE_RECOVERY_STATUS={format:FORMAT,version:VERSION,key:QUARANTINE_KEY,dismissedKey:NOTICE_DISMISSED_KEY,readQuarantine,quarantineSignature,isDismissed,dismiss,recoveryPackage,recoveryFileName,downloadRecovery,addNotice};
addNotice();
})();
