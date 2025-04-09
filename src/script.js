// Após carregamento da página divide emojis por categorias
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
// Gera as arrays de emojis depois da função de início de jogo
  function gerarEmojiPool() {
      return [...emojiCategorias.animais, ...emojiCategorias.comidas, ...emojiCategorias.objetos];
  }
// Buscando valores de elementos pelo seletor
  const startBtn = document.getElementById('startBtn');
  const difficultySelect = document.getElementById('difficulty');
  const gameBoard = document.getElementById('gameBoard');
// Definicação de variáveis para auxílo da lógica
  let tamanhoGrade = 4;
  let primeiraCarta = null;
  let bloqueado = false; // Impede o usuário de virar mais de duas cartas
  let tentativas = 0;    // Contador de tentativas
  let acertos = 0;       // Contador de acertos
  let cronometro;
  let segundos = 0;

  startBtn.addEventListener('click', iniciarJogo);

  function iniciarJogo() {
        // Passa a dificulade para o tamanho da grade
      tamanhoGrade = parseInt(difficultySelect.value);
      const totalCartas = tamanhoGrade * tamanhoGrade;

      let emojis = gerarEmojiPool();
      let emojisSelecionados = [];
        // Enquanto houver cartas disponíveis, transfere dois emojis para o array
      while (emojisSelecionados.length < totalCartas) {
          const emoji = emojis.splice(Math.floor(Math.random() * emojis.length), 1)[0];
          emojisSelecionados.push(emoji, emoji);
      }
        // Embaralha os emojis selecionados
      emojisSelecionados.sort(() => Math.random() - 0.5);

      gameBoard.innerHTML = '';
      gameBoard.classList.remove('hidden'); // Remove a classe 'hidden' para mostrar o tabuleiro
      // Faz com que o tabuleiro seja um grid que varia com a dificuldade
      gameBoard.style.gridTemplateColumns = `repeat(${tamanhoGrade}, 1fr)`;
      // Reset de possíveis informações salvas
      tentativas = 0;
      acertos = 0;
      segundos = 0;
      // Inicia o cronometro
      if (cronometro) clearInterval(cronometro); 
      iniciarCronometro();
      // Cria as cartas, garantindo tenham um emoji
      emojisSelecionados.forEach((emoji, index) => {
          const carta = document.createElement('div');
          carta.classList.add('card');
          carta.dataset.emoji = emoji;
          carta.dataset.index = index;
          carta.textContent = '';
        // Acionamento da função de virar a carta
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
              const tempoformatado = formatarTempo(segundos);
              alert(`🎉 Parabéns! Você venceu! 🎉\n⏳ Tempo: ${tempoformatado} segundos\n🎯 Precisão: ${precisao}%`);
              gameBoard.classList.add('hidden');
          }, 500);
      }
  }

  function formatarTempo(segundosTotais) {
    const horas = Math.floor(segundosTotais / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;
    if (segundosTotais < 60) {
        return `${segundos}s`;
    }

    if  (segundosTotais < 3600) {
        return `${minutos}m ${segundos}s`;
    } 
    {
        return `${horas}h ${minutos}m ${segundos}s`;
    }
}
})