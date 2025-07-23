const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseButton = document.querySelector(".recipe-close-btn");

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipeContainer.innerHTML = "";
    recipeContainer.classList.remove("initial"); // remove initial bg

    if (!response.meals) {
      recipeContainer.innerHTML = `<h2>No recipes found for "${query}". Please try another dish!</h2>`;
      return;
    }

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> category</p>
            `;
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML =
      "<h2>Error fetching recipes. Please check your connection.</h2>";
  }
};

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="IngredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
  recipeDetailsContent.parentElement.style.display = "block";
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the name of a meal in the search box...</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});

recipeCloseButton.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});
