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
            display += "+";
            displayText.textContent = display;
        }
        else if (valor === "-") {
            display += "-";
            displayText.textContent = display;
        }

        else {
            if (display.length >= 17) return;

            display += valor;
            displayText.textContent = display;
        }

    });
});



