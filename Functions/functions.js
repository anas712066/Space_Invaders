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
    keysPressed[event.key] = false; // Marca la tecla como no presionada
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

            if (
                bulletRect.left < playerRect.right &&
                bulletRect.right > playerRect.left &&
                bulletRect.top < playerRect.bottom &&
                bulletRect.bottom > playerRect.top
            ) {
                // Colisión detectada: eliminar la bala y reducir vida del jugador
                bullet.remove();
                clearInterval(bulletInterval);
                console.log(`${player.id} ha sido golpeado!`);
                // Aquí puedes implementar lógica para reducir la vida del jugador
            }
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