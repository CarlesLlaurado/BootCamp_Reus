const toggle = document.querySelector(".toggle");
let estado = 1;

toggle.addEventListener("click", () => {
    if (estado === 3){
        estado = 1;
    } else {
        estado = estado + 1;
    }
    document.body.setAttribute("data-theme", estado);
});

const displayText = document.querySelector(".displaytext");

let display = "";
let operacion = [];

const teclas = document.querySelectorAll(".tecla");

teclas.forEach(tecla => {
    tecla.addEventListener("click", () => {
        const valor = tecla.textContent;
        
        if(valor === "RESET") {
            display = "";
            displayText.textContent = "0";
        }
        else if(valor === "DEL") {
            display = display.slice(0, -1);
            displayText.textContent = display || "0";
        }
        else if (valor === "+") {
            operacion.push(Number(display));
            operacion.push("+");
            display = "";
            displayText.textContent = "+";
        }
        else if (valor === "-") {
            operacion.push(Number(display));
            operacion.push("-");
            display = "";
            displayText.textContent = "-";
        }
        else if (valor === "/") {
            operacion.push(Number(display));
            operacion.push("/");
            display = "";
            displayText.textContent = "/";
        }
        else if (valor === "x") {
            operacion.push(Number(display))
            operacion.push("*");
            display = "";
            displayText.textContent = "x";
        }
        else if (valor === "=") {
            operacion.push(Number(display));

            let resultado = operacion[0];
            for (let i = 1; i < operacion.length; i += 2) {
                const operador = operacion[i];
                const siguiente = operacion[i + 1];

                if (operador === "+") resultado += siguiente;
                if (operador === "-") resultado -= siguiente;
                if (operador === "*") resultado *= siguiente;
                if (operador === "/") resultado /= siguiente;
            }
            resultado = parseFloat(resultado.toFixed(4));
            display = resultado.toString();
            displayText.textContent = display;
            operacion = [];
        }

        else {
            if (display.length >= 16) return;

            display += valor;
            displayText.textContent = display;
        }

    });
});



