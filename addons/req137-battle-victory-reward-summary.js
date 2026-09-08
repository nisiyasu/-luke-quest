(() => {
'use strict';
if(window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY)return;
if(typeof win!=='function')return;

const canonicalWin=win;

function rewardLine(enemy){
 return `${enemy.n}を倒した！ EXP${enemy.xp} / ${enemy.g}G`;
}

win=function(){
 const defeated=(typeof s!=='undefined'&&s&&s.enemy)
  ? {n:s.enemy.n,xp:s.enemy.xp,g:s.enemy.g}
  : null;
 const result=canonicalWin.apply(this,arguments);
 if(!defeated||typeof s==='undefined'||!s||!s.dialog||typeof s.dialog.text!=='string')return result;
 const line=rewardLine(defeated);
 if(!s.dialog.text.includes(line)){
  s.dialog={...s.dialog,text:`${s.dialog.text}\n${line}`};
  if(typeof render==='function')render();
 }
 return result;
};

window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY={
 version:'1.0.1',
 requirement:'REQ-137',
 canonicalWinPreserved:true,
 rewardMutation:false,
 battleBalanceMutation:false,
 saveSchemaChange:false,
 storyMutation:false,
 pointerHandlerAdded:false,
 clickHandlerAdded:false,
 rewardLine,
 iosPhysicalVerification:'PENDING'
};
})();
