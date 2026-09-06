(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
  const api=window.LQ_OPTIONAL_OBJECTIVE_TEST;
  if(!api||typeof api.optionalText!=='function')throw new Error('REQ-075 optional objective diagnostic API missing');
  const oldFlags=s.flags,oldKills=s.forestBountyKills;
  try{
    s.flags={forestBountyComplete:true};s.forestBountyKills=0;
    if(api.optionalText()!=='')throw new Error('REQ-075 pre-discovery spoiler leak');

    s.flags={forestBountyComplete:true,forestMiniBossWarned:true};
    const bossText=api.optionalText();
    if(!bossText.includes('巨大な蹄跡')||!bossText.includes('もう一度調べる'))throw new Error('REQ-075 discovered boss objective missing');

    s.flags={forestBountyComplete:true,forestMiniBossWarned:true,forestMiniBossDefeated:true};
    if(api.optionalText()!=='')throw new Error('REQ-075 defeated boss chip did not clear');

    s.flags={elderCharmQuest:true,forestMiniBossWarned:true};
    if(api.optionalText()!=='王都近郊で銀留め具を探す')throw new Error('REQ-075 elder charm precedence regressed');

    s.flags={forestBountyAccepted:true,forestMiniBossWarned:true};s.forestBountyKills=2;
    if(api.optionalText()!=='森の討伐 2/3')throw new Error('REQ-075 forest bounty precedence regressed');

    s.flags={lqHerbSampleQuestAsked:true,forestMiniBossWarned:true};
    if(!api.optionalText().includes('薬草'))throw new Error('REQ-075 herb sample precedence regressed');

    s.flags={forestBountyComplete:true,forestMiniBossWarned:true};
    const before=JSON.stringify(s.flags);api.optionalText();
    if(JSON.stringify(s.flags)!==before)throw new Error('REQ-075 projection mutated flags');
    const status=window.LQ_OPTIONAL_OBJECTIVE_STATUS;
    if(!status?.tracks?.includes('forestMiniBoss')||status.spoilerSafe!==true)throw new Error('REQ-075 status contract missing');
    document.documentElement.dataset.req075OptionalBossChip='pass';
  } finally {
    s.flags=oldFlags;s.forestBountyKills=oldKills;
  }
});
})();
