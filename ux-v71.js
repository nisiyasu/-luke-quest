(() => {
'use strict';

/* LUKE QUEST v0.71 physical town landmark.
   Makes the central fountain a real collision/examine landmark rather than purely visual decoration. */

const FOUNTAIN={map:'town',x:8,y:8};
const blockedV70=blocked;
blocked=function(x,y){if(s.map===FOUNTAIN.map&&x===FOUNTAIN.x&&y===FOUNTAIN.y)return true;return blockedV70(x,y);};

function fountainAhead(){if(s.screen!=='world'||s.map!==FOUNTAIN.map)return false;const p=front();return p.x===FOUNTAIN.x&&p.y===FOUNTAIN.y;}
const actionV70=action;
action=function(){
 if(!s.dialog&&fountainAhead()){
   stopMoving();s.dialog={name:'王都中央広場の噴水',text:'澄んだ水がきらきら光っている。底には旅人が投げた小銭が見える。\nルーク「取ったら勇者じゃなくなる気がするので、見なかったことにします。」'};return render();
 }
 return actionV70();
};
window.LQ_TOWN_LANDMARK_STATUS={fountainCollision:true,fountainExamine:true};
})();
