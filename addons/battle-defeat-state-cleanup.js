(() => {
'use strict';

/* Collision-safe consistency add-on: canonical defeat recovery owns the transition;
   this layer only clears battle-only enemy fields after that transition completes. */
function isCanonicalDefeatRecovery(beforeScreen,state){
 return beforeScreen==='battle'&&state?.screen==='world'&&state?.map==='town'&&state?.hp===state?.mh&&state?.dialog?.name==='宿屋の主人';
}
const enemyTurnDefeatCleanupBase=enemyTurn;
enemyTurn=function(...args){
 const beforeScreen=s.screen;
 const r=enemyTurnDefeatCleanupBase.apply(this,args);
 if(isCanonicalDefeatRecovery(beforeScreen,s)){
  s.enemy=null;
  s.ehp=0;
  save();
 }
 return r;
};
window.LQ_DEFEAT_STATE_CLEANUP_STATUS={
 canonicalRecoveryOwner:'index.html enemyTurn()',
 fields:['enemy','ehp'],
 persistsCleanState:true,
 ordinaryBattlePreserved:true,
 isCanonicalDefeatRecovery
};
})();
