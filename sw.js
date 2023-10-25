const staticCacheName = 'site-static-v1.2'

const assets = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/fallback.html"
]

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('write assets files to cache')
            cache.addAll(assets)
        })
    )
	console.log('Service Worker has been installed');
})

//Install Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker has been activated');

    event.waitUntil(
        caches.keys().then(keys => {
            const filteredKeys = keys.filter(key => key !== staticCacheName);
            const deletePromises = filteredKeys.map(key => caches.delete(key));
            return Promise.all(deletePromises);
        })
    );
});


const dynamicCacheName = 'site-dynamic-v1'

self.addEventListener('fetch', event => {
    if(!(event.request.url.indexOf('http') === 0)) return

    event.respondwith(
        caches.match(event.request).then(cacheResult => {
            return (
                cacheResult || 
                fetch(event.request).then(async fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone())

                        return fetchRes
                    })
                })
            )
        }).catch(() => {
			// Hvis ovenstående giver fejl kaldes fallback siden			
			return caches.match('/fallback.html')
		})
    )
})

// Limit Funktion
// Funktion til styring af antal filer i en given cache
const limitCacheSize = (cacheName, numberOfAllowedFiles) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys=> {
            if(keys.length > numberOfAllowedFiles) {
                cache.delete(keys[0]).then(limitCacheSize(cacheName,numberOfAllowedFiles))
            }
        })
    })
}

limitCacheSize(dynamicCacheName, 8)