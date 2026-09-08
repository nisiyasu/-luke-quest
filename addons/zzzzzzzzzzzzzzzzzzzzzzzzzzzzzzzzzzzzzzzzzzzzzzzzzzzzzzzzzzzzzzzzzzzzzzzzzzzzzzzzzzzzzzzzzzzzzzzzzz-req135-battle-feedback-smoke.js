(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq135Smoke'))return;

function marker(data){
 let el=document.getElementById('lqReq135BattleFeedbackSmokeMarker');
 if(!el){el=document.createElement('i');el.id='lqReq135BattleFeedbackSmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}
 Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
 return el;
}
function handler(button){return (button?.getAttribute('onclick')||'').replace(/\s+/g,'');}
function settle(){return new Promise(resolve=>setTimeout(resolve,80));}

async function run(){
 const snapshot=structuredClone(s);
 const originalAttack=attack,originalAction=action,originalMove=move;
 let attackCalls=0,worldActionCalls=0,worldMoveCalls=0;
 try{
  s.screen='battle';
  s.enemy={n:'REQ-135 TEST',e:'◈',hp:100,a:[1,1],xp:0,g:0};
  s.ehp=100;
  s.log=['REQ-135 battle command feedback'];
  s.hp=Math.max(1,s.hp||42);
  if(Number.isFinite(s.mp))s.mp=Math.max(4,s.mp);
  battle();
  await settle();

  const api=window.LQ_REQ135_BATTLE_COMMAND_FEEDBACK;
  const style=document.getElementById('lq-req135-battle-command-feedback-style');
  const buttons=[...document.querySelectorAll('#app .lqBattleCommandButton')];
  const enabled=buttons.filter(b=>!b.disabled&&b.getAttribute('aria-disabled')!=='true');
  const allDecorated=buttons.length>=4&&buttons.every(b=>b.classList.contains('lqBattleFeedbackButton'));
  const minHeight=enabled.length?Math.min(...enabled.map(b=>b.getBoundingClientRect().height)):0;
  const css=style?.textContent||'';
  const activeScoped=css.includes('.lqBattleFeedbackButton}:active')||css.includes('.lqBattleFeedbackButton:active');
  const focusScoped=css.includes('.lqBattleFeedbackButton}:focus-visible')||css.includes('.lqBattleFeedbackButton:focus-visible');
  const disabledScoped=css.includes(':disabled')&&css.includes('[aria-disabled="true"]');
  const reducedMotion=css.includes('prefers-reduced-motion');

  attack=function(){attackCalls++;};
  action=function(){worldActionCalls++;};
  move=function(){worldMoveCalls++;};
  const attackButton=buttons.find(b=>handler(b)==='attack()')||buttons.find(b=>(b.textContent||'').includes('こうげき'));
  if(attackButton){
   attackButton.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:9135,pointerType:'touch',isPrimary:true,clientX:20,clientY:20,buttons:1}));
   attackButton.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:9135,pointerType:'touch',isPrimary:true,clientX:20,clientY:20,buttons:0}));
   attackButton.click();
  }
  const singleDispatch=attackCalls===1;
  const worldExcluded=worldActionCalls===0&&worldMoveCalls===0;

  attack=originalAttack;action=originalAction;move=originalMove;
  battle();
  await settle();
  const rerenderButtons=[...document.querySelectorAll('#app .lqBattleCommandButton')];
  const rerenderProtected=rerenderButtons.length>=4&&rerenderButtons.every(b=>b.classList.contains('lqBattleFeedbackButton'));

  const pass=!!api&&api.presentationOnly===true&&api.pointerHandlerAdded===false&&api.clickHandlerAdded===false&&
   minHeight>=48&&allDecorated&&activeScoped&&focusScoped&&disabledScoped&&reducedMotion&&singleDispatch&&worldExcluded&&rerenderProtected;
  marker({pass,minHeight:minHeight.toFixed(1),buttonCount:buttons.length,allDecorated,activeScoped,focusScoped,disabledScoped,reducedMotion,singleDispatch,worldExcluded,rerenderProtected});
  if(!pass)console.error('REQ-135 acceptance details',document.getElementById('lqReq135BattleFeedbackSmokeMarker')?.dataset);
 }catch(error){
  console.error('REQ-135 smoke FAIL',error);
  marker({pass:false,reason:error?.message||String(error)});
 }finally{
  attack=originalAttack;action=originalAction;move=originalMove;
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
  render();
 }
}
if(document.readyState==='complete')setTimeout(run,800);
else addEventListener('load',()=>setTimeout(run,800),{once:true});
})();
