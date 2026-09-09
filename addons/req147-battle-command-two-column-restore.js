(() => {
'use strict';
if(window.LQ_REQ147_BATTLE_COMMAND_TWO_COLUMN_RESTORE)return;
const style=document.createElement('style');
style.id='lqReq147BattleCommandTwoColumnStyle';
style.textContent=`
.lqReq147BattleCard .row{
 display:grid!important;
 grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
 grid-auto-flow:row!important;
 gap:8px!important;
 width:100%!important;
}
.lqReq147BattleCard .row>button,
.lqReq147BattleCard .row>.btn{
 width:100%!important;
 min-width:0!important;
 margin:0!important;
}
@media (max-width:430px){
 .lqReq147BattleCard .row{gap:6px!important;}
 .lqReq147BattleCard .row>button,
 .lqReq147BattleCard .row>.btn{font-size:13px!important;padding:9px 6px!important;}
}
`;
document.head.appendChild(style);
function markBattleCard(){
 document.querySelectorAll('#app .card').forEach(card=>card.classList.toggle('lqReq147BattleCard',!!card.querySelector('.enemy')));
}
const observer=new MutationObserver(markBattleCard);
observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
markBattleCard();
window.LQ_REQ147_BATTLE_COMMAND_TWO_COLUMN_RESTORE={version:'1.0.1',columns:2,multiRow:true,scope:'battle-only'};
})();
