(() => {
'use strict';

/* LUKE QUEST v0.65 status HUD polish.
   Adds readable HP state and console-like framing without changing player stats. */

const style=document.createElement('style');
style.textContent=`
.card:has(>.status){padding:7px 9px!important;background:linear-gradient(180deg,#101f30,#081522)!important;border:1px solid #ffffff18!important;box-shadow:0 7px 18px #0006,inset 0 1px #ffffff0b!important}.status{gap:5px}.status .stat{position:relative;padding:4px 6px!important;border-radius:8px;background:#07131f;border:1px solid #ffffff0e;min-width:0}.status .stat small{font-size:7px!important;letter-spacing:.1em;color:#8299aa!important}.status .stat b{font-size:13px!important;color:#eef4f7}.lqHudHpBar{height:4px;margin-top:3px;border-radius:99px;background:#22313c;overflow:hidden}.lqHudHpBar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#56b66b,#91db80);transition:width .18s}.stat.lqHudDanger b{color:#ffc1b7}.stat.lqHudDanger .lqHudHpBar i{background:linear-gradient(90deg,#bb4b49,#f08866)}.stat.lqHudDanger{box-shadow:inset 0 0 0 1px #e76b5a33}.lqHudName{position:absolute;right:8px;top:3px;font-size:6px;color:#546d81;letter-spacing:.14em;pointer-events:none}
`;
document.head.appendChild(style);

function polishStatusHud(){
 const statusEl=app.querySelector('.status');if(!statusEl||statusEl.dataset.lqHud==='1')return;
 statusEl.dataset.lqHud='1';const stats=Array.from(statusEl.querySelectorAll('.stat'));
 const hp=stats.find(x=>x.querySelector('small')?.textContent.trim()==='HP');
 if(hp){const pct=Math.max(0,Math.min(100,100*s.hp/s.mh));const bar=document.createElement('div');bar.className='lqHudHpBar';bar.innerHTML=`<i style="width:${pct}%"></i>`;hp.appendChild(bar);if(pct<=30)hp.classList.add('lqHudDanger');}
 const card=statusEl.parentElement;if(card&&!card.querySelector('.lqHudName')){const name=document.createElement('span');name.className='lqHudName';name.textContent='LUKE';card.style.position='relative';card.appendChild(name);}
}

const worldV64=world;world=function(){worldV64();polishStatusHud();};
const battleV64=battle;battle=function(){const r=battleV64();polishStatusHud();return r;};
const storyV64=story;story=function(){const r=storyV64();polishStatusHud();return r;};
const renderV64=render;render=function(){const r=renderV64();polishStatusHud();return r;};
window.LQ_STATUS_HUD_STATUS={hpBar:true,dangerState:true,consoleFrame:true};
polishStatusHud();
})();
