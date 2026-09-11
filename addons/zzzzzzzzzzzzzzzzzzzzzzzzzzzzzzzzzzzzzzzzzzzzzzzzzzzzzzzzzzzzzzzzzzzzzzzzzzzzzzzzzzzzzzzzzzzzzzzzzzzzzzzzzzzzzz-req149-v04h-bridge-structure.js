(() => {
'use strict';

/*
 * REQ-149 FIELD-V04 prototype H — structural bridge pass.
 * Presentation only. This late Canvas pass adds deck thickness, rail/posts,
 * directional highlights and stone abutments to the existing field bridge.
 * MAPS / collision / move / action / save / story remain canonical.
 */

const STATUS={
  requirement:'REQ-149',
  stage:'FIELD-V04-PROTOTYPE-H',
  presentationOnly:true,
  bridgeStructure:true,
  collisionChanged:false,
  inputAuthorityChanged:false,
  saveAuthorityChanged:false,
  storyAuthorityChanged:false,
  broadRollout:false
};

function roundedPath(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);ctx.lineTo(x+w-rr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+rr);
  ctx.lineTo(x+w,y+h-rr);ctx.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);
  ctx.lineTo(x+rr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-rr);
  ctx.lineTo(x,y+rr);ctx.quadraticCurveTo(x,y,x+rr,y);ctx.closePath();
}

function beam(ctx,x1,y1,x2,y2,width,light=false){
  ctx.lineCap='round';
  ctx.strokeStyle=light?'rgba(228,187,116,.82)':'rgba(58,35,22,.96)';
  ctx.lineWidth=width;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
}

