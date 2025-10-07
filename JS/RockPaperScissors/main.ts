const resultText = document.getElementById("result") as HTMLParagraphElement;
const player1Img = document.getElementById("player1-img") as HTMLImageElement;
const player2Img = document.getElementById("player2-img") as HTMLImageElement;

const options = ["rock", "paper", "scissors"] as const;
type Choice = typeof options[number];

let player1: Choice;
let player2: Choice;

const buttons = document.querySelectorAll<HTMLButtonElement>('button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        player1 = options[Math.floor(Math.random() * options.length)];
        player1Img.src = `images/${player1}.png`;
        player2 = button.id as Choice;
        player2Img.src = `images/${player2}.png`;

        if (player1 === player2) {
            resultText.textContent = "IT'S A TIE 👔";
        }
        else if (
            (player1 === "rock" && player2 === "scissors") ||
            (player1 === "paper" && player2 === "rock") ||
            (player1 === "scissors" && player2 === "paper")
        ) {
            resultText.textContent = "🔴 RED WINS!!! 🔴";
        }
        else {
            resultText.textContent = "🔵 BLUE WINS!!! 🔵";
        }
    })
});