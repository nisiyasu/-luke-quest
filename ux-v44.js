(() => {
'use strict';

/* LUKE QUEST v0.44 terrain art pass.
   Removes repeated environment emoji from core roof/tree/rock tiles and replaces them with original CSS tile treatment. */

const tileEmojiV43=tileEmoji;
tileEmoji=function(c){
 if(c==='H'||c==='*'||c==='^')return '';
 return tileEmojiV43(c);
};

const style=document.createElement('style');
style.textContent=`
.tile{overflow:hidden}
.tile.grass{background:
 radial-gradient(circle at 14% 74%,#8ec66a 0 2px,transparent 3px),
 radial-gradient(circle at 72% 27%,#77b35a 0 2px,transparent 3px),
 linear-gradient(145deg,#639e49,#4f8b3f)}
.tile.forest{background:
 radial-gradient(ellipse at 30% 82%,#315f34 0 9%,transparent 11%),
 linear-gradient(145deg,#2c6338,#22502f)}
.tile.deep{background:
 radial-gradient(circle at 74% 18%,#355b3a 0 5%,transparent 6%),
 linear-gradient(145deg,#1b422b,#123421)}
.tile.tree{background:linear-gradient(145deg,#376c36,#28582e)}
.tile.tree:before{content:"";position:absolute;left:7px;top:2px;width:34px;height:38px;background:linear-gradient(150deg,#4f963f,#235f31 65%,#174627);clip-path:polygon(50% 0,68% 23%,61% 23%,82% 48%,70% 48%,94% 78%,61% 78%,61% 100%,39% 100%,39% 78%,6% 78%,30% 48%,18% 48%,39% 23%,32% 23%);filter:drop-shadow(0 4px 3px #173719aa)}
.tile.tree:after{content:"";position:absolute;left:21px;bottom:0;width:7px;height:12px;background:#62442d;border-radius:2px;box-shadow:inset 2px 0 #8c6441}
.tile.roof{background:
 repeating-linear-gradient(90deg,#873b37 0 11px,#a74b42 11px 22px),
 linear-gradient(#b8574e,#743330)}
.tile.roof:before{content:"";position:absolute;inset:5px 0 auto;height:2px;background:#d47a69aa;box-shadow:0 11px #642c2c99,0 22px #d47a6966,0 33px #642c2c99}
.tile.roof:after{content:"";position:absolute;left:-6px;right:-6px;bottom:1px;height:7px;background:linear-gradient(#542729,#2e171a);box-shadow:0 -2px #d18a66aa}
.tile.rock{background:linear-gradient(145deg,#626662,#4c514f)}
.tile.rock:before{content:"";position:absolute;left:6px;top:9px;width:36px;height:30px;border-radius:48% 54% 36% 41%;background:linear-gradient(145deg,#8a8e89,#555b58 58%,#3b403e);border:2px solid #454a47;box-shadow:inset 7px 5px #b1b4ad55,0 4px 4px #28302c77}
.tile.rock:after{content:"";position:absolute;left:15px;top:15px;width:14px;height:4px;border-radius:50%;background:#c4c7bf55;transform:rotate(-18deg)}
.tile.water{background:
 repeating-linear-gradient(165deg,transparent 0 10px,#86bdd044 11px 13px,transparent 14px 23px),
 linear-gradient(145deg,#39759c,#2d6086)}
.tile.water:before{content:"";position:absolute;left:5px;top:12px;width:20px;height:3px;border-radius:50%;background:#b9e5ed88;box-shadow:18px 14px #a7d7e388,-8px 27px #8ec5d788;animation:lqWaterGlint 2.2s ease-in-out infinite alternate}@keyframes lqWaterGlint{to{transform:translateX(5px);opacity:.55}}
.tile.wall{background:
 linear-gradient(90deg,transparent 48%,#5c5146 49% 53%,transparent 54%),
 repeating-linear-gradient(0deg,#847868 0 11px,#6c6257 11px 13px)}
.tile.wall:before{content:"";position:absolute;left:-12px;top:12px;width:30px;height:2px;background:#a39482aa;box-shadow:30px 0 #a39482aa,15px 13px #a39482aa,45px 13px #a39482aa}
.tile.floor{background:
 radial-gradient(circle at 20% 20%,#e4d7ae 0 2px,transparent 3px),
 linear-gradient(145deg,#d1bf8d,#bca979)}
.tile.gate{background:linear-gradient(145deg,#a38a5e,#786b4e);box-shadow:inset 0 0 0 2px #d2bd8799}
.tile.military{background:
 linear-gradient(45deg,#ffffff08 25%,transparent 25% 75%,#0000000c 75%),
 #343a43;background-size:18px 18px}
.tile.evac{background:
 radial-gradient(circle at 25% 25%,#697166 0 2px,transparent 3px),
 linear-gradient(145deg,#485047,#3c443d)}
`;
document.head.appendChild(style);

window.LQ_TERRAIN_ART_STATUS={emojiRemovedFrom:['roof','tree','rock'],cssTerrainPass:true};
if(s.screen==='world')render();
})();
