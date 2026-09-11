(() => {
'use strict';
/* REQ-149 V04-E visual critic repair.
 * Adds richer continuous-ground texture and larger irregular conifer silhouettes to the same
 * cached Canvas. No logical map/input/collision/save/story authority is introduced.
 * This file is temporary V04 iteration code and must be folded into the canonical renderer
 * before V05+ broad rollout.
 */
function h(a,b,c=0){let n=(a*374761393+b*668265263+c*1442695041)>>>0;n=(n^(n>>>13))*1274126177>>>0;return((n^(n>>>16))>>>0)/4294967295}
function ch(m,x,y){return x<0||y<0||x>=m.w||y>=m.h?'#':((m.tiles[y]||'')[x]||'#')}
function isGround(c){return c!== '#'&&c!=='H'&&c!=='~'&&c!=='*'&&c!=='F'&&c!=='^'}
function isTree(c){return c==='*'||c==='F'}

function paintGroundDetail(ctx,m){
  /* clusters cross logical-cell boundaries so the ground reads as one material, not 48px cards */
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    if(!isGround(ch(m,x,y)))continue;
    const X=x*TS,Y=y*TS;
    const count=2+Math.floor(h(x,y,701)*4);
    for(let i=0;i<count;i++){
      const px=X-5+h(x,y,710+i)*(TS+10),py=Y-4+h(x,y,730+i)*(TS+8);
      const tall=2+Math.floor(h(x,y,750+i)*4);
      ctx.strokeStyle=h(x,y,770+i)>.45?'rgba(44,94,43,.32)':'rgba(153,177,87,.26)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px,py+tall);ctx.quadraticCurveTo(px+1,py+1,px+2,py);ctx.stroke();
    }
    if(h(x,y,790)>.82){
      const px=X+8+h(x,y,792)*28,py=Y+12+h(x,y,794)*24;
      const petals=h(x,y,796)>.5?'rgba(241,235,210,.88)':'rgba(218,151,176,.88)';
      ctx.fillStyle=petals;ctx.fillRect(px,py,2,2);ctx.fillRect(px-2,py+1,2,2);ctx.fillRect(px+2,py+1,2,2);ctx.fillStyle='#d6bd62';ctx.fillRect(px,py+1,1,1);
    }
  }
  /* broad darker moss pockets add depth without a tile-grid pattern */
  for(let i=0;i<36;i++){
    const x=h(i,801,1)*m.w*TS,y=h(i,803,2)*m.h*TS,rx=18+h(i,805,3)*38,ry=8+h(i,807,4)*20;
    ctx.fillStyle='rgba(31,78,37,.055)';ctx.beginPath();ctx.ellipse(x,y,rx,ry,h(i,809,5)*Math.PI,0,Math.PI*2);ctx.fill();
  }
}
function blob(ctx,cx,cy,rx,ry,color,rot=0){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,rot,0,Math.PI*2);ctx.fill()}
function conifer(ctx,x,y,v){
  const X=x*TS,Y=y*TS,cx=X+24+(h(x,y,820)-.5)*5;
  /* long grounding shadow */
  blob(ctx,cx+4,Y+44,19,6,'rgba(7,24,13,.42)',-.08);
  /* trunk with warm lit edge */
  ctx.fillStyle='#533820';ctx.fillRect(cx-4,Y+26,8,19);ctx.fillStyle='#8d6134';ctx.fillRect(cx-3,Y+27,2,16);
  const palettes=[
    ['#123b27','#194c2d','#245f35','#327541','#73a355'],
    ['#173f29','#205132','#2a653b','#397a47','#78a65a'],
    ['#103829','#194932','#245c3d','#2f7047','#679a58']
  ];
  const p=palettes[v%palettes.length];
  /* irregular bough masses instead of triangle icons */
  const tiers=[
    [Y+7,8,7],[Y+13,13,8],[Y+20,18,10],[Y+28,23,11],[Y+36,26,12]
  ];
  tiers.forEach(([cy,rx,ry],i)=>{
    const wob=(h(x,y,850+i)-.5)*5;
    blob(ctx,cx+wob,cy,rx,ry,p[Math.min(i,3)],(h(x,y,870+i)-.5)*.13);
    blob(ctx,cx-rx*.48+wob,cy+ry*.2,rx*.48,ry*.55,p[Math.max(0,i-1)],-.12);
    blob(ctx,cx+rx*.48+wob,cy+ry*.25,rx*.52,ry*.58,p[i],.13);
    if(i>0)blob(ctx,cx-rx*.18+wob,cy-ry*.35,rx*.28,ry*.23,'rgba(151,191,104,.18)',-.15);
  });
  /* needle tips break smooth ellipses */
  ctx.strokeStyle='rgba(117,157,82,.44)';ctx.lineWidth=1;
  for(let i=0;i<11;i++){
    const yy=Y+10+h(x,y,900+i)*30,side=h(x,y,930+i)>.5?1:-1,xx=cx+side*(8+h(x,y,950+i)*17);
    ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+side*(4+h(x,y,970+i)*5),yy+2);ctx.stroke();
  }
}
function bridgeSegment(ctx,x,y,w,hgt,deg){
  const X=x*TS,Y=y*TS,W=w*TS,H=hgt*TS;ctx.save();ctx.translate(X+W/2,Y+H/2);ctx.rotate(deg*Math.PI/180);ctx.translate(-W/2,-H/2);
  ctx.shadowColor='rgba(8,20,14,.64)';ctx.shadowBlur=10;ctx.shadowOffsetY=9;ctx.fillStyle='#352419';ctx.fillRect(0,0,W,H);ctx.shadowColor='transparent';
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#6a4930');g.addColorStop(.18,'#936842');g.addColorStop(.48,'#b18453');g.addColorStop(.78,'#89603c');g.addColorStop(1,'#5f412b');ctx.fillStyle=g;ctx.fillRect(5,5,W-10,H-10);
  const horizontal=W>=H;ctx.strokeStyle='rgba(55,35,23,.62)';ctx.lineWidth=1;const len=horizontal?W:H;for(let p=11;p<len-6;p+=12){ctx.beginPath();if(horizontal){ctx.moveTo(p,6);ctx.lineTo(p,H-6)}else{ctx.moveTo(6,p);ctx.lineTo(W-6,p)}ctx.stroke()}
  ctx.strokeStyle='#d0a56a';ctx.lineWidth=3;if(horizontal){ctx.beginPath();ctx.moveTo(4,5);ctx.lineTo(W-4,5);ctx.moveTo(4,H-5);ctx.lineTo(W-4,H-5);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(5,4);ctx.lineTo(5,H-4);ctx.moveTo(W-5,4);ctx.lineTo(W-5,H-4);ctx.stroke()}
  ctx.fillStyle='#4b3220';const step=34;if(horizontal){for(let p=7;p<W-4;p+=step){ctx.fillRect(p,-4,7,15);ctx.fillRect(p,H-11,7,15)}}else{for(let p=7;p<H-4;p+=step){ctx.fillRect(-4,p,15,7);ctx.fillRect(W-11,p,15,7)}}ctx.restore();
}
function repaintBridge(ctx){
  bridgeSegment(ctx,9.15,15.0,3.6,.55,0);bridgeSegment(ctx,9.25,9.85,2.75,6.0,0);bridgeSegment(ctx,10.35,7.85,7.3,2.0,-8);bridgeSegment(ctx,16.05,3.25,2.05,5.6,-28);bridgeSegment(ctx,18.15,.75,2.15,3.6,-38);
}
function refine(){
  if(s?.screen!=='world'||s?.map!=='field')return;const c=app.querySelector('.lqReq149FieldCanvas');if(!c||c.dataset.req149V04e==='1')return;const ctx=c.getContext('2d',{alpha:false}),m=MAPS.field;
  paintGroundDetail(ctx,m);
  /* all enhanced trees before bridge so raised bridge structure correctly occludes them */
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(isTree(ch(m,x,y)))conifer(ctx,x,y,(x*5+y*7)%3);
  repaintBridge(ctx);
  c.dataset.req149V04e='1';document.body.dataset.req149FieldRenderer='canvas-prototype-e';
}
const renderBase=render;render=function(){const r=renderBase();refine();return r};refine();
window.LQ_REQ149_V04E_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-E',presentationOnly:true,enhancedConifers:true,continuousGroundDetail:true,collisionChanged:false,inputAuthorityChanged:false,broadRollout:false};
})();
