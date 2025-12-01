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
    ];

    /* -------------------------------------------
       INITIAL VISIBILITY
    -------------------------------------------*/
    landingScene.classList.remove('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    kitchenScene.classList.add('hidden');

  //  landingScene.classList.add('hidden');
   // rideScene.classList.add('hidden');
   // restaurantScene.classList.add('hidden');
  //  kitchenScene.classList.remove('hidden');

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
            pos += 7;
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
       RECIPE PREPARATION
    -------------------------------------------*/
    let chatTimeout; 
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
    
        // Stop if full instructions panel is visible
        if (!fullPanel.classList.contains('hidden')) return;
    
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
            chatTimeout = setTimeout(showNextChat, 2500); // store timeout ID
        }
    }

    // Show full instructions
    showFullBtn.addEventListener('click', () => {
        clearTimeout(chatTimeout); // cancel pending bubble
    
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
        const chime = new Audio("/static/audio/bell.mp3");
        chime.play();
        fullPanel.classList.add('hidden');  // hide full instructions
        kitchenScene.classList.remove('hidden'); // show kitchen scene
    
        // Start restaurant chat sequence
        startRestaurantChat();
    });


    let restaurantStep = 0;
    
    function startRestaurantChat() {
        restaurantStep = 0;
        setTimeout(() => {
            showNextRestaurantChat();
        }, 3000); // wait 2 seconds before starting
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

    let recipes = [];

    fetch('/static/js/recipes.json')
        .then(res => res.json())
        .then(data => {
            recipes = [
                ...data.beverages,
                ...data.food,
                ...data.chefKooSpecial
            ];
        });
        
    function getRandomRecipe() {
        if (!recipes.length) {
            console.warn("Recipes not loaded yet!");
            return { name: "Mystery Dish", ingredients: [], instructions: "Please wait..." };
        }
        const index = Math.floor(Math.random() * recipes.length);
        return recipes[index];
    }
    
    // ------------------------
    // ORDER / RESTAURANT FLOW
    // ------------------------

    function showOrderOptions() {
        console.log("showOrderOptions() called — picking recipe...");
        // Ensure we have a recipe; fallback if not loaded
        let order = getRandomRecipe();
        if (!order || !order.name) {
            console.warn("No recipes loaded yet — using fallback dish.");
            order = { name: "Mystery Dish", ingredients: ["Ingredient A", "Ingredient B"], instructions: "Please wait..." };
        }
        window.currentOrder = order;

        // small delay so the bell/last bubble feels complete (adjust timing if needed)
        setTimeout(() => {
            const orderChat = [
                { id: 'taeBubble', text: `The customer wants to order <br><strong>${order.name}!</strong>` },
                { id: 'kooBubble', text: "Tete, can you get the ingredients from the pantry?" },
                { id: 'taeBubble', text: "Yes Kookie!" }
            ];

            console.log("Starting dynamic restaurant chat for order:", order.name);
            showDynamicRestaurantChat(orderChat, () => {
                console.log("Order chat finished — showing order option buttons");
                showOrderOptionsButtons();
            });
        }, 350); // small breathing room
    }

    function showDynamicRestaurantChat(chatArray, callback) {
        console.log("showDynamicRestaurantChat() start", chatArray);
        let step = 0;

        function showNext() {
            // hide all bubbles first (safety)
            chatArray.forEach(stepObj => {
                const bubble = document.getElementById(stepObj.id);
                if (bubble) bubble.style.display = 'none';
            });

            if (step >= chatArray.length) {
                console.log("dynamic chat complete");
                if (typeof callback === 'function') callback();
                return;
            }

            const stepObj = chatArray[step];
            const currentBubble = document.getElementById(stepObj.id);
            if (!currentBubble) {
                console.warn("Bubble element not found for id:", stepObj.id);
                step++;
                setTimeout(showNext, 500);
                return;
            }

            currentBubble.querySelector('p').innerHTML = stepObj.text;
            currentBubble.style.display = 'block';
            currentBubble.classList.add('vibrate');
            setTimeout(() => currentBubble.classList.remove('vibrate'), 300);

            step++;
            setTimeout(showNext, 1800); // show next bubble after 1.8s
        }

        showNext();
    }

    function showOrderOptionsButtons() {
        console.log("showOrderOptionsButtons() called");
        const optionsContainer = document.getElementById('orderOptions');

        // If container missing: log and fallback to directly starting mini-game
        if (!optionsContainer) {
            console.error("#orderOptions container not found. Falling back to startIngredientMiniGame().");
            // Safety: small delay so the player sees the last bubble briefly
            setTimeout(() => startIngredientMiniGame(), 400);
            return;
        }

        // Build buttons
        optionsContainer.innerHTML = `
            <button id="prepareOrderBtn" class="action-btn">Prepare Order</button>
        `;
        optionsContainer.style.display = 'flex';
        optionsContainer.style.justifyContent = 'center';
        optionsContainer.style.gap = '16px';
        optionsContainer.style.zIndex = '50'; // ensure visible above background

        // Hook listeners
        const prepareBtn = document.getElementById('prepareOrderBtn');

        prepareBtn?.addEventListener('click', () => {
            console.log("Prepare Order clicked");
            optionsContainer.style.display = 'none';
            
            // Use the new ingredients mini-game
            startIngredientsMiniGame(window.currentOrder);
        });       

        // Optional: briefly highlight the buttons (visual cue)
        prepareBtn.classList.add('pulse');
        setTimeout(() => prepareBtn.classList.remove('pulse'), 900);
    }
    
    function startIngredientsMiniGame(order, allRecipes) {
        kitchenScene.classList.add('hidden');
        const miniGameContainer = document.getElementById('ingredientScene');
    
        // Center the container
        miniGameContainer.innerHTML = `
            <div id="ingredientHUD" style="text-align:center; color:white; margin-bottom:10px;">
                <h2>${order.name}</h2>
                <p><strong>Ingredients:</strong> ${order.ingredientsEmoji.join(" ")}</p>
                <p><strong>Game:</strong> Catch all required ingredients. Avoid others!</p>
                <div id="collectedStatus">Collected: ${order.ingredientsEmoji.map(() => "⬜").join(" ")}</div>
            </div>
            <canvas id="ingredientGameCanvas"></canvas>
        `;
    
        // Style container
        miniGameContainer.style.display = 'flex';
        miniGameContainer.style.flexDirection = 'column';
        miniGameContainer.style.alignItems = 'center';
        miniGameContainer.style.justifyContent = 'center';
        miniGameContainer.style.background = '#222';
        miniGameContainer.style.position = 'relative';
        miniGameContainer.classList.remove('hidden');
    
        runIngredientsGame(order, allRecipes);
    }
    
    function runIngredientsGame(order, allRecipes) {
        const canvas = document.getElementById('ingredientGameCanvas');
        const ctx = canvas.getContext('2d');
        const miniGameContainer = document.getElementById('ingredientScene');

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    
        const playerImg = new Image();
        playerImg.src = '/static/images/games/cookwithtaekook/tae_ingredients.png';
        const player = { x: canvas.width / 2, y: canvas.height - 80, width: 80, height: 80 };
    
        const ingredients = [];
        const collected = {};
        order.ingredientsEmoji.forEach(e => collected[e] = false);
    
        // Build obstacle pool
        const obstaclePool = [];
        if (allRecipes) {
            allRecipes.forEach(r => {
                r.ingredientsEmoji.forEach(e => {
                    if (!order.ingredientsEmoji.includes(e)) obstaclePool.push(e);
                });
            });
        }
    
        // Mouse movement
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left; // mouse relative to canvas
            // Clamp to canvas boundaries
            if (mouseX < 0) mouseX = 0;
            if (mouseX > canvas.width) mouseX = canvas.width;
            player.x = Math.max(0, Math.min(mouseX, canvas.width - player.width));
        });
        
    
        function spawnIngredient() {
            const pool = [...order.ingredientsEmoji, ...obstaclePool];
            if (!pool.length) return;
            const emoji = pool[Math.floor(Math.random() * pool.length)];
            ingredients.push({
                emoji,
                x: Math.random() * (canvas.width - 40),
                y: -40,
                speed: 2 + Math.random() * 3
            });
        }
    
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw player
            ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    
            // Draw ingredients
            ingredients.forEach((ing, i) => {
                ctx.font = "40px serif";
                ctx.fillText(ing.emoji, ing.x, ing.y);
                ing.y += ing.speed;
    
                // Collision
                if (
                    ing.y + 30 >= player.y &&
                    ing.y <= player.y + player.height &&
                    ing.x + 30 >= player.x &&
                    ing.x <= player.x + player.width
                ) {
                    if (order.ingredientsEmoji.includes(ing.emoji)) collected[ing.emoji] = true;
                    ingredients.splice(i, 1);
                    updateCollectedStatus();
                }
    
                // Remove if below canvas
                if (ing.y > canvas.height + 40) ingredients.splice(i, 1);
            });
    
            requestAnimationFrame(draw);
        }
    
        let gameFinished = false;

        function updateCollectedStatus() {
            const statusDiv = document.getElementById('collectedStatus');
            statusDiv.textContent = "Collected: " + order.ingredientsEmoji.map(e => collected[e] ? e : "⬜").join(" ");
        
            if (!gameFinished && Object.values(collected).every(v => v)) {
                gameFinished = true;  // prevent further alerts
                alert("All ingredients collected! Returning to kitchen.");
                document.getElementById('ingredientScene').classList.add('hidden');
                kitchenScene.classList.remove('hidden');
            }
        }
    
        setInterval(spawnIngredient, 800);
        playerImg.onload = draw; // start drawing after image loaded
    }
    
    
});
