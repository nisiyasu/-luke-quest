(() => {
'use strict';

/* REQ-028 dedicated assembled-browser acceptance probe. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqCastleUpperGalleryRuntimeSmokeMarker':'lqRuntimeSmokeFailure';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
}
setTimeout(()=>{
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog};
  try{
    if(!MAPS.aldiaCastleEntranceHall||!MAPS.aldiaCastleUpperGallery)throw new Error('upper gallery maps missing');
    s.screen='world';s.dialog=null;s.map='aldiaCastleEntranceHall';s.x=7;s.y=2;s.dir='up';render();action();
    const entered=s.map==='aldiaCastleUpperGallery'&&s.x===8&&s.y===9;
    if(!entered)throw new Error('hall stair entry failed');
    if(s.dialog)action();
    const beforeX=s.x;move('left');const walked=s.map==='aldiaCastleUpperGallery'&&s.x!==beforeX;stopMoving();
    if(!walked)throw new Error('gallery walkability failed');

    s.dialog=null;s.x=4;s.y=4;s.dir='up';render();action();
    const guardInteracted=!!s.dialog&&s.dialog.name==='上階警備兵';
    if(!guardInteracted)throw new Error('upper guard interaction failed');
    s.dialog=null;s.x=13;s.y=4;s.dir='up';render();action();
    const mapInteracted=!!s.dialog&&s.dialog.name==='古い王都俯瞰図';
    if(!mapInteracted)throw new Error('upper map interaction failed');
    s.dialog=null;s.x=2;s.y=5;s.dir='left';render();action();
    const boundaryInteracted=!!s.dialog&&s.dialog.name==='西執務区画の扉';
    if(!boundaryInteracted)throw new Error('upper boundary failed');

    s.dialog=null;s.x=8;s.y=11;s.dir='down';checkGate();render();
    const exited=s.map==='aldiaCastleEntranceHall'&&s.x===7&&s.y===2;
    const safeSpawn=exited&&((MAPS[s.map].tiles[s.y]||'')[s.x]!=='#');
    if(!exited||!safeSpawn)throw new Error('hall return failed');
    marker(true,{entered,walked,guardInteracted,mapInteracted,boundaryInteracted,exited,safeSpawn});
  }catch(err){console.error('REQ-028 runtime smoke failure',err);marker(false,{reason:err&&err.message||String(err)});}
  finally{stopMoving();Object.assign(s,snapshot);render();}
},1800);
})();
