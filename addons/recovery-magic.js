(() => {
'use strict';

/* First actual magic action: MP recovery spell distinct from herb poison-cure identity. */
const SPELL_NAME='癒光';
const SPELL_COST=5;
function calculateHeal(hp,mh,lv){
 const cur=Number.isFinite(Number(hp))?Math.max(0,Math.floor(Number(hp))):0;
 const max=Number.isFinite(Number(mh))?Math.max(1,Math.floor(Number(mh))):1;
 const level=Number.isFinite(Number(lv))?Math.max(1,Math.floor(Number(lv))):1;
 return Math.max(0,Math.min(max-cur,14+level*3));
}
function canCast(){return s.screen==='battle'&&!!s.enemy&&Number.isFinite(s.mp)&&s.mp>=SPELL_COST&&calculateHeal(s.hp,s.mh,s.lv)>0;}
window.lqUseHealingLight=function(){
 if(s.screen!=='battle'||!s.enemy)return;
 const heal=calculateHeal(s.hp,s.mh,s.lv);
 if(heal<=0){s.log.push('HPは満タンだ。癒光は使わなかった。');return battle();}
 if(!Number.isFinite(s.mp)||s.mp<SPELL_COST){s.log.push(`MPが足りない！ ${SPELL_NAME}には${SPELL_COST}MP必要だ。`);return battle();}
 s.mp-=SPELL_COST;
 s.hp=Math.min(s.mh,s.hp+heal);
 s.log.push(`ルークの${SPELL_NAME}！ HPが${heal}回復した。`);
 save();
 return enemyTurn();
};

const style=document.createElement('style');style.textContent=`
.lqMagicBtn{background:linear-gradient(135deg,#3976a8,#6db4c8)!important;color:#effcff!important}.lqMagicBtn[aria-disabled="true"]{filter:saturate(.42);opacity:.68}.lqSkillRow{gap:5px}.lqSkillRow .btn{min-width:0;padding-left:6px;padding-right:6px;font-size:9px}@media(max-width:390px){.lqSkillRow .btn{font-size:8px}}
`;document.head.appendChild(style);

function addMagicButton(){
 if(s.screen!=='battle')return;
 const row=app.querySelector('.lqSkillRow');if(!row||row.querySelector('.lqMagicBtn'))return;
 const btn=document.createElement('button');btn.className='btn lqMagicBtn';btn.textContent=`${SPELL_NAME} ${SPELL_COST}MP`;btn.setAttribute('aria-disabled',canCast()?'false':'true');btn.onclick=window.lqUseHealingLight;
 const info=[...row.querySelectorAll('button')].find(b=>b.disabled);row.insertBefore(btn,info||null);
}
const battleMagicBase=battle;battle=function(){const r=battleMagicBase();addMagicButton();return r;};
const renderMagicBase=render;render=function(){const r=renderMagicBase();addMagicButton();return r;};

window.LQ_RECOVERY_MAGIC_STATUS={
 spell:{name:SPELL_NAME,cost:SPELL_COST,formula:'14 + lv * 3',curesPoison:false},
 noCostAtFullHp:true,noTurnAtFullHp:true,noCostWhenInsufficientMp:true,noTurnWhenInsufficientMp:true,
 delegatesEnemyTurnOnSuccess:true,preservesHerbIdentity:true,calculateHeal,canCast
};
addMagicButton();
})();
