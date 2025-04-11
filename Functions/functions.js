// Contador eliminaciones
let killsp1 = 0;
let killsp2 = 0;

// Sumar kills para el jugador 1
function sumarKillP1() {
    killsp1 += 2; // Incrementar las kills del jugador 1
    document.querySelector("#killsPlayer1").innerHTML = killsp1; // Actualizar el DOM

    // Verificar si el jugador 1 ha alcanzado 200 puntos
    if (killsp1 === 200) {
        mostrarWinner("PLAYER 1 WINNER!");
    }
}

// Sumar kills para el jugador 2
function sumarKillP2() {
    killsp2 += 2; // Incrementar las kills del jugador 2
    document.querySelector("#killsPlayer2").innerHTML = killsp2; // Actualizar el DOM

    // Verificar si el jugador 2 ha alcanzado 200 puntos
    if (killsp2 === 200) {
        mostrarWinner("PLAYER 2 WINNER!");
    }
}

function OnEnemyDestroyed(playerId) {
    // Incrementar el puntaje del jugador correspondiente
    if (playerId === "character1") {
        sumarKillP1();
    } else if (playerId === "character2") {
        sumarKillP2();
    }
}

let enemyOffset = 0;
let enemyDirection = 1;
let enemyMaxOffset = 350; // se moverán ±50px del centro
let enemySpeed = 1;

function moverEnemigos() {
    enemyOffset += enemyDirection * enemySpeed;

    if (enemyOffset >= enemyMaxOffset || enemyOffset <= -enemyMaxOffset) {
        enemyDirection *= -1;
    }

    const filas = document.querySelectorAll(".mh-enemigos");

    filas.forEach(fila => {
        const enemigos = fila.querySelectorAll(".enemy");
        enemigos.forEach(enemy => {
            enemy.style.transform = `translateX(${enemyOffset}px)`;
        });
    });

    requestAnimationFrame(moverEnemigos);
}

moverEnemigos();

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

function eliminarEnemigo(index) {
    const slot = document.querySelector(`.enemy-slot[data-index="${index}"]`);
    const img = slot?.querySelector('img');
    if (img) img.remove();
  }
  
  function revivirEnemigo(index) {
    const slot = document.querySelector(`.enemy-slot[data-index="${index}"]`);
    if (slot && !slot.querySelector('img')) {
      const img = document.createElement('img');
      img.className = 'enemy';
      img.src = 'Images/InvadersImages/invaders1.gif';
      img.alt = 'invaders';
      slot.appendChild(img);
    }
  }

  function respawnEnemy() {
    // Obtener todos los slots vacíos
    const emptySlots = Array.from(document.querySelectorAll(".enemy-slot"))
        .filter(slot => !slot.querySelector("img"));

    if (emptySlots.length === 0) return; // Nada que hacer si están todos ocupados

    // Elegir un slot vacío al azar
    const randomIndex = Math.floor(Math.random() * emptySlots.length);
    const randomSlot = emptySlots[randomIndex];

    // Crear nuevo enemigo
    const newEnemy = document.createElement("img");
    newEnemy.src = "Images/InvadersImages/invaders1.gif";
    newEnemy.alt = "invaders";
    newEnemy.className = "sperate-gif enemy";
    newEnemy.width = 30;
    newEnemy.height = 25;

    // Insertarlo en el slot aleatorio
    randomSlot.appendChild(newEnemy);
}

// Llamarlo cada cierto tiempo
setInterval(respawnEnemy, 1900); // Cada 1.2 segundos revive uno aleatorio
  

// Función para disparar una bala
function shootBullet(playerId) {
    if (gameOver) return; // Detener disparos si el juego ha terminado

    const player = document.getElementById(playerId);

    // Crear la bala como un elemento <img>
    const bullet = document.createElement("img");
    bullet.src = "Images/Projectiles/missile_1.png"; // Ruta de la imagen de la bala
    bullet.className = "bullet";
    bullet.style.position = "absolute";
    bullet.style.width = "10px";
    bullet.style.height = "20px";

    // Agregar un atributo para identificar al jugador que disparó
    bullet.dataset.playerId = playerId;

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

                crearExplosion(enemy);
                // Colisión detectada: eliminar la bala y el enemigo
                bullet.remove();
                enemy.remove();
                clearInterval(bulletInterval);

                // Incrementar las kills del jugador que disparó
                OnEnemyDestroyed(bullet.dataset.playerId);
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

function crearExplosion(enemigo) {
    const explosion = document.createElement("img");
    explosion.src = "Images/Explosion/enemy_explosion.gif"; // Asegúrate que la ruta sea correcta
    explosion.className = "explosion";
    explosion.style.position = "absolute";
    explosion.style.width = "50px";
    explosion.style.height = "50px";
    explosion.style.zIndex = "99";
    explosion.style.pointerEvents = "none";

    const enemyRect = enemigo.getBoundingClientRect();

    explosion.style.left = `${enemyRect.left + window.scrollX}px`;
    explosion.style.top = `${enemyRect.top + window.scrollY}px`;

    document.body.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 500); // Ajusta según la duración del gif
}

