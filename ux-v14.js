(() => {
'use strict';

/* LUKE QUEST v0.14 town-services patch.
   Adds a usable item shop and inn while preserving existing exploration/battle rules. */

const mina=MAPS.town&&MAPS.town.npcs&&MAPS.town.npcs.find(n=>n.name==='道具屋のミナ');
if(mina){
  mina.kind='lqShop';
  mina.text='薬草は8Gです。Aで話しかけるたびに1個購入できます。\nミナ「勇気は売り切れですけど、薬草なら在庫ありますよ。」';
}

if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqInn')){
  MAPS.town.npcs.push({
    x:5,y:12,e:'🛏️',name:'南門宿の主人',kind:'lqInn',
    text:'一泊12G。HPを全回復できます。'
  });
}

function townServiceNpcAhead(){
  if(typeof front!=='function'||typeof currentNpcs!=='function')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}

function useShop(){
  stopMoving();
  if(s.gold<8){
    s.dialog={name:'道具屋のミナ',text:`薬草は8Gです。\n所持金：${s.gold}G\nミナ「あと${8-s.gold}Gですね。魔物にはツケが効かないのでお気をつけて。」`};
    render();return;
  }
  s.gold-=8;
  s.potions++;
  s.dialog={name:'道具屋のミナ',text:`薬草を1個買った！\n所持：${s.potions}個　残金：${s.gold}G\nミナ「毎度ありがとうございます。勇者割引は……勇者が増えたら考えます。」`};
  render();
}

function useInn(){
  stopMoving();
  if(s.hp>=s.mh){
    s.dialog={name:'南門宿の主人',text:`HPはすでに満タンです（${s.hp}/${s.mh}）。\n主人「元気な人から宿代を取るほど鬼ではありません。また疲れたらどうぞ。」`};
    render();return;
  }
  if(s.gold<12){
    s.dialog={name:'南門宿の主人',text:`一泊12Gです。\n所持金：${s.gold}G\n主人「不足分は……勇者の笑顔では払えませんね。」`};
    render();return;
  }
  s.gold-=12;
  const before=s.hp;
  s.hp=s.mh;
  s.dialog={name:'南門宿の主人',text:`一晩休んだ。HPが ${before} → ${s.hp} に全回復！\n残金：${s.gold}G\nルーク「戦わずにHPが戻る。宿屋って最高の魔法ですね。」`};
  render();
}

const actionV13=action;
action=function(){
  if(s.dialog)return actionV13();
  if(s.screen==='world'&&s.map==='town'){
    const n=townServiceNpcAhead();
    if(n&&n.kind==='lqShop')return useShop();
    if(n&&n.kind==='lqInn')return useInn();
  }
  return actionV13();
};

const style=document.createElement('style');
style.textContent=`
.shopHint{color:#f6d35b;font-weight:900}
`;
document.head.appendChild(style);

window.LQ_TOWN_SERVICES={shop:{item:'薬草',price:8},inn:{price:12}};

if(typeof s!=='undefined'&&s.screen==='world'&&s.map==='town')render();

})();
