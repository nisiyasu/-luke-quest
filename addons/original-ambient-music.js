(() => {
'use strict';

/* REQ-036 + REQ-126 — original ambient music foundation and bounded volume control.
   Web Audio synthesis only. No sampled/external audio and no autoplay.
   This module never wraps canonical action/movement; it is presentation-only. */

const STORAGE_KEY='lq-music-preference-v1';
const VOLUME_STORAGE_KEY='lq-music-volume-v1';
const BUTTON_ID='lq-music-toggle';
const VOLUME_BUTTON_ID='lq-music-volume';
const STYLE_ID='lq-music-toggle-style';
const SAFE_MAPS=new Set(['town','innInterior','shopInterior','templeInterior','aldiaCivilianHome','aldiaCastleGatehouse','aldiaCastleCourtyard','aldiaCastleEntranceHall','aldiaCastleUpperGallery']);
const VOLUME_LEVELS=Object.freeze({LOW:.55,MID:.78,HIGH:1});
const VOLUME_ORDER=Object.freeze(['LOW','MID','HIGH']);
let audioCtx=null;
let sessionUnlocked=false;
let optedIn=false;
let playing=false;
let timer=0;
let generation=0;
let currentTheme='';
let volumeLevel=loadVolumeLevel();
const voices=new Set();

function storedPreference(){
  try{return localStorage.getItem(STORAGE_KEY)==='on';}catch(_){return false;}
}
function savePreference(on){
  try{localStorage.setItem(STORAGE_KEY,on?'on':'off');}catch(_){}
}
function loadVolumeLevel(){
  try{
    const raw=localStorage.getItem(VOLUME_STORAGE_KEY);
    return Object.prototype.hasOwnProperty.call(VOLUME_LEVELS,raw)?raw:'MID';
  }catch(_){return 'MID';}
}
function saveVolumeLevel(level){
  try{localStorage.setItem(VOLUME_STORAGE_KEY,level);}catch(_){}
}
function volumeScale(){return VOLUME_LEVELS[volumeLevel]??VOLUME_LEVELS.MID;}
function audioCtor(){return window.AudioContext||window.webkitAudioContext||null;}
function getContextFromGesture(){
  const C=audioCtor();
  if(!C)return null;
  try{
    if(!audioCtx)audioCtx=new C();
    if(audioCtx.state==='suspended')void audioCtx.resume();
    sessionUnlocked=true;
    return audioCtx;
  }catch(_){return null;}
}
function themeForState(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return 'none';
  return SAFE_MAPS.has(s.map)?'safe':'wild';
}
function stopVoices(){
  for(const o of [...voices]){try{o.stop();}catch(_){} voices.delete(o);}
}
function stopPlayback(){
  generation++;
  playing=false;
  currentTheme='';
  clearTimeout(timer);timer=0;
  stopVoices();
}
function tone(ctx,freq,start,dur,type,gain){
  try{
    const o=ctx.createOscillator(),g=ctx.createGain();
    const boundedGain=Math.max(.0001,Math.min(1,Number(gain)||.0001)*volumeScale());
    o.type=type;o.frequency.setValueAtTime(freq,start);
    g.gain.setValueAtTime(.0001,start);
    g.gain.exponentialRampToValueAtTime(boundedGain,start+.025);
    g.gain.exponentialRampToValueAtTime(.0001,start+dur);
    o.connect(g).connect(ctx.destination);
    voices.add(o);
    o.onended=()=>voices.delete(o);
    o.start(start);o.stop(start+dur+.03);
  }catch(_){}
}
function schedulePhrase(token){
  if(!playing||token!==generation||!audioCtx||audioCtx.state==='closed')return;
  const theme=themeForState();
  if(theme==='none'){stopPlayback();updateButtons();return;}
  currentTheme=theme;
  const now=audioCtx.currentTime+.03;
  if(theme==='safe'){
    const notes=[261.63,329.63,392.00,329.63,293.66,349.23,440.00,349.23];
    notes.forEach((f,i)=>tone(audioCtx,f,now+i*.24,.20,i%2?'sine':'triangle',.0065));
    tone(audioCtx,130.81,now,.80,'sine',.0038);
    tone(audioCtx,146.83,now+.96,.80,'sine',.0036);
  }else{
    const notes=[196.00,233.08,293.66,261.63,174.61,220.00,277.18,233.08];
    notes.forEach((f,i)=>tone(audioCtx,f,now+i*.27,.17,i%3===0?'triangle':'sine',.0054));
    tone(audioCtx,98.00,now,.92,'sine',.0032);
    tone(audioCtx,87.31,now+1.08,.78,'sine',.0030);
  }
  timer=setTimeout(()=>schedulePhrase(token),2400);
}
function startPlaybackFromGesture(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return false;
  const ctx=getContextFromGesture();
  if(!ctx)return false;
  stopPlayback();
  optedIn=true;savePreference(true);
  generation++;
  const token=generation;
  playing=true;
  schedulePhrase(token);
  updateButtons();
  return true;
}
function resumeUnlockedSession(){
  if(!sessionUnlocked||!optedIn||playing||themeForState()==='none'||!audioCtx)return;
  try{if(audioCtx.state==='suspended')void audioCtx.resume();}catch(_){}
  generation++;
  const token=generation;
  playing=true;
  schedulePhrase(token);
  updateButtons();
}
function disableMusic(){
  optedIn=false;savePreference(false);stopPlayback();
  try{if(audioCtx&&audioCtx.state==='running')void audioCtx.suspend();}catch(_){}
  updateButtons();
}
function toggle(ev){
  ev?.preventDefault?.();ev?.stopPropagation?.();
  if(optedIn&&playing){disableMusic();return;}
  startPlaybackFromGesture();
}
function cycleVolume(ev){
  ev?.preventDefault?.();ev?.stopPropagation?.();
  const idx=Math.max(0,VOLUME_ORDER.indexOf(volumeLevel));
  volumeLevel=VOLUME_ORDER[(idx+1)%VOLUME_ORDER.length];
  saveVolumeLevel(volumeLevel);
  updateButtons();
}
function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
#${BUTTON_ID},#${VOLUME_BUTTON_ID}{position:absolute;z-index:118;top:calc(env(safe-area-inset-top,0px) + 8px);width:auto;height:32px;padding:0 8px;margin:0;border:1px solid #ffffff38;border-radius:999px;background:#07111fc9;color:#fff7dd;font-size:10px;font-weight:900;line-height:30px;letter-spacing:.03em;box-shadow:0 3px 10px #0008;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);touch-action:manipulation}
#${BUTTON_ID}{right:calc(env(safe-area-inset-right,0px) + 8px);min-width:54px}
#${VOLUME_BUTTON_ID}{right:calc(env(safe-area-inset-right,0px) + 70px);min-width:48px}
#${BUTTON_ID}[data-playing="true"]{background:#173d48d9;border-color:#8de6cb80}
#${BUTTON_ID}:focus-visible,#${VOLUME_BUTTON_ID}:focus-visible{outline:2px solid #f6d35b;outline-offset:2px}
@media(max-width:430px){#${BUTTON_ID},#${VOLUME_BUTTON_ID}{top:calc(env(safe-area-inset-top,0px) + 6px);height:30px;line-height:28px;padding:0 7px;font-size:9px}#${VOLUME_BUTTON_ID}{right:calc(env(safe-area-inset-right,0px) + 66px)}}
`;
  document.head.appendChild(st);
}
function updateButtons(){
  const b=document.getElementById(BUTTON_ID);
  if(b){
    b.dataset.playing=String(playing);
    b.dataset.unlocked=String(sessionUnlocked);
    b.dataset.theme=currentTheme||themeForState();
    b.textContent=playing?'MUSIC ON':(storedPreference()&&!sessionUnlocked?'MUSIC ▶':'MUSIC OFF');
    b.setAttribute('aria-pressed',String(playing));
    b.setAttribute('aria-label',playing?'音楽をオフ':'音楽をオン');
  }
  const v=document.getElementById(VOLUME_BUTTON_ID);
  if(v){
    v.dataset.level=volumeLevel;
    v.textContent=`VOL ${volumeLevel}`;
    v.setAttribute('aria-label',`音楽音量 ${volumeLevel}。押すと次の音量へ変更`);
  }
}
function ensureButtons(){
  injectStyle();
  if(typeof s==='undefined'||!s||s.screen!=='world'){
    document.getElementById(BUTTON_ID)?.remove();
    document.getElementById(VOLUME_BUTTON_ID)?.remove();
    if(playing)stopPlayback();
    return;
  }
  const shell=document.querySelector('.gameShell');if(!shell)return;
  let b=document.getElementById(BUTTON_ID);
  if(!b){b=document.createElement('button');b.id=BUTTON_ID;b.type='button';b.className='lqExplicitControl';b.addEventListener('click',toggle);shell.appendChild(b);}
  else if(b.parentElement!==shell)shell.appendChild(b);
  let v=document.getElementById(VOLUME_BUTTON_ID);
  if(!v){v=document.createElement('button');v.id=VOLUME_BUTTON_ID;v.type='button';v.className='lqExplicitControl';v.addEventListener('click',cycleVolume);shell.appendChild(v);}
  else if(v.parentElement!==shell)shell.appendChild(v);
  updateButtons();
  if(sessionUnlocked&&optedIn&&!playing)resumeUnlockedSession();
  const next=themeForState();if(playing&&next!=='none'&&currentTheme&&next!==currentTheme){stopPlayback();resumeUnlockedSession();}
}

const renderBeforeMusic=typeof render==='function'?render:null;
if(renderBeforeMusic){render=function(){const r=renderBeforeMusic();ensureButtons();return r;};}
window.addEventListener('pagehide',()=>{stopPlayback();try{audioCtx?.suspend?.();}catch(_){}},{passive:true});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){stopPlayback();try{audioCtx?.suspend?.();}catch(_){};updateButtons();}
  else ensureButtons();
});
ensureButtons();

window.LQ_AMBIENT_MUSIC_STATUS={
  version:'1.1.0',
  externalAudio:false,
  originalSynth:true,
  autoplay:false,
  defaultPlaying:false,
  themes:['safe','wild'],
  explicitToggle:true,
  volumeLevels:[...VOLUME_ORDER],
  volumeMultipliers:{...VOLUME_LEVELS},
  defaultVolume:'MID',
  volumeStorageKey:VOLUME_STORAGE_KEY,
  inputWrappers:false,
  existingSfxOwnershipPreserved:true,
  get playing(){return playing;},
  get unlocked(){return sessionUnlocked;},
  get theme(){return currentTheme;},
  get volume(){return volumeLevel;},
  get volumeMultiplier(){return volumeScale();},
  cycleVolume,
  stop:disableMusic
};
})();