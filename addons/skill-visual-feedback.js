(() => {
'use strict';

/* Presentation-only add-on for REQ-018. Never mutates combat numbers. */
const style=document.createElement('style');style.textContent=`
.lqAzureSlashFx{position:fixed;z-index:9998;left:50%;top:43%;width:min(72vw,430px);height:150px;transform:translate(-50%,-50%) rotate(-11deg);pointer-events:none;opacity:0;animation:lqAzureSlash .52s ease-out both}
.lqAzureSlashFx:before,.lqAzureSlashFx:after{content:'';position:absolute;left:5%;right:5%;top:50%;height:7px;border-radius:999px;background:linear-gradient(90deg,transparent,#9ff4ff 18%,#52bfff 48%,#eefcff 72%,transparent);box-shadow:0 0 10px #79dfff,0 0 28px #239cff;transform:skewX(-24deg)}
.lqAzureSlashFx:after{top:62%;height:3px;opacity:.75;transform:skewX(22deg) rotate(5deg)}
@keyframes lqAzureSlash{0%{opacity:0;transform:translate(-50%,-50%) rotate(-11deg) scaleX(.25)}18%{opacity:1}58%{opacity:1;transform:translate(-50%,-50%) rotate(-11deg) scaleX(1.08)}100%{opacity:0;transform:translate(-50%,-50%) rotate(-11deg) scaleX(1.18) translateY(-8px)}}
.lqAzureEnemyHit{animation:lqAzureEnemyHit .34s ease-out both!important;filter:brightness(1.65) drop-shadow(0 0 18px #66d9ff)!important}@keyframes lqAzureEnemyHit{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}50%{transform:translateX(7px)}75%{transform:translateX(-3px)}}
.lqMpSpentPulse{animation:lqMpSpent .46s ease-out both!important}@keyframes lqMpSpent{0%{transform:scale(1)}35%{transform:scale(1.18);color:#d7fbff;text-shadow:0 0 12px #56cfff}100%{transform:scale(1)}}
.lqMpDeniedPulse{animation:lqMpDenied .34s ease-out both!important}@keyframes lqMpDenied{0%,100%{transform:translateX(0)}33%{transform:translateX(-4px);color:#ffb9b9}66%{transform:translateX(4px);color:#ffb9b9}}
@media(prefers-reduced-motion:reduce){.lqAzureSlashFx{animation-duration:.12s}.lqAzureEnemyHit,.lqMpSpentPulse,.lqMpDeniedPulse{animation:none!important}.lqAzureSlashFx:after{display:none}}
`;document.head.appendChild(style);

function pulseMp(className){
 const el=app.querySelector('.lqMpValue');if(!el)return;
 el.classList.remove('lqMpSpentPulse','lqMpDeniedPulse');void el.offsetWidth;el.classList.add(className);
 setTimeout(()=>el.classList.remove(className),520);
}
function successFx(){
 const fx=document.createElement('div');fx.className='lqAzureSlashFx';fx.setAttribute('aria-hidden','true');document.body.appendChild(fx);setTimeout(()=>fx.remove(),650);
 const enemy=app.querySelector('.enemy,.lqOriginalEnemyArt,.enemySpriteStage');
 if(enemy){enemy.classList.add('lqAzureEnemyHit');setTimeout(()=>enemy.classList.remove('lqAzureEnemyHit'),430);}
 pulseMp('lqMpSpentPulse');
}
function deniedFx(){pulseMp('lqMpDeniedPulse');}

const azureFeedbackBase=window.lqUseAzureSlash;
if(typeof azureFeedbackBase==='function'){
 window.lqUseAzureSlash=function(){
  const beforeLog=Array.isArray(s.log)?s.log.length:0;
  const result=azureFeedbackBase.apply(this,arguments);
  const newLines=Array.isArray(s.log)?s.log.slice(beforeLog):[];
  if(newLines.some(line=>String(line).includes('ルークの蒼閃！')))successFx();
  else if(newLines.some(line=>String(line).includes('MPが足りない！')))deniedFx();
  return result;
 };
}

window.LQ_AZURE_SLASH_FEEDBACK_STATUS={
 stage:'azure-slash-presentation-feedback',
 delegatesBase:typeof azureFeedbackBase==='function',
 successDetectedFromBattleLog:true,
 insufficientMpNoSuccessFx:true,
 pointerPassthrough:true,
 reducedMotion:true,
 transientCleanup:true,
 combatStateMutation:false
};
})();
