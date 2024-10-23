// favorites.js

class FavoritesApp {
    constructor() {
        this.favoritesContainer = document.getElementById('favorites-container');
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Get favorites from local storage
        this.renderFavorites();
        this.setupBackButton();
    }

    // Render favorite recipes
    renderFavorites() {
        if (this.favorites.length === 0) {
            this.favoritesContainer.innerHTML = '<p class="animated-title">No favorite recipes yet. Add some!</p>';
        } else {
            this.favoritesContainer.innerHTML = this.favorites.map(recipe => this.createFavoriteCard(recipe)).join('');
        }
    }

    // Create a favorite card
    createFavoriteCard(recipe) {
        return `
            <div class="recipe-card">
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}">
                <button class="remove-favorite" data-id="${recipe.id}">Remove from Favorites</button>
            </div>
        `;
    }

    // Set up back button functionality
    setupBackButton() {
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Remove a recipe from favorites
    removeFavorite(recipeId) {
        this.favorites = this.favorites.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites)); // Update local storage
        this.renderFavorites();
    }

    // Event delegation for removing favorites
    addRemoveFavoriteListeners() {
        this.favoritesContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-favorite')) {
                const recipeId = parseInt(event.target.dataset.id);
                this.removeFavorite(recipeId);
            }
        });
    }
}

// Initialize the app
const favoritesApp = new FavoritesApp();
favoritesApp.addRemoveFavoriteListeners();
