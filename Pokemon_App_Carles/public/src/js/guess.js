const API_BASE = 'https://pokeapi.co/api/v2';

let currentPokemon = null;

function normalizeName(name){
  return name.trim().toLowerCase();
}

async function pickRandomPokemon(){
  // get the full list and choose a random one
  const listResp = await fetch(`${API_BASE}/pokemon?limit=100000`);
  const listJson = await listResp.json();
  const results = listJson.results;
  const idx = Math.floor(Math.random() * results.length);
  const entry = results[idx];
  const pokeResp = await fetch(entry.url);
  const poke = await pokeResp.json();
  return poke;
}

function showSilhouette(imgEl, imageUrl){
  imgEl.src = imageUrl;
  imgEl.classList.add('silhouette');
  imgEl.parentElement.classList.remove('revealed');
}

function revealPokemon(imgEl){
  imgEl.classList.remove('silhouette');
  imgEl.parentElement.classList.add('revealed');
}

function showMessage(text, color='black'){
  const msg = document.getElementById('guessMessage');
  msg.textContent = text;
  msg.style.color = color;
}

function clearConfetti(){
  const wrap = document.getElementById('confettiWrapper');
  wrap.innerHTML = '';
}

function launchConfetti(){
  const wrap = document.getElementById('confettiWrapper');
  clearConfetti();
  const colors = ['#ff3b30','#ff9500','#ffcc00','#34c759','#007aff','#5856d6','#ff2d55'];
  const pieces = 40;
  for(let i=0;i<pieces;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.left = (20 + Math.random()*60) + '%';
    el.style.top = (-10 - Math.random()*20) + 'vh';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.animationDelay = (Math.random()*200) + 'ms';
    wrap.appendChild(el);
  }
  // remove after animation
  setTimeout(()=> clearConfetti(), 1600);
}

async function loadNew(){
  const imgEl = document.getElementById('pokemonSilhouette');
  const input = document.getElementById('guessInput');
  input.value = '';
  showMessage('');
  clearConfetti();
  try{
    const poke = await pickRandomPokemon();
    currentPokemon = poke;
    const art = poke.sprites?.other?.['official-artwork']?.front_default || poke.sprites?.front_default || '';
    showSilhouette(imgEl, art);
    // store actual name in dataset for quick access
    imgEl.dataset.pokename = poke.name;
  }catch(err){
    console.error(err);
    showMessage('Error cargando Pokémon', 'crimson');
  }
}

function handleGuess(){
  const input = document.getElementById('guessInput');
  const val = normalizeName(input.value || '');
  if(!currentPokemon) return;
  const target = normalizeName(currentPokemon.name);
  const imgEl = document.getElementById('pokemonSilhouette');
  if(val === target){
    // correct
    revealPokemon(imgEl);
    showMessage(`¡Correcto! Es ${currentPokemon.name.toUpperCase()}`, 'green');
    launchConfetti();
    input.disabled = true;
    document.getElementById('guessBtn').disabled = true;
  } else {
    showMessage('No es correcto, inténtalo otra vez', 'crimson');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const guessBtn = document.getElementById('guessBtn');
  const input = document.getElementById('guessInput');
  const newBtn = document.getElementById('newRand');

  guessBtn.addEventListener('click', handleGuess);
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') handleGuess();
  });
  newBtn.addEventListener('click', async ()=>{
    document.getElementById('guessInput').disabled = false;
    document.getElementById('guessBtn').disabled = false;
    await loadNew();
  });

  // initial load
  loadNew();
});
