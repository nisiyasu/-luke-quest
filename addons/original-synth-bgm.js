(() => {
'use strict';

/* Collision-safe add-on: original lightweight synthesized BGM.
   All note patterns are newly authored here; no external or existing-game audio is used. */
s.settings=s.settings||{};if(typeof s.settings.music!=='boolean')s.settings.music=true;
let musicCtx=null,musicTimer=null,musicStep=0,lastMode='';
const PATTERNS={
 town:{tempo:420,wave:'triangle',gain:.012,notes:[261.63,329.63,392,329.63,293.66,349.23,440,349.23]},
 field:{tempo:360,wave:'triangle',gain:.011,notes:[293.66,369.99,440,369.99,329.63,392,493.88,392]},
 forest:{tempo:500,wave:'sine',gain:.014,notes:[220,261.63,329.63,261.63,196,246.94,293.66,246.94]},
 deepForest:{tempo:560,wave:'sine',gain:.013,notes:[196,233.08,293.66,233.08,174.61,220,261.63,220]},
 mistTrail:{tempo:610,wave:'sine',gain:.011,notes:[174.61,220,261.63,220,164.81,207.65,246.94,207.65]},
 observation:{tempo:520,wave:'triangle',gain:.01,notes:[164.81,196,246.94,196,146.83,185,220,185]},
 evacRoute:{tempo:470,wave:'triangle',gain:.011,notes:[185,233.08,277.18,233.08,174.61,220,261.63,220]},
 cliffRoad:{tempo:430,wave:'triangle',gain:.011,notes:[220,277.18,329.63,277.18,246.94,293.66,369.99,293.66]},
 interior:{tempo:580,wave:'sine',gain:.009,notes:[261.63,329.63,392,329.63,246.94,311.13,369.99,311.13]},
 battle:{tempo:260,wave:'square',gain:.008,notes:[146.83,220,174.61,233.08,164.81,246.94,185,277.18]}
};
function mode(){if(s.screen==='battle')return'battle';if(['innInterior','shopInterior','templeInterior','residenceInterior'].includes(s.map))return'interior';return PATTERNS[s.map]?s.map:'town';}
function context(){if(!s.settings.music)return null;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!musicCtx)musicCtx=new C();if(musicCtx.state==='suspended')void musicCtx.resume();return musicCtx;}
function note(freq,dur,wave,gain){const c=context();if(!c)return;const now=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type=wave;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(gain,now+.035);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g).connect(c.destination);o.start(now);o.stop(now+dur+.04);}
function tick(){if(document.visibilityState!=='visible'||!s.settings.music)return;const m=mode(),p=PATTERNS[m]||PATTERNS.town;if(lastMode!==m){lastMode=m;musicStep=0;}const f=p.notes[musicStep%p.notes.length];note(f,p.tempo/1000*.82,p.wave,p.gain);if(m!=='battle'&&musicStep%4===0)note(f/2,p.tempo/1000*1.5,'sine',p.gain*.55);musicStep++;schedule();}
function schedule(){clearTimeout(musicTimer);const p=PATTERNS[mode()]||PATTERNS.town;musicTimer=setTimeout(tick,p.tempo);}
function startMusic(){if(!s.settings.music)return;context();if(!musicTimer)tick();}
function stopMusic(){clearTimeout(musicTimer);musicTimer=null;}
window.lqToggleMusic=function(){s.settings.music=!s.settings.music;save();if(s.settings.music)startMusic();else stopMusic();render();};
for(const ev of ['pointerdown','keydown'])window.addEventListener(ev,startMusic,{once:false,passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')stopMusic();else startMusic();});
const style=document.createElement('style');style.textContent=`.lqMusicBtn{grid-column:1/-1;min-height:44px;border-radius:10px;border:1px solid #ffffff1d;background:#182638;color:#aebdca;font-size:10px;font-weight:900;letter-spacing:.08em}.lqMusicBtn.on{color:#d6c8f0;border-color:#a58bc655;background:#2b2440}`;document.head.appendChild(style);
function addToggle(){if(!s.pauseOpen)return;const buttons=app.querySelector('.lqPauseButtons');if(!buttons||buttons.querySelector('.lqMusicBtn'))return;const b=document.createElement('button');b.className=`lqMusicBtn${s.settings.music?' on':''}`;b.textContent=`MUSIC　${s.settings.music?'ON':'OFF'}`;b.onclick=()=>window.lqToggleMusic();buttons.appendChild(b);}
const worldMusic=world;world=function(){const old=lastMode,r=worldMusic();if(old!==mode()&&musicTimer){stopMusic();startMusic();}addToggle();return r;};const battleMusic=battle;battle=function(){const old=lastMode,r=battleMusic();if(old!==mode()&&musicTimer){stopMusic();startMusic();}return r;};const renderMusic=render;render=function(){const old=lastMode,r=renderMusic();if(old!==mode()&&musicTimer){stopMusic();startMusic();}addToggle();return r;};window.LQ_BGM_STATUS={originalSynth:true,externalAudio:false,mapThemes:Object.keys(PATTERNS).length,autoplayRequiresGesture:true};addToggle();
})();
