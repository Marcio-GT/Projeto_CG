// === CONFIGURAÇÃO DO CANVAS ===
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 820;

// === IMAGENS ===
const bg = new Image();
bg.src = "/Images/gameBg.jpeg";

const lixeiras = [
  { cor: "azul", x: 100, y: 600, img: "/Images/bluebin.png" },
  { cor: "verde", x: 350, y: 600, img: "/Images/greenbin.png" },
  { cor: "vermelho", x: 600, y: 600, img: "/Images/redbin.png" },
  { cor: "amarelo", x: 850, y: 600, img: "/Images/yellowbin.png" },
  { cor: "preto", x: 1050, y: 600, img: "/Images/blackbin.png" }
];

// === TIPOS DE LIXO ===
const tiposLixo = {
  amarelo: ['🧴','🥤','🛍️'],
  azul: ['📄','📦','📚'],
  verde: ['🍸','🍷','🍾'],
  vermelho: ['⚙️','🔩','🪛'],
  preto: ['🍌','🥕','🍗']
};

// === CLASSE LIXO ===
/* Esta classe representa um item de lixo que cai do topo da tela. */
class Lixo {
  constructor() {
    const cores = Object.keys(tiposLixo);
    this.cor = cores[Math.floor(Math.random() * cores.length)]; // Seleciona uma cor aleatória
    this.emoji = tiposLixo[this.cor][Math.floor(Math.random() * tiposLixo[this.cor].length)]; // Seleciona um emoji aleatório da cor escolhida
    this.x = Math.random() * (canvas.width - 50); // Posição horizontal aleatória
    this.y = -50;
    this.size = 40;
    this.vel = 2;
    this.drag = false;
  }

  desenhar() {
    ctx.font = `${this.size}px Arial`;
    ctx.fillText(this.emoji, this.x, this.y);
  }

  cair() {
    if (!this.drag) this.y += this.vel;
  }
}

// === VARIÁVEIS DO JOGO ===
let lixo = new Lixo();
let pontos = 0;
let lixoNochao = 0;
let gameOver = false;

// === EVENTOS DO MOUSE ===
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (mx > lixo.x && mx < lixo.x + lixo.size && my > lixo.y - lixo.size && my < lixo.y)
    lixo.drag = true;
});

canvas.addEventListener("mousemove", e => {
  if (lixo.drag) {
    const rect = canvas.getBoundingClientRect();
    lixo.x = e.clientX - rect.left - lixo.size / 2;
    lixo.y = e.clientY - rect.top - lixo.size / 2;
  }
});

canvas.addEventListener("mouseup", () => {
  if (lixo.drag) {
    let acertou = false;

    // Verifica se o lixo foi largado em alguma lixeira
    for (let lixeira of lixeiras) {
      if (
        lixo.x > lixeira.x &&
        lixo.x < lixeira.x + 100 &&
        lixo.y > lixeira.y &&
        lixo.y < lixeira.y + 150
      ) {
        if (lixo.cor === lixeira.cor) {
          pontos += 25; // Acertou o caixote certo
          acertou = true;
        } else {
          pontos -= 10; // Errou o caixote (só perde pontos, sem aumentar erros)
        }
        break;
      }
    }

    lixo.drag = false;

    // Se acertou, cria novo lixo
    if (acertou) lixo = new Lixo();
  }
});

// === LOOP PRINCIPAL ===
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Desenha lixeiras
  for (let lixeira of lixeiras) {
    const img = new Image();
    img.src = lixeira.img;
    ctx.drawImage(img, lixeira.x, lixeira.y, 100, 150);
  }

  // Desenha e atualiza o lixo
  lixo.desenhar();
  lixo.cair();
  lixo.vel += 0.002 // Aumenta a velocidade do lixo com o tempo

  // Se o lixo cair no chão
  if (lixo.y > canvas.height - 30) {
    lixoNochao++;
    lixo = new Lixo();
  }

  // HUD
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Pontos: ${pontos}`, 20, 30);
  ctx.fillText(`Lixos no chão: ${lixoNochao}`, 20, 60);

  // GAME OVER
  if (lixoNochao > 15) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2 - 180, canvas.height / 2);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("A cidade está suja! 🤢", canvas.width / 2 - 200, canvas.height / 2 + 80);
    gameOver = true;
  }

  if (!gameOver) requestAnimationFrame(loop);
}
 // Inicia o loop do jogo
 bg.onload = () => {
  loop();
 }