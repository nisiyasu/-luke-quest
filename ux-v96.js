(() => {
'use strict';

/* LUKE QUEST v0.96 building-door de-emoji pass.
   Replaces exterior/interior door emoji for the four currently walkable Royal Capital buildings. */

const EXTERIOR_DOORS={lqInnDoor:'lqDoorInn',lqShopDoor:'lqDoorShop',lqTempleDoor:'lqDoorTemple',lqResidenceDoor:'lqDoorHome'};
for(const n of MAPS.town.npcs||[])if(EXTERIOR_DOORS[n.kind])n.e='';
const npcClassV95=npcClass;
npcClass=function(n){const k=EXTERIOR_DOORS[n?.kind];return k?`npc lqBuildingDoor ${k}`:npcClassV95(n);};
const tileEmojiV95=tileEmoji;
tileEmoji=function(c){if(['innInterior','shopInterior','templeInterior','residenceInterior'].includes(s.map)&&c==='G')return'';return tileEmojiV95(c);};

const style=document.createElement('style');
style.textContent=`
.lqBuildingDoor{width:42px;height:46px;font-size:0;border-radius:5px 5px 1px 1px;border:3px solid #92704b;background:linear-gradient(90deg,#4e3123,#75503a 48%,#452b21);box-shadow:inset 0 0 0 2px #2c1d17,0 6px 5px #0007}.lqBuildingDoor:before{content:"";position:absolute;left:5px;right:5px;top:5px;height:10px;border:1px solid #9e7c57;background:#5a3a2a;box-shadow:0 17px 0 #5a3a2a}.lqBuildingDoor:after{content:"";position:absolute;right:6px;top:22px;width:5px;height:5px;border-radius:50%;background:#e1c06b;box-shadow:0 0 3px #fff2a6}.lqDoorShop{border-color:#b5945c;background:linear-gradient(90deg,#3f503d,#657456 48%,#364737)}.lqDoorShop:after{background:#f0d575}.lqDoorTemple{border-color:#a9bbc5;background:linear-gradient(90deg,#3f4f5b,#6b7e8a 48%,#364550);border-radius:14px 14px 2px 2px}.lqDoorTemple:before{background:#556875;border-color:#c6d4db;box-shadow:0 17px 0 #556875}.lqDoorTemple:after{left:50%;right:auto;top:8px;width:3px;height:28px;border-radius:0;background:#d0b15d;box-shadow:-6px 8px 0 -1px #d0b15d,6px 8px 0 -1px #d0b15d}.lqDoorHome{border-color:#9e7246;background:linear-gradient(90deg,#563725,#7c5437 50%,#4b3022)}
.tile.lqInnDoorTile,.tile.lqShopDoorTile,.tile.lqTempleDoorTile,.tile.lqResidenceDoorTile{position:absolute;font-size:0!important}.tile.lqInnDoorTile:before,.tile.lqShopDoorTile:before,.tile.lqTempleDoorTile:before,.tile.lqResidenceDoorTile:before{content:"";position:absolute;left:9px;right:9px;top:4px;bottom:0;border-radius:7px 7px 1px 1px;background:linear-gradient(90deg,#493022,#765034 48%,#42291e);border:2px solid #bd9259;box-shadow:inset 0 0 0 2px #2b1d17}.tile.lqTempleDoorTile:before{border-radius:15px 15px 1px 1px;background:linear-gradient(90deg,#44545f,#72828c 48%,#3c4a55);border-color:#b9c7ce}
`;
document.head.appendChild(style);
window.LQ_BUILDING_DOOR_ART_STATUS={exteriorDoors:Object.keys(EXTERIOR_DOORS).length,interiorDoorEmojiRemoved:true};
if(s.screen==='world')render();
})();
