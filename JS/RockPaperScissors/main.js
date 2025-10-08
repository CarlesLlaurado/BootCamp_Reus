var resultText = document.getElementById("result");
var player1Img = document.getElementById("player1-img");
var player2Img = document.getElementById("player2-img");
var options = ["rock", "paper", "scissors"];
var player1;
var player2;
var buttons = document.querySelectorAll('button');
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        resultText.textContent = "";
        player1 = options[Math.floor(Math.random() * options.length)];
        player2 = button.id;
        player1Img.src = "images/rock.png";
        player1Img.classList.add("shake");
        player2Img.src = "images/rock.png";
        player2Img.classList.add("shake2");
        setTimeout(function () {
            player1Img.classList.remove("shake");
            player2Img.classList.remove("shake2");
            player1Img.src = "images/".concat(player1, ".png");
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
        }, 1500);
    });
});
