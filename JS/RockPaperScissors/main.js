var resultText = document.getElementById("result");
var player1Img = document.getElementById("player1-img");
var player2Img = document.getElementById("player2-img");
var options = ["rock", "paper", "scissors"];
var player1;
var player2;
var buttons = document.querySelectorAll('button');
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        player1 = options[Math.floor(Math.random() * options.length)];
        player1Img.src = "images/".concat(player1, ".png");
        player2 = button.id;
        player2Img.src = "images/".concat(player2, ".png");
        if (player1 === player2) {
            resultText.textContent = "IT'S A TIE 👔";
        }
        else if ((player1 === "rock" && player2 === "scissors") ||
            (player1 === "paper" && player2 === "rock") ||
            (player1 === "scissors" && player2 === "paper")) {
            resultText.textContent = "🔴 RED WINS!!! 🔴";
        }
        else {
            resultText.textContent = "🔵 BLUE WINS!!! 🔵";
        }
    });
});
