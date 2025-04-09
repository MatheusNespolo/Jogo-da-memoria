document.addEventListener('DOMContentLoaded', () => {
    const emojiCategorias = {
        animais: [
          '🐶', '🐱', '🐸', '🐵', '🦊', '🐼', '🦁', '🐯', '🐰', '🐮',
          '🐷', '🐨', '🐔', '🦉', '🦄', '🐢', '🐍', '🦖', '🦕', '🦥'
        ],
        comidas: [
          '🍎', '🍌', '🍕', '🍪', '🍩', '🍔', '🍓', '🍇', '🍫', '🥦',
          '🍍', '🥕', '🍗', '🍞', '🍰', '🍣', '🍱', '🌮', '🥑', '🥩'
        ],
        objetos: [
          '📱', '💻', '📷', '🎮', '📚', '🎧', '🕶️', '🖊️', '🕰️', '🔑',
          '🪀', '📺', '📡', '💡', '🔋', '🔌', '📦', '💰', '📸', '🪞','🎀','💅'
        ],
      };
      
  function gerarEmojiPool() {
      return [...emojiCategorias.animais, ...emojiCategorias.comidas, ...emojiCategorias.objetos];
  }

  const startBtn = document.getElementById('startBtn');
  const difficultySelect = document.getElementById('difficulty');
  const gameBoard = document.getElementById('gameBoard');

  let tamanhoGrade = 4;
  let primeiraCarta = null;
  let bloqueado = false;
  let tentativas = 0;
  let acertos = 0;
  let cronometro;
  let segundos = 0;

  startBtn.addEventListener('click', iniciarJogo);

  function iniciarJogo() {
      tamanhoGrade = parseInt(difficultySelect.value);
      const totalCartas = tamanhoGrade * tamanhoGrade;

      let emojis = gerarEmojiPool();
      let emojisSelecionados = [];

      while (emojisSelecionados.length < totalCartas) {
          const emoji = emojis.splice(Math.floor(Math.random() * emojis.length), 1)[0];
          emojisSelecionados.push(emoji, emoji);
      }

      emojisSelecionados.sort(() => Math.random() - 0.5);

      gameBoard.innerHTML = '';
      gameBoard.classList.remove('hidden');
      gameBoard.style.gridTemplateColumns = `repeat(${tamanhoGrade}, 1fr)`;

      tentativas = 0;
      acertos = 0;
      segundos = 0;
      if (cronometro) clearInterval(cronometro); 
      iniciarCronometro();

      emojisSelecionados.forEach((emoji, index) => {
          const carta = document.createElement('div');
          carta.classList.add('card');
          carta.dataset.emoji = emoji;
          carta.dataset.index = index;
          carta.textContent = '';

          carta.addEventListener('click', () => virarCarta(carta));
          gameBoard.appendChild(carta);
      });
  }

  function virarCarta(carta) {
      if (bloqueado || carta.classList.contains('flipped')) return;

      carta.textContent = carta.dataset.emoji;
      carta.classList.add('flipped');

      if (!primeiraCarta) {
          primeiraCarta = carta;
      } else {
          const segundaCarta = carta;
          tentativas++;

          if (primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
              acertos++;
              primeiraCarta = null;
              verificarFimDeJogo();
          } else {
              bloqueado = true;
              setTimeout(() => {
                  primeiraCarta.textContent = '';
                  segundaCarta.textContent = '';
                  primeiraCarta.classList.remove('flipped');
                  segundaCarta.classList.remove('flipped');
                  primeiraCarta = null;
                  bloqueado = false;
              }, 1000);
          }
      }
  }

  function iniciarCronometro() {
      cronometro = setInterval(() => {
          segundos++;
          atualizarHUD();
      }, 1000);
  }

  function verificarFimDeJogo() {
      const totalPares = (tamanhoGrade * tamanhoGrade) / 2;
      if (acertos === totalPares) {
          clearInterval(cronometro);
          setTimeout(() => {
              const precisao = ((acertos / tentativas) * 100).toFixed(2);
              alert(`🎉 Parabéns! Você venceu! 🎉\n⏳ Tempo: ${segundos} segundos\n🎯 Precisão: ${precisao}%`);
              gameBoard.classList.add('hidden');
          }, 500);
      }
  }

  function formatarTempo(segundosTotais) {
    const minutos = Math.floor(segundosTotais / 60);
    const segundos = segundosTotais % 60;

    const minFormatado = minutos > 0 ? `${minutos}m ` : '';
    const segFormatado = `${segundos}s`;

    return minFormatado + segFormatado;
}

function atualizarHUD() {
    console.log(`Tempo: ${formatarTempo(segundos)} | Tentativas: ${tentativas} | Acertos: ${acertos}`);
}
});
