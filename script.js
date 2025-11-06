const canvas = document.getElementById('myCanvas');
canvas .width = 1200;
canvas .height =820 ;

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';


//imagens de fundo e lixeiras
const imgBackground = new Image();
imgBackground.src = '/Images/gameBg.jpeg';


const blueBin = new Image();
blueBin.src = '/Images/bluebin.png';

const greenBin = new Image();
greenBin.src = '/Images/greenbin.png';

const redBin = new Image();
redBin.src = '/Images/redbin.png';

const yellowBin = new Image();
yellowBin.src = '/Images/yellowbin.png';

const blackBin = new Image();
blackBin.src = '/Images/blackbin.png';


function desenhar(){
    ctx.drawImage(imgBackground,0,0,canvas.width,canvas.height);

    ctx.drawImage(blueBin,76,600,100,150);
    ctx.drawImage(greenBin,350,600,100,150);
    ctx.drawImage(redBin,600,600,100,150);
    ctx.drawImage(yellowBin,800,600,100,150);
    ctx.drawImage(blackBin,1000,600,100,150);
}
//chama a função desenhar quando a janela carrega
window.onload = function() {
    desenhar();
}