function post(ctx,x,y,scale=1){
  const w=8*scale,h=16*scale;
  ctx.fillStyle='rgba(25,18,13,.34)';
  ctx.beginPath();ctx.ellipse(x+2,y+h+3,7*scale,3*scale,0,0,Math.PI*2);ctx.fill();
  const g=ctx.createLinearGradient(x-w/2,y,x+w/2,y);
  g.addColorStop(0,'#4b3020');g.addColorStop(.28,'#795136');g.addColorStop(.55,'#a17247');g.addColorStop(1,'#4a2f20');
  ctx.fillStyle=g;roundedPath(ctx,x-w/2,y,w,h,2.5*scale);ctx.fill();
  ctx.fillStyle='#d1a36a';ctx.fillRect(x-w*.35,y+2,w*.26,h-5);
  ctx.fillStyle='#3d271a';ctx.beginPath();ctx.ellipse(x,y,w*.62,w*.30,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#b98654';ctx.beginPath();ctx.ellipse(x-1,y-1,w*.35,w*.15,0,0,Math.PI*2);ctx.fill();
}

function bridgeSegment(ctx,x,y,w,h,deg){
  const TS=window.TS||48;
  const X=x*TS,Y=y*TS,W=w*TS,H=h*TS;
  const horizontal=W>=H;
  ctx.save();
  ctx.translate(X+W/2,Y+H/2);ctx.rotate(deg*Math.PI/180);ctx.translate(-W/2,-H/2);

  /* underside / side thickness */
  ctx.fillStyle='rgba(35,23,16,.74)';
  if(horizontal){
    roundedPath(ctx,3,H-7,W-6,12,3);ctx.fill();
    ctx.fillStyle='rgba(94,58,35,.92)';ctx.fillRect(7,H-4,W-14,5);
  }else{
    roundedPath(ctx,W-7,3,12,H-6,3);ctx.fill();
    ctx.fillStyle='rgba(94,58,35,.92)';ctx.fillRect(W-4,7,5,H-14);
  }

  /* board-by-board warm directional highlights and grain */
  const len=horizontal?W:H;
  for(let p=10;p<len-7;p+=12){
    ctx.strokeStyle='rgba(237,194,116,.28)';ctx.lineWidth=1;
    ctx.beginPath();
    if(horizontal){ctx.moveTo(p+1,8);ctx.lineTo(p+1,H-9)}
    else{ctx.moveTo(8,p+1);ctx.lineTo(W-9,p+1)}
    ctx.stroke();
  }
  ctx.strokeStyle='rgba(66,39,24,.34)';ctx.lineWidth=1;
  for(let i=0;i<5;i++){
    const q=(i+1)/6;
    ctx.beginPath();
    if(horizontal){ctx.moveTo(W*q,11);ctx.quadraticCurveTo(W*q+6,H*.48,W*q-2,H-12)}
    else{ctx.moveTo(11,H*q);ctx.quadraticCurveTo(W*.48,H*q+6,W-12,H*q-2)}
    ctx.stroke();
  }

  /* rails: dark body + sun-facing highlight */
  if(horizontal){
    beam(ctx,6,5,W-6,5,5,false);beam(ctx,7,4,W-7,4,1.4,true);
    beam(ctx,6,H-5,W-6,H-5,5,false);beam(ctx,7,H-6,W-7,H-6,1.1,true);
    for(let p=10;p<W-5;p+=36){post(ctx,p,-2,.85);post(ctx,p,H-12,.85)}
  }else{
    beam(ctx,5,6,5,H-6,5,false);beam(ctx,4,7,4,H-7,1.4,true);
    beam(ctx,W-5,6,W-5,H-6,5,false);beam(ctx,W-6,7,W-6,H-7,1.1,true);
    for(let p=10;p<H-5;p+=36){post(ctx,-2,p,.85);post(ctx,W-12,p,.85)}
  }

  /* structural cross braces at long spans */
  if(horizontal&&W>180){
    ctx.strokeStyle='rgba(62,39,25,.56)';ctx.lineWidth=2;
    for(let p=28;p<W-45;p+=64){ctx.beginPath();ctx.moveTo(p,H-8);ctx.lineTo(p+34,H-1);ctx.stroke()}
  }
  if(!horizontal&&H>180){
    ctx.strokeStyle='rgba(62,39,25,.56)';ctx.lineWidth=2;
    for(let p=28;p<H-45;p+=64){ctx.beginPath();ctx.moveTo(W-8,p);ctx.lineTo(W-1,p+34);ctx.stroke()}
  }
  ctx.restore();
}

function stoneAbutment(ctx,x,y,w,h,deg=0){
  const TS=window.TS||48;
  ctx.save();ctx.translate(x*TS+w*TS/2,y*TS+h*TS/2);ctx.rotate(deg*Math.PI/180);ctx.translate(-w*TS/2,-h*TS/2);
  const W=w*TS,H=h*TS;
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(181,175,143,.94)');g.addColorStop(.45,'rgba(126,128,111,.96)');g.addColorStop(1,'rgba(68,76,69,.98)');
  ctx.fillStyle=g;roundedPath(ctx,0,0,W,H,4);ctx.fill();
  ctx.strokeStyle='rgba(48,55,49,.55)';ctx.lineWidth=1.2;
  for(let yy=8;yy<H;yy+=9){ctx.beginPath();ctx.moveTo(3,yy);ctx.lineTo(W-3,yy);ctx.stroke()}
  for(let xx=11;xx<W;xx+=15){ctx.beginPath();ctx.moveTo(xx,2);ctx.lineTo(xx+(xx%2?3:-2),H-2);ctx.stroke()}
  ctx.strokeStyle='rgba(229,218,174,.48)';ctx.beginPath();ctx.moveTo(3,3);ctx.lineTo(W-3,3);ctx.stroke();
  ctx.restore();
}

function paintBridgeStructure(canvas){
  if(!canvas||canvas.dataset.req149BridgeStructure==='v04h')return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.save();
  /* Re-articulate the same authored bridge geometry, without changing passability. */
  bridgeSegment(ctx,9.15,15.0,3.6,.55,0);
  bridgeSegment(ctx,9.25,9.85,2.75,6.0,0);
  bridgeSegment(ctx,10.35,7.85,7.3,2.0,-8);
  bridgeSegment(ctx,16.05,3.25,2.05,5.6,-28);
  bridgeSegment(ctx,18.15,.75,2.15,3.6,-38);
  /* Stone landings visually anchor the principal north-south bridge to terrain. */
  stoneAbutment(ctx,9.45,15.45,2.35,.34,0);
  stoneAbutment(ctx,9.45,9.66,2.35,.34,0);
  ctx.restore();
  canvas.dataset.req149BridgeStructure='v04h';
  document.body.dataset.req149BridgeStructure='v04h';
}

function apply(){
  if(typeof s==='undefined'||!s||s.screen!=='world'||s.map!=='field')return;
  const canvas=document.querySelector('.lqReq149FieldCanvasWorld>.lqReq149FieldCanvas');
  paintBridgeStructure(canvas);
}

const prevRender=window.render;
if(typeof prevRender==='function'){
  window.render=function(){const out=prevRender.apply(this,arguments);apply();return out};
}
apply();
window.LQ_REQ149_V04H_STATUS=STATUS;
})();
