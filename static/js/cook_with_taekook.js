const startBtn = document.getElementById('startRideBtn');
const landingScene = document.getElementById('landingScene');
const rideScene = document.getElementById('rideScene');
const restaurantScene = document.getElementById('restaurantScene');
const motorbike = document.getElementById('motorbike');

startBtn.addEventListener('click', () => {
    // Hide landing, show ride scene
    landingScene.classList.add('hidden');
    rideScene.classList.remove('hidden');

    // Animate motorbike across screen
    let pos = -300;
    const interval = setInterval(() => {
        pos += 5; // speed
        motorbike.style.right = pos + 'px';
        if(pos > window.innerWidth) {
            clearInterval(interval);
            // Transition to restaurant scene
            rideScene.classList.add('hidden');
            restaurantScene.classList.remove('hidden');
        }
    }, 30);
});
