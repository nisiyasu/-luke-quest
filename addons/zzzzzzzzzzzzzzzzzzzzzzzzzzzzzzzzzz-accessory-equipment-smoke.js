(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const snapshot=structuredClone(s);
 const savedBefore=localStorage.getItem('lukeQuestV2');
 const saveBase=save,renderBase=render,sfxBase=window.LQ_sfx;
 let saveCalls=0;
 let marker=document.getElementById('lqAccessoryEquipmentSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqAccessoryEquipmentSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 try{
  save=()=>{saveCalls++;};render=()=>{};window.LQ_sfx=()=>{};
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.gold=60;s.def=4;s.flags.lqAccessoryOwned=[];s.flags.lqAccessoryEquipped='';
  let before=saveCalls;let ok=window.lqBuyAccessory?.('旅人の護符');
  data.buy=ok===true&&s.gold===0&&s.def===5&&s.flags.lqAccessoryOwned.includes('旅人の護符')&&s.flags.lqAccessoryEquipped==='旅人の護符'&&saveCalls===before+1;
  before=saveCalls;ok=window.lqEquipAccessory?.('旅人の護符');
  data.noStack=ok===false&&s.def===5&&saveCalls===before;
  before=saveCalls;ok=window.lqEquipAccessory?.('');
  data.unequip=ok===true&&s.def===4&&s.flags.lqAccessoryEquipped===''&&saveCalls===before+1;
  before=saveCalls;ok=window.lqEquipAccessory?.('旅人の護符');
  data.reequip=ok===true&&s.def===5&&s.flags.lqAccessoryEquipped==='旅人の護符'&&saveCalls===before+1;
  s.equipmentOwned=['旅人服','革の旅装','補強革鎧'];s.armor='補強革鎧';s.def=5;
  before=saveCalls;ok=window.lqEquipGear?.('armor','革の旅装');
  data.armorPreserves=ok===true&&s.armor==='革の旅装'&&s.def===3&&s.flags.lqAccessoryEquipped==='旅人の護符'&&saveCalls===before+1;
  s.gold=59;s.flags.lqAccessoryOwned=[];s.flags.lqAccessoryEquipped='';s.def=4;before=saveCalls;ok=window.lqBuyAccessory?.('旅人の護符');
  data.insufficientRejected=ok===false&&s.gold===59&&s.def===4&&s.flags.lqAccessoryOwned.length===0&&saveCalls===before;
  data.status=window.LQ_ACCESSORY_STATUS?.foundation===true&&window.LQ_ACCESSORY_STATUS?.items?.['旅人の護符']?.def===1;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  save=saveBase;render=renderBase;window.LQ_sfx=sfxBase;s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
 }
 try{
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.gold=100;s.flags.lqAccessoryOwned=['旅人の護符'];s.flags.lqAccessoryEquipped='旅人の護符';render();
  const card=app.querySelector('[data-accessory="旅人の護符"]');
  data.shopUi=!!card&&card.textContent.includes('ACCESSORY')&&card.textContent.includes('DEF');
  s.shopOpen=false;s.pauseOpen=true;render();
  const manager=app.querySelector('.lqAccessoryManage');
  data.menuUi=!!manager&&manager.textContent.includes('旅人の護符')&&manager.textContent.includes('はずす');
  data.equipmentPreserved=window.LQ_EQUIPMENT_STATUS?.crossTierDeltaSafe===true;
 }catch(e){data.uiRuntime=false;data.uiError=String(e?.message||e);}
 finally{s=structuredClone(snapshot);try{render();}catch(_e){}}
 Object.entries(data).filter(([k])=>k!=='error'&&!k.endsWith('Error')).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&!k.endsWith('Error')&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ058_ACCESSORY_FAIL_${key}()`);},0);}
},3200);
})();
