document
    .getElementById('button')
    .addEventListener('click', console.log);

addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./serviceWorker.js');
        } catch (err) {
            console.log(err);
        }
    }
});
