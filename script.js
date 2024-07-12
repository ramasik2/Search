const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const recipeList = document.getElementById("recipe-list");
const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = document.getElementById("modal-close");

searchBtn.addEventListener("click", getRecipes);
modalClose.addEventListener("click", closeModal);

function getRecipes() {
    const searchTerm = searchInput.value.trim();

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.meals);
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            alert("Failed to fetch recipes. Please try again.");
        });
}

function displayRecipes(recipes) {
    if (!recipes) {
        alert("No recipes found with that ingredient.");
        return;
    }

    recipeList.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
            <button class="recipe-details-btn" data-id="${recipe.idMeal}">View Recipe</button>
        `;
        recipeList.appendChild(recipeCard);

        const recipeDetailsBtn = recipeCard.querySelector(".recipe-details-btn");
        recipeDetailsBtn.addEventListener("click", () => openModal(recipe.idMeal));
    });
}

function openModal(recipeId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const html = `
                <span id="modal-close" class="modal-close">&times;</span>
                <div id="recipe-details">
                    <div class="recipe-details-img">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <h2 class="recipe-details-title">${meal.strMeal}</h2>
                    <p class="recipe-details-category">Category: ${meal.strCategory}</p>
                    <p class="recipe-details-instructions">${meal.strInstructions}</p>
                    <a href="${meal.strYoutube}" target="_blank" class="recipe-details-link">Watch Video</a>
                </div>
            `;
            modalContent.innerHTML = html;
            recipeModal.style.display = "block";

            const modalClose = document.getElementById("modal-close");
            modalClose.addEventListener("click", closeModal);
        })
        .catch(error => {
            console.error("Error fetching recipe details:", error);
            alert("Failed to fetch recipe details. Please try again.");
        });
}

function closeModal() {
    recipeModal.style.display = "none";
}
