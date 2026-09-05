(() => {
'use strict';

/* LUKE QUEST v0.118 encounter danger indicator.
   Readable area-risk feedback for exploration; encounter mechanics remain untouched. */

const RISK={field:[1,'LOW'],forest:[2,'CAUTION'],deepForest:[3,'DANGER'],mistTrail:[3,'DANGER'],observation:[4,'HIGH'],evacRoute:[4,'HIGH'],cliffRoad:[4,'HIGH']};
const style=document.createElement('style');
style.textContent=`
.lqRiskChip{position:absolute;z-index:19;right:9px;top:43px;display:flex;align-items:center;gap:6px;padding:5px 7px;border-radius:9px;background:#07111fc7;border:1px solid #ffffff1c;box-shadow:0 4px 12px #0007;pointer-events:none;color:#8fa3b1;font-size:7px;letter-spacing:.11em}.lqRiskDots{display:flex;gap:2px}.lqRiskDots i{width:5px;height:5px;border-radius:50%;background:#293947}.lqRiskChip.r1 .lqRiskDots i:nth-child(-n+1){background:#69b77a}.lqRiskChip.r2 .lqRiskDots i:nth-child(-n+2){background:#d4bd58}.lqRiskChip.r3 .lqRiskDots i:nth-child(-n+3){background:#d98c4d}.lqRiskChip.r4 .lqRiskDots i:nth-child(-n+4){background:#d75f58;box-shadow:0 0 5px #da5b55aa}.lqRiskChip.r3,.lqRiskChip.r4{border-color:#c77b5550}.lqRiskChip b{font-size:7px;color:#d6e0e6;letter-spacing:.08em}@media(max-height:700px){.lqRiskChip{top:38px;padding:4px 6px}}
`;
document.head.appendChild(style);
function addRisk(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;const cfg=RISK[s.map],shell=app.querySelector('.gameShell');if(!cfg||!shell||shell.querySelector('.lqRiskChip'))return;
 const e=document.createElement('div');e.className=`lqRiskChip r${cfg[0]}`;e.innerHTML=`<span>ENCOUNTER</span><span class=lqRiskDots><i></i><i></i><i></i><i></i></span><b>${cfg[1]}</b>`;shell.appendChild(e);
}
const renderV117=render;render=function(){const r=renderV117();addRisk();return r;};queueMicrotask(addRisk);
window.LQ_ENCOUNTER_RISK_STATUS={displayOnly:true,mechanicsUntouched:true};
})();