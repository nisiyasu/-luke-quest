(() => {
'use strict';

/* REQ-145 post-battle objective focus.
   Presentation-only. Observes canonical screen transitions and never owns input,
   save, story, battle resolution, reward, progression, or movement state. */

const STYLE_ID='lq-req145-post-battle-focus-style';
const FOCUS_CLASS='lq145PostBattleFocus';
let lastScreen=(typeof s!=='undefined'&&s&&s.screen)?String(s.screen):null;
let focusPresentations=0;
let cleanupTimer=0;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
body.lqReq145GoldSlice .questGuide.${FOCUS_CLASS}{
  border-color:rgba(240,201,91,.72)!important;
  box-shadow:0 0 0 2px rgba(240,201,91,.14),0 6px 22px rgba(0,0,0,.28)!important;
  animation:lq145PostBattleFocus .72s cubic-bezier(.18,.72,.28,1) both;
}
@keyframes lq145PostBattleFocus{
  0%{transform:translateY(3px);filter:brightness(1);}
  28%{transform:translateY(0);filter:brightness(1.18);}
  100%{transform:translateY(0);filter:brightness(1);}
}
@media(prefers-reduced-motion:reduce){
  body.lqReq145GoldSlice .questGuide.${FOCUS_CLASS}{animation:none!important;filter:none!important;}
}
`;
  document.head.appendChild(style);
}

function focusObjective(){
  if(typeof s==='undefined'||!s||s.screen!=='world'||s.dialog)return false;
  const guide=document.querySelector('.questGuide');
  if(!guide)return false;
  guide.classList.remove(FOCUS_CLASS);
  void guide.offsetWidth;
  guide.classList.add(FOCUS_CLASS);
  focusPresentations++;
  clearTimeout(cleanupTimer);
  cleanupTimer=setTimeout(()=>guide.classList.remove(FOCUS_CLASS),760);
  return true;
}

function observeScreen(){
  if(typeof s==='undefined'||!s)return;
  const current=String(s.screen||'');
  if(lastScreen==='battle'&&current==='world'){
    requestAnimationFrame(()=>focusObjective());
  }
  lastScreen=current;
}

installStyle();
const root=document.getElementById('app')||document.body;
const observer=new MutationObserver(observeScreen);
observer.observe(root,{childList:true,subtree:true});
observeScreen();

function smoke(){
  if(typeof s==='undefined'||!s||typeof render!=='function')return;
  const snapshot=structuredClone(s);
  const previousLast=lastScreen;
  const before=focusPresentations;
  try{
    s.screen='battle';s.dialog=null;render();observeScreen();
    s.screen='world';s.map='field';s.x=10;s.y=15;s.dir='up';s.dialog=null;render();observeScreen();
    setTimeout(()=>{
      const guide=document.querySelector('.questGuide');
      const marker=document.createElement('i');
      marker.id='lqReq145PostBattleFocusSmokeMarker';
      marker.hidden=true;
      marker.dataset.focusPresented=String(focusPresentations===before+1);
      marker.dataset.focusCount=String(focusPresentations-before);
      marker.dataset.focusClass=String(!!guide&&guide.classList.contains(FOCUS_CLASS));
      marker.dataset.inputAuthority='false';
      marker.dataset.saveAuthority='false';
      marker.dataset.storyAuthority='false';
      marker.dataset.battleAuthority='false';
      document.body.appendChild(marker);
      s=structuredClone(snapshot);lastScreen=previousLast;render();
    },80);
  }catch(error){
    const marker=document.createElement('i');
    marker.id='lqReq145PostBattleFocusSmokeFailure';
    marker.hidden=true;
    marker.dataset.error=String(error&&error.message||error);
    document.body.appendChild(marker);
    s=structuredClone(snapshot);lastScreen=previousLast;render();
  }
}

window.LQ_REQ145_POST_BATTLE_FOCUS_TEST={focusObjective,observeScreen,focusPresentations:()=>focusPresentations};
if(new URLSearchParams(location.search).has('lqReq145PostBattleSmoke'))setTimeout(smoke,0);
})();
