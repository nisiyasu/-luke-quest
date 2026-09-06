(() => {
'use strict';

/* REQ-122 — complete the canonical gameplay loop for keyboard users.
   This listener delegates to existing world/battle commands and does not alter touch. */

const DIRECT_BATTLE={
  '1':'attack',
  '2':'guard',
  '3':'potion',
  '4':'runAway'
};
const ARROWS=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);

function editableTarget(target){
  if(!target||typeof target.closest!=='function')return false;
  return Boolean(target.closest('input,textarea,select,[contenteditable="true"]'));
}

function battleButtons(){
  if(typeof s==='undefined'||s?.screen!=='battle')return [];
  return [...document.querySelectorAll('.card button.btn')].filter(btn=>{
    const action=(btn.getAttribute('onclick')||'').trim();
    return /^(attack|guard|potion|runAway)\(\)$/.test(action);
  });
}

function focusBattle(delta){
  const buttons=battleButtons();
  if(!buttons.length)return false;
  const active=document.activeElement;
  let index=buttons.indexOf(active);
  if(index<0)index=0;
  else index=(index+delta+buttons.length)%buttons.length;
  buttons[index].focus({preventScroll:true});
  return true;
}

function closeWorldDialog(){
  if(typeof s==='undefined'||s?.screen!=='world'||!s.dialog)return false;
  if(typeof stopMoving==='function')stopMoving();
  s.dialog=null;
  if(typeof render==='function')render();
  return true;
}

function handleKey(e){
  if(!e||editableTarget(e.target))return false;
  if(typeof s==='undefined'||!s)return false;

  if(s.screen==='battle'){
    const actionName=DIRECT_BATTLE[e.key];
    if(actionName){
      if(e.repeat)return false;
      const fn=window[actionName];
      if(typeof fn!=='function')return false;
      e.preventDefault();
      fn();
      return true;
    }

    if(ARROWS.has(e.key)){
      const horizontal=e.key==='ArrowRight'||e.key==='ArrowDown';
      e.preventDefault();
      return focusBattle(horizontal?1:-1);
    }

    /* Native button Enter/Space owns activation when a battle button is focused.
       Do not intercept it here, avoiding a duplicate command fire. */
    return false;
  }

  if(s.screen==='world'){
    if((e.key==='m'||e.key==='M')&&!e.repeat&&typeof window.openMenu==='function'){
      e.preventDefault();
      window.openMenu();
      return true;
    }
    if(e.key==='Escape'&&s.dialog){
      e.preventDefault();
      return closeWorldDialog();
    }
  }
  return false;
}

if(!window.LQ_REQ122_KEYBOARD_BOUND){
  window.addEventListener('keydown',handleKey,{capture:true});
  window.LQ_REQ122_KEYBOARD_BOUND=true;
}

function assert(ok,reason){
  if(ok)return;
  const el=document.createElement('i');
  el.hidden=true;
  el.className='lqReq122KeyboardSmokeFailure';
  el.dataset.reason=String(reason);
  document.body.appendChild(el);
  throw new TypeError(`REQ-122 keyboard smoke failed: ${reason}`);
}

function syntheticKey(key,{repeat=false,target=window}={}){
  const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,repeat});
  target.dispatchEvent(event);
}

function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const snapshot={
    screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,
    dialog:s.dialog?{...s.dialog}:s.dialog,
    enemy:s.enemy,ehp:s.ehp,hp:s.hp,
    flags:{...(s.flags||{})},log:Array.isArray(s.log)?[...s.log]:s.log
  };
  const original={attack:window.attack,guard:window.guard,potion:window.potion,runAway:window.runAway,openMenu:window.openMenu};
  const calls={attack:0,guard:0,potion:0,runAway:0,openMenu:0};
  try{
    s.screen='battle';
    s.enemy={n:'KEYBOARD SMOKE',e:'◆',hp:10,a:[1,1],xp:0,g:0};
    s.ehp=10;s.log=[];
    render();
    for(const name of Object.keys(DIRECT_BATTLE).map(k=>DIRECT_BATTLE[k]))window[name]=()=>{calls[name]++};
    syntheticKey('1');syntheticKey('2');syntheticKey('3');syntheticKey('4');
    assert(calls.attack===1&&calls.guard===1&&calls.potion===1&&calls.runAway===1,'direct battle shortcuts map exactly once');
    syntheticKey('1',{repeat:true});
    assert(calls.attack===1,'repeat direct shortcut ignored');

    const buttons=battleButtons();
    assert(buttons.length>=4,'battle command buttons discoverable');
    buttons[0].focus({preventScroll:true});
    const before={...calls};
    syntheticKey('ArrowRight');
    assert(document.activeElement===buttons[1],'battle arrow moves focus');
    assert(Object.keys(before).every(k=>calls[k]===before[k]),'focus navigation does not execute command');

    s.screen='world';s.map='town';s.x=9;s.y=12;s.dialog=null;render();
    window.openMenu=()=>{calls.openMenu++};
    syntheticKey('m');
    assert(calls.openMenu===1,'world M delegates to canonical menu');

    const flagsBefore=JSON.stringify(s.flags||{});
    s.dialog={name:'KEYBOARD SMOKE',text:'close me'};render();
    syntheticKey('Escape');
    assert(!s.dialog,'Escape closes world dialog');
    assert(JSON.stringify(s.flags||{})===flagsBefore,'Escape leaves story flags unchanged');

    const input=document.createElement('input');document.body.appendChild(input);
    input.focus();
    s.screen='battle';render();
    const inputBefore={...calls};
    syntheticKey('2',{target:input});
    assert(Object.keys(inputBefore).every(k=>calls[k]===inputBefore[k]),'editable target excluded');
    input.remove();

    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');

    const marker=document.createElement('i');
    marker.hidden=true;
    marker.className='lqReq122KeyboardSmokeMarker';
    marker.dataset.directBattle='true';
    marker.dataset.repeatGuard='true';
    marker.dataset.focusNav='true';
    marker.dataset.worldMenu='true';
    marker.dataset.escapeDialog='true';
    marker.dataset.editableExclusion='true';
    document.body.appendChild(marker);
  } finally {
    Object.assign(window,original);
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;
    s.dialog=snapshot.dialog;s.enemy=snapshot.enemy;s.ehp=snapshot.ehp;s.hp=snapshot.hp;
    s.flags=snapshot.flags;s.log=snapshot.log;
    render();
  }
}

window.LQ_REQ122_KEYBOARD_STATUS={
  requirement:'REQ-122',
  worldMovementAuthority:'existing',
  worldActionAuthority:'existing',
  worldMenuShortcut:true,
  worldEscapeDialog:true,
  battleDirectShortcuts:true,
  battleFocusNavigation:true,
  touchAuthorityChanged:false,
  saveChanged:false,
  storyChanged:false
};
window.LQ_REQ122_KEYBOARD_TEST={handleKey,focusBattle,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
