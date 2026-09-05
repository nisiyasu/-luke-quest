(() => {
'use strict';

/* Collision-safe add-on: gives the enemy stage a stronger console-RPG focal treatment without changing mechanics. */
const style=document.createElement('style');
style.textContent=`
.lqBattleFocus{position:absolute;z-index:7;left:50%;top:18%;width:min(68%,330px);height:190px;transform:translateX(-50%);pointer-events:none}
.lqBattleFocus::before{content:'';position:absolute;left:50%;bottom:10px;width:72%;height:28px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,#050608b8 0%,#05060866 45%,transparent 72%);filter:blur(2px)}
.lqBattleFocus .corner{position:absolute;width:27px;height:27px;opacity:.62;border-color:#e2c070;border-style:solid;filter:drop-shadow(0 0 5px #d6b65355)}
.lqBattleFocus .c1{left:0;top:0;border-width:2px 0 0 2px}.lqBattleFocus .c2{right:0;top:0;border-width:2px 2px 0 0}.lqBattleFocus .c3{left:0;bottom:0;border-width:0 0 2px 2px}.lqBattleFocus .c4{right:0;bottom:0;border-width:0 2px 2px 0}
.lqBattleFocus .pulse{position:absolute;left:50%;top:50%;width:75%;height:75%;transform:translate(-50%,-50%);border:1px solid #f2dc8c18;border-radius:50%;box-shadow:inset 0 0 28px #e7c6740a;animation:lqBattleFocusPulse 2.8s ease-in-out infinite}
@keyframes lqBattleFocusPulse{0%,100%{opacity:.28;transform:translate(-50%,-50%) scale(.96)}50%{opacity:.58;transform:translate(-50%,-50%) scale(1.03)}}
@media(prefers-reduced-motion:reduce){.lqBattleFocus .pulse{animation:none;opacity:.36}}
`;
document.head.appendChild(style);
function addFrame(){
 if(s.screen!=='battle')return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqBattleFocus'))return;
 const e=document.createElement('div');e.className='lqBattleFocus';e.innerHTML='<i class="corner c1"></i><i class="corner c2"></i><i class="corner c3"></i><i class="corner c4"></i><i class="pulse"></i>';shell.appendChild(e);
}
const battleBase=battle;battle=function(){const r=battleBase();addFrame();return r;};
const renderBase=render;render=function(){const r=renderBase();addFrame();return r;};
addFrame();
window.LQ_BATTLE_FOCUS_FRAME_STATUS={active:true,presentationOnly:true,reducedMotion:true};
})();
