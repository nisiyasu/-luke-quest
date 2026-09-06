(() => {
'use strict';

/* REQ-120 Checkpoint H — Leon missing report, Luke's first mission, strong
   Chapter 1 handoff. Fresh Opening ends in the canonical existing town route.
   Existing progressed saves are never rewound. */

const SCREEN='openingMissionH';
const FG_DONE='lqOpeningFGDone';
const OPEN_FLAG='lqOpeningV1';
const H_DONE='lqOpeningComplete';
const STYLE_ID='lq-opening-h-style';
let h={step:0};

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqHStage{min-height:min(80vh,690px);border-radius:24px;overflow:hidden;position:relative;background:linear-gradient(180deg,#17283f,#08111f 58%,#03070d);border:1px solid #ffffff20;box-shadow:0 24px 64px #000c;padding:16px;display:flex;flex-direction:column;justify-content:center;gap:12px}
.lqHScene{position:relative;min-height:350px;border-radius:18px;overflow:hidden;border:1px solid #ffffff1c;background:radial-gradient(circle at 50% 34%,rgba(245,214,119,.14),transparent 26%),linear-gradient(180deg,#263b5d 0 68%,#5b5148 68%)}
.lqHTemplePeople{position:absolute;left:10%;right:10%;bottom:36px;display:flex;align-items:flex-end;justify-content:space-around;text-align:center}.lqHPerson .face{font-size:54px;filter:drop-shadow(0 7px 6px #0008)}.lqHPerson small{display:block;color:#e7dcc1}.lqHRunner{animation:lqRunnerIn .32s cubic-bezier(.18,.82,.32,1) 1}
.lqHCaption{background:#07111ff0;border:1px solid #ffffff22;border-radius:13px;padding:12px;line-height:1.72;white-space:pre-line;min-height:92px}
.lqHGate{min-height:390px;border-radius:18px;position:relative;overflow:hidden;background:linear-gradient(180deg,#55759a 0 42%,#82986e 42% 62%,#3b4f39 62%);border:1px solid #ffffff20;box-shadow:inset 0 -40px 65px #0005}.lqHGate::before{content:"";position:absolute;left:18%;right:18%;bottom:0;height:69%;background:linear-gradient(90deg,#56504a 0 10%,transparent 10% 90%,#56504a 90%);border-top:10px solid #726b61;box-shadow:0 -8px 20px #0004}.lqHForest{position:absolute;left:0;right:0;top:42%;text-align:center;font-size:42px;letter-spacing:-.08em;opacity:.86;filter:drop-shadow(0 9px 5px #0006)}.lqHLukeDepart{position:absolute;left:50%;bottom:48px;transform:translateX(-50%);font-size:62px;z-index:3;filter:drop-shadow(0 8px 6px #0009)}
.lqHChapter{position:absolute;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,rgba(3,7,13,.25),rgba(3,7,13,.78));pointer-events:none}.lqHChapterInner{padding:20px;text-shadow:0 6px 18px #000}.lqHChapter small{font-size:11px;letter-spacing:.3em;color:#d8c894;font-weight:900}.lqHChapter b{display:block;font-family:serif;font-size:clamp(30px,9vw,52px);letter-spacing:.08em;margin:10px 0}.lqHLogo{font-size:13px;letter-spacing:.22em;color:#f6d35b;font-weight:950}
@keyframes lqRunnerIn{from{transform:translateX(-8px);opacity:0}to{transform:translateX(0);opacity:1}}
@media(prefers-reduced-motion:reduce){.lqHRunner{animation:none!important}}
`;
  document.head.appendChild(st);
}

const scenes=[
  {kind:'temple',text:'神殿の扉が勢いよく開く。\n\n兵士「報告！　レオン様が王都を出た形跡を確認！」'},
  {kind:'temple',text:'兵士「北東方面。魔物の森へ向かったものと思われます。」\n\nざわめきが、さっきとは別の意味で広がっていく。'},
  {kind:'temple',text:'王の使者「勇者ルーク。最初の任務を命ずる。」\n「レオンを捜し、無事に王都へ連れ戻せ。」'},
  {kind:'temple',text:'ルーク「……今日から魔王討伐じゃないんですね。」\n\n王の使者「まずは人を一人、連れて帰ってこい。」'},
  {kind:'temple',text:'ルーク「勇者って、人探しもするんですね……。」\n\n王の使者「する。今日からは。」'},
  {kind:'gate',text:'王都北門。\n遠くには、魔物の森。\n\nルーク「レオンを連れ戻したら、勇者も返せたりしませんかね。」'},
  {kind:'chapter',text:'第一章\n逃げた勇者候補'}
];

function templeScene(text){return `<div class=lqHScene><div class=lqHTemplePeople><div class="lqHPerson lqHRunner"><div class=face>🏃‍♂️</div><small>王都兵</small></div><div class=lqHPerson><div class=face>🧑‍🦱</div><small>ルーク</small></div><div class=lqHPerson><div class=face>🧙‍♂️</div><small>王の使者</small></div><div class=lqHPerson><div class=face>👩‍🦳</div><small>エレノア</small></div></div></div><div class=lqHCaption>${text}</div>`;}
function gateScene(text,chapter=false){return `<div class=lqHGate><div class=lqHForest>🌲🌲🌲🌲🌲</div><div class=lqHLukeDepart>🧑‍🦱</div>${chapter?`<div class=lqHChapter><div class=lqHChapterInner><small>CHAPTER I</small><b>逃げた勇者候補</b><div class=lqHLogo>LUKE QUEST</div></div></div>`:''}</div><div class=lqHCaption>${text}</div>`;}
function renderH(){
  injectStyle();document.body.classList.remove('lqOpeningMorning');
  const sc=scenes[Math.min(h.step,scenes.length-1)];
  const content=sc.kind==='temple'?templeScene(sc.text):gateScene(sc.text,sc.kind==='chapter');
  app.innerHTML=`<div class=lqHStage>${content}<button class="btn gold" onclick="lqHNext()">${h.step===scenes.length-1?'第一章を始める':'つづける'}</button></div>`;
}
function startH(){stopMoving();h={step:0};s.screen=SCREEN;s.flags=s.flags||{};s.flags.lqOpeningHStarted=true;render();}
function finishOpening(){
  s.flags=s.flags||{};s.flags[H_DONE]=true;s.flags[OPEN_FLAG]='complete';s.flags.lqOpeningHStarted=false;
  s.screen='world';s.step=0;s.map='town';s.x=9;s.y=12;s.dir='up';encounterGrace=0;
  s.dialog={name:'冒険メモ',text:'最初の任務：王都を出て、北東の魔物の森へ向かったレオンを捜す。\nルーク「まずは王都の南門から近郊へ、ですね。」'};
  render();
}
window.lqHNext=function(){if(s.screen!==SCREEN)return;if(h.step<scenes.length-1){h.step++;render();return;}finishOpening();};

injectStyle();
const baseRender=render;
render=function(){
  if(s.screen===SCREEN){stopMoving();save();renderH();return;}
  if(s.screen==='intro'&&s.step===7&&s.flags?.[FG_DONE]&&!s.flags?.[H_DONE]){startH();return;}
  return baseRender.apply(this,arguments);
};

const baseOpenMenu=openMenu;
openMenu=function(){
  if(s.screen==='world'&&s.flags?.[H_DONE]&&s.map==='town'&&!s.flags?.leonSeen){
    stopMoving();s.dialog={name:'第一章・冒険メモ',text:'目的：魔物の森へ向かったレオンを捜し、王都へ連れ戻す。\n現在地：王都アルディア\n次：南門から王都近郊へ出る。'};render();return;
  }
  return baseOpenMenu.apply(this,arguments);
};

function smoke(){
  if(typeof s==='undefined')return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};const raw=localStorage.getItem('lukeQuestV2');
  try{
    s.flags={...(s.flags||{}),[FG_DONE]:true,[H_DONE]:false};s.screen='intro';s.step=7;render();
    if(s.screen!==SCREEN)throw new Error('H interception failed');
    let mission=false,searchLine=false,chapter=false;
    for(let i=0;i<scenes.length;i++){
      const txt=scenes[Math.min(h.step,scenes.length-1)].text;
      if(txt.includes('最初の任務'))mission=true;if(txt.includes('人探し'))searchLine=true;if(txt.includes('第一章'))chapter=true;
      window.lqHNext();
    }
    if(!mission||!searchLine||!chapter)throw new Error('required H beats missing');
    if(!s.flags[H_DONE]||s.flags[OPEN_FLAG]!=='complete')throw new Error('opening completion flags missing');
    if(s.screen!=='world'||s.map!=='town'||s.x!==9||s.y!==12)throw new Error('Chapter 1 handoff invalid');
    if(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction!==true)throw new Error('tap authority missing');
    const marker=document.createElement('i');marker.className='lqReq120HSmokeMarker';marker.hidden=true;marker.dataset.leonMissing='true';marker.dataset.firstMission='true';marker.dataset.chapterOne='true';marker.dataset.worldHandoff='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;s.dialog=before.dialog;s.flags=before.flags;h={step:0};
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();
  }
}
window.LQ_REQ120_OPENING_H_STATUS={requirement:'REQ-120',checkpoint:'H',leonMissing:true,firstMission:true,chapterOneTitle:true,existingWorldHandoff:true,openingCompleteFlag:H_DONE,legacyIntroFreshPathBypassed:true,chapter2Invented:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_H_TEST={smoke,startH,finishOpening};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
