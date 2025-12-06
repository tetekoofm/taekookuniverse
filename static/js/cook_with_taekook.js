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
    
    // Dynamic randomized dialogue lines
    const badCatchLines    = ["👀 You okay Hyung?", "🤨 That was not even close", "😤 Patience hyung", "Kookie judging you"];
    const goodCatchLines   = ["💜 Nice catch!!", "✨ Chef Taehyung supremacy", "😎 Smooth smooth", "👌 Hyung cooking king"];
    const almostDoneLines  = ["🔥 You're close!", "💫 Just a few more!!", "📍 Finish line soon"];
    const finalCatchLines  = ["🎉 Last one incoming!", "💜 Hyung almost done!", "⚡ Final ingredient hype!"];

    /* -------------------------------------------
       INITIAL VISIBILITY
    -------------------------------------------*/
    landingScene.classList.remove('hidden');
    rideScene.classList.add('hidden');
    restaurantScene.classList.add('hidden');
    kitchenScene.classList.add('hidden');
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

    // Ingredient cooldown tracker
    const ingredientCooldowns = {};
    const COOLDOWN_MS = 10000; // 10 seconds

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
    
        let chefScale;
        let itemScale; 
        
        if (window.innerWidth <= 768) {       // mobile
            chefScale = 0.18;
            itemScale = 0.2;                  // reduce falling items
        } else if (window.innerWidth <= 1024) { // tablet
            chefScale = 0.15;
            itemScale = 1.5;                  // moderate size
        } else {                               // desktop
            chefScale = 0.12;
            itemScale = 1;
        }
    
        gameState.chef.w = Math.max(40, Math.floor(pw * chefScale));
        gameState.chef.h = Math.max(40, Math.floor(ph * chefScale * 1.4));
        gameState.chef.x = (pw - gameState.chef.w)/2;
        gameState.chef.y = ph - gameState.chef.h;
    
        // Scale falling items
        gameState.items.forEach(it => {
            it.size = Math.floor(it.size * itemScale);
            it.speed = Math.max(1, it.speed * itemScale);
        });
    }
    
    
    // ===========================
    // Obstacles
    // ===========================
    function getRandomObstacle() {
        if (!window.recipes) return { emoji: "💣" }; // fallback obstacle
    
        // Flatten all ingredients excluding current recipe
        const otherIngredients = [
            ...window.recipes.beverages,
            ...(window.recipes.food || []),
            ...(window.recipes.chefKooSpecial || [])
        ].filter(r => r !== window.currentOrder); // exclude current recipe
    
        // Flatten their ingredients
        const pool = [];
        otherIngredients.forEach(recipe => {
            if (recipe.ingredients) pool.push(...recipe.ingredients);
        });
    
        if (pool.length === 0) return { emoji: "💣" }; // fallback
    
        // pick random
        return pool[Math.floor(Math.random() * pool.length)];
    }
        
    // ===========================
    // Game completed - Popup
    // ===========================
    function showCollectedPopup() {
        const popup = document.getElementById("ingredientCollectedPopup");
        if (!popup) return;
        popup.classList.remove("hidden");
    
        // Close button
        const btn = document.getElementById("ingCompleteOk");
        btn.onclick = () => {
            popup.classList.add("hidden");
            stopAndReturnToKitchen(); // optional: go back to kitchen
        };
    }
    // ===========================
    // SPAWN ITEMS (ingredients + obstacles)
    // ===========================
    let lastSpawnedIngredient = null; // track last ingredient to avoid repeats

    const spawnItem = () => {
        if (!window.currentOrder || !window.currentOrder.ingredients) return;
    
        const isObstacle = Math.random() < 0.5; // 30% chance for obstacle
        let chosen;
    
        if (isObstacle) {
            chosen = getRandomObstacle();
        } else {
            // pick a random ingredient not repeating immediately
            const availableIngredients = window.currentOrder.ingredients.filter(
                ing => ing !== lastSpawnedIngredient
            );
    
            // randomly pick from available
            chosen = availableIngredients.length > 0
                ? availableIngredients[Math.floor(Math.random() * availableIngredients.length)]
                : window.currentOrder.ingredients[Math.floor(Math.random() * window.currentOrder.ingredients.length)];
    
            lastSpawnedIngredient = chosen;
        }
    
        const baseSize = 30 + Math.random() * 20;
        let itemScale;
        if (window.innerWidth <= 768) itemScale = 0.5;
        else if (window.innerWidth <= 1024) itemScale = 0.8;
        else itemScale = 1;
    
        const item = {
            emoji: chosen.emoji,
            image: chosen.image || null,
            img: null,
            x: Math.random() * (gameCanvas.width - 40) + 20,
            y: -40,
            size: Math.floor(baseSize * itemScale),
            speed: (2 + Math.random() * 2) * itemScale,
        };
    
        if (item.image) {
            item.img = new Image();
            item.img.src = `/static/images/games/cookwithtaekook/${item.image}`;
        }
    
        gameState.items.push(item);
    };
    
    
    // ===========================
    // UPDATE GAME LOOP
    // ===========================
    function updateGame() {
        if (!gameState.running) return;
    
        ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    
        // Draw chef
        if (gameState.chef.img && gameState.chef.img.complete) {
            ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
        } else {
            ctx.font = `${Math.floor(gameState.chef.h*0.6)}px serif`;
            ctx.textAlign = "center"; 
            ctx.textBaseline = "middle";
            ctx.fillText("👨‍🍳", gameState.chef.x + gameState.chef.w/2, gameState.chef.y + gameState.chef.h/2);
        }
    
        // =============================
        //       FALLING ITEMS
        // =============================
        for (let i = gameState.items.length - 1; i >= 0; i--) {
            const it = gameState.items[i];
            it.y += it.speed;
    
            // center-collision
            const itCenterX = it.x;
            const itCenterY = it.y + it.size/2;
            const chefLeft   = gameState.chef.x;
            const chefRight  = gameState.chef.x + gameState.chef.w;
            const chefTop    = gameState.chef.y;
            const chefBottom = gameState.chef.y + gameState.chef.h;
    
            const collided =
                itCenterX >= chefLeft &&
                itCenterX <= chefRight &&
                itCenterY >= chefTop &&
                itCenterY <= chefBottom;
    
            if (collided) {
                gameState.items.splice(i,1); // remove visual
    
                // check if ingredient belongs to order
                const neededIng = window.currentOrder.ingredients.find(obj => obj.emoji === it.emoji && !obj.collected);
    
                if (neededIng) {
                    // ===== CORRECT CATCH =====
                    neededIng.collected = true;
    
                    // DOM update --> collected UI
                    const collectedElem = document.getElementById("collectedIngredients");
                    const index = window.currentOrder.ingredients.indexOf(neededIng);
                    const holder = collectedElem.children[index];
                    if (holder) {
                        if (it.img && it.img.complete && it.img.naturalWidth > 0) {
                            const img = document.createElement("img");
                            img.src = it.img.src;
                            img.classList.add("ingredient-emoji");
                            holder.replaceWith(img);
                        } else {
                            const span = document.createElement("span");
                            span.textContent = it.emoji;
                            span.classList.add("ingredient-emoji");
                            holder.replaceWith(span);
                        }
                    }
    
                    // ==== DYNAMIC BUBBLE TALKING ====
    
                    const collectedCount = window.currentOrder.ingredients.filter(i=>i.collected).length;
                    const total = window.currentOrder.ingredients.length;
    
                    if (collectedCount === total-1) {
                        console.log("FINAL CATCH:", ing.emoji);
                        showKooMessage(randomLine(finalCatchLines));  // last one hype
                    }
                    else if (collectedCount > total * 0.6) {
                        console.log("ALMOST DONE ITEM:", it.emoji);
                        showKooMessage(randomLine(almostDoneLines)); // 60%+
                    }
                    else {
                        console.log("POSITIVE GENERAL ITEM:", it.emoji);
                        showKooMessage(randomLine(goodCatchLines));  // general positive
                    }
    
                    // check finish
                    if (collectedCount === total) {
                        gameState.running = false;
                        clearInterval(gameState.itemSpawner);
                        showCollectedPopup(); // final popup stays
                    }
                }
                else {
                    // ===== WRONG CATCH / OBSTACLE =====
                    showTaeMessage(randomLine(badCatchLines), true); // vibrate annoyed
                }
    
                continue;
            }
    
            // DRAW falling object
            if (it.img && it.img.complete && it.img.naturalWidth > 0) {
                ctx.drawImage(it.img, it.x, it.y, it.size, it.size);
            } else {
                ctx.font = `${it.size}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(it.emoji, it.x + it.size/2, it.y + it.size/2);
            }
        }
    
        gameState.rafId = requestAnimationFrame(updateGame);
    }
    

    /*===============================
    START GAME CANVAS
    ===============================*/
    function startGameCanvas() {
        const rect = canvasHolder.getBoundingClientRect();
        window.currentOrder.ingredients.forEach(i => i.collected = false);

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
    
        // Populate ingredient images on initial scene
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
    
            setTimeout(() => { startGameCanvas(); }, 50);
    
            const ingredientInstructions = document.getElementById("ingredientInstructions");
            const ingredientTopBlock = document.getElementById("ingredientTopBlock");
            const gameReadyUI = document.getElementById("gameReadyUI");
            const dishTitle2 = document.getElementById("dishTitle2");
            const neededIngredients = document.getElementById("neededIngredients");
            const collectedIngredients = document.getElementById("collectedIngredients");
    
            if (ingredientTopBlock) ingredientTopBlock.style.display = "none";
            if (ingredientInstructions) ingredientInstructions.style.display = "none";
    
            gameReadyUI.classList.remove("hidden");
            dishTitle2.textContent = window.currentOrder.name;
    
            neededIngredients.innerHTML = "";
            collectedIngredients.innerHTML = "";
    
            // Determine sizes based on device
            let imgSize;
            if (window.innerWidth <= 600) imgSize = 24;        // mobile
            else if (window.innerWidth <= 1024) imgSize = 36;  // tablet
            else imgSize = 48;                                  // desktop
    
            window.currentOrder.ingredients.forEach(item => {
                // --- Needed Ingredients HUD ---
                if (item.image) {
                    const img = document.createElement("img");
                    img.src = `/static/images/games/cookwithtaekook/${item.image}`;
                    img.classList.add("ingredient-emoji"); // use the unified class
                    img.onerror = () => { 
                        const span = document.createElement("span");
                        span.textContent = item.emoji;
                        span.classList.add("ingredient-emoji");
                        neededIngredients.appendChild(span);
                        img.remove();
                    };
                    neededIngredients.appendChild(img);
                } else {
                    const span = document.createElement("span");
                    span.textContent = item.emoji;
                    span.classList.add("ingredient-emoji"); // same class
                    neededIngredients.appendChild(span);
                }
    
                // --- Collected Ingredients HUD ---
                const placeholder = document.createElement("span");
                placeholder.textContent = "⬜";
                placeholder.dataset.index = item.name; // optional identifier
                placeholder.style.fontSize = imgSize + "px";
                collectedIngredients.appendChild(placeholder);
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

    function randomLine(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

    // FADES IN & OUT — OPTIONAL CUSTOMIZABLE
    function showBubble(type, message) {
        const bubble = type === "good" ? document.getElementById("taeBubble") 
                                       : document.getElementById("kooBubble");
    
        bubble.querySelector("p").innerText = message;
        bubble.classList.add("show");
    
        setTimeout(()=> bubble.classList.remove("show"), 1800);
    }

    function showKooMessage(msg){ 
        console.log("BUBBLE: GOOD →", msg);
        showBubble(document.getElementById("kooBubble"), msg); 
    }
    function showTaeMessage(msg, vibrate=false){ 
        console.log("BUBBLE: BAD →", msg);
        showBubble(document.getElementById("taeBubble"), msg, vibrate); 
    }


});
