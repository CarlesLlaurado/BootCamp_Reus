const listaPokemon = document.querySelector<HTMLDivElement>("#listaPokemon");
let URL: string = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1;  i <= 151; i++){
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => console.log(data))
}

function mostrarPokemon(data){

}