(() => {
'use strict';

/* REQ-118 Checkpoint D+E — Leon anxiety + hero-selection ceremony.
   Current REQ-118 phase authority only. No rewards, stats, inventory, wins,
   normal battle state, or Chapter 1 canon are mutated here. */
const REQ='REQ-118';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
const C_DONE='academy_flashback_complete';
const DE_ACTIVE='leon_anxiety_ceremony';
const DE_DONE='ceremony_leon_absent_complete';
const SCREEN='req118CeremonyDE';
const STYLE_ID='lq-req118-opening-de-style';
let stage={phase:'leon',step:0};

function flags(){
  if(typeof s==='undefined'||!s)return null;
  if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};
  return s.flags;
}
function phase(){return flags()?.[PHASE_KEY]||null;}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-118 D+E save failed',e);}}
function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqReq118DE{min-height:100dvh;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));background:#07111f;color:#fff7dd;display:flex;align-items:center;justify-content:center}.lqReq118DECard{width:min(100%,610px);display:flex;flex-direction:column;gap:11px;padding:15px;border:1px solid #ffffff20;border-radius:18px;background:#101d31;box-shadow:0 16px 40px #0007}.lqReq118DERoom,.lqReq118DECeremony{position:relative;min-height:290px;border-radius:15px;overflow:hidden;border:1px solid #ffffff20}.lqReq118DERoom{background:linear-gradient(180deg,#26364c 0 72%,#493625 72%)}.lqReq118DERoom:before{content:"";position:absolute;left:10%;right:10%;top:13%;height:54%;border:2px solid #9b7a4c55;background:linear-gradient(90deg,#1c2737 0 48%,#222e3f 48%);box-shadow:0 12px 24px #0007}.lqReq118Awards{position:absolute;left:12%;top:18%;z-index:2;display:grid;gap:7px;font-size:12px;color:#e8d69f}.lqReq118Awards span{background:#6b4c28cc;border:1px solid #d1ae6d55;border-radius:5px;padding:5px 8px}.lqReq118Books{position:absolute;right:13%;top:19%;z-index:2;font-size:34px}.lqReq118Leon{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);z-index:3;text-align:center}.lqReq118Leon .face{font-size:70px}.lqReq118Leon small{letter-spacing:.14em;color:#bfc9d7}.lqReq118DECeremony{background:radial-gradient(circle at 50% 27%,#f7dd8d3d,transparent 27%),linear-gradient(180deg,#273c61 0 68%,#695c49 68%)}.lqReq118Crystal{position:absolute;left:50%;top:48px;transform:translateX(-50%);font-size:72px}.lqReq118Priest{position:absolute;left:50%;top:140px;transform:translateX(-50%);font-size:44px}.lqReq118Empty{position:absolute;left:10%;bottom:35px;color:#d9c99e;text-align:center;font-size:12px}.lqReq118Empty b{display:block;font-size:42px;opacity:.32}.lqReq118Eleanor{position:absolute;right:9%;bottom:30px;text-align:center}.lqReq118Eleanor .face{font-size:52px}.lqReq118Crowd{position:absolute;left:8%;right:8%;bottom:5px;text-align:center;letter-spacing:.19em;font-size:17px;opacity:.62}.lqReq118DECaption{min-height:110px;padding:11px;border-radius:11px;background:#07111f;line-height:1.68;white-space:pre-line}.lqReq118DECaption.whisper{color:#c8b3df;font-style:italic}.lqReq118DECaption.silence{text-align:center;letter-spacing:.3em;font-weight:900;color:#ddd0ae}.lqReq118DE button{border:0;border-radius:12px;padding:13px;background:#347cff;color:#fff;font:inherit;font-weight:900}
@media(max-width:430px){.lqReq118DERoom,.lqReq118DECeremony{min-height:260px}.lqReq118Awards{left:7%}.lqReq118Books{right:8%}.lqReq118Eleanor{right:5%}}
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
function renderDE(){
  installStyle();document.body.classList.remove('lqWorldFullscreen');
  const sc=(stage.phase==='leon'?leonScenes:ceremonyScenes)[stage.step];
  const visual=stage.phase==='leon'
    ? `<div class=lqReq118DERoom><div class=lqReq118Awards><span>⚔ 剣術大会　準優勝</span><span>✦ 魔法実技　優秀賞</span><span>📜 学院総合　第2位</span></div><div class=lqReq118Books>📚<br>📘<br>🔷</div><div class=lqReq118Leon><div class=face>🧑‍🦳</div><small>LEON</small></div></div>`
    : `<div class=lqReq118DECeremony><div class=lqReq118Crystal>🔷</div><div class=lqReq118Priest>🧙‍♂️</div><div class=lqReq118Empty><b>◇</b>レオンの位置</div><div class=lqReq118Eleanor><div class=face>👩‍🦳</div><div>エレノア</div></div><div class=lqReq118Crowd>👤 👤 👤 👤 👤</div></div>`;
  const last=stage.phase==='ceremony'&&stage.step===ceremonyScenes.length-1;
  const label=stage.phase==='leon'&&stage.step===leonScenes.length-1?'大神殿へ':last?'水晶の前へ':'つづける';
  app.innerHTML=`<main class=lqReq118DE data-req118-phase="${DE_ACTIVE}" data-scene="${stage.phase}"><section class=lqReq118DECard>${visual}<div class="lqReq118DECaption${sc.whisper?' whisper':''}${sc.silence?' silence':''}">${sc.caption}</div><button id=lqReq118DENext type=button>${label}</button></section></main>`;
  document.getElementById('lqReq118DENext')?.addEventListener('click',()=>window.lqReq118DENext(),{once:true});
}
function startDE(){
  const f=flags();if(!f||f[DONE_KEY]||phase()!==C_DONE)return false;
  if(typeof stopMoving==='function')stopMoving();stage={phase:'leon',step:0};f[PHASE_KEY]=DE_ACTIVE;s.dialog=null;s.screen=SCREEN;safeSave();render();return true;
}
window.lqReq118DENext=function(){
  if(typeof s==='undefined'||s.screen!==SCREEN||phase()!==DE_ACTIVE)return;
  if(stage.phase==='leon'){
    if(stage.step<leonScenes.length-1){stage.step++;render();return;}
    stage={phase:'ceremony',step:0};render();return;
  }
  if(stage.step<ceremonyScenes.length-1){stage.step++;render();return;}
  const f=flags();f[PHASE_KEY]=DE_DONE;s.screen='world';s.map='town';s.x=8;s.y=5;s.dir='up';s.dialog={name:'神官',text:'「ルーク。水晶の前へ。」\nルーク「……嫌な予感しかしないんですけど。」'};safeSave();render();
};
installStyle();
if(typeof render==='function'){
  const baseRender=render;render=function(){if(typeof s!=='undefined'&&s.screen===SCREEN&&phase()===DE_ACTIVE){if(typeof stopMoving==='function')stopMoving();renderDE();return;}return baseRender.apply(this,arguments);};
}
if(typeof action==='function'){
  const baseAction=action;action=function(){if(typeof s!=='undefined'&&s.screen==='world'&&s.map==='town'&&phase()===C_DONE&&!s.dialog){if(startDE())return;}return baseAction.apply(this,arguments);};
}
function stableSnapshot(){return JSON.stringify({hp:s.hp,maxHp:s.maxHp,mp:s.mp,maxMp:s.maxMp,exp:s.exp,gold:s.gold,herbs:s.herbs,smoke:s.smoke,atk:s.atk,def:s.def,level:s.level,wins:s.wins,equipment:s.equipment,keyItems:s.keyItems});}
function smoke(){
  if(typeof s==='undefined'||!window.LQ_REQ118_OPENING_TEST)return;
  const snap=structuredClone(s);const raw=localStorage.getItem('lukeQuestV2');const marker=document.createElement('i');marker.id='lqReq118DEMarker';marker.hidden=true;
  try{
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,structuredClone(DEFAULT));s.flags.req118OpeningPhase=C_DONE;s.flags.req118OpeningComplete=false;s.screen='world';s.map='town';s.dialog=null;
    const before=stableSnapshot();if(!startDE())throw new Error('C->D+E transition failed');
    if(!document.querySelector('.lqReq118Awards'))throw new Error('Leon anxiety evidence missing');
    for(let i=0;i<leonScenes.length;i++)window.lqReq118DENext();
    if(stage.phase!=='ceremony')throw new Error('ceremony not reached');
    if(!document.querySelector('.lqReq118Empty'))throw new Error('Leon absence visual missing');
    for(let i=0;i<ceremonyScenes.length;i++)window.lqReq118DENext();
    if(phase()!==DE_DONE||s.screen!=='world'||s.map!=='town')throw new Error('D+E completion invalid');
    if(stableSnapshot()!==before)throw new Error('D+E mutated canonical progression');
    marker.dataset.status='PASS';marker.dataset.leonAnxiety='true';marker.dataset.leonAbsent='true';marker.dataset.eleanorComposed='true';marker.dataset.lukeCalled='true';marker.dataset.progressionIsolated='true';
  }catch(e){marker.dataset.status='FAIL';marker.dataset.error=e?.message||String(e);console.error(e);}
  finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();document.body.appendChild(marker);}
}
window.LQ_REQ118_OPENING_DE_STATUS={requirement:REQ,checkpoint:'D+E',status:'IN_PROGRESS',leonAnxiety:true,ceremony:true,leonAbsent:true,eleanorPublicComposure:true,canonicalProgressionMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ118_OPENING_DE_TEST={startDE,phase,smoke,stableSnapshot};
if(new URLSearchParams(location.search).get('lqReq118DESmoke')==='1')setTimeout(smoke,6200);
})();
