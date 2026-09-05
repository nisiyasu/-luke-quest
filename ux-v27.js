(() => {
'use strict';

/* LUKE QUEST v0.27 original deep-forest enemy vector art. */

const DEEP_VECTOR_ART={
'霧まといキツネ':`<svg class="lqEnemySvg lqFoxSvg" viewBox="0 0 190 170" aria-label="霧まといキツネ">
 <defs><linearGradient id="fxg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d8b177"/><stop offset=".55" stop-color="#9b704b"/><stop offset="1" stop-color="#584638"/></linearGradient></defs>
 <ellipse cx="96" cy="151" rx="61" ry="9" fill="#07100c70"/>
 <path d="M50 77 L55 25 L86 57 Q95 50 105 57 L137 25 L140 79 Q151 103 136 129 Q119 151 96 151 Q70 151 54 128 Q39 104 50 77Z" fill="url(#fxg)" stroke="#f0d6a5" stroke-width="5"/>
 <path d="M58 56 L61 36 L77 60 M130 56 L132 36 L114 60" fill="#694e3c"/>
 <path d="M64 93 Q76 81 88 92 Q78 102 67 99Z" fill="#75e2dc"/><path d="M103 92 Q116 81 128 93 Q117 102 106 99Z" fill="#75e2dc"/>
 <path d="M84 117 Q96 108 108 117 L99 129 Q95 132 90 128Z" fill="#372b28"/>
 <path d="M40 116 Q20 101 9 116 Q28 126 44 132 M145 110 Q169 96 182 111 Q164 125 145 132" fill="none" stroke="#d7eeee66" stroke-width="11" stroke-linecap="round"/>
 <path d="M49 141 Q71 155 91 144 M105 145 Q127 156 145 141" fill="none" stroke="#dff5f355" stroke-width="8" stroke-linecap="round"/>
</svg>`,
'樹皮トカゲ':`<svg class="lqEnemySvg lqLizardSvg" viewBox="0 0 195 165" aria-label="樹皮トカゲ">
 <defs><linearGradient id="lzg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8d774e"/><stop offset=".5" stop-color="#5e5735"/><stop offset="1" stop-color="#35452f"/></linearGradient></defs>
 <ellipse cx="99" cy="146" rx="67" ry="9" fill="#06100a77"/>
 <path d="M40 108 Q26 75 57 58 Q82 42 115 53 Q148 64 153 96 Q157 118 138 132 Q113 149 75 137 Q51 132 40 108Z" fill="url(#lzg)" stroke="#a69a68" stroke-width="5"/>
 <path d="M143 112 Q169 119 183 142 Q155 140 132 129" fill="#495134" stroke="#8b8c58" stroke-width="5"/>
 <path d="M55 71 L43 41 L72 58 M83 57 L79 28 L100 51 M112 55 L123 28 L132 64" fill="#6c5a3c" stroke="#a28353" stroke-width="4"/>
 <circle cx="68" cy="89" r="8" fill="#d8e45c"/><circle cx="65" cy="87" r="3" fill="#1d2719"/>
 <path d="M48 105 Q65 112 80 106" fill="none" stroke="#2b2a20" stroke-width="5"/>
 <g fill="#6d8b45"><circle cx="94" cy="74" r="8"/><circle cx="118" cy="91" r="7"/><circle cx="90" cy="119" r="6"/></g>
 <path d="M61 130 L43 151 M121 132 L134 153" stroke="#615638" stroke-width="8" stroke-linecap="round"/>
</svg>`,
'夜歩きフクロウ':`<svg class="lqEnemySvg lqOwlSvg" viewBox="0 0 190 170" aria-label="夜歩きフクロウ">
 <defs><radialGradient id="owg"><stop stop-color="#536278"/><stop offset="1" stop-color="#222839"/></radialGradient></defs>
 <ellipse cx="95" cy="151" rx="55" ry="9" fill="#03050b88"/>
 <path d="M48 79 Q38 42 59 26 L78 51 Q95 43 113 51 L132 26 Q152 44 142 80 Q151 109 134 135 Q119 153 95 153 Q70 153 54 135 Q39 111 48 79Z" fill="url(#owg)" stroke="#78859b" stroke-width="5"/>
 <circle cx="73" cy="88" r="22" fill="#9aa8b3"/><circle cx="117" cy="88" r="22" fill="#9aa8b3"/>
 <circle cx="73" cy="88" r="11" fill="#f1c556"/><circle cx="117" cy="88" r="11" fill="#f1c556"/>
 <circle cx="73" cy="88" r="5" fill="#161a23"/><circle cx="117" cy="88" r="5" fill="#161a23"/>
 <path d="M86 107 L96 98 L105 107 L96 118Z" fill="#d29a46"/>
 <path d="M53 115 Q30 104 17 119 Q38 132 61 132 M136 115 Q158 104 175 119 Q153 132 129 132" fill="#30394b" stroke="#6b778c" stroke-width="4"/>
 <path d="M79 145 L72 160 M110 145 L118 160" stroke="#c19a51" stroke-width="5"/>
</svg>`
};

const style=document.createElement('style');
style.textContent=`
.lqFoxSvg{animation:lqFoxMist 1.5s ease-in-out infinite alternate}@keyframes lqFoxMist{from{transform:translateY(2px);filter:drop-shadow(0 8px 5px #0008) drop-shadow(0 0 4px #bcebea44)}to{transform:translateY(-3px);filter:drop-shadow(0 8px 5px #0008) drop-shadow(0 0 11px #bcebea77)}}
.lqLizardSvg{animation:lqLizardLow 1.8s ease-in-out infinite alternate}@keyframes lqLizardLow{from{transform:translateX(-2px) scale(.99)}to{transform:translateX(2px) scale(1.01)}}
.lqOwlSvg{animation:lqOwlFloat 1.25s ease-in-out infinite alternate}@keyframes lqOwlFloat{from{transform:translateY(5px)}to{transform:translateY(-6px)}}
`;
document.head.appendChild(style);

function applyDeepEnemyArt(){
 if(s.screen!=='battle'||!s.enemy)return;
 const art=DEEP_VECTOR_ART[s.enemy.n];if(!art)return;
 const target=app.querySelector('.enemySpriteStage .enemy');if(!target)return;
 target.innerHTML=art;target.dataset.lqFormalStage='original-vector-v27';
}
const battleV26=battle;
battle=function(){battleV26();applyDeepEnemyArt();};
window.LQ_ENEMY_ART_STATUS=Object.assign({},window.LQ_ENEMY_ART_STATUS,{
 '霧まといキツネ':'ORIGINAL_VECTOR_INTEGRATED','樹皮トカゲ':'ORIGINAL_VECTOR_INTEGRATED','夜歩きフクロウ':'ORIGINAL_VECTOR_INTEGRATED'
});
if(s.screen==='battle')battle();
})();
