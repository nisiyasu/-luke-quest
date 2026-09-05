(() => {
'use strict';

/* Collision-safe add-on: v0.138 owns exploration interaction SFX now.
   Suppress legacy v0.83 LQ_sfx door/chest/clue duplicates while preserving battle/menu/victory SFX. */
const legacy=window.LQ_sfx;
if(typeof legacy==='function'){
 window.LQ_sfx=function(name){
   if(name==='door'||name==='chest'||name==='clue')return;
   return legacy(name);
 };
}
window.LQ_AUDIO_DEDUP_STATUS={v138ExplorationOwner:true,suppressedLegacy:['door','chest','clue'],battleSfxPreserved:true};
})();
