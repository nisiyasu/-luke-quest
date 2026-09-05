(() => {
'use strict';

/* Gameplay add-on: one persistent herb harvest in the optional forest clearing. */
s.flags=s.flags||{};
const FLAG='forestClearingHerbHarvested';
function herbAhead(){
 if(s.screen!=='world'||s.map!=='forestClearing')return false;
 const p=front();
 return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqClearingHerbs');
}
function harvest(){
 stopMoving();
 s.potions=Math.max(0,Number(s.potions)||0)+1;
 s.flags[FLAG]=true;
 save();
 window.LQ_sfx?.('chest');
 s.dialog={name:'薬草の群生',text:'傷のない葉だけを少し摘んだ。\n薬草を 1個 手に入れた。\nルーク「全部取らない。僕、こういうところだけ勇者っぽいですね。」'};
 render();
}
const actionBase=action;
action=function(){
 if(!s.dialog&&!s.flags[FLAG]&&herbAhead())return harvest();
 return actionBase();
};
window.LQ_FOREST_CLEARING_HARVEST_STATUS={map:'forestClearing',item:'薬草',amount:1,oneTime:true,persistent:true};
})();