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

    const cancelReturnChat = [
        { id: 'kooBubble', text: "😔 Aww... you don't want to try my recipe?" },
        { id: 'taeBubble', text: "It's okay! We can cook again whenever you’re ready 💜" }
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

    /*===============================
    CANVAS + GAME STATE
    ===============================*/
    const gameCanvas = document.getElementById("gameCanvas");
    const canvasHolder = document.getElementById("gameCanvasContainer");
    const ctx = gameCanvas.getContext("2d");
    
    const gameState = {
        chef: {},
        items: [],
        running: false,
        rafId: null,
        itemSpawner: null
    };

    /*===============================
    LOAD CHEF IMAGE
    ===============================*/
    const chefImg = new Image();
    chefImg.src = "/static/images/games/cookwithtaekook/tae_ingredients.png";
    chefImg.onload = () => {
        gameState.chef.img = chefImg;
        // draw one frame to show chef immediately
        if (gameState.running) updateGame();
    };
    
    /*===============================
    POSITION CHEF (REQUIRED)
    ===============================*/
    function positionChef() {
        const pw = canvasHolder.clientWidth;
        const ph = canvasHolder.clientHeight;
        const size = window.innerWidth <= 600 ? 0.18 : window.innerWidth <= 1024 ? 0.15 : 0.12;
        gameState.chef.w = Math.max(40, pw * size);
        gameState.chef.h = Math.max(40, ph * size * 1.4);
        gameState.chef.x = (pw - gameState.chef.w) / 2;
        gameState.chef.y = ph - gameState.chef.h;
    }
    
    // ===========================
    // Obstacles)
    // ===========================
    function getRandomObstacle() {
        if (!window.recipes || !window.currentOrder) return "💣";
    
        // flatten all ingredients
        const allIngredients = [
            ...window.recipes.beverages.flatMap(r => r.ingredients),
            ...window.recipes.food.flatMap(r => r.ingredients),
            ...(window.recipes.chefKooSpecial || []).flatMap(r => r.ingredients)
        ];
    
        // exclude current recipe ingredients
        const forbidden = window.currentOrder.ingredients.map(i => i.name);
        const possible = allIngredients.filter(i => !forbidden.includes(i.name));
        if (!possible.length) return "💣";
    
        const choice = possible[Math.floor(Math.random() * possible.length)];
        return choice.emoji || "💣";
    }
    
    // ===========================
    // SPAWN ITEMS (ingredients + obstacles)
    // ===========================
    function spawnItem() {
        const ingredients = window.currentOrder?.ingredients?.map(i => i.emoji).filter(Boolean) || ["🍋","🥛"];
        const isObstacle = Math.random() < 0.3; // 30% chance
        const emojiOrImage = isObstacle ? getRandomObstacle() : window.currentOrder.ingredients[Math.floor(Math.random() * window.currentOrder.ingredients.length)]
        const pool = [...ingredients, ...obstacles];
        const emoji = pool[Math.floor(Math.random() * pool.length)];

        gameState.items.push({
            emoji,
            x: Math.random() * (gameCanvas.width - 40) + 20,
            y: -40,
            size: 30 + Math.random() * 20,
            speed: 2 + Math.random() * 2
        });
    }
    
    // ===========================
    // UPDATE GAME LOOP
    // ===========================
    function updateGame() {
        if (!gameState.running) return;

        ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);

        // draw falling items
        for (let i = gameState.items.length-1; i>=0; i--) {
            const it = gameState.items[i];
            ctx.font = `${it.size}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#FFFFFF";
            it.y += it.speed;

            // during spawn
            const ingredientImage = item.image ? new Image() : null;
            if (ingredientImage) {
                ingredientImage.src = `/static/images/games/cookwithtaekook/${item.image}`;
                item.img = ingredientImage;
            }

            // in updateGame()
            if (it.img && it.img.complete) {
                ctx.drawImage(it.img, it.x - it.size/2, it.y - it.size/2, it.size, it.size);
            } else {
                ctx.fillText(it.emoji, it.x, it.y);
            }

            // remove offscreen
            if (it.y > gameCanvas.height + 50) gameState.items.splice(i,1);

            // collision with chef
            if (it.y + it.size >= gameState.chef.y &&
                it.x >= gameState.chef.x - it.size/2 &&
                it.x <= gameState.chef.x + gameState.chef.w + it.size/2) {
                gameState.items.splice(i,1);
                if (window.currentOrder && window.currentOrder.ingredients) {
                    const collectedElem = document.getElementById("collectedIngredients");
                    const idx = window.currentOrder.ingredients.findIndex(i => i.emoji === it.emoji && !i.collected);
                    if (idx !== -1) {
                        // mark ingredient as collected
                        window.currentOrder.ingredients[idx].collected = true;
                        // update UI
                        const spans = collectedElem.textContent.split(" ");
                        spans[idx] = it.emoji;
                        collectedElem.textContent = spans.join(" ");
                    }
                }
            }
        }

        // draw chef
        if (gameState.chef.img?.complete) {
            ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
        } else {
            ctx.font = `${gameState.chef.h*0.6}px serif`;
            ctx.fillText("👨‍🍳", gameState.chef.x + gameState.chef.w/2, gameState.chef.y + gameState.chef.h/2);
        }

        gameState.rafId = requestAnimationFrame(updateGame);
    }

    /*===============================
    START GAME CANVAS
    ===============================*/
    function startGameCanvas() {
        const rect = canvasHolder.getBoundingClientRect();

        // fallback to defaults if layout not ready
        gameCanvas.width  = rect.width  || 800;
        gameCanvas.height = rect.height || 500;
    
        console.log("Canvas size:", gameCanvas.width, gameCanvas.height);
    
        positionChef();
        gameState.running = true;    
    
        // spawn items repeatedly
        if (gameState.itemSpawner) clearInterval(gameState.itemSpawner);
        gameState.itemSpawner = setInterval(spawnItem, 700);
    
        // mouse / touch to move chef
        canvasHolder.addEventListener("mousemove", gameState._mouseMove = (e)=>{
            const nx = e.clientX - rect.left - gameState.chef.w/2;
            gameState.chef.x = Math.max(0, Math.min(nx, gameCanvas.width - gameState.chef.w));
        });
        canvasHolder.addEventListener("touchmove", gameState._touchMove = (e)=>{
            if (!e.touches[0]) return;
            const nx = e.touches[0].clientX - rect.left - gameState.chef.w/2;
            gameState.chef.x = Math.max(0, Math.min(nx, gameCanvas.width - gameState.chef.w));
        });
    
        updateGame();
    }
    
    // -----------------------
    // RENDER INGREDIENT SCENE
    // -----------------------
    function renderIngredientScene(recipe) {
        kitchenScene.classList.add('hidden');
        ingredientScene.classList.remove('hidden');

        const dishTitle = document.getElementById("dishTitle");
        const ingredientLabel = document.getElementById("ingredientLabel");
        const ingredientList = document.getElementById("ingredientList");

        dishTitle.textContent = recipe.name;
        ingredientLabel.textContent = "Ingredients:"; 
        ingredientList.innerHTML = "";

        // Populate ingredient images
        recipe.ingredients.forEach(item => {
            const img = document.createElement("img");
            img.src = `/static/images/games/cookwithtaekook/${item.image}`;
            img.alt = item.name;
            img.title = item.name;
            img.classList.add("ingredient-img");
            img.onerror = () => {
                img.remove();
                const span = document.createElement("span");
                span.textContent = item.emoji;
                span.classList.add("ingredient-emoji");
                ingredientList.appendChild(span);
            };
            ingredientList.appendChild(img);
        });

        document.getElementById("startCollectIngredientsBtn").onclick = () => {
            ingredientScene.classList.remove("hidden");
            
            setTimeout(() => {
                startGameCanvas();
            }, 50);

            console.log(gameCanvas.width, gameCanvas.height)
            const ingredientInstructions = document.getElementById("ingredientInstructions");
            const ingredientTopBlock = document.getElementById("ingredientTopBlock");
            const gameReadyUI = document.getElementById("gameReadyUI");
            const dishTitle2 = document.getElementById("dishTitle2");
            const neededIngredients = document.getElementById("neededIngredients");
            const collectedIngredients = document.getElementById("collectedIngredients");

            if (ingredientTopBlock) ingredientTopBlock.style.display = "none";
            ingredientInstructions.style.display = "none";

            gameReadyUI.classList.remove("hidden");
            dishTitle2.textContent = window.currentOrder.name;

            neededIngredients.innerHTML = "";
            collectedIngredients.innerHTML = "";
            window.currentOrder.ingredients.forEach(item => {
                neededIngredients.innerHTML += item.emoji + " ";
                collectedIngredients.innerHTML += "⬜ ";
            });

            gameCanvas.style.display = "block";
        };
    }

    function stopAndReturnToKitchen() {
        ingredientScene.classList.add("hidden");
        kitchenScene.classList.remove("hidden");
    
        gameState.running = false;
        clearInterval(gameState.itemSpawner);
        cancelAnimationFrame(gameState.rafId);
        gameState.items = [];
    
        // remove listeners
        if (canvasHolder && gameState._mouseMove) canvasHolder.removeEventListener("mousemove", gameState._mouseMove);
        if (canvasHolder && gameState._touchMove) canvasHolder.removeEventListener("touchmove", gameState._touchMove);
    
        showDynamicRestaurantChat(cancelReturnChat);
    }
    
    // Apply to both cancel buttons
    document.getElementById("cancelDuringGameBtn").onclick = stopAndReturnToKitchen;
    document.getElementById("cancelIngredientBtn").onclick = stopAndReturnToKitchen;

    
});
