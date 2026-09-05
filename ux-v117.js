(() => {
'use strict';

/* LUKE QUEST v0.117 named interaction prompts.
   Makes A-button guidance identify the actual nearby character/object, improving first-look readability. */

const style=document.createElement('style');
style.textContent=`
.lqActionHint.lqNamedHint{display:grid;grid-template-columns:25px auto;grid-template-rows:auto auto;column-gap:7px;align-items:center;padding:6px 11px 6px 8px;border-radius:12px;text-align:left}
.lqActionHint.lqNamedHint>b{grid-row:1/3;margin:0!important}.lqActionHint .lqHintTarget{font-size:10px;color:#fff1b5;line-height:1.15;font-weight:950;max-width:190px;overflow:hidden;text-overflow:ellipsis}.lqActionHint .lqHintVerb{font-size:7px;color:#91a6b7;letter-spacing:.13em;line-height:1.2;margin-top:2px}
`;
document.head.appendChild(style);
function namedHint(){
 if(s.screen!=='world'||s.dialog)return;const hint=app.querySelector('.lqActionHint');if(!hint||hint.dataset.named==='1')return;const p=front(),n=currentNpcs().find(x=>x.x===p.x&&x.y===p.y);if(!n)return;
 let verb='TALK / EXAMINE';if(['lqInnDoor','lqShopDoor','lqTempleDoor'].includes(n.kind))verb='ENTER';else if(n.kind==='lqInnInteriorKeeper')verb='REST';else if(n.kind==='lqShopInteriorKeeper')verb='SHOP';else if(n.kind==='lqFieldChest')verb='OPEN';else if(n.kind==='lqTempleAltar')verb='EXAMINE';
 hint.dataset.named='1';hint.classList.add('lqNamedHint');hint.innerHTML=`<b>A</b><span class=lqHintTarget>${String(n.name||'調べる').replace(/[<>]/g,'')}</span><span class=lqHintVerb>${verb}</span>`;
}
const renderV116=render;render=function(){const r=renderV116();namedHint();return r;};
queueMicrotask(namedHint);
window.LQ_NAMED_HINT_STATUS={targetNames:true,contextVerbs:true};
})();