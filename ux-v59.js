(() => {
'use strict';

/* LUKE QUEST v0.59 first battle technique.
   Adds one conservative once-per-battle skill seed without committing the game to a permanent MP system yet. */

s.lqFocusSlashUsed=false;

const style=document.createElement('style');
style.textContent=`
.lqSkillCmd{grid-column:1/-1!important;background:linear-gradient(135deg,#68416e,#3c315c)!important;border-color:#c99ed555!important}.lqSkillCmd:disabled{opacity:.42;filter:saturate(.4)}.lqSkillGlyph:before{content:"";position:absolute;left:5px;top:5px;width:14px;height:14px;border:2px solid #d8b6ec;border-radius:50%;box-shadow:inset 0 0 0 3px #633f76,0 0 6px #c78de4}.lqSkillGlyph:after{content:"";position:absolute;left:11px;top:1px;width:3px;height:22px;background:#f3dbff;transform:rotate(42deg);border-radius:2px;box-shadow:0 0 5px #d8a9f2}.battleFeedback.skill{color:#eec7ff;text-shadow:0 3px 0 #000,0 0 16px #b668d9}
`;
document.head.appendChild(style);

const startBattleV58=startBattle;
startBattle=function(){s.lqFocusSlashUsed=false;return startBattleV58();};

function addSkillButton(){
 if(s.screen!=='battle')return;
 const grid=app.querySelector('.commandGrid');if(!grid||grid.querySelector('.lqSkillCmd'))return;
 const b=document.createElement('button');b.className='commandBtn lqSkillCmd';b.disabled=!!s.lqFocusSlashUsed;
 b.innerHTML=`<i class="lqCmdGlyph lqSkillGlyph"></i><span class=lqCmdCopy><b>集中斬り</b><small>${s.lqFocusSlashUsed?'USED':'ONCE / BATTLE'}</small></span>`;
 b.onclick=()=>window.lqFocusSlash();grid.appendChild(b);
}
function showSkillFeedback(damage){
 if(s.screen!=='battle')return;
 const scene=app.querySelector('.battleScene');if(!scene)return;
 const f=document.createElement('div');f.className='battleFeedback skill';f.textContent=`${damage} SKILL!`;scene.appendChild(f);setTimeout(()=>f.remove(),650);
}
window.lqFocusSlash=function(){
 if(s.screen!=='battle'||s.lqFocusSlashUsed||!s.enemy)return;
 s.lqFocusSlashUsed=true;
 const damage=rnd(s.atk+4,s.atk+8)+s.lv;
 s.ehp=Math.max(0,s.ehp-damage);
 s.log.push(`ルークの集中斬り！ ${damage}ダメージ！`);
 save();
 if(s.ehp<=0)return win();
 enemyTurn(false);
 if(s.screen==='battle'){addSkillButton();showSkillFeedback(damage);}
};

const battleV58=battle;battle=function(){const r=battleV58();addSkillButton();return r;};
const renderV58=render;render=function(){const r=renderV58();if(s.screen==='battle')addSkillButton();return r;};
window.LQ_SKILL_STATUS={focusSlash:{usesPerBattle:1,resourceSystemCommitted:false}};
if(s.screen==='battle')addSkillButton();
})();
