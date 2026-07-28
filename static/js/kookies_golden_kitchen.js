document.addEventListener("DOMContentLoaded",async()=>{
    const chest=document.getElementById("recipeChest");
    const chestLid=document.getElementById("chestLid");
    const recipeMenu=document.getElementById("recipeMenu");
    const categories=document.querySelectorAll(".recipe-category");
    const recipeModal=document.getElementById("recipeModal");
    const recipeDetails=document.getElementById("recipeDetails");
    const closeRecipe=document.getElementById("closeRecipe");
    let recipes=[];
    try{
        const response=await fetch("/static/json/kookies_golden_kitchen.json");
        recipes=await response.json();
    }
    catch(error){
        console.error("Unable to load recipes:",error);
    }
    chestLid.addEventListener("click",()=>{
        chest.classList.toggle("open");
        recipeMenu.classList.toggle("hidden");
        if(chest.classList.contains("open")){
            chestLid.querySelector("p").textContent="Recipe Collection Open";
        }
        else{
            chestLid.querySelector("p").textContent="Click to Open";
            categories.forEach(category=>{
                category.classList.remove("open");
                category.querySelector(".category-recipes").innerHTML="";
            });
        }
    });
    categories.forEach(category=>{
        const header=category.querySelector(".category-header");
        const recipeContainer=category.querySelector(".category-recipes");
        header.addEventListener("click",()=>{
            if(category.classList.contains("open")){
                category.classList.remove("open");
                recipeContainer.innerHTML="";
                return;
            }
            categories.forEach(item=>{
                item.classList.remove("open");
                item.querySelector(".category-recipes").innerHTML="";
            });
            category.classList.add("open");
            const categoryName=category.dataset.category.toLowerCase();
            const filteredRecipes=recipes.filter(recipe=>
                recipe.category.toLowerCase()===categoryName
            );
            if(filteredRecipes.length===0){
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
                item.innerHTML=`
                    ${recipe.icon || "🍽️"} ${recipe.name}
                `;
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
            <h2>${recipe.icon || "🍽️"} ${recipe.name}</h2>
            ${
                recipe.image
                ?
                `<img src="/static/images/games/cookwithtaekook/${recipe.image}" alt="${recipe.name}">`
                :
                ""
            }
            <p class="recipe-description">${recipe.description || ""}</p>
            <div class="recipe-info">
                ${
                    recipe.difficulty
                    ?
                    `<span>⭐ ${recipe.difficulty}</span>`
                    :
                    ""
                }
                ${
                    recipe.time
                    ?
                    `<span>⏱️ ${recipe.time}</span>`
                    :
                    ""
                }
            </div>
            ${
                recipe.memory
                ?
                `
                <div class="memory-box">
                    <h3>✨ ${recipe.memory.title}</h3>
                    <p>${recipe.memory.description}</p>
                </div>
                `
                :
                ""
            }
            <div class="recipe-columns">
                ${
                    recipe.ingredients && recipe.ingredients.length
                    ?
                    `
                    <div class="recipe-section">
                        <h3>Ingredients</h3>
                        <ul>
                            ${
                                recipe.ingredients.map(item=>`
                                    <li>
                                        ${item.icon || "🍴"}
                                        ${item.name}
                                        - ${item.quantity}
                                    </li>
                                `).join("")
                            }
                        </ul>
                    </div>
                    `
                    :
                    ""
                }
                ${
                    recipe.steps && recipe.steps.length
                    ?
                    `
                    <div class="recipe-section">
                        <h3>Cooking Steps</h3>
                        <ol>
                            ${
                                recipe.steps.map(step=>`
                                    <li>
                                        <strong>${step.instruction}</strong>
                                        ${
                                            step.tip
                                            ?
                                            `<br><small>💡 ${step.tip}</small>`
                                            :
                                            ""
                                        }
                                    </li>
                                `).join("")
                            }
                        </ol>
                    </div>
                    `
                    :
                    ""
                }
            </div>
            ${
                recipe.kookie_notes
                ?
                `
                <div class="recipe-section notes-section">
                    <h3>🐰 Kookie's Notes</h3>
                    <ul>
                        ${
                            recipe.kookie_notes.map(note=>`
                                <li>${note}</li>
                            `).join("")
                        }
                    </ul>
                </div>
                `
                :
                ""
            }
            ${
                recipe.army_tips
                ?
                `
                <div class="recipe-section notes-section">
                    <h3>💜 Tips</h3>
                    <ul>
                        ${
                            recipe.army_tips.map(tip=>`
                                <li>${tip}</li>
                            `).join("")
                        }
                    </ul>
                </div>
                `
                :
                ""
            }
            ${
                recipe.achievement
                ?
                `
                <div class="achievement">
                    ${recipe.achievement.icon}
                    ${recipe.achievement.name}
                </div>
                `
                :
                ""
            }
        `;
    }
    closeRecipe.addEventListener("click",()=>{
        recipeModal.classList.add("hidden");
    });
    recipeModal.addEventListener("click",event=>{
        if(event.target===recipeModal){
            recipeModal.classList.add("hidden");
        }
    });
});