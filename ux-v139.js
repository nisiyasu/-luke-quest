(() => {
'use strict';

/* LUKE QUEST v0.139 original synthesized map-transition cue. */
let C=null;function chime(){if(s.settings?.sfx===false)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;if(!C)C=new A();if(C.state==='suspended')void C.resume();const now=C.currentTime;[[293.66,0],[392,.055]].forEach(([f,d])=>{const o=C.createOscillator(),g=C.createGain(),t=now+d;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.008,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.12);o.connect(g).connect(C.destination);o.start(t);o.stop(t+.14);});}
const checkGateV138=checkGate;checkGate=function(){const before=s.map,r=checkGateV138();if(s.screen==='world'&&s.map!==before)chime();return r;};window.LQ_MAP_TRANSITION_SFX_STATUS={originalSynth:true,sfxSettingAware:true};
})();