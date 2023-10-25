const staticCacheName = 'site-static-v1.2'

const assets = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./fallback.html"
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
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheResult => {
            return cacheResult || fetch(event.request)
                .then(fetchRes => {
                    if (!fetchRes || fetchRes.status !== 200) {
                        throw new Error('Network error');
                    }
                    caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request, fetchRes.clone());
                    });
                    return fetchRes;
                })
                .catch(() => caches.match('/fallback.html'));
        })
    );
});



const dynamicCacheName = 'site-dynamic-v1'

self.addEventListener('fetch', event => {
    if (!(event.request.url.indexOf('http') === 0)) return;

    event.respondWith(
        caches.match(event.request).then(cacheResult => {
            return (
                cacheResult ||
                fetch(event.request).then(async fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone());

                        return fetchRes;
                    });
                })
            );
        }).catch(() => {
            // If the above code fails, serve the fallback page.
            return caches.match('/fallback.html');
        })
    );
});


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

limitCacheSize(dynamicCacheName, 20)