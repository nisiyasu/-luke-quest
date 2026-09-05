(() => {
'use strict';

/* LUKE QUEST v0.121 regional battle atmosphere.
   Adds area-specific lightweight motion layers to battle backgrounds without changing mechanics. */

const style=document.createElement('style');
style.textContent=`
.lqBattleWeather{position:absolute;inset:0;z-index:3;overflow:hidden;pointer-events:none}.lqBattleWeather i{position:absolute;display:block}
.forestBattle .lqBattleWeather i{width:8px;height:5px;border-radius:70% 20%;background:#c98645aa;box-shadow:0 1px #58371d;animation:lqBattleLeaf 5s linear infinite}.mistBattle .lqBattleWeather i{width:42%;height:14px;border-radius:50%;background:linear-gradient(90deg,transparent,#e1ffff20,transparent);filter:blur(4px);animation:lqBattleMist 7s ease-in-out infinite}.militaryBattle .lqBattleWeather i{width:3px;height:3px;border-radius:50%;background:#d4c0a17f;animation:lqBattleAsh 5.5s linear infinite}.cliffBattle .lqBattleWeather i{width:27px;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,#ddecff66);animation:lqBattleWind 4s linear infinite}.fieldBattle .lqBattleWeather i{width:3px;height:9px;border-radius:80% 20%;background:#f1edb190;animation:lqBattleSeed 5.8s linear infinite}
@keyframes lqBattleLeaf{0%{transform:translate3d(-12vw,-15px,0) rotate(0);opacity:0}12%{opacity:.65}100%{transform:translate3d(28vw,105vh,0) rotate(400deg);opacity:0}}@keyframes lqBattleMist{0%,100%{transform:translateX(-35%);opacity:.08}50%{transform:translateX(190%);opacity:.32}}@keyframes lqBattleAsh{0%{transform:translateY(-10px);opacity:0}15%{opacity:.55}100%{transform:translate3d(14px,105vh,0);opacity:0}}@keyframes lqBattleWind{0%{transform:translateX(-30vw);opacity:0}15%{opacity:.35}100%{transform:translateX(120vw);opacity:0}}@keyframes lqBattleSeed{0%{transform:translate3d(-5vw,-12px,0) rotate(0);opacity:0}15%{opacity:.5}100%{transform:translate3d(18vw,105vh,0) rotate(280deg);opacity:0}}@media(prefers-reduced-motion:reduce){.lqBattleWeather i{animation:none!important;opacity:.09!important}}
`;
document.head.appendChild(style);
function addBattleWeather(){
 if(s.screen!=='battle')return;const scene=app.querySelector('.battleScene');if(!scene||scene.querySelector('.lqBattleWeather'))return;const enabled=['fieldBattle','forestBattle','mistBattle','militaryBattle','cliffBattle'].some(c=>scene.classList.contains(c));if(!enabled)return;const layer=document.createElement('div');layer.className='lqBattleWeather';for(let i=0;i<7;i++){const p=document.createElement('i');p.style.left=`${(i*31+9)%95}%`;p.style.top=`${(i*47+8)%82}%`;p.style.animationDelay=`-${(i*.67).toFixed(2)}s`;layer.appendChild(p);}scene.appendChild(layer);
}
const battleV120=battle;battle=function(){const r=battleV120();addBattleWeather();return r;};const renderV120=render;render=function(){const r=renderV120();addBattleWeather();return r;};if(s.screen==='battle')addBattleWeather();window.LQ_BATTLE_WEATHER_STATUS={regional:true,reducedMotionAware:true,mechanicsUntouched:true};
})();