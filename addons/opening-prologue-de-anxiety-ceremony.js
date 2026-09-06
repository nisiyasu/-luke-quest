(() => {
'use strict';

/* REQ-120 Checkpoint D+E — Leon private anxiety + public hero-selection ceremony.
   Ends at Luke stepping toward the crystal; legacy step 3 remains a temporary
   bridge until the dedicated F+G crystal climax replaces it. */

const OPEN_MAP='openingAldia';
const SCREEN='openingCeremonyDE';
const MOCK_DONE='lqOpeningMockDone';
const DE_DONE='lqOpeningDEDone';
const STYLE_ID='lq-opening-de-style';
let stage={phase:'leon',step:0};

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqDEStage{min-height:min(78vh,670px);border-radius:22px;overflow:hidden;position:relative;background:#0a1320;border:1px solid #ffffff20;box-shadow:0 22px 55px #000b;padding:16px;display:flex;flex-direction:column;justify-content:center;gap:12px}
.lqDERoom{position:relative;min-height:300px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#26364c 0 72%,#493625 72%);border:1px solid #ffffff18;box-shadow:inset 0 -18px 40px #0005}
.lqDERoom::before{content:"";position:absolute;left:10%;right:10%;top:13%;height:54%;border:2px solid #9b7a4c55;background:linear-gradient(90deg,#1c2737 0 48%,#222e3f 48%);box-shadow:0 12px 24px #0007}
.lqDEAwards{position:absolute;left:13%;top:19%;z-index:2;display:grid;gap:7px;text-align:left;font-size:12px;color:#e8d69f}.lqDEAwards span{background:#6b4c28cc;border:1px solid #d1ae6d55;border-radius:5px;padding:5px 8px;box-shadow:0 3px 6px #0005}.lqDEBooks{position:absolute;right:14%;top:19%;z-index:2;font-size:34px;filter:drop-shadow(0 5px 5px #0007)}
.lqDELeon{position:absolute;left:50%;bottom:25px;transform:translateX(-50%);z-index:3;text-align:center}.lqDELeon .face{font-size:72px;filter:drop-shadow(0 8px 7px #0009)}.lqDELeon .small{font-size:11px;color:#bfc9d7;letter-spacing:.12em}
.lqDECaption{background:#07111feb;border:1px solid #ffffff1f;border-radius:12px;padding:12px;line-height:1.7;white-space:pre-line}.lqDEWhisper{color:#c8b3df;font-style:italic}.lqDECeremony{position:relative;min-height:330px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 28%,rgba(247,221,141,.24),transparent 26%),linear-gradient(180deg,#273c61 0 68%,#695c49 68%);border:1px solid #ffe9a52c;box-shadow:inset 0 -20px 50px #0006}.lqDECrystal{position:absolute;left:50%;top:52px;transform:translateX(-50%);font-size:74px;filter:drop-shadow(0 0 18px #99cfff88)}.lqDEPriest{position:absolute;left:50%;top:145px;transform:translateX(-50%);font-size:46px}.lqDEEleanor{position:absolute;right:12%;bottom:32px;text-align:center}.lqDEEleanor .face{font-size:54px}.lqDEEmpty{position:absolute;left:12%;bottom:36px;color:#d9c99e;text-align:center;font-size:12px}.lqDEEmpty b{display:block;font-size:42px;opacity:.32}.lqDECrowd{position:absolute;left:10%;right:10%;bottom:5px;text-align:center;letter-spacing:.24em;font-size:17px;opacity:.66}
.lqDESilence{letter-spacing:.32em;text-align:center;color:#ddd0ae;font-weight:900}
@media(max-width:430px){.lqDERoom,.lqDECeremony{min-height:280px}.lqDEAwards{left:8%}.lqDEBooks{right:9%}.lqDEEleanor{right:7%}}
`;
  document.head.appendChild(st);
}

const leonScenes=[
  {caption:'選定式の少し前。\nレオンの部屋には、努力した時間だけが整然と残っていた。'},
  {caption:'剣術大会・準優勝。\n魔法実技・優秀賞。\n学院総合成績・第2位。\n\nどれも立派だ。けれど「勇者の証明」に見える一枚だけが、どこにもない。'},
  {caption:'エレノアの声が、何度も記憶の中で重なる。\n\n「あなたは勇者になるために生まれたのです」\n「私は勇者を生んだのですから」',whisper:true},
  {caption:'机には、勇者水晶の古い写本。\n『選ばれし者に、水晶は応える』\n\nレオン「……もし、光らなかったら？」'}
];
const ceremonyScenes=[
  {caption:'大神殿。王族、聖職者、候補者、そして王都の人々。\n誰もが同じ名前を待っている。'},
  {caption:'神官「次の候補者。レオン、前へ。」'},
  {caption:'…………。',silence:true},
  {caption:'ざわめきが広がる。\n空いているのは、最も埋まっているはずだった場所。'},
  {caption:'エレノアはほんの一瞬だけ表情を失う。\nだが次の瞬間には、いつもの穏やかな微笑みに戻っていた。\n\nエレノア「……式を、お続けください。」'},
  {caption:'候補者の名前が順に呼ばれる。\nそして最後に。\n\n神官「ルーク。水晶の前へ。」'},
  {caption:'ルーク「……僕ですか？」\n\n神官「前へ。」'}
];

function renderLeon(){
  const sc=leonScenes[Math.min(stage.step,leonScenes.length-1)];
  app.innerHTML=`<div class=lqDEStage><div class=lqDERoom><div class=lqDEAwards><span>⚔ 剣術大会　準優勝</span><span>✦ 魔法実技　優秀賞</span><span>📜 学院総合　第2位</span></div><div class=lqDEBooks>📚<br>📘<br>🔷</div><div class=lqDELeon><div class=face>🧑‍🦳</div><div class=small>LEON</div></div></div><div class="lqDECaption${sc.whisper?' lqDEWhisper':''}">${sc.caption}</div><button class="btn gold" onclick="lqDENext()">${stage.step===leonScenes.length-1?'大神殿へ':'つづける'}</button></div>`;
}
function renderCeremony(){
  const sc=ceremonyScenes[Math.min(stage.step,ceremonyScenes.length-1)];
  app.innerHTML=`<div class=lqDEStage><div class=lqDECeremony><div class=lqDECrystal>🔷</div><div class=lqDEPriest>🧙‍♂️</div><div class=lqDEEmpty><b>◇</b>レオンの位置</div><div class=lqDEEleanor><div class=face>👩‍🦳</div><div>エレノア</div></div><div class=lqDECrowd>👤 👤 👤 👤 👤</div></div><div class="lqDECaption${sc.silence?' lqDESilence':''}">${sc.caption}</div><button class="btn gold" onclick="lqDENext()">${stage.step===ceremonyScenes.length-1?'水晶の前へ':'つづける'}</button></div>`;
}
function renderDE(){injectStyle();document.body.classList.remove('lqOpeningMorning');if(stage.phase==='leon')renderLeon();else renderCeremony();}
function startDE(){stopMoving();stage={phase:'leon',step:0};s.screen=SCREEN;s.flags=s.flags||{};s.flags.lqOpeningDEStarted=true;render();}
window.lqDENext=function(){
  if(s.screen!==SCREEN)return;
  if(stage.phase==='leon'){
    if(stage.step<leonScenes.length-1){stage.step++;render();return;}
    stage={phase:'ceremony',step:0};render();return;
  }
  if(stage.step<ceremonyScenes.length-1){stage.step++;render();return;}
  s.flags=s.flags||{};s.flags[DE_DONE]=true;s.flags.lqOpeningDEStarted=false;
  s.screen='intro';s.step=3;s.map='town';s.x=9;s.y=12;render();
};

injectStyle();
const baseRender=render;
render=function(){if(s.screen===SCREEN){stopMoving();save();renderDE();return;}return baseRender.apply(this,arguments);};
const baseCheckGate=checkGate;
checkGate=function(){
  if(s.screen==='world'&&s.map===OPEN_MAP){
    const c=(MAPS[OPEN_MAP].tiles[s.y]||'')[s.x];
    if(c==='G'&&s.y===0&&s.flags?.[MOCK_DONE]&&!s.flags?.[DE_DONE]){startDE();return;}
  }
  return baseCheckGate.apply(this,arguments);
};

function smoke(){
  if(typeof s==='undefined'||!MAPS?.[OPEN_MAP])return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};const raw=localStorage.getItem('lukeQuestV2');
  try{
    s.flags={...(s.flags||{}),[MOCK_DONE]:true,[DE_DONE]:false};startDE();
    if(!document.querySelector('.lqDEAwards'))throw new Error('Leon environmental evidence missing');
    for(let i=0;i<leonScenes.length;i++)window.lqDENext();
    if(stage.phase!=='ceremony')throw new Error('ceremony not reached');
    for(let i=0;i<ceremonyScenes.length;i++)window.lqDENext();
    if(!s.flags[DE_DONE]||s.screen!=='intro'||s.step!==3)throw new Error('crystal bridge invalid');
    const marker=document.createElement('i');marker.className='lqReq120DESmokeMarker';marker.hidden=true;marker.dataset.leonAnxiety='true';marker.dataset.leonAbsent='true';marker.dataset.eleanorComposed='true';marker.dataset.lukeCalled='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;s.dialog=before.dialog;s.flags=before.flags;
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();
  }
}
window.LQ_REQ120_OPENING_DE_STATUS={requirement:'REQ-120',checkpoint:'D+E',leonAnxiety:true,environmentalAwards:true,ceremony:true,leonAbsent:true,eleanorPublicComposure:true,crystalBridgeStep:3,protectedReveal:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_DE_TEST={smoke,startDE};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
