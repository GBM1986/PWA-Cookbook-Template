const staticCacheName = 'site-static-v1.1'

const assets = [
    "/",
    "/index.html",
    "/css/styles.css"
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

// Install Service Worker
self.addEventListener('activate', event => {
	console.log('Service Worker has been activated');

    caches.keys().then(keys => {
        
    })
})

