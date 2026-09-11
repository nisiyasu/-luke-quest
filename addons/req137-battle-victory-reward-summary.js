(() => {
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

  function ensureStyle(){
    if(document.getElementById('lq-req148-victory-style'))return;
    const style=document.createElement('style');
    style.id='lq-req148-victory-style';
    style.textContent=`
      #lqVictoryBattleFrame{position:relative;min-height:100dvh;overflow:hidden;background:#071018;isolation:isolate}
      #lqVictoryBattleBackdrop{position:absolute;inset:0;overflow:hidden;pointer-events:none;filter:brightness(.54) saturate(.72) blur(1.6px);transform:scale(1.01);transform-origin:center}
      #lqVictoryBattleFrame::after{content:'';position:absolute;inset:0;z-index:1;background:rgba(3,8,14,.28);pointer-events:none}
      .lqReq148VictoryBanner{position:fixed;z-index:3;left:50%;top:38%;transform:translate(-50%,-50%);margin:0;color:#fff;font:900 clamp(34px,11vw,58px)/1 system-ui,sans-serif;letter-spacing:.14em;text-indent:.14em;text-shadow:0 3px 18px rgba(0,0,0,.9);pointer-events:none}
      #lqVictoryBattleFrame>.dialogBox{z-index:4;position:fixed;left:max(8px,env(safe-area-inset-left));right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));cursor:pointer;box-shadow:0 12px 34px rgba(0,0,0,.55)}
    `;
    document.head.appendChild(style);
  }

  function showVictoryOnBattleFrame(frame){
    if(!frame||!s.dialog)return render();
    ensureStyle();
    const root=document.getElementById('app');
    if(!root)return;
    const victoryState=s.dialog;
    root.innerHTML=`<div id="lqVictoryBattleFrame"><div id="lqVictoryBattleBackdrop">${frame}</div><div class="lqReq148VictoryBanner" aria-hidden="true">VICTORY</div></div>`;
    const host=document.getElementById('lqVictoryBattleFrame');
    const box=document.createElement('div');
    box.className='dialogBox';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-label','戦闘勝利');
    box.innerHTML=`<div class="speaker">${s.dialog.name}</div><div class="dialog">${s.dialog.text}</div><div class="sub" style="text-align:right">タップ / Aで閉じる</div>`;
    box.addEventListener('click',function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      action();
      if(s.dialog===victoryState){
        s.dialog=null;
        render();
      }
    },{once:true});
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
    showVictoryOnBattleFrame(frame);
    return result;
  };

  window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY={
    version:'1.4.0',
    requirement:'REQ-137/REQ-147/REQ-148',
    canonicalWinPreserved:true,
    canonicalDialogPreserved:true,
    lukeCommentPreserved:true,
    victoryLabelVisible:true,
    battleBackdropDimmed:true,
    battleBackdropBlurred:true,
    battleFrameHeldUntilDismiss:true,
    singleDismissVictoryCleanup:true,
    rewardMutation:false,
    battleBalanceMutation:false,
    saveSchemaChange:false,
    storyMutation:false,
    iosPhysicalVerification:'PENDING'
  };
})();
