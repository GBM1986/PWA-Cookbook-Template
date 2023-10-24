// const staticCacheName = 'site-static-v1.2'

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
// self.addEventListener('activate', event => {
// 	console.log('Service Worker has been activated');

//     event.waitUntil()
//         caches.keys().then(keys => {
//             const filteredkeys = keys.filter(key => key !== staticCacheName)
//             filteredkeys.map(key => {
//                 caches.delete(key)
//             })
//         })
// })


const dynamicCacheName = 'site-dynamic-v1'
// Fetch event
self.addEventListener('fetch', event => {
	// Kontroller svar på request
	event.respondWith(
		// Kig efter file match i cache 
		caches.match(event.request).then(cacheRes => {
			// Returner match fra cache - ellers hent fil på server
			return cacheRes || fetch(event.request).then(fetchRes => {
				// Tilføjer nye sider til cachen
				return caches.open(dynamicCacheName).then(cache => {
					// Bruger put til at tilføje sider til vores cache
					// Læg mærke til metoden clone
					cache.put(event.request.url, fetchRes.clone())
					// Returnerer fetch request
					return fetchRes
				})
			})
		})
	)
})