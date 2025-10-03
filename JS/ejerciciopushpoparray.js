const emojis = ["😀","😂","🥳","😎","🤔","😴","😡","😇","😍","😭","🤯","🤩","🤮","😱","😅","😏","🙄","😬","🤡","👽"];

let pushbtn;
let unshiftbtn;
let insertatbtn;
let popbtn;
let shiftbtn;
let removeatbtn;

const arr = [];

const display = document.getElementById("displaytext");
const input = document.querySelector("#number1");
const input2 = document.querySelector("#number2");

function updateDisplay () {
    display.textContent = `[${arr}]`;
}

pushbtn = document.getElementById("push").addEventListener("click", pushfun);
unshiftbtn = document.getElementById("unshift").addEventListener("click", unshiftfun);
insertatbtn = document.getElementById("insertat").addEventListener("click", insertatfun);
popbtn = document.getElementById("pop").addEventListener("click", popfun);
shiftbtn = document.getElementById("shift").addEventListener("click", shiftfun);
removeatbtn = document.getElementById("removeat").addEventListener("click", removeatfun);


function pushfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.push(randomEmoji);
    updateDisplay();
}
function unshiftfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.unshift(randomEmoji);
    updateDisplay(); 
}
function insertatfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.splice(Number(input.value), 0, randomEmoji);
    updateDisplay(); 
}

function popfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.pop(randomEmoji);
    updateDisplay();
}
function shiftfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.shift(randomEmoji);
    updateDisplay(); 
}
function removeatfun() {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    arr.splice(Number(input2.value), 1,);
    updateDisplay(); 
}