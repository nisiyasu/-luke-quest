(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;
setTimeout(()=>{
 const status=window.LQ_RECOVERY_MAGIC_STATUS;
 let marker=document.getElementById('lqRecoveryMagicSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqRecoveryMagicSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const calc=status?.calculateHeal;
 const data={
  status:!!status,
  spell:status?.spell?.name==='癒光'&&status?.spell?.cost===5,
  deterministic:typeof calc==='function'&&calc(20,42,1)===17&&calc(20,42,2)===20,
  capsMissing:typeof calc==='function'&&calc(40,42,10)===2&&calc(42,42,10)===0,
  noCostNoTurn:status?.noCostAtFullHp===true&&status?.noTurnAtFullHp===true&&status?.noCostWhenInsufficientMp===true&&status?.noTurnWhenInsufficientMp===true,
  poisonDistinct:status?.spell?.curesPoison===false&&status?.preservesHerbIdentity===true,
  canonicalResponse:status?.delegatesEnemyTurnOnSuccess===true,
  mpSkillPreserved:window.LQ_MP_SKILL_STATUS?.skill?.name==='蒼閃'&&window.LQ_MP_SKILL_STATUS?.skill?.cost===4,
  normalEnemyAiPreserved:window.LQ_NORMAL_ENEMY_BEHAVIOR_STATUS?.readableIntent===true,
  poisonContractPreserved:window.LQ_STATUS_AILMENT_STATUS?.poison?.herbCures===true
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ053_RECOVERY_MAGIC_FAIL_${key}()`);},0);}
},450);
})();
