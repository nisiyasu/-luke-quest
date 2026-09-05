(() => {
'use strict';

/* LUKE QUEST v0.106 bounty progress battle feedback.
   Surfaces optional quest progress immediately after qualifying forest victories. */

let bountyBattleFeedback=null;
const style=document.createElement('style');
style.textContent=`
.lqBountyBattle{margin:8px 0 2px;padding:8px 10px;border-radius:10px;background:linear-gradient(90deg,#2a2118,#403221,#2a2118);border:1px solid #d6aa5960;color:#e8d2a4;text-align:left}.lqBountyBattle small{display:block;font-size:8px;letter-spacing:.16em;color:#9f8766}.lqBountyBattle b{display:block;margin-top:3px;color:#ffe29a;font-size:11px}.lqBountyBattleTrack{height:5px;margin-top:6px;border-radius:99px;background:#111b22;overflow:hidden}.lqBountyBattleTrack i{display:block;height:100%;background:linear-gradient(90deg,#a15d4d,#e7b160);transition:width .35s ease}.lqBountyBattle.done{border-color:#84c78a88;background:linear-gradient(90deg,#17291b,#244128,#17291b)}.lqBountyBattle.done b{color:#bff0b9}
`;
document.head.appendChild(style);

function addBountyBattleFeedback(){
 if(!bountyBattleFeedback)return;
 const panel=app.querySelector('.lqVictoryPanel');if(!panel||panel.querySelector('.lqBountyBattle'))return;
 const f=bountyBattleFeedback,box=document.createElement('div');box.className=`lqBountyBattle${f.kills>=3?' done':''}`;
 const pct=Math.min(100,Math.max(0,f.kills/3*100));
 box.innerHTML=`<small>OPTIONAL BOUNTY</small><b>${f.kills>=3?'討伐条件を達成！ 王都の掲示板へ戻ろう。':`魔物の森・安全確認　${f.kills}/3`}</b><div class=lqBountyBattleTrack><i style="width:${pct}%"></i></div>`;
 const hint=panel.querySelector('.lqVictoryHint');panel.insertBefore(box,hint||null);bountyBattleFeedback=null;
}
const winV105=win;win=function(){
 const before=Number(s.forestBountyKills)||0,eligible=s.map==='forest'&&!!s.flags?.forestBountyAccepted&&!s.flags?.forestBountyComplete;
 const r=winV105();
 const after=Number(s.forestBountyKills)||0;if(eligible&&after>before)bountyBattleFeedback={kills:after};
 addBountyBattleFeedback();return r;
};
const renderV105=render;render=function(){const r=renderV105();addBountyBattleFeedback();return r;};
window.LQ_BOUNTY_BATTLE_FEEDBACK_STATUS={victoryProgress:true,completionPrompt:true};
})();