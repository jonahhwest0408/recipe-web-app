// script.js
const API_KEY = '2c4cb80ebdf44090842b8e6e4ca042cd';
const RECIPE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;

class RecipeApp {
    constructor() {
        this.recipeContainer = document.getElementById('recipe-container');
        this.init();
    }

    async init() {
        try {
            const recipes = await this.fetchRecipes();
            this.renderRecipes(recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.recipeContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
        }
    }

    async fetchRecipes() {
        const response = await fetch(RECIPE_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    }

    renderRecipes(recipes) {
        this.recipeContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    }

    createRecipeCard(recipe) {
        return `
            <div class="recipe-card">
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p>Ready in ${recipe.readyInMinutes} minutes</p>
                <a href="recipe.html?id=${recipe.id}">View Recipe</a>
            </div>
        `;
    }
}

// Initialize the app
new RecipeApp();
