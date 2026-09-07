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

  const run=()=>{
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

      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        try{
          const shell=document.querySelector('.gameShell');
          const world=shell?.querySelector('.world')||document.querySelector('.world');
          const player=world?.querySelector('.player')||document.querySelector('.player');
          const tiles=world?.querySelectorAll('.tile')||[];
          const sr=shell?.getBoundingClientRect();
          const wr=world?.getBoundingClientRect();
          const pr=player?.getBoundingClientRect();
          const visible=el=>{
            if(!el)return false;
            const cs=getComputedStyle(el);
            const r=el.getBoundingClientRect();
            return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)>0&&r.width>0&&r.height>0;
          };
          const el=marker();
          el.dataset.status='PASS';
          el.dataset.screen=String(s.screen||'');
          el.dataset.map=String(s.map||'');
          el.dataset.shell=String(visible(shell));
          el.dataset.world=String(visible(world));
          el.dataset.player=String(visible(player));
          el.dataset.tiles=String(tiles.length);
          el.dataset.shellWidth=String(Math.round(sr?.width||0));
          el.dataset.worldWidth=String(Math.round(wr?.width||0));
          el.dataset.playerX=String(Math.round(pr?.x||0));
          window.LQ_REQ127_RUNTIME_DIAGNOSTICS?.snapshot?.('req127-render-smoke-ready');
        }catch(error){fail(error);}
      }));
    }catch(error){fail(error);}
  };

  setTimeout(run,0);
})();
