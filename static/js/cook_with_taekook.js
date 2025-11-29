// INGREDIENTS THAT ACTUALLY EXIST IN YOUR FOLDER
const ingredients = [
    "banana",
    "chocolate",
    "egg",
    "flour",
    "milk",
    "strawberry",
    "sugar"
];

// DISHES (you can add more later)
const dishes = [
    {
        name: "Strawberry Pancake",
        required: ["flour", "egg", "milk", "strawberry", "sugar"]
    },
    {
        name: "Chocolate Banana Cake",
        required: ["flour", "egg", "milk", "chocolate", "banana", "sugar"]
    }
];

let currentDish = null;
let droppedIngredients = [];

function loadDish() {
    currentDish = dishes[Math.floor(Math.random() * dishes.length)];
    document.getElementById("orderText").innerText = `Make: 🍽️ ${currentDish.name}`;
    droppedIngredients = [];
    document.getElementById("reactionText").innerText = "";
    document.getElementById("nextDishBtn").classList.add("hidden");
    loadIngredients();
}

function loadIngredients() {
    const box = document.getElementById("ingredientList");
    box.innerHTML = "";

    ingredients.forEach(item => {
        let img = document.createElement("img");
        img.src = `/static/images/games/cookwithtaekook/${item}.png`;
        img.classList.add("ingredient-item");
        img.draggable = true;
        img.id = item;

        img.addEventListener("dragstart", e => {
            e.dataTransfer.setData("ingredient", item);
        });

        box.appendChild(img);
    });
}

// BOWL DROP AREA
const bowl = document.getElementById("bowl");

bowl.addEventListener("dragover", e => {
    e.preventDefault();
    bowl.classList.add("highlight");
});

bowl.addEventListener("dragleave", () => {
    bowl.classList.remove("highlight");
});

bowl.addEventListener("drop", e => {
    e.preventDefault();
    bowl.classList.remove("highlight");

    const ingredient = e.dataTransfer.getData("ingredient");
    if (!droppedIngredients.includes(ingredient)) {
        droppedIngredients.push(ingredient);
    }

    checkDish();
});

function checkDish() {
    const req = currentDish.required;

    if (droppedIngredients.length === req.length &&
        droppedIngredients.every(i => req.includes(i))) {

        document.getElementById("reactionText").innerText =
            "💜 Tae & JK: WOW! This tastes amazing!!";
        document.getElementById("nextDishBtn").classList.remove("hidden");

    } else if (droppedIngredients.length >= req.length) {
        document.getElementById("reactionText").innerText =
            "😵‍💫 Tae & JK: Uhh… what did you just make??";
        document.getElementById("nextDishBtn").classList.remove("hidden");
    }
}

document.getElementById("nextDishBtn").addEventListener("click", () => {
    loadDish();
});

// INIT
loadDish();
