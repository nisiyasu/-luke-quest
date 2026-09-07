(()=>{
  'use strict';
  if(window.LQ_REQ127_RUNTIME_DIAGNOSTICS)return;

  const MAX_EVENTS=80;
  const state={
    version:'1.0.0',
    requirement:'REQ-127',
    presentationOnly:true,
    startedAt:new Date().toISOString(),
    userAgent:navigator.userAgent||'',
    standalone:!!(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true,
    coarse:!!(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches),
    ios:/iP(hone|ad|od)/.test(navigator.userAgent||''),
    events:[],
    errors:[],
    latest:null,
    serviceWorker:null
  };
  window.LQ_REQ127_RUNTIME_DIAGNOSTICS=state;

  const trim=()=>{while(state.events.length>MAX_EVENTS)state.events.shift();while(state.errors.length>MAX_EVENTS)state.errors.shift();};
  const safeRect=el=>{
    if(!el)return null;
    const r=el.getBoundingClientRect();
    return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),width:+r.width.toFixed(1),height:+r.height.toFixed(1),top:+r.top.toFixed(1),left:+r.left.toFixed(1),bottom:+r.bottom.toFixed(1),right:+r.right.toFixed(1)};
  };
  const safeStyle=el=>{
    if(!el)return null;
    const s=getComputedStyle(el);
    return {display:s.display,visibility:s.visibility,opacity:s.opacity,position:s.position,zIndex:s.zIndex,backgroundColor:s.backgroundColor,transform:s.transform,filter:s.filter,backdropFilter:s.backdropFilter||s.webkitBackdropFilter||'none',pointerEvents:s.pointerEvents};
  };
  const describe=el=>{
    if(!el)return null;
    return {tag:el.tagName,id:el.id||'',className:typeof el.className==='string'?el.className:'',rect:safeRect(el),style:safeStyle(el)};
  };
  const centerStack=()=>{
    try{
      const x=Math.max(0,Math.min(innerWidth-1,innerWidth/2));
      const y=Math.max(0,Math.min(innerHeight-1,innerHeight/2));
      return document.elementsFromPoint(x,y).slice(0,10).map(el=>({tag:el.tagName,id:el.id||'',className:typeof el.className==='string'?el.className:'',pointerEvents:getComputedStyle(el).pointerEvents,opacity:getComputedStyle(el).opacity,backgroundColor:getComputedStyle(el).backgroundColor,zIndex:getComputedStyle(el).zIndex}));
    }catch(_){return [];}
  };
  const marker=()=>{
    let el=document.getElementById('lqReq127DiagnosticsMarker');
    if(!el){
      el=document.createElement('pre');
      el.id='lqReq127DiagnosticsMarker';
      el.hidden=true;
      document.documentElement.appendChild(el);
    }
    return el;
  };
  const writeMarker=()=>{
    const el=marker();
    el.dataset.req='127';
    el.dataset.screen=state.latest?.screen||'unknown';
    el.dataset.map=state.latest?.map||'unknown';
    el.dataset.shell=String(!!state.latest?.shell);
    el.dataset.world=String(!!state.latest?.world);
    el.dataset.player=String(!!state.latest?.player);
    el.dataset.hidden=String(document.hidden);
    el.textContent=JSON.stringify({latest:state.latest,errors:state.errors.slice(-8),serviceWorker:state.serviceWorker});
  };
  const snapshot=label=>{
    const shell=document.querySelector('.gameShell');
    const world=shell?.querySelector('.world')||document.querySelector('.world');
    const player=world?.querySelector('.player')||document.querySelector('.player');
    const tile=world?.querySelector('.tile')||document.querySelector('.tile');
    const snap={
      at:new Date().toISOString(),label,
      visibility:document.visibilityState,hidden:document.hidden,
      viewport:{innerWidth,innerHeight,visualWidth:window.visualViewport?.width||null,visualHeight:window.visualViewport?.height||null,scale:window.visualViewport?.scale||null},
      screen:typeof s!=='undefined'&&s?s.screen:null,
      map:typeof s!=='undefined'&&s?s.map:null,
      app:describe(document.getElementById('app')),
      shell:describe(shell),world:describe(world),player:describe(player),tile:describe(tile),
      centerStack:centerStack()
    };
    state.latest=snap;
    state.events.push({at:snap.at,type:'snapshot',label});
    trim();
    writeMarker();
    return snap;
  };
  state.snapshot=snapshot;

  window.addEventListener('error',ev=>{
    state.errors.push({at:new Date().toISOString(),type:'error',message:String(ev.message||''),source:String(ev.filename||''),line:ev.lineno||0,column:ev.colno||0});trim();writeMarker();
  },true);
  window.addEventListener('unhandledrejection',ev=>{
    let reason='';try{reason=String(ev.reason?.stack||ev.reason||'');}catch(_){reason='unprintable';}
    state.errors.push({at:new Date().toISOString(),type:'unhandledrejection',reason});trim();writeMarker();
  });

  const record=(type,extra={})=>{state.events.push({at:new Date().toISOString(),type,...extra});trim();snapshot(type);};
  addEventListener('pageshow',e=>{record('pageshow',{persisted:!!e.persisted});requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('pageshow-double-raf')));});
  addEventListener('pagehide',e=>record('pagehide',{persisted:!!e.persisted}));
  document.addEventListener('visibilitychange',()=>{record('visibilitychange',{visibility:document.visibilityState});if(!document.hidden)requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('visibility-foreground-double-raf')));});
  addEventListener('resize',()=>snapshot('resize'));
  addEventListener('orientationchange',()=>setTimeout(()=>snapshot('orientationchange'),80));
  window.visualViewport?.addEventListener('resize',()=>snapshot('visualViewport-resize'));

  if('serviceWorker' in navigator){
    Promise.all([
      navigator.serviceWorker.getRegistration().catch(()=>null),
      navigator.serviceWorker.getRegistrations().catch(()=>[])
    ]).then(([reg,regs])=>{
      state.serviceWorker={controller:navigator.serviceWorker.controller?.scriptURL||null,registration:reg?{scope:reg.scope,active:reg.active?.scriptURL||null,waiting:reg.waiting?.scriptURL||null,installing:reg.installing?.scriptURL||null}:null,registrationCount:regs.length};
      writeMarker();
    }).catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{state.serviceWorker={...(state.serviceWorker||{}),controller:navigator.serviceWorker.controller?.scriptURL||null,controllerChangedAt:new Date().toISOString()};writeMarker();});
  }

  setTimeout(()=>snapshot('startup-0'),0);
  setTimeout(()=>snapshot('startup-750'),750);
  setTimeout(()=>snapshot('startup-2500'),2500);
})();
