(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
 const api=window.LQ_SAVE_TRANSFER_PREVIEW_STATUS,transfer=window.LQ_SAVE_TRANSFER_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-068 ${msg}`);};
 assert(api?.enabled===true,'status missing');
 assert(typeof api.previewCode==='function','preview authority missing');
 assert(typeof transfer?.exportCode==='function','REQ-060 export authority missing');
 const snapshot=JSON.stringify(s);
 const prevScreen=s.screen;
 try{
  s.screen='world';s.pauseOpen=false;s.shopOpen=false;s.dialog=null;s.enemy=null;s.ehp=0;
  s.lv=7;s.hp=31;s.mh=42;s.mp=8;s.mmp=13;s.g=321;
  const code=transfer.exportCode(),before=JSON.stringify(s),preview=api.previewCode(code);
  assert(preview.ok===true,'valid code preview failed');
  assert(preview.text.includes('LV 7'),'level missing');
  assert(preview.text.includes('HP 31/42'),'HP missing');
  assert(preview.text.includes('MP 8/13'),'MP missing');
  assert(preview.text.includes('321G'),'gold missing');
  assert(JSON.stringify(s)===before,'preview mutated canonical state');
  assert(api.previewCode('not-a-save-code').ok===false,'invalid code did not fail closed');

  const box=document.createElement('div');box.className='lqTransfer';box.innerHTML='<textarea class="lqTransferCode"></textarea>';
  document.body.appendChild(box);api.enhanceAll();api.enhanceAll();
  const input=box.querySelector('.lqTransferCode');input.value=code;input.dispatchEvent(new Event('input',{bubbles:true}));
  const nodes=box.querySelectorAll('.lqTransferPreview');
  assert(nodes.length===1,'duplicate preview nodes');assert(nodes[0].hidden===false&&nodes[0].textContent.includes('LV 7'),'input preview did not refresh');
  input.value='broken';input.dispatchEvent(new Event('input',{bubbles:true}));
  assert(nodes[0].classList.contains('invalid'),'invalid input preview not fail closed');
  box.remove();
  window.LQ_REQ068_SMOKE_PASS=true;
 }finally{
  try{const original=JSON.parse(snapshot);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,original);s.screen=prevScreen;}catch{}
 }
});
})();
