(() => {
'use strict';
if(window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY)return;
if(typeof winBase!=='function')return;

const canonicalWinBase=winBase;
const marker='lqReq137RewardSummary';

function rewardLine(enemy){
 return `${enemy.n}を倒した！ EXP${enemy.xp} / ${enemy.g}G`;
}

winBase=function(){
 const defeated=(typeof s!=='undefined'&&s&&s.enemy)
  ? {n:s.enemy.n,xp:s.enemy.xp,g:s.enemy.g}
  : null;
 const result=canonicalWinBase.apply(this,arguments);
 if(!defeated||typeof dialogue==='undefined'||!Array.isArray(dialogue))return result;
 const line=rewardLine(defeated);
 if(!dialogue.includes(line)){
  dialogue.push(line);
 }
 if(typeof render==='function')render();
 return result;
};

window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY={
 version:'1.0.0',
 requirement:'REQ-137',
 canonicalWinBasePreserved:true,
 rewardMutation:false,
 battleBalanceMutation:false,
 saveSchemaChange:false,
 storyMutation:false,
 pointerHandlerAdded:false,
 clickHandlerAdded:false,
 marker,
 rewardLine,
 iosPhysicalVerification:'PENDING'
};
})();
