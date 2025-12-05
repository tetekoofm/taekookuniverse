document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------
       SCENE REFERENCES
    -------------------------------------------*/
    const landingScene = document.getElementById('landingScene');
    const rideScene = document.getElementById('rideScene');
    const restaurantScene = document.getElementById('restaurantScene');
    const kitchenScene = document.getElementById('kitchenScene');
    const ingredientScene = document.getElementById('ingredientScene');

    const startRideBtn = document.getElementById('startRideBtn');
    const headToKitchenBtn = document.getElementById('headToKitchenBtn');

    const motorbike = document.getElementById('motorbike');
    const sky = document.getElementById('sky');

    const fullPanel = document.getElementById('fullInstructionPanel');
    const showFullBtn = document.getElementById('showFullInstructionsBtn');
    const startCookingBtn = document.getElementById('startCookingBtn');

    const taeText = document.getElementById('taeText');
    const kooText = document.getElementById('kooText');

    /* -------------------------------------------
       CHAT DATA
    -------------------------------------------*/
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
        { id: 'kooBubble', text: "Ready? Let's start cooking and have fun!" },
        { id: 'taeBubble', text: "Click on the 'Show Full Instructions' button." }
    ];

    const restaurantChatSteps = [    
        { id: 'taeBubble', text: "Oh! Our first customer is here!" },
        { id: 'kooBubble', text: "Let's see what they want to order." }
    ];

    /* -------------------------------------------
       INITIAL VISIBILITY
    -------------------------------------------*/
    landingScene.classList.add('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    kitchenScene.classList.remove('hidden');
    ingredientScene.classList.add('hidden');

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
        startRideBtn.disabled = true;

        let pos = -300;

        const interval = setInterval(() => {
            pos += 7;
            motorbike.style.right = pos + 'px';

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
       SEQUENTIAL CHAT (KITCHEN)
    -------------------------------------------*/
    let chatTimeout;
    let currentStep = 0;

    function vibrateBubble(bubble) {
        bubble.classList.add('vibrate');
        setTimeout(() => bubble.classList.remove('vibrate'), 300);
    }

    function startKitchenInstructions() {
        currentStep = 0;
        setTimeout(showNextChat, 1000);
    }

    function showNextChat() {
        chatSteps.forEach(step => {
            const bubble = document.getElementById(step.id);
            if (bubble) bubble.style.display = 'none';
        });

        if (!fullPanel.classList.contains('hidden')) return;

        const currentBubble = document.getElementById(chatSteps[currentStep].id);
        const currentText = chatSteps[currentStep].text;
        currentBubble.querySelector('p').innerHTML = currentText;
        currentBubble.style.display = 'block';
        vibrateBubble(currentBubble);

        currentStep++;
        if (currentStep < chatSteps.length) {
            chatTimeout = setTimeout(showNextChat, 2500);
        }
    }

    showFullBtn.addEventListener('click', () => {
        clearTimeout(chatTimeout);
        fullPanel.classList.remove('hidden');
        chatSteps.forEach(step => {
            const bubble = document.getElementById(step.id);
            if (bubble) bubble.style.display = 'none';
        });
        taeText.textContent = '';
        kooText.textContent = '';
        showFullBtn.style.display = 'none';
    });

    startCookingBtn.addEventListener('click', () => {
        new Audio("/static/audio/bell.mp3").play();
        fullPanel.classList.add('hidden');
        kitchenScene.classList.remove('hidden');
        setTimeout(() => {
            StartRestaurantChat();
        }, 1500);
    });

    /* -------------------------------------------
       DYNAMIC RESTAURANT CHAT
    -------------------------------------------*/
    function showDynamicRestaurantChat(chatArray, callback) {
        let step = 0;

        function showNext() {
            chatArray.forEach(stepObj => {
                const bubble = document.getElementById(stepObj.id);
                if (bubble) bubble.style.display = 'none';
            });

            if (step >= chatArray.length) {
                if (typeof callback === 'function') callback();
                return;
            }

            const stepObj = chatArray[step];
            const currentBubble = document.getElementById(stepObj.id);
            if (!currentBubble) {
                step++;
                setTimeout(showNext, 500);
                return;
            }

            currentBubble.querySelector('p').innerHTML = stepObj.text;
            currentBubble.style.display = 'block';
            currentBubble.classList.add('vibrate');
            setTimeout(() => currentBubble.classList.remove('vibrate'), 300);

            step++;
            setTimeout(showNext, 1800);
        }

        showNext();
    }

    function StartRestaurantChat() {
        fetch('/static/js/recipes.json')
            .then(r => r.json())
            .then(data => {
                window.recipes = data;
                console.log("Recipes loaded:", window.recipes);
    
                // Start restaurant chat
                showDynamicRestaurantChat(restaurantChatSteps, () => {
                    // Instead of showing Prepare button, go directly to ingredient/game scene
                    showOrderOptions(); // pick random recipe
                });
            })
            .catch(err => {
                console.warn("Failed to load recipes.json", err);
                window.recipes = [];
                showDynamicRestaurantChat(restaurantChatSteps, () => {
                    showOrderOptions(); // fallback recipe
                });
            });
    }
    
    /* -------------------------------------------
       ORDER BUTTONS
    -------------------------------------------*/

    async function showOrderOptions() {
        console.log("showOrderOptions() called — picking recipe...");
    
        // pick a recipe from JSON
        const order = window.currentOrder || await loadRandomRecipe(); 
        window.currentOrder = order;
    
        // show dialogue bubbles then go directly to game
        const orderChat = [
            { id: 'taeBubble', text: `The customer wants to order <br><strong>${order.name}!</strong>` },
            { id: 'kooBubble', text: "Tete, can you get the ingredients from the pantry?" },
            { id: 'taeBubble', text: "Yes Kookie!" }
        ];
    
        showDynamicRestaurantChat(orderChat, () => {
            renderIngredientScene(order); // show ingredient scene
            kitchenScene.classList.add('hidden'); // hide kitchen
        });
    }
    
    async function loadRandomRecipe() {
        const res = await fetch("/static/js/recipes.json");
        const data = await res.json();
    
        // Flatten all categories for now
        const allRecipes = [
            ...data.beverages,
            ...(data.foods || []),
            ...(data.desserts || [])
        ];
    
        const recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
        window.currentRecipe = recipe; 
        return recipe;
    }    
    
    function renderIngredientScene(recipe) {
        kitchenScene.classList.add('hidden');       // hide kitchen
        ingredientScene.classList.remove('hidden'); // show ingredient scene
    
        const dishTitle = document.getElementById("dishTitle");
        const ingredientLabel = document.getElementById("ingredientLabel");
        const ingredientList = document.getElementById("ingredientList");
    
        dishTitle.textContent = recipe.name;
        ingredientLabel.textContent = "Ingredients:"; // show label above ingredient list
        ingredientList.innerHTML = "";
    
        recipe.ingredients.forEach(item => {
            const img = document.createElement("img");
            img.src = `/static/images/games/cookwithtaekook/${item.image}`;
            img.alt = item.name;
            img.title = item.name;
            img.classList.add("ingredient-img");
            img.onerror = () => {
                img.remove(); // remove broken image
                const span = document.createElement("span");
                span.textContent = item.emoji;
                span.classList.add("ingredient-emoji");
                ingredientList.appendChild(span);
            };
            ingredientList.appendChild(img);
        });
    
        document.getElementById("startCollectIngredientsBtn").onclick = () => {
            const ingredientInstructions = document.getElementById("ingredientInstructions");
            const ingredientTopBlock = document.getElementById("ingredientTopBlock"); // wrap top part in a div
            const gameReadyUI = document.getElementById("gameReadyUI");
            const dishTitle2 = document.getElementById("dishTitle2");
            const neededIngredients = document.getElementById("neededIngredients");
            const collectedIngredients = document.getElementById("collectedIngredients");
            const canvasHolder = document.getElementById("gameCanvasContainer");
            const gameCanvas = document.getElementById("gameCanvas");
        
            // Hide old top block
            if (ingredientTopBlock) ingredientTopBlock.style.display = "none";
        
            // Hide instructions
            ingredientInstructions.style.display = "none";
        
            // Show game HUD
            gameReadyUI.classList.remove("hidden");
        
            // Show dish name
            dishTitle2.textContent = window.currentOrder.name;
        
            // Populate ingredients (emojis)
            neededIngredients.innerHTML = "";
            collectedIngredients.innerHTML = "";
            window.currentOrder.ingredients.forEach(item => {
                neededIngredients.innerHTML += item.emoji + " ";
                collectedIngredients.innerHTML += "⬜ "; // empty placeholders
            });
        
            // Expand canvas
            canvasHolder.style.height = "400px";
        
            // Show canvas
            gameCanvas.style.display = "block";
        
            console.log("Collect pressed: HUD visible, canvas ready");
        };
                
    
        // Cancel button
        document.getElementById("cancelIngredientBtn").onclick = returnToKitchenSad;
    }   
    
    
    function showGameUI(recipe) {
        document.getElementById("gameReadyUI").classList.remove("hidden");
        document.getElementById("dishTitle2").textContent = recipe.name;
    
        // Populate required + empty collected slots
        const needed = document.getElementById("neededIngredients");
        const collected = document.getElementById("collectedIngredients");
    
        needed.innerHTML = "";
        collected.innerHTML = "";
    
        recipe.ingredients.forEach(item => {
            needed.innerHTML += item.emoji + " ";
            collected.innerHTML += "⬜ "; // temporary placeholder
        });
    
        // Cancel during gameplay (Step 5)
        document.getElementById("cancelDuringGameBtn").onclick = returnToKitchenSad;
    }
    
    function returnToKitchenSad() {
        ingredientScene.classList.add("hidden");
        kitchenScene.classList.remove("hidden");
    
        // Kookie reacts (Step 5 detail)
        kooText.innerHTML = "😔 Sorry you don’t want to try my recipe... but maybe next time you will! 💜";
    }
    
});
