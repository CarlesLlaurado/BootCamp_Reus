const suma = (num1, num2, num3) => {
    return num1 + num2 + num3;
}

console.log(suma(2,3,5));

const nombre = "Carles";
const apellido1 = "Llauradó";
const apellido2 = "Llauradó";

const saludar = (nombre, apellido1, apellido2) => {
    console.log(`Hola, ${nombre} ${apellido1} ${apellido2}!`);
}

saludar(nombre, apellido1, apellido2);


const num1 = 10;
const num2 = 6;

const isBigger = (num1, num2) => {
    if (num1 >= num2){
        return num1
    }
    else{
        return num2
    }
}

console.log(isBigger(num1, num2));