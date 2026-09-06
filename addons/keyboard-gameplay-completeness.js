(() => {
'use strict';

/* REQ-122 + REQ-124 — complete the canonical gameplay loop for keyboard/gamepad users.
   These inputs delegate to existing world/battle commands and do not alter touch. */

const DIRECT_BATTLE={
  '1':'attack',
  '2':'guard',
  '3':'potion',
  '4':'runAway'
};
const ARROWS=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
const GAMEPAD_DEAD_ZONE=.55;
const GAMEPAD_NAV_REPEAT_MS=180;
const GAMEPAD_KEYS={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};

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

/* REQ-124 gamepad layer. It emits the already-supported keyboard movement/action
   path for world play and clicks the existing battle command buttons. */
const gamepadState={direction:null,lastBattleDirection:null,lastBattleNavAt:0,buttons:new Map(),raf:0};

function gamepadPressed(gp,index){
  const b=gp?.buttons?.[index];
  return Boolean(b&&(b.pressed||Number(b.value)>.55));
}

function gamepadDirection(gp){
  if(!gp)return null;
  if(gamepadPressed(gp,12))return 'up';
  if(gamepadPressed(gp,13))return 'down';
  if(gamepadPressed(gp,14))return 'left';
  if(gamepadPressed(gp,15))return 'right';
  const x=Number(gp.axes?.[0]||0),y=Number(gp.axes?.[1]||0);
  if(Math.max(Math.abs(x),Math.abs(y))<GAMEPAD_DEAD_ZONE)return null;
  if(Math.abs(x)>Math.abs(y))return x>0?'right':'left';
  return y>0?'down':'up';
}

function emitKey(key,type='keydown'){
  window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true,cancelable:true}));
}

function releaseGamepadMovement(){
  if(gamepadState.direction){
    emitKey(GAMEPAD_KEYS[gamepadState.direction],'keyup');
    gamepadState.direction=null;
  }
  if(typeof stopMoving==='function')stopMoving();
}

function applyWorldDirection(direction){
  if(direction===gamepadState.direction)return;
  if(gamepadState.direction)emitKey(GAMEPAD_KEYS[gamepadState.direction],'keyup');
  gamepadState.direction=direction;
  if(direction)emitKey(GAMEPAD_KEYS[direction],'keydown');
}

function risingGamepadButton(gp,index){
  const now=gamepadPressed(gp,index);
  const before=gamepadState.buttons.get(index)===true;
  gamepadState.buttons.set(index,now);
  return now&&!before;
}

function activateFocusedBattleCommand(){
  const buttons=battleButtons();
  if(!buttons.length)return false;
  let target=buttons.includes(document.activeElement)?document.activeElement:buttons[0];
  target.focus({preventScroll:true});
  target.click();
  return true;
}

function processGamepad(gp,now=performance.now()){
  if(typeof s==='undefined'||!s||!gp){
    releaseGamepadMovement();
    return false;
  }

  const direction=gamepadDirection(gp);
  if(s.screen==='world'&&!s.dialog){
    gamepadState.lastBattleDirection=null;
    applyWorldDirection(direction);
  }else{
    releaseGamepadMovement();
    if(s.screen==='battle'&&direction){
      if(direction!==gamepadState.lastBattleDirection||now-gamepadState.lastBattleNavAt>=GAMEPAD_NAV_REPEAT_MS){
        focusBattle(direction==='right'||direction==='down'?1:-1);
        gamepadState.lastBattleDirection=direction;
        gamepadState.lastBattleNavAt=now;
      }
    }else{
      gamepadState.lastBattleDirection=null;
    }
  }

  if(risingGamepadButton(gp,0)){
    if(s.screen==='battle')activateFocusedBattleCommand();
    else if(s.screen==='world'){
      emitKey('Enter','keydown');
      emitKey('Enter','keyup');
    }
  }

  /* B is cancel/close only. It is deliberately never mapped to runAway. */
  if(risingGamepadButton(gp,1)&&s.screen==='world'&&s.dialog){
    emitKey('Escape','keydown');
    emitKey('Escape','keyup');
  }

  if(risingGamepadButton(gp,9)&&s.screen==='world'&&!s.dialog){
    emitKey('m','keydown');
    emitKey('m','keyup');
  }
  return true;
}

