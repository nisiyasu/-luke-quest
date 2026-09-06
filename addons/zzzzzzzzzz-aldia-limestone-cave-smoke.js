(() => {
'use strict';

/* REQ-029 assembled-browser acceptance. Runs late enough to avoid temporary
   state from earlier shared probes, but within the 5600ms CI budget. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqLimestoneCaveRuntimeSmokeMarker':'lqRuntimeSmokeFailure';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
}
setTimeout(()=>{
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog};
  try{
    if(!MAPS.field||!MAPS.aldiaLimestoneCave)throw new Error('cave maps missing');
    const mouth=MAPS.field.npcs.find(n=>n.kind==='lqLimestoneCaveMouth');
    if(!mouth||mouth.x!==3||mouth.y!==14)throw new Error('field cave mouth missing');

    s.screen='world';s.dialog=null;s.map='field';s.x=4;s.y=14;s.dir='left';render();action();
    const entered=s.map==='aldiaLimestoneCave'&&s.x===8&&s.y===12;
    const spawnSafe=entered&&((MAPS[s.map].tiles[s.y]||'')[s.x]!=='#');
    if(!entered||!spawnSafe)throw new Error('canonical cave entry/spawn failed');
    if(s.dialog)action();

    const beforeX=s.x;move('left');const walked=s.map==='aldiaLimestoneCave'&&s.x!==beforeX;stopMoving();
    if(!walked)throw new Error('cave walkability failed');

    s.dialog=null;s.x=4;s.y=4;s.dir='up';render();action();
    const surveyInteracted=!!s.dialog&&s.dialog.name==='古い測量印';
    if(!surveyInteracted)throw new Error('survey mark interaction failed');

    s.dialog=null;s.x=13;s.y=4;s.dir='up';render();action();
    const crystalInteracted=!!s.dialog&&s.dialog.name==='淡く光る鉱脈';
    if(!crystalInteracted)throw new Error('crystal interaction failed');

    s.dialog=null;s.x=13;s.y=10;s.dir='right';render();action();
    const boundaryInteracted=!!s.dialog&&s.dialog.name==='奥へ続く細い亀裂';
    if(!boundaryInteracted)throw new Error('cave depth boundary failed');

    s.dialog=null;s.x=8;s.y=13;s.dir='down';checkGate();render();
    const exited=s.map==='field'&&s.x===4&&s.y===14;
    const exitSafe=exited&&((MAPS.field.tiles[s.y]||'')[s.x]!=='#')&&!MAPS.field.npcs.some(n=>n.x===s.x&&n.y===s.y);
    if(!exited||!exitSafe)throw new Error('cave exit/safe field spawn failed');

    const visuals=!!document.querySelector('.lqLimestoneCaveMouth')&&!!window.LQ_LIMESTONE_CAVE_STATUS;
    if(!visuals)throw new Error('cave visual/status integration missing');
    marker(true,{entered,spawnSafe,walked,surveyInteracted,crystalInteracted,boundaryInteracted,exited,exitSafe,visuals});
  }catch(err){
    const reason=err&&err.message||String(err);
    console.error('REQ-029 runtime smoke failure',reason);
    marker(false,{reason});
  }finally{stopMoving();Object.assign(s,snapshot);render();}
},3400);
})();
