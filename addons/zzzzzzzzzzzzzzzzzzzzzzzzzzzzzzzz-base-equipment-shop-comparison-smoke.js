(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const snapshot=structuredClone(s);
 const savedBefore=localStorage.getItem('lukeQuestV2');
 let saveCalls=0;
 const saveBase=save;
 let marker=document.getElementById('lqBaseEquipmentComparisonSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqBaseEquipmentComparisonSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 try{
  save=()=>{saveCalls++;};
  const api=window.LQ_BASE_EQUIPMENT_COMPARE_STATUS;
  if(!api?.uiOnly||typeof api.projection!=='function')throw new Error('status');
  s.atk=7;s.weapon='旅人の短剣';let p=api.projection('青銅の剣');data.weaponUpgrade=p.current===7&&p.next===10&&p.delta===3;
  s.atk=13;s.weapon='鉄の剣';p=api.projection('青銅の剣');data.weaponDowngrade=p.current===13&&p.next===10&&p.delta===-3;
  s.def=0;s.armor='旅人服';p=api.projection('革の旅装');data.armorUpgrade=p.current===0&&p.next===2&&p.delta===2;
  s.def=4;s.armor='補強革鎧';p=api.projection('革の旅装');data.armorDowngrade=p.current===4&&p.next===2&&p.delta===-2;
  data.noSave=saveCalls===0;
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.atk=13;s.weapon='鉄の剣';s.def=4;s.armor='補強革鎧';
  render();
  const cards=[...app.querySelectorAll('.lqGood')];
  const bronze=cards.find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('青銅の剣'));
  const leather=cards.find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('革の旅装'));
  data.uiPresent=!!bronze?.querySelector('.lqBaseCompare')&&!!leather?.querySelector('.lqBaseCompare');
  data.downgradeVisible=(bronze?.querySelector('.lqBaseCompare')?.textContent||'').includes('-3')&&(leather?.querySelector('.lqBaseCompare')?.textContent||'').includes('-2');
  data.buyPreserved=!!bronze?.querySelector('button')&&!!leather?.querySelector('button');
  data.tier2Preserved=typeof window.lqBuyTier2==='function'&&!!window.LQ_EQUIPMENT_STATUS?.tier2;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  save=saveBase;s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
  try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ056_BASE_EQUIPMENT_COMPARE_FAIL_${key}()`);},0);}
},2200);
})();
