(() => {
'use strict';

/* P0 touch-sequence completion guard.
   Inert in normal play. In the existing Pages ?lqTouchSmoke=1 path, this turns
   a skipped/timed-out REQ-021 or REQ-001 subtest into the common failure marker,
   preventing a false-green deploy merely because a test never ran.

   The P0 probes are intentionally serialized because they share global game
   state and one pointer controller. The guard therefore waits long enough for
   primary -> visibility -> long-press -> multitouch to complete in order. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=reason;
  f.hidden=true;
  document.body.appendChild(f);
}

setTimeout(()=>{
  const visibility=document.getElementById('lqVisibilityTouchSmokeMarker');
  const longPress=document.getElementById('lqReq021LongPressSmokeMarker');
  const multitouch=document.getElementById('lqReq001MultitouchSmokeMarker');
  const visibilityOk=!!visibility&&visibility.dataset.pass==='true';
  const longPressOk=!!longPress&&longPress.dataset.noAction==='true'&&longPress.dataset.noMove==='true'&&longPress.dataset.cleaned==='true';
  const multitouchOk=!!multitouch&&multitouch.dataset.secondaryIgnored==='true'&&multitouch.dataset.primaryOwns==='true'&&multitouch.dataset.cleaned==='true';
  if(!(visibilityOk&&longPressOk&&multitouchOk)){
    fail(`P0 touch sequence incomplete visibility=${visibilityOk} longPress=${longPressOk} multitouch=${multitouchOk}`);
  }
  let marker=document.getElementById('lqP0TouchSequenceGuardMarker');
  if(!marker){marker=document.createElement('i');marker.id='lqP0TouchSequenceGuardMarker';marker.hidden=true;document.body.appendChild(marker);}
  marker.dataset.visibility=String(visibilityOk);
  marker.dataset.longPress=String(longPressOk);
  marker.dataset.multitouch=String(multitouchOk);
  marker.dataset.pass=String(visibilityOk&&longPressOk&&multitouchOk);
},4200);
})();