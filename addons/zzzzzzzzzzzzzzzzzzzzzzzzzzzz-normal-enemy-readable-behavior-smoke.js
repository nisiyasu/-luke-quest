(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_NORMAL_ENEMY_BEHAVIOR_STATUS;
 let marker=document.getElementById('lqNormalEnemyBehaviorSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqNormalEnemyBehaviorSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const pressure=status?.behaviorFor?.('木霊ウルフ');
 const burst=status?.behaviorFor?.('霧喰いヤマネコ');
 const steady=status?.behaviorFor?.('ぷるぷるスライム');
 const source=[7,11],boosted=status?.boostedRange?.(source,1.22);
 const data={
  status:!!status,
  readableIntent:status?.readableIntent===true,
  canonicalChain:status?.canonicalEnemyTurnPreserved===true&&status?.guardPassthrough===true,
  localCounter:status?.battleLocalCounter===true&&typeof status?.getTurn==='function',
  pressureContract:pressure?.kind==='PRESSURE'&&pressure?.cadence===3&&status?.isStrongTurn?.(3,pressure)===true&&status?.isStrongTurn?.(2,pressure)===false,
  burstContract:burst?.kind==='BURST'&&burst?.cadence===4&&status?.isStrongTurn?.(4,burst)===true&&status?.isStrongTurn?.(3,burst)===false,
  steadyContract:steady?.kind==='STEADY'&&status?.isStrongTurn?.(99,steady)===false,
  boostPure:Array.isArray(boosted)&&boosted[0]>source[0]&&boosted[1]>source[1]&&source[0]===7&&source[1]===11,
  bossExcluded:status?.isExcludedBoss?.({n:'苔角の森王'})===true&&status?.bossExcluded===true,
  normalNotExcluded:status?.isExcludedBoss?.({n:'木霊ウルフ'})===false,
  poisonChainPresent:window.LQ_STATUS_AILMENT_STATUS?.poison?.battleOnly===true,
  bossPatternPreserved:window.LQ_OPTIONAL_BOSS_PATTERN_STATUS?.telegraphed===true
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ052_NORMAL_ENEMY_BEHAVIOR_FAIL_${key}()`);},0);}
},430);
})();
