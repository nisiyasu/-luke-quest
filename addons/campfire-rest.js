(() => {
'use strict';

/* Collision-safe add-on: one-time optional forest campfire recovery using the existing warm campfire clue. */
s.flags=s.flags||{};
const FLAG='forestCampRested';
function campAhead(){if(s.screen!=='world'||s.map!=='forest')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.name==='消えかけの焚き火');}
function rest(){
 const before=s.hp;s.hp=s.mh;s.flags[FLAG]=true;save();window.LQ_sfx?.('heal');
 const healed=Math.max(0,s.hp-before);
 s.dialog={name:'ルーク',text:healed>0?`まだ火が残っている。少しだけ休むことにした。\nHPが ${healed} 回復した。\nルーク「人の焚き火で休む勇者……。怒られたら勇者権限ってことで……だめですよね。」`:`火はまだ温かい。\nルーク「休みたい気持ちは満タンなんですが、HPも満タンでした。」`};
 render();
}
const actionBase=action;action=function(){if(!s.dialog&&!s.flags[FLAG]&&campAhead()){stopMoving();return rest();}return actionBase();};
window.LQ_CAMPFIRE_REST_STATUS={map:'forest',oneTime:true,persistent:true,fullHeal:true};
})();
