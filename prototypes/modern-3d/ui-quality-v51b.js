// M09 Owner Quality Regate v65: target-facing map-first fantasy HUD with stronger portrait legibility and landscape safe-area fit.
// DOM-only repair. 3D runtime, traversal, world assets and combat claims remain untouched.
function installOwnerRegateHud(){
  const status=document.querySelector('#status');
  const objective=document.querySelector('.objective.panel');
  const hint=document.querySelector('#hint');
  if(!status||!objective||!hint){document.documentElement.dataset.m09OwnerHud='missing-anchor';return;}

  // Preserve #state because the main runtime captures it after dependency modules execute.
  status.innerHTML='<div class="hud-name-row"><span class="hero-sigil">L</span><div class="hud-name"><strong>LUKE</strong><small>FOREST BRIDGE</small></div></div><span id="state" class="runtime-state">initializing</span>';
  objective.innerHTML='<span class="objective-arrow">↗</span><div><small>NEXT AREA</small><b>MONSTER FOREST</b></div>';
  hint.setAttribute('aria-label','action and menu controls');
  hint.innerHTML='<span class="action-orb"><strong>A</strong><small>ACTION</small></span><span class="menu-orb">MENU</span>';

  // Keep route guidance compact so the playable field remains the visual hero.
  document.querySelector('#exploration-route')?.remove();
  let cue=document.querySelector('#route-cue');
  if(!cue){cue=document.createElement('div');cue.id='route-cue';document.body.append(cue);}
  cue.innerHTML='<span class="cue-arrow">▶</span><span>FOLLOW THE TRAIL</span>';

  let location=document.querySelector('#location-ribbon');
  if(!location){location=document.createElement('div');location.id='location-ribbon';document.body.append(location);}
  location.innerHTML='<span>FOREST BRIDGE</span>';

  document.querySelector('#owner-ui-v53')?.remove();
  document.querySelector('#owner-ui-v63')?.remove();
  document.querySelector('#owner-ui-v64')?.remove();
  document.querySelector('#owner-ui-v65')?.remove();
  const style=document.createElement('style');style.id='owner-ui-v65';style.textContent=`
:root{--hud-gold:#dfbd66;--hud-gold-soft:#aa8f4c;--hud-ivory:#fff1cf;--hud-ink:rgba(4,10,16,.94);--hud-blue:rgba(10,24,34,.91)}
.panel{background:linear-gradient(180deg,var(--hud-ink),var(--hud-blue));border:1px solid rgba(223,189,102,.94);box-shadow:0 6px 20px rgba(0,0,0,.46),inset 0 0 0 1px rgba(255,255,255,.055),inset 0 -9px 18px rgba(0,0,0,.16);backdrop-filter:blur(6px)}
.runtime-state{display:none!important}
#status{width:158px;min-width:0;padding:9px 10px 10px;border-radius:10px}.hud-name-row{display:flex;align-items:center;gap:9px}.hero-sigil{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid rgba(239,205,119,.94);background:radial-gradient(circle at 35% 30%,#596044,#18231d 72%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.035),0 2px 6px #0006;font-family:Georgia,serif;font-size:14px;font-weight:700;color:#ffe69c}.hud-name{display:grid;min-width:0}.hud-name strong{font-family:Georgia,serif;font-size:11px;letter-spacing:.14em;color:var(--hud-ivory);text-shadow:0 1px 3px #000}.hud-name small{margin-top:2px;font-family:Georgia,serif;font-size:7px;letter-spacing:.09em;color:#c5bfa9}.objective{display:flex;align-items:center;gap:9px;min-width:0;width:160px;padding:8px 10px;border-radius:10px}.objective>div{display:grid;min-width:0}.objective small{font:normal 7px Georgia,serif;letter-spacing:.15em;color:#c8bfa7}.objective b{margin-top:2px;font:700 10px Georgia,serif;letter-spacing:.035em;color:#fff0bd;white-space:nowrap;text-shadow:0 1px 3px #000}.objective-arrow{display:grid;place-items:center;flex:0 0 auto;width:31px;height:31px;border-radius:50%;border:1px solid #e2bd64;background:radial-gradient(circle at 35% 30%,#5c4c26,#17201b 72%);box-shadow:inset 0 0 0 2px rgba(255,255,255,.035);font-size:17px;color:#ffd975}
#exploration-route{display:none!important}#route-cue{position:fixed;z-index:10;right:max(10px,env(safe-area-inset-right));top:max(70px,calc(env(safe-area-inset-top) + 60px));display:flex;align-items:center;gap:8px;width:160px;padding:7px 10px;border:1px solid rgba(223,189,102,.82);border-radius:8px;background:linear-gradient(180deg,rgba(4,10,16,.91),rgba(10,24,34,.82));box-shadow:0 5px 16px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,.035);font:700 8px Georgia,serif;letter-spacing:.08em;color:#f6ebcb;pointer-events:none;text-shadow:0 1px 3px #000}.cue-arrow{color:#ffd265;font-size:11px;text-shadow:0 1px 4px #000}
#location-ribbon{position:fixed;z-index:9;left:50%;bottom:max(19px,env(safe-area-inset-bottom));transform:translateX(-50%);padding:5px 14px 6px;border-top:1px solid rgba(223,189,102,.54);border-bottom:1px solid rgba(223,189,102,.16);background:linear-gradient(90deg,transparent,rgba(4,13,19,.66) 22%,rgba(4,13,19,.66) 78%,transparent);pointer-events:none;text-shadow:0 2px 4px #000}#location-ribbon span{font-family:Georgia,serif;font-size:8px;letter-spacing:.17em;color:#f2e5c4;white-space:nowrap}
.dpad{opacity:.62;filter:drop-shadow(0 3px 8px rgba(0,0,0,.31))}.move{border:1px solid rgba(237,241,225,.34);background:radial-gradient(circle at 35% 30%,rgba(88,112,96,.66),rgba(13,28,33,.54));box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 2px 8px rgba(0,0,0,.24);color:#fff6dc;text-shadow:0 1px 3px #000}
#hint{display:flex;gap:8px;align-items:flex-end;padding:0;background:transparent;border:0}.action-orb{display:grid;place-items:center;width:62px;height:62px;border-radius:50%;border:2px solid rgba(235,203,113,.94);background:radial-gradient(circle at 38% 28%,#6b5779,#342d47 64%,#151722);box-shadow:0 5px 16px rgba(0,0,0,.42),inset 0 0 0 3px rgba(255,255,255,.055),inset 0 -7px 12px rgba(0,0,0,.18)}.action-orb strong{font-family:Georgia,serif;font-size:25px;line-height:22px;color:#fff8db;text-shadow:0 1px 3px #000}.action-orb small{font-family:Georgia,serif;font-size:7px;letter-spacing:.10em;color:#eee2c3}.menu-orb{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid rgba(223,189,102,.84);background:radial-gradient(circle at 38% 28%,#2b4c67,#142c3c 68%,#0b141d);box-shadow:0 5px 15px rgba(0,0,0,.38),inset 0 0 0 2px rgba(255,255,255,.05);font-family:Georgia,serif;font-size:9px;letter-spacing:.04em;color:#fff1d4;text-shadow:0 1px 3px #000}
@media (max-width:380px){#status{width:146px}.objective,#route-cue{width:148px}.objective b{font-size:9px}.hero-sigil{width:25px;height:25px}.action-orb{width:57px;height:57px}.menu-orb{width:48px;height:48px}}
@media (max-height:480px){#status{width:136px;padding:6px 8px}.objective{box-sizing:border-box!important;right:max(8px,env(safe-area-inset-right))!important;left:auto!important;width:150px!important;padding:6px 8px;gap:7px}.objective>div{overflow:hidden}.objective b{font-size:9px;letter-spacing:.015em}.objective small{font-size:6px;letter-spacing:.12em}.objective-arrow{width:25px;height:25px;font-size:13px}#route-cue,#location-ribbon{display:none}.action-orb{width:48px;height:48px}.action-orb strong{font-size:19px}.menu-orb{width:42px;height:42px;font-size:7px}}
`;document.head.append(style);

  document.documentElement.dataset.m09OwnerHud='pass';
  document.documentElement.dataset.m09HudMode='map-first-v65';
}
installOwnerRegateHud();