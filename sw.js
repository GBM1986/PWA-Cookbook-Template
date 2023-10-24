// const staticCacheName = 'site-static-v1.2'

// const assets = [
//     "/",
//     "/index.html",
//     "/css/styles.css"
// ]

// // Install Service Worker
// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(staticCacheName).then(cache => {
//             console.log('write assets files to cache')
//             cache.addAll(assets)
//         })
//     )
// 	console.log('Service Worker has been installed');
// })

// // Install Service Worker
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


// const dynamicCacheName = 'site-dynamic-v1'

// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		caches.match(event.request).then(cacheRes => {
// 			return cacheRes || fetch(event.request).then(fetchRes => {
// 				return caches.open(dynamicCacheName).then(cache => {
// 					cache.put(event.request.url, fetchRes.clone())
// 					return fetchRes
// 				})
// 			})
// 		})
// 	)
// })