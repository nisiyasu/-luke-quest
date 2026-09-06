(() => {
'use strict';

/* REQ-040: read-only EXP visibility. Canonical s.xp / s.nx / win() remain untouched. */
const STYLE_ID='lq-exp-progress-style';
if(!document.getElementById(STYLE_ID)){
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.lqExpProgress{min-width:86px;max-width:118px;pointer-events:none;display:flex;flex-direction:column;gap:3px;justify-content:center;padding:0 2px}
.lqExpProgressText{display:flex;align-items:baseline;justify-content:space-between;gap:5px;font-size:10px;line-height:1.05;color:#d7e9f6;white-space:nowrap}
.lqExpProgressText b{font-size:11px;color:#f7fbff;font-variant-numeric:tabular-nums}
.lqExpProgressTrack{height:4px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.lqExpProgressFill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#5bb8ff,#a9e1ff);transform-origin:left center}
@media(max-width:430px){.lqExpProgress{min-width:72px;max-width:92px}.lqExpProgressText{font-size:9px}.lqExpProgressText b{font-size:10px}}
`;
  document.head.appendChild(style);
}

function normalized(xp,nx){
  const current=Math.max(0,Number.isFinite(Number(xp))?Number(xp):0);
  const threshold=Math.max(1,Number.isFinite(Number(nx))?Number(nx):1);
  const shown=Math.min(current,threshold);
  const percent=Math.max(0,Math.min(100,(shown/threshold)*100));
  return {current,threshold,shown,percent};
}
function markup(xp,nx){
  const p=normalized(xp,nx);
  const pct=p.percent.toFixed(2).replace(/\.00$/,'');
  return `<div class="lqExpProgress" aria-label="EXP ${p.shown}/${p.threshold}" data-exp-current="${p.shown}" data-exp-next="${p.threshold}" data-exp-percent="${pct}"><div class="lqExpProgressText"><span>EXP</span><b>${p.shown}/${p.threshold}</b></div><div class="lqExpProgressTrack" aria-hidden="true"><div class="lqExpProgressFill" style="width:${pct}%"></div></div></div>`;
}

const statusExpBase=status;
status=function(...args){
  const base=statusExpBase.apply(this,args);
  const insert=markup(s?.xp,s?.nx);
  const close='</div></div>';
  const at=base.lastIndexOf(close);
  if(at<0)return base+insert;
  return base.slice(0,at)+insert+base.slice(at);
};

window.LQ_EXP_PROGRESS_STATUS={
  presentationOnly:true,
  canonicalSource:['s.xp','s.nx'],
  saveMutation:false,
  pointerSafe:true,
  fullscreenLayer:false,
  normalize:normalized,
  sampleMarkup:markup,
  read(){return normalized(s?.xp,s?.nx);}
};
})();