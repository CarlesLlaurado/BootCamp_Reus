const options = ["rock", "paper", "scissors"] as const;
type Choice = typeof options[number];

let player1: Choice = options[Math.floor(Math.random()* options.length)];
let player2: Choice = document.getElementById("")

if (player1 === player2){
    console.log(`Player 1: ${player1} and Player2: ${player2}. IT'S A DRAW`);
}
else if(player1 === "rock" && player2 === "scissors" || player1 === "paper" && player2 === "rock" || player1 === "scissors" && player2 === "paper") {
    console.log(`Player 1: ${player1} and Player2: ${player2}. Player1 WINS!!!`)
}
else{
    console.log(`Player 1: ${player1} and Player2: ${player2}. Player2 WINS!!!`)
}