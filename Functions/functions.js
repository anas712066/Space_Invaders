//Moviment Player1
const player1 = document.getElementById("player1") ;
let position = 0;


// Contador eliminaciones
let killsp1 = 0;
let killsp2 = 0;

function sumarKillP1(){
    killsp2 += 1;
    document.querySelector("#killsPlayer1").innerHTML = killsp1;
}

function sumarKillP2() {
    killsp1 += 1;
    document.querySelector("#killsPlayer2").innerHTML = killsp2;
}