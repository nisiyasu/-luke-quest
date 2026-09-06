(() => {
'use strict';

const STYLE_ID='lq-req123-keyboard-hints-style';
const HINT_CLASS='lqKeyboardShortcutHint';
const ACTION_HINTS={attack:'1',guard:'2',potion:'3',runAway:'4'};

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.gameShell .card button.btn{position:relative}
.gameShell .card button.btn>.${HINT_CLASS}{position:absolute;top:3px;right:4px;min-width:15px;height:15px;padding:0 3px;border:1px solid #ffffff55;border-radius:4px;background:#07111dcc;color:#dcecff;font:700 9px/13px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;text-align:center;letter-spacing:0;pointer-events:none;opacity:.78;box-shadow:0 1px 2px #0008}
.gameShell .card button.btn:focus-visible{outline:3px solid #ffe083;outline-offset:2px;box-shadow:0 0 0 2px #172437,0 0 12px #ffe08388}
@media (pointer:coarse) and (max-width:600px){.gameShell .card button.btn>.${HINT_CLASS}{opacity:.46;transform:scale(.88);transform-origin:top right}}
@media (prefers-reduced-motion:reduce){.gameShell .card button.btn:focus-visible{transition:none!important}}
`;
  document.head.appendChild(style);
}

function actionName(button){
  const raw=(button?.getAttribute?.('onclick')||'').trim();
  const match=raw.match(/^(attack|guard|potion|runAway)\(\)$/);
  return match?.[1]||null;
}

function syncHints(){
  if(typeof s==='undefined'||s?.screen!=='battle')return 0;
  let count=0;
  document.querySelectorAll('.gameShell .card button.btn').forEach(button=>{
    const action=actionName(button);
    const key=ACTION_HINTS[action];
    if(!key)return;
    let hint=button.querySelector(`:scope>.${HINT_CLASS}`);
    if(!hint){
      hint=document.createElement('span');
      hint.className=HINT_CLASS;
      hint.setAttribute('aria-hidden','true');
      button.appendChild(hint);
    }
    hint.textContent=key;
    hint.dataset.action=action;
    count++;
  });
  return count;
}

injectStyle();

if(typeof battle==='function'&&!window.LQ_REQ123_BATTLE_WRAPPED){
  const beforeBattle=battle;
  battle=function(){
    const result=beforeBattle.apply(this,arguments);
    syncHints();
    return result;
  };
  window.LQ_REQ123_BATTLE_WRAPPED=true;
}

if(typeof render==='function'&&!window.LQ_REQ123_RENDER_WRAPPED){
  const beforeRender=render;
  render=function(){
    const result=beforeRender.apply(this,arguments);
    if(typeof s!=='undefined'&&s?.screen==='battle')syncHints();
    return result;
  };
  window.LQ_REQ123_RENDER_WRAPPED=true;
}

if(typeof s!=='undefined'&&s?.screen==='battle')syncHints();

function assert(ok,reason){
  if(ok)return;
  const el=document.createElement('i');
  el.hidden=true;el.className='lqReq123SmokeFailure';el.dataset.reason=String(reason);
  document.body.appendChild(el);
  throw new TypeError(`REQ-123 smoke failed: ${reason}`);
}

function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const snapshot={screen:s.screen,enemy:s.enemy,ehp:s.ehp,log:Array.isArray(s.log)?[...s.log]:s.log};
  try{
    s.screen='battle';
    s.enemy={n:'HINT SMOKE',e:'◆',hp:10,a:[1,1],xp:0,g:0};
    s.ehp=10;s.log=[];
    render();
    const buttons=[...document.querySelectorAll('.gameShell .card button.btn')].filter(b=>actionName(b));
    assert(buttons.length===4,'four canonical battle commands visible');
    const mapping=buttons.map(b=>[actionName(b),b.querySelector(`:scope>.${HINT_CLASS}`)?.textContent]);
    assert(mapping.every(([action,key])=>ACTION_HINTS[action]===key),'correct 1-4 hint mapping');
    assert(buttons.every(b=>b.querySelector(`:scope>.${HINT_CLASS}`)?.getAttribute('aria-hidden')==='true'),'hints presentation only');
    assert(buttons.every(b=>getComputedStyle(b.querySelector(`:scope>.${HINT_CLASS}`)).pointerEvents==='none'),'hints pointer transparent');
    assert(buttons.every(b=>/^(attack|guard|potion|runAway)\(\)$/.test((b.getAttribute('onclick')||'').trim())),'canonical onclick preserved');
    assert(document.getElementById(STYLE_ID)?.textContent.includes(':focus-visible'),'focus-visible style present');
    assert(window.LQ_REQ122_KEYBOARD_STATUS?.battleDirectShortcuts===true,'REQ-122 keyboard authority preserved');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');
    marker.hidden=true;marker.className='lqReq123SmokeMarker';
    marker.dataset.hints='1-4';marker.dataset.focusVisible='true';marker.dataset.pointerTransparent='true';
    document.body.appendChild(marker);
  } finally {
    s.screen=snapshot.screen;s.enemy=snapshot.enemy;s.ehp=snapshot.ehp;s.log=snapshot.log;
    render();
  }
}

window.LQ_REQ123_KEYBOARD_DISCOVERABILITY={
  requirement:'REQ-123',
  hints:'1/2/3/4',
  focusVisible:true,
  pointerTransparent:true,
  canonicalCommandsChanged:false,
  touchChanged:false,
  saveChanged:false,
  storyChanged:false
};
window.LQ_REQ123_TEST={syncHints,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
