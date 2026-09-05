(() => {
'use strict';

/* Collision-safe add-on: first status ailment, battle-only poison.
   Poison cannot reduce Luke below 1 HP and is cleared when battle ends. Herbs cure it as well as healing. */
const POISON_ENEMIES=new Set(['森グモ','黒甲ムカデ','霧喰いヤマネコ']);
const POISON_CHANCE=.18,POISON_DAMAGE=2,POISON_TURNS=3;
s.status=s.status&&typeof s.status==='object'?s.status:{};s.status.poison=Math.max(0,Math.floor(Number(s.status.poison)||0));

const style=document.createElement('style');style.textContent=`
.lqStatusPoison{display:inline-flex;align-items:center;gap:4px;padding:3px 6px;border-radius:999px;background:#30233a;border:1px solid #a16abb66;color:#dab9e8;font-size:7px;font-weight:950;letter-spacing:.08em}.lqStatusPoison:before{content:"毒";display:grid;place-items:center;width:14px;height:14px;border-radius:50%;background:#724884;color:#f0d8fa;font-size:8px}.lqPoisonTick{position:absolute;z-index:46;left:18%;top:60%;color:#d7a9ea;font-size:14px;font-weight:1000;text-shadow:0 2px #25132f,0 0 12px #a14fc7;pointer-events:none;animation:lqPoisonTick .65s ease both}@keyframes lqPoisonTick{0%{opacity:0;transform:translateY(5px) scale(.7)}25%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-13px)}}
`;document.head.appendChild(style);

function clearPoison(){s.status=s.status||{};s.status.poison=0;}
function showTick(){if(s.screen!=='battle')return;const scene=app.querySelector('.battleScene');if(!scene)return;const e=document.createElement('div');e.className='lqPoisonTick';e.textContent=`POISON -${POISON_DAMAGE}`;scene.appendChild(e);setTimeout(()=>e.remove(),700);}
function addPoisonUi(){
 if(s.status?.poison<=0)return;
 if(s.screen==='battle'){const line=app.querySelector('.battlePlayerLine');if(line&&!line.querySelector('.lqStatusPoison')){const c=document.createElement('span');c.className='lqStatusPoison';c.textContent=`あと${s.status.poison}T`;line.appendChild(c);}}
 if(s.pauseOpen){const hero=app.querySelector('.lqPauseHeroCopy');if(hero&&!hero.querySelector('.lqStatusPoison')){const c=document.createElement('span');c.className='lqStatusPoison';c.textContent='戦闘毒';hero.appendChild(c);}}
}

const enemyTurnPoisonBase=enemyTurn;enemyTurn=function(g=false){
 let ticked=false;
 if(s.screen==='battle'&&s.status?.poison>0){s.hp=Math.max(1,s.hp-POISON_DAMAGE);s.status.poison=Math.max(0,s.status.poison-1);s.log.push(`毒が体力を奪う！ ${POISON_DAMAGE}ダメージ。`);ticked=true;}
 const attacker=s.enemy?.n;const r=enemyTurnPoisonBase(g);
 if(s.screen==='battle'&&attacker&&POISON_ENEMIES.has(attacker)&&s.status.poison<=0&&Math.random()<POISON_CHANCE){s.status.poison=POISON_TURNS;s.log.push(`${attacker}の攻撃で毒を受けた！ 薬草で治療できる。`);save();battle();}
 if(ticked)requestAnimationFrame(showTick);addPoisonUi();return r;
};
const potionPoisonBase=potion;potion=function(){const cured=s.status?.poison>0&&(s.potions||0)>0;if(cured)clearPoison();const r=potionPoisonBase();if(cured&&s.screen==='battle'){s.log.push('薬草で毒も消えた。');battle();}return r;};
if(window.lqUseFieldHerb){const herbFieldBase=window.lqUseFieldHerb;window.lqUseFieldHerb=function(){const cured=s.status?.poison>0&&(s.potions||0)>0;if(cured)clearPoison();return herbFieldBase();};}
const winPoisonBase=win;win=function(){clearPoison();return winPoisonBase();};
const runPoisonBase=runAway;runAway=function(){const before=s.screen,r=runPoisonBase();if(before==='battle'&&s.screen==='world')clearPoison();return r;};
if(window.lqUseSmokeBomb){const smokeBase=window.lqUseSmokeBomb;window.lqUseSmokeBomb=function(){const r=smokeBase();if(s.screen==='world')clearPoison();return r;};}
const battlePoisonBase=battle;battle=function(){const r=battlePoisonBase();addPoisonUi();return r;};
const renderPoisonBase=render;render=function(){const r=renderPoisonBase();addPoisonUi();return r;};
window.LQ_STATUS_AILMENT_STATUS={poison:{enemies:[...POISON_ENEMIES],chance:POISON_CHANCE,damage:POISON_DAMAGE,turns:POISON_TURNS,nonlethal:true,herbCures:true}};
save();addPoisonUi();
})();
