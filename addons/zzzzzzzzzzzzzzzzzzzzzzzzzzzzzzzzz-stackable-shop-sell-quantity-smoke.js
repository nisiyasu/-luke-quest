(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const snapshot=structuredClone(s);
 const savedBefore=localStorage.getItem('lukeQuestV2');
 const saveBase=save,renderBase=render,sfxBase=window.LQ_sfx;
 let saveCalls=0;
 let marker=document.getElementById('lqStackableShopSellQuantitySmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqStackableShopSellQuantitySmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 try{
  save=()=>{saveCalls++;};render=()=>{};window.LQ_sfx=()=>{};
  const api=window.lqSellConsumableQty;
  if(typeof api!=='function')throw new Error('qty API missing');
  s.screen='world';s.map='shopInterior';s.shopOpen=true;
  s.potions=4;s.smokeBombs=3;s.gold=10;
  let before=saveCalls;let ok=api('herb',3);
  data.herbX3=ok===true&&s.potions===1&&s.gold===22&&saveCalls===before+1;
  before=saveCalls;ok=api('smoke',3);
  data.smokeX3=ok===true&&s.smokeBombs===0&&s.gold===49&&saveCalls===before+1;
  s.potions=2;const goldBefore=s.gold;before=saveCalls;ok=api('herb',3);
  data.insufficientRejected=ok===false&&s.potions===2&&s.gold===goldBefore&&saveCalls===before;
  before=saveCalls;ok=api('herb',2);
  data.invalidQtyRejected=ok===false&&s.potions===2&&s.gold===goldBefore&&saveCalls===before;
  s.shopOpen=false;before=saveCalls;ok=api('herb',3);
  data.outsideRejected=ok===false&&s.potions===2&&s.gold===goldBefore&&saveCalls===before;
  s.shopOpen=true;s.potions=1;before=saveCalls;ok=window.lqSellConsumable?.('herb');
  data.x1Compatible=ok===true&&s.potions===0&&s.gold===goldBefore+4&&saveCalls===before+1;
  data.status=Array.isArray(window.LQ_SHOP_SELL_STATUS?.quantityOptions)&&window.LQ_SHOP_SELL_STATUS.quantityOptions.join(',')==='1,3';
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  save=saveBase;render=renderBase;window.LQ_sfx=sfxBase;s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
 }
 try{
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.potions=2;s.smokeBombs=3;render();
  const cards=[...app.querySelectorAll('.lqGood')];
  const herb=cards.find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('薬草'));
  const smoke=cards.find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('煙玉'));
  const herbButtons=[...herb?.querySelectorAll('.lqSellControls button')||[]];
  const smokeButtons=[...smoke?.querySelectorAll('.lqSellControls button')||[]];
  data.uiButtons=herbButtons.some(b=>b.textContent.includes('SELL ×1'))&&herbButtons.some(b=>b.textContent.includes('SELL ×3'))&&smokeButtons.some(b=>b.textContent.includes('SELL ×3'));
  data.x3Disable=herbButtons.find(b=>b.textContent.includes('SELL ×3'))?.disabled===true&&smokeButtons.find(b=>b.textContent.includes('SELL ×3'))?.disabled===false;
  data.buyPreserved=!!herb?.querySelector('.lqStackBuy')&&!!smoke?.querySelector('.lqStackBuy');
 }catch(e){data.uiRuntime=false;data.uiError=String(e?.message||e);}
 finally{s=structuredClone(snapshot);try{render();}catch(_e){}}
 Object.entries(data).filter(([k])=>k!=='error'&&!k.endsWith('Error')).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&!k.endsWith('Error')&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ057_STACKABLE_SELL_QTY_FAIL_${key}()`);},0);}
},2600);
})();
