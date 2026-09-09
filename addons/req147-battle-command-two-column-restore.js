(() => {
'use strict';
if(window.LQ_REQ147_BATTLE_COMMAND_TWO_COLUMN_RESTORE)return;
const style=document.createElement('style');
style.id='lqReq147BattleCommandTwoColumnStyle';
style.textContent=`
.lqReq147BattleCommandGrid{
 display:grid!important;
 grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
 grid-auto-flow:row!important;
 gap:8px!important;
 width:100%!important;
}
.lqReq147BattleCommandGrid>button,
.lqReq147BattleCommandGrid>.btn{
 width:100%!important;
 min-width:0!important;
 margin:0!important;
}
@media (max-width:430px){
 .lqReq147BattleCommandGrid{gap:6px!important;}
 .lqReq147BattleCommandGrid>button,
 .lqReq147BattleCommandGrid>.btn{font-size:13px!important;padding:9px 6px!important;}
}
`;
document.head.appendChild(style);
function markBattleCommandRows(){
 document.querySelectorAll('#app .lqReq147BattleCommandGrid').forEach(row=>row.classList.remove('lqReq147BattleCommandGrid'));
 if(typeof s==='undefined'||s?.screen!=='battle')return;
 document.querySelectorAll('#app .card .row').forEach(row=>{
  const directButtons=[...row.children].filter(el=>el.matches('button,.btn'));
  if(directButtons.length===2)row.classList.add('lqReq147BattleCommandGrid');
 });
}
const canonicalBattle=typeof battle==='function'?battle:null;
if(canonicalBattle){
 battle=function(...args){
  const result=canonicalBattle.apply(this,args);
  markBattleCommandRows();
  return result;
 };
}
const observer=new MutationObserver(markBattleCommandRows);
observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
markBattleCommandRows();
window.LQ_REQ147_BATTLE_COMMAND_TWO_COLUMN_RESTORE={version:'1.2.0',columns:2,multiRow:true,scope:'battle-command-rows',canonicalBattlePreserved:!!canonicalBattle};
})();
