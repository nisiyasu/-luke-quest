(() => {
'use strict';

/* Collision-safe add-on: two manual backup slots alongside continuous autosave. */
const SLOT_KEYS=['lukeQuestManualSlot1','lukeQuestManualSlot2'];
const DANGEROUS_KEYS=new Set(['__proto__','constructor','prototype']);
function isPlainStateObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value);}
function classifyPayload(value){return isPlainStateObject(value)?'valid':'invalid';}
function sanitizeStateObject(value){
 const out={};
 if(!isPlainStateObject(value))return out;
 for(const key of Object.keys(value)){if(!DANGEROUS_KEYS.has(key))out[key]=value[key];}
 return out;
}
function slotRecord(i){
 try{
  const raw=localStorage.getItem(SLOT_KEYS[i]);
  if(raw===null)return{kind:'empty',data:null};
  const data=JSON.parse(raw);
  return classifyPayload(data)==='valid'?{kind:'valid',data}:{kind:'invalid',data:null};
 }catch{return{kind:'invalid',data:null};}
}
function snapshot(){const copy=JSON.parse(JSON.stringify(s));copy.pauseOpen=false;copy.shopOpen=false;copy.victoryResult=null;copy.lqDefeatResult=false;copy.dialog=null;copy.screen='world';copy.savedAt=new Date().toISOString();return copy;}
function slotSummary(record){
 if(record.kind==='empty')return'EMPTY';
 if(record.kind==='invalid')return'INVALID BACKUP';
 const data=record.data,map=MAPS[data.map]?.name||'王都アルディア',lv=data.lv||1,g=data.gold||0;return`LV ${lv} / ${g}G / ${map}`;
}
window.lqManualSave=function(i){if(i<0||i>=SLOT_KEYS.length||s.screen!=='world')return;localStorage.setItem(SLOT_KEYS[i],JSON.stringify(snapshot()));window.LQ_sfx?.('menu');render();};
window.lqManualLoad=function(i){
 if(i<0||i>=SLOT_KEYS.length)return;
 const record=slotRecord(i);if(record.kind!=='valid')return;
 const data=sanitizeStateObject(record.data),flags=sanitizeStateObject(record.data.flags);
 stopMoving();s=Object.assign({},DEFAULT,data);s.flags=Object.assign({},DEFAULT.flags,flags);if(!MAPS[s.map]){s.map='town';s.x=9;s.y=12;}s.screen='world';s.pauseOpen=false;s.shopOpen=false;s.dialog={name:'SYSTEM',text:`BACKUP SLOT ${i+1} をロードしました。`};encounterGrace=3;save();render();
};
window.lqManualDelete=function(i){if(i<0||i>=SLOT_KEYS.length)return;localStorage.removeItem(SLOT_KEYS[i]);render();};

const style=document.createElement('style');style.textContent=`
.lqSaveSlots{display:grid;gap:6px}.lqSaveSlot{padding:7px;border-radius:9px;background:#0a1926;border:1px solid #ffffff12}.lqSaveSlot.invalid{border-color:#d27c7c66;background:#28191c}.lqSaveSlotHead{display:flex;justify-content:space-between;gap:6px;align-items:center}.lqSaveSlotHead b{color:#e3ce83;font-size:9px}.lqSaveSlotHead span{color:#7f95a7;font-size:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lqSaveSlot.invalid .lqSaveSlotHead span{color:#e0a3a6}.lqSaveSlotBtns{display:grid;grid-template-columns:1fr 1fr auto;gap:5px;margin-top:6px}.lqSaveSlotBtns button{min-height:36px;border-radius:7px;border:1px solid #ffffff18;background:#1b3448;color:#c7d6df;font-size:8px;font-weight:900}.lqSaveSlotBtns .load{background:#294b37;color:#bde2c4;border-color:#69aa7844}.lqSaveSlotBtns .del{width:38px;background:#3c2528;color:#d7b1b3}.lqSaveSlotBtns button:disabled{opacity:.42;filter:saturate(.3)}.lqTitleBackup{position:relative;z-index:3;max-width:360px;margin:5px auto;padding:7px;border-radius:9px;background:#091726b8;border:1px solid #ffffff12}.lqTitleBackup small{display:block;color:#788fa3;font-size:7px;letter-spacing:.1em;margin-bottom:4px}.lqTitleBackup button{width:100%;min-height:38px;border-radius:8px;border:1px solid #ffffff18;background:#1b3448;color:#d4e0e7;font-size:8px;font-weight:900;margin-top:4px;text-align:left;padding:6px 9px}.lqTitleBackup .invalid{background:#321d22;color:#e0a3a6}
`;document.head.appendChild(style);
function addMenuSlots(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqSaveSlotSection'))return;const sec=document.createElement('div');sec.className='lqPauseSection lqSaveSlotSection';sec.innerHTML=`<h3>MANUAL BACKUP</h3><div class=lqSaveSlots>${SLOT_KEYS.map((_,i)=>{const r=slotRecord(i),valid=r.kind==='valid',invalid=r.kind==='invalid';return`<div class="lqSaveSlot ${invalid?'invalid':''}"><div class=lqSaveSlotHead><b>SLOT ${i+1}</b><span>${slotSummary(r)}</span></div><div class=lqSaveSlotBtns><button onclick="lqManualSave(${i})">SAVE</button><button class=load ${valid?'':'disabled'} ${valid?'':'disabled'} onclick="lqManualLoad(${i})">LOAD</button><button class=del ${r.kind==='empty'?'disabled':''} ${r.kind==='empty'?'disabled':''} onclick="lqManualDelete(${i})">×</button></div></div>`}).join('')}</div>`;const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
function addTitleSlots(){
 if(s.screen!=='title')return;const stage=app.querySelector('.lqTitleStage');if(!stage||stage.querySelector('.lqTitleBackup'))return;const found=SLOT_KEYS.map((_,i)=>[i,slotRecord(i)]).filter(([,r])=>r.kind!=='empty');if(!found.length)return;const box=document.createElement('div');box.className='lqTitleBackup';box.innerHTML=`<small>MANUAL BACKUP</small>${found.map(([i,r])=>r.kind==='valid'?`<button onclick="lqManualLoad(${i})">SLOT ${i+1}　${slotSummary(r)}</button>`:`<button class=invalid disabled disabled>SLOT ${i+1}　INVALID BACKUP</button>`).join('')}`;const buttons=stage.querySelector('.lqTitleButtons')||stage;buttons.appendChild(box);
}
const worldM=world;world=function(){worldM();addMenuSlots();};const titleM=title;title=function(){titleM();addTitleSlots();};const renderM=render;render=function(){const r=renderM();addMenuSlots();addTitleSlots();return r;};window.LQ_MANUAL_SAVE_STATUS={slots:2,autosavePreserved:true,validatesSlotShape:true,rejectsMalformedSlots:true,sanitizesDangerousKeys:true,classifyPayload,isPlainStateObject,sanitizeStateObject};addMenuSlots();addTitleSlots();
})();
