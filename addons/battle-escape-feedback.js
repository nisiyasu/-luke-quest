(() => {
'use strict';

/* Presentation-only escape feedback: failed and successful retreats get distinct motion cues. */
const style=document.createElement('style');style.textContent=`
.lqEscapeCue{position:fixed;z-index:200;left:50%;top:45%;transform:translate(-50%,-50%);min-width:150px;padding:10px 18px;border-radius:999px;background:#0b1624e8;border:2px solid #d6c57c;color:#f7edc6;text-align:center;font-size:11px;font-weight:950;letter-spacing:.08em;box-shadow:0 8px 24px #000a;pointer-events:none;animation:lqEscapeCue .65s ease-out forwards}.lqEscapeCue.fail{border-color:#bd735f;color:#ffd2c3}.lqEscapeCue:before{content:'» ';color:#e8d27f}.lqEscapeCue.fail:before{content:'× ';color:#e68c78}@keyframes lqEscapeCue{0%{opacity:0;transform:translate(-50%,-45%) scale(.9)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.02)}100%{opacity:0;transform:translate(-50%,-62%) scale(.98)}}@media(prefers-reduced-motion:reduce){.lqEscapeCue{animation:none;opacity:.85}}
`;
document.head.appendChild(style);
function cue(text,fail=false){const e=document.createElement('div');e.className='lqEscapeCue'+(fail?' fail':'');e.textContent=text;document.body.appendChild(e);setTimeout(()=>e.remove(),760);}
const runBase=runAway;runAway=function(){const before=s.screen,r=runBase();if(before==='battle'){const success=s.screen==='world';setTimeout(()=>cue(success?'退避成功':'退路を見失った',!success),0);}return r;};
window.LQ_ESCAPE_FEEDBACK_STATUS={active:true,presentationOnly:true,reducedMotion:true};
})();