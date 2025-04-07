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


// Objeto para rastrear las teclas presionadas
const keysPressed = {};

// Evento para registrar cuando una tecla es presionada
document.addEventListener("keydown", (event) => {
    keysPressed[event.key] = true; // Marca la tecla como presionada
});

// Evento para registrar cuando una tecla es soltada
document.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false; // Marca la tecla como no presionada
});

// Función para mover a los jugadores
function movePlayers() {
    // Movimiento del jugador 1 (A y D)
    const character1 = document.getElementById("character1");
    const container = document.getElementById("espacioMaximo");
    const movementSpeed = 4;
    const containerWidth = container.offsetWidth;
    const character1Width = character1.offsetWidth;
    let leftPosition1 = character1.offsetLeft;

    if (keysPressed["a"] || keysPressed["A"]) {
        if (leftPosition1 - movementSpeed >= 0) {
            character1.style.left = `${leftPosition1 - movementSpeed}px`;
        }
    }
    if (keysPressed["d"] || keysPressed["D"]) {
        if (leftPosition1 + movementSpeed + character1Width <= containerWidth) {
            character1.style.left = `${leftPosition1 + movementSpeed}px`;
        }
    }

    // Movimiento del jugador 2 (Flechas izquierda y derecha)
    const character2 = document.getElementById("character2");
    const character2Width = character2.offsetWidth;
    let leftPosition2 = character2.offsetLeft;

    if (keysPressed["ArrowLeft"]) {
        if (leftPosition2 - movementSpeed >= 0) {
            character2.style.left = `${leftPosition2 - movementSpeed}px`;
        }
    }
    if (keysPressed["ArrowRight"]) {
        if (leftPosition2 + movementSpeed + character2Width <= containerWidth) {
            character2.style.left = `${leftPosition2 + movementSpeed}px`;
        }
    }

    // Llama a esta función en el siguiente frame
    requestAnimationFrame(movePlayers);
}

// Inicia el bucle de movimiento
movePlayers();
