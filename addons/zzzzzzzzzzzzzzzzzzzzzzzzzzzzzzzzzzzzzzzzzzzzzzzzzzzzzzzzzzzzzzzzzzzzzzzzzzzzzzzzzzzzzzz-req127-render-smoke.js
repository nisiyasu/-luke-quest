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

  const waitFrames=(count=1)=>new Promise(resolve=>{
    const step=()=>count--<=0?resolve():requestAnimationFrame(step);
    requestAnimationFrame(step);
  });

  const run=async()=>{
    try{
      if(typeof s==='undefined'||!s)throw new Error('canonical state unavailable');
      if(typeof render!=='function')throw new Error('canonical render unavailable');

      // Test-only ephemeral world state. Do not save or mutate persistent storage.
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
      // The entrance animation is deliberately allowed to be at opacity:0 here. That is
      // exactly the lifecycle presentation state REQ-127 must recover from. Require real
      // layout + world content before poisoning/recovering it, not completed animation time.
      if(!laidOut(shell)||!laidOut(world)||!laidOut(player)||!tiles.length){
        throw new Error('initial world layout unavailable');
      }

      const heal=window.LQ_REQ127_RESUME_WORLD_HEAL;
      if(!heal||typeof heal.heal!=='function')throw new Error('REQ-127 resume world heal unavailable');
      if(heal.presentationOnly!==true||heal.gameplayStateMutation!==false||heal.saveSchemaChange!==false||heal.frozenArrivalCleanup!==true){
        throw new Error('REQ-127 resume heal safety/recovery contract invalid');
      }

      // Reproduce the evidence captured by CI: an arrival animation can remain at its
      // filled 0% frame (opacity 0 + brightness .55). Keep/add the class so recovery must
      // explicitly neutralize that presentation state rather than merely wait it out.
      shell.classList.add('lqMapArrive');
      const fade=document.createElement('div');
      fade.id='lq-map-transition-fade';
      fade.style.cssText='position:fixed;inset:0;background:#000;z-index:99999;opacity:1';
      document.body.appendChild(fade);

      // Simulate a stale/suspended iOS world backing plane without touching logical state.
      world.style.visibility='hidden';
      world.style.opacity='0';
      world.style.width='0px';
      world.style.height='0px';

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
      const healMarker=document.getElementById('lqReq127ResumeWorldHealMarker');
      const fadeCleared=!document.getElementById('lq-map-transition-fade');
      const arrivalCleared=!shell?.classList.contains('lqMapArrive');
      const fullscreenReasserted=document.documentElement.classList.contains('lqWorldFullscreen')&&document.body.classList.contains('lqWorldFullscreen');
      // offsetWidth/Height verify the logical CSS box; getBoundingClientRect includes the
      // camera transform and is therefore not the right equality check for map size.
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
      el.dataset.healVersion=String(heal.version||'unknown');
      window.LQ_REQ127_RUNTIME_DIAGNOSTICS?.snapshot?.('req127-render-smoke-ready');
    }catch(error){fail(error);}
  };

  setTimeout(()=>{void run();},0);
})();
