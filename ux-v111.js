(() => {
'use strict';

/* LUKE QUEST v0.111 battle command console feedback.
   Presentation-only hierarchy and tactile response for iPhone battle commands. */

const style=document.createElement('style');
style.textContent=`
.battleCommandCard{border-color:#d8c77736!important;box-shadow:0 12px 26px #000b,inset 0 0 22px #8cb0cf08!important}
.commandGrid{gap:7px!important}.commandGrid .commandBtn{border:1px solid #ffffff1c!important;background:linear-gradient(180deg,#1a3148,#102238)!important;box-shadow:inset 0 1px #ffffff0d,0 4px 8px #0006;transition:transform .08s ease,filter .08s ease,border-color .08s ease!important}
.commandGrid .commandBtn:active{transform:translateY(2px) scale(.985)!important;filter:brightness(1.22);border-color:#ebd57a70!important}.commandGrid .commandBtn:focus-visible{outline:2px solid #f2d978;outline-offset:2px}
.commandGrid .commandBtn:nth-child(1){border-left-color:#d46c6666!important}.commandGrid .commandBtn:nth-child(2){border-left-color:#6c9fd466!important}.commandGrid .commandBtn:nth-child(3){border-left-color:#72b86f66!important}.commandGrid .commandBtn:nth-child(4){border-left-color:#b69a7b66!important}
.lqCommandHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 1px 7px;padding:0 2px;color:#839bad;font-size:8px;letter-spacing:.14em;font-weight:900}.lqCommandHeader b{color:#ead88e;font-size:9px;letter-spacing:.08em}.lqCommandHeader i{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:5px;background:#78bf80;box-shadow:0 0 7px #71cf7a88;animation:lqTurnLamp .8s ease-in-out infinite alternate}@keyframes lqTurnLamp{to{opacity:.45}}
@media(prefers-reduced-motion:reduce){.lqCommandHeader i{animation:none}}
`;
document.head.appendChild(style);
function decorateCommandConsole(){
 if(s.screen!=='battle')return;const card=app.querySelector('.battleCommandCard'),grid=app.querySelector('.commandGrid');if(!card||!grid||card.querySelector('.lqCommandHeader'))return;
 const h=document.createElement('div');h.className='lqCommandHeader';h.innerHTML='<span><i></i><b>COMMAND</b></span><span>SELECT ACTION</span>';card.insertBefore(h,grid);
}
const battleV110=battle;battle=function(){const r=battleV110();decorateCommandConsole();return r;};
const renderV110=render;render=function(){const r=renderV110();decorateCommandConsole();return r;};
if(s.screen==='battle')decorateCommandConsole();
window.LQ_BATTLE_CONSOLE_STATUS={touchFeedback:true,focusVisible:true,commandHierarchy:true};
})();