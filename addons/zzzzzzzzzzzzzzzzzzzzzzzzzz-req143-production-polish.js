(() => {
'use strict';

/* REQ-143 production polish.
   Runs after the Gold Standard decorator and removes developer-facing labels.
   Replaces prototype CSS-only non-Luke figures with lightweight original SVG
   stage art. Presentation-only: no input/save/story/battle ownership. */

const STYLE_ID='lq-req143-production-polish';
const SCREEN='req128Chapter1Climax';
const ART={
  leon:'assets/req143/leon-stage.svg',
  sister:'assets/req143/leon-sister-stage.svg',
  eleanor:'assets/req143/eleanor-stage.svg'
};

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
  /* Internal design/debug language never belongs in the player's climax. */
  .lq128Scene .lq143Beat,.lq128Scene .lq143QualityMark{display:none!important}
  .lq128Scene .lq143Actor small{display:none!important}
  .lq128Scene .lq143Actor{gap:3px!important}
  .lq128Scene .lq143Actor strong{font-size:11px!important;padding:2px 7px!important;background:#07111fcc!important}

  .lq128Scene .lq143Actor[data-role="leon"] .lq143Figure,
  .lq128Scene .lq143Actor[data-role="sister"] .lq143Figure,
  .lq128Scene .lq143Actor[data-role="eleanor"] .lq143Figure{
    width:86px!important;height:126px!important;border:0!important;border-radius:0!important;
    background-color:transparent!important;background-repeat:no-repeat!important;
    background-size:contain!important;background-position:center bottom!important;
    box-shadow:none!important;overflow:visible!important
  }
  .lq128Scene .lq143Actor[data-role="leon"] .lq143Figure{background-image:url('${ART.leon}')!important}
  .lq128Scene .lq143Actor[data-role="sister"] .lq143Figure{width:78px!important;height:116px!important;background-image:url('${ART.sister}')!important}
  .lq128Scene .lq143Actor[data-role="eleanor"] .lq143Figure{background-image:url('${ART.eleanor}')!important}
  .lq128Scene .lq143Actor[data-role="leon"] .lq143Figure::before,
  .lq128Scene .lq143Actor[data-role="leon"] .lq143Figure::after,
  .lq128Scene .lq143Actor[data-role="sister"] .lq143Figure::before,
  .lq128Scene .lq143Actor[data-role="sister"] .lq143Figure::after,
  .lq128Scene .lq143Actor[data-role="eleanor"] .lq143Figure::before,
  .lq128Scene .lq143Actor[data-role="eleanor"] .lq143Figure::after{display:none!important}

  /* Give the staged actors room to read without adding compositor-heavy FX. */
  .lq128Scene .lq128People{height:232px!important;bottom:32px!important}
  .lq128Scene .lq143RidgeMark{bottom:7%!important;width:78%!important;height:7px!important}
  .lq128Scene .lq143Phase-confront .lq143Actor[data-role="leon"]{bottom:3px!important}
  .lq128Scene .lq143Phase-aftermath.lq143Step-1 .lq143Actor[data-role="sister"],
  .lq128Scene .lq143Phase-aftermath.lq143Step-2 .lq143Actor[data-role="sister"]{bottom:-34px!important}
  .lq128Scene[data-req143-production="true"] .lq143Sky{opacity:.9}

  @media(max-width:430px){
    .lq128Scene .lq143Actor[data-role="leon"] .lq143Figure{width:74px!important;height:112px!important}
    .lq128Scene .lq143Actor[data-role="sister"] .lq143Figure{width:68px!important;height:104px!important}
    .lq128Scene .lq143Actor[data-role="eleanor"] .lq143Figure{width:72px!important;height:108px!important}
    .lq128Scene .lq143Actor strong{font-size:10px!important}
  }
  `;
  document.head.appendChild(st);
}

function polish(){
  installStyle();
  if(typeof s==='undefined'||s.screen!==SCREEN)return;
  const scene=document.querySelector('.lq128Scene');
  if(!scene)return;
  scene.dataset.req143Production='true';
  scene.querySelectorAll('.lq143Beat,.lq143QualityMark').forEach(n=>n.remove());
  scene.querySelectorAll('.lq143Actor small').forEach(n=>n.remove());
  for(const [role,url] of Object.entries(ART)){
    const fig=scene.querySelector(`.lq143Actor[data-role="${role}"] .lq143Figure`);
    if(fig){fig.dataset.req143Art=url;fig.setAttribute('aria-hidden','true');}
  }
}

installStyle();
if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);polish();return out;};
}
queueMicrotask(polish);

window.LQ_REQ143_PRODUCTION_POLISH={
  presentationOnly:true,
  developerLabelsRemoved:true,
  cssOnlyNonLukeFiguresRemoved:true,
  originalStageArt:[ART.leon,ART.sister,ART.eleanor],
  ownerExperiencePass:'PENDING'
};
})();
