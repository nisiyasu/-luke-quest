(() => {
'use strict';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
function canonicalSnapshot(){return JSON.stringify({hp:s.hp,maxHp:s.maxHp,mp:s.mp,maxMp:s.maxMp,exp:s.exp,gold:s.gold,herbs:s.herbs,smoke:s.smoke,atk:s.atk,def:s.def,level:s.level,wins:s.wins,equipment:s.equipment,keyItems:s.keyItems});}
function assert(ok,msg){if(!ok)throw new Error(msg);}
function run(){
 if(typeof s==='undefined'||!window.LQ_REQ118_OPENING_TEST||!window.LQ_REQ118_OPENING_C_TEST||!window.LQ_REQ118_OPENING_DE_TEST||!window.LQ_REQ118_OPENING_FG_TEST||!window.LQ_REQ118_OPENING_H_TEST)return;
 const snap=structuredClone(s);const raw=localStorage.getItem('lukeQuestV2');const marker=document.createElement('i');marker.id='lqReq118E2EMarker';marker.hidden=true;
 try{
   Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,structuredClone(DEFAULT));
   s.flags[PHASE_KEY]='cold_open';s.flags[DONE_KEY]=false;s.screen='intro';s.dialog=null;
   const before=canonicalSnapshot();
   // A+B: cold open -> playable morning -> guardian -> temple arrival.
   LQ_REQ118_OPENING_TEST.showCold();LQ_REQ118_OPENING_TEST.beginMorning();
   s.dir='up';s.x=8;s.y=13;s.dialog=null;assert(LQ_REQ118_OPENING_TEST.guardianDialogue(),'A+B guardian action failed');
   s.dialog=null;s.x=8;s.y=6;LQ_REQ118_OPENING_TEST.maybeCompleteMorning();
   assert(s.flags[PHASE_KEY]==='aldia_morning_complete','A+B phase handoff failed');
   // C: academy flashback mock battle. Luke wins; no canonical progression mutation.
   s.dialog=null;assert(LQ_REQ118_OPENING_C_TEST.startMemory(),'B->C failed');
   lqReq118MockStart();lqReq118MockAttack();lqReq118MockAttack();lqReq118MockAttack();
   assert(LQ_REQ118_OPENING_C_TEST.getMock().phase==='result','C mock result missing');lqReq118MockFinish();
   assert(s.flags[PHASE_KEY]==='academy_flashback_complete','C phase handoff failed');
   // D+E: Leon anxiety -> ceremony -> Leon absent -> Luke called.
   s.dialog=null;assert(LQ_REQ118_OPENING_DE_TEST.startDE(),'C->D+E failed');
   for(let i=0;i<24&&s.screen==='req118CeremonyDE';i++)lqReq118DENext();
   assert(s.flags[PHASE_KEY]==='ceremony_leon_absent_complete','D+E phase handoff failed');
   // F+G: unprecedented mixed crystal response, explicitly not Hero confirmation.
   s.dialog=null;assert(LQ_REQ118_OPENING_FG_TEST.startFG(),'D+E->F+G failed');
   for(let i=0;i<24&&s.screen==='req118CrystalFG';i++)lqReq118FGNext();
   assert(s.flags[PHASE_KEY]==='crystal_abnormal_reaction_complete','F+G phase handoff failed');
   assert(window.LQ_REQ118_OPENING_FG_STATUS?.heroConfirmed===false,'F+G Hero confirmation leaked');
   // H: Leon missing -> first mission -> canonical Chapter 1 town handoff.
   s.dialog=null;assert(LQ_REQ118_OPENING_H_TEST.startH(),'F+G->H failed');
   for(let i=0;i<24&&s.screen==='req118MissionH';i++)lqReq118HNext();
   assert(s.flags[DONE_KEY]===true&&s.flags[PHASE_KEY]==='chapter1_handoff_complete','H completion flags missing');
   assert(s.screen==='world'&&s.map==='town'&&s.x===9&&s.y===12&&s.dir==='up','Chapter 1 handoff location invalid');
   assert(canonicalSnapshot()===before,'A-H mutated canonical progression/rewards');
   assert(LQ_REQ118_OPENING_TEST.advancedProgress({...structuredClone(DEFAULT),screen:'world',map:'forest',flags:{leonMet:true}})===true,'advanced-save bypass authority missing');
   assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'REQ-021 tap authority regression');
   assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'REQ-022 fullscreen authority regression');
   marker.dataset.status='PASS';marker.dataset.aThroughH='true';marker.dataset.noRewardLeak='true';marker.dataset.heroConfirmed='false';marker.dataset.chapterOneHandoff='true';marker.dataset.advancedSaveBypass='true';marker.dataset.tapProtected='true';marker.dataset.fullscreenProtected='true';
 }catch(e){marker.dataset.status='FAIL';marker.dataset.error=e?.message||String(e);console.error('REQ-118 E2E',e);}
 finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();document.body.appendChild(marker);}
}
window.LQ_REQ118_OPENING_E2E_STATUS={requirement:'REQ-118',scope:'A-H',canonicalProgressionExpectedUnchanged:true,heroConfirmed:false,iosPhysicalVerification:'PENDING'};
if(new URLSearchParams(location.search).get('lqReq118E2E')==='1')setTimeout(run,8200);
})();
