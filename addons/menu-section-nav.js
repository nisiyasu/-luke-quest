(() => {
'use strict';

/* Collision-safe add-on: compact section navigator for the now content-rich iPhone adventure menu. */
const style=document.createElement('style');style.textContent=`
.lqPauseTop{position:sticky!important;top:-10px;z-index:12;background:linear-gradient(180deg,#10253b 82%,transparent);padding-top:7px}.lqMenuNav{position:sticky;top:42px;z-index:11;display:flex;gap:5px;overflow-x:auto;padding:5px 1px 7px;margin:-3px 0 7px;background:linear-gradient(180deg,#0d2032 72%,transparent);scrollbar-width:none}.lqMenuNav::-webkit-scrollbar{display:none}.lqMenuNav button{flex:0 0 auto;min-height:32px;padding:5px 8px;border-radius:999px;border:1px solid #ffffff18;background:#112a3c;color:#aebfcc;font-size:7px;font-weight:900;letter-spacing:.06em}.lqMenuNav button.primary{border-color:#d4b75f55;color:#f0d98e;background:#3c3420}.lqMenuQuickClose{width:34px;height:34px;min-height:34px;border-radius:50%;border:1px solid #ffffff22;background:#23394c;color:#e9f0f4;font-size:15px;font-weight:950}.lqPauseSection{scroll-margin-top:86px}
`;document.head.appendChild(style);
function buildNav(){
 if(!s.pauseOpen)return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqMenuNav'))return;const top=panel.querySelector('.lqPauseTop');if(!top)return;
 if(!top.querySelector('.lqMenuQuickClose')){const close=document.createElement('button');close.className='lqMenuQuickClose';close.textContent='×';close.setAttribute('aria-label','冒険へ戻る');close.onclick=()=>window.lqClosePause();top.appendChild(close);}
 const sections=Array.from(panel.querySelectorAll('.lqPauseSection')).filter(x=>x.querySelector('h3'));if(!sections.length)return;const nav=document.createElement('div');nav.className='lqMenuNav';sections.forEach((sec,i)=>{if(!sec.id)sec.id=`lqMenuSec${i}`;const label=sec.querySelector('h3').childNodes[0]?.textContent?.trim()||`SECTION ${i+1}`;const b=document.createElement('button');b.textContent=label.replace('DISCOVERED ','').replace('MONSTER ','MONSTERS');if(i===0)b.classList.add('primary');b.onclick=()=>sec.scrollIntoView({behavior:'smooth',block:'start'});nav.appendChild(b);});top.after(nav);
}
function defer(){queueMicrotask(buildNav);}
const worldN=world;world=function(){worldN();defer();};const renderN=render;render=function(){const r=renderN();defer();return r;};window.LQ_MENU_NAV_STATUS={stickyTop:true,sectionJump:true,quickClose:true};defer();
})();
