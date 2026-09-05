(() => {
'use strict';

/* LUKE QUEST v0.91 Royal Capital home interior.
   Adds the first ordinary residence, expanding the city beyond service buildings. */

MAPS.residenceInterior={
 name:'王都アルディア・仕立屋の家',w:11,h:9,
 tiles:['###########','#.........#','#.........#','#.........#','#.........#','#.........#','#.........#','#.........#','#####G#####'],
 npcs:[
  {x:6,y:3,e:'',name:'仕立屋のセラ',kind:'lqResidenceTailor',text:'勇者さまでも裾はほつれます。魔物より先に服が負けたら、ここへ持ってきてください。'},
  {x:3,y:3,e:'',name:'大きな裁縫机',kind:'lqResidenceProp',text:'布、糸、針、革片がきれいに分類されている。\nルーク「僕の荷物より統率されています。」'},
  {x:7,y:5,e:'',name:'古い家族写真',kind:'lqResidenceProp',text:'何世代かの家族が王都の同じ通りで暮らしてきたようだ。裏には「人は街をつくり、街も人をつくる」と書かれている。'}
 ]
};
const door={x:12,y:5,e:'',name:'仕立屋の家',kind:'lqResidenceDoor',text:'王都の小さな民家。'};
if(!MAPS.town.npcs.some(n=>n.kind===door.kind))MAPS.town.npcs.push(door);

const tileClassV90=tileClass;
tileClass=function(c){if(s.map==='residenceInterior'){if(c==='#')return'wall lqResidenceWall';if(c==='G')return'gate lqResidenceDoorTile';return'lqResidenceFloor';}return tileClassV90(c);};
const tileEmojiV90=tileEmoji;
tileEmoji=function(c){if(s.map==='residenceInterior')return'';return tileEmojiV90(c);};
const npcClassV90=npcClass;
npcClass=function(n){if(n?.kind==='lqResidenceDoor')return'npc lqResidenceDoor';if(n?.kind==='lqResidenceTailor')return'npc lqResidenceTailor';if(n?.kind==='lqResidenceProp')return'npc lqResidenceProp';return npcClassV90(n);};

const style=document.createElement('style');
style.textContent=`
.tile.lqResidenceFloor{background:repeating-linear-gradient(90deg,#9b754c 0 22px,#896540 22px 24px);box-shadow:inset 0 1px #d0a87838}.tile.lqResidenceWall{background:linear-gradient(#6e6557,#514a40);box-shadow:inset 0 -8px #302c27aa}.tile.lqResidenceDoorTile{background:linear-gradient(#a97945,#654428);box-shadow:inset 0 0 0 3px #d8ad6c55}.lqResidenceDoor{width:42px;height:46px;font-size:0;background:linear-gradient(#6b412a,#4a2c20);border:3px solid #b07c49;border-radius:4px 4px 1px 1px;box-shadow:inset 0 0 0 2px #321d16,0 5px 5px #0007}.lqResidenceDoor:after{content:"";position:absolute;right:6px;top:22px;width:5px;height:5px;border-radius:50%;background:#d5b968}.lqResidenceTailor{width:40px;height:46px;font-size:0}.lqResidenceTailor:before{content:"";position:absolute;left:10px;top:2px;width:20px;height:20px;border-radius:48%;background:linear-gradient(#765048 0 32%,#dfae88 33%);border:2px solid #51352f}.lqResidenceTailor:after{content:"";position:absolute;left:6px;top:20px;width:28px;height:25px;border-radius:9px 9px 5px 5px;background:linear-gradient(#854f66,#543548);border:2px solid #3d2935;box-shadow:inset 0 -7px #34233066}.lqResidenceProp{width:42px;height:42px;font-size:0;background:linear-gradient(145deg,#926742,#59402c);border:2px solid #b58a5e;border-radius:7px;box-shadow:0 4px 5px #0006}.lqResidenceProp:after{content:"✦";position:absolute;right:3px;top:2px;color:#e5d5a0;font-size:9px}.lqResidenceRug{position:absolute;z-index:2;left:3.2rem;top:5rem;width:220px;height:95px;border-radius:12px;background:repeating-linear-gradient(90deg,#31546a 0 15px,#47758a 15px 30px,#b38a4e 30px 34px);border:3px solid #d0ab66;opacity:.78;pointer-events:none}
`;
document.head.appendChild(style);

function frontNpc91(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterResidence(){stopMoving();s.map='residenceInterior';s.x=5;s.y=6;s.dir='up';s.dialog={name:'仕立屋の家',text:'小さな家の中は、布と木の匂いで満ちている。\nルーク「民家に入っても怒られない。勇者の数少ない特典かもしれません。」'};render();}
const checkGateV90=checkGate;
checkGate=function(){if(s.map==='residenceInterior'&&(MAPS.residenceInterior.tiles[s.y]||'')[s.x]==='G'){stopMoving();s.map='town';s.x=12;s.y=6;s.dir='down';s.dialog={name:'仕立屋の家',text:'家を出て王都の通りへ戻った。'};return;}return checkGateV90();};
const actionV90=action;
action=function(){if(!s.dialog&&s.map==='town'&&frontNpc91()?.kind==='lqResidenceDoor')return enterResidence();return actionV90();};
function decorateResidence(){if(s.screen!=='world'||s.map!=='residenceInterior')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqResidenceRug'))return;const rug=document.createElement('div');rug.className='lqResidenceRug';w.appendChild(rug);}
const worldV90=world;world=function(){worldV90();decorateResidence();};const renderV90=render;render=function(){const r=renderV90();decorateResidence();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{residenceInterior:{entryMap:'town',exitMap:'town',type:'home'}});
if(s.screen==='world')render();
})();
