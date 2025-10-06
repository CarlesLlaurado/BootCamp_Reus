function updateAllBarColors () {
    const bars = document.querySelectorAll(".greenbar");

    bars.forEach(function(bar) {
        
        let widthStr = bar.style.width;

        if (!widthStr) return;

        const percent = parseFloat(widthStr);

        if (width < 20) {
            bar.style.backgroundColor = "red";
        } else if (width < 50) {
            bar.style.backgroundColor = "yellow";
        } else {
            bar.style.backgroundColor = "green";
        }
    });
}



let hunger = 100;

const eatBar = document.getElementById("eat-bar");
const eatText = document.getElementById("eat-text");
const eatButton = document.getElementById("eat-btn")

function updateHungerBar() {
    eatBar.style.width = hunger + '%';
    eatText.textContent = `${hunger}% Fun`;
}

function decreaseHunger(){
    if (hunger > 0){
        hunger -= 15;
        updateHungerBar();
    } else{
        clearInterval(hungerInterval);
    }
}

function feed() {
    eatButton.addEventListener("click",() => {
        hunger += 5;
        updateHungerBar();
    })
    
}

const hungerInterval = setInterval(decreaseHunger, 2000);

updateHungerBar();
feed();
updateAllBarColors();

