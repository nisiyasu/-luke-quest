(() => {
'use strict';

/* LUKE QUEST v0.110 field HP condition HUD.
   Adds readable health state to exploration without changing combat or healing mechanics. */

const style=document.createElement('style');
style.textContent=`
.lqFieldVitals{position:absolute;z-index:19;top:42px;left:9px;width:112px;padding:5px 7px 6px;border-radius:9px;background:#07111fc9;border:1px solid #ffffff1c;box-shadow:0 4px 12px #0008;pointer-events:none;backdrop-filter:blur(2px)}
.lqFieldVitalsHead{display:flex;align-items:center;justify-content:space-between;gap:5px;color:#a6b7c5;font-size:7px;letter-spacing:.1em}.lqFieldVitalsHead b{color:#edf2ed;font-size:9px;letter-spacing:0}.lqFieldHpTrack{height:5px;margin-top:4px;border-radius:99px;overflow:hidden;background:#14222d;box-shadow:inset 0 1px 2px #0008}.lqFieldHpTrack i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#559a65,#82d88f);transition:width .22s ease,background .22s ease}.lqFieldVitals.warn .lqFieldHpTrack i{background:linear-gradient(90deg,#b38c3d,#e1bd55)}.lqFieldVitals.danger{border-color:#d06d6360;animation:lqVitalsDanger 1s ease-in-out infinite alternate}.lqFieldVitals.danger .lqFieldHpTrack i{background:linear-gradient(90deg,#a4423b,#ef6559)}.lqFieldVitals.danger .lqFieldVitalsHead b{color:#ffaaa0}@keyframes lqVitalsDanger{to{box-shadow:0 4px 12px #0008,0 0 11px #e4574930}}
@media(max-height:700px){.lqFieldVitals{top:37px;width:102px;padding:4px 6px}}@media(prefers-reduced-motion:reduce){.lqFieldVitals.danger{animation:none}}
`;
document.head.appendChild(style);
function addFieldVitals(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqFieldVitals'))return;
 const max=Math.max(1,Number(s.mh)||1),hp=Math.max(0,Number(s.hp)||0),ratio=hp/max,pct=Math.max(0,Math.min(100,ratio*100));
 const el=document.createElement('div');el.className=`lqFieldVitals${ratio<=.3?' danger':ratio<=.55?' warn':''}`;el.innerHTML=`<div class=lqFieldVitalsHead><span>LUKE HP</span><b>${hp}/${max}</b></div><div class=lqFieldHpTrack><i style="width:${pct}%"></i></div>`;shell.appendChild(el);
}
const renderV109=render;render=function(){const r=renderV109();addFieldVitals();return r;};
queueMicrotask(addFieldVitals);
window.LQ_FIELD_VITALS_STATUS={hpBar:true,lowHpStates:true,battleLogicUntouched:true};
})();