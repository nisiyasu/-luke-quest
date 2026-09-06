(() => {
'use strict';

/* REQ-077: final-state guard for the optional Forest Lord reward chip.
   The legacy optional-boss add-on used any non-empty keyItems array as its visibility condition.
   Keep reward authority there; enforce exact ownership here without mutating inventory. */
function ownsForestLordHorn(state=s){return Array.isArray(state?.keyItems)&&state.keyItems.includes('森王の角');}
function enforceForestLordKeyItemVisibility(){
 const chip=app.querySelector('.lqBossKeyItem');
 if(chip&&!ownsForestLordHorn())chip.remove();
}
const worldBase=world;world=function(){const r=worldBase();enforceForestLordKeyItemVisibility();return r;};
const renderBase=render;render=function(){const r=renderBase();enforceForestLordKeyItemVisibility();return r;};
window.LQ_FOREST_LORD_KEY_ITEM_GUARD_STATUS={exactOwnershipRequired:true,item:'森王の角',presentationOnly:true};
window.LQ_FOREST_LORD_KEY_ITEM_GUARD_TEST={ownsForestLordHorn,enforceForestLordKeyItemVisibility};
if(s.screen==='world')enforceForestLordKeyItemVisibility();
})();
