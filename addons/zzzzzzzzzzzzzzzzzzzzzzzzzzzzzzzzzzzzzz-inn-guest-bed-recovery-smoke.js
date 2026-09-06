(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 let marker=document.getElementById('lqReq066InnBedRecoverySmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqReq066InnBedRecoverySmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={},api=window.LQ_INN_GUEST_ROOM_STATUS;
 const original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2');
 try{
  data.status=!!api&&api.bedRecovery===true&&api.repeatableRest===true;
  const preservedFlags=Object.assign({},DEFAULT.flags,{glennTraceSeen:true,lqReq066Probe:'keep'});
  s=Object.assign({},DEFAULT,{screen:'world',map:'innGuestRoom',x:2,y:3,dir:'up',hp:3,mh:41,mp:1,mmp:12,gold:77,potions:4,smokes:2,weapon:'青銅の剣',armor:'革の旅装',flags:preservedFlags,dialog:null,status:{poison:2,otherProbe:9}});
  render();
  data.bedAhead=api.guestBedAhead()===true;
  action();
  data.hpRecovered=s.hp===41;
  data.mpRecovered=s.mp===12;
  data.poisonCleared=s.status?.poison===0&&s.status?.otherProbe===9;
  data.unrelatedPreserved=s.map==='innGuestRoom'&&s.x===2&&s.y===3&&s.gold===77&&s.potions===4&&s.smokes===2&&s.weapon==='青銅の剣'&&s.armor==='革の旅装'&&s.flags?.lqReq066Probe==='keep';
  const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
  data.persisted=!!persisted&&persisted.hp===41&&persisted.mp===12&&persisted.status?.poison===0&&persisted.flags?.lqReq066Probe==='keep';
  data.dialogue=s.dialog?.name==='窓辺のベッド'&&s.dialog?.text.includes('全回復');

  s.dialog=null;const beforeRepeat=JSON.stringify({hp:s.hp,mp:s.mp,gold:s.gold,flags:s.flags,status:s.status});action();
  data.repeatHarmless=s.hp===41&&s.mp===12&&JSON.stringify({hp:s.hp,mp:s.mp,gold:s.gold,flags:s.flags,status:s.status})===beforeRepeat&&s.dialog?.text.includes('十分に休めている');

  s=Object.assign({},DEFAULT,{screen:'world',map:'innGuestRoom',x:7,y:3,dir:'up',hp:5,mh:41,mp:2,mmp:12,dialog:null,flags:Object.assign({},DEFAULT.flags)});render();action();
  data.nonBedFlavor=s.dialog?.name==='旅人の荷物台'&&s.hp===5&&s.mp===2;

  data.canonicalAction=typeof action==='function'&&api.guestBedAhead instanceof Function;
  data.touchContract=window.LQ_FLOATING_TOUCH_STATUS?.singleSurface===true||!!window.LQ_FLOATING_TOUCH_STATUS;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ066_INN_BED_RECOVERY_FAIL_${key}()`);},0);}
},4700);
})();
