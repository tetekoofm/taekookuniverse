document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
       SCENE REFERENCES
    -------------------------------------------*/
    const landingScene = document.getElementById('landingScene');
    const rideScene = document.getElementById('rideScene');
    const restaurantScene = document.getElementById('restaurantScene');
    const kitchenScene = document.getElementById('kitchenScene');

    const startRideBtn = document.getElementById('startRideBtn');
    const headToKitchenBtn = document.getElementById('headToKitchenBtn');

    const motorbike = document.getElementById('motorbike');
    const sky = document.getElementById('sky');

    const fullPanel = document.getElementById('fullInstructionPanel');
    const showFullBtn = document.getElementById('showFullInstructionsBtn');
    const startCookingBtn = document.getElementById('startCookingBtn');

    const taeText = document.getElementById('taeText');
    const kooText = document.getElementById('kooText');

    const chatSteps = [
        { id: 'taeBubble', text: "Hellooooooooooo!!! <br> We'll show you how to play the game." },
        { id: 'kooBubble', text: "Follow our steps and enjoy cooking with us!" },
        { id: 'taeBubble', text: "First, a customer will arrive at your restaurant." },
        { id: 'kooBubble', text: "They will choose a dish from the menu." },
        { id: 'taeBubble', text: "You can check the recipe or skip directly to preparation." },
        { id: 'kooBubble', text: "Next, collect the ingredients in our mini-game." },
        { id: 'taeBubble', text: "After that, help cook the dish with us." },
        { id: 'kooBubble', text: "Once done, deliver the order to the customer." },
        { id: 'taeBubble', text: "Then, a new customer arrives or you can choose to exit." },
        { id: 'kooBubble', text: "Ready? Let's start cooking and have fun!" }
    ];

    /* -------------------------------------------
       INITIAL VISIBILITY
    -------------------------------------------*/
    // landingScene.classList.remove('hidden');
    // rideScene.classList.add('hidden');
    // restaurantScene.classList.add('hidden');
    // kitchenScene.classList.add('hidden');

    landingScene.classList.add('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    kitchenScene.classList.remove('hidden');
    /* -------------------------------------------
       STARS IN SKY
    -------------------------------------------*/
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

    /* -------------------------------------------
       RIDE SEQUENCE
    -------------------------------------------*/
    startRideBtn.addEventListener('click', () => {
        landingScene.classList.add('hidden');
        rideScene.classList.remove('hidden');

        let pos = -300;

        const interval = setInterval(() => {
            pos += 70;
            motorbike.style.right = pos + 'px';

            // when bike leaves the screen → show restaurant
            if (pos > window.innerWidth) {
                clearInterval(interval);
                rideScene.classList.add('hidden');
                restaurantScene.classList.remove('hidden');
            }
        }, 30);
    });


    /* -------------------------------------------
       START COOKING → GO TO KITCHEN
    -------------------------------------------*/
    if (headToKitchenBtn) {
        headToKitchenBtn.addEventListener('click', () => {
            restaurantScene.classList.add('hidden');
            kitchenScene.classList.remove('hidden');
        });
    }

    /* -------------------------------------------
       INSTRUCTIONS SYSTEM
    -------------------------------------------*/
    let currentStep = 0;
    const chatPositions = ["35%", "45%"]; 

    function vibrateBubble(bubble) {
        bubble.classList.add('vibrate');
        setTimeout(() => bubble.classList.remove('vibrate'), 300); // matches animation duration
    }
    
    function showNextChat() {
        if (currentStep % 2 === 0) {
            taeText.textContent = chatSteps[currentStep];
            vibrateBubble(document.getElementById('taeBubble'));
        } else {
            kooText.textContent = chatSteps[currentStep];
            vibrateBubble(document.getElementById('kooBubble'));
        }
        currentStep++;
        if (currentStep < chatSteps.length) {
            setTimeout(showNextChat, 2500);
        }
    }

    // Sequential chat display
    function showNextChat() {
        // Hide all bubbles first
        chatSteps.forEach(step => {
            document.getElementById(step.id).style.display = 'none';
        });
    
        // Show current bubble
        const currentBubble = document.getElementById(chatSteps[currentStep].id);
        const currentText = chatSteps[currentStep].text;
        currentBubble.querySelector('p').innerHTML = currentText;  // <-- use innerHTML
        currentBubble.style.display = 'block';
    
        // Optional: add vibrate effect
        currentBubble.classList.add('vibrate');
        setTimeout(() => currentBubble.classList.remove('vibrate'), 300);
    
        // Move to next step
        currentStep++;
        if (currentStep < chatSteps.length) {
            setTimeout(showNextChat, 2500);
        }
    }
    showNextChat();
    

    // Show full instructions
    showFullBtn.addEventListener('click', () => {
        fullPanel.classList.remove('hidden');
        taeText.textContent = '';
        kooText.textContent = '';
        showFullBtn.style.display = 'none';
    });

    // Start Cooking
    startCookingBtn.addEventListener('click', () => {
        fullPanel.classList.add('hidden');
        // Move to first step of actual cooking scene
        kitchenScene.classList.add('hidden');
        // e.g., show ingredient collection scene
        document.getElementById('ingredientScene').classList.remove('hidden');
    });

});
