(() => {
'use strict';

/* REQ-145 first-10-seconds world hierarchy pass.
   CSS-only presentation layer: no render/world/input/save/story/collision/battle authority.
   Keep iPhone compositor cost bounded: no backdrop blur and no full-world filter stack. */
const STYLE_ID='lq-req145-first-ten-seconds-focus-style';
if(document.getElementById(STYLE_ID))return;
const style=document.createElement('style');
style.id=STYLE_ID;
style.textContent=`
body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell{
  border-color:rgba(255,235,176,.28)!important;
  box-shadow:0 18px 42px rgba(0,0,0,.52),0 0 0 1px rgba(142,216,228,.045)!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .player{
  filter:drop-shadow(0 5px 3px rgba(0,0,0,.82)) drop-shadow(0 0 7px rgba(255,232,157,.30))!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .npc{
  filter:drop-shadow(0 5px 3px rgba(0,0,0,.74))!important;
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .hud .chip{
  background:rgba(10,18,25,.86)!important;
  border-color:rgba(255,236,178,.18)!important;
  box-shadow:0 4px 12px rgba(0,0,0,.28)!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
body.lqReq145GoldSlice.lq145Map-town .tile.grass{
  background:linear-gradient(135deg,#668b50 0 24%,#5b7d47 25% 49%,#6d9254 50% 74%,#607f49 75%)!important;
}
body.lqReq145GoldSlice.lq145Map-town .tile.floor{
  background:linear-gradient(135deg,#ded1ad 0 47%,#ad9c77 48% 52%,#d0c29e 53%)!important;
}
body.lqReq145GoldSlice.lq145Map-field .tile.grass{
  background:linear-gradient(145deg,#628c48 0 33%,#557d40 34% 66%,#6a9450 67%)!important;
  box-shadow:inset 0 0 0 1px rgba(38,65,31,.18);
}
body.lqReq145GoldSlice.lq145Map-field .tile.tree{
  filter:saturate(1.10) brightness(.95);
}
body.lqReq145GoldSlice.lq145Map-field .tile.water{
  background:linear-gradient(160deg,#4a84b5,#356d9d 55%,#2c608e)!important;
  box-shadow:inset 0 3px rgba(191,230,255,.14),inset 0 -5px rgba(4,37,70,.18);
}
body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell::before{
  background:linear-gradient(180deg,rgba(0,0,0,.18),transparent 18%,transparent 72%,rgba(0,0,0,.34)),radial-gradient(circle at 50% 43%,transparent 42%,rgba(0,0,0,.22) 100%)!important;
}
@media(max-width:430px){
  body.lqReq145GoldSlice[data-lq145-screen="world"] .gameShell{
    box-shadow:0 13px 30px rgba(0,0,0,.48),0 0 0 1px rgba(255,235,176,.06)!important;
  }
  body.lqReq145GoldSlice[data-lq145-screen="world"] .hud .chip{
    box-shadow:0 3px 9px rgba(0,0,0,.24)!important;
  }
}
`;
document.head.appendChild(style);
window.LQ_REQ145_FIRST_TEN_SECONDS_FOCUS={
  version:'1.1.0',
  requirement:'REQ-145',
  presentationOnly:true,
  cssOnly:true,
  createsPerStepDom:false,
  wrapsRender:false,
  wrapsWorld:false,
  usesBackdropFilter:false,
  usesFullWorldFilter:false,
  inputAuthority:false,
  saveAuthority:false,
  storyAuthority:false,
  battleAuthority:false
};
})();
