// Var med navn på statsik cache
const staticCacheName = "stite-static-v1.1";

const dynamicCacheName = 'site-dynamic-v1.0'
// Array med filer
const assets = [
    '/',
    '/index.html',
    '/css/styles.css'
]

//Registerer service worker

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw2.js')
	.then(reg => console.log('service worker registered', reg))
	.catch(err => console.error('service worker not registered', err)) 
}

// Installerer service worker og cacher nødvendig filer

self.addEventListener ('install', event => {
    console.log('Service worker has benn installed');
    //Skriver filer til statisk cache
    event.waitUntil(
        caches.open(staticCacheName).then(cache =>{
            console.log('skriver til statisk cache')
            cache.addAll(asstets)
        })
    )
})

// Akitiverer service worker

self.addEventListener('activate', event => {
    console.log('Service Worker has been activated');
    // Skriver tildligere versioner af cache
    event.waitUntil(
        caches.keys().then(keys => {
            const filteredkeys = keys.filter(key => key !== staticCacheName)
            filteredkeys.map(key => caches.delete(key))
        })
    )
})

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
        })
    )
})

