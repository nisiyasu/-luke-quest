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
.lqReq147BattleCommandStack{
 display:grid!important;
 grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
 gap:8px!important;
 width:100%!important;
}
.lqReq147BattleCommandStack>.lqReq147BattleCommandRow{display:contents!important;}
.lqReq147BattleCommandStack>.lqReq147BattleCommandRow>button,
.lqReq147BattleCommandStack>.lqReq147BattleCommandRow>.btn{
 width:100%!important;
 min-width:0!important;
 margin:0!important;
}
.lqReq147BattleCommandStack>:not(.lqReq147BattleCommandRow){grid-column:1/-1;}
@media (max-width:430px){
 .lqReq147BattleCommandGrid,.lqReq147BattleCommandStack{gap:6px!important;}
 .lqReq147BattleCommandGrid>button,
 .lqReq147BattleCommandGrid>.btn,
 .lqReq147BattleCommandStack>.lqReq147BattleCommandRow>button,
 .lqReq147BattleCommandStack>.lqReq147BattleCommandRow>.btn{font-size:13px!important;padding:9px 6px!important;}
}
`;
document.head.appendChild(style);
function clearMarks(){
 document.querySelectorAll('#app .lqReq147BattleCommandGrid').forEach(row=>row.classList.remove('lqReq147BattleCommandGrid'));
 document.querySelectorAll('#app .lqReq147BattleCommandRow').forEach(row=>row.classList.remove('lqReq147BattleCommandRow'));
 document.querySelectorAll('#app .lqReq147BattleCommandStack').forEach(parent=>parent.classList.remove('lqReq147BattleCommandStack'));
}
function markBattleCommandRows(){
 clearMarks();
 if(typeof s==='undefined'||s?.screen!=='battle')return;
 const rows=[...document.querySelectorAll('#app .lqBattleCommandCard .row,#app .card .row')].filter(row=>
  [...row.children].some(el=>el.matches('button,.btn'))
 );
 rows.forEach(row=>{
  const directButtons=[...row.children].filter(el=>el.matches('button,.btn'));
  if(directButtons.length===2)row.classList.add('lqReq147BattleCommandGrid');
 });
 const groups=new Map();
 rows.forEach(row=>{
  const directButtons=[...row.children].filter(el=>el.matches('button,.btn'));
  if(directButtons.length<1||directButtons.length>2||!row.parentElement)return;
  const group=groups.get(row.parentElement)||[];
  group.push(row);
  groups.set(row.parentElement,group);
 });
 groups.forEach((commandRows,parent)=>{
  const buttonCount=commandRows.reduce((sum,row)=>sum+[...row.children].filter(el=>el.matches('button,.btn')).length,0);
  if(buttonCount<4)return;
  parent.classList.add('lqReq147BattleCommandStack');
  commandRows.forEach(row=>row.classList.add('lqReq147BattleCommandRow'));
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
window.LQ_REQ147_BATTLE_COMMAND_TWO_COLUMN_RESTORE={version:'1.3.0',columns:2,multiRow:true,scope:'battle-command-surface',singleButtonRowRecovery:true,canonicalBattlePreserved:!!canonicalBattle};
})();
