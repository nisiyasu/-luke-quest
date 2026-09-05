(() => {
'use strict';

/* REQ-010 hardening: load last alphabetically so later add-on action wrappers cannot swallow the attic door interaction. */
const actionBase=action;
function atticFrontNpc(){
  if(s.screen!=='world'||s.map!=='innGuestRoom')return null;
  const p=front();
  /* Use the canonical guest-room NPC array directly. Some presentation/content add-ons wrap currentNpcs() for transient overlays. */
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
window.LQ_INN_ATTIC_ENTRY_GUARD={status:'ACTIVE',loadOrder:'late',target:'lqAtticDoor',map:'innGuestRoom',lookup:'canonical-map'};
})();