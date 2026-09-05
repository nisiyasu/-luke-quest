(() => {
'use strict';

/* LUKE QUEST v0.64 original synthesized SFX layer.
   Uses Web Audio oscillators/noise only; no copied or external audio assets. */

s.settings=s.settings||{};
if(typeof s.settings.sound!=='boolean')s.settings.sound=true;
let audioCtx=null;

function ctx(){
 if(!s.settings.sound)return null;
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
 if(!audioCtx)audioCtx=new C();
 if(audioCtx.state==='suspended')void audioCtx.resume();
 return audioCtx;
}
function tone(freq,duration=.09,type='square',gain=.035,delay=0){
 const c=ctx();if(!c)return;const now=c.currentTime+delay;
 const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(0.0001,now);g.gain.exponentialRampToValueAtTime(gain,now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g).connect(c.destination);o.start(now);o.stop(now+duration+.02);
}
function sweep(from,to,duration=.1,type='sawtooth',gain=.026){
 const c=ctx();if(!c)return;const now=c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(from,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,to),now+duration);g.gain.setValueAtTime(gain,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g).connect(c.destination);o.start(now);o.stop(now+duration+.01);
}
function sfx(name){
 if(!s.settings.sound)return;
 if(name==='attack'){sweep(620,135,.11,'sawtooth',.025);tone(980,.045,'square',.018,.025);}
 else if(name==='skill'){tone(440,.07,'triangle',.025);tone(660,.08,'triangle',.028,.055);sweep(900,220,.14,'sawtooth',.025);}
 else if(name==='guard'){tone(170,.09,'square',.028);tone(125,.1,'triangle',.02,.045);}
 else if(name==='heal'){tone(523,.09,'sine',.03);tone(659,.1,'sine',.03,.07);tone(784,.12,'sine',.026,.14);}
 else if(name==='escape'){sweep(320,780,.13,'triangle',.022);}
 else if(name==='menu'){tone(330,.055,'square',.018);tone(440,.055,'square',.016,.045);}
 else if(name==='victory'){tone(523,.1,'triangle',.028);tone(659,.1,'triangle',.028,.09);tone(784,.15,'triangle',.03,.18);}
}
window.LQ_sfx=sfx;

const style=document.createElement('style');
style.textContent=`
.lqSoundBtn{grid-column:1/-1;min-height:44px;border-radius:10px;border:1px solid #ffffff1d;background:#162b3b;color:#b8c8d3;font-size:10px;font-weight:900;letter-spacing:.08em}.lqSoundBtn.on{color:#b9efc6;border-color:#77c78a44;background:#173326}
`;
document.head.appendChild(style);

function addSoundToggle(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const buttons=app.querySelector('.lqPauseButtons');if(!buttons||buttons.querySelector('.lqSoundBtn'))return;
 const b=document.createElement('button');b.className=`lqSoundBtn${s.settings.sound?' on':''}`;b.textContent=`SOUND　${s.settings.sound?'ON':'OFF'}`;b.onclick=()=>window.lqToggleSound();buttons.appendChild(b);
}
window.lqToggleSound=function(){s.settings.sound=!s.settings.sound;save();if(s.settings.sound)sfx('menu');render();};

const attackV63=attack;attack=function(){sfx('attack');return attackV63();};
const guardV63=guard;guard=function(){sfx('guard');return guardV63();};
const potionV63=potion;potion=function(){sfx('heal');return potionV63();};
const runAwayV63=runAway;runAway=function(){sfx('escape');return runAwayV63();};
if(window.lqFocusSlash){const skillV63=window.lqFocusSlash;window.lqFocusSlash=function(){sfx('skill');return skillV63();};}
const winV63=win;win=function(){const r=winV63();sfx('victory');return r;};
const openMenuV63=openMenu;openMenu=function(){sfx('menu');const r=openMenuV63();addSoundToggle();return r;};
const worldV63=world;world=function(){worldV63();addSoundToggle();};
const renderV63=render;render=function(){const r=renderV63();addSoundToggle();return r;};
window.LQ_AUDIO_STATUS={originalSynthSfx:true,externalAudio:false,toggle:true};
if(s.pauseOpen)addSoundToggle();
})();
