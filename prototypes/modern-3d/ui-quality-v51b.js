// M09 Owner Quality Regate v63: compact map-first fantasy HUD with non-blocking trail cue.
// DOM-only repair. 3D runtime, traversal, world assets and combat claims remain untouched.
function installOwnerRegateHud(){
  const status=document.querySelector('#status');
  const objective=document.querySelector('.objective.panel');
  const hint=document.querySelector('#hint');
  if(!status||!objective||!hint){document.documentElement.dataset.m09OwnerHud='missing-anchor';return;}

  // Preserve #state because the main runtime captures it after dependency modules execute.
  status.innerHTML='<div class="hud-name-row"><span class="hero-sigil">L</span><div class="hud-name"><strong>LUKE</strong><small>FOREST BRIDGE</small></div></div><div class="hud-hp-row"><span>HP</span><div class="hud-hp-track"><i></i></div></div><span id="state" class="runtime-state">initializing</span>';
  objective.innerHTML='<span class="objective-arrow">↗</span><div><small>NEXT AREA</small><b>MONSTER FOREST</b></div>';
  hint.setAttribute('aria-label','action and menu controls');
  hint.innerHTML='<span class="action-orb"><strong>A</strong><small>ACTION</small></span><span class="menu-orb">MENU</span>';

  // The old route card was too large and duplicated the destination. Replace it with a compact cue.
  document.querySelector('#exploration-route')?.remove();
  let cue=document.querySelector('#route-cue');
  if(!cue){cue=document.createElement('div');cue.id='route-cue';document.body.append(cue);}
  cue.innerHTML='<span class="cue-arrow">▶</span><span>FOLLOW THE TRAIL</span>';

  let location=document.querySelector('#location-ribbon');
  if(!location){location=document.createElement('div');location.id='location-ribbon';document.body.append(location);}
  location.innerHTML='<span>FOREST BRIDGE</span>';

  const previous=document.querySelector('#owner-ui-v53');
  if(previous)previous.remove();
  const style=document.createElement('style');style.id='owner-ui-v63';style.textContent=`
:root{--hud-gold:#d8b35d;--hud-ivory:#f5ecd2;--hud-ink:rgba(5,12,19,.91);--hud-blue:rgba(12,26,36,.88)}
.panel{background:linear-gradient(180deg,var(--hud-ink),var(--hud-blue));border:1px solid rgba(216,179,93,.86);box-shadow:0 5px 18px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.045);backdrop-filter:blur(5px)}
.runtime-state{display:none!important}
#status{width:148px;min-width:0;padding:8px 9px 9px;border-radius:9px}.hud-name-row{display:flex;align-items:center;gap:8px}.hero-sigil{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;border:1px solid rgba(231,200,119,.84);background:radial-gradient(circle at 35% 30%,#4d563a,#18231d 72%);font-family:Georgia,serif;font-size:13px;font-weight:700;color:#ffe39a}.hud-name{display:grid;min-width:0}.hud-name strong{font-family:Georgia,serif;font-size:10px;letter-spacing:.14em;color:var(--hud-ivory)}.hud-name small{margin-top:1px;font-family:Georgia,serif;font-size:6px;letter-spacing:.08em;color:#aaa795}.hud-hp-row{display:grid;grid-template-columns:18px 1fr;align-items:center;gap:5px;margin-top:6px}.hud-hp-row>span{font:700 7px Georgia,serif;letter-spacing:.08em;color:#d7c99f}.hud-hp-track{height:5px;border:1px solid rgba(218,193,123,.58);background:#172029;border-radius:3px;overflow:hidden}.hud-hp-track i{display:block;width:82%;height:100%;background:linear-gradient(90deg,#49ad64,#78d77c)}
.objective{display:flex;align-items:center;gap:8px;min-width:0;width:154px;padding:7px 9px;border-radius:9px}.objective>div{display:grid;min-width:0}.objective small{font:normal 6px Georgia,serif;letter-spacing:.15em;color:#b8b09c}.objective b{margin-top:1px;font:700 9px Georgia,serif;letter-spacing:.035em;color:#fff0bd;white-space:nowrap}.objective-arrow{display:grid;place-items:center;flex:0 0 auto;width:29px;height:29px;border-radius:50%;border:1px solid #d8b35d;background:radial-gradient(circle at 35% 30%,#514525,#17201b 72%);font-size:16px;color:#ffd975}
#exploration-route{display:none!important}#route-cue{position:fixed;z-index:10;right:max(10px,env(safe-area-inset-right));top:max(66px,calc(env(safe-area-inset-top) + 56px));display:flex;align-items:center;gap:7px;width:154px;padding:6px 9px;border:1px solid rgba(216,179,93,.72);border-radius:7px;background:linear-gradient(180deg,rgba(5,12,19,.86),rgba(12,26,36,.76));box-shadow:0 4px 14px rgba(0,0,0,.30);font:700 7px Georgia,serif;letter-spacing:.08em;color:#eee4c6;pointer-events:none}.cue-arrow{color:#ffd265;font-size:10px;text-shadow:0 1px 4px #000}
#location-ribbon{position:fixed;z-index:9;left:50%;bottom:max(18px,env(safe-area-inset-bottom));transform:translateX(-50%);padding:4px 12px 5px;border-top:1px solid rgba(216,179,93,.42);background:linear-gradient(90deg,transparent,rgba(5,14,20,.58) 25%,rgba(5,14,20,.58) 75%,transparent);pointer-events:none;text-shadow:0 2px 4px #000}#location-ribbon span{font-family:Georgia,serif;font-size:7px;letter-spacing:.16em;color:#e9dfc3;white-space:nowrap}
.dpad{opacity:.58;filter:drop-shadow(0 3px 8px rgba(0,0,0,.28))}.move{border:1px solid rgba(230,238,222,.28);background:radial-gradient(circle at 35% 30%,rgba(79,101,88,.62),rgba(14,30,34,.50));box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 2px 7px rgba(0,0,0,.22);color:#f3f0db;text-shadow:0 1px 3px #000}
#hint{display:flex;gap:7px;align-items:flex-end;padding:0;background:transparent;border:0}.action-orb{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;border:2px solid rgba(228,197,111,.86);background:radial-gradient(circle at 38% 28%,#625071,#302941 64%,#151722);box-shadow:0 4px 14px rgba(0,0,0,.38),inset 0 0 0 3px rgba(255,255,255,.05)}.action-orb strong{font-family:Georgia,serif;font-size:23px;line-height:20px;color:#fff8db}.action-orb small{font-family:Georgia,serif;font-size:6px;letter-spacing:.10em;color:#e7dcbf}.menu-orb{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid rgba(215,180,95,.74);background:radial-gradient(circle at 38% 28%,#274761,#142b3b 68%,#0b141d);box-shadow:0 4px 13px rgba(0,0,0,.34),inset 0 0 0 2px rgba(255,255,255,.04);font-family:Georgia,serif;font-size:8px;letter-spacing:.04em;color:#f4ecd5}
@media (max-width:380px){#status{width:138px}.objective,#route-cue{width:143px}.objective b{font-size:8px}.hero-sigil{width:23px;height:23px}.action-orb{width:54px;height:54px}.menu-orb{width:45px;height:45px}}
@media (max-height:480px){#status{width:132px;padding:5px 7px}.hud-hp-row{margin-top:4px}.objective{width:132px;padding:5px 7px}.objective-arrow{width:24px;height:24px;font-size:13px}#route-cue,#location-ribbon{display:none}.action-orb{width:46px;height:46px}.action-orb strong{font-size:18px}.menu-orb{width:40px;height:40px;font-size:7px}}
`;document.head.append(style);

  document.documentElement.dataset.m09OwnerHud='pass';
  document.documentElement.dataset.m09HudMode='map-first-v63';
}
installOwnerRegateHud();
