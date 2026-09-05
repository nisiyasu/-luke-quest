(() => {
'use strict';

/* Collision-safe add-on: readable behavior pattern for optional forest boss only. */
const BOSS='苔角の森王';
s.lqBossTurn=Number.isFinite(Number(s.lqBossTurn))?Math.max(0,Math.floor(Number(s.lqBossTurn))):0;
const style=document.createElement('style');style.textContent=`
.lqBossIntent{margin:4px 0 7px;padding:5px 7px;border-radius:7px;background:#202a19;border:1px solid #8da55b44;color:#bdce91;font-size:8px;font-weight:900}.lqBossIntent strong{color:#f0df92}.lqBossIntent.danger{background:#3a211d;border-color:#bb6a5355;color:#e9b3a0}.lqBossIntent.danger strong{color:#ffd09b}.lqBossIntent.guard{background:#192a28;border-color:#5e9e9555;color:#9acbc2}
`;document.head.appendChild(style);
function intent(){const next=(s.lqBossTurn||0)+1;if(next%4===0)return['danger','大技予兆','苔角を低く構えている。次の攻撃は危険。'];if(next%3===0)return['guard','踏み固め','森王は姿勢を低くし、こちらの動きを見ている。'];return['','通常','巨体がじりじり距離を詰めてくる。'];}
function addIntent(){if(s.screen!=='battle'||s.enemy?.n!==BOSS)return;const plate=app.querySelector('.enemyPlate');if(!plate||plate.querySelector('.lqBossIntent'))return;const [cls,label,text]=intent(),e=document.createElement('div');e.className=`lqBossIntent ${cls}`;e.innerHTML=`<strong>${label}</strong>　${text}`;plate.appendChild(e);}
const bossEnemyTurnBase=enemyTurn;enemyTurn=function(g=false){
 if(s.screen!=='battle'||s.enemy?.n!==BOSS)return bossEnemyTurnBase(g);
 s.lqBossTurn=(s.lqBossTurn||0)+1;
 const special=s.lqBossTurn%4===0,feint=s.lqBossTurn%3===0&&!special;
 if(!special&&!feint){const r=bossEnemyTurnBase(g);addIntent();return r;}
 if(feint){s.log.push('苔角の森王は地面を踏み鳴らし、こちらの出方を見ている。');battle();addIntent();return;}
 const oldA=s.enemy.a;s.enemy.a=[11,15];s.log.push('苔角の森王の「森割り突進」！');try{return bossEnemyTurnBase(g);}finally{s.enemy.a=oldA;requestAnimationFrame(addIntent);}
};
const actionBossPatternBase=action;action=function(){const before=s.screen,enemy=s.enemy?.n;const r=actionBossPatternBase();if(before!=='battle'&&s.screen==='battle'&&s.enemy?.n===BOSS&&enemy!==BOSS){s.lqBossTurn=0;save();}return r;};
const battleBossPatternBase=battle;battle=function(){const r=battleBossPatternBase();addIntent();return r;};const renderBossPatternBase=render;render=function(){const r=renderBossPatternBase();addIntent();return r;};
window.LQ_OPTIONAL_BOSS_PATTERN_STATUS={boss:BOSS,bigAttackEvery:4,feintEvery:3,telegraphed:true,resetOnStart:true};
addIntent();
})();
