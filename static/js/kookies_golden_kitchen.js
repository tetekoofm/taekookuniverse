document.addEventListener("DOMContentLoaded",()=>{

    const recipes = window.kitchenRecipes || [];

    console.log("Recipes from Flask:", recipes);
    const chest=document.getElementById("recipeChest");
    const chestLid=document.getElementById("chestLid");
    const recipeMenu=document.getElementById("recipeMenu");
    const categories=document.querySelectorAll(".recipe-category");
    const recipeModal=document.getElementById("recipeModal");
    const recipeDetails=document.getElementById("recipeDetails");
    const closeRecipe=document.getElementById("closeRecipe");

    chestLid.addEventListener("click",()=>{
        chest.classList.toggle("open");
        recipeMenu.classList.toggle("hidden");

        chestLid.querySelector("p").textContent=
        chest.classList.contains("open")
        ?"Recipe Collection Open"
        :"Click to Open";
    });

    categories.forEach(category=>{
        const header=category.querySelector(".category-header");
        const recipeContainer=category.querySelector(".category-recipes");
    
        header.addEventListener("click",()=>{
    
            categories.forEach(item=>{
                if(item !== category){
                    item.classList.remove("open");
                    item.querySelector(".category-recipes").innerHTML="";
                }
            });
    
            if(category.classList.contains("open")){
                category.classList.remove("open");
                recipeContainer.innerHTML="";
                return;
            }
    
            category.classList.add("open");
    
            const categoryName = category.dataset.category.trim().toLowerCase();
    
            console.log("Selected category:", categoryName);
            console.log("Available recipes:", recipes);
    
            const filteredRecipes = recipes.filter(recipe =>
                recipe.category &&
                recipe.category.trim().toLowerCase() === categoryName
            );
    
            console.log("Filtered:", filteredRecipes);
    
            if(filteredRecipes.length === 0){
                recipeContainer.innerHTML=`
                    <div class="recipe-item">
                        Recipes coming soon... ✨
                    </div>
                `;
                return;
            }
    
            filteredRecipes.forEach(recipe=>{
    
                const item=document.createElement("div");
                item.className="recipe-item";
                item.innerHTML=`${recipe.recipe_name}`;
    
                item.addEventListener("click",()=>{
                    showRecipe(recipe);
                });
    
                recipeContainer.appendChild(item);
            });
    
        });
    });

    function showRecipe(recipe){

        recipeModal.classList.remove("hidden");

        recipeDetails.innerHTML=`
        <h2>${recipe.recipe_name}</h2>

        ${recipe.image ?
        `<img src="/static/images/games/cookwithtaekook/${recipe.image}">`
        :""}

        <p class="recipe-description">
        ${recipe.description || ""}
        </p>

        <div class="recipe-info">
            ${recipe.difficulty ? `<span>⭐ ${recipe.difficulty}</span>`:""}
            ${recipe.cook_time ? `<span>⏱️ ${recipe.cook_time}</span>`:""}
        </div>

        <div class="recipe-columns">

        <div class="recipe-section">
            <h3>Ingredients</h3>
            <ul>
            ${(recipe.ingredients || "").split("<br>").map(item=>
                `<li>${item}</li>`
            ).join("")}
            </ul>
        </div>

        <div class="recipe-section">
            <h3>Cooking Steps</h3>
            <ol>
            ${(recipe.steps || "").split("<br>").map(step=>
                `<li>${step}</li>`
            ).join("")}
            </ol>
        </div>

        </div>

        ${recipe.jk_corner ?
        `<div class="jk-corner">
            <h3>✨ JK Corner</h3>
            <p>${recipe.jk_corner}</p>
        </div>`:""}

        ${recipe.memory ?
        `<div class="memory-box">
            <h3>✨ Memory</h3>
            <p>${recipe.memory}</p>
        </div>`:""}

        ${recipe.notes ?
        `<div class="tku-notes">
            <h3>TKU Notes</h3>
            <p>${recipe.notes}</p>
        </div>`:""}
        `;
    }

    closeRecipe.addEventListener("click",()=>{
        recipeModal.classList.add("hidden");
    });

    recipeModal.addEventListener("click",e=>{
        if(e.target===recipeModal){
            recipeModal.classList.add("hidden");
        }
    });
});