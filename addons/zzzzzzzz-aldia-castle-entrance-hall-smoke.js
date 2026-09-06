(() => {
'use strict';

/* REQ-027 dedicated assembled-browser acceptance probe.
   The deep-castle contract is forward-compatible: before a safe next map exists,
   the stair is a world-side boundary; once REQ-028 exists, the same canonical
   Action may safely transition into that published interior. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;

function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqCastleEntranceHallRuntimeSmokeMarker':'lqRuntimeSmokeFailure';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
}

setTimeout(()=>{
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog};
  try{
    if(!MAPS.aldiaCastleCourtyard||!MAPS.aldiaCastleEntranceHall)throw new Error('castle maps missing');
    s.screen='world';s.dialog=null;s.map='aldiaCastleCourtyard';s.x=7;s.y=2;s.dir='up';render();
    action();
    const entered=s.map==='aldiaCastleEntranceHall'&&s.x===7&&s.y===9;
    if(!entered)throw new Error('canonical courtyard door entry failed');

    if(s.dialog)action();
    const beforeX=s.x;
    move('left');
    const walked=s.map==='aldiaCastleEntranceHall'&&s.x!==beforeX;
    stopMoving();
    if(!walked)throw new Error('hall walkability failed');

    s.dialog=null;s.x=4;s.y=5;s.dir='up';render();action();
    const guardInteracted=!!s.dialog&&s.dialog.name==='王城玄関衛兵';
    if(!guardInteracted)throw new Error('hall guard interaction failed');

    s.dialog=null;s.x=11;s.y=5;s.dir='up';render();action();
    const propInteracted=!!s.dialog&&s.dialog.name==='城内案内板';
    if(!propInteracted)throw new Error('hall prop interaction failed');

    s.dialog=null;s.x=7;s.y=2;s.dir='up';render();action();
    const upperImplemented=!!MAPS.aldiaCastleUpperGallery;
    const boundaryInteracted=upperImplemented
      ? s.map==='aldiaCastleUpperGallery'
      : (!!s.dialog&&s.dialog.name==='王城大階段');
    if(!boundaryInteracted)throw new Error('deep castle continuation/boundary failed');

    /* Return to the hall deterministically before validating the original
       hall->courtyard exit contract. */
    if(s.map==='aldiaCastleUpperGallery'){
      s.dialog=null;s.x=8;s.y=11;s.dir='down';checkGate();render();
      if(s.map!=='aldiaCastleEntranceHall')throw new Error('upper gallery return to hall failed');
    }

    s.dialog=null;s.map='aldiaCastleEntranceHall';s.x=7;s.y=11;s.dir='down';checkGate();render();
    const exited=s.map==='aldiaCastleCourtyard'&&s.x===7&&s.y===2;
    const safeSpawn=exited&&MAPS[s.map]&&((MAPS[s.map].tiles[s.y]||'')[s.x]!== '#');
    if(!exited||!safeSpawn)throw new Error('courtyard return failed');

    marker(true,{entered,walked,guardInteracted,propInteracted,boundaryInteracted,upperImplemented,exited,safeSpawn});
  }catch(err){
    console.error('REQ-027 runtime smoke failure',err);
    marker(false,{reason:err&&err.message||String(err)});
  }finally{
    stopMoving();
    Object.assign(s,snapshot);
    render();
  }
},1500);
})();
