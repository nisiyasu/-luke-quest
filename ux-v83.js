(() => {
'use strict';

/* LUKE QUEST v0.83 original interaction SFX.
   Extends the synth-audio layer with door and treasure cues using Web Audio only. */

let v83ctx=null;
function c83(){if(s.settings?.sound===false)return null;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;if(!v83ctx)v83ctx=new C();if(v83ctx.state==='suspended')void v83ctx.resume();return v83ctx;}
function t83(freq,dur=.08,type='triangle',gain=.02,delay=0){const c=c83();if(!c)return;const n=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,n);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(gain,n+.006);g.gain.exponentialRampToValueAtTime(.0001,n+dur);o.connect(g).connect(c.destination);o.start(n);o.stop(n+dur+.02);}
function extraSfx(name){
 if(name==='door'){t83(150,.07,'square',.018);t83(105,.11,'triangle',.018,.055);}
 if(name==='chest'){t83(392,.07,'triangle',.021);t83(523,.08,'triangle',.024,.06);t83(659,.11,'sine',.025,.13);}
 if(name==='clue'){t83(330,.05,'sine',.016);t83(494,.09,'triangle',.02,.055);}
}
const oldSfx=window.LQ_sfx;window.LQ_sfx=function(name){if(oldSfx)oldSfx(name);extraSfx(name);};

const INTERIORS=new Set(['innInterior','shopInterior','templeInterior']);
const checkGateV82=checkGate;
checkGate=function(){const before=s.map;const r=checkGateV82();if(before!==s.map&&(INTERIORS.has(before)||INTERIORS.has(s.map)))window.LQ_sfx?.('door');return r;};

const actionV82=action;
action=function(){
 const before={field:!!s.flags?.fieldChestOpened,forest:!!s.flags?.forestCacheOpened,deep:!!s.flags?.deepCacheOpened,clasp:!!s.flags?.elderCharmFound};
 const r=actionV82();
 if(!before.field&&s.flags?.fieldChestOpened||!before.forest&&s.flags?.forestCacheOpened||!before.deep&&s.flags?.deepCacheOpened)window.LQ_sfx?.('chest');
 else if(!before.clasp&&s.flags?.elderCharmFound)window.LQ_sfx?.('clue');
 return r;
};
window.LQ_INTERACTION_AUDIO_STATUS={door:true,chest:true,clue:true,externalAudio:false};
})();
