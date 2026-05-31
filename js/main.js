// main.js - Lógica general de la plataforma Preescoludi

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar tooltips de Bootstrap
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // --- REPRODUCCIÓN DE AUDIOS EN TARJETAS EDUCATIVAS ---
  const cards = document.querySelectorAll('.card-edu');
  let currentAudio = null;
  let currentCard = null;

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      const audioSrc = card.getAttribute('data-audio');
      if (!audioSrc) return;

      const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Tarjeta';

      // 1. Detener audio activo anterior y remover su animación
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      if (currentCard) {
        currentCard.classList.remove('playing');
      }

      // 2. Activar nueva tarjeta y reproducir
      currentCard = card;
      card.classList.add('playing');

      // Crear nueva instancia de audio
      const audio = new Audio(audioSrc);
      currentAudio = audio;

      // Intentar reproducir el audio
      audio.play().then(() => {
        // Reproducción exitosa
        audio.addEventListener('ended', function() {
          card.classList.remove('playing');
          if (currentCard === card) {
            currentCard = null;
            currentAudio = null;
          }
        });
      }).catch(error => {
        // Si hay un error (por ejemplo, archivo no encontrado)
        console.warn(`Preescoludi: No se pudo reproducir el audio de "${cardTitle}" desde la ruta: ${audioSrc}`, error);
        
        // Remover animación inmediatamente
        card.classList.remove('playing');
        if (currentCard === card) {
          currentCard = null;
          currentAudio = null;
        }

        // Mostrar un hermoso aviso en la pantalla
        showAudioToast(`¡Muy pronto! 🎵 El audio de "${cardTitle}" estará disponible.`);
      });
    });
  });

  // Función para mostrar notificaciones personalizadas (Toasts)
  function showAudioToast(message) {
    // Si ya existe un toast activo, lo eliminamos primero
    const existingToast = document.querySelector('.audio-toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Crear la estructura del Toast
    const toast = document.createElement('div');
    toast.className = 'audio-toast';
    
    const icon = document.createElement('div');
    icon.className = 'audio-toast-icon';
    icon.innerHTML = '🔊';
    
    const content = document.createElement('div');
    content.className = 'audio-toast-content';
    content.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(content);
    document.body.appendChild(toast);

    // Animación de entrada
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Desvanecer y eliminar después de 3.5 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  }
});

document.querySelectorAll('.btn-juego').forEach(boton => {

    boton.addEventListener('click', function(event) {

        event.preventDefault();

        const destino = this.href;

        const card = this.closest('.card-edu');
        const rutaAudio = card.dataset.audio;

        const audio = new Audio(rutaAudio);

        this.style.pointerEvents = 'none';

        audio.play();

        audio.onended = () => {
            window.location.href = destino;
        };

    });

});

let bienvenidaReproducida = false;

document.addEventListener('click', () => {

    if (bienvenidaReproducida) return;

    bienvenidaReproducida = true;

    setTimeout(() => {
        reproducirAudioRuta('assets/audio/inicio_pag.ogg');
    }, 100);

}, { once: true });

// Audio routing helper
    let audioActual = null;
    function reproducirAudioRuta(ruta, callback = null) {
      if (audioActual) {
        audioActual.pause();
        audioActual.currentTime = 0;
      }

      audioActual = new Audio(ruta);
      audioActual.onended = () => {
        if (callback) callback();
      };
      audioActual.play().catch(err => {
        console.warn(`No se pudo reproducir el audio: ${ruta}. Ejecutando fallback.`, err);
        if (callback) callback();
      });
    }

window.addEventListener("DOMContentLoaded", () => {
      reproducirAudioRuta('assets/audio/inicio_pag.ogg');
    });