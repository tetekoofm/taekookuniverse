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
        { id: 'taeBubble', text: "Hellooooooooooo!!! <br><br> We'll show you how to play the game." },
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

    const restaurantChatSteps = [    
        { id: 'taeBubble', text: "Oh! Our first customer is here!" },
        { id: 'kooBubble', text: "Let's see what they want to order." }
        // { id: 'taeBubble', text: "The customer wants to order <br><strong>Kimchi Fried Rice!</strong>" },
        // { id: 'kooBubble', text: "Time to head to the kitchen and start cooking!" }
    ];
    /* -------------------------------------------
       INITIAL VISIBILITY
    -------------------------------------------*/
    landingScene.classList.remove('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    kitchenScene.classList.add('hidden');

    // landingScene.classList.add('hidden');
    // rideScene.classList.add('hidden');
    // restaurantScene.classList.add('hidden');
    // kitchenScene.classList.remove('hidden');
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

            startKitchenInstructions();
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
    
    function startKitchenInstructions() {
        currentStep = 0; // reset
        setTimeout(() => {
            showNextChat();
        }, 1000);
        
    }

    function goToKitchen() {
        document.getElementById('rideScene').classList.add('hidden');
        document.getElementById('kitchenScene').classList.remove('hidden');
    
        // start chat now that kitchen is visible
        startKitchenInstructions();
    }

    // Sequential chat display
    function showNextChat() {
        // Hide all bubbles first
        chatSteps.forEach(step => {
            const bubble = document.getElementById(step.id);
            if (bubble) bubble.style.display = 'none';
        });
    
        // Don't show bubble if full instructions panel is visible
        if (!fullPanel.classList.contains('hidden')) {
            currentStep++;
            if (currentStep < chatSteps.length) {
                setTimeout(showNextChat, 2500);
            }
            return; // exit early
        }
    
        // Show current bubble
        const currentBubble = document.getElementById(chatSteps[currentStep].id);
        const currentText = chatSteps[currentStep].text;
        currentBubble.querySelector('p').innerHTML = currentText;
        currentBubble.style.display = 'block';
    
        // Vibrate effect
        currentBubble.classList.add('vibrate');
        setTimeout(() => currentBubble.classList.remove('vibrate'), 300);
    
        // Move to next step
        currentStep++;
        if (currentStep < chatSteps.length) {
            setTimeout(showNextChat, 2500);
        }
    }
    

    // Show full instructions
    showFullBtn.addEventListener('click', () => {
        fullPanel.classList.remove('hidden');

        chatSteps.forEach(step => {
            const bubble = document.getElementById(step.id);
            if (bubble) bubble.style.display = 'none';
        });
    
        taeText.textContent = '';
        kooText.textContent = '';
        showFullBtn.style.display = 'none';
    });

    // Start Cooking
    startCookingBtn.addEventListener('click', () => {
        fullPanel.classList.add('hidden');  // hide full instructions
        kitchenScene.classList.remove('hidden'); // show kitchen scene
    
        // Play chime
        const chime = new Audio("/static/audio/spooky-chimes.mp3");
        chime.play();
    
        // Start restaurant chat sequence
        startRestaurantChat();
    });

    let restaurantStep = 0;
    
    function startRestaurantChat() {
        restaurantStep = 0;
        showNextRestaurantChat();
    }
    
    function showNextRestaurantChat() {
        // Hide all bubbles first
        restaurantChatSteps.forEach(step => {
            const bubble = document.getElementById(step.id);
            if (bubble) bubble.style.display = 'none';
        });
    
        // Show current bubble
        const currentBubble = document.getElementById(restaurantChatSteps[restaurantStep].id);
        if (!currentBubble) return;
    
        currentBubble.querySelector('p').innerHTML = restaurantChatSteps[restaurantStep].text;
        currentBubble.style.display = 'block';
        currentBubble.classList.add('vibrate');
        setTimeout(() => currentBubble.classList.remove('vibrate'), 300);
    
        restaurantStep++;
        if (restaurantStep < restaurantChatSteps.length) {
            setTimeout(showNextRestaurantChat, 2000); // 2 sec delay between bubbles
        } else {
            // After last bubble, go to order selection
            setTimeout(showOrderOptions, 500);
        }
    }

    function getRandomRecipe() {
        const index = Math.floor(Math.random() * recipes.length);
        return recipes[index];
    }
    
    function showOrderOptions() {
        const order = getRandomRecipe();
    
        restaurantChatSteps.push(
            { id: 'taeBubble', text: `The customer wants to order <br><strong>${order.name}!</strong>` },
            { id: 'kooBubble', text: "Time to head to the kitchen and start cooking!" }
        );
    
        // Show new chat steps
        startRestaurantChat();
        
        // Save order for next steps
        window.currentOrder = order;
    }

    function showOrderOptionsButtons() {
        const optionsContainer = document.getElementById('orderOptions'); // div in HTML
        optionsContainer.innerHTML = `
            <button id="prepareOrderBtn">Prepare Order</button>
            <button id="readRecipeBtn">Read Recipe</button>
        `;
        optionsContainer.style.display = 'flex';
        optionsContainer.style.justifyContent = 'center';
        optionsContainer.style.gap = '20px';
    
        document.getElementById('prepareOrderBtn').addEventListener('click', () => {
            optionsContainer.style.display = 'none';
            startIngredientMiniGame();
        });
    
        document.getElementById('readRecipeBtn').addEventListener('click', () => {
            optionsContainer.style.display = 'none';
            showRecipePanel(window.currentOrder);
        });
    }
    
    function showRecipePanel(order) {
        const recipePanel = document.getElementById('recipePanel');
        recipePanel.innerHTML = `
            <h3>${order.name}</h3>
            <p><strong>Ingredients:</strong> ${order.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> ${order.instructions}</p>
            <button id="startPrepBtn">Prepare Order</button>
        `;
        recipePanel.style.display = 'block';
    
        document.getElementById('startPrepBtn').addEventListener('click', () => {
            recipePanel.style.display = 'none';
            startIngredientMiniGame();
        });
    }
    
    function startIngredientMiniGame() {
        kitchenScene.classList.add('hidden');
        document.getElementById('ingredientScene').classList.remove('hidden');
        // mini-game logic goes here
    }
    
    
});
