self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    try{await self.registration.unregister();}catch(_e){}
    const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clientsList){try{client.postMessage({type:'LQ_SW_PURGED'});}catch(_e){}}
  })());
});
// Emergency recovery worker: intentionally no fetch handler.
// Existing controlled clients should be fully closed and reopened after this deploy.
