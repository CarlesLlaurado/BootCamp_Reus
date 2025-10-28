const listaPokemon = document.querySelector("#listaPokemon");
const botonesTipos = document.querySelectorAll(".btn-header");
const NUMERO_POKEMON = 1025;

const loadingText = document.querySelector(".loading-text");
const loading = document.querySelector("#loading");
const paginacion = document.querySelector("#paginacion");

const todosLosPokemon = [];

let paginaActual = 1;
const pokemonPorPagina = 18;

let listaActual = todosLosPokemon;
const btnAnterior = document.querySelector("#anterior");
const btnSiguiente = document.querySelector("#siguiente");

const hoverSound = new Audio("sounds/hover.wav");
hoverSound.preload = "auto";
const clickSound = new Audio("sounds/click.wav");
clickSound.preload = "auto";

// track last hovered element to avoid multiple hover sounds when moving inside a card
let _lastHoverEl = null;

let URL = "https://pokeapi.co/api/v2/pokemon/";

async function obtenerPokemon() {
    loading.style.display = "flex";
    paginacion.style.display = "none";
    
    const promises = [];
    // Cargar todos los Pokémon desde 1 hasta NUMERO_POKEMON
    for (let i = 1; i <= NUMERO_POKEMON; i++) {
        promises.push(
            fetch(URL + i)
                .then(res => res.json())
                .then(async (pokemon) => {
                    // Obtener la especie del Pokémon para conseguir la URL de evolución
                    const speciesResponse = await fetch(pokemon.species.url);
                    const speciesData = await speciesResponse.json();
                    
                    // Guardar la URL de evolución en el objeto pokemon
                    pokemon.evolution_chain_url = speciesData.evolution_chain.url;
                    return pokemon;
                })
        );
    }
    
    try {
        // Cargar los Pokémon en grupos de 50 para no sobrecargar la API
        for (let i = 0; i < promises.length; i += 50) {
            const batchPromises = promises.slice(i, i + 50);
            const results = await Promise.all(batchPromises);
            todosLosPokemon.push(...results);
            
            // Actualizar la vista con los Pokémon cargados hasta ahora
            listaActual = todosLosPokemon;
            mostrarPagina(listaActual);
        }
    } catch (error) {
        console.error("Error cargando los Pokémon:", error);
    }

    loading.style.display = "none";
    paginacion.style.display = "flex";
}

// Función para obtener la cadena evolutiva
async function obtenerEvolucion(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.chain;
    } catch (error) {
        console.error("Error obteniendo evoluciones:", error);
        return null;
    }
}

// Función para extraer los nombres de la cadena evolutiva
function obtenerNombresEvolucion(chain) {
    const evoluciones = [];

    // Recorre recursivamente la cadena para recoger todas las especies
    function traverse(node) {
        if (!node) return;
        if (node.species && node.species.name) {
            evoluciones.push(node.species.name);
        }
        if (node.evolves_to && node.evolves_to.length > 0) {
            node.evolves_to.forEach(child => traverse(child));
        }
    }

    traverse(chain);

    // Eliminar duplicados por si acaso
    return Array.from(new Set(evoluciones));
}

