(() => {
'use strict';

/* Gameplay add-on: the new roadside shrine has one persistent restorative blessing. */
s.flags=s.flags||{};
const FLAG='wayfarerShrineBlessingUsed';
function basinAhead(){
 if(s.screen!=='world'||s.map!=='wayfarerShrine')return false;
 const p=front();
 return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqShrineBasin');
}
function useBlessing(){
 stopMoving();
 const before=s.hp;
 const amount=Math.max(1,Math.ceil(s.mh*.35));
 s.hp=Math.min(s.mh,s.hp+amount);
 s.flags[FLAG]=true;
 save();
 window.LQ_sfx?.('heal');
 const healed=s.hp-before;
 s.dialog={name:'旅人の水鉢',text:healed>0?`冷たい水で手と顔を清めると、不思議なくらい身体が軽くなった。\nHPが ${healed} 回復した。\nルーク「効きました。……これ、勇者の力じゃなくて単に水分不足だった可能性ありません？」`:`水鉢は静かに光を返している。\nルーク「HPは満タンです。でも気持ちのHPはもう少し欲しいです。」`};
 render();
}
const actionBase=action;
action=function(){
 if(!s.dialog&&!s.flags[FLAG]&&basinAhead())return useBlessing();
 return actionBase();
};
window.LQ_WAYFARER_SHRINE_BLESSING_STATUS={map:'wayfarerShrine',oneTime:true,persistent:true,healRatio:.35};
})();