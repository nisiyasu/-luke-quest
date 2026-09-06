(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;
setTimeout(()=>{
 let marker=document.getElementById('lqConsumableShopSellSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqConsumableShopSellSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const status=window.LQ_SHOP_SELL_STATUS;
 const api=window.lqSellConsumable;
 const snapshot={screen:s.screen,map:s.map,shopOpen:s.shopOpen,potions:s.potions,smokeBombs:s.smokeBombs,gold:s.gold};
 const saveBase=save,renderBase=render,sfxBase=window.LQ_sfx;
 let saveCalls=0;
 let data={};
 try{
  save=()=>{saveCalls++;}; render=()=>{}; window.LQ_sfx=()=>{};
  s.screen='world';s.map='shopInterior';s.shopOpen=true;
  s.potions=2;s.smokeBombs=1;s.gold=10;
  const herbResult=api?.('herb');
  data.herbSale=herbResult===true&&s.potions===1&&s.gold===14&&saveCalls===1;
  const smokeResult=api?.('smoke');
  data.smokeSale=smokeResult===true&&s.smokeBombs===0&&s.gold===23&&saveCalls===2;
  const zeroGold=s.gold,zeroSaves=saveCalls;
  const zeroResult=api?.('smoke');
  data.zeroRejected=zeroResult===false&&s.smokeBombs===0&&s.gold===zeroGold&&saveCalls===zeroSaves;
  s.potions=1;s.gold=30;s.shopOpen=false;
  const outsideResult=api?.('herb');
  data.outsideRejected=outsideResult===false&&s.potions===1&&s.gold===30&&saveCalls===zeroSaves;
  data.status=!!status&&status.oneUnitOnly===true&&status.equipmentSelling===false&&status.shopGuard===true&&status.types?.herb?.sellPrice===4&&status.types?.smoke?.sellPrice===9;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s.screen=snapshot.screen;s.map=snapshot.map;s.shopOpen=snapshot.shopOpen;s.potions=snapshot.potions;s.smokeBombs=snapshot.smokeBombs;s.gold=snapshot.gold;
  save=saveBase;render=renderBase;window.LQ_sfx=sfxBase;
 }
 try{
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.potions=0;s.smokeBombs=1;
  render();
  const herbCard=[...app.querySelectorAll('.lqGood')].find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('薬草'));
  const smokeCard=[...app.querySelectorAll('.lqGood')].find(el=>(el.querySelector('.lqGoodName')?.textContent||'').includes('煙玉'));
  const herbSell=herbCard?.querySelector('.lqSellControls button');
  const smokeSell=smokeCard?.querySelector('.lqSellControls button');
  data.uiPresent=!!herbSell&&!!smokeSell&&herbSell.textContent.includes('+4G')&&smokeSell.textContent.includes('+9G');
  data.zeroDisabled=herbSell?.disabled===true;
  data.buyPreserved=!!herbCard?.querySelector('.lqStackBuy')&&!!smokeCard?.querySelector('.lqStackBuy');
 }catch(e){data.uiRuntime=false;data.uiError=String(e?.message||e);}
 finally{
  s.screen=snapshot.screen;s.map=snapshot.map;s.shopOpen=snapshot.shopOpen;s.potions=snapshot.potions;s.smokeBombs=snapshot.smokeBombs;s.gold=snapshot.gold;
  try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>!k.endsWith('Error')&&k!=='error').forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([k,v])=>!k.endsWith('Error')&&k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ055_CONSUMABLE_SHOP_SELL_FAIL_${key}()`);},0);}
},600);
})();
