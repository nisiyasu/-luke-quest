(() => {
'use strict';

/* LUKE QUEST v0.115 original interior doorway tiles.
   Removes the remaining emoji door presentation from the three walkable interiors. */

const style=document.createElement('style');
style.textContent=`
.tile.lqInnDoorTile,.tile.lqShopDoorTile,.tile.lqTempleDoorTile{font-size:0!important;position:absolute;overflow:visible}
.tile.lqInnDoorTile:before,.tile.lqShopDoorTile:before,.tile.lqTempleDoorTile:before{content:"";position:absolute;left:9px;top:4px;width:30px;height:42px;border-radius:14px 14px 2px 2px;box-sizing:border-box}
.tile.lqInnDoorTile:before{background:linear-gradient(90deg,#5a3823,#8c5b34 47%,#4b2e1e);border:3px solid #bd8953;box-shadow:inset 0 0 0 2px #362116,0 -5px 0 -1px #4b3525}
.tile.lqInnDoorTile:after,.tile.lqShopDoorTile:after,.tile.lqTempleDoorTile:after{content:"";position:absolute;width:5px;height:5px;border-radius:50%;top:25px;left:31px}
.tile.lqInnDoorTile:after{background:#e6c46f;box-shadow:0 0 4px #ffd980}
.tile.lqShopDoorTile:before{background:linear-gradient(90deg,#655034,#a18451 48%,#594329);border:3px solid #d0aa67;box-shadow:inset 0 0 0 2px #3d2d1d}
.tile.lqShopDoorTile:after{background:#cfb266;box-shadow:0 0 4px #f4df99}
.tile.lqTempleDoorTile:before{background:linear-gradient(90deg,#45515b,#75848e 48%,#3d4851);border:3px solid #b7c5cc;box-shadow:inset 0 0 0 2px #29343c,0 0 9px #bdeaff18}
.tile.lqTempleDoorTile:after{background:#d8c473;box-shadow:0 0 5px #fff0a4}
.tile.lqTempleDoorTile{background:linear-gradient(#788690,#3e4b55)!important}.tile.lqInnDoorTile{background:linear-gradient(#9c7045,#5a3824)!important}.tile.lqShopDoorTile{background:linear-gradient(#b39761,#675039)!important}
`;
document.head.appendChild(style);
window.LQ_INTERIOR_DOOR_STATUS={inn:true,shop:true,temple:true,emojiRemoved:true};
})();