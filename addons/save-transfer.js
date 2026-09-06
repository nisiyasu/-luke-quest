(() => {
'use strict';

/* REQ-060: explicit portable save-code transfer across browser-local storage boundaries. */
const FORMAT='LUKE_QUEST_SAVE_TRANSFER';
const VERSION=1;
const DANGEROUS_KEYS=new Set(['__proto__','constructor','prototype']);
const manual=window.LQ_MANUAL_SAVE_STATUS||{};
const isPlain=value=>manual.isPlainStateObject?manual.isPlainStateObject(value):!!value&&typeof value==='object'&&!Array.isArray(value);
function sanitize(value){
 if(manual.sanitizeStateObject)return manual.sanitizeStateObject(value);
 const out={};if(!isPlain(value))return out;
 for(const key of Object.keys(value)){if(!DANGEROUS_KEYS.has(key))out[key]=value[key];}
 return out;
}
function normalizeNumerics(value){return manual.normalizeCanonicalNumericTypes?manual.normalizeCanonicalNumericTypes(value,DEFAULT):manual.normalizeNumericStateFields?manual.normalizeNumericStateFields(value,DEFAULT):value;}
function bytesToBase64Url(bytes){
 let binary='';const step=0x8000;
 for(let i=0;i<bytes.length;i+=step)binary+=String.fromCharCode(...bytes.subarray(i,i+step));
 return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function base64UrlToBytes(text){
 const raw=String(text||'').trim().replace(/-/g,'+').replace(/_/g,'/');
 if(!raw||!/^[A-Za-z0-9+/]*={0,2}$/.test(raw+'='.repeat((4-raw.length%4)%4)))throw new Error('SAVE CODE形式が不正です');
 const padded=raw+'='.repeat((4-raw.length%4)%4),binary=atob(padded),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;
}
function encodeEnvelope(envelope){return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(envelope)));}
function decodeEnvelope(code){
 let parsed;
 try{parsed=JSON.parse(new TextDecoder().decode(base64UrlToBytes(code)));}catch{throw new Error('SAVE CODEを読み取れません');}
 if(!isPlain(parsed)||parsed.format!==FORMAT||parsed.version!==VERSION)throw new Error('対応していないSAVE CODEです');
 if(!isPlain(parsed.state))throw new Error('セーブデータ本体が不正です');
 return parsed;
}
function transferSnapshot(){
 if(s.screen!=='world')throw new Error('フィールド画面でSAVE CODEを作成してください');
 const copy=JSON.parse(JSON.stringify(s));
 copy.pauseOpen=false;copy.shopOpen=false;copy.victoryResult=null;copy.lqDefeatResult=false;copy.dialog=null;copy.enemy=null;copy.ehp=0;copy.log=[];copy.screen='world';copy.savedAt=new Date().toISOString();
 return copy;
}
function exportCode(){return encodeEnvelope({format:FORMAT,version:VERSION,createdAt:new Date().toISOString(),state:transferSnapshot()});}
function prepareImportedState(code){
 const envelope=decodeEnvelope(code),raw=sanitize(envelope.state),flags=sanitize(envelope.state.flags);
 const normalized=normalizeNumerics(raw);
 const next=Object.assign({},DEFAULT,normalized);next.flags=Object.assign({},DEFAULT.flags,flags);
 next.screen='world';next.pauseOpen=false;next.shopOpen=false;next.victoryResult=null;next.lqDefeatResult=false;next.dialog=null;next.enemy=null;next.ehp=0;next.log=[];
 if(!MAPS[next.map]){next.map='town';next.x=9;next.y=12;}
 return next;
}
function importCode(code,{renderAfter=true}={}){
 let next;try{next=prepareImportedState(code);}catch(err){return{ok:false,error:String(err?.message||err)}}
 stopMoving();s=next;s.dialog={name:'SYSTEM',text:'SAVE CODEを読み込みました。別ブラウザの冒険を引き継ぎました。'};encounterGrace=3;save();if(renderAfter)render();return{ok:true,state:s};
}
async function copyText(text){
 if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return true;}catch{}}
 return false;
}
function setFeedback(root,message,ok=false){const el=root?.querySelector('.lqTransferFeedback');if(!el)return;el.textContent=message;el.classList.toggle('ok',!!ok);}
function currentInput(root){return root?.querySelector('.lqTransferCode');}
async function exportFromUi(root){
 let code;try{code=exportCode();}catch(err){setFeedback(root,String(err?.message||err));return;}
 const input=currentInput(root);if(input){input.value=code;input.focus();input.select();}
 const copied=await copyText(code);setFeedback(root,copied?'SAVE CODEをコピーしました。別ブラウザで貼り付けてください。':'SAVE CODEを表示しました。長押し/選択してコピーしてください。',true);
}
function importFromUi(root){
 const input=currentInput(root),result=importCode(input?.value||'',{renderAfter:false});
 if(!result.ok){setFeedback(root,result.error||'読み込みに失敗しました');return false;}
 render();return true;
}
window.lqExportTransferCode=exportCode;
window.lqPrepareImportedTransferState=prepareImportedState;
window.lqImportTransferCode=code=>importCode(code);