function mostrarPagina(lista) {
    // Si ya tenemos datos cargados, ocultamos el loading
    if (todosLosPokemon.length > 0) {
        loading.style.display = "none";
    }

    const totalPaginas = Math.ceil(lista.length / pokemonPorPagina) || 1;

    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * pokemonPorPagina;
    const fin = paginaActual * pokemonPorPagina;
    const pokemonsPagina = lista.slice(inicio, fin);

    listaPokemon.innerHTML = "";
    pokemonsPagina.forEach(poke => mostrarPokemon(poke));

    document.querySelector("#num-pagina").textContent = `${paginaActual} / ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;

}

// Iniciar la carga de Pokémon cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', obtenerPokemon);

function mostrarPokemon(poke) {
    const div = document.createElement("div");
    div.classList.add("pokemon");

    let tiposHTML = "";

    if (poke.types.length === 1) {
        const tipo = poke.types[0].type.name;
        tiposHTML = `<p class="${tipo} tipo">${tipo.toUpperCase()}</p>`;
    } else if (poke.types.length === 2) {
        const tipo1 = poke.types[0].type.name;
        const tipo2 = poke.types[1].type.name;
        tiposHTML = `
        <p class="${tipo1} tipo">${tipo1.toUpperCase()}</p>
        <p class="${tipo2} tipo">${tipo2.toUpperCase()}</p>
        `;
    }

    div.innerHTML = `
    <p class="pokemon-id-back">#${poke.id.toString().padStart(3, "0")}</p>
    <div class="pokemon-imagen">
        <img loading="lazy" src="${poke.sprites.other["official-artwork"].front_default}"
            alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${poke.id}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tiposHTML}
        </div>
        <div class="pokemon-stats">
            <p class="stat">${poke.height}m</p>
            <p class="stat">${poke.weight}Kg</p>
        </div>
    </div>
    `;
    // Añadir evento de click
    div.addEventListener('click', () => {
        // Guardar el pokémon seleccionado en localStorage
        localStorage.setItem('selectedPokemon', JSON.stringify(poke));
        // Redirigir a la página de detalles
        window.location.href = 'pokemon.html';
    });

    listaPokemon.append(div);
}

botonesTipos.forEach(boton => {
    boton.addEventListener("click", (event) => {
        const tipoClicado = event.target.id || event.currentTarget.id;


        listaPokemon.innerHTML = "";
        loading.style.display = "flex";
        paginacion.style.display = "flex";

        if (tipoClicado === "see-all") {
            paginaActual = 1;
            listaActual = todosLosPokemon;
            mostrarPagina(listaActual);
            loading.style.display = "none";
            return;
        } else if (tipoClicado === "mini") {
            // Redirect to mini-game
            window.location.href = 'whois.html';
            return;
        } else if (tipoClicado === "random") {
            const randomPokemon = todosLosPokemon[Math.floor(Math.random() * todosLosPokemon.length)];
            mostrarPokemon(randomPokemon)
            loading.style.display = "none";
            paginacion.style.display = "none";
            return;
        }

        const pokemonFiltrados = todosLosPokemon.filter(poke =>
            poke.types.some(t => t.type.name === tipoClicado)
        );
        paginaActual = 1;
        listaActual = pokemonFiltrados;
        mostrarPagina(listaActual);
        paginacion.style.display = "flex";
        loading.style.display = "none";
    });
});

let puntos = 0;
setInterval(() => {
    puntos = (puntos + 1) % 4;
    const dots = ".".repeat(puntos);
    loadingText.textContent = "Loading Pokedex" + dots;
}, 300);

btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        mostrarPagina(listaActual);
    }
});

btnSiguiente.addEventListener("click", () => {
    paginaActual++;
    mostrarPagina(listaActual);
});

// Configuración del buscador
const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener("input", async () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === "") {
        listaActual = todosLosPokemon;
    } else {
        // Encontrar el Pokémon buscado
        const pokemonEncontrado = todosLosPokemon.find(pokemon => 
            pokemon.name.toLowerCase() === searchTerm
        );

        if (pokemonEncontrado) {
            loading.style.display = "flex"; // Solo mostramos loading al buscar evoluciones
            // Obtener la cadena evolutiva
            const evolutionChain = await obtenerEvolucion(pokemonEncontrado.evolution_chain_url);
            const nombresEvoluciones = obtenerNombresEvolucion(evolutionChain);
            loading.style.display = "none";
            
            // Filtrar todos los Pokémon que están en la cadena evolutiva
            listaActual = todosLosPokemon.filter(pokemon => 
                nombresEvoluciones.includes(pokemon.name)
            );
        } else {
            // Si no hay coincidencia exacta, mostrar sugerencias (sin loading)
            listaActual = todosLosPokemon.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm)
            );
        }
    }
    
    paginaActual = 1;
    mostrarPagina(listaActual);
});

// Añadir efecto de sonido al buscador
searchInput.addEventListener("focus", () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
});

// Botón junto al buscador que redirige al mini-juego 'whois'
const whoisBtn = document.querySelector('#whois-btn');
if (whoisBtn) {
    whoisBtn.addEventListener('click', () => {
        window.location.href = 'whois.html';
    });
}



// Reproducción de sonidos (delegación) para hover y click en toda la página
document.addEventListener('mouseover', (e) => {
    try {
        const el = e.target.closest('button, .pokemon, .btn-header, .btn-pag, .search-input');
        if (el && el !== _lastHoverEl) {
            _lastHoverEl = el;
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    } catch (err) {}
});

// reset last hovered when leaving the element (avoid stuck state)
document.addEventListener('mouseout', (e) => {
    try {
        const el = e.target.closest('button, .pokemon, .btn-header, .btn-pag, .search-input');
        if (el && _lastHoverEl && !el.contains(e.relatedTarget)) {
            _lastHoverEl = null;
        }
    } catch (err) {}
});

// Click sound on capture to play before other handlers
document.addEventListener('click', (e) => {
    try {
        const el = e.target.closest('button, .pokemon, .btn-header, .btn-pag, .search-input');
        if (el) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    } catch (err) {}
}, true);
