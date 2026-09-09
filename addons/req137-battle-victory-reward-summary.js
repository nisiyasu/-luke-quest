(function(){
  'use strict';
  if(window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY)return;
  if(typeof win!=='function')return;

  const canonicalWin=win;

  function rewardLine(enemy){
    return `${enemy.n}を倒した！ EXP${enemy.xp} / ${enemy.g}G`;
  }

  function captureBattleFrame(){
    const root=document.getElementById('app');
    return root ? root.innerHTML : '';
  }

  function showCanonicalDialogOnBattleFrame(frame){
    if(!frame||!s.dialog)return render();
    const root=document.getElementById('app');
    if(!root)return;
    root.innerHTML=`<div id="lqVictoryBattleFrame" style="position:relative;min-height:100dvh">${frame}</div>`;
    const host=document.getElementById('lqVictoryBattleFrame');
    const box=document.createElement('div');
    box.className='dialogBox';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-label','戦闘勝利');
    box.style.position='fixed';
    box.style.left='max(8px, env(safe-area-inset-left))';
    box.style.right='max(8px, env(safe-area-inset-right))';
    box.style.bottom='max(8px, env(safe-area-inset-bottom))';
    box.style.cursor='pointer';
    box.innerHTML=`<div class="speaker">${s.dialog.name}</div><div class="dialog">${s.dialog.text}</div><div class="sub" style="text-align:right">タップ / Aで閉じる</div>`;
    box.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();action();},{once:true});
    host.appendChild(box);
  }

  win=function(){
    const defeated=(s&&s.enemy)?{n:s.enemy.n,xp:s.enemy.xp,g:s.enemy.g}:null;
    const frame=captureBattleFrame();
    const beforeWins=Number(s.wins)||0;
    const result=canonicalWin.apply(this,arguments);
    if(!defeated||(Number(s.wins)||0)<=beforeWins)return result;

    const line=rewardLine(defeated);
    if(s.dialog&&typeof s.dialog.text==='string'&&!s.dialog.text.includes(line)){
      s.dialog={...s.dialog,text:`${s.dialog.text}\n${line}`};
    }
    if(typeof save==='function')save();
    showCanonicalDialogOnBattleFrame(frame);
    return result;
  };

  window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY={
    version:'1.2.0',
    requirement:'REQ-137/REQ-147',
    canonicalWinPreserved:true,
    canonicalDialogPreserved:true,
    lukeCommentPreserved:true,
    separateVictoryOverlay:false,
    battleFrameHeldUntilDismiss:true,
    rewardMutation:false,
    battleBalanceMutation:false,
    saveSchemaChange:false,
    storyMutation:false,
    iosPhysicalVerification:'PENDING'
  };
})();
