var _vlist_cache;
self.onactive = e=>e.waitUntil(
    (async function(){
        // vList是单文件APP，只需要缓存配置中的JS
        let config = await (await fetch('config.json')).json(),
            cache = config.extension;
        if(caches.has('vlist_jsmodule'))
            await caches.delete('vlist_jsmodule');
        // 拉取所有opener
        for(let key in config.opener)
            cache.push(config.opener[key]);
        cache.push('./','index.html');
        (await caches.open("vlist_jsmodule")).addAll(cache);
    })()
);
self.oninstall = ()=>self.skipWaiting();
self.onfetch = e=>e.respondWith(
    (async function(){
        if(!_vlist_cache) _vlist_cache = await caches.open("vlist_jsmodule");
        // 首先，如果是JS&CSS，缓存JS&CSS文件
        let match = e.request.url.lastIndexOf('.'),
            ext = e.request.url.substring(match+1);
        // 匹配缓存
        try{
            let cache = await _vlist_cache.match(e.request);
            if(cache) return cache;
            else try{
                let response = await fetch(e.request);
                if(ext == 'js' || ext == 'css')
                    _vlist_cache.put(e.request,response.clone());
                return response;
            }catch(error){
                console.warn('Fetch failed.',e,error);
                return new Response(e.message, {
                    status: 408,
                    headers: { "Content-Type": "text/plain" },
                });
            }
        }catch(e){
            return new Response(e.message, {
                status: 500,
                headers: { "Content-Type": "text/plain" },
            });
        }
    })()
);