(() => {
'use strict';

/* REQ-006: original vector battle art for all normal encounter enemies.
   Presentation only: battle stats, rewards, AI and dedicated boss art remain untouched. */
const REGISTRY={
'ぷるぷるスライム':{kind:'slime',body:'#4aa9d8',dark:'#15587e',eye:'#eaffff',accent:'#8ce6ff'},
'ツノウサギ':{kind:'rabbit',body:'#c6b596',dark:'#6d5b47',eye:'#ffdb72',accent:'#ead9b4'},
'闇カラス':{kind:'bird',body:'#252b3c',dark:'#080b12',eye:'#bc72ff',accent:'#59698b'},
'苔むしコウモリ':{kind:'bat',body:'#536b48',dark:'#243522',eye:'#d8e878',accent:'#879a63'},
'森グモ':{kind:'spider',body:'#54432f',dark:'#21180f',eye:'#f4bd54',accent:'#7f9a55'},
'木霊ウルフ':{kind:'wolf',body:'#647054',dark:'#283226',eye:'#d7ef86',accent:'#97a879'},
'霧まといキツネ':{kind:'fox',body:'#778b92',dark:'#2e4149',eye:'#9ef6ee',accent:'#c1dade'},
'樹皮トカゲ':{kind:'lizard',body:'#765f3f',dark:'#36291b',eye:'#c9ef6b',accent:'#9a7f54'},
'夜歩きフクロウ':{kind:'owl',body:'#45475d',dark:'#1d1f2d',eye:'#f4ca62',accent:'#72758f'},
'霧喰いヤマネコ':{kind:'cat',body:'#4e5966',dark:'#1e2730',eye:'#7de9d4',accent:'#84939f'},
'灰羽トンビ':{kind:'raptor',body:'#66666b',dark:'#292a31',eye:'#f2c05d',accent:'#9a8b75'},
'泥鎧イノシシ':{kind:'boar',body:'#604d3c',dark:'#2b211b',eye:'#f28a62',accent:'#8b7258'},
'灰爪ハウンド':{kind:'hound',body:'#575b63',dark:'#20242a',eye:'#e07171',accent:'#8b9098'},
'監視フクロウ':{kind:'watchowl',body:'#424a55',dark:'#151a20',eye:'#efcf5e',accent:'#71849a'},
'黒甲ムカデ':{kind:'centipede',body:'#343a3c',dark:'#111416',eye:'#ef6868',accent:'#657167'},
'崖ネズミ':{kind:'rat',body:'#70685f',dark:'#302b27',eye:'#f0b06c',accent:'#9c9185'},
'石羽コンドル':{kind:'condor',body:'#52545a',dark:'#1c1d22',eye:'#e7b750',accent:'#8d8f94'},
'退避路オオカミ':{kind:'ridgewolf',body:'#5e6466',dark:'#22292b',eye:'#ef865d',accent:'#8f9898'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=(name,c,body)=>`<svg class="lqOriginalEnemySvg lqEnemy-${c.kind}" viewBox="0 0 220 190" role="img" aria-label="${esc(name)}"><ellipse cx="110" cy="171" rx="67" ry="10" fill="#05080c99"/>${body}</svg>`;
function art(name,c){
 const B=c.body,D=c.dark,E=c.eye,A=c.accent;
 switch(c.kind){
 case'slime':return base(name,c,`<path d="M52 143Q45 103 68 72Q84 49 109 52Q137 50 154 76Q177 109 166 143Q148 163 109 164Q71 162 52 143Z" fill="${B}" stroke="${A}" stroke-width="6"/><path d="M66 126Q108 145 155 123" fill="none" stroke="${D}" stroke-width="5" opacity=".55"/><ellipse cx="88" cy="105" rx="9" ry="12" fill="${E}"/><ellipse cx="132" cy="105" rx="9" ry="12" fill="${E}"/><circle cx="90" cy="108" r="4" fill="${D}"/><circle cx="134" cy="108" r="4" fill="${D}"/><path d="M100 130Q110 137 121 130" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`);
 case'rabbit':return base(name,c,`<path d="M83 68Q67 26 79 12Q98 38 103 67M119 67Q126 28 144 17Q147 42 136 74" fill="${A}" stroke="${D}" stroke-width="6"/><ellipse cx="111" cy="112" rx="55" ry="48" fill="${B}" stroke="${D}" stroke-width="6"/><path d="M97 61L109 30L123 64" fill="${A}" stroke="${D}" stroke-width="5"/><circle cx="90" cy="104" r="7" fill="${E}"/><circle cx="132" cy="104" r="7" fill="${E}"/><path d="M104 124L111 130L118 124" fill="${D}"/><path d="M68 145L53 166M151 145L168 165" stroke="${D}" stroke-width="10" stroke-linecap="round"/>`);
 case'bird':case'raptor':case'condor':return base(name,c,`<path d="M55 122Q30 96 18 62Q57 74 82 95Q84 58 111 48Q139 58 141 95Q165 73 204 61Q191 99 166 124Q146 152 111 157Q76 152 55 122Z" fill="${B}" stroke="${D}" stroke-width="6"/><path d="M91 92Q110 77 130 92Q122 113 111 126Q99 113 91 92Z" fill="${A}"/><circle cx="94" cy="91" r="6" fill="${E}"/><circle cx="128" cy="91" r="6" fill="${E}"/><path d="M103 108L111 118L120 108" fill="${D}"/>`);
 case'bat':return base(name,c,`<path d="M93 88Q63 53 18 60Q31 85 28 119Q58 111 81 132L101 116M127 87Q158 54 203 61Q189 86 192 120Q161 110 139 132L119 116" fill="${B}" stroke="${D}" stroke-width="6"/><ellipse cx="110" cy="108" rx="34" ry="43" fill="${B}" stroke="${D}" stroke-width="5"/><path d="M87 76L79 50L101 69M132 76L141 51L120 68" fill="${A}"/><circle cx="98" cy="101" r="6" fill="${E}"/><circle cx="122" cy="101" r="6" fill="${E}"/><path d="M99 124L105 132L110 124L116 132L122 123" fill="none" stroke="${A}" stroke-width="4"/>`);
 case'spider':return base(name,c,`<g fill="none" stroke="${D}" stroke-width="9" stroke-linecap="round"><path d="M82 104L48 80L21 75M80 119L44 111L17 122M84 132L51 145L30 165M138 104L172 80L199 75M140 119L176 111L203 122M136 132L169 145L190 165"/></g><ellipse cx="110" cy="121" rx="45" ry="39" fill="${B}" stroke="${D}" stroke-width="6"/><ellipse cx="110" cy="83" rx="29" ry="25" fill="${A}" stroke="${D}" stroke-width="5"/><g fill="${E}"><circle cx="98" cy="80" r="5"/><circle cx="111" cy="75" r="5"/><circle cx="124" cy="81" r="5"/><circle cx="104" cy="90" r="4"/><circle cx="118" cy="91" r="4"/></g>`);
 case'wolf':case'hound':case'ridgewolf':case'fox':case'cat':return base(name,c,`<path d="M61 139Q46 104 65 75L55 43L87 61Q111 48 135 61L166 42L156 78Q174 108 158 140Q143 160 111 163Q77 159 61 139Z" fill="${B}" stroke="${D}" stroke-width="6"/><path d="M72 86Q89 72 103 87M149 86Q132 72 118 87" fill="none" stroke="${A}" stroke-width="7" stroke-linecap="round"/><circle cx="90" cy="101" r="7" fill="${E}"/><circle cx="132" cy="101" r="7" fill="${E}"/><path d="M102 119L111 126L120 119" fill="${D}"/><path d="M90 139Q111 149 132 139" fill="none" stroke="${D}" stroke-width="5"/><path d="M59 143L45 166M161 143L176 166" stroke="${D}" stroke-width="11" stroke-linecap="round"/>`);
 case'lizard':return base(name,c,`<path d="M40 130Q66 108 76 85Q91 59 121 65Q153 69 166 98Q180 126 159 146Q133 164 97 153Q69 145 40 157Q53 143 40 130Z" fill="${B}" stroke="${D}" stroke-width="6"/><path d="M71 89L51 66L83 74M146 91L169 67L154 100" fill="${A}" stroke="${D}" stroke-width="5"/><circle cx="117" cy="91" r="8" fill="${E}"/><path d="M139 111L170 115" stroke="${A}" stroke-width="5" stroke-linecap="round"/><path d="M91 148L76 170M136 149L148 170" stroke="${D}" stroke-width="10" stroke-linecap="round"/>`);
 case'owl':case'watchowl':return base(name,c,`<path d="M59 143Q46 101 68 65L61 40L91 56Q111 47 131 56L160 40L154 67Q176 103 162 143Q145 163 111 165Q76 162 59 143Z" fill="${B}" stroke="${D}" stroke-width="6"/><circle cx="88" cy="96" r="22" fill="${A}"/><circle cx="134" cy="96" r="22" fill="${A}"/><circle cx="88" cy="96" r="9" fill="${E}"/><circle cx="134" cy="96" r="9" fill="${E}"/><circle cx="88" cy="96" r="4" fill="${D}"/><circle cx="134" cy="96" r="4" fill="${D}"/><path d="M103 116L111 128L120 116" fill="${A}"/><path d="M70 137Q111 151 152 137" fill="none" stroke="${D}" stroke-width="5"/>`);
 case'boar':return base(name,c,`<path d="M48 130Q39 91 68 68Q91 48 126 56Q159 62 173 91Q184 122 161 146Q138 165 101 158Q66 157 48 130Z" fill="${B}" stroke="${D}" stroke-width="6"/><path d="M64 77L46 54L77 63M147 70L171 51L159 82" fill="${A}" stroke="${D}" stroke-width="5"/><circle cx="88" cy="99" r="7" fill="${E}"/><circle cx="137" cy="99" r="7" fill="${E}"/><ellipse cx="113" cy="125" rx="27" ry="20" fill="${D}"/><circle cx="103" cy="124" r="5" fill="${A}"/><circle cx="123" cy="124" r="5" fill="${A}"/><path d="M87 131L72 144M139 131L154 144" stroke="#e8d7b1" stroke-width="7" stroke-linecap="round"/>`);
 case'centipede':return base(name,c,`<path d="M43 139Q59 72 111 66Q164 70 179 135" fill="none" stroke="${D}" stroke-width="30" stroke-linecap="round"/><path d="M43 139Q59 72 111 66Q164 70 179 135" fill="none" stroke="${B}" stroke-width="20" stroke-dasharray="18 5" stroke-linecap="round"/><g stroke="${A}" stroke-width="6" stroke-linecap="round"><path d="M60 116L31 102M66 133L38 151M86 84L67 56M109 76L107 43M135 83L155 55M158 105L190 91M166 127L196 144"/></g><circle cx="177" cy="136" r="20" fill="${B}" stroke="${D}" stroke-width="5"/><circle cx="183" cy="132" r="6" fill="${E}"/>`);
 case'rat':return base(name,c,`<path d="M55 139Q45 105 67 80Q90 55 124 64Q155 70 169 100Q179 130 155 150Q126 166 91 157Q68 154 55 139Z" fill="${B}" stroke="${D}" stroke-width="6"/><circle cx="78" cy="76" r="21" fill="${A}" stroke="${D}" stroke-width="5"/><circle cx="139" cy="75" r="20" fill="${A}" stroke="${D}" stroke-width="5"/><circle cx="91" cy="103" r="7" fill="${E}"/><circle cx="133" cy="103" r="7" fill="${E}"/><path d="M111 123L122 129L111 136L100 129Z" fill="${D}"/><path d="M160 144Q190 151 197 130" fill="none" stroke="${D}" stroke-width="8" stroke-linecap="round"/>`);
 default:return'';
 }
}
const style=document.createElement('style');style.textContent=`
.enemy.lqOriginalEnemy{font-size:0!important;min-height:176px;display:flex;align-items:center;justify-content:center}.lqOriginalEnemySvg{width:min(220px,78vw);height:176px;overflow:visible;filter:drop-shadow(0 10px 7px #000a)}.enemy.lqOriginalEnemy.lqEnemyCritical .lqOriginalEnemySvg{filter:drop-shadow(0 10px 7px #000b)}
`;
document.head.appendChild(style);
function apply(){
 if(s.screen!=='battle'||!s.enemy)return false;
 const cfg=REGISTRY[s.enemy.n];if(!cfg)return false;
 const target=app.querySelector('.enemySpriteStage .enemy')||app.querySelector('.enemy');if(!target)return false;
 if(target.dataset.lqOriginalEnemy===s.enemy.n)return true;
 const svg=art(s.enemy.n,cfg);if(!svg)return false;
 target.innerHTML=svg;target.classList.add('lqOriginalEnemy');target.dataset.lqOriginalEnemy=s.enemy.n;target.dataset.lqFormalStage='original-vector-normal-enemy';return true;
}
const battleBase=battle;battle=function(){const r=battleBase();apply();return r;};
const renderBase=render;render=function(){const r=renderBase();apply();return r;};
window.LQ_ORIGINAL_ENEMY_ART_STATUS={count:Object.keys(REGISTRY).length,names:Object.keys(REGISTRY),presentationOnly:true,unknownEnemyFallbackPreserved:true,dedicatedBossPreserved:true};
apply();
})();