// Función para que los enemigos disparen

function enemyShoot(enemy) {
    if (gameOver) return; // Detener disparos si el juego ha terminado

    const bullet = document.createElement("img");
    bullet.src = "Images/Projectiles/ProjectileA_1.png";
    bullet.className = "enemy-bullet";
    bullet.style.position = "absolute";
    bullet.style.width = "10px";
    bullet.style.height = "20px";

    const enemyRect = enemy.getBoundingClientRect();
    bullet.style.left = `${enemyRect.left + enemyRect.width / 2 - 5}px`;
    bullet.style.top = `${enemyRect.bottom}px`;

    document.body.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        const bulletTop = parseInt(bullet.style.top);

        const players = [document.getElementById("character1"), document.getElementById("character2")];
        players.forEach((player) => {
            if (!player) return; // Verifica si el jugador aún existe
            const playerRect = player.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();
            detectarColisionConBala(player, bullet);
        });

        if (bulletTop >= window.innerHeight) {
            bullet.remove();
            clearInterval(bulletInterval);
        } else {
            bullet.style.top = `${bulletTop + 10}px`;
        }
    }, 30);
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
    if (gameOver) return; // Detener el movimiento si el juego ha terminado

    const movementSpeed = 4; // Velocidad de movimiento de los jugadores
    const container = document.getElementById("espacioMaximo");
    if (!container) {
        console.error("El contenedor 'espacioMaximo' no existe.");
        return;
    }

    // Movimiento del jugador 1 (A y D)
    const character1 = document.getElementById("character1");
    if (character1) {
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
    }

    // Movimiento del jugador 2 (Flechas izquierda y derecha)
    const character2 = document.getElementById("character2");
    if (character2) {
        const containerWidth = container.offsetWidth;
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
    }

    // Llama a esta función en el siguiente frame
    requestAnimationFrame(movePlayers);
}

//PlayerLives
let player1Lives = 5;
let player2Lives = 5;

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

let gameOver = false; // Indica si el juego ha terminado

// Función para mostrar el cuadro de "GAME OVER"
function mostrarGameOver(mensaje) {
    gameOver = true; // Detener todas las acciones del juego

    // Crear el contenedor del cuadro
    const gameOverContainer = document.createElement("div");
    gameOverContainer.id = "gameOverContainer";
    gameOverContainer.style.position = "fixed";
    gameOverContainer.style.top = "50%";
    gameOverContainer.style.left = "50%";
    gameOverContainer.style.transform = "translate(-50%, -50%)";
    gameOverContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    gameOverContainer.style.color = "white";
    gameOverContainer.style.padding = "50px";
    gameOverContainer.style.textAlign = "center";
    gameOverContainer.style.border = "3px solid white";
    gameOverContainer.style.borderRadius = "10px";
    gameOverContainer.style.zIndex = "1000";

    // Agregar el mensaje de "GAME OVER"
    const gameOverText = document.createElement("h1");
    gameOverText.textContent = "GAME OVER";
    gameOverText.style.fontFamily = "'Press Start 2P', cursive";
    gameOverText.style.marginBottom = "20px";

    // Agregar el mensaje del ganador
    const winnerText = document.createElement("p");
    winnerText.textContent = mensaje;
    winnerText.style.fontFamily = "'Press Start 2P', cursive";
    winnerText.style.fontSize = "20px";
    winnerText.style.marginBottom = "20px";

    // Agregar el mensaje para reiniciar la partida
    const restartText = document.createElement("p");
    restartText.textContent = "Pulsa F5 para reiniciar la partida";
    restartText.style.fontFamily = "'Press Start 2P', cursive";
    restartText.style.fontSize = "16px";
    restartText.style.color = "lightgray";

    // Agregar los elementos al contenedor
    gameOverContainer.appendChild(gameOverText);
    gameOverContainer.appendChild(winnerText);
    gameOverContainer.appendChild(restartText);

    // Agregar el contenedor al body
    document.body.appendChild(gameOverContainer);
}

