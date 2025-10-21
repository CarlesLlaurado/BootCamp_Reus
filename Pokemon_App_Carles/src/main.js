const listaPokemon = document.querySelector("#listaPokemon");
const botonesTipos = document.querySelectorAll(".btn-header");
const NUMERO_POKEMON = 1025;

const loadingText = document.querySelector(".loading-text");
const loading = document.querySelector("#loading");
const paginacion = document.querySelector("#paginacion");

const todosLosPokemon = [];

let URL = "https://pokeapi.co/api/v2/pokemon/";

async function obtenerPokemon() {
    loading.style.display = "flex";
    paginacion.style.display = "none";
    const pokemons = [];

    for (let i = 1; i <= NUMERO_POKEMON; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();
        pokemons.push(data);
    }
    todosLosPokemon.push(...pokemons);

    pokemons.forEach(poke => mostrarPokemon(poke));

    loading.style.display = "none";
    paginacion.style.display = "flex";
}


obtenerPokemon();

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
        <img src="${poke.sprites.other["official-artwork"].front_default}"
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
    listaPokemon.append(div);
}

botonesTipos.forEach(boton => {
    boton.addEventListener("click", (event) => {
        const tipoClicado = event.target.id;
        

        listaPokemon.innerHTML = "";
        loading.style.display = "flex";

        if (tipoClicado === "see-all") {
            todosLosPokemon.forEach(poke => mostrarPokemon(poke));
            loading.style.display = "none";
            return;
        } else if(tipoClicado === "random") {
            const randomPokemon = todosLosPokemon[Math.floor(Math.random() * todosLosPokemon.length)];
            mostrarPokemon(randomPokemon)
            loading.style.display = "none";
            return;
        }

        const pokemonFiltrados = todosLosPokemon.filter(poke => poke.types.some(t => t.type.name === tipoClicado));

        pokemonFiltrados.forEach(poke => mostrarPokemon(poke));
        loading.style.display = "none";
    });
});

let puntos = 0;
setInterval(() => {
    puntos = (puntos + 1) % 4;
    const dots = ".".repeat(puntos);
    loadingText.textContent = "Loading Pokedex" + dots;
}, 300);




