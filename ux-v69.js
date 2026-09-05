(() => {
'use strict';

/* LUKE QUEST v0.69 dialogue scene polish.
   Adds lightweight portrait entrance, speaker framing and text reveal without slowing input. */

const style=document.createElement('style');
style.textContent=`
.dialogBox{border-top:2px solid #e1cb7b!important}.dialogBox:before{content:"";position:absolute;left:12px;right:12px;top:0;height:1px;background:linear-gradient(90deg,transparent,#fff2bd88,transparent);pointer-events:none}.dialogBox .speaker{display:inline-flex;align-items:center;gap:5px;color:#ffe69c!important}.dialogBox .speaker:before{content:"◆";font-size:7px;color:#caaa52}.dialogBox .dialog{animation:lqDialogueCopyIn .18s ease-out both}@keyframes lqDialogueCopyIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.dialogBox.portraitMode .dialogPortrait{animation:lqPortraitLeftIn .22s ease-out both}.dialogBox.portraitMode.portraitRight .dialogPortrait{animation-name:lqPortraitRightIn}@keyframes lqPortraitLeftIn{from{opacity:.2;transform:translateX(-10px)}to{opacity:1;transform:none}}@keyframes lqPortraitRightIn{from{opacity:.2;transform:translateX(10px)}to{opacity:1;transform:none}}.dialogPortrait img{filter:saturate(1.06) contrast(1.04) drop-shadow(0 4px 5px #0007)!important}.portraitBadge{border-color:#dfc66a55!important;color:#ffe8a4!important;background:#07111fe8!important}.dialogHint{letter-spacing:.08em;color:#879db1!important}.dialogHint:before{content:"A  ";color:#f1d878;font-weight:950}
@media(prefers-reduced-motion:reduce){.dialogBox .dialog,.dialogPortrait{animation:none!important}}
`;
document.head.appendChild(style);
window.LQ_DIALOGUE_POLISH_STATUS={portraitEntrance:true,textEntrance:true,speakerFrame:true,reducedMotionSafe:true};
})();
