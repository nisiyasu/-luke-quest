(() => {
'use strict';

/* REQ-120 Checkpoint F+G — abnormal hero-crystal reaction + Luke selected.
   Intercepts the temporary legacy intro bridge after D+E and replaces it with
   a dedicated cinematic. Motion is restrained and reduced-motion safe. */

const SCREEN='openingCrystalFG';
const DE_DONE='lqOpeningDEDone';
const FG_DONE='lqOpeningFGDone';
const STYLE_ID='lq-opening-fg-style';
let fg={step:0};

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqFGStage{min-height:min(80vh,690px);border-radius:24px;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 35%,#243653 0,#101828 46%,#04070d 100%);border:1px solid #ffffff20;box-shadow:0 24px 64px #000c;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:16px}
.lqFGTemple{position:relative;min-height:380px;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#283f68 0 68%,#5e554b 68%);border:1px solid #ffe5a635;box-shadow:inset 0 -26px 60px #0006}
.lqFGTemple::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 30%,var(--lq-crystal-glow,rgba(130,190,255,.12)),transparent 35%);transition:background .32s ease}
.lqFGCrystal{position:absolute;z-index:4;left:50%;top:48px;transform:translateX(-50%);font-size:88px;filter:drop-shadow(0 0 12px #8bc6ff88);transition:filter .28s ease,transform .28s ease,opacity .28s ease}
.lqFGLuke{position:absolute;z-index:3;left:50%;bottom:48px;transform:translateX(-50%);font-size:62px;filter:drop-shadow(0 8px 6px #0009)}
.lqFGEleanor{position:absolute;z-index:3;right:9%;bottom:46px;text-align:center}.lqFGEleanor .face{font-size:54px}.lqFGPriest{position:absolute;z-index:3;left:10%;bottom:46px;text-align:center}.lqFGPriest .face{font-size:50px}.lqFGCrowd{position:absolute;left:8%;right:8%;bottom:8px;text-align:center;font-size:16px;letter-spacing:.22em;opacity:.56}
.lqFGCaption{background:#07111ff0;border:1px solid #ffffff22;border-radius:13px;padding:12px;line-height:1.72;white-space:pre-line;min-height:88px}
.lqFGPause .lqFGCrystal{filter:drop-shadow(0 0 2px #5c789955);opacity:.82}
.lqFGWhite{--lq-crystal-glow:rgba(255,255,255,.48)}.lqFGWhite .lqFGCrystal{filter:drop-shadow(0 0 24px #fff) drop-shadow(0 0 44px #dff6ff);transform:translateX(-50%) scale(1.05)}
.lqFGBlue{--lq-crystal-glow:rgba(92,181,255,.52)}.lqFGBlue .lqFGCrystal{filter:drop-shadow(0 0 24px #62b7ff) drop-shadow(0 0 52px #247cff);transform:translateX(-50%) scale(1.08)}
.lqFGGold{--lq-crystal-glow:rgba(255,218,105,.55)}.lqFGGold .lqFGCrystal{filter:drop-shadow(0 0 22px #fff0a5) drop-shadow(0 0 50px #ffbe3b);transform:translateX(-50%) scale(1.1)}
.lqFGDark{--lq-crystal-glow:rgba(92,42,120,.22)}.lqFGDark .lqFGCrystal{filter:drop-shadow(0 0 13px #7a3a9f) drop-shadow(0 0 20px #172136);transform:translateX(-50%) scale(.99)}
.lqFGShock .lqFGEleanor{animation:lqEleanorShock .28s ease-out 1}.lqFGFinal .lqFGCrystal{filter:drop-shadow(0 0 18px #c7e9ff) drop-shadow(0 0 28px #f6d35b)}
@keyframes lqEleanorShock{0%{transform:translateY(0)}45%{transform:translateY(-3px)}100%{transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.lqFGCrystal,.lqFGTemple::after{transition:none!important}.lqFGShock .lqFGEleanor{animation:none!important}}
`;
  document.head.appendChild(st);
}

const scenes=[
  {cls:'lqFGPause',text:'ルークが水晶へ手を置く。\n\n…………。'},
  {cls:'lqFGPause',text:'何も起きない。\n\nルーク「ほら、やっぱり僕じゃ――」'},
  {cls:'lqFGWhite',text:'その瞬間。\n大神殿が、昼よりも白い光に飲み込まれた。'},
  {cls:'lqFGBlue',text:'白は蒼へ。\n蒼い光が水晶の奥から何層にも押し寄せる。'},
  {cls:'lqFGGold',text:'さらに金の光が重なる。\n普通の「選定」と呼ぶには、あまりにも大きすぎる反応だった。'},
  {cls:'lqFGDark',text:'ほんの一瞬だけ。\n光の中心を、説明できない暗い脈動が横切った。'},
  {cls:'lqFGGold lqFGShock',text:'エレノアの微笑みが消える。\n神官も、言葉を失って水晶を見上げた。'},
  {cls:'lqFGFinal',text:'神官「……勇者。ルーク。」'},
  {cls:'lqFGFinal',text:'ルーク「……え、僕ですか？」'},
  {cls:'lqFGFinal',text:'張りつめていた大神殿に、妙な沈黙が落ちる。\n\nエレノア「おめでとうございます。勇者ルーク。」'},
  {cls:'lqFGFinal',text:'誰にも見えない角度で、エレノアは水晶を見つめた。\n\nエレノア「……なぜ？」'}
];

function renderFG(){
  injectStyle();document.body.classList.remove('lqOpeningMorning');
  const sc=scenes[Math.min(fg.step,scenes.length-1)];
  app.innerHTML=`<div class="lqFGStage ${sc.cls}"><div class=lqFGTemple><div class=lqFGCrystal>🔷</div><div class=lqFGPriest><div class=face>🧙‍♂️</div><div>大神官</div></div><div class=lqFGLuke>🧑‍🦱</div><div class=lqFGEleanor><div class=face>👩‍🦳</div><div>エレノア</div></div><div class=lqFGCrowd>👤 👤 👤 👤 👤</div></div><div class=lqFGCaption>${sc.text}</div><button class="btn gold" onclick="lqFGNext()">${fg.step===scenes.length-1?'式の続きを見る':'つづける'}</button></div>`;
}
function startFG(){stopMoving();fg={step:0};s.screen=SCREEN;s.flags=s.flags||{};s.flags.lqOpeningFGStarted=true;render();}
window.lqFGNext=function(){
  if(s.screen!==SCREEN)return;
  if(fg.step<scenes.length-1){fg.step++;render();return;}
  s.flags=s.flags||{};s.flags[FG_DONE]=true;s.flags.lqOpeningFGStarted=false;
  s.screen='intro';s.step=7;s.map='town';s.x=9;s.y=12;render();
};

injectStyle();
const baseRender=render;
render=function(){
  if(s.screen===SCREEN){stopMoving();save();renderFG();return;}
  if(s.screen==='intro'&&s.step===3&&s.flags?.[DE_DONE]&&!s.flags?.[FG_DONE]){startFG();return;}
  return baseRender.apply(this,arguments);
};

function smoke(){
  if(typeof s==='undefined')return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};const raw=localStorage.getItem('lukeQuestV2');
  try{
    s.flags={...(s.flags||{}),[DE_DONE]:true,[FG_DONE]:false};s.screen='intro';s.step=3;render();
    if(s.screen!==SCREEN||!document.querySelector('.lqFGCrystal'))throw new Error('FG interception failed');
    let sawDark=false,sawLuke=false,sawWhy=false;
    for(let i=0;i<scenes.length;i++){
      const txt=scenes[Math.min(fg.step,scenes.length-1)].text;
      if(txt.includes('暗い脈動'))sawDark=true;if(txt.includes('え、僕ですか'))sawLuke=true;if(txt.includes('……なぜ？'))sawWhy=true;
      window.lqFGNext();
    }
    if(!sawDark||!sawLuke||!sawWhy)throw new Error('required crystal beats missing');
    if(!s.flags[FG_DONE]||s.screen!=='intro'||s.step!==7)throw new Error('H bridge invalid');
    const marker=document.createElement('i');marker.className='lqReq120FGSmokeMarker';marker.hidden=true;marker.dataset.abnormalCrystal='true';marker.dataset.darkPulse='true';marker.dataset.lukeSelected='true';marker.dataset.eleanorWhy='true';marker.dataset.reducedMotion='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;s.dialog=before.dialog;s.flags=before.flags;fg={step:0};
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();
  }
}
window.LQ_REQ120_OPENING_FG_STATUS={requirement:'REQ-120',checkpoint:'F+G',abnormalCrystal:true,whiteBlueGold:true,subtleDarkPulse:true,reducedMotionSafe:true,lukeSelected:true,eleanorPublicBenevolent:true,protectedReveal:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_FG_TEST={smoke,startFG};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
