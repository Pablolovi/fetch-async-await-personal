const appContainer = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const goToFavoritesBtn = document.getElementById('goToFavorites');
let currentPage = 1;
const perPage = 24;
const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

searchBtn.addEventListener('click', searchPokemon);
prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
resetBtn.addEventListener('click', resetPage);
goToFavoritesBtn.addEventListener('click', () => window.location.href = 'favorites.html');

async function loadPokemon(page = 1) {
    currentPage = page;
    const offset = (currentPage - 1) * perPage;
    const url = `${apiUrl}?limit=${perPage}&offset=${offset}`;

    try {
        const data = await fetchData(url);
        displayPokemon(data.results);
    } catch (error) {
        displayError("Error cargando la lista de Pokémon.");
    }
}

async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim();

    if (query) {
        const searchUrl = `${apiUrl}/${query}`;
        try {
            const data = await fetchData(searchUrl);
            displayPokemon([data]); // Mostrar solo un Pokémon
        } catch (error) {
            displayError("No se encontró ese Pokémon.");
        }
    } else {
        resetPage(); // Si no hay búsqueda, volvemos a la lista completa
    }
}

async function goToPage(page) {
    if (page < 1) return;
    loadPokemon(page);
}

function resetPage() {
    currentPage = 1;
    loadPokemon();
}

function displayPokemon(pokemonList) {
    appContainer.innerHTML = '';

    if (pokemonList.length === 0) {
        appContainer.innerHTML = '<p>No se ha encontrado ningún Pokémon</p>';
        return;
    }

    pokemonList.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        appContainer.appendChild(card);
    });
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.setAttribute('data-name', pokemon.name);  // Asignamos el nombre del Pokémon al card

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `https://img.pokemondb.net/sprites/home/normal/${pokemon.name}.png`;
    pokemonImage.alt = pokemon.name;
    
    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;

    const favoriteIcon = document.createElement('span');
    favoriteIcon.classList.add('favorite-icon');
    favoriteIcon.textContent = isFavorite(pokemon.name) ? '❤️' : '🖤';
    favoriteIcon.addEventListener('click', () => toggleFavorite(pokemon));

    card.appendChild(pokemonImage);
    card.appendChild(pokemonName);
    card.appendChild(favoriteIcon);

    return card;
}

function toggleFavorite(pokemon) {
    let favorites = getFavorites();
    const isFavoriteFlag = favorites.some(fav => fav.name === pokemon.name);

    if (!isFavoriteFlag) {
        favorites.push(pokemon);
    } else {
        favorites = favorites.filter(fav => fav.name !== pokemon.name);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteIcon(pokemon.name);
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function isFavorite(pokemonName) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.name === pokemonName);
}

function updateFavoriteIcon(pokemonName) {
    const favoriteIcons = document.querySelectorAll(`[data-name="${pokemonName}"] .favorite-icon`);
    favoriteIcons.forEach(icon => {
        icon.textContent = isFavorite(pokemonName) ? '❤️' : '🖤';
    });
}

function fetchData(url) {
    return fetch(url).then(response => response.json());
}

function displayError(message) {
    appContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

loadPokemon();
