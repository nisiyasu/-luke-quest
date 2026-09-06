(() => {
'use strict';

/* REQ-119 checkpoint D — field sprite richness without replacing approved raster art. */
const luke=window.LQ_CHARACTER_ASSETS?.luke;
if(!luke)return;

luke.field=luke.field||{};
const FORMAL_FIELD={
 down:'assets/characters/luke/field-down.webp.b64',
 up:'assets/characters/luke/field-up.webp.b64',
 left:'assets/characters/luke/field-left.webp.b64',
 right:'assets/characters/luke/field-right.webp.b64'
};
for(const [dir,path] of Object.entries(FORMAL_FIELD)){
  luke.field[dir]={path,mime:'image/webp',formal:true,source:'canonical Luke four-direction field raster'};
}

const style=document.createElement('style');
style.id='lqReq119FieldSpriteRichnessStyle';
style.textContent=`
.player[data-formal-art="1"] .lukeFormalFieldArt{
 width:40px;height:44px;object-fit:contain;object-position:center bottom;
 filter:drop-shadow(1px 0 #17202b) drop-shadow(-1px 0 #17202b) drop-shadow(0 1px #17202b) drop-shadow(0 -1px #17202b) drop-shadow(0 4px 3px #0009);
 transform-origin:50% 100%;
}
.world .npc{
 filter:drop-shadow(0 2px 1px #1119);
 text-shadow:1px 0 #17202bcc,-1px 0 #17202bcc,0 1px #17202bcc,0 -1px #17202bcc;
}
.world .npc[data-direction="left"]{transform-origin:50% 100%}
.world .npc[data-direction="right"]{transform-origin:50% 100%}
@media(max-width:390px){.player[data-formal-art="1"] .lukeFormalFieldArt{width:38px;height:42px}}
@media(prefers-reduced-motion:reduce){.player[data-formal-art="1"] .lukeFormalFieldArt{transition:none!important}}
`;
document.head.appendChild(style);

async function verifyFormalDirections(){
  const result={};
  for(const [dir,path] of Object.entries(FORMAL_FIELD)){
    const spec=luke.field?.[dir];
    result[dir]=Boolean(spec?.formal===true&&spec.path===path&&spec.mime==='image/webp');
    if(result[dir]&&typeof window.LQ_loadBase64Asset==='function'){
      try{await window.LQ_loadBase64Asset(spec);}catch(_){result[dir]=false;}
    }
  }
  const all=Object.values(result).every(Boolean);
  window.LQ_REQ119_CHECKPOINT_D_STATUS={
    requirement:'REQ-119',checkpoint:'D',state:all?'pass':'fail',
    formalLukeFourDirection:result,
    approvedRasterReplaced:false,
    hitboxChanged:false,inputChanged:false,collisionChanged:false,saveChanged:false,storyChanged:false,
    npcPresentationOnly:true
  };
  if(all&&typeof window.LQ_applyFormalLukeFieldArt==='function')void window.LQ_applyFormalLukeFieldArt();
  return all;
}

window.LQ_REQ119_CHECKPOINT_D_READY=verifyFormalDirections();
})();
