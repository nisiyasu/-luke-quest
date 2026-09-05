(() => {
'use strict';

/* LUKE QUEST v0.112 dialogue focus lighting.
   Cinematic world dim/vignette during conversations; no dialogue or movement semantics changed. */

const style=document.createElement('style');
style.textContent=`
.gameShell.lqDialogueFocus:after{content:"";position:absolute;inset:0;z-index:27;pointer-events:none;background:radial-gradient(ellipse at 50% 44%,transparent 0 26%,#03070d42 58%,#02050ab0 100%);animation:lqDialogueFocusIn .18s ease-out both}
.gameShell.lqDialogueFocus .dialogBox{z-index:30}.gameShell.lqDialogueFocus .hud{filter:brightness(.7) saturate(.75);transition:filter .18s ease}
@keyframes lqDialogueFocusIn{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.gameShell.lqDialogueFocus:after{animation:none}}
`;
document.head.appendChild(style);
function applyDialogueFocus(){
 if(s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell)return;shell.classList.toggle('lqDialogueFocus',!!s.dialog);
}
const renderV111=render;render=function(){const r=renderV111();applyDialogueFocus();return r;};
queueMicrotask(applyDialogueFocus);
window.LQ_DIALOGUE_FOCUS_STATUS={worldVignette:true,hudDeemphasis:true,pointerSafe:true};
})();