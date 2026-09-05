(() => {
'use strict';

/* LUKE QUEST v0.33 original mist-trail enemy vector art. */

const MIST_VECTOR_ART={
'霧喰いヤマネコ':`<svg class="lqEnemySvg lqMistCatSvg" viewBox="0 0 190 170" aria-label="霧喰いヤマネコ">
 <defs><linearGradient id="mcg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#778999"/><stop offset=".55" stop-color="#465566"/><stop offset="1" stop-color="#212b39"/></linearGradient></defs>
 <ellipse cx="96" cy="151" rx="61" ry="9" fill="#04070b80"/>
 <path d="M52 79 L55 34 L82 57 Q96 48 110 58 L137 35 L141 80 Q151 101 139 128 Q122 151 96 151 Q69 151 52 128 Q40 103 52 79Z" fill="url(#mcg)" stroke="#a8b6c2" stroke-width="5"/>
 <path d="M61 58 L62 42 L77 61 M128 59 L132 43 L114 62" fill="#303b49"/>
 <path d="M65 92 Q78 80 89 92 Q79 102 68 99Z" fill="#8ef2e2"/><path d="M103 92 Q116 80 128 92 Q118 103 106 99Z" fill="#8ef2e2"/>
 <path d="M83 117 Q96 108 108 117 L99 129 Q95 132 90 128Z" fill="#1a212a"/>
 <path d="M54 113 L19 106 M55 122 L15 125 M135 112 L172 104 M134 122 L176 126" stroke="#b9c9d2" stroke-width="3"/>
 <path d="M46 143 Q69 154 87 145 M108 145 Q132 154 149 141" fill="none" stroke="#d9eeee55" stroke-width="9" stroke-linecap="round"/>
</svg>`,
'灰羽トンビ':`<svg class="lqEnemySvg lqKiteSvg" viewBox="0 0 195 170" aria-label="灰羽トンビ">
 <defs><linearGradient id="ktg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b8a84"/><stop offset=".5" stop-color="#50545b"/><stop offset="1" stop-color="#282d36"/></linearGradient></defs>
 <ellipse cx="97" cy="151" rx="61" ry="8" fill="#05070b7a"/>
 <path d="M87 82 Q51 42 10 60 Q35 73 55 113 Q70 97 89 99Z" fill="url(#ktg)" stroke="#adb0b4" stroke-width="4"/>
 <path d="M108 82 Q145 42 185 60 Q160 73 140 113 Q125 97 106 99Z" fill="url(#ktg)" stroke="#adb0b4" stroke-width="4"/>
 <ellipse cx="97" cy="92" rx="36" ry="48" fill="url(#ktg)" stroke="#9ca1a8" stroke-width="4"/>
 <path d="M75 63 Q96 48 119 63 L111 89 Q96 98 82 88Z" fill="#3a4049"/>
 <circle cx="81" cy="75" r="6" fill="#f3c95c"/><circle cx="113" cy="75" r="6" fill="#f3c95c"/>
 <path d="M85 91 L98 83 L111 91 L98 102Z" fill="#d49b42" stroke="#edbd67" stroke-width="2"/>
 <path d="M75 135 L68 156 M118 135 L126 156" stroke="#a57b3c" stroke-width="5" stroke-linecap="round"/>
</svg>`,
'泥鎧イノシシ':`<svg class="lqEnemySvg lqBoarSvg" viewBox="0 0 200 170" aria-label="泥鎧イノシシ">
 <defs><linearGradient id="brg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7b6750"/><stop offset=".5" stop-color="#4f4034"/><stop offset="1" stop-color="#28251f"/></linearGradient></defs>
 <ellipse cx="102" cy="150" rx="68" ry="9" fill="#06070480"/>
 <path d="M42 91 Q45 53 79 46 Q119 38 151 65 Q169 81 160 113 Q152 142 119 149 Q79 155 53 132 Q38 118 42 91Z" fill="url(#brg)" stroke="#9b866a" stroke-width="5"/>
 <path d="M57 69 L41 42 L72 57 M139 61 L160 41 L151 75" fill="#4b3d32" stroke="#84725d" stroke-width="4"/>
 <ellipse cx="75" cy="89" rx="8" ry="9" fill="#e1bf61"/><ellipse cx="128" cy="87" rx="8" ry="9" fill="#e1bf61"/>
 <ellipse cx="102" cy="111" rx="25" ry="18" fill="#332d27"/><circle cx="94" cy="109" r="4" fill="#171713"/><circle cx="111" cy="109" r="4" fill="#171713"/>
 <path d="M78 118 Q67 134 73 145 M128 118 Q142 133 135 146" fill="none" stroke="#efe7d2" stroke-width="7" stroke-linecap="round"/>
 <g fill="#62543f"><path d="M70 51 L83 31 L91 51Z"/><path d="M94 48 L105 23 L115 51Z"/><path d="M120 52 L132 32 L141 58Z"/></g>
 <g fill="#594936" opacity=".8"><circle cx="66" cy="105" r="10"/><circle cx="132" cy="110" r="12"/><circle cx="103" cy="69" r="9"/></g>
</svg>`
};

const style=document.createElement('style');
style.textContent=`
.lqMistCatSvg{animation:lqMistCat 1.45s ease-in-out infinite alternate}@keyframes lqMistCat{from{transform:translateY(2px);filter:drop-shadow(0 8px 5px #0008) drop-shadow(0 0 4px #bfeeee44)}to{transform:translateY(-3px);filter:drop-shadow(0 8px 5px #0008) drop-shadow(0 0 12px #bfeeee77)}}
.lqKiteSvg{animation:lqKiteHover 1.15s ease-in-out infinite alternate}@keyframes lqKiteHover{from{transform:translateY(6px) rotate(-1deg)}to{transform:translateY(-7px) rotate(1deg)}}
.lqBoarSvg{animation:lqBoarSnort 1.5s ease-in-out infinite alternate}@keyframes lqBoarSnort{from{transform:translateX(-2px) scale(.99)}to{transform:translateX(2px) scale(1.015)}}
`;
document.head.appendChild(style);

function applyMistEnemyArt(){
 if(s.screen!=='battle'||!s.enemy)return;
 const art=MIST_VECTOR_ART[s.enemy.n];if(!art)return;
 const target=app.querySelector('.enemySpriteStage .enemy');if(!target)return;
 target.innerHTML=art;target.dataset.lqFormalStage='original-vector-v33';
}
const battleV32=battle;
battle=function(){battleV32();applyMistEnemyArt();};
window.LQ_ENEMY_ART_STATUS=Object.assign({},window.LQ_ENEMY_ART_STATUS,{
 '霧喰いヤマネコ':'ORIGINAL_VECTOR_INTEGRATED','灰羽トンビ':'ORIGINAL_VECTOR_INTEGRATED','泥鎧イノシシ':'ORIGINAL_VECTOR_INTEGRATED'
});
if(s.screen==='battle')battle();
})();
