(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq134Smoke'))return;

function marker(data){
 let el=document.getElementById('lqReq134BattleTouchSmokeMarker');
 if(!el){el=document.createElement('i');el.id='lqReq134BattleTouchSmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}
 Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
 return el;
}
function fail(reason,extra={}){
 console.error('REQ-134 smoke FAIL',reason,extra);
 marker({pass:false,reason,...extra});
}
function canonicalHandler(button){return (button?.getAttribute('onclick')||'').replace(/\s+/g,'');}
function nextMutationTurn(){return new Promise(resolve=>queueMicrotask(resolve));}
async function run(){
 const snapshot=structuredClone(s);
 const originalAttack=attack;
 const originalAction=action;
 const originalMove=move;
 let attackCalls=0,worldActionCalls=0,worldMoveCalls=0;
 try{
  s.screen='battle';
  s.enemy={n:'REQ-134 TEST',e:'◈',hp:100,a:[1,1],xp:0,g:0};
  s.ehp=100;
  s.log=['REQ-134 battle touch acceptance'];
  s.hp=Math.max(1,s.hp||42);
  if(Number.isFinite(s.mp))s.mp=Math.max(4,s.mp);
  battle();
  await nextMutationTurn();

  const card=document.querySelector('.lqBattleCommandCard');
  // The assembled runtime may keep the battle log as a sibling of the command
  // surface. Acceptance therefore checks the canonical battle log in #app,
  // rather than assuming a legacy .card nesting relationship.
  const log=document.querySelector('#app .log');
  const buttons=[...(card?.querySelectorAll('button')||[])];
  const enabled=buttons.filter(b=>!b.disabled&&b.getAttribute('aria-disabled')!=='true');
  const vvWidth=window.visualViewport?.width||window.innerWidth;
  const cardRect=card?.getBoundingClientRect();
  const minHeight=enabled.length?Math.min(...enabled.map(b=>b.getBoundingClientRect().height)):0;
  const noHorizontalOverflow=document.documentElement.scrollWidth<=Math.ceil(vvWidth)+1;
  const cardFits=!!cardRect&&cardRect.left>=-1&&cardRect.right<=vvWidth+1;
  const handlers=buttons.map(canonicalHandler);
  const texts=buttons.map(b=>(b.textContent||'').trim().replace(/\s+/g,' '));
  const hasBase=['attack()','guard()','potion()','runAway()'].every(handler=>handlers.includes(handler));
  // Skill presentation is assembled from later add-ons. Do not pin this gate
  // to one historical display name; prove a non-base battle skill command is
  // present while preserving the four canonical base handlers.
  const hasSkill=buttons.some(b=>b.classList.contains('lqSkillBtn')||/蒼閃|集中斬り/.test(b.textContent||''));
  const styled=enabled.length>=4&&enabled.every(b=>b.classList.contains('lqBattleCommandButton'));
  const logStyle=log?getComputedStyle(log):null;
  const logBounded=!!log&&['auto','scroll'].includes(logStyle.overflowY)&&log.clientHeight<=Math.ceil(window.innerHeight*.23)+2;

  attack=function(){attackCalls++;};
  action=function(){worldActionCalls++;};
  move=function(){worldMoveCalls++;};
  const attackButton=buttons.find(b=>canonicalHandler(b)==='attack()')||buttons.find(b=>(b.textContent||'').includes('こうげき'));
  if(!attackButton){
   fail('canonical attack button missing',{
    buttonCount:buttons.length,
    texts:texts.join('|').slice(0,500),
    handlers:handlers.join('|').slice(0,500),
    cardText:(card?.textContent||'').trim().replace(/\s+/g,' ').slice(0,700),
    allAppButtons:[...document.querySelectorAll('#app button')].map(b=>(b.textContent||'').trim().replace(/\s+/g,' ')).join('|').slice(0,800)
   });
   return;
  }
  attackButton.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:9134,pointerType:'touch',isPrimary:true,clientX:20,clientY:20,buttons:1}));
  attackButton.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,cancelable:true,pointerId:9134,pointerType:'touch',isPrimary:true,clientX:20,clientY:20,buttons:0}));
  attackButton.click();
  const singleDispatch=attackCalls===1;
  const worldExcluded=worldActionCalls===0&&worldMoveCalls===0;

  attack=originalAttack;action=originalAction;move=originalMove;
  battle();
  await nextMutationTurn();
  const rerenderCard=document.querySelector('.lqBattleCommandCard');
  const rerenderProtected=!!rerenderCard&&[...rerenderCard.querySelectorAll('button')].every(b=>b.classList.contains('lqBattleCommandButton'));

  const pass=!!window.LQ_REQ134_BATTLE_TOUCH_UI&&
   window.LQ_REQ134_BATTLE_TOUCH_UI.presentationOnly===true&&
   minHeight>=48&&noHorizontalOverflow&&cardFits&&hasBase&&hasSkill&&styled&&logBounded&&singleDispatch&&worldExcluded&&rerenderProtected;
  marker({pass,minHeight:minHeight.toFixed(1),noHorizontalOverflow,cardFits,hasBase,hasSkill,styled,logBounded,logOverflow:logStyle?.overflowY||'',logHeight:log?.clientHeight||0,singleDispatch,worldExcluded,rerenderProtected,buttonCount:buttons.length,texts:texts.join('|'),handlers:handlers.join('|')});
  if(!pass)console.error('REQ-134 acceptance details',document.getElementById('lqReq134BattleTouchSmokeMarker')?.dataset);
 }catch(error){
  fail(error?.message||String(error));
 }finally{
  attack=originalAttack;action=originalAction;move=originalMove;
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
  render();
 }
}

if(document.readyState==='complete')setTimeout(run,700);
else addEventListener('load',()=>setTimeout(run,700),{once:true});
})();
