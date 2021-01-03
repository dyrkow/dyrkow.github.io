const button = document.getElementById('button');

button.addEventListener('click', () => {
    button.textContent = 'Worked!'
});

addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./serviceWorker.js');
        } catch (err) {
            console.log(err);
        }
    }
});
