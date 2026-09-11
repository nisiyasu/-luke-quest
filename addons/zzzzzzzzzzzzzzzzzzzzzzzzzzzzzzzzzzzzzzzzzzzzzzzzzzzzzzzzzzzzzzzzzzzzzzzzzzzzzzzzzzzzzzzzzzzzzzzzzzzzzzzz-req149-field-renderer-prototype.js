(() => {
'use strict';

/*
 * REQ-149 FIELD-V04 renderer prototype B.
 * Presentation only. MAPS / blocked() / move() / action() / save / story / battle remain canonical.
 * This prototype intentionally replaces the visible field-tile stack with one cached Canvas so the
 * quality experiment is renderer-level rather than another pile of per-tile CSS patches.
 */

const STYLE_ID='lq-req149-field-renderer-style';
if(!document.getElementById(STYLE_ID)){
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
  .lqReq149FieldCanvasWorld{isolation:isolate;background:#395d35!important}
  .lqReq149FieldCanvasWorld>.lqReq149FieldCanvas{position:absolute;inset:0;z-index:0;pointer-events:none;display:block}
  .lqReq149FieldCanvasWorld>.tile{background:transparent!important;color:transparent!important;box-shadow:none!important;border:0!important;filter:none!important;text-shadow:none!important}
  .lqReq149FieldCanvasWorld>.tile::before,.lqReq149FieldCanvasWorld>.tile::after{content:none!important;display:none!important}
  .lqReq149FieldCanvasWorld>.lqFieldGrassDetail,
  .lqReq149FieldCanvasWorld>.lqFieldTrail,
  .lqReq149FieldCanvasWorld>.lqRouteEdge,
  .lqReq149FieldCanvasWorld>.lqFieldRoute,
  .lqReq149FieldCanvasWorld>.lqFieldTownPaving,
  .lqReq149FieldCanvasWorld>.lqFieldForestVerge,
  .lqReq149FieldCanvasWorld>.lqFieldDirectionStone,
  .lqReq149FieldCanvasWorld>.lqFieldLowShrub,
  .lqReq149FieldCanvasWorld>.lqFieldFence,
  .lqReq149FieldCanvasWorld>.lqFieldRoadGate,
  .lqReq149FieldCanvasWorld>.lqFieldEdgeVignette{display:none!important}
  .lqReq149FieldCanvasWorld>.player,.lqReq149FieldCanvasWorld>.npc{z-index:13!important}
  `;
  document.head.appendChild(style);
}

let cachedField=null,cachedKey='';
function hash(x,y,k=0){let n=(x*374761393+y*668265263+k*1442695041)>>>0;n=(n^(n>>>13))*1274126177>>>0;return((n^(n>>>16))>>>0)/4294967295}
function tileChar(m,x,y){return x<0||y<0||x>=m.w||y>=m.h?'#':((m.tiles[y]||'')[x]||'#')}
function waterChar(c){return c==='~'}
function treeChar(c){return c==='*'||c==='F'}
function hardChar(c){return c==='#'||c==='H'||c==='^'}

function roundedPath(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.lineTo(x+w-rr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+rr);ctx.lineTo(x+w,y+h-rr);ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);ctx.lineTo(x+rr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-rr);ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);ctx.closePath();
}

function paintGrassBase(ctx,m){
  const W=m.w*TS,H=m.h*TS;
  const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#6e984c');g.addColorStop(.38,'#658e45');g.addColorStop(.72,'#587f3e');g.addColorStop(1,'#4b7339');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  /* broad irregular value patches: no one-tile checkerboard */
  for(let i=0;i<90;i++){
    const x=hash(i,2,4)*W,y=hash(i,5,8)*H,rx=22+hash(i,9,1)*58,ry=12+hash(i,11,7)*38;
    ctx.fillStyle=hash(i,13,2)>.5?'rgba(171,190,91,.075)':'rgba(30,75,39,.075)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,hash(i,4,6)*Math.PI,0,Math.PI*2);ctx.fill();
  }
  /* micro material texture distributed across world coordinates */
  for(let i=0;i<2100;i++){
    const x=Math.floor(hash(i,17,3)*W),y=Math.floor(hash(i,19,5)*H),v=hash(i,23,7);
    if(v<.42){ctx.fillStyle='rgba(31,70,32,.14)';ctx.fillRect(x,y,1,1)}
    else if(v>.8){ctx.fillStyle='rgba(224,218,129,.18)';ctx.fillRect(x,y,1,1)}
  }
}

function paintWaterTile(ctx,x,y){
  const X=x*TS,Y=y*TS;
  const g=ctx.createLinearGradient(0,Y,0,Y+TS);g.addColorStop(0,'#1769a6');g.addColorStop(.45,'#0b528f');g.addColorStop(1,'#073966');ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
  ctx.fillStyle='rgba(4,31,57,.18)';ctx.fillRect(X,Y+34,TS,14);
}
function paintWaterHighlights(ctx,m){
  ctx.lineWidth=1.3;
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(waterChar(tileChar(m,x,y))){
    const X=x*TS,Y=y*TS;
    for(let i=0;i<3;i++){
      const r=hash(x,y,i+100);if(r<.22)continue;
      const px=X+3+hash(x,y,i+130)*29,py=Y+8+i*12+hash(x,y,i+160)*3;
      ctx.strokeStyle=i===0?'rgba(194,238,255,.74)':'rgba(112,204,239,.48)';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7,py);ctx.quadraticCurveTo(px+11,py-2,px+15,py);ctx.stroke();
    }
    if(hash(x,y,199)>.72){ctx.fillStyle='rgba(231,250,255,.74)';ctx.fillRect(X+10+hash(x,y,201)*26,Y+9+hash(x,y,203)*27,2,2)}
  }
}

function paintCliffTile(ctx,x,y){
  const X=x*TS,Y=y*TS;const g=ctx.createLinearGradient(X,Y,X,Y+TS);g.addColorStop(0,'#354a37');g.addColorStop(.16,'#2d3f33');g.addColorStop(1,'#17251f');ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
  ctx.fillStyle='#668052';ctx.fillRect(X,Y,TS,3);ctx.fillStyle='rgba(10,20,17,.28)';ctx.fillRect(X,Y+24,TS,24);
  ctx.strokeStyle='rgba(128,137,105,.18)';ctx.lineWidth=1;for(let i=0;i<3;i++){const px=X+7+hash(x,y,i+230)*34;ctx.beginPath();ctx.moveTo(px,Y+9);ctx.lineTo(px-3,Y+22);ctx.lineTo(px+1,Y+39);ctx.stroke()}
}
function paintRock(ctx,x,y){
  const X=x*TS,Y=y*TS;ctx.fillStyle='rgba(15,29,20,.36)';ctx.beginPath();ctx.ellipse(X+25,Y+36,14,5,0,0,Math.PI*2);ctx.fill();
  const g=ctx.createLinearGradient(X+15,Y+17,X+36,Y+35);g.addColorStop(0,'#b4b39a');g.addColorStop(.38,'#85887c');g.addColorStop(1,'#4f5750');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(X+12,Y+32);ctx.lineTo(X+17,Y+19);ctx.lineTo(X+30,Y+15);ctx.lineTo(X+39,Y+27);ctx.lineTo(X+32,Y+36);ctx.lineTo(X+18,Y+36);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(226,222,190,.35)';ctx.beginPath();ctx.moveTo(X+18,Y+21);ctx.lineTo(X+29,Y+18);ctx.stroke();
}
function paintConifer(ctx,x,y,v=0){
  const X=x*TS,Y=y*TS,dx=(hash(x,y,301)-.5)*4;
  ctx.fillStyle='rgba(8,25,14,.36)';ctx.beginPath();ctx.ellipse(X+25+dx,Y+40,17,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#67472b';ctx.fillRect(X+21+dx,Y+27,7,15);ctx.fillStyle='#8a6037';ctx.fillRect(X+22+dx,Y+27,2,12);
  const greens=v%3===0?['#183f29','#245b32','#2d6a37','#1f5030']:v%3===1?['#21472b','#2c6336','#377443','#245531']:['#193f2c','#28603b','#337247','#1e5035'];
  const tiers=[{y:5,w:20,h:17},{y:11,w:29,h:20},{y:18,w:37,h:22},{y:25,w:42,h:21}];
  tiers.forEach((t,i)=>{
    const cy=Y+t.y+t.h/2,cx=X+24+dx;
    ctx.fillStyle=greens[i];ctx.beginPath();ctx.moveTo(cx,cy-t.h/2);ctx.lineTo(cx-t.w*.44,cy+t.h*.25);ctx.lineTo(cx-t.w*.32,cy+t.h*.20);ctx.lineTo(cx-t.w*.52,cy+t.h/2);ctx.lineTo(cx,cy+t.h*.35);ctx.lineTo(cx+t.w*.52,cy+t.h/2);ctx.lineTo(cx+t.w*.32,cy+t.h*.20);ctx.lineTo(cx+t.w*.44,cy+t.h*.25);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(143,184,90,.18)';ctx.beginPath();ctx.moveTo(cx-1,cy-t.h/2+2);ctx.lineTo(cx-t.w*.28,cy+t.h*.17);ctx.lineTo(cx-3,cy+t.h*.08);ctx.closePath();ctx.fill();
  });
}
function paintShore(ctx,m,x,y){
  if(!waterChar(tileChar(m,x,y)))return;const X=x*TS,Y=y*TS;
  const edges=[['n',0,-1],['e',1,0],['s',0,1],['w',-1,0]];
  for(const [side,dx,dy] of edges){if(waterChar(tileChar(m,x+dx,y+dy)))continue;
    ctx.fillStyle='rgba(13,35,27,.58)';ctx.strokeStyle='rgba(134,173,94,.75)';ctx.lineWidth=2;
    if(side==='n'){ctx.fillRect(X,Y,TS,7);ctx.beginPath();ctx.moveTo(X,Y+7);ctx.lineTo(X+TS,Y+7);ctx.stroke()}
    if(side==='s'){ctx.fillRect(X,Y+TS-7,TS,7);ctx.beginPath();ctx.moveTo(X,Y+TS-8);ctx.lineTo(X+TS,Y+TS-8);ctx.stroke()}
    if(side==='w'){ctx.fillRect(X,Y,7,TS);ctx.beginPath();ctx.moveTo(X+7,Y);ctx.lineTo(X+7,Y+TS);ctx.stroke()}
    if(side==='e'){ctx.fillRect(X+TS-7,Y,7,TS);ctx.beginPath();ctx.moveTo(X+TS-8,Y);ctx.lineTo(X+TS-8,Y+TS);ctx.stroke()}
  }
}
function paintFlowers(ctx,x,y,seed){
  const X=x*TS,Y=y*TS;for(let i=0;i<5;i++){const px=X+8+hash(seed,i,401)*32,py=Y+16+hash(seed,i,403)*24;ctx.fillStyle=i%3===0?'#f0e9cc':i%3===1?'#d99bb2':'#e8d87f';ctx.fillRect(Math.round(px),Math.round(py),2,2);ctx.fillStyle='#375d2d';ctx.fillRect(Math.round(px),Math.round(py)+2,1,3)}
}
function bridgeSegment(ctx,x,y,w,h,deg){
  const X=x*TS,Y=y*TS,W=w*TS,H=h*TS;ctx.save();ctx.translate(X+W/2,Y+H/2);ctx.rotate(deg*Math.PI/180);ctx.translate(-W/2,-H/2);
  ctx.shadowColor='rgba(8,20,14,.62)';ctx.shadowBlur=9;ctx.shadowOffsetY=9;ctx.fillStyle='#3a2a1e';roundedPath(ctx,0,0,W,H,4);ctx.fill();ctx.shadowColor='transparent';
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#725037');g.addColorStop(.2,'#9a7047');g.addColorStop(.52,'#b38a58');g.addColorStop(.82,'#8a623f');g.addColorStop(1,'#65462f');ctx.fillStyle=g;roundedPath(ctx,5,5,W-10,H-10,3);ctx.fill();
  const horizontal=W>=H;ctx.strokeStyle='rgba(64,42,27,.56)';ctx.lineWidth=1;
  const len=horizontal?W:H;for(let p=12;p<len-6;p+=12){ctx.beginPath();if(horizontal){ctx.moveTo(p,6);ctx.lineTo(p,H-6)}else{ctx.moveTo(6,p);ctx.lineTo(W-6,p)}ctx.stroke()}
  /* side beams */ctx.strokeStyle='#d0a56a';ctx.lineWidth=3;if(horizontal){ctx.beginPath();ctx.moveTo(4,5);ctx.lineTo(W-4,5);ctx.moveTo(4,H-5);ctx.lineTo(W-4,H-5);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(5,4);ctx.lineTo(5,H-4);ctx.moveTo(W-5,4);ctx.lineTo(W-5,H-4);ctx.stroke()}
  ctx.fillStyle='#4f3724';const step=36;if(horizontal){for(let p=8;p<W-4;p+=step){ctx.fillRect(p,-3,6,13);ctx.fillRect(p,H-10,6,13)}}else{for(let p=8;p<H-4;p+=step){ctx.fillRect(-3,p,13,6);ctx.fillRect(W-10,p,13,6)}}ctx.restore();
}
function paintBridgeNetwork(ctx){
  bridgeSegment(ctx,9.15,15.0,3.6,.55,0);
  bridgeSegment(ctx,9.25,9.85,2.75,6.0,0);
  bridgeSegment(ctx,10.35,7.85,7.3,2.0,-8);
  bridgeSegment(ctx,16.05,3.25,2.05,5.6,-28);
  bridgeSegment(ctx,18.15,.75,2.15,3.6,-38);
}
function paintField(m){
  const c=document.createElement('canvas');c.width=m.w*TS;c.height=m.h*TS;const ctx=c.getContext('2d',{alpha:false});ctx.imageSmoothingEnabled=true;
  paintGrassBase(ctx,m);
  /* terrain materials first */
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const ch=tileChar(m,x,y);if(waterChar(ch))paintWaterTile(ctx,x,y);else if(ch==='#'||ch==='H')paintCliffTile(ctx,x,y)}
  paintWaterHighlights(ctx,m);
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)paintShore(ctx,m,x,y);
  /* blocked natural objects */
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const ch=tileChar(m,x,y);if(treeChar(ch))paintConifer(ctx,x,y,(x*7+y*3)%3);else if(ch==='^')paintRock(ctx,x,y)}
  /* authored route becomes structural timber bridge */
  paintBridgeNetwork(ctx);
  /* foreground-adjacent accents after bridge; deterministic, sparse */
  [[3,14,1],[7,12,2],[12,10,3],[16,6,4],[19,4,5]].forEach(([x,y,s])=>paintFlowers(ctx,x,y,s));
  [[8.2,13.8],[12.9,9.5],[16.8,6.2]].forEach(([x,y],i)=>{const X=x*TS,Y=y*TS;ctx.fillStyle='rgba(19,55,28,.76)';ctx.beginPath();ctx.ellipse(X+10,Y+20,11,7,0,0,Math.PI*2);ctx.ellipse(X+23,Y+18,13,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(112,153,70,.28)';ctx.beginPath();ctx.ellipse(X+16,Y+14,9,5,0,0,Math.PI*2);ctx.fill()});
  return c;
}
function cacheKey(m){return`${s.map}:${m.w}x${m.h}:${TS}:req149-v04-b`}
function ensureCache(m){const key=cacheKey(m);if(!cachedField||cachedKey!==key){cachedField=paintField(m);cachedKey=key}return cachedField}
function decorate(){
  if(s.screen!=='world'||s.map!=='field')return;const m=MAPS[s.map],w=app.querySelector('.world');if(!w)return;w.classList.add('lqReq149FieldCanvasWorld');
  if(w.querySelector('.lqReq149FieldCanvas'))return;const source=ensureCache(m),canvas=document.createElement('canvas');canvas.className='lqReq149FieldCanvas';canvas.width=source.width;canvas.height=source.height;canvas.style.width=`${source.width}px`;canvas.style.height=`${source.height}px`;canvas.getContext('2d',{alpha:false}).drawImage(source,0,0);w.insertBefore(canvas,w.firstChild);
  document.body.dataset.req149FieldRenderer='canvas-prototype-b';document.body.dataset.req149CollisionAuthority='preserved';
}
const renderBase=render;render=function(){const r=renderBase();decorate();return r};if(s.screen==='world')decorate();
window.LQ_REQ149_FIELD_RENDERER_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-B',renderer:'cached-canvas',presentationOnly:true,collisionChanged:false,inputAuthorityChanged:false,saveAuthorityChanged:false,storyAuthorityChanged:false,broadRollout:false};
})();
