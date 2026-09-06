(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_COMPLETION_RECORD_STATUS;
 let marker=document.getElementById('lqCompletionCoverageRuntimeSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqCompletionCoverageRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const all=status?.rowBuilder?.({elderCharmComplete:true,forestBountyComplete:true,lqHerbSampleQuestDone:true})||[];
 const herbOnly=status?.rowBuilder?.({lqHerbSampleQuestDone:true})||[];
 const none=status?.rowBuilder?.({})||[];
 const flags=all.map(x=>x[2]);
 const data={
   status:!!status,
   presentationOnly:status?.presentationOnly===true,
   noQuestMutation:status?.noQuestMutation===true,
   allThree:Array.isArray(status?.canonicalFlags)&&status.canonicalFlags.length===3&&all.length===3,
   existingCoverage:status?.supports?.elderCharm===true&&status?.supports?.forestBounty===true,
   herbCoverage:status?.supports?.forestHerbSample===true&&herbOnly.length===1&&herbOnly[0][1]==='森の薬草標本',
   uniqueFlags:new Set(flags).size===flags.length,
   noFalseRows:none.length===0
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ041_COMPLETION_COVERAGE_FAIL_${key}()`);},0);}
},240);
})();