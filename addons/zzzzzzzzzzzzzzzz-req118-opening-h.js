(() => {
'use strict';

/* REQ-118 Checkpoint H — Leon missing report and exact Chapter 1 handoff.
   F+G deliberately leaves Luke's Hero status unresolved, so this checkpoint
   assigns an urgent search mission without calling Luke the Hero. */
const REQ='REQ-118';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
const FG_DONE='crystal_abnormal_reaction_complete';
const H_ACTIVE='leon_missing_mission';
const H_DONE='chapter1_handoff_complete';
const SCREEN='req118MissionH';
const STYLE_ID='lq-req118-opening-h-style';
let h={step:0};
function flags(){if(typeof s==='undefined'||!s)return null;if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};return s.flags;}
function phase(){return flags()?.[PHASE_KEY]||null;}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-118 H save failed',e);}}
function installStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqReq118H{min-height:100dvh;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));background:#07111f;color:#fff7dd;display:flex;align-items:center;justify-content:center}.lqReq118HCard{width:min(100%,610px);display:flex;flex-direction:column;gap:11px;padding:15px;border:1px solid #ffffff20;border-radius:18px;background:#101d31}.lqReq118HScene{position:relative;min-height:320px;border-radius:16px;overflow:hidden;border:1px solid #ffffff20;background:radial-gradient(circle at 50% 30%,#f7dd8d22,transparent 28%),linear-gradient(180deg,#263b5d 0 68%,#5b5148 68%)}.lqReq118HPeople{position:absolute;left:8%;right:8%;bottom:38px;display:flex;justify-content:space-around;align-items:flex-end;text-align:center}.lqReq118HPerson b{display:block;font-size:52px}.lqReq118HGate{position:relative;min-height:340px;border-radius:16px;overflow:hidden;background:linear-gradient(180deg,#55759a 0 42%,#82986e 42% 62%,#3b4f39 62%)}.lqReq118HForest{position:absolute;left:0;right:0;top:44%;text-align:center;font-size:42px}.lqReq118HLuke{position:absolute;left:50%;bottom:43px;transform:translateX(-50%);font-size:61px}.lqReq118HChapter{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;background:#03070dbb}.lqReq118HChapter small{letter-spacing:.28em;color:#dccb91;font-weight:900}.lqReq118HChapter b{display:block;font-family:serif;font-size:clamp(30px,9vw,52px);margin:10px}.lqReq118HCaption{min-height:105px;padding:11px;border-radius:11px;background:#07111f;line-height:1.68;white-space:pre-line}.lqReq118H button{border:0;border-radius:12px;padding:13px;background:#347cff;color:white;font:inherit;font-weight:900}
`;document.head.appendChild(st);}
const scenes=[
 {kind:'temple',text:'神殿の扉が勢いよく開く。\n\n王都兵「報告！ レオンが王都を出た形跡を確認！」'},
 {kind:'temple',text:'王都兵「北東方面。魔物の森へ向かったものと思われます。」\n\nざわめきが、さっきとは別の意味で広がる。'},
 {kind:'temple',text:'王の使者「ルーク。水晶の件は保留だ。だが今、動ける者が要る。」\n「レオンを捜し、無事に王都へ連れ戻せ。」'},
 {kind:'temple',text:'ルーク「選定式に来ただけなのに、もう人探しですか。」\n\n王の使者「緊急任務だ。」'},
 {kind:'temple',text:'ルーク「……分かりました。まずレオンを見つけます。」'},
 {kind:'gate',text:'王都の門。遠くには魔物の森。\n\nルーク「レオン。何やってるんだよ……。」'},
 {kind:'chapter',text:'第一章\n逃げた勇者候補'}
];
function visual(sc){if(sc.kind==='temple')return `<div class=lqReq118HScene><div class=lqReq118HPeople><div class=lqReq118HPerson><b>🏃‍♂️</b>王都兵</div><div class=lqReq118HPerson><b>🧑‍🦱</b>ルーク</div><div class=lqReq118HPerson><b>🧙‍♂️</b>王の使者</div><div class=lqReq118HPerson><b>👩‍🦳</b>エレノア</div></div></div>`;return `<div class=lqReq118HGate><div class=lqReq118HForest>🌲🌲🌲🌲🌲</div><div class=lqReq118HLuke>🧑‍🦱</div>${sc.kind==='chapter'?'<div class=lqReq118HChapter><div><small>CHAPTER I</small><b>逃げた勇者候補</b><div>LUKE QUEST</div></div></div>':''}</div>`;}
function renderH(){installStyle();document.body.classList.remove('lqWorldFullscreen');const sc=scenes[Math.min(h.step,scenes.length-1)];app.innerHTML=`<main class=lqReq118H data-req118-phase="${H_ACTIVE}"><section class=lqReq118HCard>${visual(sc)}<div class=lqReq118HCaption>${sc.text}</div><button id=lqReq118HNext type=button>${h.step===scenes.length-1?'第一章を始める':'つづける'}</button></section></main>`;document.getElementById('lqReq118HNext')?.addEventListener('click',()=>window.lqReq118HNext(),{once:true});}
function startH(){const f=flags();if(!f||f[DONE_KEY]||phase()!==FG_DONE)return false;if(typeof stopMoving==='function')stopMoving();h={step:0};f[PHASE_KEY]=H_ACTIVE;s.dialog=null;s.screen=SCREEN;safeSave();render();return true;}
function finishH(){const f=flags();f[PHASE_KEY]=H_DONE;f[DONE_KEY]=true;s.screen='world';s.step=0;s.map='town';s.x=9;s.y=12;s.dir='up';if(typeof encounterGrace!=='undefined')encounterGrace=0;s.dialog={name:'冒険メモ',text:'最初の任務：王都を出て、魔物の森へ向かったレオンを捜す。\nまずは王都から近郊へ出よう。'};safeSave();render();}
window.lqReq118HNext=function(){if(typeof s==='undefined'||s.screen!==SCREEN||phase()!==H_ACTIVE)return;if(h.step<scenes.length-1){h.step++;render();return;}finishH();};
installStyle();
if(typeof render==='function'){const baseRender=render;render=function(){if(typeof s!=='undefined'&&s.screen===SCREEN&&phase()===H_ACTIVE){if(typeof stopMoving==='function')stopMoving();renderH();return;}return baseRender.apply(this,arguments);};}
if(typeof action==='function'){const baseAction=action;action=function(){if(typeof s!=='undefined'&&s.screen==='world'&&s.map==='town'&&phase()===FG_DONE&&!s.dialog){if(startH())return;}return baseAction.apply(this,arguments);};}
function stableSnapshot(){return JSON.stringify({hp:s.hp,maxHp:s.maxHp,mp:s.mp,maxMp:s.maxMp,exp:s.exp,gold:s.gold,herbs:s.herbs,smoke:s.smoke,atk:s.atk,def:s.def,level:s.level,wins:s.wins,equipment:s.equipment,keyItems:s.keyItems});}
function smoke(){if(typeof s==='undefined'||!window.LQ_REQ118_OPENING_TEST)return;const snap=structuredClone(s);const raw=localStorage.getItem('lukeQuestV2');const marker=document.createElement('i');marker.id='lqReq118HMarker';marker.hidden=true;try{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,structuredClone(DEFAULT));s.flags.req118OpeningPhase=FG_DONE;s.flags.req118OpeningComplete=false;s.screen='world';s.map='town';s.dialog=null;const before=stableSnapshot();if(!startH())throw new Error('F+G->H transition failed');let missing=false,mission=false,chapter=false,noHeroLabel=true;for(let i=0;i<scenes.length;i++){const t=scenes[Math.min(h.step,scenes.length-1)].text;missing ||= t.includes('レオンが王都を出た');mission ||= t.includes('レオンを捜し');chapter ||= t.includes('第一章');if(/勇者ルーク|勇者。?ルーク/.test(t))noHeroLabel=false;window.lqReq118HNext();}if(!missing||!mission||!chapter||!noHeroLabel)throw new Error('required H beats invalid');if(!s.flags.req118OpeningComplete||phase()!==H_DONE)throw new Error('opening completion flags missing');if(s.screen!=='world'||s.map!=='town'||s.x!==9||s.y!==12||s.dir!=='up')throw new Error('Chapter 1 handoff invalid');if(stableSnapshot()!==before)throw new Error('H mutated canonical progression');marker.dataset.status='PASS';marker.dataset.leonMissing='true';marker.dataset.firstMission='true';marker.dataset.heroConfirmed='false';marker.dataset.chapterOne='true';marker.dataset.worldHandoff='true';marker.dataset.progressionIsolated='true';}catch(e){marker.dataset.status='FAIL';marker.dataset.error=e?.message||String(e);console.error(e);}finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);h={step:0};if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();document.body.appendChild(marker);}}
window.LQ_REQ118_OPENING_H_STATUS={requirement:REQ,checkpoint:'H',status:'IN_PROGRESS',leonMissing:true,firstMission:true,heroConfirmed:false,chapterOneTitle:true,existingWorldHandoff:true,canonicalProgressionMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ118_OPENING_H_TEST={startH,finishH,phase,smoke,stableSnapshot};
if(new URLSearchParams(location.search).get('lqReq118HSmoke')==='1')setTimeout(smoke,7400);
})();
