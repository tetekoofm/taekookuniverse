document.addEventListener("DOMContentLoaded",()=>{

    /* -------------------------------------------
       TEST MODE
    -------------------------------------------*/
    const TEST_MODE=false; // change to true for direct scene testing
    const TEST_SCENE="restaurant"; // landing, ride, restaurant, kitchen, ingredient, cooking, delivery, receipt
    const TEST_RECIPE=
    "Strawberry Milkshake";
    // "Banana Milkshake";
    // "Hot Chocolate";
    // "Chocolate Milk"
    // "Milk Tea"
    // "Coffee";
    // "Lemonade";
    // "Scrambled Eggs"
    // "Mashed Potatoes"
    // "Blueberry Pancakes"
    // "Strawberry Pancakes"
    // "French Toast"
    // "Salad"
    // "Grilled Cheese Sandwich";
    // "Spaghetti"
    // "Kimchi Fried Rice"
    // "Tteokbokki"
    // "Fruit Salad";
    // "Uni Cream Shrimp Pasta";
    // "Bulguri Ramen"
    // "BulMayo Perilla Oil Makguksu"
    // "Scrambled Egg Toast with Jam"

    /* -------------------------------------------
       SCENE REFERENCES
    -------------------------------------------*/
    const landingScene=document.getElementById("landingScene");
    const rideScene=document.getElementById("rideScene");
    const sky=document.getElementById("sky");
    const startRideBtn=document.getElementById("startRideBtn");
    const restaurantScene=document.getElementById("restaurantScene");
    const headToKitchenBtn=document.getElementById("headToKitchenBtn");
    const motorbike=document.getElementById("motorbike");
    const kitchenScene=document.getElementById("kitchenScene");
    const ingredientScene=document.getElementById("ingredientScene");
    const instructionPanel=document.getElementById("instructionPanel");
    const fullPanel=document.getElementById("fullInstructionPanel");
    const showFullBtn=document.getElementById("showFullInstructionsBtn");
    const startCookingBtn=document.getElementById("startCookingBtn");
    const cookingScene=document.getElementById("cookingScene");
    const deliveryScene=document.getElementById("deliveryScene");
    const eatingOverlay=document.getElementById("eatingOverlay");
    const receiptScene=document.getElementById("receiptScene");
    const paymentScene=document.getElementById("paymentScene");
    const taeText=document.getElementById("taeText");
    const kooText=document.getElementById("kooText");

    /* -------------------------------------------
       CHAT DATA
    -------------------------------------------*/
    const chatSteps=[
        {id:"taeBubble",text:"Hellooooooooooo!!! <br><br> Welcome, We'll show you how to play the game."},
        {id:"kooBubble",text:"Follow our steps and enjoy cooking with us!"},
        {id:"taeBubble",text:"First, a customer will arrive at your restaurant."},
        {id:"kooBubble",text:"They will choose a dish from the menu."},
        {id:"taeBubble",text:"You can check the recipe or skip directly to preparation."},
        {id:"kooBubble",text:"Next, collect the ingredients in our mini-game."},
        {id:"taeBubble",text:"After that, help cook the dish with us."},
        {id:"kooBubble",text:"Once done, deliver the order to the customer."},
        {id:"taeBubble",text:"Then, a new customer arrives or you can choose to exit."},
        {id:"kooBubble",text:"Ready? Let's start cooking and have fun!"},
        {id:"taeBubble",text:"Click on the 'Show Full Instructions' button."}
    ];

    const restaurantChatSteps=[
        {id:"taeBubble",text:"Oh! A customer is here!"},
        {id:"kooBubble",text:"Let's see what they want to order."}
    ];

    const cancelReturnChat=[
        {id:"kooBubble",text:"😔 Aww... you don't want to try my recipe?"},
        {id:"taeBubble",text:"It's okay! We can cook again whenever you’re ready 💜"}
    ];

    const badCatchLines=[
        "😵 Aish!! Why is it always me?",
        "🥲 I swear that obstacle moved.",
        "😤 Yah, I'm trying okay??",
        "🤕 My pride is bruised more than the obstacle.",
        "🥺 I did NOT deserve that… universe why??"
    ];

    const goodCatchLines=[
        "💜 Nice catch Hyung!!",
        "✨ Chef Tete supremacy!!!",
        "😎 Hyung smooth like butter",
        "👌 King Tete mode activated!"
    ];

    const almostDoneLines=[
        "🔥 You're close Hyung!",
        "💫 Just a little more — fighting!!",
        "📍 You can do it Hyung!"
    ];

    const finalCatchLines=[
        "🎉 Last one Hyung!! Go go go!",
        "💜 Hyung will finish strong!",
        "⚡ We’re almost there — don't stop!"
    ];

    const taeReminderMessages=[
        "😤 Add all the ingredients for this step first!",
        "🍳 We're not done yet! Add all the ingredients first!",
        "😊 Don't forget the ingredients!",
        "💚 Let's finish this step before cooking!",
        "✨ Almost there! Just add everything first.",
        "👀 Check the ingredient list again!",
        "🥣 Every ingredient matter!",
        "😄 Take your time! Add them all first.",
        "🌟 Let's get everything first!",
        "💜 You're missing the ingredients!",
        "🍲 Don't rush—we need everything for this step!",
        "🤏 Just a little more before we cook!"
    ];

    const taeEncouragementMessages=[
        "✨ Keep going, Kookie!",
        "💚 You're doing amazing!",
        "🌟 Looking good so far!",
        "👏 Great job, Kookie!",
        "💜 You're a natural chef!",
        "😄 We're almost there!",
        "✨ That looks delicious already!",
        "🔥 You're on fire today!",
        "💪 You've got this!",
        "🌈 I believe in you, Kookie!",
        "🍀 Keep it up!",
        "😍 It's coming together beautifully!",
        "🎉 Excellent work!",
        "💚 Just a little more!",
        "⭐ You're making this look easy!",
        "🥰 You're the best cooking partner!",
        "🥰 What would I do without you!"
    ];
    
    const servingMessages=[
        "Here is your order! 😊",
        "Your meal is ready! 🍽️",
        "Enjoy your delicious meal! 💜",
        "Fresh from the kitchen! ✨",
        "Hope you enjoy it! 😄",
        "Bon appétit! 🍴",
        "Thanks for waiting! 😊",
        "Your food is served! 🍜",
        "One special order, coming right up! 🌟",
        "Everything's fresh and ready! 😋",
        "Hope it's exactly what you wanted! 💕",
        "Enjoy every bite! 🤤",
        "Please enjoy your meal! 🍲"
    ];

    const customerFoodCompliments=[
        "Wow! This looks delicious! 😍",
        "I can't wait to dig in! 🍽️",
        "It looks absolutely perfect! ✨",
        "Chef, this looks incredible! 👏",
        "This is so beautifully plated! 💜",
        "I'm already getting hungry seeing this! 😋",
        "This is exactly what I was craving! 💚",
        "It looks even better than the picture! 📸",
        "This is going to be so good! 🤩",
        "My mouth is watering already! 🤤",
        "This looks fantastic! Thank you! 😊",
        "I don't even want to ruin how pretty it looks! 😍",
        "My taste buds are ready! 🤤",
        "I love how beautiful this looks! 😍"
    ];

    const customerMessages=[
        "Wow! That was absolutely delicious! 😍",
        "This is the best meal I've had in a long time! ✨",
        "Chef, your cooking is amazing! Thank you! 💜",
        "Everything was perfect. I'll definitely come back! 😊",
        "The flavors were incredible! I loved it! 🍽️",
        "Please tell the chef this was delicious! 💜",
        "Please save my seat for my next visit! 😆",
        "Bun & Bear Cafe is my new favorite place! 💚",
        "That was worth every penny! Thank you!",
        "This cafe is my new favorite place! 🥰",
        "The presentation was beautiful! ✨",
        "I am leaving with a happy heart! 💚",
        "Wow! This was amazing! 😍",
        "The flavor was perfect! I loved it! 🤤",
        "Best meal I've had in a long time! ⭐",
        "I will definitely come back again! 😊",
        "That was absolutely wonderful! Thank you!"
    ];

    /* -------------------------------------------
       INITIAL STATE
    -------------------------------------------*/
    landingScene.classList.remove("hidden");
    rideScene.classList.add("hidden");
    restaurantScene.classList.add("hidden");
    kitchenScene.classList.add("hidden");
    ingredientScene.classList.add("hidden");
    cookingScene.classList.add("hidden");
    deliveryScene.classList.add("hidden");
    receiptScene.classList.add("hidden");

    let currentStep=0;
    let chatTimeout;
    let defaultRecipeImage=1;

    /* -------------------------------------------
       STARS
    -------------------------------------------*/
    if(sky){
        for(let i=0;i<100;i++){
            const star=document.createElement("div");
            star.className="star";
            star.style.top=Math.random()*80+"%";
            star.style.left=Math.random()*100+"%";
            star.style.width=(Math.random()*2+1)+"px";
            star.style.height=star.style.width;
            sky.appendChild(star);
        }
    }

    /* -------------------------------------------
    TEST MODE LOADER
    -------------------------------------------*/
    async function startTestMode(){
        if(!TEST_MODE) return;
        const res=await fetch("/static/js/recipes.json");
        const data=await res.json();
        window.recipes=data;
        const allRecipes=[
            ...(data.beverages||[]),
            ...(data.food||[]),
            ...(data.foods||[]),
            ...(data.desserts||[]),
            ...(data.chefKooSpecial||[])
        ];
        const recipe=allRecipes.find(r=>r.name===TEST_RECIPE);
        if(!recipe){
            console.warn("Test recipe not found:",TEST_RECIPE);
            return;
        }
        window.currentOrder=recipe;
        window.currentRecipe=recipe;
        landingScene.classList.add("hidden");
        rideScene.classList.add("hidden");
        restaurantScene.classList.add("hidden");
        kitchenScene.classList.add("hidden");
        ingredientScene.classList.add("hidden");
        cookingScene.classList.add("hidden");
        deliveryScene.classList.add("hidden");
        eatingOverlay.classList.add("hidden");
        receiptScene.classList.add("hidden");
        paymentScene.classList.add("hidden");
        if(TEST_SCENE==="landing"){
            landingScene.classList.remove("hidden");
        }
        if(TEST_SCENE==="ride"){
            rideScene.classList.remove("hidden");
        }
        if(TEST_SCENE==="restaurant"){
            restaurantScene.classList.remove("hidden");
        }
        if(TEST_SCENE==="kitchen"){
            kitchenScene.classList.remove("hidden");
            startKitchenScene();
        }
        if(TEST_SCENE==="ingredient"){
            startIngredientScene(recipe);
        }
        if(TEST_SCENE==="cooking"){
            window.currentOrder=recipe;
            window.currentRecipe=recipe;
            window.added=[];
            window.stepAdded=[];
            window.cookingStep=0;
            startCookingScene(recipe);
            // window.cookingStep=2;
            document.getElementById("stepIngredients").classList.remove("hidden");
            loadStepIngredients();
        }
        if(TEST_SCENE==="delivery"){
            deliveryScene.classList.remove("hidden");
            startDeliveryScene(window.currentRecipe);
        }
        if(TEST_SCENE==="receipt"){
            window.deliveryChef="koo";
            receiptScene.classList.remove("hidden");
            startReceiptScene();
        }
        if(TEST_SCENE==="payment"){
            paymentScene.classList.remove("hidden");
            startPaymentScene();
        }
    }
    startTestMode();

    /* -------------------------------------------
    CHAT HELPERS
    -------------------------------------------*/
    function randomLine(arr){
        return arr[Math.floor(Math.random()*arr.length)];
    }

    function setChatMode(mode){
        const layer=document.getElementById("chatLayer");
        layer.className="";
        layer.id="chatLayer";
        layer.classList.add(mode+"-mode");
        console.log("Chat mode:", layer.className);
    }

    function showBubble(bubble,msg,duration=1000){
        if(!bubble) return;
        const text=bubble.querySelector("p");
        if(!text) return;
        text.innerHTML=msg;
        bubble.style.display="block";
        bubble.style.opacity="1";
        setTimeout(()=>{
            bubble.style.display="none";
        },duration);
    }

    function showKooMessage(msg, duration){
        console.log("KOO:",msg);
        console.log(document.getElementById("chatLayer").className);
        showBubble(document.getElementById("kooBubble"),msg, duration);
    }
    
    function showTaeMessage(msg, duration){
        console.log("TAE:",msg);
        console.log(document.getElementById("chatLayer").className);
        showBubble(document.getElementById("taeBubble"), msg, duration);
    }

    function showCustomerMessage(msg, duration){
        console.log("CUSTOMER:",msg);
        showBubble(document.getElementById("customerBubble"),msg, duration);
    }

    function showDynamicChat(chatArray,callback){
        let step=0;
        let currentBubble=null;
        function showNext(){
            if(currentBubble){
                currentBubble.style.display="none";
                currentBubble.style.opacity="0";
            }
    
            if(step>=chatArray.length){
                if(typeof callback==="function"){
                    callback();
                }
                return;
            }
            const data=chatArray[step];
            const bubble=document.getElementById(data.id);
            if(bubble){
                const text=bubble.querySelector("p");
                showBubble(bubble, data.text, 2500);
                currentBubble=bubble;
                setTimeout(()=>{
                    step++;
                    showNext();
                },2500);
            }else{
                step++;
                showNext();
            }
        }    
        showNext();
    }

    function resetIngredientScene(){

        // Stop old canvas game
        gameState.running=false;
        cancelAnimationFrame(gameState.rafId);
        clearInterval(gameState.itemSpawner);
    
        // Clear canvas
        ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
    
        // Clear old falling items
        gameState.items=[];
    
        // Reset ingredient UI
        document.getElementById("ingredientTopBlock").style.display="block";
        document.getElementById("ingredientInstructions").style.display="block";
    
        document.getElementById("gameReadyUI").classList.add("hidden");
    
        document.getElementById("neededIngredients").innerHTML="";
        document.getElementById("collectedIngredients").innerHTML="";
    
        document.getElementById("startCollectIngredientsBtn").style.display="block";
    
        // Hide old chat bubbles
        document.querySelectorAll(".chat-bubble").forEach(b=>{
            b.style.display="none";
        });
    
        lastSpawnedIngredient=null;
    }

    /* -------------------------------------------
       RIDE SEQUENCE
    -------------------------------------------*/
    if(startRideBtn){
        startRideBtn.addEventListener("click",()=>{
            landingScene.classList.add("hidden");
            rideScene.classList.remove("hidden");
            startRideBtn.disabled=true;
            const bikeAudio=new Audio("/static/audio/harleydavidson.mp3");
            bikeAudio.loop=true;
            bikeAudio.volume=0.8;
            bikeAudio.play();
            let pos=-300;
            const interval=setInterval(()=>{
                pos+=7;
                motorbike.style.right=pos+"px";
                if(pos>window.innerWidth){
                    clearInterval(interval);
                    bikeAudio.pause();
                    bikeAudio.currentTime=0;
                    rideScene.classList.add("hidden");
                    restaurantScene.classList.remove("hidden");
                }
            },30);
        });
    }

    /* -------------------------------------------
       RESTAURANT → KITCHEN
    -------------------------------------------*/
    if(headToKitchenBtn){
        headToKitchenBtn.addEventListener("click",()=>{
            restaurantScene.classList.add("hidden");
            kitchenScene.classList.remove("hidden");
            startKitchenScene();
        });
    }

    /* -------------------------------------------
       KITCHEN SCENE
    -------------------------------------------*/
    function startKitchenScene(){
        setChatMode("kitchen");
        currentStep=0;
        setTimeout(customerArrival,1000);
    }

    function customerArrival(){
        chatSteps.forEach(step=>{
            const bubble=document.getElementById(step.id);
            if(bubble){
                bubble.style.display="none";
            }
        });
        if(!fullPanel.classList.contains("hidden")) return;
        if(currentStep>=chatSteps.length) return;
        const step=chatSteps[currentStep];
        const bubble=document.getElementById(step.id);
        if(bubble){
            showBubble(bubble, step.text, 2500);
        }
        currentStep++;
        if(currentStep<chatSteps.length){
            chatTimeout=setTimeout(customerArrival,2500);
        }
    }

    if(showFullBtn){
        showFullBtn.addEventListener("click",()=>{
            clearTimeout(chatTimeout);
            fullPanel.classList.remove("hidden");
            chatSteps.forEach(step=>{
                const bubble=document.getElementById(step.id);
                if(bubble){
                    bubble.style.display="none";
                }
            });
            if(taeText) taeText.textContent="";
            if(kooText) kooText.textContent="";
            showFullBtn.style.display="none";
        });
    }
    if(startCookingBtn){
        startCookingBtn.addEventListener("click",()=>{
            new Audio("/static/audio/bell.mp3").play();
            fullPanel.classList.add("hidden");
            kitchenScene.classList.remove("hidden");
            setTimeout(()=>{
                startRestaurantChat();
            },1500);
        });
    }

    function startRestaurantChat(){
        fetch("/static/js/recipes.json")
        .then(r=>r.json())
        .then(data=>{
            window.recipes=data;
            showDynamicChat(restaurantChatSteps,()=>{
                showOrderOptions();
            });
        })
        .catch(err=>{
            console.warn("Recipe loading failed:",err);
            window.recipes={};
            showDynamicChat(restaurantChatSteps,()=>{
                showOrderOptions();
            });
        });
    }

    /* -------------------------------------------
       ORDER / RECIPE
    -------------------------------------------*/
    async function showOrderOptions(){
        const order=window.currentOrder || await loadRandomRecipe();
        window.currentOrder=order;
        const orderChat=[
            {id:"taeBubble",text:`The customer wants to order <strong>${order.name}!</strong>`},
            {id:"kooBubble",text:"Tete, can you get the ingredients from the pantry?"},
            {id:"taeBubble",text:"Yes Kookie!"}
        ];
        showDynamicChat(orderChat,()=>{
            startIngredientScene(order);
            kitchenScene.classList.add("hidden");
        });
    }

    async function loadRandomRecipe(){
        const res=await fetch("/static/js/recipes.json");
        const data=await res.json();
        const allRecipes=[
            ...(data.beverages||[]),
            ...(data.food||[]),
            ...(data.foods||[]),
            ...(data.desserts||[]),
            ...(data.chefKooSpecial||[])
        ];
        return randomLine(allRecipes);
    }

    /* -------------------------------------------
       CANVAS GAME STATE
    -------------------------------------------*/

    const gameCanvas=document.getElementById("gameCanvas");
    const canvasHolder=document.getElementById("gameCanvasContainer");
    const ctx=gameCanvas.getContext("2d");
    const gameState={
        chef:{},
        items:[],
        running:false,
        rafId:null,
        itemSpawner:null
    };
    const chefImg=new Image();
    chefImg.src="/static/images/games/cookwithtaekook/ingredient/tae_ingredients.png";
    chefImg.onload=()=>{
        gameState.chef.img=chefImg;
        if(gameState.running){
            updateGame();
        }
    };

    /* -------------------------------------------
       CHEF POSITION
    -------------------------------------------*/
    function positionChef(){
        const pw=canvasHolder.clientWidth;
        const ph=canvasHolder.clientHeight;
        let chefScale;
        if(window.innerWidth<=768){
            chefScale=0.18;
        }
        else if(window.innerWidth<=1024){
            chefScale=0.15;
        }
        else{
            chefScale=0.12;
        }
        gameState.chef.w=Math.max(40,Math.floor(pw*chefScale));
        gameState.chef.h=Math.max(40,Math.floor(ph*chefScale*1.4));
        gameState.chef.x=(pw-gameState.chef.w)/2;
        gameState.chef.y=ph-gameState.chef.h;
    }

    /* -------------------------------------------
       OBSTACLES
    -------------------------------------------*/
    function getRandomObstacle(){
        if(!window.recipes){
            return {emoji:"💣"};
        }
        const allRecipes=[
            ...(window.recipes.beverages||[]),
            ...(window.recipes.food||[]),
            ...(window.recipes.foods||[]),
            ...(window.recipes.desserts||[])
        ];
        const pool=[];
        allRecipes.forEach(recipe=>{
            if(!recipe.ingredients) return;
            recipe.ingredients.forEach(ing=>{
                const current=window.currentOrder.ingredients.some(i=>i.name===ing.name);
                if(!current){
                    pool.push(ing);
                }
            });
        });
        if(!pool.length){
            return {emoji:"💣"};
        }
        return randomLine(pool);
    }

    /* -------------------------------------------
       SPAWN ITEMS
    -------------------------------------------*/
    let lastSpawnedIngredient=null;

    function spawnItem(){
        console.log("Spawn", window.currentOrder?.ingredients?.length);
        if(!window.currentOrder?.ingredients) return;
        const collected=window.currentOrder.ingredients.filter(i=>i.collected).length;
        const total=window.currentOrder.ingredients.length;
        let obstacleChance=0.4;
        if(collected>total*0.5) obstacleChance=0.6;
        if(collected>total*0.8) obstacleChance=0.75;
        const obstacle=Math.random()<obstacleChance;
        let chosen;
        if(obstacle){
            chosen=getRandomObstacle();
        }
        else{
            let available=window.currentOrder.ingredients.filter(i=>i!==lastSpawnedIngredient);
            chosen=available.length
            ? randomLine(available)
            : randomLine(window.currentOrder.ingredients);
            lastSpawnedIngredient=chosen;
        }
        const scale=window.innerWidth<=768?0.5:window.innerWidth<=1024?0.8:1;
        const item={
            emoji:chosen.emoji,
            image:chosen.image||null,
            img:null,
            x:Math.random()*(gameCanvas.width-40)+20,
            y:-40,
            size:(30+Math.random()*20)*scale,
            speed:(2+Math.random()*2)*scale
        };

        if(item.image){
            item.img=new Image();
            item.img.src=`/static/images/games/cookwithtaekook/ingredient/${item.image}`;    
            item.img.onerror=()=>{
                item.img=null;
            };
        }
        gameState.items.push(item);
    }

    /* -------------------------------------------
       GAME LOOP
    -------------------------------------------*/
    function updateGame(){
        setChatMode("ingredient");

        if(!gameState.running) return;
        ctx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
        if(gameState.chef.img && gameState.chef.img.complete){
            ctx.drawImage(
                gameState.chef.img,
                gameState.chef.x,
                gameState.chef.y,
                gameState.chef.w,
                gameState.chef.h
            );
        }
        else{
            ctx.font=`${gameState.chef.h*0.6}px serif`;
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillText(
                "👨‍🍳",
                gameState.chef.x+gameState.chef.w/2,
                gameState.chef.y+gameState.chef.h/2
            );
        }
        for(let i=gameState.items.length-1;i>=0;i--){
            const item=gameState.items[i];
            item.y+=item.speed;
            const hitX=item.x>=gameState.chef.x && item.x<=gameState.chef.x+gameState.chef.w;
            const hitY=item.y>=gameState.chef.y && item.y<=gameState.chef.y+gameState.chef.h;
            if(hitX && hitY){
                gameState.items.splice(i,1);
                const ingredient=window.currentOrder.ingredients.find(
                    obj=>obj.emoji===item.emoji && !obj.collected
                );

                if(ingredient){
                    ingredient.collected=true;
                    updateCollectedIngredient(ingredient,item);
                    const count=window.currentOrder.ingredients.filter(i=>i.collected).length;
                    const total=window.currentOrder.ingredients.length;
                    if(count===total){
                        gameState.running=false;
                        clearInterval(gameState.itemSpawner);
                        showCollectedPopup();
                    }
                    else if(count===total-1){showKooMessage(randomLine(finalCatchLines), 1000);}
                    else if(count>total*0.6){showKooMessage(randomLine(almostDoneLines), 1000);}
                    else{showKooMessage(randomLine(goodCatchLines), 1000);}
                }
                else{showTaeMessage(randomLine(badCatchLines),1000);}
                continue;
            }
            if(item.img && item.img.complete && item.img.naturalWidth>0){
                ctx.drawImage(item.img,item.x,item.y,item.size,item.size);
            }
            else{
                ctx.font=`${item.size}px serif`;
                ctx.textAlign="center";
                ctx.textBaseline="middle";         
                ctx.fillText(
                    item.emoji,
                    item.x+item.size/2,
                    item.y+item.size/2
                );
            }
        }
        gameState.rafId=requestAnimationFrame(updateGame);
    }

    /* -------------------------------------------
       GAME COMPLETE POPUP
    -------------------------------------------*/
    function showCollectedPopup(){
        const popup=document.getElementById("ingredientCollectedPopup");
        if(!popup) return;
        popup.classList.remove("hidden");
        document.getElementById("ingCompleteOk").onclick=()=>{
            popup.classList.add("hidden");
            showCookingChat(window.currentOrder);
        };
    }

    function updateCollectedIngredient(ingredient,item){
        const collected=document.getElementById("collectedIngredients");
        const index=window.currentOrder.ingredients.indexOf(ingredient);
        const holder=collected.children[index];
        if(!holder) return;
        let el;
        if(item.image){
            el=document.createElement("img");
            el.src=`/static/images/games/cookwithtaekook/ingredient/${item.image}`;
            el.className="ingredient-icon";
            el.onerror=()=>{
                const span=document.createElement("span");
                span.className="ingredient-icon";
                span.textContent=item.emoji;
                el.replaceWith(span);
            };
        }
        else{
            el=document.createElement("span");
            el.className="ingredient-icon";
            el.textContent=item.emoji;
        }
        holder.replaceWith(el);
    }

    /* -------------------------------------------
       START GAME
    -------------------------------------------*/
    function startGameCanvas(){
        console.log("Starting game", window.currentOrder);

        const rect=canvasHolder.getBoundingClientRect();
        window.currentOrder.ingredients.forEach(i=>i.collected=false);
        gameCanvas.width=rect.width||800;
        gameCanvas.height=rect.height||500;
        positionChef();
        gameState.items=[];
        gameState.running=true;
        clearInterval(gameState.itemSpawner);
        gameState.itemSpawner=setInterval(spawnItem,700);
        canvasHolder.addEventListener("mousemove",gameState._mouseMove=e=>{
            const x=e.clientX-rect.left-gameState.chef.w/2;
            gameState.chef.x=Math.max(
                0,
                Math.min(x,gameCanvas.width-gameState.chef.w)
            );
        });
        canvasHolder.addEventListener("touchmove",gameState._touchMove=e=>{
            if(!e.touches[0]) return;
            const x=e.touches[0].clientX-rect.left-gameState.chef.w/2;
            gameState.chef.x=Math.max(
                0,
                Math.min(x,gameCanvas.width-gameState.chef.w)
            );
        });
        updateGame();
    }

    /* -------------------------------------------
       INGREDIENT SCENE
    -------------------------------------------*/
    function startIngredientScene(recipe){
        console.log("Entering ingredient scene", recipe.name);
        resetIngredientScene();
        kitchenScene.classList.add("hidden");
        ingredientScene.classList.remove("hidden");
        document.getElementById("dishTitle").textContent=recipe.name;
        document.getElementById("ingredientLabel").textContent="Ingredients:";
        const ingredientList=document.getElementById("ingredientList");
        ingredientList.innerHTML="";
        recipe.ingredients.forEach(item=>{
            let el;
            if(item.image){
                el=document.createElement("img");
                el.src=`/static/images/games/cookwithtaekook/ingredient/${item.image}`;
                el.alt=item.name;
                el.title=item.name;
                el.className="ingredient-icon";
                el.onerror=()=>{
                    const span=document.createElement("span");
                    span.className="ingredient-icon";
                    span.textContent=item.emoji;
                    el.replaceWith(span);
                };
            }
            else{
                el=document.createElement("span");
                el.className="ingredient-icon";
                el.textContent=item.emoji;
            }
            ingredientList.appendChild(el);
        });
        document.getElementById("startCollectIngredientsBtn").onclick=()=>{
            setChatMode("ingredient");
            document.getElementById("ingredientTopBlock").style.display="none";
            document.getElementById("ingredientInstructions").style.display="none";
            document.getElementById("gameReadyUI").classList.remove("hidden");
            document.getElementById("dishTitle2").textContent=window.currentOrder.name;
            const needed=document.getElementById("neededIngredients");
            const collected=document.getElementById("collectedIngredients");
            needed.innerHTML="";
            collected.innerHTML="";
            const size=window.innerWidth<=600?24:window.innerWidth<=1024?36:48;
            window.currentOrder.ingredients.forEach(item=>{
                let el;
                if(item.image){
                    el=document.createElement("img");
                    el.src=`/static/images/games/cookwithtaekook/ingredient/${item.image}`;
                    el.className="ingredient-icon";
                    el.onerror=()=>{
                        const span=document.createElement("span");
                        span.className="ingredient-icon";
                        span.textContent=item.emoji;
                        el.replaceWith(span);
                    };
                }
                else{
                    el=document.createElement("span");
                    el.className="ingredient-icon";
                    el.textContent=item.emoji;
                }
                needed.appendChild(el);
                const box=document.createElement("span");
                box.textContent="⬜";
                box.style.fontSize=size+"px";
                collected.appendChild(box);
            });
            gameCanvas.style.display="block";
            setTimeout(startGameCanvas,50);
        };
    }

    /* -------------------------------------------
       RETURN TO KITCHEN
    -------------------------------------------*/
    function stopAndReturnToKitchen(){
        setChatMode("kitchen");
        ingredientScene.classList.add("hidden");
        kitchenScene.classList.remove("hidden");
        gameState.running=false;
        clearInterval(gameState.itemSpawner);
        cancelAnimationFrame(gameState.rafId);
        gameState.items=[];
        if(gameState._mouseMove){
            canvasHolder.removeEventListener("mousemove",gameState._mouseMove);
        }
        if(gameState._touchMove){
            canvasHolder.removeEventListener("touchmove",gameState._touchMove);
        }
        showDynamicChat(cancelReturnChat, ()=>{
            window.location.href="/games";
        }, "kitchen");
    }
    document.getElementById("cancelIngredientBtn").onclick=stopAndReturnToKitchen;
    document.getElementById("cancelDuringGameBtn").onclick=stopAndReturnToKitchen;

    /* -------------------------------------------
    COOKING SCENE
    -------------------------------------------*/
    function startCookingScene(recipe){
        if(!recipe)return;
        ingredientScene.classList.add("hidden");
        const scene=document.getElementById("cookingScene");
        const title=document.getElementById("cookDishTitle");
        const instructions=document.getElementById("cookInstructions");
        const ingredientList=document.getElementById("cookingIngredients");
        const stepList=document.getElementById("stepIngredients");
        const btn=document.getElementById("cookBtn");
        scene.classList.remove("hidden");
        title.textContent=recipe.name;
        instructions.textContent=`Step 1: Add ingredients`;
        const bg=recipe.appliance?.image || "taekook_cooking.png";
        scene.style.backgroundImage=`url("/static/images/games/cookwithtaekook/cooking/${bg}")`;
        ingredientList.innerHTML="";
        stepList.innerHTML="";
        stepList.classList.add("hidden");
        recipe.ingredients.forEach(ing=>{
            const item=document.createElement("span");
            item.className="ingredient-icon";
            item.title=ing.name;
            if(ing.image){
                const img=document.createElement("img");
                img.src=`/static/images/games/cookwithtaekook/ingredient/${ing.image}`;
                img.onerror=()=>{
                    item.textContent=ing.emoji;
                };
                item.appendChild(img);
            }
            else{
                item.textContent=ing.emoji;
            }
            ingredientList.appendChild(item);
        });

        window.currentRecipe=recipe;
        window.added=[];
        window.stepAdded=[];
        window.cookingStep=0;
        const firstStep=recipe.steps[0];
        instructions.textContent=
        `Step ${firstStep.step}: ${firstStep.action}`;
        loadStepIngredients();
        btn.textContent="Cook 🍳";
        btn.onclick=nextCookingStep;
    }

    function showCookingChat(recipe){
        setChatMode("cooking");
        ingredientScene.classList.add("hidden");
        kitchenScene.classList.add("hidden");
        restaurantScene.classList.add("hidden");
        startCookingScene(recipe);
        const btn=document.getElementById("cookBtn");
        btn.style.display="none";
        document.getElementById("cookInstructions").textContent="";
        document.getElementById("stepIngredients").classList.add("hidden");
    
        const cookingchat=[
            {id:"taeBubble",text:`Kookie, I got all the ingredients for <strong>${recipe.name}</strong>!`},
            {id:"kooBubble",text:"Thank you Hyung! Let's make it together 💜"},
            {id:"taeBubble",text:"Yes, Let's start! 👨‍🍳"}
        ];

        showDynamicChat(cookingchat,()=>{
            document.getElementById("cookInstructions").textContent=
            `Step ${recipe.steps[0].step}: ${recipe.steps[0].action}`;
            document.getElementById("stepIngredients").classList.remove("hidden");
            loadStepIngredients();
            btn.style.display="block";
        });
    }

    /* -------------------------------------------
    ADD INGREDIENT
    -------------------------------------------*/
    function addIngredient(ing,item){
        setChatMode("cooking");
        const recipe=window.currentRecipe;
        const step=recipe.steps[window.cookingStep];   
        if(!step.addIngredients.includes(ing.name)){
            showTaeMessage("😤 Not needed yet!");
            return;
        }
        if(window.stepAdded.includes(ing.name)){
            return;
        }
        window.stepAdded.push(ing.name);
        window.added.push(ing.name);
        item.remove();
        showKooMessage(`💜 Added ${ing.name}!`);
        const stepComplete=step.addIngredients.every(name=>window.stepAdded.includes(name));
        if(stepComplete){
            document.getElementById("cookInstructions").textContent=
            `Step ${step.step} complete! ✨ Press Cook to continue`;
            animateCooking();
        }
    }

    /* -------------------------------------------
    ADD INGREDIENT
    -------------------------------------------*/
    function loadStepIngredients(){
        const recipe=window.currentRecipe;
        const step=recipe.steps[window.cookingStep];
        const list=document.getElementById("stepIngredients");   
        list.innerHTML="";
        step.addIngredients.forEach(name=>{
            const ing=recipe.ingredients.find(i=>i.name===name);
            if(!ing)return;
            const item=document.createElement("span");
            item.className="ingredient-icon";
            item.title=ing.name;
            if(ing.image){
                const img=document.createElement("img");
                img.src=`/static/images/games/cookwithtaekook/ingredient/${ing.image}`;
                img.onerror=()=>{
                    item.textContent=ing.emoji;
                };
                item.appendChild(img);
            }
            else{
                item.textContent=ing.emoji;
            }
            item.onclick=()=>addIngredient(ing,item);
            list.appendChild(item);
        });
    }

    /* -------------------------------------------
    COOKING STEPS
    -------------------------------------------*/
    function nextCookingStep(){
        if(!window.currentRecipe){
            return;
        }
        const recipe=window.currentRecipe;
        const steps=recipe.steps;
        if(window.cookingStep===undefined){
            window.cookingStep=0;
        }
        const currentStep=steps[window.cookingStep];
        if(currentStep.addIngredients.length){
            const missing=currentStep.addIngredients.some(
                name=>!window.added.includes(name)
            );
            if(missing){
                showTaeMessage(randomLine(taeReminderMessages));
                return;
            }
        }
    
        window.cookingStep++;
        window.stepAdded=[];
    
        if(window.cookingStep<steps.length){
            const nextStep=steps[window.cookingStep];
            document.getElementById("cookInstructions").textContent=
            `Step ${nextStep.step}: ${nextStep.action}`;
            loadStepIngredients();
            const btn=document.getElementById("cookBtn");
            if(window.cookingStep===steps.length-1){
                btn.style.display="none";
                showTaeMessage("🎉 Kookie, look! We made it perfectly!");
                setTimeout(()=>{
                    showKooMessage("The customer is going to love this 💜");
                    setTimeout(()=>{
                        btn.textContent="Serve 🍽️";
                        btn.onclick=finishCooking;
                        btn.style.display="block";
                    },1500);
                },1000);
            
                btn.textContent="Serve 🍽️";
                btn.onclick=finishCooking;
            }
            else{
                showTaeMessage(randomLine(taeEncouragementMessages));
            }
        }
        else{
            finishCooking();
        }
    }

    /* -------------------------------------------
    APPLIANCE ANIMATION
    -------------------------------------------*/
    function animateCooking(){
        const scene=document.getElementById("cookingScene");
        scene.classList.add("active-cook");
        setTimeout(()=>{
            scene.classList.remove("active-cook");
        },800);
    }

    /* -------------------------------------------
    FINISH
    -------------------------------------------*/
    function finishCooking(){
        startDeliveryScene();
    }

    /* -------------------------------------------
    DELIVERY SCENE
    -------------------------------------------*/
    function startDeliveryScene(){
        cookingScene.classList.add("hidden");
        deliveryScene.classList.remove("hidden");
        setChatMode("delivery");

        const recipe=window.currentRecipe;
        document.getElementById("deliveryTitle").textContent=
        `${recipe.name} is ready!`;
        const customer=document.getElementById("deliveryCustomer");
        const dish=document.getElementById("deliveryDish");

        // Random customer
        const totalCustomers=5;
        const customerNo=Math.floor(Math.random()*totalCustomers)+1;
        window.currentCustomer=`customer${customerNo}.png`;
        document.getElementById("deliveryBackground").style.backgroundImage =
            `url("/static/images/games/cookwithtaekook/delivery/customers/customer${customerNo}.png")`;
        const recipeName = recipe.name;
        const taeImage = `/static/images/games/cookwithtaekook/delivery/recipes/tae_${recipeName}.png`;
        const kooImage = `/static/images/games/cookwithtaekook/delivery/recipes/koo_${recipeName}.png`;
        const imgTest = new Image();
        imgTest.onload = ()=>{
            dish.src = taeImage;
            dish.classList.remove("chef-tae","chef-koo");
            dish.classList.add("chef-tae");
            window.deliveryChef="tae";
        };
        imgTest.onerror = ()=>{
            dish.src = kooImage;
            dish.classList.remove("chef-tae","chef-koo");
            dish.classList.add("chef-koo");
            window.deliveryChef="koo";
        };
        imgTest.src = taeImage;
        dish.onerror=()=>{
            dish.onerror=null;
            dish.src=
            `/static/images/games/cookwithtaekook/delivery/recipes/Default${defaultRecipeImage}.png`;
    
            defaultRecipeImage=
            defaultRecipeImage===1?2:1;
        };
        console.log("Recipe:", recipe.name);
        console.log("Chef:", window.deliveryChef);
        console.log("Image:", dish.src);
        setTimeout(()=>{
            const bell=new Audio("/static/audio/bell.mp3");
            bell.play().catch(err=>console.log(err));
        },1000);
        setTimeout(()=>{
            if(window.deliveryChef==="tae"){
                showTaeMessage(randomLine(servingMessages));
            }
            else{
                showKooMessage(randomLine(servingMessages));
            }
        },5000);
        setTimeout(()=>{
            showCustomerMessage(randomLine(customerFoodCompliments),2000);
        },6000);
        setTimeout(()=>{
            if(window.deliveryChef==="tae"){
                showTaeMessage("Its our pleasure. Enjoy your meal! 💚",2000);
            }
            else{
                showKooMessage("Its our pleasure. Enjoy your meal! 💜",2000);
            }
            setTimeout(()=>{
                eatingOverlay.classList.remove("hidden");
                setTimeout(()=>{
                    eatingOverlay.classList.add("hidden");
                    startReceiptScene();
                },5000);
            },3000);
        },8000);
    }

    function startReceiptScene(){
        setChatMode("receipt");    
        deliveryScene.classList.add("hidden");
        receiptScene.classList.remove("hidden");
        const recipe=window.currentRecipe;
        document.getElementById("receiptItem").textContent=recipe.name;
        document.getElementById("receiptDishName").textContent=recipe.name;
        document.getElementById("receiptDish").src=
        `/static/images/games/cookwithtaekook/delivery/recipes/${window.deliveryChef}_${recipe.name}.png`;
        setTimeout(()=>{
            receiptScene.classList.add("hidden");
            startPaymentScene();
        },4000);
    }

    function startPaymentScene(){
        setChatMode("receipt");
        paymentScene.classList.remove("hidden");
        setTimeout(()=>{
            showCustomerMessage(randomLine(customerMessages),2000);
        },2000);
        setTimeout(()=>{
            if(window.deliveryChef==="tae"){showTaeMessage("Thank you! Please visit us again 💚",2000);}
            else{showKooMessage("Thank you! Please visit us again 💜",2000);}
        },4000);    
        setTimeout(()=>{
            new Audio("/static/audio/doorlock.mp3")
            .play()
            .catch(()=>{});
        },6000);
        setTimeout(()=>{
            showPaymentOptions();
        },7000);
    }

    function showPaymentOptions(){
        const options=document.querySelector(".payment-options");
        options.classList.remove("hidden");
    
        document.getElementById("continueCustomer").onclick=()=>{
            window.currentOrder=null;
            new Audio("/static/audio/bell.mp3").play().catch(()=>{});
            options.classList.add("hidden");
            paymentScene.classList.add("hidden");
            kitchenScene.classList.remove("hidden");
            instructionPanel.classList.add("hidden");
            fullPanel.classList.add("hidden");
            setChatMode("kitchen");
            startRestaurantChat();
        };
    
        document.getElementById("backGames").onclick=()=>{
            window.location.href="/games";
        };
    }

});