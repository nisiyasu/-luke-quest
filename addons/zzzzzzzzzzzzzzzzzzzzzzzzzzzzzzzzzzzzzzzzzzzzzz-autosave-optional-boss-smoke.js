(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
  const api=window.LQ_AUTOSAVE_FEEDBACK_STATUS;
  if(!api||typeof api.dynamicProgressFlags!=='function'||typeof api.progressSignature!=='function')throw new Error('REQ-076 autosave feedback diagnostic API missing');
  const keys=api.dynamicProgressFlags(window);
  if(keys.filter(x=>x==='forestMiniBossDefeated').length!==1)throw new Error('REQ-076 optional boss completion flag missing/duplicated');
  for(const key of ['elderCharmComplete','forestBountyComplete','lqHerbSampleQuestDone'])if(!keys.includes(key))throw new Error(`REQ-076 prior optional flag missing: ${key}`);
  const base={flags:{}};
  const defeated={flags:{forestMiniBossDefeated:true}};
  const warned={flags:{forestMiniBossWarned:true}};
  if(api.progressSignature(base,window)===api.progressSignature(defeated,window))throw new Error('REQ-076 boss completion does not change progress signature');
  if(api.progressSignature(base,window)!==api.progressSignature(warned,window))throw new Error('REQ-076 warning discovery unexpectedly changes completion signature');
  const before=JSON.stringify(defeated);
  api.progressSignature(defeated,window);
  if(JSON.stringify(defeated)!==before)throw new Error('REQ-076 signature projection mutated input state');
  document.documentElement.dataset.req076OptionalBossAutosave='pass';
});
})();
