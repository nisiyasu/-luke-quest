(() => {
'use strict';

/* LUKE QUEST v0.90 adventure minimap.
   Adds a compact pause-menu map derived from live tile data, player position and exits. */

const style=document.createElement('style');
style.textContent=`
.lqMinimapWrap{display:grid;grid-template-columns:150px 1fr;gap:9px;align-items:center}.lqMinimapCanvas{width:150px;height:96px;border-radius:8px;border:1px solid #ffffff20;background:#061019;image-rendering:pixelated;box-shadow:inset 0 0 14px #0008}.lqMinimapLegend{font-size:8px;line-height:1.55;color:#8fa4b6}.lqMinimapLegend b{display:block;color:#e5ce7b;font-size:9px;margin-bottom:2px}.lqMinimapLegend span{display:block}.lqMapDot{color:#ffe58d}@media(max-width:390px){.lqMinimapWrap{grid-template-columns:125px 1fr}.lqMinimapCanvas{width:125px;height:82px}}
`;
document.head.appendChild(style);

function mapColor(c){
 if(c==='#')return'#4d5360';if(c==='~')return'#3c769c';if(c==='*')return'#245c34';if(c==='H')return'#843e3a';if(c==='T')return'#c3ad7b';if(c==='^')return'#686863';if(c==='+')return'#4b4540';if(['G','F','D','R','Q','S','X','Y','Z','N','V'].includes(c))return'#d1b653';
 if(s.map==='observation')return'#343b43';if(s.map==='evacRoute')return'#485047';if(s.map==='mistTrail')return'#36514d';if(s.map==='deepForest')return'#183d28';if(s.map==='forest')return'#2e6a3d';return'#568e43';
}
function drawMinimap(canvas){
 const m=MAPS[s.map];if(!m)return;const dpr=Math.min(2,window.devicePixelRatio||1),w=150,h=96;canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.imageSmoothingEnabled=false;
 const scale=Math.min((w-6)/m.w,(h-6)/m.h),ox=(w-m.w*scale)/2,oy=(h-m.h*scale)/2;c.fillStyle='#061019';c.fillRect(0,0,w,h);
 for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){c.fillStyle=mapColor(m.tiles[y]?.[x]||'#');c.fillRect(ox+x*scale,oy+y*scale,Math.ceil(scale),Math.ceil(scale));}
 c.fillStyle='#fff0a0';c.beginPath();c.arc(ox+(s.x+.5)*scale,oy+(s.y+.5)*scale,Math.max(2.2,scale*.55),0,Math.PI*2);c.fill();c.strokeStyle='#26324a';c.lineWidth=1;c.stroke();
}
function addMinimap(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqMinimapSection'))return;
 const sec=document.createElement('div');sec.className='lqPauseSection lqMinimapSection';sec.innerHTML=`<h3>AREA MAP</h3><div class=lqMinimapWrap><canvas class=lqMinimapCanvas aria-label="現在地ミニマップ"></canvas><div class=lqMinimapLegend><b>${MAPS[s.map]?.name||s.map}</b><span class=lqMapDot>● 現在地</span><span>金色 = 出入口</span><span>水・森・壁を簡略表示</span></div></div>`;
 const obj=panel.querySelector('.lqPauseSection');obj?.after(sec);drawMinimap(sec.querySelector('canvas'));
}
const worldV89=world;world=function(){worldV89();addMinimap();};
const renderV89=render;render=function(){const r=renderV89();addMinimap();return r;};
window.LQ_MINIMAP_STATUS={pauseMenu:true,liveTileDerived:true,playerDot:true};
if(s.pauseOpen)addMinimap();
})();
