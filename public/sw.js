const CACHE='parla-v3';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/favicon.svg','/manifest.webmanifest'])));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('parla-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.includes('auth')||u.pathname.includes('signin')||u.pathname.includes('callback')||u.pathname.includes('signout'))return;
 if(event.request.mode==='navigate'&&u.pathname==='/'){event.respondWith(fetch(event.request).then(res=>{if(res.ok&&res.headers.get('content-type')?.includes('text/html')){const copy=res.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put('/',copy)));}return res;}).catch(async()=>await caches.match('/')||new Response('Parla: apri il sito una prima volta online per renderlo disponibile offline.',{headers:{'Content-Type':'text/plain;charset=utf-8'}})));return;}
 if(/\.(js|css|svg|png|webmanifest)$/.test(u.pathname)){event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{if(res.ok){const copy=res.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return res;})));}
});

