// === CONFIGURAÇÃO INICIAL DO CANVAS ===
// Pegamos o elemento <canvas> do HTML
const canvas = document.getElementById('myCanvas');
// Definimos o tamanho da área de jogo
canvas.width = 1200;
canvas.height = 820;

// Criamos o contexto gráfico — é aqui que desenhamos tudo no Canvas
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

// === IMAGENS DE FUNDO E DAS LIXEIRAS ===
const imgBackground = new Image();
imgBackground.src = '/Images/gameBg.jpeg';

// Cada lixeira (bin) tem sua cor, posição e imagem associada
const bins = {
  azul: { img: new Image(), x: 76, y: 600, color: 'blue' },
  verde: { img: new Image(), x: 350, y: 600, color: 'green' },
  vermelho: { img: new Image(), x: 600, y: 600, color: 'red' },
  amarelo: { img: new Image(), x: 800, y: 600, color: 'yellow' },
  preto: { img: new Image(), x: 1000, y: 600, color: 'black' }
};

// Atribuímos as imagens de cada lixeira
bins.azul.img.src = '/Images/bluebin.png';
bins.verde.img.src = '/Images/greenbin.png';
bins.vermelho.img.src = '/Images/redbin.png';
bins.amarelo.img.src = '/Images/yellowbin.png';
bins.preto.img.src = '/Images/blackbin.png';

// === TIPOS DE LIXO ===
// Cada tipo de lixo tem uma cor correspondente e emojis que o representam
const tiposLixo = {
  amarelo: ['🧴','🥤','🛍️','🪥','🍼','🧴'],  // plástico
  azul: ['📄','📦','📰','📚','🧻','📇'],      // papel
  verde: ['🍸','🍷','🍾','🫙'],              // vidro
  vermelho: ['⚙️','🛠️','🔩','🪛','🪚','⛓️'], // metal
  preto: ['🍌','🥕','🍞','🥚','🍗','🍂','💩'] // orgânico
};

// === VARIÁVEIS GLOBAIS DO JOGO ===
let lixoAtual = null;       // lixo atual caindo
let lixoArrastado = null;   // lixo que o jogador está segurando
let offsetX = 0;            // diferença entre o clique e a posição real do lixo (para o arrastar ficar suave)
let offsetY = 0;
let pontuacao = 0;          // pontos do jogador
let lixosCaido = 0;         // quantos lixos errados foram ao chão
let speed = 1.5;            // velocidade inicial de queda
let gameOver = false;       // estado do jogo

/* ============================================================
   Função: gerarLixo()
   Gera um novo lixo aleatório no topo da tela.
   ============================================================ */
function gerarLixo() {
  const cores = Object.keys(tiposLixo); // pega as chaves do objeto (amarelo, azul, etc)
  const cor = cores[Math.floor(Math.random() * cores.length)]; // escolhe uma cor aleatória
  const emoji = tiposLixo[cor][Math.floor(Math.random() * tiposLixo[cor].length)]; // escolhe um emoji dessa cor
  const x = Math.random() * (canvas.width - 50); // posição X aleatória dentro da tela
  const y = -50; // começa acima do topo da tela
  lixoAtual = { emoji, cor, x, y, size: 30, speedY: speed }; // cria o objeto do lixo
}

/* ============================================================
   Função: colidirComLixeira(lixo, bin)
   Verifica se o lixo está sobre uma lixeira.
   Retorna true se estiver dentro dos limites da imagem da lixeira.
   ============================================================ */
function colidirComLixeira(lixo, bin) {
  return (
    lixo.x > bin.x &&
    lixo.x < bin.x + 100 &&
    lixo.y > bin.y &&
    lixo.y < bin.y + 150
  );
}

/* ============================================================
   Função: Desenhar()
   Atualiza o que aparece no ecrã (fundo, lixeiras, lixo e HUD).
   ============================================================ */
