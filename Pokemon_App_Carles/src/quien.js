// --- CONFIGURACIÓN BÁSICA ---
const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const NUMERO_POKEMON = parseInt(localStorage.getItem("NUMERO_POKEMON"));
const hoverSound = new Audio("../sounds/hover.wav");
const clickSound = new Audio("../sounds/click.wav");
hoverSound.preload = "auto";
clickSound.preload = "auto";

// --- OBTENER POKÉMON ALEATORIO ---
async function getRandomPokemon() {
    const id = Math.floor(Math.random() * NUMERO_POKEMON) + 1;
    const res = await fetch(`${API_URL}${id}`);
    return await res.json();
}

// --- INICIALIZAR JUEGO ---
async function initGame() {
    const loading = document.getElementById("loading");
    const loadingText = document.querySelector(".loading-text");
    const image = document.getElementById("whatis-image");
    const input = document.getElementById("guessInput");
    const button = document.getElementById("checkButton");
    const feedback = document.getElementById("feedback");
    const playAgain = document.getElementById("playAgain");
    const back = document.getElementById("backToList");
    const changePokemon = document.getElementById("changePokemon");

    if (loading) {
        loading.style.display = "flex";
    }

    if (loadingText) {
        let puntos = 0;
        setInterval(() => {
            puntos = (puntos + 1) % 4;
            loadingText.textContent = "Cargando Pokédex" + ".".repeat(puntos);
        }, 300);
    }

    feedback.textContent = "";
    feedback.style.color = "";
    feedback.classList.remove("error");

    changePokemon.onclick = () => window.location.reload();

    // Permitir usar la tecla Enter para comprobar
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            button.click(); // Simula clic en "Comprobar"
        }
    });

    // Mostrar imagen oscurecida sin parpadeo
    image.style.filter = "brightness(0)"; // aplica primero el negro
    image.style.transition = "none"; // desactiva la animación temporalmente
    image.style.visibility = "hidden"; // oculta hasta que cargue la imagen

    let pokemon;
    try {
        pokemon = await getRandomPokemon();
    } catch (error) {
        if (loading) {
            loading.style.display = "none";
        }
        feedback.textContent = "No se pudo cargar el Pokémon. Recarga la página.";
        feedback.style.color = "red";
        return;
    }

    const newImage = new Image();
    newImage.src = pokemon.sprites.other["official-artwork"].front_default;
    newImage.onload = () => {
        image.src = newImage.src;
        image.style.visibility = "visible";
        // una vez cargada, se reactiva la transición (para el momento de acertar)
        setTimeout(() => {
            image.style.transition = "filter 0.5s";
        }, 50);
        if (loading) {
            loading.style.display = "none";
        }
    };
    newImage.onerror = () => {
        if (loading) {
            loading.style.display = "none";
        }
        feedback.textContent = "Error cargando la imagen. Inténtalo de nuevo.";
        feedback.style.color = "red";
    };

    const normalizedName = pokemon.name.toLowerCase();
    let hintIndex = 1;

    // Al hacer clic en "Comprobar"
    button.onclick = () => {
        const guess = input.value.trim().toLowerCase();

        if (guess === normalizedName) {
            // Acierto
            image.style.filter = "none";
            feedback.textContent = `🎉 ¡Correcto! Es ${pokemon.name.toUpperCase()} 🎉`;
            feedback.style.color = "green";
            showConfetti();
            playAgain.style.display = "inline-block";
            button.disabled = true;
            input.disabled = true;
            changePokemon.style.display = "none";
        } else {
            // Fallo con animación
            feedback.textContent = "❌ Incorrecto, inténtalo otra vez";
            feedback.style.color = "red";
            feedback.classList.remove("error");
            void feedback.offsetWidth; // Reinicia animación
            feedback.classList.add("error");
            if (hintIndex <= normalizedName.length) {
                // Revela progresivamente el nombre correcto en el input
                input.value = pokemon.name.slice(0, hintIndex);
                hintIndex += 1;
                input.focus();
                const end = input.value.length;
                input.setSelectionRange(end, end);
            }
        }
    };

    // "Jugar de nuevo"
    playAgain.onclick = () => window.location.reload();

    // "Volver"
    back.onclick = () => (window.location.href = "index.html");
}

// --- ANIMACIÓN DE CONFETI ---
function showConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
        const colors = ["#ff0", "#0ff", "#f0f", "#f00", "#0f0", "#00f"];
        const confetti = document.createElement("div");
        confetti.textContent = "🎊";
        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "0";
        confetti.style.fontSize = "20px";
        confetti.style.animation = "fall 2s linear";
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

// --- SONIDOS (hover + click) ---
document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("button, input");
    if (el) {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
});

document.addEventListener(
    "click",
    (e) => {
        const el = e.target.closest("button, input");
        if (el) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    },
    true
);

// --- INICIO ---
initGame();
