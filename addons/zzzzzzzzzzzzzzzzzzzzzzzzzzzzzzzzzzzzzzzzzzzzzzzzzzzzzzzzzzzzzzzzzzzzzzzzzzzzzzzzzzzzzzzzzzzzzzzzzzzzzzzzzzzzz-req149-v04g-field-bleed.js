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
        radial-gradient(ellipse at 18% 8%,rgba(112,142,74,.18) 0 16%,transparent 43%),
        radial-gradient(ellipse at 82% 88%,rgba(98,126,66,.16) 0 15%,transparent 42%),
        radial-gradient(ellipse at 58% 52%,rgba(54,91,49,.20) 0 19%,transparent 52%),
        linear-gradient(180deg,#263f2e 0%,#294c31 20%,#315633 50%,#29482f 78%,#22372b 100%) !important;
      box-shadow:inset 0 0 56px rgba(8,19,15,.34);
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
    document.body.dataset.req149FieldBleed='v04g';
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
window.LQ_REQ149_V04G_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-G',presentationOnly:true,req146ScalePreserved:true,gameplayCoordinatesUnchanged:true};
})();
