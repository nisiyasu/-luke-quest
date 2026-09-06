(() => {
'use strict';

/* REQ-120 Checkpoint A+B
   High-quality cold open + playable Aldia hero-selection morning.
   Existing saves are not rewound. Fresh NEW GAME enters this prologue.
   Canonical world movement / Tap Anywhere / Dynamic Touch remain authoritative. */

const OPEN_MAP='openingAldia';
const OPEN_FLAG='lqOpeningV1';
const STYLE_ID='lq-opening-prologue-ab-style';

function ensureOpeningMap(){
  if(typeof MAPS==='undefined'||!MAPS.town||MAPS[OPEN_MAP])return;
  const rows=MAPS.town.tiles.slice();
  const top=rows[0].split('');
  top[8]='G';top[9]='G';
  rows[0]=top.join('');
  const bottom=rows[rows.length-1].split('');
  bottom[8]='#';bottom[9]='#';
  rows[rows.length-1]=bottom.join('');
  MAPS[OPEN_MAP]={
    name:'王都アルディア・勇者選定祭',w:MAPS.town.w,h:MAPS.town.h,tiles:rows,
    npcs:[
      {x:4,y:6,e:'👴',name:'祭りを見に来た老人',text:'今日は勇者選定の日だ。まあ、水晶に選ばれるのはレオン様で決まりだろう。あれほど鍛えてきた若者はいない。'},
      {x:13,y:11,e:'👩',name:'花飾りの商人',text:'エレノア様ったら昔から「私は勇者を生んだのです」って、それはもう堂々と。今日は王都じゅうが答え合わせの日ね。'},
      {x:6,y:10,e:'🧑‍🎓',name:'学院の後輩',text:'ルーク先輩！？　まだここにいたんですか？　候補者はもう大神殿へ向かってますよ！'},
      {x:12,y:5,e:'🧑‍⚕️',name:'神殿の見習い',text:'北の大神殿へどうぞ。候補者の受付は鐘が三度鳴るまでです。……もう二度鳴りましたけど。'},
      {x:3,y:11,e:'🎏',name:'勇者祭の旗飾り',text:'金糸で「新たな勇者の誕生を祝う」と縫われている。王都全体が、もう結果を知っているみたいだ。'},
      {x:14,y:6,e:'🏆',name:'学院の記念掲示',text:'今年の学院記録が並んでいる。レオンの名前は上位欄に何度もある。ルークの名前は……模擬戦の欄にだけ妙に目立っている。'}
    ]
  };
}

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqOpeningStage{min-height:min(78vh,680px);border-radius:22px;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 38%,#193657 0,#0a1728 43%,#03070d 100%);border:1px solid #ffffff20;box-shadow:0 22px 60px #000b;display:flex;align-items:center;justify-content:center;padding:22px;text-align:center}
.lqOpeningStage::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,211,91,.08),transparent 30%,rgba(0,0,0,.35));}
.lqOpeningInner{position:relative;z-index:1;max-width:560px;width:100%}
.lqOpeningKicker{font-size:11px;letter-spacing:.28em;color:#d9c58c;font-weight:900;margin-bottom:16px}
.lqOpeningTheme{font-family:serif;font-weight:900;font-size:clamp(27px,8vw,46px);letter-spacing:.12em;text-shadow:0 4px 22px #000;margin:10px 0 18px}
.lqOpeningBell{font-size:42px;filter:drop-shadow(0 7px 10px #0008);animation:lqBellBreathe 2.8s ease-in-out infinite}
.lqOpeningCity{font-size:64px;margin:8px 0;filter:drop-shadow(0 10px 12px #0009)}
.lqOpeningText{font-size:15px;line-height:1.85;color:#f7edd2;white-space:pre-line;text-shadow:0 2px 8px #000}
.lqOpeningLuke{font-size:70px;margin:4px 0 10px;filter:drop-shadow(0 8px 12px #0009)}
.lqOpeningBtn{margin-top:22px;position:relative}
body.lqOpeningMorning .gameShell::after{content:"勇者選定祭";position:absolute;left:50%;top:46px;transform:translateX(-50%);z-index:18;padding:5px 11px;border:1px solid rgba(246,211,91,.38);border-radius:999px;background:rgba(69,35,10,.72);color:#ffe79c;font-size:11px;font-weight:950;letter-spacing:.08em;pointer-events:none;box-shadow:0 5px 18px #0007}
body.lqOpeningMorning .world::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 20%,rgba(255,220,124,.08),transparent 20%),radial-gradient(circle at 78% 35%,rgba(255,239,179,.06),transparent 18%);z-index:1}
body.lqOpeningMorning .chip{border-color:rgba(246,211,91,.32);box-shadow:0 4px 12px #0006}
@keyframes lqBellBreathe{0%,100%{transform:translateY(0);opacity:.88}50%{transform:translateY(-2px);opacity:1}}
@media(prefers-reduced-motion:reduce){.lqOpeningBell{animation:none}}
`;
  document.head.appendChild(st);
}

function openingStep(){return Number.isInteger(s.step)?s.step:0;}
function renderOpening(){
  injectStyle();
  document.body.classList.remove('lqOpeningMorning');
  const step=openingStep();
  let html='';
  if(step===0){
    html=`<div class=lqOpeningStage><div class=lqOpeningInner><div class=lqOpeningBell>🔔</div><div class=lqOpeningTheme>勇者は、選ばれる。</div><div class=lqOpeningText>遠くで、王都の朝を告げる鐘が鳴る。</div><button class="btn gold lqOpeningBtn" onclick="lqOpeningNext()">鐘の音を追う</button></div></div>`;
  }else if(step===1){
    html=`<div class=lqOpeningStage><div class=lqOpeningInner><div class=lqOpeningKicker>ALDIA • HERO SELECTION DAY</div><div class=lqOpeningCity>🏰 ✦ 🎏</div><div class=lqOpeningTheme style="font-size:clamp(24px,7vw,38px)">王都アルディア</div><div class=lqOpeningText>通りには金の旗。大神殿へ向かう人波。\n誰もが今日、「勇者レオン」が生まれると思っている。</div><button class="btn gold lqOpeningBtn" onclick="lqOpeningNext()">朝の王都へ</button></div></div>`;
  }else{
    html=`<div class=lqOpeningStage><div class=lqOpeningInner><div class=lqOpeningLuke>🧑‍🦱💤</div><div class=lqOpeningKicker>LUKE</div><div class=lqOpeningText>「……今日でしたっけ、勇者選定。」\n\n窓の外で三度目の鐘を待つ人々。\nルークはようやく、自分も候補者だったことを思い出した。</div><button class="btn gold lqOpeningBtn" onclick="lqOpeningNext()">とりあえず大神殿へ</button></div></div>`;
  }
  app.innerHTML=html;
}

function enterPlayableMorning(){
  ensureOpeningMap();
  s.screen='world';s.map=OPEN_MAP;s.x=9;s.y=13;s.dir='up';s.step=0;
  s.flags=s.flags||{};s.flags[OPEN_FLAG]='walk';
  encounterGrace=0;
  s.dialog={name:'ルーク',text:'「僕も候補なんですか……？」\nとにかく北の大神殿へ向かおう。町の人に聞けば、たぶん間に合う。'};
  render();
}

window.lqOpeningNext=function(){
  if(s.screen!=='opening')return;
  const step=openingStep();
  if(step<2){s.step=step+1;render();return;}
  enterPlayableMorning();
};

ensureOpeningMap();injectStyle();

const baseRender=render;
render=function(){
  if(s.screen==='opening'){
    stopMoving();save();renderOpening();return;
  }
  document.body.classList.toggle('lqOpeningMorning',s.screen==='world'&&s.map===OPEN_MAP);
  return baseRender.apply(this,arguments);
};

const baseNewGame=newGame;
newGame=function(){
  stopMoving();
  localStorage.removeItem('lukeQuestV2');
  s=structuredClone(DEFAULT);s.flags=s.flags||{};s.flags[OPEN_FLAG]='cold';
  s.screen='opening';s.step=0;encounterGrace=0;
  render();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.screen==='world'&&s.map===OPEN_MAP){
    const m=MAPS[OPEN_MAP],c=(m.tiles[s.y]||'')[s.x];
    if(c==='G'&&s.y===0){
      stopMoving();
      s.flags=s.flags||{};s.flags[OPEN_FLAG]='ab-complete';
      s.screen='intro';s.step=0;s.map='town';s.x=9;s.y=12;
      render();return;
    }
    return;
  }
  return baseCheckGate.apply(this,arguments);
};

const baseOpenMenu=openMenu;
openMenu=function(){
  if(s.screen==='world'&&s.map===OPEN_MAP){
    stopMoving();
    s.dialog={name:'今日の予定',text:'目的：北の大神殿で勇者選定に参加する。\nルーク「本命はレオンですし、僕は受付だけして帰れると思います。」'};
    render();return;
  }
  return baseOpenMenu.apply(this,arguments);
};

function smoke(){
  if(typeof s==='undefined'||typeof MAPS==='undefined')return;
  ensureOpeningMap();
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  const raw=localStorage.getItem('lukeQuestV2');
  try{
    s.screen='opening';s.step=0;s.flags=s.flags||{};s.flags[OPEN_FLAG]='cold';render();
    if(!document.querySelector('.lqOpeningTheme'))throw new Error('cold open missing');
    s.step=2;render();
    if(!document.querySelector('.lqOpeningLuke'))throw new Error('Luke intro missing');
    enterPlayableMorning();
    if(s.map!==OPEN_MAP||s.screen!=='world')throw new Error('playable morning not entered');
    if(!MAPS[OPEN_MAP]?.npcs?.some(n=>String(n.text).includes('レオン')))throw new Error('Leon public expectation missing');
    if(!MAPS[OPEN_MAP]?.npcs?.some(n=>String(n.text).includes('エレノア')))throw new Error('Eleanor public reputation missing');
    if(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction!==true)throw new Error('Tap Anywhere authority missing');
    if(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary!==true)throw new Error('fullscreen authority missing');
    const marker=document.createElement('i');marker.className='lqReq120ABSmokeMarker';marker.hidden=true;marker.dataset.coldOpen='true';marker.dataset.playableMorning='true';marker.dataset.canonSafe='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;s.dialog=before.dialog;s.flags=before.flags;
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);
    render();
  }
}

window.LQ_REQ120_OPENING_AB_STATUS={requirement:'REQ-120',checkpoint:'A+B',coldOpen:true,playableAldiaMorning:true,canonicalWorldInput:true,legacyCeremonyBridge:true,existingSaveRewind:false,chapter2Invented:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_AB_TEST={smoke,ensureOpeningMap};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
