(() => {
'use strict';

/* REQ-084 pure-helper acceptance. It never mutates live game state. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  let cliff=false,preArrival=false,legacyBranch=false,helper=false;
  try{
    const test=window.LQ_ADVENTURE_JOURNAL_TEST;
    helper=!!test&&typeof test.mainGoal==='function';
    if(helper){
      cliff=test.mainGoal({map:'northCliffRoad',wins:2,flags:{withdrawProofSeen:true}})==='北の崖道で新しい足跡を追い、北側へ続く道を確認する。';
      preArrival=test.mainGoal({map:'evacRoute',wins:2,flags:{withdrawProofSeen:true}})==='北の崖道へ向かい、レオンを追う。';
      legacyBranch=test.mainGoal({map:'evacRoute',wins:2,flags:{evacEntered:true}})==='北の退避路でレオンと魔王軍の痕跡を調べる。';
    }
    if(!(helper&&cliff&&preArrival&&legacyBranch)){
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-084 north cliff journal objective assertion false';failure.hidden=true;document.body.appendChild(failure);
    }
    const marker=document.createElement('i');marker.id='lqNorthCliffJournalSmokeMarker';marker.hidden=true;
    marker.dataset.helper=String(helper);marker.dataset.cliff=String(cliff);marker.dataset.preArrival=String(preArrival);marker.dataset.legacyBranch=String(legacyBranch);marker.dataset.liveStateMutation='false';
    document.body.appendChild(marker);
  }catch(err){
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-084 north cliff journal smoke exception: '+String(err?.message||err);failure.hidden=true;document.body.appendChild(failure);
  }
},120);
})();
