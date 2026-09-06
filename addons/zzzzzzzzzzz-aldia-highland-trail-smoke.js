(() => {
'use strict';

/* REQ-030 assembled-browser acceptance. Scheduled after prior shared probes
   and inside the workflow's 5600ms virtual-time budget. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqHighlandTrailRuntimeSmokeMarker':'lqRuntimeSmokeFailure';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
}
setTimeout(()=>{
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog};
  try{
    if(!MAPS.field||!MAPS.aldiaHighlandTrail)throw new Error('highland maps missing');
    const trailhead=MAPS.field.npcs.find(n=>n.kind==='lqHighlandTrailhead');
    if(!trailhead||trailhead.x!==19||trailhead.y!==14)throw new Error('field trailhead missing');

    s.screen='world';s.dialog=null;s.map='field';s.x=18;s.y=14;s.dir='right';render();action();
    const entered=s.map==='aldiaHighlandTrail'&&s.x===9&&s.y===14;
    const spawnSafe=entered&&((MAPS[s.map].tiles[s.y]||'')[s.x]!== '#');
    if(!entered||!spawnSafe)throw new Error('canonical highland entry/spawn failed');
    if(s.dialog)action();

    const beforeX=s.x;move('left');const walked=s.map==='aldiaHighlandTrail'&&s.x!==beforeX;stopMoving();
    if(!walked)throw new Error('highland walkability failed');

    s.dialog=null;s.x=5;s.y=4;s.dir='left';render();action();
    const signInteracted=!!s.dialog&&s.dialog.name==='古い登山道標';
    if(!signInteracted)throw new Error('trail sign interaction failed');

    s.dialog=null;s.x=14;s.y=4;s.dir='right';render();action();
    const cairnInteracted=!!s.dialog&&s.dialog.name==='石積みのケルン';
    if(!cairnInteracted)throw new Error('cairn interaction failed');

    s.dialog=null;s.x=9;s.y=2;s.dir='up';render();action();
    const boundaryInteracted=!!s.dialog&&s.dialog.name==='崩れた尾根道';
    if(!boundaryInteracted)throw new Error('high-altitude boundary failed');

    s.dialog=null;s.x=9;s.y=15;s.dir='down';checkGate();render();
    const exited=s.map==='field'&&s.x===18&&s.y===14;
    const exitSafe=exited&&((MAPS.field.tiles[s.y]||'')[s.x]!=='#')&&!MAPS.field.npcs.some(n=>n.x===s.x&&n.y===s.y);
    if(!exited||!exitSafe)throw new Error('highland exit/safe field spawn failed');

    const status=window.LQ_HIGHLAND_TRAIL_STATUS;
    if(!status||status.map!=='aldiaHighlandTrail'||status.storyFlagsAdded!==0)throw new Error('highland status integration missing');
    marker(true,{entered,spawnSafe,walked,signInteracted,cairnInteracted,boundaryInteracted,exited,exitSafe,status:true});
  }catch(err){
    const reason=err&&err.message||String(err);
    console.error('REQ-030 runtime smoke failure',reason);
    marker(false,{reason});
  }finally{stopMoving();Object.assign(s,snapshot);render();}
},4300);
})();
