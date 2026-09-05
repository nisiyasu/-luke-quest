(() => {
'use strict';

/* LUKE QUEST v0.10 battle presentation patch.
   Loaded after ux-v09.js. Presentation-only: battle rules remain in the v0.7 core. */

let battleFeedback=null;

const style=document.createElement('style');
style.textContent=`
.battleScene{position:relative;overflow:hidden;border-radius:18px;border:1px solid #ffffff24;background:#152238;box-shadow:0 14px 38px #000a;margin-bottom:10px;min-height:300px}
.battleScene:before{content:"";position:absolute;inset:0;opacity:.95;background:linear-gradient(180deg,#688eae 0 38%,#98a97b 38% 58%,#394733 58% 100%)}
.battleScene.forestBattle:before{background:linear-gradient(180deg,#314f55 0 35%,#365b42 35% 58%,#162b20 58% 100%)}
.battleScene.mistBattle:before{background:linear-gradient(180deg,#53666d 0 38%,#788786 38% 57%,#2d3938 57% 100%)}
.battleScene.militaryBattle:before{background:linear-gradient(180deg,#404955 0 38%,#5b5a53 38% 57%,#292d31 57% 100%)}
.battleScene.cliffBattle:before{background:linear-gradient(180deg,#66829a 0 42%,#8a8170 42% 58%,#48443d 58% 100%)}
.battleHorizon{position:absolute;left:-4%;right:-4%;top:33%;height:28%;opacity:.7;background:radial-gradient(ellipse at 18% 100%,#223827 0 34%,transparent 35%),radial-gradient(ellipse at 52% 100%,#2c4430 0 29%,transparent 30%),radial-gradient(ellipse at 82% 100%,#263b2b 0 32%,transparent 33%)}
.militaryBattle .battleHorizon,.cliffBattle .battleHorizon{background:linear-gradient(165deg,transparent 0 42%,#30363b 43% 57%,transparent 58%),linear-gradient(195deg,transparent 0 47%,#3b3b38 48% 61%,transparent 62%)}
.battleTop{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;padding:12px;gap:8px}
.battleAreaChip{background:#07111fdd;border:1px solid #ffffff35;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:900;box-shadow:0 3px 10px #0008}
.enemyPanel{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:218px;padding:4px 14px 18px}
.enemySpriteStage{width:154px;height:150px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#ffffff1f 0 37%,#00000016 60%,transparent 72%);filter:drop-shadow(0 12px 8px #0008)}
.enemySpriteStage .enemy{font-size:100px;line-height:1;margin:0;transform:translateY(-2px)}
.enemyPlate{width:min(360px,92%);background:#07111fe8;border:1px solid #ffffff2b;border-radius:13px;padding:9px 11px;box-shadow:0 8px 20px #0008}
.enemyNameV10{display:flex;justify-content:space-between;gap:8px;font-weight:950;font-size:17px;margin-bottom:6px}
.enemyHpNumbers{font-size:12px;color:#ffdca0;white-space:nowrap}
.enemyBarV10{height:12px;background:#1b2938;border:1px solid #ffffff1d;border-radius:99px;overflow:hidden}
.enemyBarV10>div{height:100%;background:linear-gradient(90deg,#db5d55,#ff9b67);transition:width .18s ease}
.battleFeedback{position:absolute;z-index:5;left:50%;top:42%;transform:translate(-50%,-50%);font-size:31px;font-weight:1000;text-shadow:0 3px 0 #000,0 0 14px #000;color:#fff3c1;pointer-events:none;animation:lqDamagePop .55s ease-out both}
.battleFeedback.hurt{color:#ffbbb1}.battleFeedback.heal{color:#9effbd}.battleFeedback.guard{color:#b8ddff}
@keyframes lqDamagePop{0%{opacity:0;transform:translate(-50%,-30%) scale(.65)}35%{opacity:1;transform:translate(-50%,-58%) scale(1.15)}100%{opacity:0;transform:translate(-50%,-90%) scale(1)}}
.battleCommandCard{background:linear-gradient(180deg,#101e33,#091526);border:1px solid #ffffff1c;border-radius:16px;padding:11px;margin-bottom:10px;box-shadow:0 10px 26px #0008}
.battlePlayerLine{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:#07111f;border-radius:11px;padding:8px 10px;margin-bottom:9px}
.battlePlayerName{font-weight:950}.battlePlayerSub{font-size:11px;color:#a9b9cc;margin-top:2px}
.playerHpBig{font-size:17px;font-weight:950;color:#c6ffd1}
.commandLabel{font-size:11px;color:#a9b9cc;font-weight:850;margin:0 0 6px 2px;letter-spacing:.08em}
.commandGrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.commandBtn{border:1px solid #ffffff24;border-radius:11px;padding:12px 8px;font-weight:950;background:#244a78;box-shadow:inset 0 1px #ffffff18,0 4px 10px #0005}
.commandBtn:active{transform:translateY(1px);filter:brightness(1.15)}
.commandBtn.guardCmd{background:#385169}.commandBtn.herbCmd{background:#74622d}.commandBtn.escapeCmd{background:#4a465a}
.battleLogV10{margin-top:9px;background:#050e19;border:1px solid #ffffff12;border-radius:10px;padding:9px;line-height:1.48;min-height:68px;font-size:13px;color:#eef4f8}
@media(max-width:390px){.battleScene{min-height:274px}.enemyPanel{min-height:198px}.enemySpriteStage{width:132px;height:128px}.enemySpriteStage .enemy{font-size:84px}.enemyNameV10{font-size:15px}.commandBtn{padding:11px 6px;font-size:14px}}
@media(max-height:700px){.battleScene{min-height:238px}.enemyPanel{min-height:166px;padding-bottom:11px}.enemySpriteStage{width:105px;height:102px}.enemySpriteStage .enemy{font-size:69px}.battleTop{padding:8px}.battleCommandCard{padding:8px}.commandBtn{padding:9px 5px}.battleLogV10{min-height:52px;font-size:12px}}
`;
document.head.appendChild(style);

function battleTheme(){
  if(['forest','deepForest'].includes(s.map))return'forestBattle';
  if(s.map==='mistTrail')return'mistBattle';
  if(['observation','evacRoute'].includes(s.map))return'militaryBattle';
  if(s.map==='cliffRoad')return'cliffBattle';
  return'fieldBattle';
}

function feedbackHtml(){
  if(!battleFeedback)return'';
  const f=battleFeedback;
  battleFeedback=null;
  return `<div class="battleFeedback ${f.kind||''}">${f.text}</div>`;
}

battle=function(){
  stopMoving();
  const e=s.enemy;
  if(!e)return;
  const pct=Math.max(0,Math.min(100,100*s.ehp/e.hp));
  const mapName=(MAPS[s.map]&&MAPS[s.map].name)||'戦場';
  app.innerHTML=status()+`
  <div class="battleScene ${battleTheme()}">
    <div class=battleHorizon></div>
    <div class=battleTop><div class=battleAreaChip>⚔ 戦闘</div><div class=battleAreaChip>📍 ${mapName}</div></div>
    <div class=enemyPanel>
      <div class=enemySpriteStage><div class=enemy>${e.e}</div></div>
      <div class=enemyPlate>
        <div class=enemyNameV10><span>${e.n}</span><span class=enemyHpNumbers>HP ${s.ehp} / ${e.hp}</span></div>
        <div class=enemyBarV10><div style="width:${pct}%"></div></div>
      </div>
    </div>
    ${feedbackHtml()}
  </div>
  <div class=battleCommandCard>
    <div class=battlePlayerLine><div><div class=battlePlayerName>ルーク　LV ${s.lv}</div><div class=battlePlayerSub>ATK ${s.atk}　薬草 ${s.potions}　EXP ${s.xp}/${s.nx}</div></div><div class=playerHpBig>HP ${s.hp}/${s.mh}</div></div>
    <div class=commandLabel>COMMAND</div>
    <div class=commandGrid>
      <button class=commandBtn onclick=attack()>⚔ こうげき</button>
      <button class="commandBtn guardCmd" onclick=guard()>🛡 ぼうぎょ</button>
      <button class="commandBtn herbCmd" onclick=potion()>🌿 やくそう</button>
      <button class="commandBtn escapeCmd" onclick=runAway()>↗ にげる</button>
    </div>
    <div class=battleLogV10>${s.log.slice(-4).join('<br>')}</div>
  </div>`;
};

const attackCore=attack;
attack=function(){
  const oldEnemy=s.ehp;
  const oldPlayer=s.hp;
  attackCore();
  if(s.screen==='battle'){
    const dealt=Math.max(0,oldEnemy-s.ehp);
    const taken=Math.max(0,oldPlayer-s.hp);
    battleFeedback=dealt?{text:`${dealt} DAMAGE!`}:taken?{text:`-${taken} HP`,kind:'hurt'}:null;
    battle();
  }
};

const guardCore=guard;
guard=function(){
  const oldHp=s.hp;
  guardCore();
  if(s.screen==='battle'){
    const taken=Math.max(0,oldHp-s.hp);
    battleFeedback={text:taken?`GUARD  -${taken} HP`:'GUARD',kind:'guard'};
    battle();
  }
};

const potionCore=potion;
potion=function(){
  const oldHp=s.hp;
  const oldPotions=s.potions;
  potionCore();
  if(s.screen==='battle'){
    const healed=Math.max(0,s.hp-oldHp);
    battleFeedback=oldPotions===s.potions?{text:'薬草がない！',kind:'hurt'}:{text:`+${healed} HP`,kind:'heal'};
    battle();
  }
};

const runAwayCore=runAway;
runAway=function(){
  const oldHp=s.hp;
  runAwayCore();
  if(s.screen==='battle'){
    const taken=Math.max(0,oldHp-s.hp);
    battleFeedback={text:taken?`逃走失敗  -${taken} HP`:'逃走失敗',kind:'hurt'};
    battle();
  }
};

/* If this patch loads while a battle is already open, upgrade it immediately. */
if(s.screen==='battle')battle();

})();
