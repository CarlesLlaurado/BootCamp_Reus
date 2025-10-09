const ruleta = document.getElementById("ruleta");
const centro = document.getElementById("centro");
const resultadoDiv = document.getElementById("resultado");

let currentRotation = 0;
let ultimoResultado = null; // guarda el último número y color

const sectores = [
  { num: 0, color: "green" },
  { num: 32, color: "red" },
  { num: 15, color: "black" },
  { num: 19, color: "red" },
  { num: 4, color: "black" },
  { num: 21, color: "red" },
  { num: 2, color: "black" },
  { num: 25, color: "red" },
  { num: 17, color: "black" },
  { num: 34, color: "red" },
  { num: 6, color: "black" },
  { num: 27, color: "red" },
  { num: 13, color: "black" },
  { num: 36, color: "red" },
  { num: 11, color: "black" },
  { num: 30, color: "red" },
  { num: 8, color: "black" },
  { num: 23, color: "red" },
  { num: 10, color: "black" },
  { num: 5, color: "red" },
  { num: 24, color: "black" },
  { num: 16, color: "red" },
  { num: 33, color: "black" },
  { num: 1, color: "red" },
  { num: 20, color: "black" },
  { num: 14, color: "red" },
  { num: 31, color: "black" },
  { num: 9, color: "red" },
  { num: 22, color: "black" },
  { num: 18, color: "red" },
  { num: 29, color: "black" },
  { num: 7, color: "red" },
  { num: 28, color: "black" },
  { num: 12, color: "red" },
  { num: 35, color: "black" },
  { num: 3, color: "red" },
  { num: 26, color: "black" },
];

// Gira la ruleta
centro.addEventListener("click", () => {
  // evitar múltiples clics
  centro.style.pointerEvents = "none";

  const vueltas = 1080 + Math.random() * 2520; // 3–10 vueltas
  const gradosPorSector = 360 / sectores.length;
  const desfaseSeguro =
    (0.2 + Math.random() * 0.6) * gradosPorSector - gradosPorSector / 2;

  const randomSpin = vueltas + desfaseSeguro;
  currentRotation += randomSpin;

  const duracion = 4 + Math.random() * 2;
  ruleta.style.transition = `transform ${duracion}s cubic-bezier(0.25, 1, 0.3, 1)`;
  ruleta.style.transform = `rotate(${currentRotation}deg)`;

  // Calcular resultado al final del giro
  setTimeout(() => {
    const finalAngle = ((currentRotation % 360) + 360) % 360;
    const resultado = detectarResultado(finalAngle);
    ultimoResultado = resultado; // guardamos el resultado
    mostrarResultado(resultado);

    // permitir nuevo giro después de mostrar mensaje
    setTimeout(() => {
      resultadoDiv.style.display = "none";
      centro.style.pointerEvents = "auto";
    }, 3500);
  }, duracion * 1000);
});

function detectarResultado(angle) {
  const anguloReal = (360 - angle) % 360;
  const gradosPorSector = 360 / sectores.length;
  const index = Math.floor(anguloReal / gradosPorSector) % sectores.length;
  return sectores[index];
}

function mostrarResultado({ num, color }) {
  resultadoDiv.textContent = `🎯 ${num} (${color.toUpperCase()}) 🎯`;
  resultadoDiv.style.display = "flex";
  resultadoDiv.style.justifyContent = "center";
  resultadoDiv.style.alignItems = "center";
  resultadoDiv.style.position = "fixed";
  resultadoDiv.style.top = "0";
  resultadoDiv.style.left = "0";
  resultadoDiv.style.width = "100%";
  resultadoDiv.style.height = "100%";
  resultadoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  resultadoDiv.style.fontSize = "80px";
  resultadoDiv.style.fontWeight = "bold";
  resultadoDiv.style.zIndex = "10";
  resultadoDiv.style.textAlign = "center";
  resultadoDiv.style.color =
    color === "red" ? "red" : color === "black" ? "black" : "lime";
  resultadoDiv.style.textShadow = "3px 3px 10px white";
}


// --- Generar los números visuales alrededor de la ruleta ---
const numerosDiv = document.querySelector(".numeros");
const totalSectores = sectores.length;
const radio = 230; // distancia desde el centro al texto (ajusta según gusto)

sectores.forEach((sector, i) => {
  const angulo = (360 / totalSectores) * i + (360 / totalSectores) / 2; // centra el número
  const x = 250 + radio * Math.cos((angulo * Math.PI) / 180);
  const y = 250 + radio * Math.sin((angulo * Math.PI) / 180);

  const numDiv = document.createElement("div");
  numDiv.classList.add("numero");
  numDiv.textContent = sector.num;
  numDiv.style.left = `${x - 20}px`; // centrado horizontal
  numDiv.style.top = `${y - 20}px`; // centrado vertical
  numDiv.style.transform = `rotate(${angulo + 90}deg)`; // orienta hacia el borde

  // color del texto según el color del sector
  numDiv.style.color =
    sector.color === "red"
      ? "red"
      : sector.color === "black"
      ? "black"
      : "lime";

  numerosDiv.appendChild(numDiv);
});