;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_churromania',
  urlsToCache = [
    './',
    'https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i',
    'https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i',
    '../vendor/bootstrap/css/bootstrap.min.css',
    '../css/business-casual.min.css',
    '../Churromania/img/FChurros.jpg',
    '../Churromania/img/about.jpg',
    '../Churromania/img/intro.jpg',
    '../Churromania/img/products-01.jpg',
    '../Churromania/img/products-02.jpg',
    '../Churromania/img/products-03.jpg',
    '../script.js',
    '../Churromania/favicon_package/favicon-32x32.png',
    '../Churromania/favicon_package/favicon-16x16.png',
    "../Churromania/favicon_package/apple-touch-icon.png",
    "../Churromania/img/Favicon.svg",
    "vendor/jquery/jquery.min.js",
    "vendor/bootstrap/js/bootstrap.bundle.min.js",
    "/safari-pinned-tab.svg",
    
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})