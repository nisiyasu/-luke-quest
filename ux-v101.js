(() => {
'use strict';

/* LUKE QUEST v0.101 playtime record.
   Tracks active visible gameplay time and displays it in menu/save preview. */

s.playSeconds=Number.isFinite(Number(s.playSeconds))?Math.max(0,Math.floor(Number(s.playSeconds))):0;
let playTick=0;
setInterval(()=>{
 if(document.visibilityState==='visible'&&s.screen!=='title'){s.playSeconds++;playTick++;if(playTick>=15){playTick=0;save();}}
},1000);
function timeText(sec=s.playSeconds){const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),ss=sec%60;return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;}

const style=document.createElement('style');
style.textContent=`
.lqPlaytimeChip{background:#162b39;border:1px solid #ffffff17;border-radius:999px;padding:6px 9px;font-size:10px;color:#c6d5de}.lqPlaytimeChip strong{color:#9ed5e7}
`;
document.head.appendChild(style);
function addPlaytime(){
 if(s.pauseOpen){const row=app.querySelector('.lqInventoryRow');if(row&&!row.querySelector('.lqPlaytimeChip')){const c=document.createElement('div');c.className='lqPlaytimeChip';c.innerHTML=`PLAY <strong>${timeText()}</strong>`;row.appendChild(c);}}
 if(s.screen==='title'){const preview=app.querySelector('.lqContinuePreview');if(preview&&!preview.dataset.playtime){preview.dataset.playtime='1';const st=document.createElement('div');st.className='lqContinueStat';st.innerHTML=`<small>PLAY</small><b>${timeText()}</b>`;preview.appendChild(st);preview.style.gridTemplateColumns='repeat(4,1fr)';}}
}
const titleV100=title;title=function(){titleV100();addPlaytime();};const worldV100=world;world=function(){worldV100();addPlaytime();};const renderV100=render;render=function(){const r=renderV100();addPlaytime();return r;};
window.LQ_PLAYTIME_STATUS={activeVisibleSeconds:true,saveIntervalSeconds:15};
save();addPlaytime();
})();
