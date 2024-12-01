document.addEventListener('DOMContentLoaded', displayFavorites);

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const appContainer = document.getElementById('app');

    appContainer.innerHTML = '';

    if (favorites.length === 0) {
        appContainer.innerHTML = '<p>No tienes Pokémon favoritos.</p>';
        return;
    }

    favorites.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        appContainer.appendChild(card);
    });

    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => window.location.href = 'index.html');
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`;
    pokemonImage.alt = pokemon.name;

    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;

    const favoriteIcon = document.createElement('span');
    favoriteIcon.classList.add('favorite-icon');
    favoriteIcon.textContent = '❤️'; // Aquí siempre debería mostrar el ícono lleno

    card.appendChild(pokemonImage);
    card.appendChild(pokemonName);
    card.appendChild(favoriteIcon);

    return card;
}
