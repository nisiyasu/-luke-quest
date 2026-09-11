(() => {
'use strict';

/* REQ-149 V04-C temporary renderer repair.
 * Refines the single REQ-149 field canvas in-place. It adds no input/collision/save/story authority.
 * This repair is intentionally scoped to the V04 experiment and must be folded into the renderer
 * before broad V05+ rollout.
 */

function h(x,y,k=0){let n=(x*374761393+y*668265263+k*1442695041)>>>0;n=(n^(n>>>13))*1274126177>>>0;return((n^(n>>>16))>>>0)/4294967295}
function ch(m,x,y){return x<0||y<0||x>=m.w||y>=m.h?'#':((m.tiles[y]||'')[x]||'#')}
function isWater(c){return c==='~'}
function isBlockedNatural(c){return c==='#'||c==='H'||c==='*'||c==='^'}
function isCliff(c){return c==='#'||c==='H'}

function repaintWater(ctx,m){
  const H=m.h*TS;
  const global=ctx.createLinearGradient(0,0,0,H);global.addColorStop(0,'#176ca9');global.addColorStop(.45,'#0b538d');global.addColorStop(1,'#06355f');
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(isWater(ch(m,x,y))){ctx.fillStyle=global;ctx.fillRect(x*TS,y*TS,TS+.5,TS+.5)}

  /* highlights run across contiguous water, avoiding one-wave-per-tile repetition */
  ctx.lineCap='round';
  for(let y=0;y<m.h;y++){
    let start=-1;
    for(let x=0;x<=m.w;x++){
      const water=x<m.w&&isWater(ch(m,x,y));
      if(water&&start<0)start=x;
      if((!water||x===m.w)&&start>=0){
        const end=x-1,X=start*TS,Y=y*TS,W=(end-start+1)*TS;
        ctx.fillStyle='rgba(3,28,52,.18)';ctx.fillRect(X,Y+35,W,13);
        for(let i=0;i<Math.max(2,Math.floor(W/42));i++){
          const px=X+8+h(start+y,i,511)*(Math.max(12,W-28)),py=Y+9+h(end+y,i,513)*25;
          ctx.strokeStyle=i%3===0?'rgba(216,245,255,.83)':'rgba(108,204,241,.56)';ctx.lineWidth=i%3===0?1.7:1.1;
          ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+8,py);ctx.quadraticCurveTo(px+13,py-3,px+19,py);ctx.lineTo(px+26,py);ctx.stroke();
        }
        start=-1;
      }
    }
  }
}
function banks(ctx,m){
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++)if(isWater(ch(m,x,y))){
    const X=x*TS,Y=y*TS;
    [['n',0,-1],['e',1,0],['s',0,1],['w',-1,0]].forEach(([side,dx,dy])=>{
      if(isWater(ch(m,x+dx,y+dy)))return;
      /* layered bank instead of a near-black rectangular frame: moss lip -> earth face -> water shadow */
      const wob=Math.round((h(x,y,520+dx*7+dy*11)-.5)*2);
      const face='rgba(47,61,40,.78)', earth='rgba(79,75,49,.55)', lip='rgba(143,177,91,.92)', shadow='rgba(9,31,31,.28)';
      ctx.lineWidth=2;ctx.strokeStyle=lip;
      if(side==='n'){
        ctx.fillStyle=face;ctx.fillRect(X,Y,TS,5+wob);ctx.fillStyle=earth;ctx.fillRect(X,Y+4+wob,TS,3);ctx.fillStyle=shadow;ctx.fillRect(X,Y+7+wob,TS,2);
        ctx.beginPath();ctx.moveTo(X,Y+1);ctx.quadraticCurveTo(X+TS*.48,Y+2+wob,X+TS,Y+1);ctx.stroke();
      }
      if(side==='s'){
        ctx.fillStyle=shadow;ctx.fillRect(X,Y+TS-8-wob,TS,2);ctx.fillStyle=earth;ctx.fillRect(X,Y+TS-6-wob,TS,3);ctx.fillStyle=face;ctx.fillRect(X,Y+TS-3-wob,TS,3+wob);
        ctx.beginPath();ctx.moveTo(X,Y+TS-8-wob);ctx.quadraticCurveTo(X+TS*.55,Y+TS-7,X+TS,Y+TS-8+wob);ctx.stroke();
      }
      if(side==='w'){
        ctx.fillStyle=face;ctx.fillRect(X,Y,5+wob,TS);ctx.fillStyle=earth;ctx.fillRect(X+4+wob,Y,3,TS);ctx.fillStyle=shadow;ctx.fillRect(X+7+wob,Y,2,TS);
        ctx.beginPath();ctx.moveTo(X+1,Y);ctx.quadraticCurveTo(X+2+wob,Y+TS*.52,X+1,Y+TS);ctx.stroke();
      }
      if(side==='e'){
        ctx.fillStyle=shadow;ctx.fillRect(X+TS-8-wob,Y,2,TS);ctx.fillStyle=earth;ctx.fillRect(X+TS-6-wob,Y,3,TS);ctx.fillStyle=face;ctx.fillRect(X+TS-3-wob,Y,3+wob,TS);
        ctx.beginPath();ctx.moveTo(X+TS-8-wob,Y);ctx.quadraticCurveTo(X+TS-7,Y+TS*.47,X+TS-8+wob,Y+TS);ctx.stroke();
      }
    });
  }
}
function boundaryCliffs(ctx,m){
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    const c=ch(m,x,y);if(!isCliff(c))continue;const X=x*TS,Y=y*TS;
    /* warmer readable cliff mass; preserve blocked geometry but stop presenting it as a black tile card */
    const g=ctx.createLinearGradient(X,Y,X,Y+TS);g.addColorStop(0,'#596448');g.addColorStop(.13,'#4b5b40');g.addColorStop(.48,'#3b4736');g.addColorStop(.76,'#303a30');g.addColorStop(1,'#26312b');ctx.fillStyle=g;ctx.fillRect(X,Y,TS,TS);
    ctx.fillStyle='rgba(137,166,88,.76)';ctx.fillRect(X,Y,TS,3);
    ctx.fillStyle='rgba(82,104,59,.58)';ctx.fillRect(X,Y+3,TS,3);
    ctx.strokeStyle='rgba(176,162,119,.24)';ctx.lineWidth=1;
    for(let i=0;i<4;i++){
      const px=X+5+h(x,y,540+i)*38,drop=18+h(x,y,550+i)*18;
      ctx.beginPath();ctx.moveTo(px,Y+9);ctx.lineTo(px-2,Y+drop*.58);ctx.lineTo(px+1,Y+drop);ctx.stroke();
    }
    ctx.strokeStyle='rgba(23,35,28,.28)';
    for(let i=0;i<2;i++){
      const yy=Y+19+i*14+Math.round((h(x,y,565+i)-.5)*4);
      ctx.beginPath();ctx.moveTo(X+5,yy);ctx.quadraticCurveTo(X+TS*.5,yy+3,X+TS-5,yy-1);ctx.stroke();
    }
    if(h(x,y,580)>.62){
      ctx.strokeStyle='rgba(132,157,87,.5)';ctx.beginPath();ctx.moveTo(X+9+h(x,y,581)*25,Y+4);ctx.lineTo(X+8+h(x,y,581)*25,Y+10);ctx.stroke();
    }
  }
}
function unifyCliffRuns(ctx,m){
  /* Draw geology across contiguous blocked runs so the eye reads one landform, not 48px cards. */
  ctx.lineCap='round';ctx.lineJoin='round';
  for(let y=0;y<m.h;y++){
    let start=-1;
    for(let x=0;x<=m.w;x++){
      const cliff=x<m.w&&isCliff(ch(m,x,y));
      if(cliff&&start<0)start=x;
      if((!cliff||x===m.w)&&start>=0){
        const end=x-1,count=end-start+1;
        if(count>=2){
          const X=start*TS,Y=y*TS,W=count*TS;
          const crest=Y+4+Math.round((h(start,end,610)-.5)*2);
          ctx.strokeStyle='rgba(151,178,95,.58)';ctx.lineWidth=2.2;
          ctx.beginPath();ctx.moveTo(X+2,crest);
          for(let i=1;i<=Math.max(3,count*2);i++){
            const px=X+(W-4)*(i/Math.max(3,count*2));
            const py=crest+(h(start+i,y,611)-.5)*3;
            ctx.lineTo(px,py);
          }
          ctx.stroke();
          for(let band=0;band<2;band++){
            const yy=Y+20+band*14+(h(start,y,620+band)-.5)*4;
            ctx.strokeStyle=band===0?'rgba(184,166,119,.20)':'rgba(19,31,26,.22)';ctx.lineWidth=1.2;
            ctx.beginPath();ctx.moveTo(X+5,yy);
            for(let i=1;i<=count*2;i++){
              const px=X+5+(W-10)*(i/(count*2));
              const py=yy+(h(start+i,y,630+band)-.5)*7;
              ctx.lineTo(px,py);
            }
            ctx.stroke();
          }
          /* soften internal tile boundaries without erasing readable rock texture */
          for(let sx=start+1;sx<=end;sx++){
            const seam=sx*TS;
            const grad=ctx.createLinearGradient(seam-4,0,seam+4,0);
            grad.addColorStop(0,'rgba(54,65,49,0)');grad.addColorStop(.5,'rgba(61,72,54,.34)');grad.addColorStop(1,'rgba(54,65,49,0)');
            ctx.fillStyle=grad;ctx.fillRect(seam-4,Y+7,8,TS-10);
          }
        }
        start=-1;
      }
    }
  }
  /* vertical neighbors get shared fractures/vines so stacked rows also read as one face */
  for(let y=1;y<m.h;y++)for(let x=0;x<m.w;x++)if(isCliff(ch(m,x,y))&&isCliff(ch(m,x,y-1))&&h(x,y,650)>.42){
    const X=x*TS,Y=y*TS;const px=X+9+h(x,y,651)*29;
    ctx.strokeStyle='rgba(116,141,82,.30)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(px,Y-5);ctx.bezierCurveTo(px+4,Y+4,px-5,Y+12,px+2,Y+22);ctx.stroke();
  }
}
function waterDetails(ctx,m){
  /* occasional rocks/grass islets only where water has enough neighboring water */
  for(let y=1;y<m.h-1;y++)for(let x=1;x<m.w-1;x++)if(isWater(ch(m,x,y))&&isWater(ch(m,x+1,y))&&isWater(ch(m,x-1,y))&&h(x,y,601)>.78){
    const X=x*TS,Y=y*TS;ctx.fillStyle='rgba(5,25,31,.34)';ctx.beginPath();ctx.ellipse(X+26,Y+32,12,5,0,0,Math.PI*2);ctx.fill();const g=ctx.createLinearGradient(X+17,Y+20,X+34,Y+33);g.addColorStop(0,'#8b927e');g.addColorStop(1,'#48534d');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(X+26,Y+26,9,6,-.2,0,Math.PI*2);ctx.fill();
  }
}
function refine(){
  if(s.screen!=='world'||s.map!=='field')return;const worldEl=app.querySelector('.lqReq149FieldCanvasWorld');const canvas=worldEl&&worldEl.querySelector('.lqReq149FieldCanvas');if(!canvas)return;
  if(canvas.dataset.req149V04c==='2')return;const ctx=canvas.getContext('2d',{alpha:false}),m=MAPS.field;
  repaintWater(ctx,m);banks(ctx,m);boundaryCliffs(ctx,m);unifyCliffRuns(ctx,m);waterDetails(ctx,m);canvas.dataset.req149V04c='2';
  document.body.dataset.req149FieldRenderer='canvas-prototype-c2';
}
const renderBase=render;render=function(){const r=renderBase();refine();return r};if(s.screen==='world')refine();
window.LQ_REQ149_V04C_STATUS={requirement:'REQ-149',stage:'FIELD-V04-PROTOTYPE-C2',presentationOnly:true,collisionChanged:false,broadRollout:false,continuousCliffRuns:true};
})();
