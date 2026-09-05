(() => {
'use strict';

/* LUKE QUEST v0.109 cinematic dialogue frame polish.
   Presentation-only enhancement for portrait dialogue; keeps formal art containment and dialogue logic intact. */

const style=document.createElement('style');
style.textContent=`
.dialogBox.portraitMode.lqCinematicDialog{border-color:#ead99c!important;box-shadow:0 13px 34px #000d,inset 0 0 0 1px #ffffff0b,inset 0 -24px 45px #0004!important;background:linear-gradient(180deg,#0d1b31f5,#07101ff8)!important}
.dialogBox.portraitMode.lqCinematicDialog:before,.dialogBox.portraitMode.lqCinematicDialog:after{content:"";position:absolute;z-index:4;pointer-events:none;width:38px;height:12px;border-top:1px solid #e4cb7866}
.dialogBox.portraitMode.lqCinematicDialog:before{left:8px;top:7px;border-left:1px solid #e4cb7866}.dialogBox.portraitMode.lqCinematicDialog:after{right:8px;top:7px;border-right:1px solid #e4cb7866}
.lqCinematicDialog .dialogPortrait{background:radial-gradient(circle at 50% 28%,#3b638050,#101a29 72%)!important;box-shadow:inset -12px 0 22px #0005}
.lqCinematicDialog.portraitRight .dialogPortrait{box-shadow:inset 12px 0 22px #0005}
.lqCinematicDialog .dialogPortrait img{animation:lqPortraitEnter .24s cubic-bezier(.2,.8,.25,1) both}
.lqCinematicDialog.portraitRight .dialogPortrait img{animation-name:lqPortraitEnterR}
@keyframes lqPortraitEnter{from{opacity:.25;transform:translateX(-8px) scale(.985)}to{opacity:1;transform:none}}
@keyframes lqPortraitEnterR{from{opacity:.25;transform:translateX(8px) scale(.985)}to{opacity:1;transform:none}}
.lqCinematicDialog .speaker{display:flex;align-items:center;gap:7px;color:#ffe59a!important;font-family:Georgia,"Yu Mincho",serif;letter-spacing:.05em!important}
.lqCinematicDialog .speaker:before{content:"";width:8px;height:8px;flex:0 0 auto;transform:rotate(45deg);background:linear-gradient(135deg,#ffe9a0,#98712c);box-shadow:0 0 7px #e7c66555}
.lqCinematicDialog .dialog{color:#f5f0df;text-shadow:0 1px 4px #0006}
.lqCinematicDialog .dialogHint{display:flex;justify-content:flex-end;align-items:center;gap:5px;color:#879aab!important;font-size:8px!important;letter-spacing:.06em}
.lqCinematicDialog .dialogHint:before{content:"A";display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1px solid #e0ca7c88;background:linear-gradient(#263c54,#142337);color:#ffe89e;font-size:9px;font-weight:1000;box-shadow:0 2px 6px #0008}
.lqCinematicDialog .portraitBadge{border-color:#e7d38e55!important;color:#ecdfba!important;background:#091423d9!important}
@media(prefers-reduced-motion:reduce){.lqCinematicDialog .dialogPortrait img{animation:none!important}}
`;
document.head.appendChild(style);

function decorateDialogue(){
 const box=app.querySelector('.dialogBox.portraitMode');
 if(box)box.classList.add('lqCinematicDialog');
}
const renderV108=render;render=function(){const r=renderV108();decorateDialogue();return r;};
queueMicrotask(decorateDialogue);
window.LQ_DIALOGUE_FRAME_STATUS={cinematicFrame:true,formalArtContainmentUntouched:true,reducedMotionAware:true};
})();