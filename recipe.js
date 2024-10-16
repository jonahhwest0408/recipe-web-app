// recipe.js
const API_KEY = '2c4cb80ebdf44090842b8e6e4ca042cd';
const RECIPE_DETAIL_URL = (id) => `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

class RecipeDetail {
    constructor() {
        this.recipeDetailContainer = document.getElementById('recipe-detail-container');
        this.init();
    }

    async init() {
        const recipeId = this.getRecipeIdFromURL();
        if (recipeId) {
            try {
                const recipe = await this.fetchRecipe(recipeId);
                this.renderRecipeDetail(recipe);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
                this.recipeDetailContainer.innerHTML = '<p>Error loading recipe. Please try again later.</p>';
            }
        } else {
            this.recipeDetailContainer.innerHTML = '<p>No recipe found.</p>';
        }

        // Add back button functionality
        document.getElementById('back-button').addEventListener('click', () => {
            window.history.back();
        });
    }

    getRecipeIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id'); // Retrieve the 'id' query parameter
    }

    async fetchRecipe(id) {
        const response = await fetch(RECIPE_DETAIL_URL(id));
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    renderRecipeDetail(recipe) {
        this.recipeDetailContainer.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p>${recipe.instructions}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
            </ul>
        `;
    }
}

// Initialize the recipe detail view
new RecipeDetail();
