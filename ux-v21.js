(() => {
'use strict';

/* LUKE QUEST v0.21 battle depth/impact presentation.
   Presentation-only: preserves v0.10-v0.11 battle mechanics and victory logic. */

const style=document.createElement('style');
style.textContent=`
.battleScene{isolation:isolate;background:#101928}
.battleScene:after{content:"";position:absolute;inset:auto -8% -10% -8%;height:48%;z-index:1;background:radial-gradient(ellipse at 50% 20%,#ffffff10 0 20%,transparent 45%),linear-gradient(180deg,#17241d22,#07100ccc);pointer-events:none}
.battleScene.fieldBattle .lqBattleBackdrop{background:radial-gradient(circle at 80% 15%,#ffefafaa 0 7%,transparent 8%),linear-gradient(180deg,transparent 0 42%,#41633d55 43% 55%,transparent 56%)}
.battleScene.forestBattle .lqBattleBackdrop{background:radial-gradient(ellipse at 12% 20%,#0f291de8 0 19%,transparent 20%),radial-gradient(ellipse at 82% 19%,#183823e8 0 23%,transparent 24%),linear-gradient(105deg,transparent 0 42%,#fff2b315 43% 50%,transparent 51%)}
.battleScene.mistBattle .lqBattleBackdrop{background:radial-gradient(ellipse at 20% 60%,#d9eeee21 0 26%,transparent 27%),radial-gradient(ellipse at 78% 45%,#e3f3f324 0 31%,transparent 32%)}
.battleScene.militaryBattle .lqBattleBackdrop{background:linear-gradient(112deg,transparent 0 18%,#12171d99 19% 23%,transparent 24%),linear-gradient(248deg,transparent 0 72%,#12171da5 73% 77%,transparent 78%)}
.battleScene.cliffBattle .lqBattleBackdrop{background:linear-gradient(150deg,transparent 0 52%,#332f2a99 53% 65%,transparent 66%),radial-gradient(circle at 77% 13%,#fff0bb78 0 7%,transparent 8%)}
.lqBattleBackdrop{position:absolute;inset:0;z-index:1;pointer-events:none}
.lqBattleGroundRing{position:absolute;z-index:2;left:50%;bottom:54px;transform:translateX(-50%);width:190px;height:44px;border-radius:50%;background:radial-gradient(ellipse,#10120f99 0 35%,#0008 50%,transparent 72%);filter:blur(.3px);pointer-events:none}
.lqBattleParticles{position:absolute;inset:0;z-index:3;overflow:hidden;pointer-events:none}
.lqBattleParticles i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff0b5aa;box-shadow:0 0 6px #ffeaa8;animation:lqBattleFloat 3.6s ease-in-out infinite alternate}
.lqBattleParticles i:nth-child(1){left:17%;top:32%;animation-delay:-.4s}.lqBattleParticles i:nth-child(2){left:29%;top:55%;animation-delay:-1.3s}.lqBattleParticles i:nth-child(3){left:67%;top:29%;animation-delay:-2.1s}.lqBattleParticles i:nth-child(4){left:79%;top:52%;animation-delay:-.9s}.lqBattleParticles i:nth-child(5){left:55%;top:18%;animation-delay:-2.7s}
@keyframes lqBattleFloat{from{transform:translateY(6px);opacity:.25}to{transform:translateY(-8px);opacity:.8}}
.enemyPanel{z-index:4}.battleTop{z-index:5}.enemySpriteStage{position:relative;transition:transform .12s ease,filter .12s ease}.enemySpriteStage:after{content:"";position:absolute;left:13%;right:13%;bottom:3px;height:18px;border-radius:50%;background:#0007;filter:blur(4px);z-index:-1}
.enemySpriteStage.lqEnemyPulse{animation:lqEnemyPulse .34s ease}
@keyframes lqEnemyPulse{0%{transform:translateX(0);filter:brightness(1)}25%{transform:translateX(-8px);filter:brightness(2.2)}55%{transform:translateX(7px);filter:brightness(1.5)}100%{transform:translateX(0);filter:brightness(1)}}
.battleCommandCard{position:relative;overflow:hidden}.battleCommandCard:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,transparent,#f3d36d99,transparent)}
.commandBtn{min-height:48px;position:relative;overflow:hidden}.commandBtn:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,#fff2 45%,transparent 70%);transform:translateX(-130%);transition:transform .25s}.commandBtn:active:after{transform:translateX(120%)}
.playerHpBig{padding:4px 8px;border-radius:8px;background:#17352a;border:1px solid #7bd59644}.enemyPlate{backdrop-filter:blur(3px)}
.lqBattleDanger .playerHpBig{background:#4b2426;color:#ffd0c8;border-color:#ff827366;animation:lqHpDanger 1s ease-in-out infinite alternate}
@keyframes lqHpDanger{from{box-shadow:0 0 0 transparent}to{box-shadow:0 0 12px #ff665744}}
`;
document.head.appendChild(style);

let pulseNextEnemy=false;
function decorateBattleV21(){
  if(s.screen!=='battle')return;
  const scene=app.querySelector('.battleScene');
  if(!scene)return;
  if(!scene.querySelector('.lqBattleBackdrop')){
    const back=document.createElement('div');back.className='lqBattleBackdrop';scene.prepend(back);
    const ring=document.createElement('div');ring.className='lqBattleGroundRing';scene.appendChild(ring);
    const particles=document.createElement('div');particles.className='lqBattleParticles';particles.innerHTML='<i></i><i></i><i></i><i></i><i></i>';scene.appendChild(particles);
  }
  if(s.hp<=Math.max(1,Math.floor(s.mh*.3)))app.querySelector('.battleCommandCard')?.classList.add('lqBattleDanger');
  if(pulseNextEnemy){app.querySelector('.enemySpriteStage')?.classList.add('lqEnemyPulse');pulseNextEnemy=false;}
}

const battleV20=battle;
battle=function(){battleV20();decorateBattleV21();};

const attackV20=attack;
attack=function(){
  const before=s.ehp;
  attackV20();
  if(s.screen==='battle'&&s.ehp<before){
    pulseNextEnemy=true;
    battle();
  }
};

window.LQ_BATTLE_VISUAL_V21={environmentDepth:true,groundShadow:true,particles:true,enemyHitPulse:true,lowHpDanger:true};
if(s.screen==='battle')battle();
})();
