// Obtener el pokémon de localStorage
function getPokemonFromStorage() {
    const pokemonData = localStorage.getItem('selectedPokemon');
    return pokemonData ? JSON.parse(pokemonData) : null;
}

// Sonidos (hover + click) para la página de detalle
const hoverSound = new Audio('../sounds/hover.wav');
hoverSound.preload = 'auto';
const clickSound = new Audio('../sounds/click.wav');
clickSound.preload = 'auto';
// evitar múltiples reproducciones al moverse dentro de la misma tarjeta
let _lastHoverDetail = null;

// Helper: fetch pokemon by name
const API_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonByName(name) {
    try {
        const res = await fetch(API_POKEMON + name);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Error fetching pokemon by name', name, err);
        return null;
    }
}

// Renderiza los datos de un objeto pokemon en la página (sin recargar)
function renderPokemon(pokemon) {
    if (!pokemon) return;

    // Actualizar título y favicon
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.title = `${pokemonName} - Carles' Pokedex`;
    const faviconLink = document.querySelector("link[rel='icon']");
    if (faviconLink) faviconLink.href = pokemon.sprites.front_default || pokemon.sprites.other["official-artwork"].front_default || '../images/pokeball.png';

    // Actualizar la información básica
    document.getElementById('pokemon-id-back').textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
    document.getElementById('pokemon-id').textContent = `#${pokemon.id}`;
    document.getElementById('pokemon-name').textContent = pokemon.name.toUpperCase();
    document.getElementById('pokemon-image').src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
    document.getElementById('pokemon-height').textContent = `HEIGHT: ${pokemon.height}M`;
    document.getElementById('pokemon-weight').textContent = `WEIGHT: ${pokemon.weight}KG`;

    // Mostrar tipos
    const typesContainer = document.getElementById('pokemon-types');
    typesContainer.innerHTML = pokemon.types.map(type => 
        `<p class="${type.type.name} tipo">${type.type.name.toUpperCase()}</p>`
    ).join('');

    // Mostrar stats con formato mejorado
    const statsContainer = document.getElementById('base-stats');
    const statNames = {
        'hp': 'HP',
        'attack': 'ATK',
        'defense': 'DEF',
        'special-attack': 'SP.ATK',
        'special-defense': 'SP.DEF',
        'speed': 'SPEED'
    };
    
    statsContainer.innerHTML = pokemon.stats.map(stat => `
        <div class="stat-item">
            <p class="stat-name">${statNames[stat.stat.name] || stat.stat.name.toUpperCase()}</p>
            <p class="stat-value">${stat.base_stat}</p>
        </div>
    `).join('');

    // Mostrar habilidades con formato mejorado
    const abilitiesContainer = document.getElementById('abilities');
    abilitiesContainer.innerHTML = pokemon.abilities.map(ability => `
        <div class="ability-item">
            ${ability.ability.name.toUpperCase().replace('-', ' ')}
        </div>
    `).join('');

    // Save current pokemon to localStorage so refresh preserves it
    try { localStorage.setItem('selectedPokemon', JSON.stringify(pokemon)); } catch(e){}
}

// Mostrar la información del pokémon y sus evoluciones
async function displayPokemonDetails() {
    let pokemon = getPokemonFromStorage();
    if (!pokemon) {
        window.location.href = 'index.html';
        return;
    }

    // Render inicial
    renderPokemon(pokemon);
    // Attach hover handlers for image and back button
    attachDetailHoverHandlers();

    // Cargar y mostrar evoluciones
    const evolutionsContainer = document.getElementById('evolutions');
    evolutionsContainer.innerHTML = '';

    const evoUrl = pokemon.evolution_chain_url || (pokemon.species && pokemon.species.url) ? null : null;
    // Preferir evolution_chain_url si está disponible (lo añadimos desde index.js)
    const chainUrl = pokemon.evolution_chain_url || null;
    if (!chainUrl) return; // no hay info

    try {
        const resp = await fetch(chainUrl);
        if (!resp.ok) return;
        const data = await resp.json();
        const chain = data.chain;

        // Recoger todos los nombres de la cadena (recursivo)
        const names = [];
        function traverse(node){
            if (!node) return;
            if (node.species && node.species.name) names.push(node.species.name);
            if (node.evolves_to && node.evolves_to.length > 0) node.evolves_to.forEach(child => traverse(child));
        }
        traverse(chain);

        // Obtener datos de cada pokemon de la cadena
        const fetches = names.map(n => fetchPokemonByName(n));
        const evoPokemons = (await Promise.all(fetches)).filter(Boolean);

        // Crear las tarjetas pequeñas
        evoPokemons.forEach(p => {
            const card = document.createElement('div');
            card.className = 'evolution-card';
            const imgSrc = p.sprites.front_default || p.sprites.other['official-artwork'].front_default || '';
            card.innerHTML = `
                <img src="${imgSrc}" alt="${p.name}">
                <div class="evo-name">${p.name.toUpperCase()}</div>
                <div class="evo-id">#${p.id.toString().padStart(3,'0')}</div>
            `;

            // Click: renderizar ese pokemon en la tarjeta grande
            card.addEventListener('click', async () => {
                // If we only have the small p object, render it directly
                renderPokemon(p);
                // Optionally scroll to top of detail
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Hover: play once per card
            card.addEventListener('mouseenter', () => {
                if (_lastHoverDetail !== card) {
                    _lastHoverDetail = card;
                    hoverSound.currentTime = 0;
                    hoverSound.play();
                }
            });
            card.addEventListener('mouseleave', (e) => {
                if (_lastHoverDetail === card && !card.contains(e.relatedTarget)) _lastHoverDetail = null;
            });

            evolutionsContainer.appendChild(card);
        });

    } catch (err) {
        console.error('Error cargando evoluciones en detail:', err);
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', displayPokemonDetails);

// Hover only for specific elements: image, evolution cards and back button
function attachDetailHoverHandlers() {
    // image
    const img = document.querySelector('#pokemon-image');
    if (img) {
        img.addEventListener('mouseenter', () => {
            if (_lastHoverDetail !== img) {
                _lastHoverDetail = img;
                hoverSound.currentTime = 0;
                hoverSound.play();
            }
        });
        img.addEventListener('mouseleave', (e) => {
            if (_lastHoverDetail === img && !img.contains(e.relatedTarget)) _lastHoverDetail = null;
        });
    }

    // back button
    const back = document.querySelector('#back-to-list');
    if (back) {
        back.addEventListener('mouseenter', () => {
            if (_lastHoverDetail !== back) {
                _lastHoverDetail = back;
                hoverSound.currentTime = 0;
                hoverSound.play();
            }
        });
        back.addEventListener('mouseleave', (e) => {
            if (_lastHoverDetail === back && !back.contains(e.relatedTarget)) _lastHoverDetail = null;
        });
    }
}

// Click sound: limit to evolution cards and back button and any button elements
document.addEventListener('click', (e) => {
    try {
        const el = e.target.closest('button, .evolution-card, #back-to-list');
        if (el) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    } catch (err) {}
}, true);