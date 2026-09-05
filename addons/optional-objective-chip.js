(() => {
'use strict';

/* Collision-safe add-on: compact optional-objective chip beneath the main objective HUD. */
const style=document.createElement('style');style.textContent=`.lqOptionalObjective{position:absolute;z-index:22;left:8px;top:73px;max-width:58%;padding:4px 7px;border-radius:8px;background:#151d29d9;border:1px solid #9b7fc044;color:#bca8cd;font-size:8px;line-height:1.35;pointer-events:none;box-shadow:0 3px 9px #0006}.lqOptionalObjective b{color:#d9c0eb;font-size:7px;letter-spacing:.11em;margin-right:4px}@media(max-width:390px){.lqOptionalObjective{top:70px;max-width:52%;font-size:7px}}`;document.head.appendChild(style);
function optionalText(){
 if(s.flags?.elderCharmQuest&&!s.flags?.elderCharmComplete)return s.flags.elderCharmFound?'銀留め具を老人へ返す':'王都近郊で銀留め具を探す';
 if(s.flags?.forestBountyAccepted&&!s.flags?.forestBountyComplete)return s.forestBountyKills>=3?'討伐掲示板で報酬を受け取る':`森の討伐 ${s.forestBountyKills||0}/3`;
 if(s.flags?.lqHerbSampleQuestAsked&&!s.flags?.lqHerbSampleQuestDone)return s.flags?.forestClearingHerbHarvested?'森の薬草標本を神殿見習いへ届ける':'森入口の木漏れ日の空地で薬草を探す';
 return'';
}
function addChip(){if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;const text=optionalText();if(!text)return;const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqOptionalObjective'))return;const e=document.createElement('div');e.className='lqOptionalObjective';e.innerHTML=`<b>SIDE</b>${text}`;shell.appendChild(e);}
const worldO=world;world=function(){worldO();addChip();};const renderO=render;render=function(){const r=renderO();addChip();return r;};window.LQ_OPTIONAL_OBJECTIVE_STATUS={visible:true,tracks:['elderCharm','forestBounty','forestHerbSample']};if(s.screen==='world')addChip();
})();
