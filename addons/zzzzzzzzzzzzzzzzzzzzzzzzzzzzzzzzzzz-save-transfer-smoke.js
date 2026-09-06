(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const status=window.LQ_SAVE_TRANSFER_STATUS;
 let marker=document.getElementById('lqSaveTransferSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqSaveTransferSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 const original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2');
 const encode=obj=>{
  const bytes=new TextEncoder().encode(JSON.stringify(obj));let binary='';
  for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 };
 try{
  data.status=!!status&&status.format==='LUKE_QUEST_SAVE_TRANSFER'&&status.version===1&&status.crossBrowserCode===true&&status.titleImportWithoutLocalSave===true;
  s=Object.assign({},DEFAULT,{screen:'world',map:'mistTrail',x:8,y:15,lv:7,hp:31,mh:52,gold:123,dialog:null,flags:Object.assign({},DEFAULT.flags,{glennTraceSeen:true,lqUnicodeProbe:'勇者ルーク'})});
  const code=status.exportCode(),env=status.decodeEnvelope(code),round=status.prepareImportedState(code);
  data.export=typeof code==='string'&&code.length>40&&env.format===status.format&&env.version===1;
  data.roundTrip=round.map==='mistTrail'&&round.x===8&&round.y===15&&round.lv===7&&round.hp===31&&round.gold===123&&round.flags.glennTraceSeen===true;
  data.unicode=env.state.flags.lqUnicodeProbe==='勇者ルーク';

  const beforeBadState=JSON.stringify(s),beforeBadStorage=localStorage.getItem('lukeQuestV2');
  const bad=status.importCode('%%%not-a-save%%%',{renderAfter:false});
  data.malformedRejected=bad.ok===false&&JSON.stringify(s)===beforeBadState&&localStorage.getItem('lukeQuestV2')===beforeBadStorage;
  const wrong=status.importCode(encode({format:'NOT_LUKE_QUEST',version:1,state:{map:'town'}}),{renderAfter:false});
  const wrongVersion=status.importCode(encode({format:status.format,version:99,state:{map:'town'}}),{renderAfter:false});
  data.envelopeRejected=wrong.ok===false&&wrongVersion.ok===false;
  const primitive=status.importCode(encode({format:status.format,version:1,state:[]}),{renderAfter:false});
  data.shapeRejected=primitive.ok===false;

  const polluted=JSON.parse('{"format":"LUKE_QUEST_SAVE_TRANSFER","version":1,"state":{"screen":"world","map":"town","hp":42,"flags":{"glennSeen":true,"__proto__":{"polluted":true},"constructor":{"polluted":true},"prototype":{"polluted":true}},"__proto__":{"polluted":true}}}');
  const safe=status.prepareImportedState(encode(polluted));
  data.dangerousKeys=!Object.prototype.hasOwnProperty.call(safe,'__proto__')&&!Object.prototype.hasOwnProperty.call(safe.flags,'__proto__')&&!Object.prototype.hasOwnProperty.call(safe.flags,'constructor')&&!Object.prototype.hasOwnProperty.call(safe.flags,'prototype')&&({}).polluted===undefined&&safe.flags.glennSeen===true;

  const normalized=status.prepareImportedState(encode({format:status.format,version:1,state:{screen:'world',map:'removed-map',x:99,y:99,hp:'bad',gold:null,flags:{}}}));
  data.numericAndMap=normalized.map==='town'&&normalized.x===9&&normalized.y===12&&normalized.hp===DEFAULT.hp&&normalized.gold===DEFAULT.gold;

  const importCode=encode({format:status.format,version:1,state:{screen:'world',map:'town',x:4,y:6,lv:4,hp:33,mh:44,gold:77,flags:{leonSeen:true}}});
  const imported=status.importCode(importCode,{renderAfter:false});
  const stored=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
  data.validImport=imported.ok===true&&s.map==='town'&&s.x===4&&s.y===6&&s.lv===4&&s.flags.leonSeen===true&&stored?.map==='town'&&stored?.lv===4;
  data.manualPreserved=window.LQ_MANUAL_SAVE_STATUS?.slots===2&&window.LQ_MANUAL_SAVE_STATUS?.autosavePreserved===true&&window.LQ_MANUAL_SAVE_STATUS?.rejectsMalformedSlots===true;

  s=structuredClone(DEFAULT);s.screen='title';localStorage.removeItem('lukeQuestV2');render();
  const titleBox=app.querySelector('.lqTitleTransfer');
  data.freshTitleUi=!!titleBox&&!!titleBox.querySelector('.lqTransferCode')&&!!titleBox.querySelector('.import')&&!titleBox.querySelector('.export:not([style])')?.offsetParent;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ060_SAVE_TRANSFER_FAIL_${key}()`);},0);}
},3800);
})();
