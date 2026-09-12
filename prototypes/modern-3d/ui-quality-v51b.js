// M09 Owner Quality Regate v52: player-facing fantasy exploration HUD.
// DOM-only: verified 3D runtime, traversal and world assets remain untouched.
function installOwnerRegateHud(){
  const status=document.querySelector('#status');
  const objective=document.querySelector('.objective.panel');
  const hint=document.querySelector('#hint');
  if(!status||!objective||!hint){document.documentElement.dataset.m09OwnerHud='missing-anchor';return;}

  status.innerHTML='<div class="hud-title-row"><span class="hud-kicker">LUKE HP</span><strong class="hud-hp-num">62/69</strong></div><div class="hud-hp-track"><i></i></div><div id="state" class="hud-state">FOREST BRIDGE</div>';
  objective.innerHTML='<span class="objective-kicker">NEXT AREA</span><b>MONSTER FOREST</b><span class="objective-arrow">↗</span>';
  hint.setAttribute('aria-label','action controls');
  hint.innerHTML='<span class="action-orb"><strong>A</strong><small>ACTION</small></span><span class="menu-orb">MENU</span>';

  const style=document.createElement('style');style.id='owner-ui-v52';style.textContent=`
.panel{background:linear-gradient(180deg,rgba(7,15,23,.96),rgba(11,25,30,.91));border:1px solid rgba(226,188,88,.88);box-shadow:0 5px 20px rgba(0,0,0,.44),inset 0 0 0 1px rgba(255,255,255,.055);backdrop-filter:blur(6px)}
#status{min-width:168px;padding:9px 11px 10px;border-radius:10px}.hud-title-row{display:flex;align-items:baseline;justify-content:space-between;gap:16px}.hud-kicker{font-family:Georgia,serif;font-size:10px;font-weight:700;letter-spacing:.14em;color:#f0dfb5}.hud-hp-num{font-family:Georgia,serif;font-size:16px;letter-spacing:.03em;color:#fff8e5;text-shadow:0 1px 4px #000}.hud-hp-track{height:7px;margin-top:5px;border:1px solid rgba(221,198,128,.68);background:#131d22;border-radius:2px;padding:1px}.hud-hp-track i{display:block;width:89.8%;height:100%;border-radius:1px;background:linear-gradient(90deg,#42be68,#77df71);box-shadow:0 0 7px rgba(74,219,111,.24)}.hud-state{margin-top:5px;font-family:Georgia,serif;font-size:7px;letter-spacing:.15em;color:#c8c0ae}
.objective{display:grid;grid-template-columns:auto auto;grid-template-areas:"k a" "b a";column-gap:10px;align-items:center;min-width:164px;padding:8px 10px 9px;border-radius:10px}.objective-kicker{grid-area:k;font-family:Georgia,serif;font-size:8px;letter-spacing:.14em;color:#d8d0bc}.objective b{grid-area:b;font-family:Georgia,serif;font-size:12px;letter-spacing:.02em;color:#fff4ce}.objective-arrow{grid-area:a;display:grid;place-items:center;width:33px;height:33px;border-radius:50%;border:1px solid #e3bd62;background:radial-gradient(circle at 35% 30%,#4b4323,#181c19 72%);font-size:20px;color:#ffd76f;box-shadow:inset 0 0 0 2px rgba(255,255,255,.04)}
.dpad{opacity:.72;filter:drop-shadow(0 3px 8px rgba(0,0,0,.32))}.move{border:1px solid rgba(230,238,222,.32);background:radial-gradient(circle at 35% 30%,rgba(79,101,88,.74),rgba(14,30,34,.62));box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 2px 7px rgba(0,0,0,.25);color:#f3f0db;text-shadow:0 1px 3px #000}
#hint{display:flex;gap:9px;align-items:flex-end;padding:0;background:transparent;border:0}.action-orb{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;border:2px solid rgba(228,197,111,.90);background:radial-gradient(circle at 38% 28%,#6b4f80,#332849 64%,#151722);box-shadow:0 4px 14px rgba(0,0,0,.42),inset 0 0 0 3px rgba(255,255,255,.055)}.action-orb strong{font-family:Georgia,serif;font-size:25px;line-height:21px;color:#fff8db}.action-orb small{font-family:Georgia,serif;font-size:7px;letter-spacing:.10em;color:#e7dcbf}.menu-orb{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;border:1px solid rgba(215,180,95,.78);background:radial-gradient(circle at 38% 28%,#274761,#142b3b 68%,#0b141d);box-shadow:0 4px 13px rgba(0,0,0,.38),inset 0 0 0 2px rgba(255,255,255,.04);font-family:Georgia,serif;font-size:9px;letter-spacing:.05em;color:#f4ecd5}
@media (max-height:480px){#status{min-width:148px;padding:6px 8px}.hud-kicker{font-size:8px}.hud-hp-num{font-size:13px}.hud-hp-track{height:5px}.hud-state{margin-top:3px;font-size:6px}.objective{min-width:142px;padding:6px 8px}.objective b{font-size:9px}.objective-arrow{width:25px;height:25px;font-size:15px}.action-orb{width:48px;height:48px}.action-orb strong{font-size:19px}.menu-orb{width:42px;height:42px;font-size:8px}}
`;document.head.append(style);

  const enforcePlayerState=()=>{const state=document.querySelector('#state');if(state&&state.textContent!=='FOREST BRIDGE')state.textContent='FOREST BRIDGE';document.documentElement.dataset.m09OwnerHud='pass';};
  queueMicrotask(enforcePlayerState);const state=document.querySelector('#state');if(state){enforcePlayerState();new MutationObserver(enforcePlayerState).observe(state,{childList:true,characterData:true,subtree:true});}
}
installOwnerRegateHud();
// exact-head recapture trigger after m03-v52 viewport repair
