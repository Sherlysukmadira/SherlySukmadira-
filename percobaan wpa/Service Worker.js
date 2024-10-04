const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/halaman.html',
    '/index.html',
    '/style.css',
    '/patners.html',
    '/offline.html', 
    '/images/offline-image.png' // Pastikan file ini ada jika ingin menampilkan gambar offline
];

// Event install untuk caching
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // Menggunakan addAll untuk cache multiple URL sekaligus
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to cache during install:', error); // Menampilkan kesalahan jika gagal
            })
    );
});

// Event fetch untuk mengambil resource dari cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika request ditemukan di cache, kembalikan dari cache
                return response || fetch(event.request);
            })
            .catch(() => {
                // Jika request tidak ditemukan di cache dan pengguna offline
                // Cek apakah ini request untuk navigasi halaman
                if (event.request.mode === 'navigate') {
                    // Kembalikan halaman offline
                    return caches.match('/offline.html');
                } else if (event.request.destination === 'image') {
                    // Jika request gambar gagal, kembalikan gambar default
                    return caches.match('/images/offline-image.png');
                }
            })
    );
});

// Event activate untuk menghapus cache lama
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Hanya cache yang baru
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Hapus cache lama
                    }
                })
            );
        })
    );
});
