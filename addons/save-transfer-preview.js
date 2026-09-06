(() => {
'use strict';

/* REQ-068/071: read-only preview over REQ-060 canonical transfer validation. */
const transfer=window.LQ_SAVE_TRANSFER_STATUS;
if(!transfer?.prepareImportedState)return;

function mapLabel(mapId){
 try{return MAPS?.[mapId]?.name||MAPS?.[mapId]?.label||String(mapId||'UNKNOWN');}catch{return String(mapId||'UNKNOWN');}
}
function canonicalGold(next){
 const gold=Number(next?.gold);
 if(Number.isFinite(gold))return gold;
 const legacy=Number(next?.g);
 return Number.isFinite(legacy)?legacy:0;
}
function previewCode(code){
 try{
  const next=transfer.prepareImportedState(String(code||'').trim());
  const lv=Number.isFinite(Number(next.lv))?Number(next.lv):1;
  const hp=`${Number(next.hp)||0}/${Number(next.mh)||0}`;
  const mp=`${Number(next.mp)||0}/${Number(next.mmp)||0}`;
  const gold=canonicalGold(next);
  return{ok:true,text:`LV ${lv} · ${mapLabel(next.map)} · HP ${hp} · MP ${mp} · ${gold}G`,state:next};
 }catch(err){return{ok:false,text:'',error:String(err?.message||err)};}
}
function ensurePreview(box){
 if(!box)return null;
 let node=box.querySelector('.lqTransferPreview');
 if(node)return node;
 node=document.createElement('div');node.className='lqTransferPreview';node.setAttribute('aria-live','polite');node.hidden=true;
 const input=box.querySelector('.lqTransferCode');
 if(input?.parentNode)input.parentNode.insertBefore(node,input.nextSibling);else box.appendChild(node);
 return node;
}
function refreshBox(box){
 const node=ensurePreview(box),input=box?.querySelector('.lqTransferCode');if(!node||!input)return;
 const code=String(input.value||'').trim();
 if(!code){node.hidden=true;node.textContent='';node.classList.remove('invalid');return;}
 const result=previewCode(code);
 node.hidden=false;
 if(result.ok){node.textContent=`IMPORT PREVIEW · ${result.text}`;node.classList.remove('invalid');}
 else{node.textContent='IMPORT PREVIEW · SAVE CODEを確認してください';node.classList.add('invalid');}
}
function enhanceBox(box){
 if(!box||box.dataset.previewBound==='1')return;
 box.dataset.previewBound='1';ensurePreview(box);
 box.querySelector('.lqTransferCode')?.addEventListener('input',()=>refreshBox(box));
 refreshBox(box);
}
function enhanceAll(){document.querySelectorAll('.lqTransfer').forEach(enhanceBox);}
const style=document.createElement('style');style.textContent=`
.lqTransferPreview{margin:5px 0 0;padding:6px 7px;border-radius:7px;background:#10283a;border:1px solid #78d6ff33;color:#bcecff;font-size:7px;font-weight:850;line-height:1.35}.lqTransferPreview.invalid{color:#e5aaaa;border-color:#df777733;background:#2a151b}
`;document.head.appendChild(style);
const renderBase=render;
render=function(){const out=renderBase();enhanceAll();return out;};
window.LQ_SAVE_TRANSFER_PREVIEW_STATUS={enabled:true,previewCode,refreshBox,enhanceAll,mapLabel,canonicalGold};
enhanceAll();
})();