function Desenhar() {
  // Desenha o fundo do jogo
  ctx.drawImage(imgBackground, 0, 0, canvas.width, canvas.height);

  // Desenha todas as lixeiras
  for (let key in bins) {
    ctx.drawImage(bins[key].img, bins[key].x, bins[key].y, 100, 150);
  }

  // Desenha o lixo atual (emoji)
  if (lixoAtual) {
    ctx.font = `${lixoAtual.size}px Arial`;
    ctx.fillText(lixoAtual.emoji, lixoAtual.x, lixoAtual.y);
  }

  // Desenha o placar e contador de lixos errados (HUD)
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Pontuação: ${pontuacao}`, 20, 30);
  ctx.fillText(`Lixos no chão: ${lixosCaido}/30`, 20, 60);
}

/* ============================================================
   Função: Atualizar()
   Atualiza a posição e estado do jogo a cada frame.
   Faz o lixo cair, verifica colisões e controla o Game Over.
   ============================================================ */
function Atualizar() {
  if (gameOver) return; // se o jogo acabou, não faz mais nada

  // Move o lixo para baixo, mas só se o jogador não estiver a arrastar ele
  if (lixoAtual && lixoAtual !== lixoArrastado) {
    lixoAtual.y += lixoAtual.speedY;
  }

  // Se o lixo chegar ao chão
  if (lixoAtual && lixoAtual.y > canvas.height - 30) {
    lixoAtual.y = canvas.height - 30;
    lixosCaido++; // aumenta o contador de erros
    lixoAtual = null; // remove o lixo atual
    gerarLixo(); // gera outro lixo
  }

  // Aumenta a velocidade da queda aos poucos (dificuldade)
  speed += 0.0005;

  // Verifica se o jogo acabou
  if (lixosCaido >= 30) {
    gameOver = true;
  }
}

/* ============================================================
   Função: loop()
   O "coração" do jogo. Desenha e atualiza o estado repetidamente.
   Usa requestAnimationFrame() para rodar a ~60 FPS.
   ============================================================ */
function loop() {
  // Limpa o canvas antes de desenhar o novo frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chama as funções principais
  Desenhar();
  Atualizar();

  // Se o jogo não acabou, continua o loop
  if (!gameOver) {
    requestAnimationFrame(loop);
  } else {
    // Se acabou, desenha a tela de GAME OVER
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = '60px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 180, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(`Pontuação Final: ${pontuacao}`, canvas.width / 2 - 120, canvas.height / 2 + 60);
  }
}

/* ============================================================
   SISTEMA DE ARRASTAR E SOLTAR (Drag & Drop)
   ============================================================ */

/* ------------------------------------------------------------
   Quando o jogador clica (mousedown):
   - Verifica se clicou em cima do lixo atual
   - Se sim, começa a "arrastar" (guardar qual lixo está pegando)
   ------------------------------------------------------------ */
canvas.addEventListener('mousedown', e => {
  if (!lixoAtual) return; // se não tem lixo, não faz nada

  // Pega a posição do mouse relativa ao Canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Verifica se o clique foi dentro da área do emoji
  if (
    mouseX >= lixoAtual.x &&
    mouseX <= lixoAtual.x + lixoAtual.size &&
    mouseY >= lixoAtual.y - lixoAtual.size &&
    mouseY <= lixoAtual.y
  ) {
    // Ativa o arraste
    lixoArrastado = lixoAtual;
    offsetX = mouseX - lixoAtual.x;
    offsetY = mouseY - lixoAtual.y;
  }
});

/* ------------------------------------------------------------
   Quando o mouse se move (mousemove):
   - Se o jogador está arrastando, atualiza a posição do lixo
   ------------------------------------------------------------ */
canvas.addEventListener('mousemove', e => {
  if (lixoArrastado) {
    const rect = canvas.getBoundingClientRect();
    lixoArrastado.x = e.clientX - rect.left - offsetX;
    lixoArrastado.y = e.clientY - rect.top - offsetY;
  }
});

/* ------------------------------------------------------------
   Quando solta o botão (mouseup):
   - Verifica se soltou o lixo em cima da lixeira certa
   - Se sim → ganha pontos e gera novo lixo
   - Se errado → perde pontos e conta como lixo caído
   ------------------------------------------------------------ */
canvas.addEventListener('mouseup', e => {
  if (!lixoArrastado) return;

  let acertou = false;

  // Verifica colisão com todas as lixeiras
  for (let key in bins) {
    if (colidirComLixeira(lixoArrastado, bins[key])) {
      if (key === lixoArrastado.cor) {
        // Jogou no balde certo
        pontuacao += 25;
        acertou = true;
      } else {
        // Jogou no balde errado
        pontuacao -= 10;
        lixosCaido++;
      }
      break; // não precisa verificar as outras
    }
  }

  // Se acertou, remove o lixo atual e cria um novo
  if (acertou) {
    lixoAtual = null;
    gerarLixo();
  }

  // Termina o arraste
  lixoArrastado = null;
});

/* ============================================================
   Início do jogo
   ============================================================ */
window.onload = () => {
  gerarLixo(); // cria o primeiro lixo
  loop();      // começa o loop do jogo
};
