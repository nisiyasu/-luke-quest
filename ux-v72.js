(() => {
'use strict';

/* LUKE QUEST v0.72 physical market stalls.
   Turns two decorative Royal Capital stalls into collision-aware, examinable world objects. */

const MARKET_TILES=new Map([
 ['2,9',{name:'朝採れ果実の露店',text:'赤い実と黄色い柑橘が山盛りに並んでいる。\n店番「勇者さん、森で腹が鳴っても魔物は食べないでね。」\nルーク「その予定だけは最初からありません。」'}],
 ['3,9',{name:'朝採れ果実の露店',text:'木箱には「王都南農園」と焼印がある。甘い香りがする。'}],
 ['14,9',{name:'旅道具の露店',text:'縄、火打石、雨よけ布。旅人向けの雑貨が手際よく束ねられている。\nルーク「こういうのを見ると冒険っぽいですね。見るだけなら。」'}],
 ['15,9',{name:'旅道具の露店',text:'棚の隅に「魔物よけの鈴・効果は気持ち次第」と書かれている。\nルーク「気持ち次第……。」'}]
]);
const blockedV71=blocked;
blocked=function(x,y){if(s.map==='town'&&MARKET_TILES.has(`${x},${y}`))return true;return blockedV71(x,y);};
function marketAhead(){if(s.screen!=='world'||s.map!=='town')return null;const p=front();return MARKET_TILES.get(`${p.x},${p.y}`)||null;}
const actionV71=action;
action=function(){const m=!s.dialog&&marketAhead();if(m){stopMoving();s.dialog={name:m.name,text:m.text};return render();}return actionV71();};
window.LQ_TOWN_MARKET_STATUS={physicalStallTiles:MARKET_TILES.size,examinable:true};
})();
