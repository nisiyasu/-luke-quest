(() => {
'use strict';

/* LUKE QUEST v0.136 SFX toggle. Keeps original synthesized battle sounds user-controllable on iPhone. */
s.settings=s.settings||{};if(typeof s.settings.sfx!=='boolean')s.settings.sfx=true;
const style=document.createElement('style');style.textContent='.lqSfxBtn{grid-column:1/-1;min-height:44px;border-radius:10px;border:1px solid #ffffff1d;background:#182638;color:#aebdca;font-size:10px;font-weight:900}.lqSfxBtn.on{color:#c9e7d1;border-color:#77b58755;background:#1c3428}';document.head.appendChild(style);
window.lqToggleSfx=function(){s.settings.sfx=!s.settings.sfx;save();render();};function addSfxToggle(){if(!s.pauseOpen||s.screen!=='world')return;const box=app.querySelector('.lqPauseButtons');if(!box||box.querySelector('.lqSfxBtn'))return;const b=document.createElement('button');b.className=`lqSfxBtn${s.settings.sfx?' on':''}`;b.textContent=`SFX  ${s.settings.sfx?'ON':'OFF'}`;b.onclick=window.lqToggleSfx;box.appendChild(b);}const renderV135=render;render=function(){const r=renderV135();addSfxToggle();return r;};queueMicrotask(addSfxToggle);window.LQ_AUDIO_SETTINGS_STATUS={musicToggle:typeof window.lqToggleMusic==='function',sfxToggle:true};
})();