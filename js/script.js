// script.js
const API_KEY = '055b6c8496284db095e8085e4e15feb9';
const RECIPE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;
const RECIPE_SEARCH_URL = (query) => `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`;

class RecipeApp {
    constructor() {
        this.recipeContainer = document.getElementById('recipe-container');
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.categories = document.querySelectorAll('.category-btn');

        // Initialize the app and event listeners
        this.init();
    }

    async init() {
        try {
            // Fetch and display all recipes on initial page load
            this.recipes = await this.fetchRecipes();
            this.renderRecipes(this.recipes);

            // Add event listener for category filtering
            this.addCategoryFilterListeners();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.recipeContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
        }

        // Add event listener for search functionality
        this.searchButton.addEventListener('click', () => this.handleSearch());

        // Optional: Trigger search on "Enter" key press
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    // Handle the search functionality
    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            try {
                const recipes = await this.fetchRecipes(query);
                this.renderRecipes(recipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
                this.recipeContainer.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
            }
        } else {
            this.recipeContainer.innerHTML = '<p>Please enter a search term.</p>';
        }
    }

    // Fetch recipes, optionally based on a search query
    async fetchRecipes(query = '') {
        const url = query ? RECIPE_SEARCH_URL(query) : RECIPE_URL;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results;
    }

    // Render recipe cards
    renderRecipes(recipes) {
        if (recipes.length === 0) {
            this.recipeContainer.innerHTML = '<p>No recipes found. Try another search term.</p>';
        } else {
            this.recipeContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        }
    }

    // Create a recipe card for each recipe
    createRecipeCard(recipe) {
        return `
            <div class="recipe-card" data-category="${recipe.category}">
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
                <a href="views/recipe.html?id=${recipe.id}" class="view-recipe-link">View Recipe</a>
            </div>
        `;
    }

    // Add event listeners for category filter buttons
    addCategoryFilterListeners() {
        this.categories.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterRecipesByCategory(category);
            });
        });
    }

    // Filter recipes based on selected category
    filterRecipesByCategory(category) {
        const filteredRecipes = category === 'all' ? this.recipes : this.recipes.filter(recipe => recipe.category === category);
        this.renderRecipes(filteredRecipes);
    }
}

// Initialize the app
new RecipeApp();
