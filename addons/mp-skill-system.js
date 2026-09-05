(() => {
'use strict';

/* Collision-safe add-on: persistent MP resource + first battle skill. */
const INITIAL_MP=10;
const SKILL_COST=4;
const SKILL_NAME='蒼閃';

DEFAULT.mp=INITIAL_MP;
DEFAULT.mmp=INITIAL_MP;
function normalizeMp(){
 if(!Number.isFinite(s.mmp)||s.mmp<1)s.mmp=INITIAL_MP;
 s.mmp=Math.max(1,Math.floor(s.mmp));
 if(!Number.isFinite(s.mp))s.mp=s.mmp;
 s.mp=Math.max(0,Math.min(s.mmp,Math.floor(s.mp)));
}
normalizeMp();save();

const style=document.createElement('style');style.textContent=`
.status{grid-template-columns:repeat(5,minmax(0,1fr))}.lqMpValue{color:#8dd8ff}.lqSkillBtn{background:linear-gradient(135deg,#245cc9,#45aee7)!important}.lqSkillBtn[aria-disabled="true"]{filter:saturate(.45);opacity:.72}
@media(max-width:390px){.stat{padding:7px 4px}.stat b{font-size:14px}}
`;document.head.appendChild(style);

const statusMpBase=status;
status=function(){
 normalizeMp();
 const html=statusMpBase();
 return html.replace(/<\/div><\/div>$/,'<div class="stat"><small>MP</small><b class="lqMpValue">'+s.mp+'/'+s.mmp+'</b></div></div></div>');
};

function skillDamage(){return rnd(s.atk+5,s.atk+9)+s.lv*2;}
window.lqUseAzureSlash=function(){
 if(s.screen!=='battle'||!s.enemy)return;
 normalizeMp();
 if(s.mp<SKILL_COST){
  s.log.push(`MPが足りない！ ${SKILL_NAME}には${SKILL_COST}MP必要だ。`);
  return battle();
 }
 s.mp-=SKILL_COST;
 const d=skillDamage();
 s.ehp=Math.max(0,s.ehp-d);
 s.log.push(`ルークの${SKILL_NAME}！ 青い軌跡が走る！ ${d}ダメージ！`);
 save();
 if(s.ehp<=0)return win();
 return enemyTurn();
};

const battleMpBase=battle;
battle=function(){
 normalizeMp();
 const result=battleMpBase();
 const log=app.querySelector('.log');
 if(!log)return result;
 const card=log.closest('.card');
 if(!card||card.querySelector('.lqSkillBtn'))return result;
 const row=document.createElement('div');row.className='row lqSkillRow';
 const btn=document.createElement('button');btn.className='btn lqSkillBtn';btn.textContent=`${SKILL_NAME} ${SKILL_COST}MP`;btn.setAttribute('aria-disabled',s.mp<SKILL_COST?'true':'false');btn.onclick=window.lqUseAzureSlash;
 const info=document.createElement('button');info.className='btn gray';info.disabled=true;info.textContent=`MP ${s.mp}/${s.mmp}`;
 row.append(btn,info);card.insertBefore(row,log);
 return result;
};

const winMpBase=win;
win=function(){
 normalizeMp();
 const beforeLv=s.lv;
 const result=winMpBase();
 if(s.lv>beforeLv){
  s.mmp+=2;s.mp=s.mmp;
  if(s.dialog)s.dialog.text+=`\n最大MPが${s.mmp}になり、MPが全回復した！`;
  save();render();
 }
 return result;
};

const enemyTurnMpBase=enemyTurn;
enemyTurn=function(g=false){
 normalizeMp();
 const wasBattle=s.screen==='battle';
 const result=enemyTurnMpBase(g);
 if(wasBattle&&s.screen==='world'&&s.map==='town'&&s.hp===s.mh){
  s.mp=s.mmp;save();render();
 }
 return result;
};

window.LQ_MP_SKILL_STATUS={
 version:1,
 currentField:'mp',maxField:'mmp',initialMp:INITIAL_MP,
 skill:{name:SKILL_NAME,cost:SKILL_COST},
 oldSaveMigration:true,clamped:true,ui:true,
 insufficientMpSkipsEnemyTurn:true,usesCanonicalEnemyHp:true,
 delegatesWin:true,delegatesEnemyTurn:true,levelUpRecovery:true,defeatRecovery:true
};
})();