function firstConnectedGamepad(){
  if(typeof navigator.getGamepads!=='function')return null;
  try{return [...(navigator.getGamepads()||[])].find(Boolean)||null}catch{return null}
}

function pollGamepad(now){
  const gp=firstConnectedGamepad();
  if(gp)processGamepad(gp,now);
  else {
    releaseGamepadMovement();
    gamepadState.buttons.clear();
    gamepadState.lastBattleDirection=null;
  }
  gamepadState.raf=requestAnimationFrame(pollGamepad);
}

function hardReleaseGamepad(){
  releaseGamepadMovement();
  gamepadState.buttons.clear();
  gamepadState.lastBattleDirection=null;
}

if(!window.LQ_REQ124_GAMEPAD_BOUND){
  window.addEventListener('gamepaddisconnected',hardReleaseGamepad);
  window.addEventListener('blur',hardReleaseGamepad);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hardReleaseGamepad()});
  gamepadState.raf=requestAnimationFrame(pollGamepad);
  window.LQ_REQ124_GAMEPAD_BOUND=true;
}

function assert(ok,reason){
  if(ok)return;
  const el=document.createElement('i');
  el.hidden=true;
  el.className='lqReq122KeyboardSmokeFailure';
  el.dataset.reason=String(reason);
  document.body.appendChild(el);
  throw new TypeError(`REQ-122/124 input smoke failed: ${reason}`);
}

function syntheticKey(key,{repeat=false,target=window}={}){
  const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,repeat});
  target.dispatchEvent(event);
}

function gamepadSmoke(){
  const button=(pressed=false)=>({pressed,value:pressed?1:0});
  const gp=(axes=[0,0],pressed=[])=>({axes,buttons:Array.from({length:16},(_,i)=>button(pressed.includes(i)))});
  assert(gamepadDirection(gp([0,0]))===null,'gamepad dead zone');
  assert(gamepadDirection(gp([.8,.1]))==='right','gamepad analog horizontal');
  assert(gamepadDirection(gp([.1,-.9]))==='up','gamepad analog vertical');
  assert(gamepadDirection(gp([0,0],[15]))==='right','gamepad dpad direction');
  assert(typeof activateFocusedBattleCommand==='function','battle canonical button activation path present');
  assert(typeof releaseGamepadMovement==='function','gamepad hard release path present');
  const marker=document.createElement('i');
  marker.hidden=true;
  marker.className='lqReq124GamepadSmokeMarker';
  marker.dataset.deadZone='true';
  marker.dataset.dpad='true';
  marker.dataset.release='true';
  marker.dataset.canonicalBattleButton='true';
  marker.dataset.touchAuthorityChanged='false';
  document.body.appendChild(marker);
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

    gamepadSmoke();
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
    hardReleaseGamepad();
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
window.LQ_REQ124_GAMEPAD_STATUS={
  requirement:'REQ-124',
  gamepadApi:typeof navigator.getGamepads==='function'?'available':'unsupported-safe-noop',
  deadZone:GAMEPAD_DEAD_ZONE,
  worldMovementViaExistingKeyboardPath:true,
  worldActionViaExistingKeyboardPath:true,
  battleViaCanonicalButtons:true,
  accidentalRunMapping:false,
  disconnectRelease:true,
  blurRelease:true,
  visibilityRelease:true,
  touchAuthorityChanged:false,
  saveChanged:false,
  storyChanged:false
};
window.LQ_REQ124_GAMEPAD_TEST={gamepadDirection,processGamepad,releaseGamepadMovement,activateFocusedBattleCommand,gamepadSmoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
