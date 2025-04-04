document.addEventListener('DOMContentLoaded', () => {
    const emojiCategorias = {
      animais: ['🐶', '🐱', '🐸', '🐵', '🦊', '🐼', '🦁', '🐯', '🐰', '🐮'],
      comidas: ['🍎', '🍌', '🍕', '🍪', '🍩', '🍔', '🍓', '🍇', '🍫', '🥦'],
      objetos: ['📱', '💻', '📷', '🎮', '📚', '🎧', '🕶️', '🖊️', '🕰️', '🔑'],
    };
  
    function gerarEmojiPool() {
      return [...emojiCategorias.animais, ...emojiCategorias.comidas, ...emojiCategorias.objetos];
    }
  
    const startBtn = document.getElementById('startBtn');
    const difficultySelect = document.getElementById('difficulty');
    const gameBoard = document.getElementById('gameBoard');
  
    let tamanhoGrade = 3;
    let primeiraCarta = null;
    let bloqueado = false;
  
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
  
        if (primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
          primeiraCarta = null;
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
  });
  