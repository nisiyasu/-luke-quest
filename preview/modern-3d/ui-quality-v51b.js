// M09 Owner Quality Regate v53: truthful fantasy exploration HUD.
// DOM-only: verified 3D runtime, traversal and world assets remain untouched.
function installOwnerRegateHud(){
  const status=document.querySelector('#status');
  const objective=document.querySelector('.objective.panel');
  const hint=document.querySelector('#hint');
  if(!status||!objective||!hint){document.documentElement.dataset.m09OwnerHud='missing-anchor';return;}

  status.innerHTML='<div class="hud-title-row"><span class="hero-sigil">L</span><div><span class="hud-kicker">LUKE</span><strong class="hud-role">EXPLORER</strong></div></div><div id="state" class="hud-state">FOREST BRIDGE</div><div class="hud-state-sub">CURRENT LOCATION</div>';
  objective.innerHTML='<span class="objective-kicker">NEXT AREA</span><b>MONSTER FOREST</b><span class="objective-arrow">↗</span><small>FOLLOW THE FOREST PATH</small>';
  hint.setAttribute('aria-label','action and menu controls');
  hint.innerHTML='<span class="action-orb"><strong>A</strong><small>ACTION</small></span><span class="menu-orb">MENU</span>';

  const route=document.createElement('aside');
  route.id='exploration-route';
  route.className='panel';
  route.setAttribute('aria-label','exploration route');
  route.innerHTML='<div class="route-eyebrow">EXPLORATION</div><div class="route-row"><span>CURRENT</span><b>FOREST BRIDGE</b></div><div class="route-line"><i></i><em>PATH OPEN</em></div><div class="route-row"><span>DESTINATION</span><b>MONSTER FOREST</b></div>';
  document.body.append(route);

  const location=document.createElement('div');
  location.id='location-ribbon';
  location.innerHTML='<span>FOREST BRIDGE</span><small>BRIDGE CROSSING · FOREST ROUTE</small>';
  document.body.append(location);

  const style=document.createElement('style');style.id='owner-ui-v53';style.textContent=`
:root{--hud-gold:#d8b35d;--hud-ivory:#f5ecd2;--hud-ink:rgba(7,14,22,.94);--hud-blue:rgba(12,28,39,.92)}
.panel{background:linear-gradient(180deg,var(--hud-ink),var(--hud-blue));border:1px solid rgba(216,179,93,.88);box-shadow:0 6px 22px rgba(0,0,0,.46),inset 0 0 0 1px rgba(255,255,255,.045);backdrop-filter:blur(7px)}
#status{min-width:166px;padding:9px 11px 10px;border-radius:10px}.hud-title-row{display:flex;align-items:center;gap:9px}.hero-sigil{display:grid;place-items:center;width:27px;height:27px;border-radius:50%;border:1px solid rgba(231,200,119,.85);background:radial-gradient(circle at 35% 30%,#4d563a,#18231d 72%);font-family:Georgia,serif;font-size:14px;font-weight:700;color:#ffe39a;box-shadow:inset 0 0 0 2px rgba(255,255,255,.035)}.hud-title-row>div{display:grid}.hud-kicker{font-family:Georgia,serif;font-size:11px;font-weight:700;letter-spacing:.16em;color:var(--hud-ivory)}.hud-role{font-family:Georgia,serif;font-size:7px;letter-spacing:.20em;color:#c9b980;margin-top:1px}.hud-state{margin-top:7px;padding-top:6px;border-top:1px solid rgba(216,179,93,.34);font-family:Georgia,serif;font-size:10px;letter-spacing:.11em;color:#fff3ca}.hud-state-sub{margin-top:2px;font-family:Georgia,serif;font-size:6px;letter-spacing:.18em;color:#9fa9a2}
.objective{display:grid;grid-template-columns:auto auto;grid-template-areas:"k a" "b a" "s s";column-gap:10px;align-items:center;min-width:174px;padding:8px 10px 9px;border-radius:10px}.objective-kicker{grid-area:k;font-family:Georgia,serif;font-size:7px;letter-spacing:.17em;color:#c9c0aa}.objective b{grid-area:b;font-family:Georgia,serif;font-size:11px;letter-spacing:.035em;color:#fff0bd}.objective small{grid-area:s;margin-top:4px;padding-top:4px;border-top:1px solid rgba(216,179,93,.25);font-family:Georgia,serif;font-size:6px;letter-spacing:.10em;color:#aeb8b0}.objective-arrow{grid-area:a;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid #d8b35d;background:radial-gradient(circle at 35% 30%,#514525,#17201b 72%);font-size:19px;color:#ffd975;box-shadow:inset 0 0 0 2px rgba(255,255,255,.04)}
#exploration-route{position:fixed;z-index:10;right:max(10px,env(safe-area-inset-right));top:92px;width:174px;padding:9px 10px 10px;border-radius:10px;pointer-events:none}.route-eyebrow{font-family:Georgia,serif;font-size:7px;letter-spacing:.20em;color:#c9b980;margin-bottom:7px}.route-row{display:grid;gap:1px}.route-row span{font-family:Georgia,serif;font-size:6px;letter-spacing:.15em;color:#8e9d99}.route-row b{font-family:Georgia,serif;font-size:9px;letter-spacing:.07em;color:#f5ecd2}.route-line{display:flex;align-items:center;gap:7px;margin:7px 0}.route-line i{position:relative;display:block;flex:1;height:1px;background:linear-gradient(90deg,#d8b35d,#829b7d)}.route-line i:after{content:"";position:absolute;right:-1px;top:-2px;width:5px;height:5px;border-radius:50%;background:#d8b35d;box-shadow:0 0 7px rgba(216,179,93,.5)}.route-line em{font:normal 6px Georgia,serif;letter-spacing:.12em;color:#b9c6b8}
#location-ribbon{position:fixed;z-index:9;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translateX(-50%);display:grid;justify-items:center;min-width:180px;padding:6px 13px 7px;border-top:1px solid rgba(216,179,93,.62);border-bottom:1px solid rgba(216,179,93,.34);background:linear-gradient(90deg,transparent,rgba(5,14,20,.75) 14%,rgba(5,14,20,.75) 86%,transparent);pointer-events:none;text-shadow:0 2px 4px #000}.#location-ribbon{}#location-ribbon span{font-family:Georgia,serif;font-size:9px;letter-spacing:.17em;color:#f7edcf}#location-ribbon small{margin-top:2px;font-family:Georgia,serif;font-size:5px;letter-spacing:.14em;color:#aab5aa}
.dpad{opacity:.72;filter:drop-shadow(0 3px 8px rgba(0,0,0,.32))}.move{border:1px solid rgba(230,238,222,.32);background:radial-gradient(circle at 35% 30%,rgba(79,101,88,.74),rgba(14,30,34,.62));box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 2px 7px rgba(0,0,0,.25);color:#f3f0db;text-shadow:0 1px 3px #000}
#hint{display:flex;gap:9px;align-items:flex-end;padding:0;background:transparent;border:0}.action-orb{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;border:2px solid rgba(228,197,111,.90);background:radial-gradient(circle at 38% 28%,#625071,#302941 64%,#151722);box-shadow:0 4px 14px rgba(0,0,0,.42),inset 0 0 0 3px rgba(255,255,255,.055)}.action-orb strong{font-family:Georgia,serif;font-size:25px;line-height:21px;color:#fff8db}.action-orb small{font-family:Georgia,serif;font-size:7px;letter-spacing:.10em;color:#e7dcbf}.menu-orb{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;border:1px solid rgba(215,180,95,.78);background:radial-gradient(circle at 38% 28%,#274761,#142b3b 68%,#0b141d);box-shadow:0 4px 13px rgba(0,0,0,.38),inset 0 0 0 2px rgba(255,255,255,.04);font-family:Georgia,serif;font-size:9px;letter-spacing:.05em;color:#f4ecd5}
@media (max-width:480px){#exploration-route{top:91px;width:158px}.route-row b{font-size:8px}#location-ribbon{bottom:max(22px,env(safe-area-inset-bottom));min-width:150px}}
@media (max-height:480px){#status{min-width:142px;padding:6px 8px}.hero-sigil{width:22px;height:22px;font-size:11px}.hud-kicker{font-size:9px}.hud-state{margin-top:4px;padding-top:4px;font-size:8px}.objective{min-width:142px;padding:6px 8px}.objective b{font-size:9px}.objective-arrow{width:25px;height:25px;font-size:15px}.objective small{display:none}#exploration-route{top:64px;width:142px;padding:6px 8px}.route-eyebrow{margin-bottom:4px}.route-line{margin:4px 0}#location-ribbon{display:none}.action-orb{width:48px;height:48px}.action-orb strong{font-size:19px}.menu-orb{width:42px;height:42px;font-size:8px}}
`;document.head.append(style);

  const enforcePlayerState=()=>{const state=document.querySelector('#state');if(state&&state.textContent!=='FOREST BRIDGE')state.textContent='FOREST BRIDGE';document.documentElement.dataset.m09OwnerHud='pass';document.documentElement.dataset.m09HudMode='truthful-exploration-v53';};
  queueMicrotask(enforcePlayerState);const state=document.querySelector('#state');if(state){enforcePlayerState();new MutationObserver(enforcePlayerState).observe(state,{childList:true,characterData:true,subtree:true});}
}
installOwnerRegateHud();
