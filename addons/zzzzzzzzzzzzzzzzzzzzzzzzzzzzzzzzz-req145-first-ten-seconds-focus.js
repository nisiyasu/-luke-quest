(() => {
'use strict';

/* REQ-145 first-10-seconds world hierarchy pass.
   CSS-only presentation layer: no render/world/input/save/story/collision/battle authority.
   Keep iPhone compositor cost bounded: no backdrop blur, no full-world filter stack,
   no per-step DOM creation and no animation loop. */
const STYLE_ID='lq-req145-first-ten-seconds-focus-style';
if(document.getElementById(STYLE_ID))return;
const style=document.createElement('style');
style.id=STYLE_ID;
style.textContent=`
body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell{
  border-color:rgba(255,235,176,.32)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.52),0 0 0 1px rgba(142,216,228,.055)!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .player{
  filter:drop-shadow(0 6px 3px rgba(0,0,0,.88)) drop-shadow(0 0 8px rgba(255,232,157,.42))!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .npc{
  filter:drop-shadow(0 5px 3px rgba(0,0,0,.76))!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .hud .chip{
  background:rgba(10,18,25,.84)!important;
  border-color:rgba(255,236,178,.20)!important;
  box-shadow:0 4px 12px rgba(0,0,0,.28)!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
body.lqReq145GoldSlice.lq145Map-town .tile.grass{
  background:
    linear-gradient(135deg,rgba(255,255,255,.035) 0 24%,transparent 25% 49%,rgba(0,0,0,.035) 50% 74%,transparent 75%),
    linear-gradient(135deg,#668b50 0 24%,#5b7d47 25% 49%,#6d9254 50% 74%,#607f49 75%)!important;
  box-shadow:inset 0 0 0 1px rgba(42,68,33,.16);
}
body.lqReq145GoldSlice.lq145Map-town .tile.floor{
  background:linear-gradient(135deg,#e1d4b1 0 47%,#ad9c77 48% 52%,#d1c39f 53%)!important;
  box-shadow:inset 0 1px rgba(255,248,219,.18),inset 0 -1px rgba(81,65,43,.12);
}
body.lqReq145GoldSlice.lq145Map-town .tile.roof{
  background:linear-gradient(155deg,#b35449 0 47%,#933d37 48% 54%,#a84940 55%)!important;
  box-shadow:inset 0 2px rgba(255,219,194,.10),inset 0 -2px rgba(75,24,24,.16);
}
body.lqReq145GoldSlice.lq145Map-town .tile.wall{
  background:linear-gradient(180deg,#8b806f,#756958)!important;
  box-shadow:inset 0 1px rgba(255,244,214,.08),inset 0 -2px rgba(38,30,23,.14);
}
body.lqReq145GoldSlice.lq145Map-town .tile.gate{
  background:linear-gradient(180deg,#a98e61,#836d49)!important;
  box-shadow:inset 0 0 0 1px rgba(255,229,166,.12),inset 0 -3px rgba(54,37,20,.14);
}
body.lqReq145GoldSlice.lq145Map-field .tile.grass{
  background:
    linear-gradient(25deg,rgba(255,255,255,.03) 0 18%,transparent 19% 67%,rgba(19,52,22,.055) 68% 100%),
    linear-gradient(145deg,#648f49 0 33%,#557d40 34% 66%,#6b9651 67%)!important;
  box-shadow:inset 0 0 0 1px rgba(38,65,31,.19);
}
body.lqReq145GoldSlice.lq145Map-field .tile.tree{
  filter:saturate(1.10) brightness(.95);
}
body.lqReq145GoldSlice.lq145Map-field .tile.water{
  background:linear-gradient(160deg,#4c88b9,#356f9f 55%,#2b608e)!important;
  box-shadow:inset 0 3px rgba(205,236,255,.16),inset 0 -5px rgba(4,37,70,.20);
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell::before{
  background:linear-gradient(180deg,rgba(0,0,0,.15),transparent 17%,transparent 74%,rgba(0,0,0,.34)),radial-gradient(circle at 50% 45%,transparent 43%,rgba(0,0,0,.24) 100%)!important;
}
@media(max-width:430px){
  body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell{
    box-shadow:0 13px 30px rgba(0,0,0,.48),0 0 0 1px rgba(255,235,176,.07)!important;
  }
  body.lqReq145GoldSlice[data-lq145-screen="world"] .hud .chip{
    box-shadow:0 3px 9px rgba(0,0,0,.24)!important;
  }
}
`;
document.head.appendChild(style);
window.LQ_REQ145_FIRST_TEN_SECONDS_FOCUS={
  version:'1.2.1',
  requirement:'REQ-145',
  presentationOnly:true,
  cssOnly:true,
  createsPerStepDom:false,
  wrapsRender:false,
  wrapsWorld:false,
  usesBackdropFilter:false,
  usesFullWorldFilter:false,
  usesAnimationLoop:false,
  inputAuthority:false,
  saveAuthority:false,
  storyAuthority:false,
  battleAuthority:false,
  townLandmarkDepth:true
};
})();
