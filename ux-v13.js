(() => {
'use strict';

/* LUKE QUEST v0.13 map-readability patch.
   Adds visible route hierarchy/landmarks without changing collision or map coordinates. */

const style=document.createElement('style');
style.textContent=`
.tile.lqTownRoad{background:linear-gradient(90deg,#c7ad76,#d9c38d 50%,#c7ad76);box-shadow:inset 0 0 0 1px #fff2b52c,inset 0 7px 12px #fff2b515}
.tile.lqFieldTrail{background:linear-gradient(135deg,#719d4f,#86ad5c);box-shadow:inset 0 0 0 2px #e9d99e28}
.tile.lqFieldTrail:after{content:"";width:18px;height:8px;border-radius:50%;background:#cbb78066;box-shadow:0 0 0 1px #7d6e4570;transform:rotate(-8deg)}
.lqMapLandmark{position:absolute;z-index:6;transform:translate(-50%,-100%);background:#07111fe8;border:2px solid #f6d35b;border-radius:9px;padding:4px 7px;color:#fff7dd;font-size:11px;font-weight:950;line-height:1;white-space:nowrap;box-shadow:0 4px 12px #0009,0 0 12px #f6d35b33;pointer-events:none}
.lqMapLandmark:after{content:"";position:absolute;left:50%;top:100%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#f6d35b}
.lqGateArch{position:absolute;z-index:5;width:104px;height:74px;border:9px solid #aa8958;border-bottom:0;border-radius:30px 30px 0 0;box-shadow:inset 0 0 0 3px #d9bd83,0 5px 11px #0007;pointer-events:none}
.lqGateArch:before,.lqGateArch:after{content:"";position:absolute;bottom:-12px;width:18px;height:54px;background:linear-gradient(90deg,#826744,#b18d5c);border:2px solid #d4b779}
.lqGateArch:before{left:-9px}.lqGateArch:after{right:-9px}
.lqRouteLegend{position:absolute;z-index:20;right:9px;top:88px;background:#07111fd9;border:1px solid #ffffff24;border-radius:8px;padding:5px 7px;font-size:10px;font-weight:800;color:#e8dcc0;pointer-events:none}
.lqRouteLegend i{display:inline-block;width:14px;height:7px;border-radius:8px;background:#cbb78088;margin-right:4px;vertical-align:1px}
@media(max-height:700px){.lqRouteLegend{top:82px;font-size:9px}}
`;
document.head.appendChild(style);

function tileAt(tiles,m,x,y){
  if(x<0||y<0||x>=m.w||y>=m.h)return null;
  return tiles[y*m.w+x]||null;
}

function shortestDotPath(m,start,goal){
  const key=(x,y)=>`${x},${y}`;
  const pass=(x,y)=>{
    if(x===start.x&&y===start.y)return true;
    if(x===goal.x&&y===goal.y)return true;
    const c=(m.tiles[y]||'')[x];
    return c==='.'||c==='G'||c==='F';
  };
  const queue=[start],seen=new Set([key(start.x,start.y)]),prev=new Map();
  for(let qi=0;qi<queue.length;qi++){
    const p=queue[qi];
    if(p.x===goal.x&&p.y===goal.y){
      const path=[];let cur=p;
      while(cur){path.push(cur);cur=prev.get(key(cur.x,cur.y))||null}
      return path.reverse();
    }
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=p.x+dx,ny=p.y+dy,k=key(nx,ny);
      if(nx<0||ny<0||nx>=m.w||ny>=m.h||seen.has(k)||!pass(nx,ny))continue;
      seen.add(k);prev.set(k,p);queue.push({x:nx,y:ny});
    }
  }
  return [];
}

function addLandmark(worldEl,text,x,y){
  const mark=document.createElement('div');
  mark.className='lqMapLandmark';
  mark.textContent=text;
  mark.style.left=`${x*TS+TS/2}px`;
  mark.style.top=`${y*TS+6}px`;
  worldEl.appendChild(mark);
}

function decorateTown(m,tiles,worldEl,shell){
  for(let y=10;y<=14;y++)for(let x=7;x<=10;x++){
    const c=(m.tiles[y]||'')[x];
    if(c==='.'||c==='G')tileAt(tiles,m,x,y)?.classList.add('lqTownRoad');
  }
  const arch=document.createElement('div');
  arch.className='lqGateArch';
  arch.style.left=`${8*TS-4}px`;
  arch.style.top=`${13*TS+3}px`;
  worldEl.appendChild(arch);
  addLandmark(worldEl,'王都南門 ↓',8.5,13.1);
  const legend=document.createElement('div');
  legend.className='lqRouteLegend';
  legend.innerHTML='<i></i>石畳を南門へ';
  shell.appendChild(legend);
}

function decorateField(m,tiles,worldEl,shell){
  const path=shortestDotPath(m,{x:10,y:15},{x:20,y:1});
  for(const p of path)tileAt(tiles,m,p.x,p.y)?.classList.add('lqFieldTrail');
  addLandmark(worldEl,'魔物の森 ↑',20,1.05);
  const legend=document.createElement('div');
  legend.className='lqRouteLegend';
  legend.innerHTML='<i></i>踏み跡を北東へ';
  shell.appendChild(legend);
}

function improveMapReadability(){
  if(typeof s==='undefined'||s.screen!=='world')return;
  if(s.map!=='town'&&s.map!=='field')return;
  const m=MAPS[s.map],worldEl=app.querySelector('.world'),shell=app.querySelector('.gameShell');
  if(!m||!worldEl||!shell)return;
  const tiles=Array.from(worldEl.querySelectorAll('.tile'));
  if(tiles.length<m.w*m.h)return;
  if(s.map==='town')decorateTown(m,tiles,worldEl,shell);
  if(s.map==='field')decorateField(m,tiles,worldEl,shell);
}

const worldV12=world;
world=function(){
  worldV12();
  improveMapReadability();
};

const renderV12=render;
render=function(){
  const result=renderV12();
  if(typeof s!=='undefined'&&s.screen==='world')improveMapReadability();
  return result;
};

window.LQ_improveMapReadability=improveMapReadability;

if(typeof s!=='undefined'&&s.screen==='world')improveMapReadability();

})();
