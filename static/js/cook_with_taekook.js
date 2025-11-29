document.addEventListener("DOMContentLoaded", function() {

    // ===============================
    //  Cook With TaeKook – Game Logic
    // ===============================

    const dishes = {
        "Strawberry Pancakes": ["flour", "milk", "egg", "strawberry"],
        "Chocolate Cookies": ["flour", "sugar", "egg", "chocolate"],
        "Banana Smoothie": ["banana", "milk", "sugar"]
    };

    const funnyFails = [
        "😖 JK: Hyung… what did you just make…?",
        "🤢 Tae: That smells illegal.",
        "💀 JK: I think the bowl is crying."
    ];

    const funnySuccess = [
        "😋 Tae: Waaaah this is delicious!",
        "🫶 JK: Chef-nim, marry me.",
        "🍽️ TaeKook: PERFECT!"
    ];

    let currentDish = null;
    let requiredIngredients = [];
    let addedIngredients = [];

    startNewDish();

    // =======================================
    function startNewDish() {
        document.getElementById("reactionText").textContent = "";
        document.getElementById("nextDishBtn").classList.add("hidden");
        addedIngredients = [];

        const dishNames = Object.keys(dishes);
        currentDish = dishNames[Math.floor(Math.random() * dishNames.length)];
        requiredIngredients = dishes[currentDish];

        document.getElementById("orderText").innerHTML =
            `TaeKook ordered: ⭐ <b>${currentDish}</b><br>
            Needed: ${requiredIngredients.join(", ")}`;

        loadIngredients();
    }

    // =======================================
    function loadIngredients() {
        const container = document.getElementById("ingredientList");
        container.innerHTML = "";

        const allIngredients = [
            "flour", "milk", "egg", "strawberry", "sugar", "banana", "chocolate"
        ];

        allIngredients.forEach(item => {
            const img = document.createElement("img");
            img.src = `/static/images/games/cookwithtaekook/${item}.png`;
            img.dataset.item = item;
            img.draggable = true;

            img.addEventListener("dragstart", dragStart);
            container.appendChild(img);
        });

        const bowl = document.getElementById("bowl");
        bowl.addEventListener("dragover", e => e.preventDefault());
        bowl.addEventListener("drop", droppedInBowl);
    }

    function dragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.dataset.item);
    }

    function droppedInBowl(e) {
        e.preventDefault();
        const ingredient = e.dataTransfer.getData("text/plain");
        addedIngredients.push(ingredient);
    
        // Add visual ingredient inside bowl
        const img = document.createElement("img");
        img.src = `/static/images/games/cookwithtaekook/${ingredient}.png`;
        img.style.width = "50px";
        img.style.margin = "3px";
        document.getElementById("bowlContents").appendChild(img);
    
        evaluateDish();
    }
    

    function evaluateDish() {
        if (addedIngredients.length < requiredIngredients.length) {
            return;
        }

        const sortedAdded = [...addedIngredients].sort();
        const sortedRequired = [...requiredIngredients].sort();

        let reaction = "";

        if (JSON.stringify(sortedAdded) === JSON.stringify(sortedRequired)) {
            reaction = funnySuccess[Math.floor(Math.random() * funnySuccess.length)];
        } else {
            reaction = funnyFails[Math.floor(Math.random() * funnyFails.length)];
        }

        document.getElementById("reactionText").textContent = reaction;

        // Show Next Dish button
        const nextBtn = document.getElementById("nextDishBtn");
        nextBtn.classList.remove("hidden");
        nextBtn.onclick = startNewDish;
    }

});
