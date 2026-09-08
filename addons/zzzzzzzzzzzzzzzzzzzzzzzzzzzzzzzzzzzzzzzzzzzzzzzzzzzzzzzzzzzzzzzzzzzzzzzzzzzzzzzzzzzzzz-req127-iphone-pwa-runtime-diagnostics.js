(() => {
  'use strict';
  if(window.LQ_REQ127_RUNTIME_DIAGNOSTICS)return;

  const MAX_EVENTS=80;
  const MAX_STACK=8;
  const STRUCTURAL_IDS=new Set(['app']);
  const STRUCTURAL_CLASSES=new Set(['gameShell','world']);
  const state={
    version:'1.2.0',
    requirement:'REQ-127',
    presentationOnly:true,
    startedAt:new Date().toISOString(),
    userAgent:navigator.userAgent||'',
    standalone:!!(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true,
    coarse:!!(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches),
    ios:/iP(hone|ad|od)/.test(navigator.userAgent||''),
    events:[],errors:[],latest:null,serviceWorker:null
  };
  window.LQ_REQ127_RUNTIME_DIAGNOSTICS=state;

  const trim=()=>{while(state.events.length>MAX_EVENTS)state.events.shift();while(state.errors.length>MAX_EVENTS)state.errors.shift();};
  const safeRect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),width:+r.width.toFixed(1),height:+r.height.toFixed(1),top:+r.top.toFixed(1),left:+r.left.toFixed(1),bottom:+r.bottom.toFixed(1),right:+r.right.toFixed(1)};};
  const safeStyle=el=>{if(!el)return null;const s=getComputedStyle(el);return {display:s.display,visibility:s.visibility,opacity:s.opacity,position:s.position,zIndex:s.zIndex,backgroundColor:s.backgroundColor,transform:s.transform,filter:s.filter,backdropFilter:s.backdropFilter||s.webkitBackdropFilter||'none',pointerEvents:s.pointerEvents,isolation:s.isolation,mixBlendMode:s.mixBlendMode,willChange:s.willChange,contain:s.contain,animationName:s.animationName,animationPlayState:s.animationPlayState};};
  const describe=el=>{if(!el)return null;return {tag:el.tagName,id:el.id||'',className:typeof el.className==='string'?el.className:'',rect:safeRect(el),style:safeStyle(el)};};
  const parseRgba=value=>{const m=String(value||'').match(/rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?/i);return m?{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}:null;};
  const structural=el=>{if(!el)return true;if(el===document.documentElement||el===document.body)return true;if(STRUCTURAL_IDS.has(el.id))return true;return [...STRUCTURAL_CLASSES].some(c=>el.classList?.contains(c));};
  const viewportCoverage=rect=>{if(!rect||innerWidth<=0||innerHeight<=0)return 0;const left=Math.max(0,rect.left),top=Math.max(0,rect.top),right=Math.min(innerWidth,rect.right),bottom=Math.min(innerHeight,rect.bottom);const area=Math.max(0,right-left)*Math.max(0,bottom-top);return +(area/(innerWidth*innerHeight)).toFixed(3);};
  const suspiciousOccluder=el=>{
    if(!el||structural(el))return null;
    const style=safeStyle(el),rect=safeRect(el);
    if(!style||!rect||style.display==='none'||style.visibility==='hidden'||Number(style.opacity)<=0.01)return null;
    const coverage=viewportCoverage(rect),rgba=parseRgba(style.backgroundColor);
    const nearBlack=!!rgba&&rgba.r<=40&&rgba.g<=40&&rgba.b<=40&&rgba.a>=0.72;
    const knownDark=el.id==='lq-map-transition-fade'||el.classList?.contains('lqMapFade')||el.id==='lqReq127SyntheticDarkOccluder';
    const fullSpan=rect.width>=innerWidth*.92&&rect.height>=innerHeight*.92;
    return (coverage>=.78||fullSpan)&&(nearBlack||knownDark)?{...describe(el),coverage,nearBlack,knownDark}:null;
  };
  const probePoint=(name,x,y)=>{
    try{
      const px=Math.max(0,Math.min(innerWidth-1,x)),py=Math.max(0,Math.min(innerHeight-1,y));
      const stack=document.elementsFromPoint(px,py).slice(0,MAX_STACK);
      return {name,x:+px.toFixed(1),y:+py.toFixed(1),stack:stack.map(describe),occluders:stack.map(suspiciousOccluder).filter(Boolean)};
    }catch(error){return {name,x,y,stack:[],occluders:[],error:String(error)};}
  };
  const viewportProbe=()=>{
    const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    const points=[probePoint('center',w*.5,h*.5),probePoint('top',w*.5,h*.12),probePoint('bottom',w*.5,h*.88),probePoint('left',w*.12,h*.5),probePoint('right',w*.88,h*.5)];
    const byKey=new Map();
    for(const point of points){
      for(const candidate of point.occluders){
        const key=`${candidate.tag}|${candidate.id}|${candidate.className}`;
        const entry=byKey.get(key)||{...candidate,probeHits:0,points:[],hitTest:true,domScan:false};
        entry.probeHits++;
        if(!entry.points.includes(point.name))entry.points.push(point.name);
        entry.hitTest=true;
        byKey.set(key,entry);
      }
    }

    // Some engines omit pointer-transparent paint from elementsFromPoint(). A visual
    // black layer can therefore cover the PWA while remaining invisible to hit tests.
    // Bounded DOM geometry/style scanning observes paint independently of pointer ownership.
    const nodes=[...document.body.querySelectorAll('*')].slice(0,3000);
    for(const el of nodes){
      const candidate=suspiciousOccluder(el);
      if(!candidate)continue;
      const key=`${candidate.tag}|${candidate.id}|${candidate.className}`;
      const entry=byKey.get(key)||{...candidate,probeHits:0,points:[],hitTest:false,domScan:true};
      entry.domScan=true;
      const r=candidate.rect;
      for(const point of points){
        if(point.x>=r.left&&point.x<=r.right&&point.y>=r.top&&point.y<=r.bottom&&!entry.points.includes(point.name))entry.points.push(point.name);
      }
      entry.probeHits=Math.max(entry.probeHits,entry.points.length);
      byKey.set(key,entry);
    }
    return {points,occluderCandidates:[...byKey.values()].sort((a,b)=>b.probeHits-a.probeHits||b.coverage-a.coverage)};
  };
  const marker=()=>{let el=document.getElementById('lqReq127DiagnosticsMarker');if(!el){el=document.createElement('pre');el.id='lqReq127DiagnosticsMarker';el.hidden=true;document.documentElement.appendChild(el);}return el;};
  const writeMarker=()=>{const el=marker();el.dataset.req='127';el.dataset.version=state.version;el.dataset.screen=state.latest?.screen||'unknown';el.dataset.map=state.latest?.map||'unknown';el.dataset.shell=String(!!state.latest?.shell);el.dataset.world=String(!!state.latest?.world);el.dataset.player=String(!!state.latest?.player);el.dataset.hidden=String(document.hidden);const candidates=state.latest?.viewportProbe?.occluderCandidates||[];el.dataset.occluderCount=String(candidates.length);el.dataset.topOccluder=candidates[0]?`${candidates[0].tag}#${candidates[0].id}.${candidates[0].className}`:'';el.textContent=JSON.stringify({latest:state.latest,errors:state.errors.slice(-8),serviceWorker:state.serviceWorker});};
  const snapshot=label=>{
    const shell=document.querySelector('.gameShell'),world=shell?.querySelector('.world')||document.querySelector('.world'),player=world?.querySelector('.player')||document.querySelector('.player'),tile=world?.querySelector('.tile')||document.querySelector('.tile'),probe=viewportProbe();
    const snap={at:new Date().toISOString(),label,visibility:document.visibilityState,hidden:document.hidden,hasFocus:document.hasFocus?.()??null,viewport:{innerWidth,innerHeight,visualWidth:window.visualViewport?.width||null,visualHeight:window.visualViewport?.height||null,scale:window.visualViewport?.scale||null},screen:typeof s!=='undefined'&&s?s.screen:null,map:typeof s!=='undefined'&&s?s.map:null,app:describe(document.getElementById('app')),shell:describe(shell),world:describe(world),player:describe(player),tile:describe(tile),viewportProbe:probe,centerStack:probe.points.find(p=>p.name==='center')?.stack||[]};
    state.latest=snap;state.events.push({at:snap.at,type:'snapshot',label,occluderCount:probe.occluderCandidates.length});trim();writeMarker();return snap;
  };
  state.snapshot=snapshot;state.viewportProbe=viewportProbe;
  window.addEventListener('error',ev=>{state.errors.push({at:new Date().toISOString(),type:'error',message:String(ev.message||''),source:String(ev.filename||''),line:ev.lineno||0,column:ev.colno||0});trim();writeMarker();},true);
  window.addEventListener('unhandledrejection',ev=>{let reason='';try{reason=String(ev.reason?.stack||ev.reason||'');}catch(_){reason='unprintable';}state.errors.push({at:new Date().toISOString(),type:'unhandledrejection',reason});trim();writeMarker();});
  const record=(type,extra={})=>{state.events.push({at:new Date().toISOString(),type,...extra});trim();snapshot(type);};
  addEventListener('pageshow',e=>{record('pageshow',{persisted:!!e.persisted});requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('pageshow-double-raf')));});
  addEventListener('pagehide',e=>record('pagehide',{persisted:!!e.persisted}));
  document.addEventListener('visibilitychange',()=>{record('visibilitychange',{visibility:document.visibilityState});if(!document.hidden)requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('visibility-foreground-double-raf')));});
  addEventListener('focus',()=>{record('focus');requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('focus-double-raf')));});
  addEventListener('freeze',()=>record('freeze'));
  addEventListener('resume',()=>{record('resume');requestAnimationFrame(()=>requestAnimationFrame(()=>snapshot('resume-double-raf')));});
  addEventListener('resize',()=>snapshot('resize'));
  addEventListener('orientationchange',()=>setTimeout(()=>snapshot('orientationchange'),80));
  window.visualViewport?.addEventListener('resize',()=>snapshot('visualViewport-resize'));
  if('serviceWorker' in navigator){
    Promise.all([navigator.serviceWorker.getRegistration().catch(()=>null),navigator.serviceWorker.getRegistrations().catch(()=>[])]).then(([reg,regs])=>{state.serviceWorker={controller:navigator.serviceWorker.controller?.scriptURL||null,registration:reg?{scope:reg.scope,active:reg.active?.scriptURL||null,waiting:reg.waiting?.scriptURL||null,installing:reg.installing?.scriptURL||null}:null,registrationCount:regs.length};writeMarker();}).catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{state.serviceWorker={...(state.serviceWorker||{}),controller:navigator.serviceWorker.controller?.scriptURL||null,controllerChangedAt:new Date().toISOString()};writeMarker();});
  }
  setTimeout(()=>snapshot('startup-0'),0);setTimeout(()=>snapshot('startup-750'),750);setTimeout(()=>snapshot('startup-2500'),2500);
})();
