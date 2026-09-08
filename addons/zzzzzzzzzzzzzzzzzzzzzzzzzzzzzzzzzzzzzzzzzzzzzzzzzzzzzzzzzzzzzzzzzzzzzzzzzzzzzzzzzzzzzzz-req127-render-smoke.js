(() => {
  'use strict';
  const params=new URLSearchParams(location.search);
  if(params.get('lqReq127RenderSmoke')!=='1')return;

  const marker=()=>{
    let el=document.getElementById('lqReq127RenderSmokeMarker');
    if(!el){
      el=document.createElement('div');
      el.id='lqReq127RenderSmokeMarker';
      el.hidden=true;
      document.documentElement.appendChild(el);
    }
    return el;
  };

  const fail=error=>{
    const el=marker();
    el.dataset.status='FAIL';
    el.dataset.error=String(error&&error.stack||error||'unknown');
  };

  const visible=el=>{
    if(!el)return false;
    const cs=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)>0.01&&r.width>0&&r.height>0;
  };
  const laidOut=el=>{
    if(!el)return false;
    const cs=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
  };

  const waitFrame=()=>new Promise(resolve=>{
    let done=false;
    const finish=()=>{
      if(done)return;
      done=true;
      clearTimeout(timer);
      resolve();
    };
    const timer=setTimeout(finish,80);
    requestAnimationFrame(finish);
  });
  const waitFrames=async(count=1)=>{
    for(let i=0;i<count;i++)await waitFrame();
  };
  const waitMs=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  const poisonPresentation=(shell,world)=>{
    shell.classList.add('lqMapArrive');
    document.getElementById('lq-map-transition-fade')?.remove();
    const fade=document.createElement('div');
    fade.id='lq-map-transition-fade';
    fade.style.cssText='position:fixed;inset:0;background:#000;z-index:99999;opacity:1';
    document.body.appendChild(fade);
    world.style.visibility='hidden';
    world.style.opacity='0';
    world.style.width='0px';
    world.style.height='0px';
  };

  const run=async()=>{
    try{
      if(typeof s==='undefined'||!s)throw new Error('canonical state unavailable');
      if(typeof render!=='function')throw new Error('canonical render unavailable');

      s.screen='world';
      s.map='town';
      s.x=8;
      s.y=13;
      s.dir='up';
      s.dialog=null;
      s.enemy=null;
      if('ehp' in s)s.ehp=0;
      render();
      await waitFrames(2);

      let shell=document.querySelector('.gameShell');
      let world=shell?.querySelector('.world')||document.querySelector('.world');
      let player=world?.querySelector('.player')||document.querySelector('.player');
      let tiles=world?.querySelectorAll('.tile')||[];
      if(!laidOut(shell)||!laidOut(world)||!laidOut(player)||!tiles.length){
        throw new Error('initial world layout unavailable');
      }

      const heal=window.LQ_REQ127_RESUME_WORLD_HEAL;
      if(!heal||typeof heal.heal!=='function')throw new Error('REQ-127 resume world heal unavailable');
      if(heal.presentationOnly!==true||heal.gameplayStateMutation!==false||heal.saveSchemaChange!==false||heal.frozenArrivalCleanup!==true||heal.focusRecovery!==true||heal.lateDomRetryRecovery!==true){
        throw new Error('REQ-127 resume heal safety/recovery contract invalid');
      }

      poisonPresentation(shell,world);

      const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir};
      const started=heal.heal('render-smoke');
      if(!started)throw new Error('REQ-127 resume heal did not start in world state');
      await waitFrames(4);

      shell=document.querySelector('.gameShell');
      world=shell?.querySelector('.world')||document.querySelector('.world');
      player=world?.querySelector('.player')||document.querySelector('.player');
      tiles=world?.querySelectorAll('.tile')||[];
      const sr=shell?.getBoundingClientRect();
      const wr=world?.getBoundingClientRect();
      const pr=player?.getBoundingClientRect();
      const expectedWidth=typeof MAPS!=='undefined'&&typeof TS!=='undefined'&&MAPS[s.map]?MAPS[s.map].w*TS:0;
      const expectedHeight=typeof MAPS!=='undefined'&&typeof TS!=='undefined'&&MAPS[s.map]?MAPS[s.map].h*TS:0;
      const logicalStateUnchanged=before.screen===s.screen&&before.map===s.map&&before.x===s.x&&before.y===s.y&&before.dir===s.dir;
      let healMarker=document.getElementById('lqReq127ResumeWorldHealMarker');
      const fadeCleared=!document.getElementById('lq-map-transition-fade');
      const arrivalCleared=!shell?.classList.contains('lqMapArrive');
      const fullscreenReasserted=document.documentElement.classList.contains('lqWorldFullscreen')&&document.body.classList.contains('lqWorldFullscreen');
      const sizeReasserted=Math.abs((world?.offsetWidth||0)-expectedWidth)<1&&Math.abs((world?.offsetHeight||0)-expectedHeight)<1;
      const shellReasserted=visible(shell);
      const worldReasserted=visible(world)&&visible(player)&&tiles.length>0&&sizeReasserted;

      if(!fadeCleared)throw new Error('REQ-127 resume heal left transition fade behind');
      if(!arrivalCleared)throw new Error('REQ-127 resume heal left frozen map-arrival class behind');
      if(!shellReasserted)throw new Error('REQ-127 resume heal left game shell non-visible');
      if(!fullscreenReasserted)throw new Error('REQ-127 resume heal did not reassert fullscreen world class');
      if(!worldReasserted)throw new Error(`REQ-127 resume heal did not restore world presentation: layout ${world?.offsetWidth||0}x${world?.offsetHeight||0} expected ${expectedWidth}x${expectedHeight}`);
      if(!logicalStateUnchanged)throw new Error('REQ-127 resume heal mutated logical gameplay state');
      if(!healMarker||healMarker.dataset.status!=='PASS'||healMarker.dataset.fadeCleared!=='true'||healMarker.dataset.arrivalCleared!=='true'||healMarker.dataset.shellVisible!=='true'){
        throw new Error('REQ-127 resume heal marker did not confirm shell/world recovery');
      }

      poisonPresentation(shell,world);
      const countBeforeFocus=heal.healCount;
      window.dispatchEvent(new Event('focus'));
      await waitFrames(4);

      shell=document.querySelector('.gameShell');
      world=shell?.querySelector('.world')||document.querySelector('.world');
      player=world?.querySelector('.player')||document.querySelector('.player');
      tiles=world?.querySelectorAll('.tile')||[];
      healMarker=document.getElementById('lqReq127ResumeWorldHealMarker');
      const focusFadeCleared=!document.getElementById('lq-map-transition-fade');
      const focusArrivalCleared=!shell?.classList.contains('lqMapArrive');
      const focusSizeReasserted=Math.abs((world?.offsetWidth||0)-expectedWidth)<1&&Math.abs((world?.offsetHeight||0)-expectedHeight)<1;
      const focusWorldReasserted=visible(shell)&&visible(world)&&visible(player)&&tiles.length>0&&focusSizeReasserted;
      const focusReason=String(heal.lastReason||'');
      const focusTriggered=heal.healCount>countBeforeFocus&&focusReason==='window-focus';
      const focusMarkerReason=String(healMarker?.dataset.reason||'');
      const focusMarkerConfirmed=!!healMarker&&healMarker.dataset.status==='PASS'&&focusMarkerReason.startsWith('window-focus')&&healMarker.dataset.fadeCleared==='true'&&healMarker.dataset.arrivalCleared==='true'&&healMarker.dataset.shellVisible==='true';
      const focusLogicalStateUnchanged=before.screen===s.screen&&before.map===s.map&&before.x===s.x&&before.y===s.y&&before.dir===s.dir;

      if(!focusTriggered)throw new Error(`REQ-127 focus recovery listener did not trigger canonical heal: count ${countBeforeFocus}->${heal.healCount}, reason=${focusReason}`);
      if(!focusFadeCleared||!focusArrivalCleared||!focusWorldReasserted)throw new Error('REQ-127 focus recovery did not fully restore poisoned world presentation');
      if(!focusMarkerConfirmed)throw new Error(`REQ-127 focus recovery marker did not confirm recovery: reason=${focusMarkerReason}`);
      if(!focusLogicalStateUnchanged)throw new Error('REQ-127 focus recovery mutated logical gameplay state');

      // Third pass: model the lifecycle race not covered by v1.2. Foreground focus can fire
      // while the render wrapper has temporarily detached .world. The old heal got only two
      // RAF attempts; if DOM reconstruction finished later, there was no further recovery
      // boundary and the stale dark presentation could survive. Detach the existing world,
      // fire focus, reattach after 180ms, then require bounded retry recovery.
      poisonPresentation(shell,world);
      const detachedWorld=world;
      detachedWorld.remove();
      const countBeforeLateDom=heal.healCount;
      window.dispatchEvent(new Event('focus'));
      setTimeout(()=>{
        const currentShell=document.querySelector('.gameShell');
        if(currentShell&&!detachedWorld.isConnected)currentShell.appendChild(detachedWorld);
      },180);
      await waitMs(520);
      await waitFrames(2);

      shell=document.querySelector('.gameShell');
      world=shell?.querySelector('.world')||document.querySelector('.world');
      player=world?.querySelector('.player')||document.querySelector('.player');
      tiles=world?.querySelectorAll('.tile')||[];
      healMarker=document.getElementById('lqReq127ResumeWorldHealMarker');
      const lateDomSizeReasserted=Math.abs((world?.offsetWidth||0)-expectedWidth)<1&&Math.abs((world?.offsetHeight||0)-expectedHeight)<1;
      const lateDomRecovered=heal.healCount>countBeforeLateDom&&visible(shell)&&visible(world)&&visible(player)&&tiles.length>0&&lateDomSizeReasserted&&!document.getElementById('lq-map-transition-fade')&&!shell?.classList.contains('lqMapArrive');
      const lateDomMarkerReason=String(healMarker?.dataset.reason||'');
      const lateDomMarkerConfirmed=!!healMarker&&healMarker.dataset.status==='PASS'&&lateDomMarkerReason.startsWith('window-focus-retry-');
      const lateDomLogicalStateUnchanged=before.screen===s.screen&&before.map===s.map&&before.x===s.x&&before.y===s.y&&before.dir===s.dir;
      if(!lateDomRecovered)throw new Error(`REQ-127 delayed DOM recovery failed: count ${countBeforeLateDom}->${heal.healCount}, marker=${lateDomMarkerReason}`);
      if(!lateDomMarkerConfirmed)throw new Error(`REQ-127 delayed DOM retry marker missing: ${lateDomMarkerReason}`);
      if(!lateDomLogicalStateUnchanged)throw new Error('REQ-127 delayed DOM recovery mutated logical gameplay state');

      const el=marker();
      el.dataset.status='PASS';
      el.dataset.screen=String(s.screen||'');
      el.dataset.map=String(s.map||'');
      el.dataset.shell=String(shellReasserted);
      el.dataset.world=String(visible(world));
      el.dataset.player=String(visible(player));
      el.dataset.tiles=String(tiles.length);
      el.dataset.shellWidth=String(Math.round(sr?.width||0));
      el.dataset.worldWidth=String(Math.round(wr?.width||0));
      el.dataset.worldHeight=String(Math.round(wr?.height||0));
      el.dataset.playerX=String(Math.round(pr?.x||0));
      el.dataset.resumeHeal='true';
      el.dataset.fadeCleared=String(fadeCleared);
      el.dataset.arrivalCleared=String(arrivalCleared);
      el.dataset.shellReasserted=String(shellReasserted);
      el.dataset.worldReasserted=String(worldReasserted);
      el.dataset.fullscreenReasserted=String(fullscreenReasserted);
      el.dataset.logicalStateUnchanged=String(logicalStateUnchanged);
      el.dataset.focusRecovery=String(focusTriggered&&focusWorldReasserted&&focusMarkerConfirmed&&focusLogicalStateUnchanged);
      el.dataset.lateDomRetryRecovery=String(lateDomRecovered&&lateDomMarkerConfirmed&&lateDomLogicalStateUnchanged);
      el.dataset.healVersion=String(heal.version||'unknown');
      window.LQ_REQ127_RUNTIME_DIAGNOSTICS?.snapshot?.('req127-render-smoke-ready');
    }catch(error){fail(error);}
  };

  if(document.readyState==='complete')void run();
  else addEventListener('load',()=>{void run();},{once:true});
})();
