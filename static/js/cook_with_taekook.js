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
            startIngredientsMiniGame(window.currentOrder, recipes);
        });       

        // Optional: briefly highlight the buttons (visual cue)
        prepareBtn.classList.add('pulse');
        setTimeout(() => prepareBtn.classList.remove('pulse'), 900);
    }
    
// ===========================
// INGREDIENT COLLECTION GAME
// ===========================

/* -------------------------
   Ingredients Mini-game (Full-screen)
   Usage: startIngredientsMiniGame(order, allRecipes)
   ------------------------- */

function startIngredientsMiniGame(order, allRecipes = []) {
    if (!order) {
      console.warn("startIngredientsMiniGame called without order");
      return;
    }
  
    // show overlay
    const scene = document.getElementById('ingredientScene');
    const canvas = document.getElementById('ingredientGameCanvas');
    const dishNameEl = document.getElementById('ingDishName');
    const emojiListEl = document.getElementById('ingEmojiList');
    const instEl = document.getElementById('ingInstructions');
    const collectedEl = document.getElementById('collectedStatus');
    const startBtn = document.getElementById('startCollectBtn');
    const cancelBtn = document.getElementById('cancelCollectBtn');
    const popup = document.getElementById('ingCompletePopup');
    const popupOk = document.getElementById('ingCompleteOk');
  
    scene.classList.remove('hidden');
    scene.setAttribute('aria-hidden', 'false');
  
    dishNameEl.textContent = order.name || "Dish";

    emojiListEl.textContent = order.ingredientsEmoji?.length 
        ? order.ingredientsEmoji.join(" ") 
        : (order.ingredients || []).join(", ");
    
    instEl.textContent = 
        "Move Tete left or right with your mouse or finger. Catch only the required ingredients.";
    
    instEl.innerHTML = `
        <h2>How the Game Works</h2>
        <ol>
            <li>Move Tete left or right with your mouse or finger.</li>
            <li>Catch only the required ingredients for the current recipe.</li>
            <li>Avoid incorrect ingredients.</li>
            <li>Take the ingredients to back to Koo.</li>
        </ol>
    `;

    collectedEl.textContent = 
        order.ingredientsEmoji ? order.ingredientsEmoji.map(() => "⬜").join(" ") : "";
    
      // if start btn exists, hook
    let cleanupCalled = false;
    let gameState = {
      running: false,
      rafId: null,
      spawnInterval: null,
      items: [],
      collectedMap: {},
      chef: { x: 0, y: 0, w: 90, h: 90, img: null }
    };
  
    // Prepare collectedMap
    (order.ingredientsEmoji || []).forEach(e => gameState.collectedMap[e] = false);
  
    // Build obstacle pool from other recipes (unique)
    const obstaclePool = new Set();
    allRecipes.forEach(r => {
      if (!r.ingredientsEmoji) return;
      r.ingredientsEmoji.forEach(e => {
        if (!order.ingredientsEmoji || !order.ingredientsEmoji.includes(e)) obstaclePool.add(e);
      });
    });
    // If obstacle pool is empty, add some common fallbacks
    if (obstaclePool.size === 0) {
      ["🍫","🥜","🌶","🥩","🧂","🍬"].forEach(x => obstaclePool.add(x));
    }
    const obstacleArray = Array.from(obstaclePool);
  
    // Canvas resizing with devicePixelRatio
    function resizeCanvasNow() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(300, Math.floor(rect.width * dpr));
      canvas.height = Math.max(200, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  
    const ctx = canvas.getContext('2d', { alpha: true });
  
    // Chef image (player)
    const chefImg = new Image();
    chefImg.src = '/static/images/games/cookwithtaekook/tae_ingredients.png';
    chefImg.onload = () => {
      gameState.chef.img = chefImg;
      // position chef at center bottom
      positionChef();
      drawInitialFrame();
    };
  
    function positionChef() {
      const pw = canvas.clientWidth;
      const ph = canvas.clientHeight;
      gameState.chef.w = Math.max(60, Math.floor(pw * 0.12));
      gameState.chef.h = Math.max(60, Math.floor(ph * 0.16));
      gameState.chef.x = Math.floor((pw - gameState.chef.w) / 2);
      gameState.chef.y = Math.floor(ph - gameState.chef.h - 8);
    }
  
    // draw one frame
    function drawInitialFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw chef (if loaded)
      if (gameState.chef.img) {
        ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
      } else {
        // placeholder rectangle
        ctx.fillStyle = '#8affc1';
        ctx.fillRect(gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
      }
    }
  
    // spawn items
    function spawnOnce() {
      const pool = [...(order.ingredientsEmoji || []), ...obstacleArray];
      if (!pool.length) return;
      const emoji = pool[Math.floor(Math.random() * pool.length)];
      const spawnX = Math.random() * (canvas.clientWidth - 48) + 12;
      gameState.items.push({
        emoji,
        x: spawnX,
        y: -40,
        speed: 2 + Math.random() * 3,
        size: Math.max(28, Math.floor(canvas.clientWidth * 0.06))
      });
    }
  
    // draw loop
    function drawLoop() {
      if (!gameState.running) return;
      // clear (logical pixels)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // draw items
      gameState.items.forEach((it) => {
        ctx.font = `${it.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.emoji, it.x, it.y);
      });
  
      // draw chef
      if (gameState.chef.img) {
        ctx.drawImage(gameState.chef.img, gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
      } else {
        ctx.fillStyle = '#8affc1';
        ctx.fillRect(gameState.chef.x, gameState.chef.y, gameState.chef.w, gameState.chef.h);
      }
  
      // update positions
      const toRemove = [];
      gameState.items.forEach((it, idx) => {
        it.y += it.speed;
        // check collision
        if (it.y + it.size >= gameState.chef.y &&
            it.x >= gameState.chef.x - it.size/2 &&
            it.x <= gameState.chef.x + gameState.chef.w + it.size/2) {
          // collision captured
          if (order.ingredientsEmoji && order.ingredientsEmoji.includes(it.emoji)) {
            gameState.collectedMap[it.emoji] = true;
          }
          toRemove.push(idx);
        } else if (it.y > canvas.clientHeight + 60) {
          toRemove.push(idx);
        }
      });
  
      // remove collided or offscreen (splice backwards)
      for (let i = toRemove.length - 1; i >= 0; i--) {
        gameState.items.splice(toRemove[i], 1);
      }
  
      // update collected UI
      collectedEl.textContent = (order.ingredientsEmoji || []).map(e => gameState.collectedMap[e] ? e : '⬜').join(' ');
  
      // check win
      const allCollected = (order.ingredientsEmoji || []).length === 0 ? false :
        (order.ingredientsEmoji || []).every(e => gameState.collectedMap[e]);
  
      if (allCollected) {
        endGameSuccess();
        return;
      }
  
      gameState.rafId = requestAnimationFrame(drawLoop);
    }
  
    function endGameSuccess() {
      if (!gameState.running) return;
      gameState.running = false;
      if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
      if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
      popup.classList.remove('hidden');
    }
  
    function cleanupAndClose() {
      // stop loops
      gameState.running = false;
      if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
      if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
  
      // remove items array
      gameState.items.length = 0;
  
      // hide popup and scene
      popup.classList.add('hidden');
      scene.classList.add('hidden');
      scene.setAttribute('aria-hidden', 'true');
  
      // restore kitchen scene
      document.getElementById('kitchenScene').classList.remove('hidden');
  
      cleanupCalled = true;
    }
  
    // start the active game
    function startGame() {
      if (gameState.running) return;
      resizeCanvasNow();
      positionChef();
      gameState.running = true;
      gameState.items.length = 0;
      // spawn faster on mobile maybe
      const spawnRate = (window.innerWidth <= 768) ? 650 : 800;
      gameState.spawnInterval = setInterval(spawnOnce, spawnRate);
      drawLoop();
    }
  
    // controls: mouse and touch on canvas area
    function handleMove(clientX) {
      const rect = canvas.getBoundingClientRect();
      let x = clientX - rect.left - (gameState.chef.w / 2);
      if (x < 0) x = 0;
      if (x > rect.width - gameState.chef.w) x = rect.width - gameState.chef.w;
      gameState.chef.x = x;
    }
  
    // attach events
    function onMouseMove(e) { handleMove(e.clientX); }
    function onTouchMove(e) { if (!e.touches || !e.touches[0]) return; handleMove(e.touches[0].clientX); }
    function onResize() { resizeCanvasNow(); positionChef(); }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onResize);
  
    // hook buttons
    startBtn.onclick = () => {
        // hide instructions and button only when game actually starts
        const instEl = document.querySelector('.ing-instructions');
        instEl.style.display = "none";
        startBtn.style.display = "none";
    
        startGame();
    };

    cancelBtn.onclick = () => {
      // stop and close (no win)
      if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
      if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
      scene.classList.add('hidden');
      document.getElementById('kitchenScene').classList.remove('hidden');
      cleanupCalled = true;
    };
  
    popupOk.onclick = () => {
        document.getElementById("ingCompletePopup").classList.add("hidden"); // hide popup
        scene.classList.add("hidden");   // hide game panel
        cleanupAndClose();               // cleanup game
    };
      
  
    // initial resize and draw
    setTimeout(() => {
      resizeCanvasNow();
      positionChef();
      drawInitialFrame();
    }, 60);
  
    // cleanup helper (when user navigates away)
    function cleanupAll() {
      if (cleanupCalled) return;
      if (gameState.spawnInterval) clearInterval(gameState.spawnInterval);
      if (gameState.rafId) cancelAnimationFrame(gameState.rafId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      resetIngredientHUD();
    }
  
    // expose a cleanup to the module-level so you can call if needed:
    scene._cleanup = cleanupAll;
}
  
    function resetIngredientHUD() {
        instEl.style.display = "block";
        startBtn.style.display = "block";
    }
    
});
