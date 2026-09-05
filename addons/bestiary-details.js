(() => {
'use strict';

/* Collision-safe add-on: discovered bestiary stat details + read-only drop intel projection. */
function catalog(){
 const groups=[['王都近郊',ENEMIES],['魔物の森',FOREST_ENEMIES],['森の深部',DEEP_ENEMIES],['霧の小道',MIST_ENEMIES],['監視区域',OBS_ENEMIES],['退避路',EVAC_ENEMIES]];
 const out=new Map();for(const [area,list] of groups)for(const e of list||[])out.set(e.n,{area,hp:e.h,a:e.a,xp:e.xp,g:e.g});return out;
}
function dropLabel(name){return window.LQ_ENEMY_DROP_STATUS?.dropLabels?.[name]||'—';}
const style=document.createElement('style');style.textContent=`
.lqBestiaryEntry.lqDetailed{display:block!important;padding:6px 7px}.lqBestiaryEntry.lqDetailed .lqMonsterHead{display:flex;justify-content:space-between;gap:5px;color:#c7d5de;font-size:8px}.lqBestiaryEntry.lqDetailed .lqMonsterHead em{color:#e0c974}.lqMonsterMeta{display:grid;grid-template-columns:1fr 1fr;gap:2px 5px;margin-top:4px;color:#718a9d;font-size:6px}.lqMonsterMeta b{color:#9db4c3;font-weight:900}.lqMonsterArea{grid-column:1/-1;color:#7d9b82!important}.lqMonsterDrop{grid-column:1/-1;color:#8fc6a2!important}.lqMonsterDrop b{color:#b8efc6!important}
`;document.head.appendChild(style);
function decorate(){
 if(!s.pauseOpen)return;const cat=catalog();for(const el of app.querySelectorAll('.lqBestiaryEntry')){if(el.dataset.details==='1')continue;const span=el.querySelector('span');const name=(span?.textContent||el.childNodes[0]?.textContent||'').trim();const m=cat.get(name);if(!m)continue;const kills=s.enemyDefeats?.[name]||0;const drop=dropLabel(name);el.dataset.details='1';el.classList.add('lqDetailed');el.innerHTML=`<div class=lqMonsterHead><span>${name}</span><em>×${kills}</em></div><div class=lqMonsterMeta><span>HP <b>${m.hp}</b></span><span>ATK <b>${m.a?.[0]??'?'}-${m.a?.[1]??'?'}</b></span><span>EXP <b>${m.xp}</b></span><span>G <b>${m.g}</b></span><span class=lqMonsterArea>${m.area}</span><span class=lqMonsterDrop>DROP <b>${drop}</b></span></div>`;}}
const worldB=world;world=function(){worldB();decorate();};const renderB=render;render=function(){const r=renderB();queueMicrotask(decorate);return r;};window.LQ_BESTIARY_STATUS=Object.assign({},window.LQ_BESTIARY_STATUS,{discoveredStats:true,areaLabels:true,dropIntel:true,dropIntelSource:'LQ_ENEMY_DROP_STATUS.dropLabels',dropProbabilityHidden:true});decorate();
})();
