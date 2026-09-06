(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_EXP_PROGRESS_STATUS;
 let marker=document.getElementById('lqExpProgressRuntimeSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqExpProgressRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const node=document.querySelector('.lqExpProgress');
 const fill=node?.querySelector('.lqExpProgressFill');
 const cs=node&&getComputedStyle(node);
 const grid=node?.closest('.status');
 const gridCs=grid&&getComputedStyle(grid);
 const children=grid?[...grid.children]:[];
 const tops=children.map(el=>Math.round(el.getBoundingClientRect().top));
 const normal=status?.normalize?.(7,20);
 const malformed=status?.normalize?.('bad',0);
 const sample=status?.sampleMarkup?.(7,20)||'';
 const data={
   status:!!status,
   presentationOnly:status?.presentationOnly===true,
   canonicalSource:Array.isArray(status?.canonicalSource)&&status.canonicalSource.join('|')==='s.xp|s.nx',
   noSaveMutation:status?.saveMutation===false,
   pointerSafe:status?.pointerSafe===true&&!!node&&cs?.pointerEvents==='none',
   noFullscreenLayer:status?.fullscreenLayer===false&&!!node&&cs?.position!=='fixed',
   normalMath:normal?.current===7&&normal?.threshold===20&&normal?.percent===35,
   malformedSafe:malformed?.current===0&&malformed?.threshold===1&&malformed?.percent===0,
   textContract:sample.includes('EXP')&&sample.includes('7/20')&&sample.includes('width:35%'),
   liveDom:!!node&&Number(node.dataset.expNext)>=1&&!!fill,
   compact:!!node&&node.getBoundingClientRect().height<80,
   sixColumnContract:status?.integratedStatusColumns===6&&status?.mpCompatibleSingleRow===true&&grid?.classList.contains('lqExpStatusGrid')&&children.length>=6,
   computedSixColumns:!!gridCs&&gridCs.gridTemplateColumns.split(' ').filter(Boolean).length===6,
   singleRow:tops.length>=6&&new Set(tops).size===1,
   mpStillVisible:!!grid?.querySelector('.lqMpValue')
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ040_EXP_PROGRESS_FAIL_${key}()`);},0);}
},260);
})();