(() => {
'use strict';

/* REQ-118 compatibility bridge.
   REQ-120's legacy opening add-on predates REQ-069 and replaces newGame()
   destructively after the overwrite guard has installed.  REQ-118 is the
   current Owner-approved opening authority, so restore the composed REQ-069
   semantics immediately before the later REQ-118 add-on wraps newGame().

   This file does not delete REQ-120 history or alter Continue/load. */
const guard=window.LQ_NEW_GAME_OVERWRITE_GUARD_STATUS;
if(!guard||typeof guard.canonicalNewGame!=='function'||typeof guard.hasResumableStoredSave!=='function')return;

const canonicalNewGame=guard.canonicalNewGame;
newGame=function(){
  if(!guard.hasResumableStoredSave()){
    guard.disarm?.();
    return canonicalNewGame.apply(this,arguments);
  }
  if(guard.isArmed?.()){
    guard.disarm?.();
    return canonicalNewGame.apply(this,arguments);
  }
  guard.arm?.();
  return false;
};

window.LQ_REQ118_NEW_GAME_AUTHORITY_BRIDGE_STATUS={
  requirement:'REQ-118',
  enabled:true,
  restoresReq069Guard:true,
  bypassesLegacyReq120NewGameOverride:true,
  continueIntercept:false,
  canonicalNewGamePreserved:true
};
})();
