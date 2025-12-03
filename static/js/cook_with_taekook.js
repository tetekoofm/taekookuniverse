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
    function populateIngredientHUD(order) {
        if (!order) return;
    
        const dishNameEl = document.getElementById('ingDishName');
        const collectedEl = document.getElementById('collectedStatus');
    
        dishNameEl.textContent = order.name || "Unknown Dish";
    
        const flatIngredients = (order.ingredients || []).map(ing => ({
            name: ing.name,
            emoji: ing.emoji,
            image: ing.image
        }));
    
        window.currentOrderFlatIngredients = flatIngredients;
    
        collectedEl.innerHTML = "";
    
        flatIngredients.forEach(ing => {
            const wrapper = document.createElement('span');
            wrapper.className = 'hud-ingredient-wrapper';
    
            const img = new Image();
            img.className = 'hud-ingredient';
            img.alt = ing.name;
            img.src = `/static/images/games/cookwithtaekook/${ing.image}`;
    
            // fallback if image fails to load
            img.onerror = () => {
                wrapper.textContent = ing.emoji;
            };
    
            wrapper.appendChild(img);
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
        populateIngredientHUD(order);
    
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
        if (!window.recipes || !window.recipes.length) {
            console.warn("Recipes not loaded yet. Using fallback dish.");
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
    
        // flatten categories if necessary
        let allRecipes = [];
        if (window.recipes.beverages) allRecipes = allRecipes.concat(window.recipes.beverages);
        if (window.recipes.food) allRecipes = allRecipes.concat(window.recipes.food);
    
        if (!allRecipes.length) return null;
    
        // pick a random recipe
        const selected = allRecipes[Math.floor(Math.random() * allRecipes.length)];
    
        // ensure ingredients have emoji and image
        selected.ingredients = selected.ingredients.map(ing => ({
            name: ing.name || "Unknown",
            emoji: ing.emoji || "❔",
            image: ing.image || "placeholder.png"
        }));
    
        return selected;
    };
    

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
            startIngredientsMiniGame(window.currentOrder, window.recipes);
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
    
        const scene = document.getElementById('ingredientScene');
        const canvas = document.getElementById('ingredientGameCanvas');
        const collectedEl = document.getElementById('collectedStatus');
        const startBtn = document.getElementById('startCollectBtn');
        const cancelBtn = document.getElementById('cancelCollectBtn');
        const popup = document.getElementById('ingCompletePopup');
        const popupOk = document.getElementById('ingCompleteOk');
    
        scene.classList.remove('hidden');
        scene.setAttribute('aria-hidden', 'false');
    
        let wrongStreak = 0;
        let correctStreak = 0;
        let totalCollected = 0;
    
        const gameState = {
            running: false,
            rafId: null,
            spawnInterval: null,
            items: [],
            collectedMap: {},
            chef: { x: 0, y: 0, w: 90, h: 90, img: null },
            emojiMultiplier: 0.05
        };
    
        const flatIngredients = (order.ingredients || []).map(ing => ({
            name: ing.name,
            emoji: ing.emoji,
            image: ing.image
        }));
    
        // Initialize collectedMap
        flatIngredients.forEach(ing => {
            gameState.collectedMap[ing.name] = { collected: false, emoji: ing.emoji, image: ing.image };
        });
    
        // --- OBSTACLE POOL ---
        const obstaclePool = new Set();
        allRecipes.forEach(r => {
            if (!r.ingredients) return;
            r.ingredients.forEach(ing => {
                if (!(order.ingredients || []).some(o => o.name === ing.name)) {
                    obstaclePool.add(ing.name);
                }
            });
        });
        if (!obstaclePool.size) {
            ["Socks","Glue","Pebbles","Leaf","OnionPeel","Battery"].forEach(i => obstaclePool.add(i));
        }
        const obstacleArray = Array.from(obstaclePool);
    
        // --- PRELOAD IMAGES ---
        const ingredientImages = {};
        [...flatIngredients, ...obstacleArray.map(name => ({name, image: `${name}.png`}))].forEach(ing => {
            const img = new Image();
            img.src = `/static/images/games/cookwithtaekook/${ing.image}`;
            ingredientImages[ing.name] = img;
        });
    
        const ctx = canvas.getContext('2d', { alpha: true });
    
        // Chef
        const chefImg = new Image();
        chefImg.src = '/static/images/games/cookwithtaekook/tae_ingredients.png';
        chefImg.onload = () => { gameState.chef.img = chefImg; positionChef(); drawInitialFrame(); };
    
        function positionChef() {
            const pw = canvas.clientWidth;
            const ph = canvas.clientHeight;
            const chefMultiplier = window.innerWidth <= 600 ? 0.18 : window.innerWidth <= 1024 ? 0.15 : 0.12;
            const emojiMultiplier = window.innerWidth <= 600 ? 0.07 : window.innerWidth <= 1024 ? 0.05 : 0.03;
    
            gameState.chef.w = pw * chefMultiplier;
            gameState.chef.h = ph * (chefMultiplier * 1.4);
            gameState.chef.x = (pw - gameState.chef.w) / 2;
            gameState.chef.y = ph - gameState.chef.h;
            gameState.emojiMultiplier = emojiMultiplier;
        }
    
        function drawInitialFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (gameState.chef.img) ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
        }
    
        function spawnOnce() {
            const pool = [...flatIngredients.map(i => i.name), ...obstacleArray];
            if (!pool.length) return;
    
            const ingName = pool[Math.floor(Math.random() * pool.length)];
            const ingData = flatIngredients.find(i => i.name === ingName);
    
            gameState.items.push({
                name: ingName,
                img: ingredientImages[ingName] || null,
                emoji: ingData ? ingData.emoji : "⚠️",
                x: Math.random() * (canvas.clientWidth - 40) + 20,
                y: -50,
                speed: 2 + Math.random() * 3,
                size: Math.max(20, Math.floor(canvas.clientWidth * gameState.emojiMultiplier))
            });
        }
    
        function drawLoop() {
            if (!gameState.running) return;
    
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    
            // Draw items
            gameState.items.forEach(it => {
                if (it.img && it.img.complete && it.img.naturalWidth > 0) {
                    ctx.drawImage(it.img, it.x, it.y, it.size, it.size);
                } else {
                    ctx.font = `${it.size}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(it.emoji || "?", it.x + it.size/2, it.y + it.size/2);
                }
            });
    
            // Draw chef
            if (gameState.chef.img) ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
    
            // Update positions and check collisions
            const toRemove = [];
            gameState.items.forEach((it, idx) => {
                it.y += it.speed;
    
                if (it.y + it.size >= gameState.chef.y &&
                    it.x >= gameState.chef.x - it.size/2 &&
                    it.x <= gameState.chef.x + gameState.chef.w + it.size/2) {
    
                    if ((order.ingredients || []).some(o => o.name === it.name)) {
                        gameState.collectedMap[it.name].collected = true;
                        handleCorrectHit();
                    } else {
                        handleObstacleHit();
                    }
                    toRemove.push(idx);
                } else if (it.y > canvas.clientHeight + 60) {
                    toRemove.push(idx);
                }
            });
            for (let i = toRemove.length - 1; i >= 0; i--) gameState.items.splice(toRemove[i], 1);
    
            // Update collected HUD
            collectedEl.innerHTML = flatIngredients
                .map(ing => gameState.collectedMap[ing.name].collected ? ing.emoji : "⬜")
                .join(" ");
    
            // Check if all collected
            if (flatIngredients.every(ing => gameState.collectedMap[ing.name].collected)) return endGameSuccess();
    
            gameState.rafId = requestAnimationFrame(drawLoop);
        }
    
        function endGameSuccess() {
            gameState.running = false;
            if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
            if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
            popup.classList.remove('hidden');
        }
    
        function cleanupAndClose() {
            gameState.running = false;
            if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
            if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
            gameState.items.length = 0;
            popup.classList.add('hidden');
            scene.classList.add('hidden');
            scene.setAttribute('aria-hidden', 'true');
            kitchenScene.classList.remove('hidden');
            resetIngredientHUD();
        }
    
        function startGame() {
            if (gameState.running) return;
            resizeCanvas();
            positionChef();
            gameState.items.length = 0;
            gameState.running = true;
            gameState.spawnInterval = setInterval(spawnOnce, window.innerWidth <= 768 ? 650 : 800);
            drawLoop();
        }
    
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.parentElement.clientWidth * dpr;
            canvas.height = canvas.parentElement.clientHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    
        function handleMove(clientX) {
            const rect = canvas.getBoundingClientRect();
            let x = clientX - rect.left - gameState.chef.w / 2;
            gameState.chef.x = Math.max(0, Math.min(x, rect.width - gameState.chef.w));
        }
    
        canvas.addEventListener('mousemove', e => handleMove(e.clientX));
        canvas.addEventListener('touchmove', e => { if (!e.touches[0]) return; handleMove(e.touches[0].clientX); }, { passive: true });
        window.addEventListener('resize', () => { resizeCanvas(); positionChef(); });
    
        startBtn.onclick = () => {
            startBtn.style.display = "none";
            preloadImages(ingredientImages, () => startGame());
        };
        cancelBtn.onclick = cleanupAndClose;
        popupOk.onclick = cleanupAndClose;
    
        scene._cleanup = cleanupAndClose;
    
        // --- FUN EFFECTS ---
        const badMessages = ["👀 You okay bro?", "🤨 That was not even close", "😤 Patience -1", "🫠 Hyung please focus", "🔥 Kookie gonna explode!!"];
        const goodMessages = ["💜 Good job hyung!!", "✨ Chef Taehyung is proud", "😎 Smooth smooth"];
    
        function playSound(type){
            const sfx = {
                wrong: new Audio("/static/audio/Spooky1.mp3"),
                correct: new Audio("/static/audio/Spooky2.mp3"),
                angry: new Audio("/static/audio/Spooky3.mp3"),
                yay: new Audio("/static/audio/Spooky3.mp3")
            };
            sfx[type]?.play();
        }
    
        function showBubble(type, text){
            const el = document.createElement("div");
            el.className = "bubble-popup " + type;
            el.innerText = text;
            document.body.appendChild(el);
            setTimeout(()=>el.remove(), 2000);
        }
    
        function screenShake(){
            document.body.classList.add("shake");
            setTimeout(()=>document.body.classList.remove("shake"),400);
        }
    
        function spawnFloatingEmoji(symbol){
            const e = document.createElement("div");
            e.className = "float-emoji";
            e.innerText = symbol;
            e.style.left = Math.random()*90 + "%";
            document.body.appendChild(e);
            setTimeout(()=>e.remove(),1500);
        }
    
        function rainHearts(){
            for(let i=0;i<20;i++){
                const h=document.createElement("div");
                h.className="heart-rain";
                h.innerText = Math.random()<0.5?"💜":"💚";
                h.style.left = Math.random()*100 + "%";
                document.body.appendChild(h);
                setTimeout(()=>h.remove(),2000);
            }
        }
    
        function handleCorrectHit(){
            correctStreak++;
            wrongStreak=0;
            totalCollected++;
            playSound("correct");
            spawnFloatingEmoji("💚");
    
            if(correctStreak===3){
                playSound("yay");
                showBubble("good","💚 Tae patted your head");
            }
    
            if(totalCollected%10===0){
                rainHearts();
                showBubble("good","💜 Taekook showering love!!");
            }
        }
    
        function handleObstacleHit(){
            wrongStreak++;
            correctStreak=0;
            playSound("wrong");
            screenShake();
            showBubble("bad", badMessages[Math.min(wrongStreak-1,badMessages.length-1)]);
            if(wrongStreak>=5){
                playSound("angry");
                showBubble("angry","🔥 Kookie MAD MODE 🔥");
                wrongStreak=0;
            }
        }
    }
    
    function resetIngredientHUD() {
        const collectedEl = document.getElementById('collectedStatus');
        if (collectedEl) collectedEl.innerHTML = "";
    }   
    
});
