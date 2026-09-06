(() => {
'use strict';

/* Collision-safe consistency add-on: canonical defeat recovery owns the transition;
   this layer clears battle-only enemy fields after defeat and at non-battle persistence boundaries. */
function isCanonicalDefeatRecovery(beforeScreen,state){
 return beforeScreen==='battle'&&state?.screen==='world'&&state?.map==='town'&&state?.hp===state?.mh&&state?.dialog?.name==='宿屋の主人';
}
function shouldSanitizeEnemyState(screen){return screen!=='battle';}
function sanitizeBattleOnlyEnemyState(){
 if(!shouldSanitizeEnemyState(s.screen))return false;
 const dirty=s.enemy!=null||Number(s.ehp)!==0;
 if(dirty){s.enemy=null;s.ehp=0;}
 return dirty;
}
const saveDefeatCleanupBase=save;
save=function(...args){sanitizeBattleOnlyEnemyState();return saveDefeatCleanupBase.apply(this,args);};
sanitizeBattleOnlyEnemyState();
const enemyTurnDefeatCleanupBase=enemyTurn;
enemyTurn=function(...args){
 const beforeScreen=s.screen;
 const r=enemyTurnDefeatCleanupBase.apply(this,args);
 if(isCanonicalDefeatRecovery(beforeScreen,s)){
  sanitizeBattleOnlyEnemyState();
  save();
 }
 return r;
};
window.LQ_DEFEAT_STATE_CLEANUP_STATUS={
 canonicalRecoveryOwner:'index.html enemyTurn()',
 fields:['enemy','ehp'],
 persistsCleanState:true,
 ordinaryBattlePreserved:true,
 nonBattleSaveSanitization:true,
 nonBattleLoadSanitization:true,
 isCanonicalDefeatRecovery,
 shouldSanitizeEnemyState
};
save();
})();
