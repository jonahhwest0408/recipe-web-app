const API_KEY = '055b6c8496284db095e8085e4e15feb9';
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

        document.getElementById('back-button').addEventListener('click', () => {
            window.history.back();
        });
    }

    getRecipeIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id'); 
    }

    async fetchRecipe(id) {
        const response = await fetch(RECIPE_DETAIL_URL(id));
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    renderRecipeDetail(recipe) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(fav => fav.id === recipe.id);

        this.recipeDetailContainer.innerHTML = `
            <h2>${recipe.title}</h2>
            <div class="button-container">
                <button class="favorite-button" data-id="${recipe.id}">
                    ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
            <div class="recipe-card--content">
                <img src="${recipe.image}" alt="${recipe.title}">
                <p>${recipe.instructions}</p>
            </div>
            <div class="ingredient--content">
                <h3>Ingredients:</h3>
                <ul>
                    ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                </ul>
            </div>
        `;

        this.addFavoriteButtonListener(recipe);
    }

    addFavoriteButtonListener(recipe) {
        const favoriteButton = document.querySelector('.favorite-button');
        if (favoriteButton) {
            favoriteButton.addEventListener('click', () => {
                this.toggleFavorite(recipe);
            });
        }
    }

    toggleFavorite(recipe) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const recipeIndex = favorites.findIndex(fav => fav.id === recipe.id);

        if (recipeIndex === -1) {
            favorites.push({ id: recipe.id, title: recipe.title, image: recipe.image }); //include any other necessary properties
            alert(`${recipe.title} has been added to your favorites.`);
        } else {
            favorites.splice(recipeIndex, 1);
            alert('Recipe has been removed from your favorites.');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        const buttonText = recipeIndex === -1 ? 'Remove from Favorites' : 'Add to Favorites';
        document.querySelector('.favorite-button').innerText = buttonText;
    }
}

// Initialize the recipe detail view
new RecipeDetail();
