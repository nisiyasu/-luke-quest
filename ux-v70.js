(() => {
'use strict';

/* LUKE QUEST v0.70 technique menu visibility.
   Documents the first usable battle technique in the adventure menu. */

const style=document.createElement('style');
style.textContent=`
.lqTechniqueRow{display:grid;grid-template-columns:42px 1fr;gap:8px;align-items:center;background:linear-gradient(135deg,#241b32,#131827);border:1px solid #b88fd044;border-radius:9px;padding:8px}.lqTechniqueMark{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#74538a,#352b54);border:1px solid #d7b8e455;color:#f0d8ff;font-size:14px;font-weight:950;box-shadow:inset 0 0 12px #ffffff12}.lqTechniqueName{font-size:11px;color:#ebd7f4;font-weight:950}.lqTechniqueDetail{font-size:8px;color:#93a4b5;line-height:1.45;margin-top:2px}.lqTechniqueTag{display:inline-block;margin-top:4px;padding:2px 5px;border-radius:999px;background:#3f3154;color:#d9bce9;font-size:7px;font-weight:900}
`;
document.head.appendChild(style);

function addTechniqueSection(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqTechniqueSection'))return;
 const section=document.createElement('div');section.className='lqPauseSection lqTechniqueSection';section.innerHTML=`<h3>TECHNIQUE</h3><div class=lqTechniqueRow><div class=lqTechniqueMark>斬</div><div><div class=lqTechniqueName>集中斬り</div><div class=lqTechniqueDetail>呼吸を整え、一気に踏み込む強撃。通常攻撃より高威力。</div><span class=lqTechniqueTag>1 BATTLE / 1 USE</span></div></div>`;
 const clue=panel.querySelector('.lqClueJournal');const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(section,clue||buttons);
}

const worldV69=world;world=function(){worldV69();addTechniqueSection();};
const renderV69=render;render=function(){const r=renderV69();addTechniqueSection();return r;};
window.LQ_TECHNIQUE_MENU_STATUS={focusSlashVisible:true};
if(s.pauseOpen)addTechniqueSection();
})();
