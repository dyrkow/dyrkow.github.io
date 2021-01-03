
const cacheKey = 'app-v1';
const assets = ['index.html', 'index.js'];

addEventListener('install', async () => {
    const cache = await caches.open(cacheKey);
    await cache.addAll(assets);
});

addEventListener('fetch', () => {
    console.log('fetch request')
});

