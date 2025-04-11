const audio = document.getElementById("audioFondo");
const toggleBtn = document.getElementById("audioToggle");

// Empezamos muteado
let isMuted = true;
audio.volume = 0.3;
audio.muted = isMuted;

// Reproduce el audio al primer clic del usuario
document.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  }
}, { once: true });

// Botón para cambiar mute
toggleBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  toggleBtn.textContent = isMuted ? "🔇" : "🔊";
});