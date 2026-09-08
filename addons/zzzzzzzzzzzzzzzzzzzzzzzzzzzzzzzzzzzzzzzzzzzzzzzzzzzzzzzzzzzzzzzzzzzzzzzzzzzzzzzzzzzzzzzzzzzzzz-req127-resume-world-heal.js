(() => {
  'use strict';
  if(window.LQ_REQ127_RESUME_WORLD_HEAL)return;

  const WORLD_CLASS='lqWorldFullscreen';
  const ARRIVAL_CLASS='lqMapArrive';
  let healCount=0;
  let lastReason='startup';
  let raf1=0,raf2=0;

  function worldStateActive(){
    return typeof s!=='undefined'&&s&&s.screen==='world';
  }

  function removeKnownTransientOccluders(){
    document.getElementById('lq-map-transition-fade')?.remove();
  }

  function clearFrozenArrivalPresentation(shell){
    if(!shell)return false;
    const hadArrival=shell.classList.contains(ARRIVAL_CLASS);
    if(hadArrival)shell.classList.remove(ARRIVAL_CLASS);

    // lqMapArrive uses animation-fill-mode: both with opacity:0 / brightness(.55)
    // at 0%. iOS standalone WebKit can suspend while that first frame is active and
    // later resume with the filled animation presentation still frozen. The class is
    // decorative only, so lifecycle recovery may safely drop it without touching state.
    const cs=getComputedStyle(shell);
    const visuallyStuck=Number(cs.opacity)<=0.01||cs.visibility==='hidden'||cs.display==='none';
    if(visuallyStuck){
      shell.style.opacity='1';
      shell.style.filter='none';
      shell.style.transform='none';
      shell.style.visibility='visible';
      shell.style.display='block';
    }
    return hadArrival||visuallyStuck;
  }

  function reassertWorldPresentation(){
    if(!worldStateActive())return false;
    const shell=document.querySelector('.gameShell');
    const world=shell?.querySelector('.world');
    if(!shell||!world)return false;

    document.documentElement.classList.add(WORLD_CLASS);
    document.body.classList.add(WORLD_CLASS);
    removeKnownTransientOccluders();
    clearFrozenArrivalPresentation(shell);

    // Re-assert only the compositor/layout invariants already owned by REQ-022/034.
    // No gameplay coordinates, flags, save state, input authority, or map semantics change.
    world.style.display='block';
    world.style.visibility='visible';
    world.style.opacity='1';

    if(typeof MAPS!=='undefined'&&typeof TS!=='undefined'&&MAPS[s.map]){
      world.style.width=`${MAPS[s.map].w*TS}px`;
      world.style.height=`${MAPS[s.map].h*TS}px`;
      world.style.transformOrigin='0 0';
    }

    // A suspended iOS standalone WebKit compositor can retain a stale world backing layer.
    // Re-applying the existing transform in a later frame requests a fresh presentation
    // without changing the camera calculation or logical position.
    const transform=world.style.transform;
    world.style.willChange='auto';
    void world.offsetWidth;
    world.style.willChange='transform';
    if(transform)world.style.transform=transform;

    return true;
  }

  function marker(ok,reason){
    const shell=document.querySelector('.gameShell');
    let el=document.getElementById('lqReq127ResumeWorldHealMarker');
    if(!el){
      el=document.createElement('i');
      el.id='lqReq127ResumeWorldHealMarker';
      el.hidden=true;
      document.documentElement.appendChild(el);
    }
    const shellStyle=shell?getComputedStyle(shell):null;
    el.dataset.req='127';
    el.dataset.status=ok?'PASS':'SKIP';
    el.dataset.reason=reason;
    el.dataset.count=String(healCount);
    el.dataset.world=String(!!document.querySelector('.gameShell .world'));
    el.dataset.fadeCleared=String(!document.getElementById('lq-map-transition-fade'));
    el.dataset.arrivalCleared=String(!shell?.classList.contains(ARRIVAL_CLASS));
    el.dataset.shellVisible=String(!!shell&&shellStyle?.display!=='none'&&shellStyle?.visibility!=='hidden'&&Number(shellStyle?.opacity||0)>0.01);
    return el;
  }

  function heal(reason='manual'){
    lastReason=reason;
    cancelAnimationFrame(raf1);cancelAnimationFrame(raf2);
    removeKnownTransientOccluders();
    const first=reassertWorldPresentation();
    if(first)healCount++;
    marker(first,reason);

    raf1=requestAnimationFrame(()=>{
      if(!worldStateActive())return marker(false,`${reason}-raf1-nonworld`);
      reassertWorldPresentation();
      raf2=requestAnimationFrame(()=>{
        const ok=reassertWorldPresentation();
        marker(ok,`${reason}-double-raf`);
        window.LQ_REQ127_RUNTIME_DIAGNOSTICS?.snapshot?.(`req127-resume-heal-${reason}`);
      });
    });
    return first;
  }

  addEventListener('pageshow',event=>{
    heal(event.persisted?'pageshow-bfcache':'pageshow');
  },{passive:true});

  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)heal('visibility-foreground');
  },{passive:true});

  window.LQ_REQ127_RESUME_WORLD_HEAL={
    version:'1.1.0',
    requirement:'REQ-127',
    presentationOnly:true,
    gameplayStateMutation:false,
    saveSchemaChange:false,
    knownTransientOccluderCleanup:true,
    frozenArrivalCleanup:true,
    lifecycleReflow:true,
    doubleRafRepaint:true,
    iosPhysicalVerification:'PENDING',
    heal,
    get healCount(){return healCount;},
    get lastReason(){return lastReason;}
  };
})();
