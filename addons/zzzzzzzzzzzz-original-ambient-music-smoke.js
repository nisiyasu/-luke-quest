(() => {
'use strict';

/* REQ-036 browser acceptance. Runs only in the existing lqTouchSmoke harness. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const status=window.LQ_AMBIENT_MUSIC_STATUS;
  const button=document.getElementById('lq-music-toggle');
  const shell=document.querySelector('.gameShell');
  const data={
    status:!!status,
    originalSynth:status?.originalSynth===true&&status?.externalAudio===false,
    autoplayOff:status?.autoplay===false&&status?.defaultPlaying===false&&status?.playing===false,
    notUnlockedBeforeGesture:status?.unlocked===false,
    twoThemes:Array.isArray(status?.themes)&&status.themes.includes('safe')&&status.themes.includes('wild'),
    explicitToggle:!!button&&button.tagName==='BUTTON'&&button.parentElement===shell,
    worldNotShrunk:!!shell&&shell.getBoundingClientRect().height>innerHeight*.8,
    inputWrappersUntouched:status?.inputWrappers===false,
    sfxOwnershipPreserved:status?.existingSfxOwnershipPreserved===true
  };
  let marker=document.getElementById('lqAmbientMusicRuntimeSmokeMarker');
  if(!marker){marker=document.createElement('i');marker.id='lqAmbientMusicRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
  Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
  const failed=Object.entries(data).find(([,v])=>!v);
  if(failed){
    const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');
    setTimeout(()=>{eval(`LQ_REQ036_AMBIENT_FAIL_${key}()`);},0);
  }
},80);
})();