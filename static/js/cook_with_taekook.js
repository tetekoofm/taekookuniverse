document.addEventListener('DOMContentLoaded', () => {
    // Grab main scenes
    const landingScene = document.getElementById('landingScene');
    const rideScene = document.getElementById('rideScene');
    const restaurantScene = document.getElementById('restaurantScene');
    const startCookingBtn = document.getElementById('startCookingBtn');
    const kitchenScene = document.getElementById('kitchenScene');
    const startBtn = document.getElementById('startRideBtn');
    const motorbike = document.getElementById('motorbike');
    const sky = document.getElementById('sky');

    // Hide everything except landing
    landingScene.classList.remove('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    if (kitchenScene) kitchenScene.classList.add('hidden');

    // Add stars
    if (sky) {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.top = Math.random() * 80 + "%";
            star.style.left = Math.random() * 100 + "%";
            star.style.width = (Math.random() * 2 + 1) + "px";
            star.style.height = star.style.width;
            star.style.background = Math.random() > 0.5 ? "#8affc1" : "#c88aff";
            sky.appendChild(star);
        }
    }

    // Ride animation
    startBtn.addEventListener('click', () => {
        landingScene.classList.add('hidden');
        rideScene.classList.remove('hidden');
    
        let pos = -300;
        const interval = setInterval(() => {
            pos += 70;
            motorbike.style.right = pos + 'px';
    
            if (pos > window.innerWidth) {
                clearInterval(interval);
                rideScene.classList.add('hidden');
                restaurantScene.classList.remove('hidden');
    
                // Attach Start Cooking button listener **here**, after restaurant is visible
                const startCookingBtn = document.getElementById('startCookingBtn');
                if (startCookingBtn) {
                    startCookingBtn.addEventListener('click', () => {
                        restaurantScene.classList.add('hidden');
                        if (kitchenScene) kitchenScene.classList.remove('hidden');
    
                        // Optionally start first instruction
                        if (chatBubble && chatText && instructionText && nextBtn) {
                            chatText.textContent = "Hi! Let's start cooking!";
                            instructionText.textContent = "Hi! Let's start cooking!";
                            chatBubble.classList.remove('hidden');
                            nextBtn.classList.remove('hidden');
                        }
                    });
                }
            }
        }, 30);
    });
    

    const chatBubble = document.getElementById('chatBubble');
    const chatText = document.getElementById('chatText');
    const instructionText = document.getElementById('instructionText');
    const nextBtn = document.getElementById('nextInstructionBtn');

    const instructions = [
        "Hi! Let's start cooking!",
        "First, grab a fresh bowl from the counter.",
        "Now, pour some ingredients into the bowl.",
        "Mix them well until smooth.",
        "Great! Let's move to the next step..."
    ];

    let currentStep = 0;

    function showInstruction(step) {
        chatText.textContent = instructions[step];
        instructionText.textContent = instructions[step];
        chatBubble.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }

    nextBtn.addEventListener('click', () => {
        currentStep++;
        if(currentStep < instructions.length) {
            showInstruction(currentStep);
        } else {
            chatBubble.classList.add('hidden');
            nextBtn.classList.add('hidden');
            // TODO: Show first cooking mini-game scene
        }
    });

    // Start with first instruction
    showInstruction(currentStep);


    const nextInstructionBtn = document.getElementById('nextInstructionBtn');

    // Show first instruction when kitchen appears
    function showChat(message) {
        if (chatBubble && chatText) {
            chatText.textContent = message;
            chatBubble.classList.remove('hidden');
            nextInstructionBtn.classList.remove('hidden');
        }
    }

    // Add listener for next instructions
    if (nextInstructionBtn) {
        nextInstructionBtn.addEventListener('click', () => {
            // Replace with next step logic
            chatText.textContent = "Step 1: Grab the ingredients!";
        });
    }
});