const style=document.createElement('style');style.textContent=`
.lqTransfer{margin-top:8px;padding:8px;border-radius:10px;background:#0a1926;border:1px solid #7db9d733}.lqTransferTitle{font-size:8px;font-weight:950;color:#9bdcff;letter-spacing:.12em;margin-bottom:5px}.lqTransferHint{font-size:7px;line-height:1.45;color:#8fa6b7;margin-bottom:6px}.lqTransferCode{width:100%;min-height:62px;resize:vertical;border-radius:8px;border:1px solid #ffffff20;background:#07111f;color:#dceaf2;padding:7px;font:7px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}.lqTransferBtns{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:5px}.lqTransferBtns button{min-height:36px;border-radius:8px;border:1px solid #ffffff18;background:#1c4056;color:#d5edf9;font-size:8px;font-weight:950}.lqTransferFeedback{min-height:14px;margin-top:5px;font-size:7px;color:#e2a7a7;line-height:1.4}.lqTransferFeedback.ok{color:#9ed8ac}.lqTitleTransfer{position:relative;z-index:4;max-width:360px;margin:6px auto}.lqTitleTransfer .lqTransferBtns{grid-template-columns:1fr}.lqTitleTransfer .export{display:none}
`;document.head.appendChild(style);
function transferMarkup({title=false}={}){return `<div class="lqTransfer ${title?'lqTitleTransfer':''}"><div class=lqTransferTitle>SAVE TRANSFER</div><div class=lqTransferHint>${title?'別ブラウザ/端末のSAVE CODEを貼り付けて冒険を引き継げます。':'現在の冒険をSAVE CODEとしてコピーし、別ブラウザ/端末で読み込めます。'}</div><textarea class=lqTransferCode spellcheck=false autocapitalize=off autocomplete=off placeholder="SAVE CODEをここに貼り付け"></textarea><div class=lqTransferBtns><button class=export type=button>COPY SAVE CODE</button><button class=import type=button>IMPORT</button></div><div class=lqTransferFeedback aria-live=polite></div></div>`;}
function bindBox(box){
 if(!box||box.dataset.bound==='1')return;box.dataset.bound='1';
 box.querySelector('.export')?.addEventListener('click',()=>exportFromUi(box));
 box.querySelector('.import')?.addEventListener('click',()=>importFromUi(box));
}
function addTitleTransfer(){
 if(s.screen!=='title')return;const stage=app.querySelector('.lqTitleStage')||app.querySelector('.card');if(!stage||stage.querySelector('.lqTitleTransfer'))return;
 const wrap=document.createElement('div');wrap.innerHTML=transferMarkup({title:true});const box=wrap.firstElementChild;stage.appendChild(box);bindBox(box);
}
function addMenuTransfer(){
 if(s.screen!=='world'||!s.pauseOpen)return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqSaveTransferSection'))return;
 const sec=document.createElement('div');sec.className='lqPauseSection lqSaveTransferSection';sec.innerHTML='<h3>SAVE TRANSFER</h3>'+transferMarkup();const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons||null);bindBox(sec.querySelector('.lqTransfer'));
}
const titleBase=title;title=function(){const out=titleBase();addTitleTransfer();return out;};
const worldBase=world;world=function(){const out=worldBase();addMenuTransfer();return out;};
const renderBase=render;render=function(){const out=renderBase();addTitleTransfer();addMenuTransfer();return out;};
window.LQ_SAVE_TRANSFER_STATUS={format:FORMAT,version:VERSION,crossBrowserCode:true,titleImportWithoutLocalSave:true,exportCode,decodeEnvelope,prepareImportedState,importCode,sanitize};
addTitleTransfer();addMenuTransfer();
})();
