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

        loadRecipesAndStartRestaurantChat();
    });

    /* -------------------------------------------
       LOAD RECIPES & START RESTAURANT DYNAMIC CHAT
    -------------------------------------------*/
    function populateIngredientHUDPreGame(order) {
        if (!order) return;
    
        const dishNameEl = document.getElementById('ingDishName');
        const ingredientsEl = document.getElementById('ingEmojiList'); 
        const collectedEl = document.getElementById('collectedStatus');
    
        dishNameEl.textContent = order.name || "Unknown Dish";
    
        ingredientsEl.innerHTML = "";
        collectedEl.innerHTML = ""; // start empty
    
        // Reset collectedMap
        window.gameState = window.gameState || {};
        gameState.chef = gameState.chef || {};
        gameState.items = gameState.items || [];  // keep for falling items
        gameState.collectedMap = gameState.collectedMap || {};
        gameState.running = false;
    
        (order.ingredients || []).forEach(ing => {
            // Initialize collected map
            window.gameState.collectedMap[ing.name] = { 
                collected: false, 
                emoji: ing.emoji, 
                image: ing.image, 
                name: ing.name 
            };
    
            // HUD display
            const wrapper = document.createElement("div");
            wrapper.className = "hud-ingredient-wrapper";
    
            if (ing.image) {
                const img = new Image();
                img.src = `/static/images/games/cookwithtaekook/${ing.image}`;
                img.alt = ing.name || ing.emoji;
                img.onerror = () => { wrapper.textContent = ing.emoji || "⬜"; };
                wrapper.appendChild(img);
            } else {
                wrapper.textContent = ing.emoji || "⬜";
                wrapper.style.opacity = "0.5";
            }
    
            ingredientsEl.appendChild(wrapper);
        });
    }
    
    
    function updateCollectedHUD() {
        const collectedEl = document.getElementById('collectedStatus');
        if (!collectedEl || !gameState || !gameState.collectedMap) return;
    
        collectedEl.innerHTML = "";
    
        // ONLY display collected ingredients
        Object.values(gameState.collectedMap).forEach(item => {
            if (!item.collected) return; // skip uncollected
    
            const wrapper = document.createElement("div");
            wrapper.className = "hud-ingredient-wrapper";
    
            if (item.image) {
                const img = new Image();
                img.src = `/static/images/games/cookwithtaekook/${item.image}`;
                img.alt = item.name || item.emoji;
                img.style.width = "100%";
                img.style.height = "100%";
                wrapper.appendChild(img);
            } else {
                wrapper.textContent = item.emoji || "⬜";
                wrapper.style.fontSize = "2rem";
                wrapper.style.textAlign = "center";
            }
    
            collectedEl.appendChild(wrapper);
        });
    }
    

    function loadRecipesAndStartRestaurantChat() {
        fetch('/static/js/recipes.json')
            .then(r => r.json())
            .then(data => {
                // your JSON is already an array, just assign it
                window.recipes = data;
                console.log("Recipes loaded:", window.recipes);
    
                // now safe to start chat and order
                showDynamicRestaurantChat(restaurantChatSteps, () => {
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

    /* -------------------------------------------
       ORDER BUTTONS
    -------------------------------------------*/

    function showOrderOptions() {
        console.log("showOrderOptions() called — picking recipe...");
    
        // pick a recipe from JSON, fallback only if not loaded
        const order = getRandomRecipe();
    
        window.currentOrder = order;
    
        // populate HUD (only emojis)
        populateIngredientHUDPreGame(order);
    
        // show dialogue bubbles then show Prepare button
        setTimeout(() => {
            const orderChat = [
                { id: 'taeBubble', text: `The customer wants to order <br><strong>${order.name}!</strong>` },
                { id: 'kooBubble', text: "Tete, can you get the ingredients from the pantry?" },
                { id: 'taeBubble', text: "Yes Kookie!" }
            ];
    
            showDynamicRestaurantChat(orderChat, () => {
                showOrderOptionsButtons();
            });
        }, 350);
    }
    
    window.getRandomRecipe = function() {
        if (!window.recipes) {
            console.warn("Recipes not loaded yet. Using fallback dish.");
            return fallbackRecipe();
        }
    
        let allRecipes = [];
        if (window.recipes.food) allRecipes = allRecipes.concat(window.recipes.food);
        if (window.recipes.beverages) allRecipes = allRecipes.concat(window.recipes.beverages);
        if (window.recipes.chefKooSpecial) allRecipes = allRecipes.concat(window.recipes.chefKooSpecial);
    
        if (!allRecipes.length) return fallbackRecipe();
    
        const selected = allRecipes[Math.floor(Math.random() * allRecipes.length)];
        selected.ingredients = selected.ingredients.map(ing => ({
            name: ing.name || "Unknown",
            emoji: ing.emoji || "❔",
            image: ing.image || null
        }));
        return selected;
    };
    
    function fallbackRecipe() {
        return {
            name: "Kimchi Fried Rice",
            ingredients: [
                { name: "Rice", emoji: "🍚", image: "rice.png" },
                { name: "Kimchi", emoji: "🥬", image: "kimchi.png" },
                { name: "Egg", emoji: "🍳", image: "egg.png" },
                { name: "Sesame Oil", emoji: "🫒", image: "sesame_oil.png" }
            ]
        };
    }

    function showOrderOptionsButtons() {
        const optionsContainer = document.getElementById('orderOptions');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = `<button id="prepareOrderBtn" class="action-btn">Prepare Order</button>`;
        optionsContainer.style.display = 'flex';
        optionsContainer.style.justifyContent = 'center';
        optionsContainer.style.gap = '16px';
        optionsContainer.style.zIndex = '50';

        const prepareBtn = document.getElementById('prepareOrderBtn');
        prepareBtn.addEventListener('click', () => {
            optionsContainer.style.display = 'none';
            const allRecipesFlat = [
                ...(window.recipes.beverages || []),
                ...(window.recipes.food || []),
                ...(window.recipes.chefKooSpecial || [])
            ];
            startIngredientsMiniGame(window.currentOrder, allRecipesFlat);
        });

        prepareBtn.classList.add('pulse');
        setTimeout(() => prepareBtn.classList.remove('pulse'), 900);
    }

    function preloadImages(imgObj, callback) {
        const promises = Object.values(imgObj).map(img => new Promise(res => {
            if (img.complete) res();
            else img.onload = res;
            img.onerror = res; // don't block on missing images
        }));
        Promise.all(promises).then(callback);
    }

    /* -------------------------------------------
       MINI-GAME: INGREDIENT COLLECTION (IMAGE VERSION)
    -------------------------------------------*/
    function startIngredientsMiniGame(order, allRecipes = []) {
        if (!order) return console.warn("No order provided");
    
        // Initialize gameState
        window.gameState = window.gameState || {};
        gameState.items = [];       // falling ingredients/obstacles
        gameState.chef = gameState.chef || {};
        gameState.running = false;
        gameState.collectedMap = gameState.collectedMap || {};
        let totalCollected = 0;
        let correctStreak = 0;
        let wrongStreak = 0;

        // Initialize collected map
        (order.ingredients || []).forEach(ing => {
            const key = ing.name;
            gameState.collectedMap[key] = {
                collected: false,
                emoji: ing.emoji || null,
                image: ing.image || null,
                name: ing.name
            };
        });
    
        // Populate HUD (Ingredients only)
        populateIngredientHUDPreGame(order);
    
        const scene = document.getElementById('ingredientScene');
        const canvas = document.getElementById('ingredientGameCanvas');
        const startBtn = document.getElementById('startCollectBtn');
        const cancelBtn = document.getElementById('cancelCollectBtn');
        const popup = document.getElementById('ingCompletePopup');
        const popupOk = document.getElementById('ingCompleteOk');
    
        scene.classList.remove('hidden');
        scene.setAttribute('aria-hidden', 'false');
    
        // Obstacle pool
        const obstaclePool = new Set();
        allRecipes.forEach(r => {
            (r.ingredientsEmoji || []).forEach(e => {
                if (!(order.ingredientsEmoji || []).includes(e)) obstaclePool.add(e);
            });
        });
        if (obstaclePool.size === 0) ["🍫","🥜","🌶","🥩","🧂","🍬"].forEach(x => obstaclePool.add(x));
        const obstacleArray = Array.from(obstaclePool);
    
        const ctx = canvas.getContext('2d', { alpha: true });
    
        // Chef image
        const chefImg = new Image();
        chefImg.src = '/static/images/games/cookwithtaekook/tae_ingredients.png';
        chefImg.onload = () => { 
            gameState.chef.img = chefImg; 
            drawInitialFrame(); 
        };
    
        function positionChef() {
            if (!gameState.chef) gameState.chef = {};
            const pw = canvas.clientWidth, ph = canvas.clientHeight;
            let chefMultiplier, emojiMultiplier;
            if (window.innerWidth <= 600) { chefMultiplier = 0.18; emojiMultiplier = 0.07; }
            else if (window.innerWidth <= 1024) { chefMultiplier = 0.15; emojiMultiplier = 0.05; }
            else { chefMultiplier = 0.12; emojiMultiplier = 0.03; }
    
            gameState.chef.w = pw * chefMultiplier;
            gameState.chef.h = ph * chefMultiplier * 1.4;
            gameState.chef.x = (pw - gameState.chef.w)/2;
            gameState.chef.y = ph - gameState.chef.h;
            gameState.emojiMultiplier = emojiMultiplier;
        }
    
        function resizeCanvasNow() {
            const container = canvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = container.clientWidth * dpr;
            canvas.height = container.clientHeight * dpr;
            ctx.setTransform(dpr,0,0,dpr,0,0);
            positionChef();
        }
    
        function drawInitialFrame() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (gameState.chef.img) {
                ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
            }
        }
    
        function spawnOnce() {
            const spawnX = Math.random() * (canvas.clientWidth - 40) + 20;
            const baseSize = Math.max(18, Math.floor(canvas.clientWidth * gameState.emojiMultiplier));
        
            const ingredientPool = (window.currentOrder.ingredients || []).map(ing => ({
                key: ing.name,
                emoji: ing.emoji,
                image: ing.image && ing.image.trim() !== "" ? ing.image : null
            }));
        
            const isIngredient = Math.random() < 0.6 && ingredientPool.length > 0;
        
            if (isIngredient) {
                const ing = ingredientPool[Math.floor(Math.random() * ingredientPool.length)];
        
                gameState.items.push({
                    key: ing.key,
                    emoji: ing.image ? null : ing.emoji,  // only show emoji if no image
                    image: ing.image ? ing.image : null,  // make sure image exists
                    x: spawnX,
                    y: -40,
                    speed: 2 + Math.random() * 3,
                    size: baseSize
                });
            } else {
                // Spawn obstacle
                const obs = obstacleArray[Math.floor(Math.random() * obstacleArray.length)];
                gameState.items.push({
                    key: null,
                    emoji: obs,
                    x: spawnX,
                    y: -40,
                    speed: 2 + Math.random() * 3,
                    size: baseSize
                });
            }
        }
        
        function updateCollectedHUD() {
            const collectedEl = document.getElementById('collectedStatus');
            if (!collectedEl || !gameState || !gameState.collectedMap) return;
    
            collectedEl.innerHTML = "";
    
            // Only collected
            Object.values(gameState.collectedMap).forEach(item => {
                if (!item.collected) return;
    
                const wrapper = document.createElement("div");
                wrapper.className = "hud-ingredient-wrapper";
    
                if (item.image) {
                    const img = new Image();
                    img.src = `/static/images/games/cookwithtaekook/${item.image}`;
                    img.alt = item.name || item.emoji;
                    img.style.width = "32px";
                    img.style.height = "32px";
                    img.style.filter = item.collected ? "none" : "grayscale(80%)";
                    img.onerror = () => { wrapper.textContent = item.emoji || "⬜"; };
                    wrapper.appendChild(img);
                } else {
                    wrapper.textContent = item.emoji || "⬜";
                    wrapper.style.opacity = item.collected ? "1" : "0.5";
                }
    
                collectedEl.appendChild(wrapper);
            });
        }
    
        function playSound(type){
            const sfx = {
                wrong: new Audio("/static/audio/Spooky1.mp3"),
                correct: new Audio("/static/audio/Spooky2.mp3"),
                angry: new Audio("/static/audio/Spooky3.mp3"),
                yay: new Audio("/static/audio/Spooky3.mp3")
            };
            sfx[type]?.play();
        }

        function handleCorrectHit(name, item) {
            const data = gameState.collectedMap[name];
            if (!data) return;
        
            if (data.image && !item.image) return;
        
            data.collected = true;
            updateCollectedHUD();
        
            totalCollected++;
            correctStreak++;
            wrongStreak = 0;
        
            playSound("correct");
            // spawnFloatingEmoji("💚"); <-- remove or comment out
        
            if (Object.values(gameState.collectedMap).every(d => d.collected)) endGameSuccess();
        }

    
        function handleObstacleHit() {
            playSound("wrong");
            screenShake();
            showBubble("bad", "❌ That ingredient is not needed!");
        }
    
        function drawLoop() {
            if (!gameState.running) return;
            ctx.clearRect(0,0,canvas.width,canvas.height);
    
            // Draw items
            const toRemove = [];
            gameState.items.forEach((it, idx) => {
                it.y += it.speed;
    
                if (
                    it.y + it.size >= gameState.chef.y &&
                    it.x >= gameState.chef.x - it.size/2 &&
                    it.x <= gameState.chef.x + gameState.chef.w + it.size/2
                ) {
                    if (it.key) handleCorrectHit(it.key, it);
                    else handleObstacleHit();
                    toRemove.push(idx);
                } else if (it.y > canvas.clientHeight + 60) {
                    toRemove.push(idx);
                }
            });
    
            for (let i = toRemove.length - 1; i >= 0; i--) gameState.items.splice(toRemove[i],1);
    
            // Draw items
            gameState.items.forEach(it => {
                if (it.imageObj) {
                    ctx.drawImage(it.imageObj, it.x - it.size/2, it.y - it.size/2, it.size, it.size);
                } else if (it.emoji) {
                    ctx.font = `${it.size}px serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(it.emoji, it.x, it.y);
                }
            });

            // Draw chef
            if (gameState.chef.img) {
                ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
            }
    
            gameState.rafId = requestAnimationFrame(drawLoop);
        }
    
        function endGameSuccess() {
            gameState.running=false;
            if(gameState.spawnInterval) clearInterval(gameState.spawnInterval);
            if(gameState.rafId) cancelAnimationFrame(gameState.rafId);
            popup.classList.remove('hidden');
        }
    
        function cleanupAndClose() {
            gameState.running=false;
            if(gameState.spawnInterval) clearInterval(gameState.spawnInterval);
            if(gameState.rafId) cancelAnimationFrame(gameState.rafId);
            gameState.items.length=0;
            popup.classList.add('hidden');
            scene.classList.add('hidden');
            scene.setAttribute('aria-hidden','true');
            document.getElementById('kitchenScene').classList.remove('hidden');
        }
    
        function startGame() {
            if(gameState.running) return;
            resizeCanvasNow();
            positionChef();
            gameState.running=true;
            gameState.spawnInterval = setInterval(spawnOnce,(window.innerWidth<=768)?650:800);
            drawLoop();
        }
    
        function handleMove(clientX){
            const rect = canvas.getBoundingClientRect();
            let x = clientX - rect.left - gameState.chef.w / 2;
            if (x < 0) x = 0;
            if (x > rect.width - gameState.chef.w) x = rect.width - gameState.chef.w;
            gameState.chef.x = x;
        }
    
        canvas.addEventListener('mousemove', e => handleMove(e.clientX));
        canvas.addEventListener('touchmove', e => handleMove(e.touches[0].clientX), {passive:true});
        window.addEventListener('resize', resizeCanvasNow);
    
        startBtn.onclick = () => {
            startBtn.style.display = "none";
            startGame();
        };
        cancelBtn.onclick = cleanupAndClose;
        popupOk.onclick = cleanupAndClose;
    
        setTimeout(()=>{ resizeCanvasNow(); drawInitialFrame(); },60);
    }
    
});
