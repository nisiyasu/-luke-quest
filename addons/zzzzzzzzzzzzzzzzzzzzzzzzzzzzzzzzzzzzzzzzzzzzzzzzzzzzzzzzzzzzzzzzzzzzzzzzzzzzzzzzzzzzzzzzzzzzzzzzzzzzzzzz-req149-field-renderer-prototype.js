(() => {
'use strict';

/*
 * REQ-149 FIELD-V04 renderer prototype.
 * Presentation only: preserves MAPS, blocked(), move(), action(), story, battle and save authorities.
 * The purpose is to test whether a materially richer field can be rendered without extending the
 * existing per-tile CSS-patch stack. It replaces the field tile presentation with one cached canvas.
 */

const STYLE_ID='lq-req149-field-renderer-style';
if(!document.getElementById(STYLE_ID)){
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
  .lqReq149FieldCanvasWorld{isolation:isolate;background:#27482f}
  .lqReq149FieldCanvasWorld>.lqReq149FieldCanvas{position:absolute;inset:0;z-index:0;pointer-events:none;display:block}
  .lqReq149FieldCanvasWorld>.tile{background:transparent!important;color:transparent!important;box-shadow:none!important;border:0!important;filter:none!important;text-shadow:none!important}
  .lqReq149FieldCanvasWorld>.lqFieldRoute,
  .lqReq149FieldCanvasWorld>.lqFieldTownPaving,
  .lqReq149FieldCanvasWorld>.lqFieldForestVerge,
  .lqReq149FieldCanvasWorld>.lqFieldDirectionStone,
  .lqReq149FieldCanvasWorld>.lqFieldLowShrub,
  .lqReq149FieldCanvasWorld>.lqFieldEdgeVignette{display:none!important}
  .lqReq149FieldCanvasWorld>.player,
  .lqReq149FieldCanvasWorld>.npc{z-index:13!important}
  `;
  document.head.appendChild(style);
}

let cachedField=null;
let cachedKey='';

function hash(x,y,k=0){
  let n=(x*374761393+y*668265263+k*1442695041)>>>0;
  n=(n^(n>>>13))*1274126177>>>0;
  return ((n^(n>>>16))>>>0)/4294967295;
}
function colorMix(a,b,t){
  const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16);
  const ar=(pa>>16)&255,ag=(pa>>8)&255,ab=pa&255;
  const br=(pb>>16)&255,bg=(pb>>8)&255,bb=pb&255;
  const r=Math.round(ar+(br-ar)*t),g=Math.round(ag+(bg-ag)*t),bl=Math.round(ab+(bb-ab)*t);
  return `rgb(${r},${g},${bl})`;
}
function tileChar(m,x,y){return x<0||y<0||x>=m.w||y>=m.h?'#':((m.tiles[y]||'')[x]||'#')}
function isWater(c){return c==='~'}
function isTree(c){return c==='*'||c==='F'}
function isHard(c){return c==='#'||c==='H'||c==='^'}
function isGround(c){return !isWater(c)&&!isHard(c)&&!isTree(c)}

function grass(ctx,x,y,variant=0){
  const X=x*TS,Y=y*TS;
  const t=hash(x,y,variant);
  const g=ctx.createLinearGradient(X,Y,X+TS,Y+TS);
  g.addColorStop(0,colorMix('#648f43','#8aae57',t*.45));
  g.addColorStop(.55,colorMix('#557d3b','#769d4b',hash(x,y,9)*.4));
  g.addColorStop(1,'#476f36');
  ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
  ctx.fillStyle='rgba(236,231,135,.13)';
  for(let i=0;i<10;i++){
    const px=X+3+hash(x,y,i+20)*(TS-6),py=Y+4+hash(x,y,i+40)*(TS-8);
    const s=hash(x,y,i+60)>.72?2:1;
    ctx.fillRect(Math.round(px),Math.round(py),s,s);
  }
  ctx.strokeStyle='rgba(27,66,31,.16)';ctx.lineWidth=1;
  for(let i=0;i<4;i++){
    const px=X+6+hash(x,y,i+80)*(TS-12),py=Y+12+hash(x,y,i+100)*(TS-18);
    ctx.beginPath();ctx.moveTo(px,py+3);ctx.lineTo(px+1.5,py-2);ctx.stroke();
  }
}
function water(ctx,x,y){
  const X=x*TS,Y=y*TS;
  const g=ctx.createLinearGradient(X,Y,X,Y+TS);
  g.addColorStop(0,'#155d92');g.addColorStop(.48,'#0b4f84');g.addColorStop(1,'#073965');
  ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
  ctx.fillStyle='rgba(102,200,239,.17)';ctx.fillRect(X,Y+5,TS,2);
  ctx.fillStyle='rgba(12,35,62,.26)';ctx.fillRect(X,Y+31,TS,8);
  ctx.strokeStyle='rgba(160,228,255,.72)';ctx.lineWidth=1.2;
  for(let i=0;i<3;i++){
    const yy=Y+11+i*12+hash(x,y,i)*4;
    const xx=X+4+hash(x,y,i+4)*15;
    ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+9,yy);ctx.lineTo(xx+13,yy-2);ctx.stroke();
  }
  ctx.fillStyle='rgba(224,248,255,.65)';
  for(let i=0;i<4;i++){
    if(hash(x,y,i+30)>.56){const px=X+5+hash(x,y,i+50)*38,py=Y+6+hash(x,y,i+70)*34;ctx.fillRect(px,py,2,1)}
  }
}
function cliff(ctx,x,y){
  const X=x*TS,Y=y*TS;
  const g=ctx.createLinearGradient(X,Y,X,Y+TS);
  g.addColorStop(0,'#314232');g.addColorStop(.2,'#29372d');g.addColorStop(1,'#17251f');
  ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
  ctx.fillStyle='rgba(112,130,92,.35)';ctx.fillRect(X,Y,TS,4);
  ctx.strokeStyle='rgba(12,20,17,.7)';ctx.lineWidth=2;
  for(let i=0;i<3;i++){
    const px=X+8+hash(x,y,i)*30;ctx.beginPath();ctx.moveTo(px,Y+11);ctx.lineTo(px-3,Y+33);ctx.stroke();
  }
}
function tree(ctx,x,y,variant=0){
  grass(ctx,x,y,variant);
  const X=x*TS,Y=y*TS,dx=(hash(x,y,91)-.5)*4;
  ctx.fillStyle='rgba(9,24,16,.38)';ctx.beginPath();ctx.ellipse(X+25+dx,Y+39,16,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#65462b';ctx.fillRect(X+21+dx,Y+26,7,15);
  const layers=[
    {cy:12,w:27,h:25,c:'#254f31'},
    {cy:20,w:34,h:28,c:'#2f6538'},
    {cy:28,w:39,h:27,c:'#214b2d'}
  ];
  layers.forEach((l,i)=>{
    ctx.fillStyle=l.c;ctx.beginPath();ctx.moveTo(X+24+dx,Y+l.cy-l.h/2);ctx.lineTo(X+24-l.w/2+dx,Y+l.cy+l.h/2);ctx.lineTo(X+24+l.w/2+dx,Y+l.cy+l.h/2);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(133,176,85,.22)';ctx.beginPath();ctx.moveTo(X+24+dx,Y+l.cy-l.h/2+2);ctx.lineTo(X+17+dx,Y+l.cy+l.h/2-4);ctx.lineTo(X+24+dx,Y+l.cy+l.h/2-7);ctx.closePath();ctx.fill();
  });
}
function rock(ctx,x,y){
  grass(ctx,x,y,5);
  const X=x*TS,Y=y*TS;
  ctx.fillStyle='rgba(13,26,20,.32)';ctx.beginPath();ctx.ellipse(X+25,Y+35,13,5,0,0,Math.PI*2);ctx.fill();
  const g=ctx.createLinearGradient(X+15,Y+18,X+33,Y+34);g.addColorStop(0,'#a8aa91');g.addColorStop(.45,'#777b70');g.addColorStop(1,'#4a514b');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(X+13,Y+31);ctx.lineTo(X+18,Y+18);ctx.lineTo(X+31,Y+15);ctx.lineTo(X+38,Y+26);ctx.lineTo(X+32,Y+34);ctx.lineTo(X+18,Y+35);ctx.closePath();ctx.fill();
}
function shoreline(ctx,m,x,y){
  const c=tileChar(m,x,y);if(!isWater(c))return;
  const X=x*TS,Y=y*TS;
  const neighbors=[['n',0,-1],['e',1,0],['s',0,1],['w',-1,0]];
  for(const [side,dx,dy] of neighbors){
    const n=tileChar(m,x+dx,y+dy);if(isWater(n))continue;
    ctx.fillStyle='rgba(9,29,26,.42)';ctx.strokeStyle='rgba(160,205,137,.52)';ctx.lineWidth=2;
    if(side==='n'){ctx.fillRect(X,Y,TS,5);ctx.beginPath();ctx.moveTo(X,Y+5);ctx.lineTo(X+TS,Y+5);ctx.stroke()}
    if(side==='s'){ctx.fillRect(X,Y+TS-6,TS,6);ctx.beginPath();ctx.moveTo(X,Y+TS-7);ctx.lineTo(X+TS,Y+TS-7);ctx.stroke()}
    if(side==='w'){ctx.fillRect(X,Y,5,TS);ctx.beginPath();ctx.moveTo(X+5,Y);ctx.lineTo(X+5,Y+TS);ctx.stroke()}
    if(side==='e'){ctx.fillRect(X+TS-6,Y,6,TS);ctx.beginPath();ctx.moveTo(X+TS-7,Y);ctx.lineTo(X+TS-7,Y+TS);ctx.stroke()}
  }
}
function bridgeSegment(ctx,x,y,w,h,deg){
  const X=x*TS,Y=y*TS,W=w*TS,H=h*TS;
  ctx.save();ctx.translate(X+W/2,Y+H/2);ctx.rotate(deg*Math.PI/180);ctx.translate(-W/2,-H/2);
  ctx.shadowColor='rgba(8,20,16,.48)';ctx.shadowBlur=10;ctx.shadowOffsetY=8;
  ctx.fillStyle='#4b3828';ctx.fillRect(0,0,W,H);
  ctx.shadowColor='transparent';
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#72563a');g.addColorStop(.45,'#b08a58');g.addColorStop(1,'#725337');
  ctx.fillStyle=g;ctx.fillRect(5,5,W-10,H-10);
  ctx.strokeStyle='rgba(54,35,23,.55)';ctx.lineWidth=1;
  const across=W>=H;
  const len=across?W:H;
  for(let p=12;p<len-5;p+=14){ctx.beginPath();if(across){ctx.moveTo(p,6);ctx.lineTo(p,H-6)}else{ctx.moveTo(6,p);ctx.lineTo(W-6,p)}ctx.stroke()}
  ctx.strokeStyle='#d0ad70';ctx.lineWidth=3;ctx.strokeRect(4,4,W-8,H-8);
  ctx.fillStyle='#5c432b';
  const step=36;
  if(across){for(let p=8;p<W-5;p+=step){ctx.fillRect(p,0,5,9);ctx.fillRect(p,H-9,5,9)}}
  else{for(let p=8;p<H-5;p+=step){ctx.fillRect(0,p,9,5);ctx.fillRect(W-9,p,9,5)}}
  ctx.restore();
}
function drawField(m){
  const c=document.createElement('canvas');c.width=m.w*TS;c.height=m.h*TS;
  const ctx=c.getContext('2d',{alpha:false});
  ctx.imageSmoothingEnabled=true;
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    const ch=tileChar(m,x,y);
    if(isWater(ch))water(ctx,x,y);
    else if(isTree(ch))tree(ctx,x,y,(x+y)%3);
    else if(ch==='^')rock(ctx,x,y);
    else if(ch==='#'||ch==='H')cliff(ctx,x,y);
    else grass(ctx,x,y,(x*3+y*5)%4);
  }
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)shoreline(ctx,m,x,y);

  /* Preserve existing route geometry, but render it as an actual timber structure rather than a rounded road. */
  bridgeSegment(ctx,9.15,15.0,3.6,.55,0);
  bridgeSegment(ctx,9.25,9.85,2.75,6.0,0);
  bridgeSegment(ctx,10.35,7.85,7.3,2.0,-8);
  bridgeSegment(ctx,16.05,3.25,2.05,5.6,-28);
  bridgeSegment(ctx,18.15,.75,2.15,3.6,-38);

  /* Sparse authored accents. These are deterministic and never collision authority. */
  const accents=[[8,14],[12,10],[16,6],[4,14],[18,3]];
  accents.forEach(([x,y],i)=>{
    const X=x*TS,Y=y*TS;
    ctx.fillStyle='rgba(22,55,29,.72)';ctx.beginPath();ctx.ellipse(X+16,Y+35,12,7,0,0,Math.PI*2);ctx.ellipse(X+28,Y+32,14,9,0,0,Math.PI*2);ctx.fill();
    if(i%2===0){ctx.fillStyle='#e5d8ad';ctx.fillRect(X+8,Y+25,2,2);ctx.fillStyle='#d88ca2';ctx.fillRect(X+12,Y+28,2,2)}
  });
  return c;
}
function cacheKey(m){return `${s.map}:${m.w}x${m.h}:${TS}:req149-v04-a`;}
function ensureCache(m){const key=cacheKey(m);if(!cachedField||cachedKey!==key){cachedField=drawField(m);cachedKey=key}return cachedField}
function decorate(){
  if(s.screen!=='world'||s.map!=='field')return;
  const m=MAPS[s.map],w=app.querySelector('.world');if(!w)return;
  w.classList.add('lqReq149FieldCanvasWorld');
  if(w.querySelector('.lqReq149FieldCanvas'))return;
  const source=ensureCache(m),canvas=document.createElement('canvas');
  canvas.className='lqReq149FieldCanvas';canvas.width=source.width;canvas.height=source.height;
  canvas.style.width=`${source.width}px`;canvas.style.height=`${source.height}px`;
  const ctx=canvas.getContext('2d',{alpha:false});ctx.drawImage(source,0,0);
  w.insertBefore(canvas,w.firstChild);
  document.body.dataset.req149FieldRenderer='canvas-prototype';
  document.body.dataset.req149CollisionAuthority='preserved';
}
const renderBase=render;
render=function(){const r=renderBase();decorate();return r};
if(s.screen==='world')decorate();
window.LQ_REQ149_FIELD_RENDERER_STATUS={
  requirement:'REQ-149',
  stage:'FIELD-V04-PROTOTYPE-A',
  renderer:'cached-canvas',
  presentationOnly:true,
  collisionChanged:false,
  inputAuthorityChanged:false,
  saveAuthorityChanged:false,
  storyAuthorityChanged:false,
  broadRollout:false
};
})();