// Funcion mostrar ganador
function mostrarWinner(mensaje) {
    gameOver = true; // Detener todas las acciones del juego

    // Crear el contenedor del cuadro
    const winnerContainer = document.createElement("div");
    winnerContainer.id = "winnerContainer";
    winnerContainer.style.position = "fixed";
    winnerContainer.style.top = "50%";
    winnerContainer.style.left = "50%";
    winnerContainer.style.transform = "translate(-50%, -50%)";
    winnerContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    winnerContainer.style.color = "white";
    winnerContainer.style.padding = "50px";
    winnerContainer.style.textAlign = "center";
    winnerContainer.style.border = "3px solid white";
    winnerContainer.style.borderRadius = "10px";
    winnerContainer.style.zIndex = "1000";

    // Agregar el mensaje de "WINNER"
    const winnerText = document.createElement("h1");
    winnerText.textContent = "WINNER!";
    winnerText.style.fontFamily = "'Press Start 2P', cursive";
    winnerText.style.marginBottom = "20px";

    // Agregar el mensaje del ganador
    const playerText = document.createElement("p");
    playerText.textContent = mensaje;
    playerText.style.fontFamily = "'Press Start 2P', cursive";
    playerText.style.fontSize = "20px";
    playerText.style.marginBottom = "20px";

    // Agregar el mensaje para reiniciar la partida
    const restartText = document.createElement("p");
    restartText.textContent = "Pulsa F5 para reiniciar la partida";
    restartText.style.fontFamily = "'Press Start 2P', cursive";
    restartText.style.fontSize = "16px";
    restartText.style.color = "lightgray";

    // Agregar los elementos al contenedor
    winnerContainer.appendChild(winnerText);
    winnerContainer.appendChild(playerText);
    winnerContainer.appendChild(restartText);

    // Agregar el contenedor al body
    document.body.appendChild(winnerContainer);
}

// Función para manejar la pérdida de vida
function perderVida(jugador) {
    if (jugador.id === "character1") {
        player1Lives--;
        console.log(`Player 1 Lives: ${player1Lives}`);
        actualizarVidas("player1Lives", player1Lives);

        if (player1Lives <= 0) {
            console.log("Player 1 ha perdido!");
            mostrarExplosion(jugador); // Mostrar imagen de pérdida
            setTimeout(() => {
                jugador.remove(); // Eliminar al jugador del DOM después de 2 segundos
                mostrarGameOver("PLAYER 2 WIN");
            }, 10);
        }
    } else if (jugador.id === "character2") {
        player2Lives--;
        console.log(`Player 2 Lives: ${player2Lives}`);
        actualizarVidas("player2Lives", player2Lives);

        if (player2Lives <= 0) {
            console.log("Player 2 ha perdido!");
            mostrarExplosion(jugador); // Mostrar imagen de pérdida
            setTimeout(() => {
                jugador.remove(); // Eliminar al jugador del DOM después de 2 segundos
                mostrarGameOver("PLAYER 1 WIN");
            }, 10);
        }
    }
}

// Función para mostrar una imagen en la posición del jugador eliminado
function mostrarExplosion(jugador) {
    // Obtener las coordenadas del jugador
    const jugadorRect = jugador.getBoundingClientRect();

    // Crear la imagen
    const imagen = document.createElement("img");
    imagen.src = "Images/Explosion/explosion_player.gif"; // Ruta de la imagen
    imagen.style.position = "absolute";
    imagen.style.width = "120px"; // Ajusta el tamaño de la imagen
    imagen.style.left = `${jugadorRect.left + jugadorRect.width / 2 - 60}px`; // Centrado horizontalmente
    imagen.style.top = `${jugadorRect.top + jugadorRect.height / 2 - 60}px`; // Centrado verticalmente
    imagen.style.zIndex = "1000"; // Asegura que esté por encima de otros elementos

    // Agregar la imagen al body
    document.body.appendChild(imagen);

    // Eliminar la imagen después de 2 segundos
    setTimeout(() => {
        imagen.remove();
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    movePlayers(); // Inicia el bucle de movimiento después de que el DOM esté cargado
});