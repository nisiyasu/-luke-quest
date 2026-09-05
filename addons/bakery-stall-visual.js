(() => {
'use strict';

/* Collision-safe add-on: turns the bakery vendor into a readable physical street stall. */
const style=document.createElement('style');
style.textContent=`
.lqBakeryStall{position:absolute;z-index:3;width:142px;height:90px;transform:translate(-50%,-62%);pointer-events:none;filter:drop-shadow(0 7px 7px #0007)}
.lqBakeryStall .awning{position:absolute;left:0;right:0;top:0;height:27px;border:3px solid #70452d;border-radius:8px 8px 3px 3px;background:repeating-linear-gradient(90deg,#bd5f48 0 18px,#f0d19a 18px 36px);box-shadow:inset 0 -5px #6e3d2b38}
.lqBakeryStall .counter{position:absolute;left:12px;right:12px;bottom:4px;height:34px;border:3px solid #71482c;border-radius:5px;background:linear-gradient(#a87341,#6b452d);box-shadow:inset 0 7px #d39d5a42}
.lqBakeryStall .basket{position:absolute;bottom:32px;width:37px;height:20px;border:2px solid #79512f;border-radius:5px 5px 11px 11px;background:repeating-linear-gradient(90deg,#b88447 0 5px,#8e6337 5px 7px)}
.lqBakeryStall .basket.b1{left:23px}.lqBakeryStall .basket.b2{right:23px}.lqBakeryStall .basket:after{content:'';position:absolute;left:5px;right:5px;top:-8px;height:11px;border-radius:50%;background:radial-gradient(ellipse at 30% 60%,#e7b95f 0 25%,transparent 27%),radial-gradient(ellipse at 68% 55%,#dca84d 0 26%,transparent 28%)}
.lqBakeryStall .sign{position:absolute;right:-12px;top:28px;padding:3px 5px;border:2px solid #6e4529;border-radius:3px;background:#d5af69;color:#4b2b1f;font-size:8px;font-weight:950;transform:rotate(4deg);box-shadow:0 3px 4px #0005}
`;
document.head.appendChild(style);
function addBakeryStall(){
 if(s.screen!=='world'||s.map!=='town')return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqBakeryStall'))return;
 const vendor=currentNpcs().find(n=>n.name==='パン屋のトーマ');if(!vendor)return;
 const e=document.createElement('div');e.className='lqBakeryStall';e.style.left=`${vendor.x*TS+TS/2}px`;e.style.top=`${vendor.y*TS+TS/2}px`;e.innerHTML='<i class="awning"></i><i class="counter"></i><i class="basket b1"></i><i class="basket b2"></i><b class="sign">BAKERY</b>';w.appendChild(e);
}
const worldBase=world;world=function(){const r=worldBase();addBakeryStall();return r;};
const renderBase=render;render=function(){const r=renderBase();addBakeryStall();return r;};
if(s.screen==='world')addBakeryStall();
window.LQ_BAKERY_STALL_STATUS={physicalStall:true,vendor:'パン屋のトーマ',presentationOnly:true};
})();
