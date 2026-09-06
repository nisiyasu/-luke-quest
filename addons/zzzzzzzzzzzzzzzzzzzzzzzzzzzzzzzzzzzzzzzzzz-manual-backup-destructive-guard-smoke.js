(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
 const api=window.LQ_MANUAL_BACKUP_DESTRUCTIVE_GUARD_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-070 ${msg}`);};
 assert(api?.enabled===true,'status missing');
 const originals=api.slotKeys.map(k=>localStorage.getItem(k));
 const snapshot=JSON.stringify(s);
 try{
  s.screen='world';s.pauseOpen=false;s.shopOpen=false;s.dialog=null;s.enemy=null;s.ehp=0;s.lv=8;s.gold=456;

  // Empty slot remains one-tap.
  localStorage.removeItem(api.slotKeys[0]);
  window.lqManualSave(0);
  assert(api.rawSlot(0)!==null,'empty slot did not save one-tap');
  assert(api.isArmed('overwrite',0)===false,'empty slot falsely armed overwrite');

  // Occupied first SAVE is byte-preserving; second delegates to canonical SAVE.
  const oldRaw=JSON.stringify({screen:'world',map:'town',x:9,y:12,lv:2,gold:11,flags:{}});
  localStorage.setItem(api.slotKeys[0],oldRaw);s.lv=9;s.gold=777;
  window.lqManualSave(0);
  assert(localStorage.getItem(api.slotKeys[0])===oldRaw,'first overwrite tap changed raw bytes');
  assert(api.isArmed('overwrite',0)===true,'overwrite confirmation not armed');
  window.lqManualSave(0);
  const replaced=localStorage.getItem(api.slotKeys[0]);
  assert(replaced!==oldRaw,'second overwrite tap did not replace slot');
  assert(JSON.parse(replaced).lv===9,'second overwrite did not delegate current canonical snapshot');

  // DELETE first tap preserves bytes; second delegates to canonical delete.
  const deleteRaw=localStorage.getItem(api.slotKeys[0]);
  window.lqManualDelete(0);
  assert(localStorage.getItem(api.slotKeys[0])===deleteRaw,'first delete tap changed raw bytes');
  assert(api.isArmed('delete',0)===true,'delete confirmation not armed');
  window.lqManualDelete(0);
  assert(localStorage.getItem(api.slotKeys[0])===null,'second delete did not delete slot');

  // Switching slot/action replaces prior arm without touching either slot.
  const a='{"screen":"world","lv":3}',b='not-valid-json';
  localStorage.setItem(api.slotKeys[0],a);localStorage.setItem(api.slotKeys[1],b);
  window.lqManualSave(0);assert(api.isArmed('overwrite',0),'slot 0 arm missing');
  window.lqManualDelete(1);
  assert(!api.isArmed('overwrite',0)&&api.isArmed('delete',1),'slot/action switch did not replace arm');
  assert(localStorage.getItem(api.slotKeys[0])===a&&localStorage.getItem(api.slotKeys[1])===b,'arm switch mutated backup bytes');
  api.disarm();
  window.LQ_REQ070_SMOKE_PASS=true;
 }finally{
  api.disarm();
  originals.forEach((raw,i)=>raw===null?localStorage.removeItem(api.slotKeys[i]):localStorage.setItem(api.slotKeys[i],raw));
  try{const old=JSON.parse(snapshot);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,old);render();}catch{}
 }
});
})();
