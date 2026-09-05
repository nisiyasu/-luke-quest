(() => {
'use strict';

/* LUKE QUEST v0.50 victory results presentation.
   Adds a dedicated post-battle reward card before returning control to the field. */

s.victoryResult=null;

const style=document.createElement('style');
style.textContent=`
.lqVictoryOverlay{position:absolute;inset:0;z-index:52;display:flex;align-items:center;justify-content:center;padding:14px;background:radial-gradient(circle at 50% 25%,#334b34bb,#050a0ee8 68%);backdrop-filter:blur(3px)}
.lqVictoryPanel{width:min(390px,95%);border:2px solid #e0c56a;border-radius:16px;background:linear-gradient(180deg,#152638,#091522);box-shadow:0 18px 45px #000e,inset 0 0 38px #d4b55e12;padding:14px;text-align:center;animation:lqVictoryIn .28s ease-out both}@keyframes lqVictoryIn{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
.lqVictoryKicker{font-size:9px;letter-spacing:.26em;color:#9fb3c5;font-weight:900}.lqVictoryTitle{font-family:Georgia,serif;font-size:27px;color:#ffe69b;font-weight:900;margin:3px 0 5px;text-shadow:0 3px 12px #000}.lqVictoryEnemy{font-size:11px;color:#c8d5dd;margin-bottom:11px}.lqVictoryRewards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.lqVictoryReward{background:#081520;border:1px solid #ffffff17;border-radius:10px;padding:9px}.lqVictoryReward small{display:block;color:#8298aa;font-size:8px;letter-spacing:.12em}.lqVictoryReward b{display:block;color:#f4df92;font-size:18px;margin-top:2px}.lqVictoryLevel{margin:8px 0;padding:8px;border-radius:9px;background:linear-gradient(90deg,#4b3d20,#715c2c,#4b3d20);color:#fff0b4;font-weight:950;font-size:12px;animation:lqLevelGlow .8s ease-in-out infinite alternate}@keyframes lqLevelGlow{to{box-shadow:0 0 14px #f4d76c44}}
.lqVictoryContinue{width:100%;min-height:48px;margin-top:8px;border:1px solid #e4cc7a66;border-radius:10px;background:#496c43;color:white;font-weight:950}.lqVictoryHint{font-size:8px;color:#6f8595;margin-top:7px}
`;
document.head.appendChild(style);

function addVictoryOverlay(){
 if(s.screen!=='world'||!s.victoryResult)return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqVictoryOverlay'))return;
 const v=s.victoryResult;
 shell.insertAdjacentHTML('beforeend',`<div class=lqVictoryOverlay><div class=lqVictoryPanel><div class=lqVictoryKicker>BATTLE RESULT</div><div class=lqVictoryTitle>VICTORY</div><div class=lqVictoryEnemy>${v.enemy} を撃破</div><div class=lqVictoryRewards><div class=lqVictoryReward><small>EXP</small><b>+${v.xp}</b></div><div class=lqVictoryReward><small>GOLD</small><b>+${v.gold}G</b></div></div>${v.levelUp?`<div class=lqVictoryLevel>LEVEL UP!　LV ${v.level}</div>`:''}<button class=lqVictoryContinue onclick=lqCloseVictoryResult()>フィールドへ戻る</button><div class=lqVictoryHint>Aボタンでも閉じる</div></div></div>`);
}
window.lqCloseVictoryResult=function(){s.victoryResult=null;render();};

const winV49=win;
win=function(){
 const enemy=s.enemy?{name:s.enemy.n,xp:s.enemy.xp,gold:s.enemy.g}:null;
 const oldLv=s.lv;
 const result=winV49();
 if(enemy&&s.screen==='world')s.victoryResult={enemy:enemy.name,xp:enemy.xp,gold:enemy.gold,levelUp:s.lv>oldLv,level:s.lv};
 addVictoryOverlay();
 return result;
};

const moveV49=move;move=function(d){if(s.victoryResult){stopMoving();return}return moveV49(d);};
const actionV49=action;action=function(){if(s.victoryResult){stopMoving();return lqCloseVictoryResult();}return actionV49();};
const worldV49=world;world=function(){worldV49();addVictoryOverlay();};
const renderV49=render;render=function(){const r=renderV49();addVictoryOverlay();return r;};
window.LQ_VICTORY_PRESENTATION_STATUS={rewardOverlay:true,levelUpCallout:true};
})();
