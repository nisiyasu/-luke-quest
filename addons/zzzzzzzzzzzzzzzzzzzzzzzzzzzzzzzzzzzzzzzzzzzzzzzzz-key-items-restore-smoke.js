(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
  const transfer=window.LQ_SAVE_TRANSFER_STATUS;
  const manual=window.LQ_MANUAL_SAVE_STATUS;
  if(!transfer||typeof transfer.prepareImportedState!=='function'||typeof transfer.normalizeKeyItemsCollection!=='function')throw new Error('REQ-078 transfer diagnostics missing');
  if(!manual||typeof manual.normalizeKeyItemsCollection!=='function')throw new Error('REQ-078 manual diagnostics missing');

  const expected=['森王の角','王城の通行証'];
  const mixed=['森王の角',42,'森王の角','王城の通行証',null];
  if(JSON.stringify(transfer.normalizeKeyItemsCollection(mixed))!==JSON.stringify(expected))throw new Error('REQ-078 transfer collection normalization failed');
  if(JSON.stringify(manual.normalizeKeyItemsCollection(mixed))!==JSON.stringify(expected))throw new Error('REQ-078 manual collection normalization failed');
  for(const malformed of ['corrupt',{bad:true},7,null]){
    if(transfer.normalizeKeyItemsCollection(malformed).length!==0)throw new Error('REQ-078 transfer malformed collection not emptied');
    if(manual.normalizeKeyItemsCollection(malformed).length!==0)throw new Error('REQ-078 manual malformed collection not emptied');
  }

  const b64url=object=>{
    const bytes=new TextEncoder().encode(JSON.stringify(object));
    let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  };
  const codeFor=keyItems=>b64url({format:'LUKE_QUEST_SAVE_TRANSFER',version:1,state:{screen:'world',map:'town',x:9,y:12,keyItems}});
  const imported=transfer.prepareImportedState(codeFor(mixed));
  if(JSON.stringify(imported.keyItems)!==JSON.stringify(expected))throw new Error('REQ-078 SAVE CODE import did not normalize keyItems');
  const malformedImported=transfer.prepareImportedState(codeFor('corrupt'));
  if(!Array.isArray(malformedImported.keyItems)||malformedImported.keyItems.length!==0)throw new Error('REQ-078 SAVE CODE malformed keyItems survived');

  const slotKey='lukeQuestManualSlot1',saveKey='lukeQuestV2';
  const oldSlot=localStorage.getItem(slotKey),oldSave=localStorage.getItem(saveKey),oldState=s;
  try{
    localStorage.setItem(slotKey,JSON.stringify({screen:'world',map:'town',x:9,y:12,keyItems:'corrupt',flags:{}}));
    window.lqManualLoad(0);
    if(!Array.isArray(s.keyItems)||s.keyItems.length!==0)throw new Error('REQ-078 manual backup malformed keyItems survived load');

    localStorage.setItem(slotKey,JSON.stringify({screen:'world',map:'town',x:9,y:12,keyItems:mixed,flags:{}}));
    window.lqManualLoad(0);
    if(JSON.stringify(s.keyItems)!==JSON.stringify(expected))throw new Error('REQ-078 manual backup valid/mixed keyItems normalization failed');
    document.documentElement.dataset.req078KeyItemsRestore='pass';
  } finally {
    s=oldState;
    if(oldSlot===null)localStorage.removeItem(slotKey);else localStorage.setItem(slotKey,oldSlot);
    if(oldSave===null)localStorage.removeItem(saveKey);else localStorage.setItem(saveKey,oldSave);
    render();
  }
});
})();
