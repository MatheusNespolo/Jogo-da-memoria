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
  const botaoInicio = document.getElementById('botaoInicio');
  const dificuldade = document.getElementById('dificuldade');
  const tabuleiro = document.getElementById('tabuleiro');
// Definicação de variáveis para auxílo da lógica
  let tamanhoGrade = 4;
  let primeiraCarta = null;
  let bloqueado = false; // Impede o usuário de virar mais de duas cartas
  let tentativas = 0;    // Contador de tentativas
  let acertos = 0;       // Contador de acertos
  let cronometro;
  let segundos = 0;

  botaoInicio.addEventListener('click', iniciarJogo);

  function iniciarJogo() {
        // Passa a dificuldade para o tamanho da grade
      tamanhoGrade = parseInt(dificuldade.value);
      const totalCartas = tamanhoGrade * tamanhoGrade;

      let emojis = gerarEmojiPool();
      let emojisSelecionados = [];
        // Enquanto houver cartas disponíveis, transfere pares de emojis para o array
        // ALMA DO JOGO!!
      while (emojisSelecionados.length < totalCartas) {
          const emoji = emojis.splice(Math.floor(Math.random() * emojis.length), 1)[0];
          emojisSelecionados.push(emoji, emoji);
      }
        // Embaralha os emojis selecionados
      emojisSelecionados.sort(() => Math.random() - 0.5);

      tabuleiro.innerHTML = '';
      tabuleiro.classList.remove('hidden'); // Remove a classe 'hidden' para mostrar o tabuleiro
      // Faz com que o tabuleiro seja um grid que varia com a dificuldade
      tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoGrade}, 1fr)`;
      // Reset de possíveis informações salvas
      tentativas = 0;
      acertos = 0;
      segundos = 0;
      // Inicia o cronometro
      if (cronometro) clearInterval(cronometro); 
      iniciarCronometro();
      // Cria as cartas correspondentes aos emojis selecionados pela dificuldade
      emojisSelecionados.forEach((emoji, index) => {
          const carta = document.createElement('div');
          carta.classList.add('carta');
          carta.dataset.emoji = emoji;
          carta.dataset.index = index;
          carta.textContent = '';

          carta.addEventListener('click', () => virarCarta(carta));
          tabuleiro.appendChild(carta);
      });
  }

  function virarCarta(carta) {
      if (bloqueado || carta.classList.contains('virada')) return;
    // Caso seja a primeira ou a segunda carta virada recebe o emoji como conteúdo de texto
      carta.textContent = carta.dataset.emoji;
      carta.classList.add('virada');

      if (!primeiraCarta) {
          primeiraCarta = carta;
      } else {
          const segundaCarta = carta;
          tentativas++;
        // Verifica se as duas cartas viradas tem o mesmo emoji
          if (primeiraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
              acertos++;
              primeiraCarta = null;
              verificarFimDeJogo();
          } else {
        // Caso contrário, o tabuleiro fica bloqueado por um segundo e desvira cartas
              bloqueado = true;
              setTimeout(() => {
                // Durante o tempo de bloqueio prepara a próxima comparação
                  primeiraCarta.textContent = '';
                  segundaCarta.textContent = '';
                  primeiraCarta.classList.remove('virada');
                  segundaCarta.classList.remove('virada');
                  primeiraCarta = null;
                  bloqueado = false;
              }, 1000);
          }
      }
  }
// Abaixo estão as funções auxiliares para placar, cronômetro e formatar o tempo
  function iniciarCronometro() {
      cronometro = setInterval(() => {
          segundos++;
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
              tabuleiro.classList.add('hidden');
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