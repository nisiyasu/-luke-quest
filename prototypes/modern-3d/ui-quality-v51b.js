// M09 Owner Quality Regate v51b: replace prototype/debug HUD with a restrained in-world exploration HUD.
// This module is intentionally DOM-only so the verified 3D runtime, traversal and world assets remain untouched.
function installOwnerRegateHud(){
  const status=document.querySelector('#status');
  const objective=document.querySelector('.objective.panel');
  const hint=document.querySelector('#hint');
  if(!status||!objective||!hint){
    document.documentElement.dataset.m09OwnerHud='missing-anchor';
    return;
  }

  status.innerHTML='<div class="hud-kicker">LUKE</div><div class="hud-place">森の橋</div><div id="state" class="hud-state">探索中</div>';
  objective.innerHTML='<span class="objective-kicker">NEXT AREA</span><b>魔物の森</b><span class="objective-arrow">↗</span>';
  hint.setAttribute('aria-label','action controls');
  hint.innerHTML='<span class="action-orb"><strong>A</strong><small>ACTION</small></span><span class="menu-orb">MENU</span>';

  const style=document.createElement('style');
  style.id='owner-ui-v51b';
  style.textContent=`
.panel{background:linear-gradient(180deg,rgba(8,18,23,.94),rgba(13,27,30,.86));border:1px solid rgba(218,184,96,.82);box-shadow:0 5px 20px rgba(0,0,0,.38),inset 0 0 0 1px rgba(255,255,255,.04);backdrop-filter:blur(6px)}
#status{min-width:126px;padding:9px 11px 10px;border-radius:12px}.hud-kicker{font-family:Georgia,serif;font-size:9px;font-weight:700;letter-spacing:.18em;color:#e9c96f}.hud-place{margin-top:2px;font-family:Georgia,serif;font-size:15px;letter-spacing:.04em;color:#fff9e5;text-shadow:0 1px 5px #000}.hud-state{display:inline-flex;align-items:center;margin-top:5px;padding:2px 7px 3px;border-radius:999px;background:rgba(80,120,91,.32);border:1px solid rgba(148,190,142,.26);font-size:8px;letter-spacing:.12em;color:#d9ecd8}.hud-state:before{content:"";width:5px;height:5px;border-radius:50%;margin-right:5px;background:#8bd17d;box-shadow:0 0 7px rgba(139,209,125,.45)}
.objective{display:grid;grid-template-columns:auto auto;grid-template-areas:"k a" "b a";column-gap:8px;align-items:center;min-width:106px;padding:8px 10px 9px;border-radius:12px}.objective-kicker{grid-area:k;font-family:Georgia,serif;font-size:7px;letter-spacing:.13em;color:#d8d0bc}.objective b{grid-area:b;font-family:Georgia,serif;font-size:12px;letter-spacing:.02em;color:#fff4ce}.objective-arrow{grid-area:a;display:grid;place-items:center;width:27px;height:27px;border-radius:50%;border:1px solid #e3bd62;background:radial-gradient(circle at 35% 30%,#4b4323,#181c19 72%);font-size:17px;color:#ffd76f;box-shadow:inset 0 0 0 2px rgba(255,255,255,.04)}
.dpad{opacity:.72;filter:drop-shadow(0 3px 8px rgba(0,0,0,.32))}.move{border:1px solid rgba(230,238,222,.32);background:radial-gradient(circle at 35% 30%,rgba(79,101,88,.74),rgba(14,30,34,.62));box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 2px 7px rgba(0,0,0,.25);color:#f3f0db;text-shadow:0 1px 3px #000}
#hint{display:flex;gap:9px;align-items:flex-end;padding:0;background:transparent;border:0}.action-orb{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;border:2px solid rgba(228,197,111,.86);background:radial-gradient(circle at 38% 28%,#654a75,#2d2540 64%,#151722);box-shadow:0 4px 14px rgba(0,0,0,.42),inset 0 0 0 3px rgba(255,255,255,.05)}.action-orb strong{font-family:Georgia,serif;font-size:24px;line-height:21px;color:#fff8db}.action-orb small{font-family:Georgia,serif;font-size:7px;letter-spacing:.10em;color:#e7dcbf}.menu-orb{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid rgba(215,180,95,.72);background:radial-gradient(circle at 38% 28%,#24405b,#142433 68%,#0b141d);box-shadow:0 4px 13px rgba(0,0,0,.38),inset 0 0 0 2px rgba(255,255,255,.04);font-family:Georgia,serif;font-size:9px;letter-spacing:.05em;color:#f4ecd5}
@media (max-height:480px){#status{min-width:108px;padding:6px 8px}.hud-place{font-size:12px}.hud-state{margin-top:3px}.objective{min-width:92px;padding:6px 8px}.objective b{font-size:10px}.objective-arrow{width:23px;height:23px;font-size:14px}.action-orb{width:48px;height:48px}.action-orb strong{font-size:19px}.menu-orb{width:42px;height:42px;font-size:8px}}
`;
  document.head.append(style);

  // index.html later reacquires #state through the same DOM node. Keep the value player-facing.
  const state=document.querySelector('#state');
  if(state)state.textContent='探索中';
  document.documentElement.dataset.m09OwnerHud='pass';
}

installOwnerRegateHud();
