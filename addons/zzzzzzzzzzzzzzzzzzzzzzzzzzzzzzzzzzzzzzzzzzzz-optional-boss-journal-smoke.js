(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
  const api=window.LQ_ADVENTURE_JOURNAL_TEST;
  if(!api||typeof api.sideQuests!=='function')throw new Error('REQ-074 journal diagnostic API missing');
  const oldFlags=s.flags;
  try{
    const bossRows=rows=>rows.filter(x=>x.text==='巨大な蹄跡'||x.text==='苔角の森王');
    s.flags={forestBountyComplete:true};
    if(bossRows(api.sideQuests()).length!==0)throw new Error('REQ-074 pre-discovery spoiler leak');

    s.flags={forestBountyComplete:true,forestMiniBossWarned:true};
    let boss=bossRows(api.sideQuests());
    if(boss.length!==1||boss[0].text!=='巨大な蹄跡'||boss[0].done||!boss[0].detail.includes('もう一度調べる'))throw new Error('REQ-074 discovered objective invalid');

    s.flags={forestBountyComplete:true,forestMiniBossWarned:true,forestMiniBossDefeated:true};
    boss=bossRows(api.sideQuests());
    if(boss.length!==1||boss[0].text!=='苔角の森王'||boss[0].done!==true)throw new Error('REQ-074 defeated row invalid');

    s.flags={elderCharmComplete:true,forestBountyComplete:true,lqHerbSampleQuestDone:true,forestMiniBossWarned:true,forestMiniBossDefeated:true};
    const before=JSON.stringify(s.flags),rows=api.sideQuests();
    if(JSON.stringify(s.flags)!==before)throw new Error('REQ-074 projection mutated flags');
    for(const title of ['旅好きの老人の銀留め具','森の討伐依頼','森の薬草標本','苔角の森王']){
      if(rows.filter(x=>x.text===title).length!==1)throw new Error(`REQ-074 completion family invalid: ${title}`);
    }
    if(rows.length!==4)throw new Error(`REQ-074 expected four completed rows, got ${rows.length}`);
    document.documentElement.dataset.req074OptionalBossJournal='pass';
  } finally {
    s.flags=oldFlags;
  }
});
})();
