(() => {
'use strict';

/* LUKE QUEST v0.26 original forest-enemy vector art. */

const FOREST_VECTOR_ART={
'苔むしコウモリ':`<svg class="lqEnemySvg lqBatSvg" viewBox="0 0 190 165" aria-label="苔むしコウモリ">
 <defs><linearGradient id="btg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#63725b"/><stop offset="1" stop-color="#212d29"/></linearGradient></defs>
 <ellipse cx="95" cy="148" rx="53" ry="8" fill="#04100b77"/>
 <path d="M89 72 Q52 31 10 55 Q32 62 25 91 Q48 75 65 106 Q75 91 91 94Z" fill="url(#btg)" stroke="#8b9b77" stroke-width="4"/>
 <path d="M101 72 Q138 31 180 55 Q158 62 165 91 Q142 75 125 106 Q115 91 99 94Z" fill="url(#btg)" stroke="#8b9b77" stroke-width="4"/>
 <ellipse cx="95" cy="95" rx="35" ry="43" fill="#38473e" stroke="#829079" stroke-width="4"/>
 <path d="M73 68 L64 42 L87 59 M117 68 L126 42 L103 59" fill="#536252" stroke="#8d9b7b" stroke-width="4"/>
 <circle cx="81" cy="88" r="6" fill="#d4ef72"/><circle cx="109" cy="88" r="6" fill="#d4ef72"/>
 <path d="M80 108 Q95 120 111 108" fill="none" stroke="#161d1a" stroke-width="5"/><path d="M86 111 L90 123 M104 111 L100 123" stroke="#e6dec3" stroke-width="4"/>
 <g fill="#5f873e"><circle cx="68" cy="74" r="7"/><circle cx="124" cy="80" r="8"/><circle cx="102" cy="57" r="6"/></g>
</svg>`,
'森グモ':`<svg class="lqEnemySvg lqSpiderSvg" viewBox="0 0 190 165" aria-label="森グモ">
 <defs><radialGradient id="spg"><stop stop-color="#9b7041"/><stop offset="1" stop-color="#3c2b26"/></radialGradient></defs>
 <ellipse cx="96" cy="145" rx="64" ry="9" fill="#07100b77"/>
 <g fill="none" stroke="#4d352c" stroke-width="9" stroke-linecap="round">
  <path d="M72 93 Q38 70 16 52 M67 105 Q34 101 13 111 M73 117 Q43 132 27 151"/>
  <path d="M119 93 Q153 70 176 52 M124 105 Q157 101 178 111 M118 117 Q148 132 164 151"/>
 </g>
 <ellipse cx="96" cy="101" rx="43" ry="38" fill="url(#spg)" stroke="#c09354" stroke-width="5"/>
 <ellipse cx="96" cy="67" rx="30" ry="26" fill="#60422f" stroke="#bc8750" stroke-width="4"/>
 <g fill="#f4ca63"><circle cx="82" cy="63" r="5"/><circle cx="94" cy="57" r="5"/><circle cx="108" cy="63" r="5"/><circle cx="88" cy="72" r="4"/><circle cx="102" cy="72" r="4"/></g>
 <path d="M83 83 L76 94 M109 83 L116 94" stroke="#e6ddc7" stroke-width="5"/>
 <path d="M72 111 Q96 126 120 111" fill="none" stroke="#2b211d" stroke-width="5"/>
</svg>`,
'木霊ウルフ':`<svg class="lqEnemySvg lqWolfSvg" viewBox="0 0 190 170" aria-label="木霊ウルフ">
 <defs><linearGradient id="wfg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#718469"/><stop offset=".55" stop-color="#405347"/><stop offset="1" stop-color="#202f2b"/></linearGradient></defs>
 <ellipse cx="96" cy="150" rx="62" ry="9" fill="#05100a77"/>
 <path d="M52 73 L55 25 L85 54 Q96 46 109 55 L139 26 L137 78 Q149 98 134 125 Q119 151 95 151 Q69 151 55 125 Q41 98 52 73Z" fill="url(#wfg)" stroke="#9aac87" stroke-width="5"/>
 <path d="M65 61 L62 38 L80 57 M126 59 L134 39 L115 58" fill="#293a33"/>
 <path d="M65 92 Q78 80 88 91 Q79 101 68 98Z" fill="#d7e66d"/><path d="M102 91 Q115 80 127 92 Q116 101 105 98Z" fill="#d7e66d"/>
 <path d="M80 115 Q96 105 111 115 L101 128 Q95 133 88 127Z" fill="#1a2220"/>
 <path d="M76 137 Q95 146 117 136" fill="none" stroke="#d7d6c5" stroke-width="4"/>
 <g fill="#668f4c"><circle cx="55" cy="104" r="8"/><circle cx="136" cy="99" r="7"/><circle cx="68" cy="47" r="6"/></g>
</svg>`
};

const style=document.createElement('style');
style.textContent=`
.lqBatSvg{animation:lqBatHover 1.1s ease-in-out infinite alternate}@keyframes lqBatHover{from{transform:translateY(6px) scale(.98)}to{transform:translateY(-7px) scale(1.02)}}
.lqSpiderSvg{animation:lqSpiderCreep 1.4s ease-in-out infinite alternate}@keyframes lqSpiderCreep{from{transform:translateX(-2px) scale(.99)}to{transform:translateX(2px) scale(1.01)}}
.lqWolfSvg{animation:lqWolfBreath 1.3s ease-in-out infinite alternate}@keyframes lqWolfBreath{from{transform:scale(.985)}to{transform:scale(1.02)}}
`;
document.head.appendChild(style);

function applyForestEnemyArt(){
  if(s.screen!=='battle'||!s.enemy)return;
  const art=FOREST_VECTOR_ART[s.enemy.n];if(!art)return;
  const target=app.querySelector('.enemySpriteStage .enemy');if(!target)return;
  target.innerHTML=art;target.dataset.lqFormalStage='original-vector-v26';
}
const battleV25=battle;
battle=function(){battleV25();applyForestEnemyArt();};

window.LQ_ENEMY_ART_STATUS=Object.assign({},window.LQ_ENEMY_ART_STATUS,{
 '苔むしコウモリ':'ORIGINAL_VECTOR_INTEGRATED','森グモ':'ORIGINAL_VECTOR_INTEGRATED','木霊ウルフ':'ORIGINAL_VECTOR_INTEGRATED'
});
if(s.screen==='battle')battle();
})();
