const LQ_PWA_RECOVERY_TOKEN='20260907-r2';

self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting())});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));

    const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const scopeUrl=new URL(self.registration.scope);
    const recoveryUrl=new URL('./',scopeUrl);
    recoveryUrl.searchParams.set('lqPwaRecovery',LQ_PWA_RECOVERY_TOKEN);

    for(const client of clientsList){
      try{
        const current=new URL(client.url);
        if(current.origin===recoveryUrl.origin && current.pathname.startsWith(scopeUrl.pathname)){
          client.postMessage({type:'LQ_SW_PURGED',recoveryToken:LQ_PWA_RECOVERY_TOKEN});
          if(current.searchParams.get('lqPwaRecovery')!==LQ_PWA_RECOVERY_TOKEN && typeof client.navigate==='function'){
            await client.navigate(recoveryUrl.href);
          }
        }
      }catch(_e){}
    }

    try{await self.registration.unregister();}catch(_e){}
  })());
});

// Emergency recovery worker: intentionally no fetch handler.
// On activation it purges CacheStorage, forces existing same-scope clients once
// onto a versioned navigation URL to bypass stale document HTTP/WebApp cache,
// then unregisters itself. The recovery token prevents navigation loops.
