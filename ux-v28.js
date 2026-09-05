(() => {
'use strict';

/* LUKE QUEST v0.28 title/intro presentation pass.
   Upgrades the first impression without changing intro text, progression, saves or story canon. */

const style=document.createElement('style');
style.textContent=`
.lqTitleStage{position:relative;overflow:hidden;min-height:520px;padding:28px 20px 22px!important;background:linear-gradient(180deg,#081a33 0,#102f54 48%,#07121e 100%)!important;border:1px solid #d7b75766!important;box-shadow:0 18px 50px #000c,inset 0 0 70px #2d6ead22!important;text-align:center}
.lqTitleStage:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 18%,#79b9ff22 0 13%,transparent 35%),linear-gradient(155deg,transparent 0 43%,#ffffff08 44% 47%,transparent 48%);pointer-events:none}
.lqTitleMountains{position:absolute;left:-8%;right:-8%;bottom:0;height:48%;background:linear-gradient(145deg,transparent 0 34%,#132337 35% 52%,transparent 53%),linear-gradient(215deg,transparent 0 38%,#0d1c2d 39% 55%,transparent 56%),linear-gradient(165deg,transparent 0 55%,#09131f 56%);opacity:.95;pointer-events:none}
.lqTitleStars{position:absolute;inset:0;background-image:radial-gradient(circle,#fff 0 1px,transparent 1.5px);background-size:47px 43px;opacity:.24;mask-image:linear-gradient(#000,transparent 65%);pointer-events:none}
.lqCrest{position:relative;z-index:2;width:106px;height:122px;margin:4px auto 12px;filter:drop-shadow(0 10px 12px #0008)}
.lqCrestShield{position:absolute;left:18px;top:18px;width:70px;height:86px;background:linear-gradient(135deg,#4176bd,#173a70);border:5px solid #d9bb60;clip-path:polygon(50% 0,94% 14%,88% 70%,50% 100%,12% 70%,6% 14%);box-shadow:inset 0 0 0 4px #9dd2ff22}
.lqCrestSword{position:absolute;left:49px;top:2px;width:9px;height:105px;background:linear-gradient(90deg,#9aa9b8,#f5fbff 50%,#8798a9);border-radius:5px;transform:rotate(28deg);box-shadow:0 0 0 2px #d8b458}
.lqCrestSword:before{content:"";position:absolute;left:-15px;top:70px;width:39px;height:8px;border-radius:5px;background:#d8b458}.lqCrestSword:after{content:"";position:absolute;left:0;bottom:-12px;width:9px;height:18px;border-radius:0 0 8px 8px;background:#704a2c}
.lqTitleLogo{position:relative;z-index:2;font-family:Georgia,'Times New Roman',serif;font-size:39px;font-weight:900;letter-spacing:.055em;color:#fff3c7;text-shadow:0 3px 0 #243853,0 0 18px #73adff55;margin-top:2px}
.lqTitleJp{position:relative;z-index:2;color:#cbd8e8;font-size:13px;letter-spacing:.22em;margin:5px 0 22px}.lqTitleChapter{position:relative;z-index:2;display:inline-block;padding:6px 12px;border:1px solid #d9bb6077;border-radius:999px;background:#071525aa;color:#f5da84;font-size:11px;font-weight:900;margin-bottom:18px}
.lqTitleStage .btn{position:relative;z-index:2;max-width:360px;margin:7px auto;display:block;min-height:52px;border:1px solid #ffffff22;letter-spacing:.04em}.lqTitleStage .btn.gold{border-color:#ffe8a066;box-shadow:0 5px 16px #0008,0 0 18px #e3bb4130}
.lqTitleFlavor{position:relative;z-index:2;margin:18px auto 0;max-width:380px;color:#99aac0;font-size:11px;line-height:1.6}
.lqIntroBackdrop{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 50% 22%,#668dca2e 0 12%,transparent 35%),linear-gradient(180deg,#091528,#14233b 55%,#070d17);pointer-events:none}
.lqIntroScene{position:relative;overflow:hidden;border-color:#d9c27a55!important;background:linear-gradient(180deg,#14243a,#091321)!important;box-shadow:0 16px 42px #000b!important;min-height:230px}.lqIntroScene:before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,#eed277,transparent)}
.lqIntroScene .speaker{font-size:17px}.lqIntroScene .dialog{font-size:15px;line-height:1.7}.lqIntroStep{font-size:10px;color:#8fa3bb;text-align:right;letter-spacing:.12em;margin:-4px 4px 8px}
@media(max-width:390px){.lqTitleStage{min-height:480px;padding:20px 14px!important}.lqCrest{transform:scale(.88);margin-bottom:4px}.lqTitleLogo{font-size:32px}.lqTitleJp{font-size:11px}.lqIntroScene .dialog{font-size:14px}}
`;
document.head.appendChild(style);

function decorateTitle(){
  if(s.screen!=='title')return;
  const cards=app.querySelectorAll('.card');const card=cards[0];if(!card||card.dataset.lqTitle==='1')return;
  card.dataset.lqTitle='1';card.classList.add('lqTitleStage');
  card.innerHTML=`<div class="lqTitleMountains"></div><div class="lqTitleStars"></div><div class="lqCrest"><div class="lqCrestShield"></div><div class="lqCrestSword"></div></div><div class="lqTitleLogo">LUKE QUEST</div><div class="lqTitleJp">ルークと逃げた勇者</div><div class="lqTitleChapter">CHAPTER I　逃げた本命勇者を追え</div><button class="btn gold" onclick="newGame()">冒険をはじめる</button>${localStorage.getItem('lukeQuestV2')?'<button class="btn gray" onclick="continueGame()">つづきから</button>':''}<div class="lqTitleFlavor">歩いて、話して、戦って。<br>勇者になる気のなかった青年の、少し妙な冒険。</div>`;
  if(cards[1])cards[1].style.display='none';
}
function decorateIntro(){
  if(s.screen!=='intro')return;
  if(!document.querySelector('.lqIntroBackdrop')){const bg=document.createElement('div');bg.className='lqIntroBackdrop';document.body.appendChild(bg);}
  const speaker=app.querySelector('.speaker');const card=speaker?.closest('.card');if(!card)return;
  card.classList.add('lqIntroScene');
  if(!card.querySelector('.lqIntroStep')){const step=document.createElement('div');step.className='lqIntroStep';step.textContent=`PROLOGUE ${String(s.step+1).padStart(2,'0')} / ${String(intro.length).padStart(2,'0')}`;card.insertBefore(step,card.querySelector('.speaker'));}
}

const titleV27=title;
title=function(){titleV27();decorateTitle();};
const storyV27=story;
story=function(){storyV27();decorateIntro();};
const renderV27=render;
render=function(){const r=renderV27();if(s.screen==='title')decorateTitle();if(s.screen==='intro')decorateIntro();return r;};

window.LQ_PRESENTATION_V28={titleStage:true,originalCrest:true,introSceneFrame:true};
render();
})();
