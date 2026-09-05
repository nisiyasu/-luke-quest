(() => {
'use strict';

/* LUKE QUEST v0.38 usable field items from the adventure menu. */

const style=document.createElement('style');
style.textContent=`
.lqFieldItemUse{margin-top:8px;display:flex;gap:8px;align-items:center}.lqUseHerbBtn{min-height:42px;padding:7px 11px;border-radius:9px;border:1px solid #8fd3a566;background:#24583a;color:#effff3;font-weight:900;font-size:11px}.lqUseHerbBtn:disabled{opacity:.42;background:#313c36}.lqFieldItemMsg{flex:1;color:#9eb5c5;font-size:10px;line-height:1.35}.lqFieldItemMsg.good{color:#9be8b1}.lqFieldItemMsg.bad{color:#f0b0a4}
`;
document.head.appendChild(style);

let fieldItemMsg='';let fieldItemKind='';
function addFieldItemControls(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const sections=Array.from(app.querySelectorAll('.lqPauseSection'));const itemSection=sections.find(x=>x.querySelector('h3')?.textContent.includes('ITEMS'));
 if(!itemSection||itemSection.querySelector('.lqFieldItemUse'))return;
 const row=document.createElement('div');row.className='lqFieldItemUse';
 const disabled=s.potions<=0||s.hp>=s.mh;
 row.innerHTML=`<button class=lqUseHerbBtn ${disabled?'disabled':''} onclick=lqUseFieldHerb()>薬草を使う</button><div class="lqFieldItemMsg ${fieldItemKind}">${fieldItemMsg|| (s.hp>=s.mh?'HPは満タン':s.potions<=0?'薬草を持っていない':'HPを22回復')}</div>`;
 itemSection.appendChild(row);
}
window.lqUseFieldHerb=function(){
 if(!s.pauseOpen||s.potions<=0||s.hp>=s.mh)return;
 const before=s.hp;s.potions--;s.hp=Math.min(s.mh,s.hp+22);fieldItemMsg=`HP ${before} → ${s.hp}　薬草 残り${s.potions}個`;fieldItemKind='good';save();render();
};

const worldV37=world;
world=function(){worldV37();addFieldItemControls();};
const renderV37=render;
render=function(){const r=renderV37();if(s.pauseOpen)addFieldItemControls();return r;};
window.LQ_FIELD_ITEM_STATUS={herbUseFromMenu:true,healAmount:22};
if(s.pauseOpen)addFieldItemControls();
})();
