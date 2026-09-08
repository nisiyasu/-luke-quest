(() => {
'use strict';

/* REQ-143 — Leon Gold Standard presentation candidate.
   Presentation-only decorator over canonical REQ-128 state/logic.
   It deliberately does NOT own input, save, battle resolution or story flags.
   No backdrop-filter, filter, permanent will-change, fullscreen animation loop,
   or unbounded particles are used on the iPhone path. */

const REQ='REQ-143';
const SCREEN='req128Chapter1Climax';
const STATE_KEY='lqReq128Climax';
const STYLE_ID='lq-req143-leon-gold-style';
const LUKE_ART='assets/images/03334052-E944-4DE4-9C61-48F011193E46.png';

function q(){
  const v=typeof s!=='undefined'&&s?s[STATE_KEY]:null;
  return v&&typeof v==='object'?v:{phase:'reunion',step:0,turn:0};
}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
/* REQ-143 intentionally uses composition, movement and color rather than GPU-heavy blur/filter stacks. */
.lq128{background:#060d18!important;padding:max(8px,env(safe-area-inset-top)) 8px max(8px,env(safe-area-inset-bottom))!important}
.lq128Card{width:min(100%,680px)!important;padding:10px!important;border-radius:14px!important;background:#0c1828!important;border:1px solid #8eb4da33!important;box-shadow:0 12px 30px #0008!important}
.lq128Scene{min-height:clamp(330px,54dvh,470px)!important;background:linear-gradient(180deg,#263e5a 0 28%,#51667a 28% 42%,#868378 42% 57%,#3c4045 57% 100%)!important;border-color:#d8ecff29!important;isolation:isolate}
.lq128Scene::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(158deg,transparent 0 56%,#171f28 56% 62%,transparent 62%),linear-gradient(202deg,transparent 0 63%,#242b31 63% 69%,transparent 69%)}
.lq128Scene::after{content:"";position:absolute;left:0;right:0;bottom:0;height:42%;z-index:0;pointer-events:none;background:linear-gradient(168deg,transparent 0 18%,#2d3337 18% 25%,transparent 25%),linear-gradient(192deg,transparent 0 30%,#242a2e 30% 39%,transparent 39%),linear-gradient(180deg,transparent,#151a1f88)}
.lq128Wind{z-index:2!important;inset:14px 14px auto!important;text-align:left!important;letter-spacing:.22em!important;color:#eef7ffb8!important;font-size:11px!important;font-weight:900;text-shadow:0 1px 2px #000!important}
.lq143Sky{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.lq143Cloud{position:absolute;height:2px;border-radius:999px;background:#f5fbff66;transform:rotate(-7deg)}
.lq143Cloud.c1{width:31%;left:7%;top:22%}.lq143Cloud.c2{width:20%;right:8%;top:31%}.lq143Cloud.c3{width:42%;left:30%;top:13%;opacity:.55}
.lq143RidgeMark{position:absolute;z-index:3;left:50%;bottom:10%;transform:translateX(-50%);width:70%;height:8px;border-radius:50%;background:#080b0e66;pointer-events:none}
.lq128People{z-index:6!important;left:4%!important;right:4%!important;bottom:42px!important;height:220px!important;display:block!important;text-align:left!important}
.lq143Actor{position:absolute;bottom:0;width:112px;display:flex;flex-direction:column;align-items:center;gap:5px;transition:left .28s ease,right .28s ease,bottom .28s ease,transform .22s ease,opacity .2s ease;z-index:7;color:#fff7dd;text-align:center}
.lq143Actor strong{font-size:12px;background:#07111fd9;border:1px solid #ffffff24;border-radius:999px;padding:3px 8px;white-space:nowrap}
.lq143Actor small{font-size:10px;color:#d7e5f2;background:#07111fb8;border-radius:7px;padding:2px 5px;min-height:15px}
.lq143Figure{position:relative;width:72px;height:112px;border-radius:38px 38px 18px 18px;background:linear-gradient(90deg,#1b2635,#33455a 50%,#172230);border:1px solid #ffffff29;overflow:hidden;box-shadow:0 8px 12px #0007}
.lq143Figure::before{content:"";position:absolute;left:20px;top:9px;width:31px;height:35px;border-radius:48% 48% 45% 45%;background:#e3b995;border:1px solid #6b4937}
.lq143Figure::after{content:"";position:absolute;left:10px;right:10px;bottom:8px;height:55px;border-radius:24px 24px 10px 10px;background:#415b78;border:1px solid #ffffff18}
.lq143Actor[data-role="leon"] .lq143Figure::before{background:#e7c3a2;box-shadow:0 -8px 0 4px #e7d6a0}
.lq143Actor[data-role="leon"] .lq143Figure::after{background:#6d7481}
.lq143Actor[data-role="sister"] .lq143Figure{height:98px;width:64px}.lq143Actor[data-role="sister"] .lq143Figure::before{left:17px;width:28px;height:32px;background:#ebc3a4;box-shadow:0 -7px 0 4px #d6b56e}.lq143Actor[data-role="sister"] .lq143Figure::after{background:#6f6388}
.lq143Actor[data-role="eleanor"] .lq143Figure::before{background:#ead0b5;box-shadow:0 -8px 0 4px #d7d7d7}.lq143Actor[data-role="eleanor"] .lq143Figure::after{background:#eee5d1}
.lq143Actor[data-role="luke"] .lq143Figure{background-image:url('${LUKE_ART}');background-size:250%;background-position:50% 22%;background-repeat:no-repeat}
.lq143Actor[data-role="luke"] .lq143Figure::before,.lq143Actor[data-role="luke"] .lq143Figure::after{display:none}
.lq143Actor[data-role="luke"]{left:8%}.lq143Actor[data-role="leon"]{right:8%}.lq143Actor[data-role="sister"]{left:47%;transform:translateX(-50%)}.lq143Actor[data-role="eleanor"]{right:1%}
.lq143Phase-reunion.lq143Step-0 .lq143Actor[data-role="leon"],.lq143Phase-reunion.lq143Step-1 .lq143Actor[data-role="leon"]{transform:translateX(12px);opacity:.78}
.lq143Phase-reunion.lq143Step-3 .lq143Actor[data-role="leon"],.lq143Phase-reunion.lq143Step-4 .lq143Actor[data-role="leon"]{transform:translateX(-8px)}
.lq143Phase-reunion.lq143Step-5 .lq143Actor[data-role="leon"],.lq143Phase-reunion.lq143Step-6 .lq143Actor[data-role="leon"]{transform:translateX(-18px) rotate(-1deg)}
.lq143Phase-confront .lq143Actor[data-role="luke"]{left:15%}.lq143Phase-confront .lq143Actor[data-role="leon"]{right:14%;transform:translateX(calc(-8px * var(--lq143-turn,0)))}
.lq143Blade{position:absolute;z-index:5;right:28%;bottom:112px;width:92px;height:3px;background:#eef7ff;transform:rotate(-28deg);transform-origin:right center;box-shadow:0 0 0 1px #26394a;opacity:0}
.lq143Phase-confront .lq143Blade{opacity:.9}
.lq143Phase-confront.lq143Turn-1 .lq143Blade{transform:rotate(-12deg) translateX(-16px)}.lq143Phase-confront.lq143Turn-2 .lq143Blade{transform:rotate(-36deg) translateX(-28px)}
.lq143Phase-aftermath .lq143Actor[data-role="luke"]{left:5%}.lq143Phase-aftermath .lq143Actor[data-role="leon"]{right:4%;transform:translateY(4px)}
.lq143Phase-aftermath.lq143Step-0 .lq143Actor[data-role="sister"]{left:52%;bottom:6px}
.lq143Phase-aftermath.lq143Step-1 .lq143Actor[data-role="sister"],.lq143Phase-aftermath.lq143Step-2 .lq143Actor[data-role="sister"]{bottom:-24px;transform:translateX(-50%) rotate(7deg)}
.lq143Phase-aftermath.lq143Step-3 .lq143Actor[data-role="luke"],.lq143Phase-aftermath.lq143Step-4 .lq143Actor[data-role="luke"],.lq143Phase-aftermath.lq143Step-5 .lq143Actor[data-role="luke"]{left:30%;bottom:-3px}
.lq143Impact{position:absolute;z-index:9;left:48%;top:46%;width:86px;height:86px;transform:translate(-50%,-50%);pointer-events:none;opacity:0}
.lq143Impact::before,.lq143Impact::after{content:"";position:absolute;left:42px;top:5px;width:3px;height:76px;background:#fff4cd;transform:rotate(45deg)}.lq143Impact::after{transform:rotate(-45deg)}
.lq143Phase-aftermath.lq143Step-1 .lq143Impact{opacity:.72}
.lq143Silence{position:absolute;z-index:4;inset:0;background:#07111f33;opacity:0;pointer-events:none}
.lq143Phase-aftermath.lq143Step-1 .lq143Silence,.lq143Phase-aftermath.lq143Step-2 .lq143Silence{opacity:1}
.lq143Phase-return .lq143Sky{background:linear-gradient(180deg,#422d53aa,#aa704855)}
.lq143Phase-return .lq143Actor[data-role="luke"]{left:1%}.lq143Phase-return .lq143Actor[data-role="leon"]{right:27%}.lq143Phase-return .lq143Actor[data-role="sister"]{left:45%;bottom:-18px}.lq143Phase-return .lq143Actor[data-role="eleanor"]{right:1%}
.lq143Beat{position:absolute;z-index:11;left:12px;top:38px;padding:5px 8px;border-radius:8px;background:#07111fda;border-left:3px solid #e7ca67;color:#e8edf2;font-size:10px;font-weight:900;letter-spacing:.08em;pointer-events:none}
.lq143QualityMark{position:absolute;right:8px;top:8px;z-index:11;padding:3px 6px;border-radius:999px;background:#07111fbf;border:1px solid #ffffff22;color:#c5d4e3;font-size:9px;font-weight:900;pointer-events:none}
.lq128Caption{position:relative!important;z-index:12!important;margin-top:8px!important;min-height:102px!important;background:#06101df0!important;border:1px solid #ffffff1f!important;border-left:3px solid #d5bd72!important;line-height:1.72!important;font-size:14px!important}
.lq128Actions{position:relative;z-index:12}.lq128 button{min-height:48px!important;background:#2c6fd4!important;box-shadow:0 3px 0 #173a70!important}.lq128 button:active{transform:translateY(2px);box-shadow:0 1px 0 #173a70!important}.lq128 button.secondary{background:#34475d!important;box-shadow:0 3px 0 #1e2b39!important}
.lq128Pulse{position:relative;z-index:12;color:#b6c6d6!important}
@media(max-width:430px){.lq143Actor{width:90px}.lq143Figure{width:62px;height:100px}.lq143Actor[data-role="luke"]{left:3%}.lq143Actor[data-role="leon"]{right:3%}.lq128Scene{min-height:360px!important}}
@media(prefers-reduced-motion:reduce){.lq143Actor,.lq143Blade{transition:none!important}}
`;
  document.head.appendChild(st);
}

function actor(role,name,note=''){
  return `<div class="lq143Actor" data-role="${esc(role)}"><div class="lq143Figure" aria-hidden="true"></div><strong>${esc(name)}</strong><small>${esc(note)}</small></div>`;
}
function beatLabel(state){
  const phase=state.phase,step=state.step||0,turn=state.turn||0;
  if(phase==='reunion'){
    if(step<=1)return '追跡の終点';
    if(step<=3)return '連れ戻し';
    if(step===4)return '勇者選定の事実';
    if(step===5)return '崩れる自負';
    return '剣を抜かず向き合う';
  }
  if(phase==='confront')return `非殺傷の対峙 · ${Math.min(turn+1,3)}/3`;
  if(phase==='aftermath'){
    if(step===0)return '割って入る影';
    if(step<=2)return '取り返せない一撃';
    if(step<=4)return '責めるより先に';
    return '共に助ける';
  }
  if(phase==='return')return step>=3?'第一章の終わり':'王都への帰還';
  return '第一章クライマックス';
}
function actorSet(state){
  if(state.phase==='reunion'||state.phase==='confront'){
    const leonNote=state.phase==='confront'?'制御を失いかけている':state.step>=4?'言葉を受け止めきれない':'王都へ戻れない';
    return actor('luke','ルーク',state.phase==='confront'?'攻撃しない':'連れ戻しに来た')+actor('leon','レオン',leonNote);
  }
  if(state.phase==='aftermath'){
    const sisterNote=state.step>=1?'命に別状はない':'止めに入る';
    const lukeNote=state.step>=3?'まず助ける':'剣を向けない';
    const leonNote=state.step>=1?'我に返る':'止まれない';
    return actor('luke','ルーク',lukeNote)+actor('sister','レオンの妹',sisterNote)+actor('leon','レオン',leonNote);
  }
  if(state.phase==='return')return actor('luke','ルーク','帰還')+actor('sister','レオンの妹','治療へ')+actor('leon','レオン','言葉を失う')+actor('eleanor','エレノア','公には慈悲深く迎える');
  return actor('luke','ルーク')+actor('leon','レオン');
}
function decorate(){
  installStyle();
  if(typeof s==='undefined'||s.screen!==SCREEN)return;
  const scene=document.querySelector('.lq128Scene');
  if(!scene)return;
  const state=q();
  scene.classList.forEach(c=>{if(/^lq143(Phase|Step|Turn)-/.test(c))scene.classList.remove(c);});
  scene.classList.add(`lq143Phase-${state.phase}`,`lq143Step-${Number(state.step)||0}`,`lq143Turn-${Number(state.turn)||0}`);
  scene.style.setProperty('--lq143-turn',String(Number(state.turn)||0));
  scene.dataset.lq143GoldStandard='candidate';
  const people=scene.querySelector('.lq128People');
  if(people)people.innerHTML=actorSet(state);
  scene.querySelectorAll('.lq143Sky,.lq143RidgeMark,.lq143Blade,.lq143Impact,.lq143Silence,.lq143Beat,.lq143QualityMark').forEach(n=>n.remove());
  const sky=document.createElement('div');sky.className='lq143Sky';sky.innerHTML='<i class="lq143Cloud c1"></i><i class="lq143Cloud c2"></i><i class="lq143Cloud c3"></i>';scene.prepend(sky);
  const ridge=document.createElement('div');ridge.className='lq143RidgeMark';scene.appendChild(ridge);
  const blade=document.createElement('div');blade.className='lq143Blade';scene.appendChild(blade);
  const impact=document.createElement('div');impact.className='lq143Impact';scene.appendChild(impact);
  const silence=document.createElement('div');silence.className='lq143Silence';scene.appendChild(silence);
  const beat=document.createElement('div');beat.className='lq143Beat';beat.textContent=beatLabel(state);scene.appendChild(beat);
  const mark=document.createElement('div');mark.className='lq143QualityMark';mark.textContent='Q5 · GOLD STANDARD CANDIDATE';scene.appendChild(mark);
  const next=document.getElementById('lq128Next');if(next)next.setAttribute('aria-label',`${beatLabel(state)}：${next.textContent.trim()}`);
  const guard=document.getElementById('lq128Guard');if(guard)guard.setAttribute('aria-label','レオンを傷つけず身を守る');
  const call=document.getElementById('lq128Call');if(call)call.setAttribute('aria-label','攻撃せずレオンへ呼びかける');
}

installStyle();
if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);decorate();return out;};
}
queueMicrotask(decorate);

window.LQ_REQ143_QUALITY_STATUS={
  requirement:REQ,
  qualitySystem:'docs/quality/QUALITY_SYSTEM.md',
  leonQualityLevel:'Q5',
  presentationOnly:true,
  canonicalReq128LogicPreserved:true,
  emojiStandinsRemoved:true,
  lukeApprovedArtReused:true,
  heavyFilterUsed:false,
  backdropFilterUsed:false,
  permanentWillChangeUsed:false,
  ownerExperiencePass:'PENDING'
};
window.LQ_REQ143_TEST={decorate,beatLabel,actorSet,SCREEN,STATE_KEY};
})();
