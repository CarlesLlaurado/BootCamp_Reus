const toggle = document.querySelector(".toggle");

let estado = 1;

toggle.addEventListener("click", () => {
    if (estado === 3){
        estado = 1;
    } else {
        estado = estado + 1;
    }
    toggle.setAttribute("data-theme", estado);

    console.log(estado);
});

