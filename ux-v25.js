(() => {
'use strict';

/* LUKE QUEST v0.25 original early-enemy vector art.
   Replaces the first three field enemy emoji with original lightweight inline SVG battle art.
   No existing-game character or asset is copied. */

const EARLY_ENEMY_ART={
'ぷるぷるスライム':`<svg class="lqEnemySvg slimeSvg" viewBox="0 0 180 160" aria-label="ぷるぷるスライム">
 <defs><radialGradient id="slb" cx="38%" cy="25%"><stop offset="0" stop-color="#8fe8ff"/><stop offset=".5" stop-color="#3ca8d4"/><stop offset="1" stop-color="#17678e"/></radialGradient></defs>
 <ellipse cx="90" cy="139" rx="55" ry="10" fill="#07131b66"/>
 <path d="M33 116 C25 82 47 54 65 35 C77 22 83 12 90 4 C98 18 108 28 120 40 C139 60 157 86 147 118 C139 143 117 151 90 151 C60 151 40 142 33 116Z" fill="url(#slb)" stroke="#b8f3ff" stroke-width="5"/>
 <ellipse cx="68" cy="78" rx="9" ry="12" fill="#102a43"/><ellipse cx="112" cy="78" rx="9" ry="12" fill="#102a43"/>
 <circle cx="65" cy="74" r="3" fill="#fff"/><circle cx="109" cy="74" r="3" fill="#fff"/>
 <path d="M67 105 Q90 120 114 102" fill="none" stroke="#12374d" stroke-width="6" stroke-linecap="round"/>
 <path d="M48 54 Q61 34 76 28" fill="none" stroke="#d3f8ff99" stroke-width="7" stroke-linecap="round"/>
</svg>`,
'ツノウサギ':`<svg class="lqEnemySvg rabbitSvg" viewBox="0 0 180 170" aria-label="ツノウサギ">
 <defs><linearGradient id="rbf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8d7bc"/><stop offset="1" stop-color="#9c8067"/></linearGradient></defs>
 <ellipse cx="92" cy="151" rx="57" ry="10" fill="#09100d70"/>
 <path d="M83 46 L90 5 L101 48" fill="#c99b42" stroke="#f0ce74" stroke-width="4"/>
 <path d="M58 65 Q39 20 61 12 Q83 47 80 69" fill="url(#rbf)" stroke="#eadcc7" stroke-width="5"/>
 <path d="M120 66 Q139 22 118 14 Q97 48 99 70" fill="url(#rbf)" stroke="#eadcc7" stroke-width="5"/>
 <ellipse cx="90" cy="102" rx="53" ry="45" fill="url(#rbf)" stroke="#f0e1cb" stroke-width="5"/>
 <ellipse cx="65" cy="94" rx="9" ry="11" fill="#33251f"/><ellipse cx="114" cy="94" rx="9" ry="11" fill="#33251f"/>
 <circle cx="62" cy="90" r="3" fill="#fff"/><circle cx="111" cy="90" r="3" fill="#fff"/>
 <path d="M84 111 Q90 116 96 111 Q94 122 90 124 Q86 122 84 111Z" fill="#704741"/>
 <path d="M79 132 Q91 141 103 131" fill="none" stroke="#5d4236" stroke-width="5" stroke-linecap="round"/>
 <path d="M46 115 L17 108 M48 124 L15 126 M132 114 L162 105 M130 124 L164 125" stroke="#e8d7bc" stroke-width="3"/>
</svg>`,
'闇カラス':`<svg class="lqEnemySvg crowSvg" viewBox="0 0 190 170" aria-label="闇カラス">
 <defs><linearGradient id="crw" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#44506c"/><stop offset=".6" stop-color="#171b2c"/><stop offset="1" stop-color="#080a12"/></linearGradient></defs>
 <ellipse cx="97" cy="151" rx="58" ry="9" fill="#03040a88"/>
 <path d="M88 71 Q48 39 12 59 Q41 73 54 108 Q66 96 83 95" fill="url(#crw)" stroke="#65718c" stroke-width="4"/>
 <path d="M105 70 Q145 38 181 57 Q151 73 139 108 Q125 95 108 94" fill="url(#crw)" stroke="#65718c" stroke-width="4"/>
 <ellipse cx="96" cy="90" rx="42" ry="50" fill="url(#crw)" stroke="#5a647b" stroke-width="4"/>
 <path d="M79 62 Q96 49 116 62 L107 85 Q96 91 84 84Z" fill="#292f43"/>
 <circle cx="82" cy="72" r="6" fill="#ffbd48"/><circle cx="111" cy="72" r="6" fill="#ffbd48"/>
 <circle cx="84" cy="70" r="2" fill="#fff4bf"/><circle cx="113" cy="70" r="2" fill="#fff4bf"/>
 <path d="M86 86 L98 79 L111 87 L98 96Z" fill="#c78332" stroke="#f2b653" stroke-width="2"/>
 <path d="M77 129 L67 155 M111 128 L121 155" stroke="#b17a37" stroke-width="5" stroke-linecap="round"/>
</svg>`
};

const style=document.createElement('style');
style.textContent=`
.enemySpriteStage .enemy:has(.lqEnemySvg){font-size:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.lqEnemySvg{width:148px;height:148px;overflow:visible;filter:drop-shadow(0 8px 5px #0008);animation:lqEnemyBreath 1.6s ease-in-out infinite alternate;transform-origin:50% 88%}
@keyframes lqEnemyBreath{from{transform:translateY(2px) scale(.985)}to{transform:translateY(-2px) scale(1.015)}}
.crowSvg{animation:lqCrowHover 1.3s ease-in-out infinite alternate}@keyframes lqCrowHover{from{transform:translateY(5px) rotate(-1deg)}to{transform:translateY(-5px) rotate(1deg)}}
@media(max-width:390px){.lqEnemySvg{width:126px;height:126px}}@media(max-height:700px){.lqEnemySvg{width:100px;height:100px}}
`;
document.head.appendChild(style);

function applyEarlyEnemyArt(){
  if(s.screen!=='battle'||!s.enemy)return;
  const art=EARLY_ENEMY_ART[s.enemy.n];if(!art)return;
  const target=app.querySelector('.enemySpriteStage .enemy');if(!target)return;
  target.innerHTML=art;target.dataset.lqFormalStage='original-vector-v25';
}

const battleV24=battle;
battle=function(){battleV24();applyEarlyEnemyArt();};

window.LQ_ENEMY_ART_STATUS={
  'ぷるぷるスライム':'ORIGINAL_VECTOR_INTEGRATED',
  'ツノウサギ':'ORIGINAL_VECTOR_INTEGRATED',
  '闇カラス':'ORIGINAL_VECTOR_INTEGRATED',
  otherEnemies:'INTERIM_EMOJI'
};
if(s.screen==='battle')battle();
})();
