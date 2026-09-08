(() => {
'use strict';

/* REQ-143 original stage-art integration.
   Presentation-only. Replaces CSS placeholder figures for Leon and his sister
   with repository-owned original SVG stage actors. Canon/input/save/battle logic is untouched. */
const STYLE_ID='lq-req143-original-stage-art-style';
const LEON_ART='assets/req143/leon-stage.svg';
const SISTER_ART='assets/req143/leon-sister-stage.svg';

function install(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
.lq143Actor[data-role="leon"] .lq143Figure,
.lq143Actor[data-role="sister"] .lq143Figure{
  border:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  background-color:transparent!important;
  background-repeat:no-repeat!important;
  background-position:center bottom!important;
  background-size:contain!important;
}
.lq143Actor[data-role="leon"] .lq143Figure{
  width:82px!important;
  height:124px!important;
  background-image:url('${LEON_ART}')!important;
}
.lq143Actor[data-role="sister"] .lq143Figure{
  width:72px!important;
  height:108px!important;
  background-image:url('${SISTER_ART}')!important;
}
.lq143Actor[data-role="leon"] .lq143Figure::before,
.lq143Actor[data-role="leon"] .lq143Figure::after,
.lq143Actor[data-role="sister"] .lq143Figure::before,
.lq143Actor[data-role="sister"] .lq143Figure::after{display:none!important}
@media(max-width:430px){
  .lq143Actor[data-role="leon"] .lq143Figure{width:72px!important;height:112px!important}
  .lq143Actor[data-role="sister"] .lq143Figure{width:64px!important;height:100px!important}
}
`;
  document.head.appendChild(st);
}
function mark(){
  install();
  if(typeof s==='undefined'||s?.screen!=='req128Chapter1Climax')return;
  const scene=document.querySelector('.lq128Scene');
  if(!scene)return;
  scene.dataset.lq143OriginalStageArt='true';
  const leon=scene.querySelector('.lq143Actor[data-role="leon"] .lq143Figure');
  const sister=scene.querySelector('.lq143Actor[data-role="sister"] .lq143Figure');
  if(leon)leon.dataset.lq143Art='leon-original';
  if(sister)sister.dataset.lq143Art='sister-original';
}
install();
if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);mark();return out;};
}
queueMicrotask(mark);
window.LQ_REQ143_ORIGINAL_STAGE_ART_STATUS={
  requirement:'REQ-143',
  leonAsset:LEON_ART,
  sisterAsset:SISTER_ART,
  originalRepositoryArt:true,
  presentationOnly:true,
  canonicalLogicChanged:false,
  inputAuthorityChanged:false,
  ownerExperiencePass:'PENDING'
};
})();
