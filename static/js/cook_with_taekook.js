const startBtn = document.getElementById('startRideBtn');
const landingScene = document.getElementById('landingScene');
const rideScene = document.getElementById('rideScene');
const restaurantScene = document.getElementById('restaurantScene');
const motorbike = document.getElementById('motorbike');
const sky = document.getElementById('sky');

startBtn.addEventListener('click', () => {
    // Hide landing, show ride scene
    landingScene.classList.add('hidden');
    rideScene.classList.remove('hidden');

    // Animate motorbike across screen
    let pos = -300;
    const interval = setInterval(() => {
        pos += 7; // speed
        motorbike.style.right = pos + 'px';
        if(pos > window.innerWidth) {
            clearInterval(interval);
            // Transition to restaurant scene
            rideScene.classList.add('hidden');
            restaurantScene.classList.remove('hidden');
        }
    }, 30);
});

for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = Math.random() * 80 + "%";   // keep stars above road
    star.style.left = Math.random() * 100 + "%";
    star.style.width = (Math.random() * 2 + 1) + "px";
    star.style.height = star.style.width;
    star.style.background = Math.random() > 0.5 ? "#8affc1" : "#c88aff";
    sky.appendChild(star);
}


