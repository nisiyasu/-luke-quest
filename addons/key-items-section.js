(() => {
'use strict';

/* Collision-safe add-on: dedicated key-item record. */
s.keyItems=Array.isArray(s.keyItems)?Array.from(new Set(s.keyItems.filter(x=>typeof x==='string'))):[];
const META={'森王の角':'魔物の森の強敵「苔角の森王」を退けた証。淡い苔の香りが残っている。'};
const style=document.createElement('style');style.textContent=`
.lqKeyItems{display:grid;gap:5px}.lqKeyItem{padding:7px 8px;border-radius:8px;background:linear-gradient(135deg,#28321f,#142019);border:1px solid #a8bd6750}.lqKeyItem b{display:block;color:#e7e0a0;font-size:9px}.lqKeyItem span{display:block;color:#8fa58d;font-size:8px;line-height:1.45;margin-top:2px}.lqKeyEmpty{color:#71879a;font-size:8px}
`;document.head.appendChild(style);
function addKeyItems(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqKeyItemSection'))return;const sec=document.createElement('div');sec.className='lqPauseSection lqKeyItemSection';sec.innerHTML=`<h3>KEY ITEMS</h3>${s.keyItems.length?`<div class=lqKeyItems>${s.keyItems.map(n=>`<div class=lqKeyItem><b>${n}</b><span>${META[n]||'冒険の重要な品。'}</span></div>`).join('')}</div>`:'<div class=lqKeyEmpty>まだ重要な品はありません。</div>'}`;const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const worldK=world;world=function(){worldK();addKeyItems();};const renderK=render;render=function(){const r=renderK();addKeyItems();return r;};window.LQ_KEY_ITEM_STATUS={dedicatedMenu:true};save();addKeyItems();
})();
