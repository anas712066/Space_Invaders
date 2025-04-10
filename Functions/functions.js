
// Contador eliminaciones
let killsp1 = 0;
let killsp2 = 0;

document.querySelector("#killsPlayer1").innerHTML = killsp1;
document.querySelector("#killsPlayer2").innerHTML = killsp2;

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

function OnEnemyDestroyed(playerId) {
    //Auenmtar el puntaje del jugador correspondiente
    if (playerId === "character1") {
        sumarKillP1();
    } else if (playerId === "character2") {
        sumarKillP2();
    }
}


// Objeto para rastrear las teclas presionadas
const keysPressed = {};
const keysFired = {}; // Objeto para rastrear si ya se disparó con una tecla

// Evento para registrar cuando una tecla es presionada
document.addEventListener("keydown", (event) => {
    if (!keysPressed[event.key]) {
        keysPressed[event.key] = true; // Marca la tecla como presionada

        // Disparo del jugador 1 con la tecla "W"
        if (event.key === "w" || event.key === "W") {
            if (!keysFired["w"]) {
                shootBullet("character1");
                keysFired["w"] = true; // Marca que ya se disparó con esta tecla
            }
        }

        // Disparo del jugador 2 con la tecla "Flecha Arriba"
        if (event.key === "ArrowUp") {
            if (!keysFired["ArrowUp"]) {
                shootBullet("character2");
                keysFired["ArrowUp"] = true; // Marca que ya se disparó con esta tecla
            }
        }
    }
});

// Evento para registrar cuando una tecla es soltada
document.addEventListener("keyup", (event) => {
    keysPressed[event.key] = false; // Marca la   tecla como no presionada
    keysFired[event.key] = false; // Permite disparar nuevamente cuando se suelte la tecla
});

// Función para disparar una bala
function shootBullet(playerId) {
    const player = document.getElementById(playerId);

    // Crear la bala como un elemento <img>
    const bullet = document.createElement("img");
    bullet.src = "Images/Projectiles/missile_1.png"; // Ruta de la imagen de la bala
    bullet.className = "bullet";
    bullet.style.position = "absolute";
    bullet.style.width = "10px";
    bullet.style.height = "20px";

    // Posicionar la bala en el centro del jugador
    const playerRect = player.getBoundingClientRect();
    bullet.style.left = `${playerRect.left + playerRect.width / 2 - 5}px`;
    bullet.style.top = `${playerRect.top - 20}px`;

    // Agregar la bala al body
    document.body.appendChild(bullet);

    // Mover la bala hacia arriba y detectar colisiones
    const bulletInterval = setInterval(() => {
        const bulletTop = parseInt(bullet.style.top);

        // Detectar colisión con enemigos
        const enemies = document.querySelectorAll(".enemy"); // Selecciona todos los enemigos
        enemies.forEach((enemy) => {
            const enemyRect = enemy.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                // Colisión detectada: eliminar la bala y el enemigo
                bullet.remove();
                enemy.remove();
                clearInterval(bulletInterval);
            }
        });

        // Si la bala sale de la pantalla, eliminarla
        if (bulletTop <= 0) {
            bullet.remove();
            clearInterval(bulletInterval);
        } else {
            bullet.style.top = `${bulletTop - 10}px`; // Velocidad de la bala
        }
    }, 30); // Intervalo de movimiento
}

function enemyShoot(enemy) {
    // Crear la bala como un elemento <img>
    const bullet = document.createElement("img");
    bullet.src = "Images/Projectiles/ProjectileA_1.png"; // Ruta de la imagen del proyectil enemigo
    bullet.className = "enemy-bullet";
    bullet.style.position = "absolute";
    bullet.style.width = "10px";
    bullet.style.height = "20px";

    // Posicionar la bala en el centro del enemigo
    const enemyRect = enemy.getBoundingClientRect();
    bullet.style.left = `${enemyRect.left + enemyRect.width / 2 - 5}px`;
    bullet.style.top = `${enemyRect.bottom}px`;

    // Agregar la bala al body
    document.body.appendChild(bullet);

    // Mover la bala hacia abajo y detectar colisiones
    const bulletInterval = setInterval(() => {
        const bulletTop = parseInt(bullet.style.top);

        // Detectar colisión con los jugadores
        const players = [document.getElementById("character1"), document.getElementById("character2")];
        players.forEach((player) => {
            const playerRect = player.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();
                detectarColisionConBala(player, bullet); // Llama a la función de detección de colisión
        });

        // Si la bala sale de la pantalla, eliminarla
        if (bulletTop >= window.innerHeight) {
            bullet.remove();
            clearInterval(bulletInterval);
        } else {
            bullet.style.top = `${bulletTop + 10}px`; // Velocidad de la bala
        }
    }, 30); // Intervalo de movimiento
}

// Función para que los enemigos disparen aleatoriamente
function startEnemyShooting() {
    const enemies = document.querySelectorAll(".enemy"); // Selecciona todos los enemigos

    // Almacena el identificador del intervalo
    const shootingInterval = setInterval(() => {
        const currentEnemies = document.querySelectorAll(".enemy"); // Verifica los enemigos actuales

        if (currentEnemies.length > 0) {
            // Selecciona un enemigo aleatorio
            const randomEnemy = currentEnemies[Math.floor(Math.random() * currentEnemies.length)];
            enemyShoot(randomEnemy); // Hace que el enemigo seleccionado dispare
        } else {
            // Si no hay enemigos, detén el intervalo
            clearInterval(shootingInterval);
            console.log("Todos los enemigos han sido eliminados. Los disparos se detienen.");
        }
    }, 3000); // Intervalo de disparo (cada 3 segundos)
}

// Llamar a la función para iniciar los disparos de enemigos
startEnemyShooting();

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


//PlayerLives
let player1Lives = 3;
let player2Lives = 3;

// Función para actualizar las imágenes de las vidas
function actualizarVidas(jugadorId, vidasRestantes) {
    const contenedorVidas = document.getElementById(jugadorId);
    const corazones = contenedorVidas.querySelectorAll(".vida");

    corazones.forEach((corazon, index) => {
        if (index < vidasRestantes) {
            corazon.src = "Images/PlayerLives/heart1.png"; // Corazón lleno
        } else {
            corazon.src = "Images/PlayerLives/heart2.png"; // Corazón vacío
        }
    });
}

// Función para manejar la pérdida de vida
function perderVida(jugador) {
    if (jugador.id === "character1") {
        player1Lives--;
        console.log(`Player 1 Lives: ${player1Lives}`);
        actualizarVidas("player1Lives", player1Lives);

        if (player1Lives <= 0) {
            console.log("Player 1 ha perdido!");
            // Aquí puedes implementar lógica para finalizar el juego
        }
    } else if (jugador.id === "character2") {
        player2Lives--;
        console.log(`Player 2 Lives: ${player2Lives}`);
        actualizarVidas("player2Lives", player2Lives);

        if (player2Lives <= 0) {
            console.log("Player 2 ha perdido!");
            // Aquí puedes implementar lógica para finalizar el juego
        }
    }
}

// Ejemplo de integración con colisión
function detectarColisionConBala(jugador, bala) {
    const jugadorRect = jugador.getBoundingClientRect();
    const balaRect = bala.getBoundingClientRect();

    if (
        jugadorRect.left < balaRect.right &&
        jugadorRect.right > balaRect.left &&
        jugadorRect.top < balaRect.bottom &&
        jugadorRect.bottom > balaRect.top
    ) {
        // Reducir la vida del jugador
        perderVida(jugador);

        // Eliminar la bala del juego
        bala.remove();
    }
}