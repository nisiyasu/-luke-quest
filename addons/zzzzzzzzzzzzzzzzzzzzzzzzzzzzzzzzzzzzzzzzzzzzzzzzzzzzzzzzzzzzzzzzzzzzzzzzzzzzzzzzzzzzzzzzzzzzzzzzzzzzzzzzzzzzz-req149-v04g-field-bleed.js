(() => {
'use strict';

/* REQ-149 V04-G — presentation-only field environment bleed.
 * REQ-146 deliberately pulls the logical map back to 0.78 on iPhone portrait.
 * When the scaled map is shorter than the fullscreen shell, this addon gives the
 * non-interactive stage around it a terrain-colored environment instead of a black
 * letterbox. Logical MAPS, collision, camera scale, input, save and story stay exact.
 */
const STYLE_ID='lqReq149FieldBleedStyle';

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    .gameShell[data-lq-req149-field-bleed="true"]{
      background:
        radial-gradient(ellipse at 17% 9%,rgba(151,169,89,.15) 0 17%,transparent 44%),
        radial-gradient(ellipse at 82% 88%,rgba(68,111,57,.20) 0 18%,transparent 46%),
        radial-gradient(ellipse at 58% 52%,rgba(123,146,75,.11) 0 20%,transparent 52%),
        linear-gradient(180deg,#355d37 0%,#3c673a 20%,#426f3d 50%,#385f37 80%,#315333 100%) !important;
      box-shadow:inset 0 0 44px rgba(20,39,24,.22);
    }
  `;
  document.head.appendChild(style);
}

function apply(){
  ensureStyle();
  const shell=document.querySelector('.gameShell');
  if(!shell)return;
  const active=typeof s!=='undefined'&&s&&s.screen==='world'&&s.map==='field';
  if(active){
    shell.dataset.lqReq149FieldBleed='true';
    document.body.dataset.req149FieldBleed='v04g-grass';
  }else{
    delete shell.dataset.lqReq149FieldBleed;
    delete document.body.dataset.req149FieldBleed;
  }
}

if(typeof render==='function'){
  const previous=render;
  render=function(){const result=previous.apply(this,arguments);apply();return result;};
}
window.addEventListener('resize',apply,{passive:true});
window.addEventListener('orientationchange',apply,{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',apply,{passive:true});
apply();
window.LQ_REQ149_V04G_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-G2',presentationOnly:true,req146ScalePreserved:true,gameplayCoordinatesUnchanged:true,grassStageBleed:true};
})();
