(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
 const api=window.LQ_FOREST_LORD_KEY_ITEM_GUARD_TEST;
 if(!api||typeof api.ownsForestLordHorn!=='function'||typeof api.enforceForestLordKeyItemVisibility!=='function')throw new Error('REQ-077 key-item guard diagnostic API missing');
 if(api.ownsForestLordHorn({keyItems:[]}))throw new Error('REQ-077 empty keyItems falsely owns Forest Lord Horn');
 if(api.ownsForestLordHorn({keyItems:['王城の通行証']}))throw new Error('REQ-077 unrelated key item falsely owns Forest Lord Horn');
 if(!api.ownsForestLordHorn({keyItems:['王城の通行証','森王の角']}))throw new Error('REQ-077 canonical Forest Lord Horn ownership not detected');
 if(api.ownsForestLordHorn({keyItems:null}))throw new Error('REQ-077 non-array keyItems falsely owns Forest Lord Horn');
 const oldItems=s.keyItems;
 const host=app.querySelector('.gameShell')||app;
 try{
  s.keyItems=['王城の通行証'];
  const before=JSON.stringify(s.keyItems);
  const fake=document.createElement('div');fake.className='lqBossKeyItem';host.appendChild(fake);
  api.enforceForestLordKeyItemVisibility();
  if(app.querySelector('.lqBossKeyItem'))throw new Error('REQ-077 unrelated keyItems did not remove false Forest Lord Horn chip');
  if(JSON.stringify(s.keyItems)!==before)throw new Error('REQ-077 visibility guard mutated keyItems');
  s.keyItems=['森王の角'];
  const owned=document.createElement('div');owned.className='lqBossKeyItem';host.appendChild(owned);
  api.enforceForestLordKeyItemVisibility();
  if(!app.querySelector('.lqBossKeyItem'))throw new Error('REQ-077 owned Forest Lord Horn chip was incorrectly removed');
  app.querySelector('.lqBossKeyItem')?.remove();
  document.documentElement.dataset.req077ForestLordKeyItem='pass';
 } finally {s.keyItems=oldItems;app.querySelector('.lqBossKeyItem')?.remove();}
});
})();
