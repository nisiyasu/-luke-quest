(() => {
'use strict';
/* REQ-149 V04-D diagnostic cleanup.
 * The Canvas renderer is the sole field-material presentation during V04.
 * Logical tile DOM remains in place for established game behavior but is fully transparent,
 * preventing legacy depth/background rules from tinting the Canvas in 48px blocks.
 * Fold this rule into the canonical renderer before broad rollout.
 */
const id='lq-req149-v04d-cleanup-style';
if(!document.getElementById(id)){
  const st=document.createElement('style');st.id=id;st.textContent=`
  .lqReq149FieldCanvasWorld>.tile{opacity:0!important;background:none!important;background-image:none!important;background-color:transparent!important;box-shadow:none!important;border:0!important;filter:none!important;mix-blend-mode:normal!important}
  .lqReq149FieldCanvasWorld>.tile::before,.lqReq149FieldCanvasWorld>.tile::after{content:none!important;display:none!important;opacity:0!important;background:none!important;box-shadow:none!important}
  `;document.head.appendChild(st);
}
function mark(){if(s?.screen==='world'&&s?.map==='field'&&app.querySelector('.lqReq149FieldCanvas'))document.body.dataset.req149FieldRenderer='canvas-prototype-d'}
const renderBase=render;render=function(){const r=renderBase();mark();return r};mark();
window.LQ_REQ149_V04D_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-D',presentationOnly:true,logicalTileDomPreserved:true,logicalTileVisibility:'transparent',collisionChanged:false,inputAuthorityChanged:false,broadRollout:false};
})();
