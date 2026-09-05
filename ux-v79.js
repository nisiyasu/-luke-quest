(() => {
'use strict';

/* LUKE QUEST v0.79 hidden-item exploration seed.
   Adds two subtle one-time sparkle finds on optional outdoor tiles. */

s.flags=s.flags||{};s.flags.fieldSparkleFound??=false;s.flags.forestSparkleFound??=false;
const FINDS=[
 {map:'field',x:18,y:10,kind:'lqFieldSparkle',flag:'fieldSparkleFound',name:'草むらのきらめき',reward:()=>{s.potions++;return'薬草1個';},line:'草の根元に、まだ新しい薬草が落ちていた。'},
 {map:'forest',x:18,y:17,kind:'lqForestSparkle',flag:'forestSparkleFound',name:'木漏れ日のきらめき',reward:()=>{s.gold+=14;return'14G';},line:'落ち葉の下から古い小銭袋が見つかった。'}
];
for(const f of FINDS){const list=MAPS[f.map]?.npcs;if(list&&!list.some(n=>n.kind===f.kind))list.push({x:f.x,y:f.y,e:'',name:f.name,kind:f.kind,text:''});}

const visibleNpcsV78=visibleNpcs;
visibleNpcs=function(m){return visibleNpcsV78(m).filter(n=>{const f=FINDS.find(x=>x.kind===n.kind);return !f||!s.flags[f.flag];});};
const npcClassV78=npcClass;
npcClass=function(n){return FINDS.some(f=>f.kind===n?.kind)?'npc lqHiddenSparkle':npcClassV78(n);};

const style=document.createElement('style');
style.textContent=`
.lqHiddenSparkle{width:38px;height:42px;font-size:0;overflow:visible;filter:none}.lqHiddenSparkle:before,.lqHiddenSparkle:after{content:"";position:absolute;left:17px;top:17px;width:4px;height:4px;background:#fff1a5;transform:rotate(45deg);box-shadow:0 0 7px #ffe790}.lqHiddenSparkle:before{animation:lqSparkleA 1.4s ease-in-out infinite}@keyframes lqSparkleA{0%,100%{opacity:.18;transform:rotate(45deg) scale(.45)}48%{opacity:1;transform:rotate(45deg) scale(1.55)}}.lqHiddenSparkle:after{left:25px;top:11px;width:2px;height:2px;animation:lqSparkleB 1.4s .45s ease-in-out infinite}@keyframes lqSparkleB{0%,100%{opacity:.1}50%{opacity:.8}}
`;
document.head.appendChild(style);

function hiddenFindAhead(){if(s.screen!=='world')return null;const p=front(),n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);return n?FINDS.find(f=>f.kind===n.kind)||null:null;}
const actionV78=action;
action=function(){
 const f=!s.dialog&&hiddenFindAhead();if(!f)return actionV78();stopMoving();if(s.flags[f.flag])return actionV78();
 s.flags[f.flag]=true;const reward=f.reward();s.dialog={name:f.name,text:`${f.line}\n${reward}を手に入れた。\nルーク「ちゃんと下を見るのも冒険なんですね。」`};save();return render();
};
window.LQ_HIDDEN_FIND_STATUS={count:FINDS.length,persistent:true};
if(s.screen==='world')render();
})();
