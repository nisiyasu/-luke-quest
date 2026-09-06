(() => {
'use strict';

/* REQ-036 + REQ-126 browser acceptance. Runs only in the existing lqTouchSmoke harness. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const status=window.LQ_AMBIENT_MUSIC_STATUS;
  const button=document.getElementById('lq-music-toggle');
  const volumeButton=document.getElementById('lq-music-volume');
  const shell=document.querySelector('.gameShell');
  const levels=status?.volumeLevels;
  const multipliers=status?.volumeMultipliers;
  const unlockedBefore=status?.unlocked;
  const playingBefore=status?.playing;
  let volumeCycleSafe=false;
  if(volumeButton&&status?.cycleVolume){
    const before=status.volume;
    volumeButton.click();
    const after=status.volume;
    volumeCycleSafe=before!==after&&status.unlocked===unlockedBefore&&status.playing===playingBefore;
  }
  const data={
    status:!!status,
    originalSynth:status?.originalSynth===true&&status?.externalAudio===false,
    autoplayOff:status?.autoplay===false&&status?.defaultPlaying===false&&status?.playing===false,
    notUnlockedBeforeGesture:status?.unlocked===false,
    twoThemes:Array.isArray(status?.themes)&&status.themes.includes('safe')&&status.themes.includes('wild'),
    explicitToggle:!!button&&button.tagName==='BUTTON'&&button.parentElement===shell,
    volumeControl:!!volumeButton&&volumeButton.tagName==='BUTTON'&&volumeButton.parentElement===shell&&volumeButton.classList.contains('lqExplicitControl'),
    volumeLevels:Array.isArray(levels)&&levels.join(',')==='LOW,MID,HIGH'&&status?.defaultVolume==='MID',
    boundedMultipliers:!!multipliers&&Object.values(multipliers).every(v=>Number.isFinite(v)&&v>0&&v<=1),
    volumeCycleNoAutoplay:volumeCycleSafe,
    separateVolumeStorage:typeof status?.volumeStorageKey==='string'&&status.volumeStorageKey!=='lq-music-preference-v1',
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
    setTimeout(()=>{eval(`LQ_REQ036_126_AMBIENT_FAIL_${key}()`);},0);
  }
},80);
})();