//Moviment Player1
const player1 = document.getElementById("player1") ;
let position = 0;


// Contador eliminaciones
let killsp1 = 0;
let killsp2 = 0;

// Sumar kills player1
function sumarKillP1(){
    killsp2 += 1;
    document.querySelector("#killsPlayer1").innerHTML = killsp1;
}

// Sumar kills player2
function sumarKillP2() {
    killsp1 += 1;
    document.querySelector("#killsPlayer2").innerHTML = killsp2;
}

// Movimiento Player1

document.addEventListener("keydown", (event) => {
    const character = document.getElementById("character");
    const container = document.getElementById("container");
    let leftPosition = character.offsetLeft;

    const movementSpeed = 10; // Ajusta la velocidad del movimiento

    if (event.key === "a" || event.key === "A") {
        character.style.left = `${leftPosition - movementSpeed}px`;
    } else if (event.key === "d" || event.key === "D") {
        character.style.left = `${leftPosition + movementSpeed}px`;
    }
});


// Detectar teclas
//function pressRight (event){
   
    //alert('Respuesta a la tecla ${event.key}');
        
//}