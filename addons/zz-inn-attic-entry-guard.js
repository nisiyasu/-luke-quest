(() => {
'use strict';

/* REQ-010 hardening: load last alphabetically so the guest-room map and all action wrappers already exist. */
if(MAPS.innGuestRoom&&!MAPS.innGuestRoom.npcs.some(n=>n.kind==='lqAtticDoor')){
  MAPS.innGuestRoom.npcs.push({x:8,y:4,e:'',name:'屋根裏への扉',kind:'lqAtticDoor',text:'細い階段が上へ続いている。'});
}

const actionBase=action;
function atticFrontNpc(){
  if(s.screen!=='world'||s.map!=='innGuestRoom')return null;
  const p=front();
  return (MAPS.innGuestRoom?.npcs||[]).find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterAtticGuarded(){
  stopMoving();
  s.map='innAtticLounge';
  s.x=5;
  s.y=7;
  s.dir='up';
  s.dialog={
    name:'南門宿・屋根裏談話室',
    text:'細い階段を上ると、旅人が静かに休むための小さな談話室があった。\nルーク「宿屋、冒険に出ない理由を増やしてきますね……。」'
  };
  render();
}
action=function(){
  if(!s.dialog&&atticFrontNpc()?.kind==='lqAtticDoor')return enterAtticGuarded();
  return actionBase();
};
window.LQ_INN_ATTIC_ENTRY_GUARD={status:'ACTIVE',loadOrder:'late',target:'lqAtticDoor',map:'innGuestRoom',lookup:'canonical-map',doorRegistered:!!MAPS.innGuestRoom?.npcs?.some(n=>n.kind==='lqAtticDoor')};
})();