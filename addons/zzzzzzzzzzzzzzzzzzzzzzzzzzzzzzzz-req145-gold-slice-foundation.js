(() => {
'use strict';

/* REQ-145 Gold Vertical Slice foundation.
   Presentation-only challenger. No input, save, story, collision, or battle authority. */

const STYLE_ID='lq-req145-gold-slice-style';
const ROOT_CLASS='lqReq145GoldSlice';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
body.${ROOT_CLASS}{--lq145-ink:#06111d;--lq145-panel:rgba(5,16,29,.78);--lq145-line:rgba(255,236,185,.22);--lq145-gold:#f0c95b;--lq145-cyan:#8ed8e4}
body.${ROOT_CLASS} .gameShell{background:#07121b!important;isolation:isolate}
body.${ROOT_CLASS} .gameShell::before{content:"";position:absolute;inset:0;z-index:45;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.30),transparent 18%,transparent 72%,rgba(0,0,0,.42)),radial-gradient(circle at 50% 42%,transparent 42%,rgba(0,0,0,.28) 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)}
body.${ROOT_CLASS} .gameShell::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;z-index:98;pointer-events:none;background:linear-gradient(90deg,transparent,var(--lq145-gold),transparent);opacity:.5}
body.${ROOT_CLASS} .world{image-rendering:auto}
body.${ROOT_CLASS} .player{z-index:13!important}
body.${ROOT_CLASS} .npc{z-index:12!important}
`;
  document.head.appendChild(st);
}

function appendHudStyle(){
  const st=document.getElementById(STYLE_ID); if(!st)return;
  st.textContent+=`
body.${ROOT_CLASS} .lqWorldStatusOverlay{background:linear-gradient(180deg,rgba(5,16,29,.86),rgba(5,16,29,.68))!important;border:1px solid var(--lq145-line)!important;box-shadow:0 6px 18px rgba(0,0,0,.28)!important}
body.${ROOT_CLASS} .lqWorldStatusOverlay .stat{background:rgba(0,0,0,.16)!important}
body.${ROOT_CLASS} .hud{gap:7px!important;align-items:flex-start!important}
body.${ROOT_CLASS} .hud .chip{border:1px solid rgba(255,240,196,.16)!important;background:rgba(5,16,29,.76)!important;color:#fff3d2!important;box-shadow:0 4px 14px rgba(0,0,0,.22)!important;letter-spacing:.015em}
body.${ROOT_CLASS} .hud .chip:first-child{color:var(--lq145-cyan)!important}
body.${ROOT_CLASS} .questGuide{right:auto!important;width:max-content!important;max-width:calc(100% - 16px)!important;border:1px solid rgba(240,201,91,.28)!important;border-left:3px solid var(--lq145-gold)!important;border-radius:999px!important;padding:5px 11px!important;background:rgba(5,16,29,.82)!important;color:#fff5d8!important;box-shadow:0 5px 18px rgba(0,0,0,.22)!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
body.${ROOT_CLASS} .dialogBox{padding:11px 12px 10px!important;border:1px solid rgba(255,248,224,.86)!important;border-top:2px solid var(--lq145-gold)!important;border-radius:10px!important;background:linear-gradient(180deg,rgba(4,13,25,.97),rgba(7,20,35,.95))!important;box-shadow:0 12px 34px rgba(0,0,0,.48)!important}
body.${ROOT_CLASS} .dialogBox .speaker{display:inline-block!important;padding:3px 8px!important;margin:-1px 0 6px!important;border:1px solid rgba(240,201,91,.38)!important;border-radius:999px!important;background:rgba(240,201,91,.10)!important;color:#ffe18a!important;font-size:13px!important;letter-spacing:.04em;text-shadow:0 1px 0 #000}
body.${ROOT_CLASS} .dialogBox .dialog{font-size:14px!important;line-height:1.58!important;color:#fff8e6}
body.${ROOT_CLASS} .dialogBox .sub{margin-top:4px!important;font-size:9px!important;color:#c4d4e2!important;letter-spacing:.06em}
body.${ROOT_CLASS}.lqWorldDialogueOpen .lqWorldStatusOverlay,body.${ROOT_CLASS}.lqWorldDialogueOpen .hud,body.${ROOT_CLASS}.lqWorldDialogueOpen .questGuide{opacity:.34!important;transition:opacity .12s ease}
body.${ROOT_CLASS} .lqWorldControlsOverlay .dpad{opacity:.08!important}
body.${ROOT_CLASS} .lqWorldControlsOverlay .dpad:active{opacity:.30!important}
body.${ROOT_CLASS} .lqWorldControlsOverlay .actionPad{opacity:.72;transition:opacity .15s ease}
body.${ROOT_CLASS} .lqWorldControlsOverlay .actionPad:active{opacity:1}
body.${ROOT_CLASS} .lqWorldControlsOverlay .lqControlLegend{display:none!important}
body.${ROOT_CLASS} #lq-floating-touch-controller{filter:none!important}
body.${ROOT_CLASS} .player.lqGroundedEntity::after{content:"";position:absolute;left:50%;bottom:-8px;width:56px;height:18px;transform:translateX(-50%);border-radius:50%;border:1px solid rgba(142,216,228,.28);box-shadow:0 0 12px rgba(142,216,228,.12),inset 0 0 8px rgba(142,216,228,.07);pointer-events:none;z-index:-1}
body.${ROOT_CLASS} .lq145ActionPulse{position:absolute;width:44px;height:44px;margin:-3px 0 0 -3px;border:2px solid rgba(240,201,91,.92);border-radius:50%;z-index:42;pointer-events:none;box-shadow:0 0 0 4px rgba(240,201,91,.10),0 0 18px rgba(240,201,91,.36);animation:lq145ActionPulse .24s cubic-bezier(.2,.8,.3,1) both}
@keyframes lq145ActionPulse{0%{opacity:.95;transform:scale(.56)}100%{opacity:0;transform:scale(1.28)}}
@media(max-width:430px){body.${ROOT_CLASS} .questGuide{right:auto!important;width:max-content!important;max-width:calc(100% - 16px)!important}}
@media(prefers-reduced-motion:reduce){body.${ROOT_CLASS} .lq145ActionPulse{animation:none!important;opacity:.55}body.${ROOT_CLASS} .player.lqGroundedEntity::after{box-shadow:none}}
`;
}

function appendBattleStyle(){
  const st=document.getElementById(STYLE_ID); if(!st)return;
  st.textContent+=`
body.${ROOT_CLASS}.lq145Battle #app{background:radial-gradient(circle at 50% 18%,#182b3e 0,#07111f 55%,#03080e 100%)}
body.${ROOT_CLASS}.lq145Battle #app>.card{background:linear-gradient(180deg,rgba(14,30,48,.90),rgba(5,15,27,.96))!important;border:1px solid rgba(255,235,184,.16)!important;box-shadow:0 12px 30px rgba(0,0,0,.38)!important}
body.${ROOT_CLASS}.lq145Battle .enemySpriteStage{width:166px!important;height:158px!important;background:radial-gradient(circle,rgba(255,236,176,.20) 0 29%,rgba(142,216,228,.11) 43%,rgba(0,0,0,.12) 61%,transparent 73%)!important;filter:none!important}
body.${ROOT_CLASS}.lq145Battle .enemy.lqOriginalEnemy{transform-origin:50% 100%;animation:lq145EnemyIdle 2.2s ease-in-out infinite}
body.${ROOT_CLASS}.lq145Battle .lqOriginalEnemySvg{width:min(232px,80vw)!important;height:184px!important;filter:drop-shadow(0 12px 7px rgba(0,0,0,.62))!important}
body.${ROOT_CLASS}.lq145Battle .enemyPlate{border-color:rgba(240,201,91,.34)!important;background:linear-gradient(180deg,rgba(5,16,29,.94),rgba(4,12,23,.88))!important}
body.${ROOT_CLASS}.lq145Battle .enemyNameV10{color:#fff2c7!important;letter-spacing:.035em;text-shadow:0 2px 4px #000}
body.${ROOT_CLASS}.lq145Battle .enemyBarV10{height:11px!important;background:#07101b!important;border-color:rgba(255,255,255,.10)!important}
body.${ROOT_CLASS}.lq145Battle .battleLogV10{background:rgba(2,9,17,.76)!important;border-color:rgba(142,216,228,.14)!important;line-height:1.65!important}
body.${ROOT_CLASS}.lq145Battle .commandBtn{border-color:rgba(255,255,255,.13)!important;box-shadow:inset 0 1px rgba(255,255,255,.08),0 5px 14px rgba(0,0,0,.24)!important}
body.${ROOT_CLASS}.lq145Battle .commandBtn:active{transform:translateY(1px) scale(.995)}
@keyframes lq145EnemyIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@media(prefers-reduced-motion:reduce){body.${ROOT_CLASS}.lq145Battle .enemy{animation:none!important}}
`;
}

function syncClasses(){
  const body=document.body;
  if(!body||typeof s==='undefined'||!s)return;
  body.classList.add(ROOT_CLASS);
  [...body.classList].filter(c=>c.startsWith('lq145Map-')).forEach(c=>body.classList.remove(c));
  if(s.screen==='world'&&s.map)body.classList.add(`lq145Map-${String(s.map).replace(/[^a-zA-Z0-9_-]/g,'')}`);
  body.classList.toggle('lq145Battle',s.screen==='battle');
  body.dataset.lq145Screen=String(s.screen||'unknown');
  body.dataset.lq145Map=String(s.map||'');
}

function actionPulse(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return;
  const worldEl=document.querySelector('.gameShell .world');
  if(!worldEl||typeof TS==='undefined')return;
  const dx=s.dir==='left'?-1:s.dir==='right'?1:0;
  const dy=s.dir==='up'?-1:s.dir==='down'?1:0;
  const pulse=document.createElement('i');
  pulse.className='lq145ActionPulse';
  pulse.setAttribute('aria-hidden','true');
  pulse.style.left=`${(s.x+dx)*TS+4}px`;
  pulse.style.top=`${(s.y+dy)*TS+2}px`;
  worldEl.appendChild(pulse);
  setTimeout(()=>pulse.remove(),320);
}

function contractSnapshot(){
  return {
    requirement:'REQ-145',
    branch:'experiment/gold-vertical-slice',
    presentationOnly:true,
    inputAuthority:false,
    saveAuthority:false,
    storyAuthority:false,
    battleAuthority:false,
    currentSlice:'aldia-departure-loop',
    ownerExperiencePass:'PENDING',
    iosPhysicalVerification:'PENDING'
  };
}

installStyle();
appendHudStyle();
appendBattleStyle();

if(typeof render==='function'){
  const baseRender=render;
  render=function(){
    const out=baseRender.apply(this,arguments);
    syncClasses();
    return out;
  };
}

if(typeof action==='function'&&!action.__lq145Wrapped){
  const baseAction=action;
  action=function(){const out=baseAction.apply(this,arguments);actionPulse();return out;};
  action.__lq145Wrapped=true;
}

function smoke(){
  if(typeof s==='undefined'||typeof render!=='function'||typeof action!=='function')return;
  const snapshot=structuredClone(s);
  const flagSnapshot=JSON.stringify(s.flags||{});
  try{
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='up';s.dialog=null;render();
    action();
    const pulses=document.querySelectorAll('.lq145ActionPulse');
    const marker=document.createElement('i');
    marker.id='lqReq145GoldSliceSmokeMarker';marker.hidden=true;
    marker.dataset.canonicalAction=String(!!s.dialog);
    marker.dataset.singlePulse=String(pulses.length===1);
    marker.dataset.inputAuthority='false';
    marker.dataset.saveAuthority='false';
    marker.dataset.storyAuthority=String(JSON.stringify(s.flags||{})===flagSnapshot?'preserved':'changed');
    document.body.appendChild(marker);
  }finally{
    s=structuredClone(snapshot);render();
  }
}

syncClasses();
window.LQ_REQ145_GOLD_SLICE=contractSnapshot();
window.LQ_REQ145_GOLD_SLICE_TEST={syncClasses,contractSnapshot,actionPulse,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqReq145Smoke'))smoke();},0);
})();
