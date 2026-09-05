(() => {
'use strict';

/* LUKE QUEST v0.32 proper JRPG adventure menu.
   Replaces the dialogue-only memo with a status/equipment/items/objective overlay. */

s.pauseOpen=false;

const style=document.createElement('style');
style.textContent=`
.lqPauseOverlay{position:absolute;inset:0;z-index:48;background:linear-gradient(180deg,#06101aF5,#081421FC);display:flex;align-items:center;justify-content:center;padding:12px;backdrop-filter:blur(4px)}
.lqPausePanel{width:min(460px,97%);max-height:94%;overflow:auto;background:linear-gradient(180deg,#10253b,#091724);border:2px solid #d4b75f;border-radius:16px;box-shadow:0 18px 46px #000d,inset 0 0 45px #4486b316;padding:12px}
.lqPauseTop{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ffffff1a;padding-bottom:9px;margin-bottom:10px}.lqPauseTitle{font-family:Georgia,serif;color:#ffe8a4;font-size:21px;font-weight:900}.lqAutosaveMark{font-size:9px;color:#8cdca5;background:#0c2a20;border:1px solid #65c58a55;border-radius:999px;padding:4px 7px;font-weight:900}
.lqPauseHero{display:grid;grid-template-columns:74px 1fr;gap:10px;align-items:center;background:#081521;border:1px solid #ffffff17;border-radius:12px;padding:9px;margin-bottom:9px}.lqHeroEmblem{width:68px;height:68px;border-radius:50%;background:radial-gradient(circle,#376da8,#102c50 68%);border:3px solid #d4b75f;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff1b8;font-weight:950;box-shadow:0 5px 14px #0008}.lqHeroName{font-size:18px;font-weight:950}.lqHeroLv{color:#9db2c7;font-size:11px;margin-top:2px}.lqExpTrack{height:8px;background:#1b2936;border-radius:99px;overflow:hidden;margin-top:7px}.lqExpTrack i{display:block;height:100%;background:linear-gradient(90deg,#5aa4da,#8dd8eb)}
.lqPauseStats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:9px}.lqPauseStat{background:#0a1926;border:1px solid #ffffff14;border-radius:9px;padding:7px;text-align:center}.lqPauseStat small{display:block;color:#8fa4b8;font-size:8px}.lqPauseStat b{font-size:14px;color:#f3f6fa}
.lqPauseSection{background:#091722;border:1px solid #ffffff13;border-radius:11px;padding:9px;margin-bottom:8px}.lqPauseSection h3{font-size:10px;color:#e5c96d;letter-spacing:.11em;margin:0 0 6px}.lqPauseObjective{color:#eaf2f6;font-size:12px;line-height:1.5}.lqEquipRow{display:grid;grid-template-columns:1fr 1fr;gap:6px}.lqEquipBox{background:#0e2030;border-radius:8px;padding:7px;color:#8fa4b8;font-size:9px}.lqEquipBox b{display:block;color:#eef4f7;font-size:12px;margin-top:2px}.lqInventoryRow{display:flex;gap:7px;flex-wrap:wrap}.lqItemChip{background:#162b39;border:1px solid #ffffff17;border-radius:999px;padding:6px 9px;font-size:10px;color:#dce8ee}.lqItemChip strong{color:#ffe39a}.lqPauseButtons{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.lqPauseBtn{min-height:46px;border-radius:10px;border:1px solid #ffffff22;background:#304e69;color:white;font-weight:900}.lqPauseBtn.primary{background:#715e2b;border-color:#e4ca6c55}.lqPauseVersion{text-align:center;color:#61768a;font-size:8px;margin-top:8px;letter-spacing:.08em}
@media(max-width:390px){.lqPausePanel{padding:9px}.lqPauseStats{grid-template-columns:repeat(2,1fr)}.lqPauseHero{grid-template-columns:62px 1fr}.lqHeroEmblem{width:56px;height:56px}.lqPauseTitle{font-size:18px}}
`;
document.head.appendChild(style);

function menuObjectiveV32(){
 if(s.flags?.leonSecondSeen)return'北の尾根へ進み、負傷したレオンを追う。';
 if(s.flags?.withdrawProofSeen)return'北の崖道へ進み、レオンを追う。';
 if(s.flags?.evacEntered)return'北の退避路でレオンと魔王軍の痕跡を調べる。';
 if(s.flags?.glennSeen)return'北の封鎖線を越え、レオンを追う。';
 if(s.flags?.observationEntered)return'魔王軍監視区域でグレン隊長を探す。';
 if(s.flags?.glennTraceSeen)return'霧の先にある魔王軍監視区域へ進む。';
 if(s.flags?.mistEntered)return'霧の追跡路で魔王軍の痕跡を調べる。';
 if(s.flags?.leonSeen)return'レオンを追って森の北側から霧へ進む。';
 if(s.wins<2)return'王都近郊で2勝し、北東の魔物の森へ入る。';
 return s.map==='forest'?'森の北側から深部へ進む。':s.map==='deepForest'?'森の深部でレオンを探す。':'北東の魔物の森へ向かい、レオンを探す。';
}
function menuHtmlV32(){
 const expPct=Math.max(0,Math.min(100,100*s.xp/s.nx));
 const gearCount=(s.equipmentOwned||[]).length;
 return `<div class=lqPauseOverlay><div class=lqPausePanel><div class=lqPauseTop><div class=lqPauseTitle>冒険メニュー</div><div class=lqAutosaveMark>● AUTOSAVE</div></div>
 <div class=lqPauseHero><div class=lqHeroEmblem>LUKE<br>QUEST</div><div><div class=lqHeroName>ルーク</div><div class=lqHeroLv>LV ${s.lv}　次のLVまで ${Math.max(0,s.nx-s.xp)} EXP</div><div class=lqExpTrack><i style="width:${expPct}%"></i></div></div></div>
 <div class=lqPauseStats><div class=lqPauseStat><small>HP</small><b>${s.hp}/${s.mh}</b></div><div class=lqPauseStat><small>ATK</small><b>${s.atk}</b></div><div class=lqPauseStat><small>DEF</small><b>${s.def||0}</b></div><div class=lqPauseStat><small>GOLD</small><b>${s.gold}</b></div></div>
 <div class=lqPauseSection><h3>MAIN OBJECTIVE</h3><div class=lqPauseObjective>${menuObjectiveV32()}</div><div class=lqGoodDetail style="margin-top:5px">現在地：${MAPS[s.map]?.name||s.map}</div></div>
 <div class=lqPauseSection><h3>EQUIPMENT</h3><div class=lqEquipRow><div class=lqEquipBox>武器<b>${s.weapon||'旅人の短剣'}</b></div><div class=lqEquipBox>防具<b>${s.armor||'旅人服'}</b></div></div></div>
 <div class=lqPauseSection><h3>ITEMS / RECORD</h3><div class=lqInventoryRow><div class=lqItemChip>薬草 <strong>×${s.potions}</strong></div><div class=lqItemChip>勝利 <strong>${s.wins}</strong></div><div class=lqItemChip>装備所持 <strong>${gearCount}</strong></div></div></div>
 <div class=lqPauseButtons><button class="lqPauseBtn primary" onclick=lqMenuSave()>今すぐセーブ</button><button class=lqPauseBtn onclick=lqClosePause()>冒険へ戻る</button></div><div class=lqPauseVersion>LUKE QUEST • SAVE DATA lukeQuestV2</div></div></div>`;
}
function decoratePauseV32(){if(!s.pauseOpen||s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqPauseOverlay'))return;shell.insertAdjacentHTML('beforeend',menuHtmlV32());}
window.lqClosePause=function(){s.pauseOpen=false;render();};
window.lqMenuSave=function(){save();const mark=app.querySelector('.lqAutosaveMark');if(mark){mark.textContent='✓ SAVED';setTimeout(()=>{if(mark)mark.textContent='● AUTOSAVE'},900);}};

openMenu=function(){stopMoving();if(s.shopOpen)return;s.pauseOpen=true;render();};
const moveV31=move;
move=function(dir){if(s.pauseOpen){stopMoving();return}return moveV31(dir);};
const actionV31=action;
action=function(){if(s.pauseOpen){stopMoving();return}return actionV31();};
const worldV31=world;
world=function(){worldV31();decoratePauseV32();};
const renderV31=render;
render=function(){const r=renderV31();if(s.pauseOpen)decoratePauseV32();return r;};

window.LQ_MENU_STATUS={fullStatusMenu:true,equipmentView:true,itemView:true,objectiveView:true,manualSaveButton:true};
if(s.screen==='world')render();
})();
