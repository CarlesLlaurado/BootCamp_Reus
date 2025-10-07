var options = ["rock", "paper", "scissors"];
var player1 = options[Math.floor(Math.random() * options.length)];
var player2 = options[Math.floor(Math.random() * options.length)];
if (player1 === player2) {
    console.log("Player 1: ".concat(player1, " and Player2: ").concat(player2, ". IT'S A DRAW"));
}
else if (player1 === "rock" && player2 === "scissors" || player1 === "paper" && player2 === "rock" || player1 === "scissors" && player2 === "paper") {
    console.log("Player 1: ".concat(player1, " and Player2: ").concat(player2, ". Player1 WINS!!!"));
}
else {
    console.log("Player 1: ".concat(player1, " and Player2: ").concat(player2, ". Player2 WINS!!!"));
}
