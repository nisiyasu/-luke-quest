(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
 const api=window.LQ_SAVE_TRANSFER_PREVIEW_STATUS,transfer=window.LQ_SAVE_TRANSFER_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-068/071/079 ${msg}`);};
 const encodeEnvelope=envelope=>{
  const bytes=new TextEncoder().encode(JSON.stringify(envelope));let binary='';
  for(const byte of bytes)binary+=String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 };
 assert(api?.enabled===true,'status missing');
 assert(typeof api.previewCode==='function','preview authority missing');
 assert(typeof api.canonicalGold==='function','canonical gold authority missing');
 assert(typeof api.createdAtLabel==='function','creation time authority missing');
 assert(typeof transfer?.exportCode==='function','REQ-060 export authority missing');
 assert(typeof transfer?.decodeEnvelope==='function','REQ-060 envelope authority missing');
 const snapshot=JSON.stringify(s);
 const prevScreen=s.screen;
 try{
  s.screen='world';s.pauseOpen=false;s.shopOpen=false;s.dialog=null;s.enemy=null;s.ehp=0;
  s.lv=7;s.hp=31;s.mh=42;s.mp=8;s.mmp=13;s.gold=321;delete s.g;
  const code=transfer.exportCode(),before=JSON.stringify(s),preview=api.previewCode(code);
  assert(preview.ok===true,'valid code preview failed');
  assert(preview.text.includes('LV 7'),'level missing');
  assert(preview.text.includes('HP 31/42'),'HP missing');
  assert(preview.text.includes('MP 8/13'),'MP missing');
  assert(preview.text.includes('321G'),'canonical gold missing');
  assert(preview.createdAt&&preview.createdAt!=='作成時刻不明','creation time missing');
  const envelope=transfer.decodeEnvelope(code);
  assert(Number.isFinite(new Date(envelope.createdAt).getTime()),'export envelope timestamp invalid');
  assert(JSON.stringify(s)===before,'preview mutated canonical state');

  // Adversarial drift at the field authority boundary: canonical gold wins over alias.
  assert(api.canonicalGold({gold:654,g:999})===654,'noncanonical g overrode canonical gold');
  assert(api.canonicalGold({g:999})===999,'legacy g fallback unavailable');
  assert(api.canonicalGold({gold:'bad',g:777})===777,'invalid canonical gold did not safely fallback');

  // Valid transfer envelope with an invalid timestamp remains import-previewable with a neutral label.
  const badTimeCode=encodeEnvelope({...envelope,createdAt:'not-a-date'}),badTimePreview=api.previewCode(badTimeCode);
  assert(badTimePreview.ok===true,'invalid timestamp rejected otherwise valid transfer');
  assert(badTimePreview.createdAt==='作成時刻不明','invalid timestamp did not use neutral fallback');
  assert(JSON.stringify(s)===before,'timestamp preview mutated canonical state');

  assert(api.previewCode('not-a-save-code').ok===false,'invalid code did not fail closed');

  const box=document.createElement('div');box.className='lqTransfer';box.innerHTML='<textarea class="lqTransferCode"></textarea>';
  document.body.appendChild(box);api.enhanceAll();api.enhanceAll();
  const input=box.querySelector('.lqTransferCode');input.value=code;input.dispatchEvent(new Event('input',{bubbles:true}));
  const nodes=box.querySelectorAll('.lqTransferPreview');
  assert(nodes.length===1,'duplicate preview nodes');assert(nodes[0].hidden===false&&nodes[0].textContent.includes('321G'),'input preview did not refresh canonical gold');
  assert(nodes[0].textContent.includes(preview.createdAt),'input preview missing creation time');
  input.value='broken';input.dispatchEvent(new Event('input',{bubbles:true}));
  assert(nodes[0].classList.contains('invalid'),'invalid input preview not fail closed');
  box.remove();
  window.LQ_REQ068_SMOKE_PASS=true;window.LQ_REQ071_SMOKE_PASS=true;window.LQ_REQ079_SMOKE_PASS=true;
 }finally{
  try{const original=JSON.parse(snapshot);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,original);s.screen=prevScreen;}catch{}
 }
});
})();
