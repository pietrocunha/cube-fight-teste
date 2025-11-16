const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//ajuste do tamanho do espaço do jogo (parte jogável)
canvas.width = 1600; //innerWidth
canvas.height = 900; //innerHeight

//carregando informações do menu
// let player1 = JSON.parse(localStorage.getItem("player1"));

//provisorio enquanto nao deploya
let player1 = {
    chapeu: 'rei',
    rosto: 'bravo',
    roupa: 'mago',
    arma: 'vazio'
}
let player2 = {
    chapeu: 'cowboy',
    rosto: 'feliz',
    roupa: 'paleto',
    arma: 'lanca'
}


console.log("Jogador 1 escolheu:", player1.chapeu, player1.rosto, player1.roupa, player1.arma);
console.log("Jogador 2 escolheu:", player2.chapeu, player2.rosto, player2.roupa, player2.arma);

class Jogador {
    constructor({ x, y, orientacao, cor, imagens}) { //propriedades do jogador
        this.position = {
            x: x,
            y: y
        }
        this.velocidade = {
            x: 0,
            y: 1
        }
        this.imagens = imagens; //rosto, chapeu, roupa, arma

        this.width = 50
        this.height = 50

        this.velocidadeBase = 15;
        this.saltoBase = 27;
        this.gravidadeBase = 1.3;
        this.pisadaBase = 23;
        this.dashBase = 20;
        this.dashCooldown = 500; // tempo em ms
        this.ataqueBase = 35;
        this.alcanceBase = 45;

        this.podePular = false;
        this.podeDoubleJump = false;
        this.podePisar = false;
        this.podeDarDash = true;
        this.podeAtacar = true;
        this.soltaParticula = true;

        this.orientacao = orientacao; //direita ou esquerda
        this.estaDandoDash = false;
        this.estaSendoAtacado = false;
        this.estaDandoPisada = false;

        this.encostandoEmParede = false;
        this.seMoveu = false;

        this.debounce = false; //faz o jogador ter que soltar o W antes de dar um double jump
        this.cor = cor;
    }

    desenhar() {
        if (this.orientacao == 'esquerda') {
            // flipado
            c.save();
            c.scale(-1, 1);

            c.fillStyle = 'black';
            c.fillRect(-this.position.x, this.position.y, -this.width, this.height)

            c.fillStyle = 'white';
            c.fillRect(-this.position.x - 3, this.position.y + 3, -this.width + 6, this.height - 6)

            c.drawImage(this.imagens.rosto, -this.position.x - this.width, this.position.y, this.width, this.height); //desenhando rosto
            c.drawImage(this.imagens.chapeu, -this.position.x - this.imagens.chapeu.width + 4, this.position.y - this.imagens.chapeu.height + 5, this.imagens.chapeu.width, this.imagens.chapeu.height); //desenhando chapeu
            c.drawImage(this.imagens.roupa, -this.position.x - this.imagens.roupa.width + 2, this.position.y + this.height - this.imagens.roupa.height, this.imagens.roupa.width, this.imagens.roupa.height); //desenhando roupa
            c.restore();
        } else {
            // normal
            c.fillStyle = 'black'; //borda preta
            c.fillRect(this.position.x, this.position.y, this.width, this.height)

            c.fillStyle = 'white';  //cubinho
            c.fillRect(this.position.x + 3, this.position.y + 3, this.width - 6, this.height - 6)

            c.drawImage(this.imagens.rosto, this.position.x, this.position.y, this.width, this.height); //desenhando rosto
            c.drawImage(this.imagens.chapeu, this.position.x - 4, this.position.y - this.imagens.chapeu.height + 5, this.imagens.chapeu.width, this.imagens.chapeu.height); //desenhando chapeu
            c.drawImage(this.imagens.roupa, this.position.x - 2, this.position.y + this.height - this.imagens.roupa.height, this.imagens.roupa.width, this.imagens.roupa.height); //desenhando roupa

            //c.fillRect(this.position.x + this.alcanceBase, this.position.y, this.width, this.height); //mostrar hitbox
        }
    }

    update() { //atualiza as propriedades do jogador
        this.desenhar()
        this.position.y += this.velocidade.y
        this.position.x += this.velocidade.x

        if (!this.estaDandoDash) {
            this.velocidade.y += this.gravidadeBase; //acelera com a gravidade
        }

    }
}

// ANTES DE LIMITAR O FPS (FUNCIONA BEM EM 180HZ)
// class Jogador {
//     constructor({ x, y, orientacao, cor }) { //propriedades do jogador
//         this.position = {
//             x: x,
//             y: y
//         }
//         this.velocidade = {
//             x: 0,
//             y: 1
//         }

//         this.width = 50
//         this.height = 50

//         this.velocidadeBase = 4.5;
//         this.saltoBase = 6.5;
//         this.gravidadeBase = 0.08;
//         this.pisadaBase = 8;
//         this.dashBase = 7;
//         this.dashCooldown = 500; // tempo em ms
//         this.ataqueBase = 12;
//         this.alcanceBase = 45;

//         this.podePular = false;
//         this.podeDoubleJump = false;
//         this.podePisar = false;
//         this.podeDarDash = true;
//         this.podeAtacar = true;
//         this.soltaParticula = true;

//         this.orientacao = orientacao; //direita ou esquerda
//         this.estaDandoDash = false;
//         this.estaSendoAtacado = false;
//         this.estaDandoPisada = false;

//         this.debounce = false; //faz o jogador ter que soltar o W antes de dar um double jump
//         this.cor = cor;
//     }

//     desenhar() { //desenha o jogador na tela
//         c.fillStyle = this.cor
//         c.fillRect(this.position.x, this.position.y, this.width, this.height)
//     }

//     update() { //atualiza as propriedades do jogador
//         this.desenhar()
//         this.position.y += this.velocidade.y
//         this.position.x += this.velocidade.x

//         if (!this.estaDandoDash) {
//             this.velocidade.y += this.gravidadeBase; //acelera com a gravidade
//         }

//     }
// }

class Plataforma {
    constructor({ x, y, width, height, cor, image, colisoes }) { //propriedades de uma plataforma
        this.position = {
            x: x,
            y: y
        }

        this.width = width
        this.height = height

        this.image = image;

        this.colisoes = colisoes;

        this.cor = cor
    }

    desenhar() { //desenha a plataforma na tela
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        // c.fillStyle = this.cor
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Particula {
    constructor({ x, y, raio, cor, velocidade }) { //propriedades de uma partícula
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.cor = cor;
        this.velocidade = velocidade;
        this.alpha = 1;
    }

    desenhar() {
        c.save()
        c.globalAlpha = this.alpha //fade out
        c.fillStyle = this.cor

        // quadrado centralizado no ponto (x, y)
        c.fillRect(
            this.x - this.raio,
            this.y - this.raio,
            this.raio * 2,
            this.raio * 2
        )

        c.restore()
    }


    update() {
        this.desenhar()
        this.x += this.velocidade.x
        this.y += this.velocidade.y

        this.alpha -= 0.03; //fade out das particulas
        if (this.alpha <= 0) this.alpha = 0;

    }


}

//função que solta particulas
function soltarParticulas(posX, posY, velocidadeX, velocidadeY, jogador) {
    particulas.push(
        new Particula({
            x: posX,
            y: posY,
            raio: Math.random() * 2 + 1,
            cor: jogador.cor,
            velocidade: {
                x: velocidadeX * 2,
                y: velocidadeY * 2,
            }
        })
    )
}

//puxando imagens
//plataformas e fundo
const imgPlataformaCentral = new Image()
imgPlataformaCentral.src = './imgs/plataforma-neve-principal.jpg'
imgPlataformaCentral.width = 800; //tamanho padronizado

const imgPlataformaDireita = new Image()
imgPlataformaDireita.src = './imgs/plataforma-neve-direita.jpg'

imgPlataformaDireita.width = 375; //tamanho padronizado
imgPlataformaDireita.height = 90; //tamanho padronizado

const imgPlataformaEsquerda = new Image()
imgPlataformaEsquerda.src = './imgs/plataforma-neve-esquerda.jpg'
imgPlataformaEsquerda.width = 375; //tamanho padronizado
imgPlataformaEsquerda.height = 90; //tamanho padronizado

const imgFundo = new Image()
imgFundo.src = './imgs/fundo-neve.jpg'


//acessorios
//rostos
const imgRosto1 = new Image()
imgRosto1.src = './imgs/cara-' + player1.rosto + '.png'

const imgRosto2 = new Image()
imgRosto2.src = './imgs/cara-' + player2.rosto + '.png'

//chapeus
const imgChapeu1 = new Image()
imgChapeu1.src = './imgs/chapeu-' + player1.chapeu + '.png'
imgChapeu1.onload = () => {
    imgChapeu1.width = 58;
    imgChapeu1.height = 58 * (imgChapeu1.naturalHeight / imgChapeu1.naturalWidth);
}

const imgChapeu2 = new Image()
imgChapeu2.src = './imgs/chapeu-' + player2.chapeu + '.png'
imgChapeu2.onload = () => {
    imgChapeu2.width = 58;
    imgChapeu2.height = 58 * (imgChapeu2.naturalHeight / imgChapeu2.naturalWidth);
}

//roupas
const imgRoupa1 = new Image()
imgRoupa1.src = './imgs/roupa-' + player1.roupa + '.png'
imgRoupa1.onload = () => {
    imgRoupa1.width = 54;
    imgRoupa1.height = 54 * (imgRoupa1.naturalHeight / imgRoupa1.naturalWidth);
}

const imgRoupa2 = new Image()
imgRoupa2.src = './imgs/roupa-' + player2.roupa + '.png'
imgRoupa2.onload = () => {
    imgRoupa2.width = 54;
    imgRoupa2.height = 54 * (imgRoupa2.naturalHeight / imgRoupa2.naturalWidth);
}

//criação dos jogadores
const jogadores = [new Jogador({
    x: canvas.width / 4,
    y: 100,
    orientacao: 'direita',
    cor: 'white',
    imagens: {
        rosto: imgRosto1,
        roupa: imgRoupa1,
        chapeu: imgChapeu1,
    }
}), new Jogador({
    x: 3 * canvas.width / 4 - 50,
    y: 100,
    orientacao: 'esquerda',
    cor: 'white',
    imagens: {
        rosto: imgRosto2,
        roupa: imgRoupa2,
        chapeu: imgChapeu2,
    }
})];


let acessoriosDosJogadores = [player1, player2];

for(let j = 0; j < 2; j++) {
    switch (acessoriosDosJogadores[j].chapeu) {
        // case 'rei':
        //     jogadores[j].dashCooldown *= 0.7; //diminui em 30%
        //     break;
        // case 'mago':
        //     jogadores[j].gravidadeBase *= 0.75; //diminui em 25%
        //     break;
        // case 'paleto':
        //     jogadores[j].dashBase *= 1.75; //aumenta em 75%
        //     break;
        // case 'cowboy':
        //     jogadores[j].alcanceBase *= 1.25; //aumenta em 25%
        //     break;
        // default:
        //     break;
    }

    switch (acessoriosDosJogadores[j].roupa) {
        // case 'rei':
        //     jogadores[j].dashCooldown *= 0.7; //diminui em 30%
        //     break;
        // case 'mago':
        //     jogadores[j].gravidadeBase *= 0.75; //diminui em 25%
        //     break;
        // case 'paleto':
        //     jogadores[j].dashBase *= 1.75; //aumenta em 75%
        //     break;
        // case 'cowboy':
        //     jogadores[j].alcanceBase *= 1.25; //aumenta em 25%
        //     break;
        // default:
        //     break;
    }

    switch (acessoriosDosJogadores[j].rosto) {
        // case 'rei':
        //     jogadores[j].dashCooldown *= 0.7; //diminui em 30%
        //     break;
        // case 'mago':
        //     jogadores[j].gravidadeBase *= 0.75; //diminui em 25%
        //     break;
        // case 'paleto':
        //     jogadores[j].dashBase *= 1.75; //aumenta em 75%
        //     break;
        // case 'cowboy':
        //     jogadores[j].alcanceBase *= 1.25; //aumenta em 25%
        //     break;
        // default:
        //     break;
    }
}


//criação das plataformas

const plataformas = [];

imgPlataformaCentral.onload = () => { //espera a plataforma central carregar, depois cria ela
    plataformas.push(new Plataforma({
        x: (canvas.width / 2 - imgPlataformaCentral.width / 2) /*plataforma no centro*/, y: 600, width: imgPlataformaCentral.width, height: imgPlataformaCentral.height, cor: 'blue', image: imgPlataformaCentral, colisoes: true,
    }))
}

imgPlataformaDireita.onload = () => { //espera a plataforma da direita carregar, depois cria ela
    plataformas.push(new Plataforma({
        x: (3 * canvas.width / 4 - imgPlataformaDireita.width / 2) /*plataforma no centro*/, y: 400, width: imgPlataformaDireita.width, height: imgPlataformaDireita.height, cor: 'blue', image: imgPlataformaDireita, colisoes: false
    }))
}

imgPlataformaEsquerda.onload = () => { //espera a plataforma da esquerda carregar, depois cria ela
    plataformas.push(new Plataforma({
        x: (canvas.width / 4 - imgPlataformaEsquerda.width / 2) /*plataforma no centro*/, y: 400, width: imgPlataformaEsquerda.width, height: imgPlataformaEsquerda.height, cor: 'blue', image: imgPlataformaEsquerda, colisoes: false
    }))
}

//criando vetor de particulas
const particulas = []

//monitorando as teclas pressionadas
const teclas = [{
    direita: { //jogador 0 (WASD)
        pressionada: false
    },
    esquerda: {
        pressionada: false
    },
    cima: {
        pressionada: false
    },
    baixo: {
        pressionada: false
    },
    dash: {
        pressionada: false
    },
    ataque: {
        pressionada: false
    },
}, {
    direita: { //jogador 1 (setas)
        pressionada: false
    },
    esquerda: {
        pressionada: false
    },
    cima: {
        pressionada: false
    },
    baixo: {
        pressionada: false
    },
    dash: {
        pressionada: false
    },
    ataque: {
        pressionada: false
    },
}]

//fixando o fps em 60
let fps = 60;
let intervaloFrame = 1000 / fps; // ~16.67ms
let ultimoFrame = 0;

//função principal que atualiza a tela
function animar(tempoAtual) { 
    requestAnimationFrame(animar); // loop infinito

    const delta = tempoAtual - ultimoFrame;
    if (delta < intervaloFrame) return; // ainda não passou tempo suficiente

    ultimoFrame = tempoAtual;

    // c.fillStyle = 'black';
    c.drawImage(imgFundo, 0, 0, canvas.width, canvas.height)
    // c.fillRect(0, 0, canvas.width, canvas.height);

    jogadores.forEach(jogador => {
        jogador.update(); //atualiza o jogador
    })

    particulas.forEach(particula => {
        particula.update()
    })

    plataformas.forEach(plataforma => {
        plataforma.desenhar() //atualiza as plataformas
    })




    //movimento dos jogadores
    for (let i = 0; i < 2; i++) { //i assume 0 e 1 (só podem ter 2 jogadores)
        let outroJogador = jogadores[1]; //definindo o outro jogador
        if (outroJogador == jogadores[i]) outroJogador = jogadores[0];

        //movimentos horizontais
        //movimento pra direita
        if (teclas[i].direita.pressionada && !teclas[i].esquerda.pressionada) {
            if ((jogadores[i].estaDandoDash && jogadores[i].orientacao == 'esquerda') || !jogadores[i].estaDandoDash) { // verificação se o jogador está dando dash
                if (!jogadores[i].estaSendoAtacado) { // verificação se o jogador está sendo atacado
                    jogadores[i].velocidade.x = jogadores[i].velocidadeBase; //velocidade para a direita
                }

                jogadores[i].seMoveu = true;
                jogadores[i].orientacao = 'direita';
            }
            //movimento pra esquerda
        } else if (teclas[i].esquerda.pressionada && !teclas[i].direita.pressionada) {
            if ((jogadores[i].estaDandoDash && jogadores[i].orientacao == 'direita') || !jogadores[i].estaDandoDash) { // verificação se o jogador está dando dash
                if (!jogadores[i].estaSendoAtacado) { // verificação se o jogador está sendo atacado
                    jogadores[i].velocidade.x = -jogadores[i].velocidadeBase; //velocidade para a esquerda
                }

                jogadores[i].seMoveu = true;
                jogadores[i].orientacao = 'esquerda';
            }

        } else if (!jogadores[i].estaDandoDash && !jogadores[i].estaSendoAtacado) {
            jogadores[i].velocidade.x = 0;
        }

        if (teclas[i].direita.pressionada && teclas[i].esquerda.pressionada) { //caso o jogador aperte esquerda e direita ao mesmo tempo
            if (!jogadores[i].estaDandoDash && !jogadores[i].estaSendoAtacado) {
                jogadores[i].velocidade.x = 0;
            }
        }

        //salto
        if (teclas[i].cima.pressionada && jogadores[i].podePular) { // salto (somente se o jogador estiver pisando em uma plataforma ou em outro jogador)
            jogadores[i].velocidade.y -= jogadores[i].saltoBase;

            jogadores[i].podePisar = true; //carrega a pisada
            jogadores[i].podeDoubleJump = true;
            jogadores[i].debounce = true; //impede que o double jump ative imediatamente
        }

        //double jump
        if (teclas[i].cima.pressionada && jogadores[i].podeDoubleJump && !jogadores[i].debounce) {
            jogadores[i].velocidade.y = -jogadores[i].saltoBase;
            jogadores[i].podeDoubleJump = false;

            console.log(jogadores[i].position.x)


            //solta partículas

            for (let j = 0; j < 8; j++) {// j é o numero de particulas
                let posX = jogadores[i].position.x + jogadores[i].width / 2 + ((Math.random() - 0.5) * 30);
                let posY = jogadores[i].position.y + jogadores[i].height;

                let velocidadeX = (Math.random() - 0.5) * 4;
                let velocidadeY = Math.random();

                if (posX > jogadores[i].position.x + jogadores[i].width / 2) {
                    if (velocidadeX < 0) velocidadeX *= -1;
                } else if (velocidadeX > 0) velocidadeX *= -1;

                soltarParticulas(posX, posY, velocidadeX, velocidadeY, jogadores[i]);
            }
        }


        //pisada
        if (teclas[i].baixo.pressionada && jogadores[i].podePisar) {
            if (jogadores[i].velocidade.y <= 0) jogadores[i].velocidade.y += jogadores[i].pisadaBase * 1.4;
            else jogadores[i].velocidade.y += jogadores[i].pisadaBase;

            jogadores[i].podePisar = false; //gasta a pisada
            jogadores[i].estaDandoPisada = true;
        }

        //solta partícula enquanto o jogador estiver dando uma pisada
        if (jogadores[i].estaDandoPisada && jogadores[i].soltaParticula) {
            jogadores[i].soltaParticula = false;

            let posX = jogadores[i].position.x + jogadores[i].width / 2 + ((Math.random() - 0.5) * 30);
            let posY = jogadores[i].position.y + jogadores[i].height;

            let velocidadeX = (Math.random() - 0.5);
            let velocidadeY = (Math.random() * -1);

            if (velocidadeX > 0 && jogadores[i].velocidade.x > 0) {
                velocidadeX *= -1;
            } else if (velocidadeX < 0 && jogadores[i].velocidade.x < 0) velocidadeX *= -1;

            soltarParticulas(posX, posY, velocidadeX, velocidadeY, jogadores[i])

            setTimeout(() => {
                jogadores[i].soltaParticula = true;
            }, 10);

        }

        //dash
        if (teclas[i].dash.pressionada && jogadores[i].podeDarDash) {
            if (jogadores[i].orientacao == 'direita') {
                if (jogadores[i].velocidade.x == 0) jogadores[i].velocidade.x += jogadores[i].dashBase * 1.4;
                else jogadores[i].velocidade.x += jogadores[i].dashBase;
            }
            else {
                if (jogadores[i].velocidade.x == 0) jogadores[i].velocidade.x -= jogadores[i].dashBase * 1.4;
                else jogadores[i].velocidade.x -= jogadores[i].dashBase;
            }

            jogadores[i].velocidade.y = 0;

            jogadores[i].estaDandoDash = true;
            jogadores[i].podeDarDash = false;
            teclas[i].dash.pressionada = false;
            jogadores[i].soltaParticula = true;
            jogadores[i].estaDandoPisada = false;

            // duração da animação do dash
            setTimeout(() => {
                jogadores[i].estaDandoDash = false;
            }, 120); //tempo da animaçao 120ms

            //cooldown do dash
            setTimeout(() => {
                jogadores[i].podeDarDash = true;
            }, jogadores[i].dashCooldown);

            // particulas do dash
            for (let j = 0; j < 1; j++) {
                let posX = jogadores[i].position.x + jogadores[i].width / 2;
                let posY = jogadores[i].position.y + jogadores[i].height + ((Math.random() - 0.5) * 30);

                let velocidadeX = (Math.random() - 0.5) * 6;
                let velocidadeY = (Math.random() - 0.5);

                if (velocidadeX > 0 && jogadores[i].velocidade.x > 0) {
                    velocidadeX *= -1;
                } else if (velocidadeX < 0 && jogadores[i].velocidade.x < 0) velocidadeX *= -1;

                particulas.push(
                    new Particula({
                        x: posX,
                        y: posY,
                        raio: Math.random() * 2 + 1,
                        cor: jogadores[i].cor,
                        velocidade: {
                            x: velocidadeX,
                            y: velocidadeY,
                        }
                    })
                )
            }
        }

        //solta partícula enquanto o jogador estiver dando dash
        if (jogadores[i].estaDandoDash) { //&& jogadores[i].soltaParticula) {
            // jogadores[i].soltaParticula = false;

            let posX = jogadores[i].position.x + jogadores[i].width / 2;
            let posY = jogadores[i].position.y + jogadores[i].height + ((Math.random() - 0.5) * 30);

            let velocidadeX = (Math.random() - 0.5);
            let velocidadeY = (Math.random() - 0.5);

            if (velocidadeX > 0 && jogadores[i].velocidade.x > 0) {
                velocidadeX *= -1;
            } else if (velocidadeX < 0 && jogadores[i].velocidade.x < 0) velocidadeX *= -1;

            soltarParticulas(posX, posY, velocidadeX, velocidadeY, jogadores[i])

            // setTimeout(() => {
            //     jogadores[i].soltaParticula = true;
            // }, 1);

        }

        //ataque
        if (teclas[i].ataque.pressionada && jogadores[i].podeAtacar) { //condição de ataque
            let orientacaoAtaque = jogadores[i].orientacao == 'direita' ? 1 : -1; //definindo a orientação do ataque
            console.log(orientacaoAtaque);

            let ataqueValido = false;

            if (outroJogador.position.y + outroJogador.height >= jogadores[i].position.y && outroJogador.position.y <= jogadores[i].position.y + jogadores[i].height) {//condição de proximidade para o ataque (jogadores alinhados verticalmente)
                //verificando se o ataque para a DIREITA é válido
                if (jogadores[i].orientacao == 'direita' && outroJogador.position.x <= jogadores[i].position.x + jogadores[i].width + jogadores[i].alcanceBase && outroJogador.position.x >= jogadores[i].position.x) { //condição de proximidade horizontal (alcance pode ser ajustado)
                    ataqueValido = true;
                }
                //verificando se o ataque para a ESQUERDA é válido
                if (jogadores[i].orientacao == 'esquerda' && outroJogador.position.x + outroJogador.width >= jogadores[i].position.x - jogadores[i].alcanceBase && outroJogador.position.x + outroJogador.width <= jogadores[i].position.x + jogadores[i].width) { //condição de proximidade horizontal (alcance pode ser ajustado)
                    ataqueValido = true;
                }


                if (ataqueValido) { //efeitos do ataque
                    teclas[i].ataque.pressionada = false;

                    jogadores[i].podeAtacar = false;
                    outroJogador.estaSendoAtacado = true;
                    outroJogador.velocidade.x = orientacaoAtaque * jogadores[i].ataqueBase; //o quanto o oponente é arremessado (e em qual direção)

                    //duração da animação de ataque
                    setTimeout(() => {
                        outroJogador.estaSendoAtacado = false;
                    }, 170); //tempo da animação 100ms
                }
            }
        }
    }


    //colisões (jogador-jogador e jogador-plataforma)
    jogadores.forEach(jogador => {
        let outroJogador = jogadores[1];
        if (outroJogador == jogador) outroJogador = jogadores[0];

        jogador.podePular = false; //impede que o jogador pule no ar



        //colisões jogador-plataforma
        plataformas.forEach(plataforma => {
            // colisão com plataformas na vertical para baixo
            if (jogador.position.y + jogador.height <= plataforma.position.y && jogador.position.y + jogador.height + jogador.velocidade.y >= plataforma.position.y && jogador.position.x + jogador.width > plataforma.position.x && jogador.position.x < plataforma.position.x + plataforma.width) {
                jogador.velocidade.y = 0;
                jogador.position.y = plataforma.position.y - jogador.height;

                jogador.podePular = true; // permite que o jogador pule (pois está em cima de uma plataforma)
                jogador.podeDoubleJump = true;
                jogador.podePisar = false; // impede que o jogador dê uma pisada
                jogador.estaDandoPisada = false;
                
            }

            // fix caso entre dentro da plataforma com outro jogador em cima
            if (jogador.position.y + jogador.height > plataforma.position.y && jogador.position.y < plataforma.position.y + plataforma.height && jogador.position.x + jogador.width > plataforma.position.x && jogador.position.x < plataforma.position.x + plataforma.width && outroJogador.position.x + outroJogador.width >= jogador.position.x && outroJogador.position.x <= jogador.position.x + jogador.width && outroJogador.position.y + outroJogador.height >= jogador.position.y - 4 && jogador.position.y > outroJogador.position.y + outroJogador.height) {
                outroJogador.position.y = plataforma.position.y - jogador.height - outroJogador.height;
                jogador.position.y = plataforma.position.y - jogador.height;

                outroJogador.velocidade.y = 0;
                jogador.velocidade.y = 0;

                // jogador.position.y = plataforma.position.y - jogador.height;
                // jogador.velocidade.y = 0;

                // if (outroJogador.position.y + outroJogador.height > jogador.position.y && outroJogador.position.y < jogador.position.y + jogador.height) {
                //     jogador.position.x = outroJogador.position.x + outroJogador.width;
                //     outroJogador.velocidade.y -= 1;
                // }
            }
            
            if (plataforma.colisoes) {
                // colisão com plataformas na vertical para cima (também cuida de casos em que o jogador entra dentro da plataforma)
                if (((jogador.position.y >= plataforma.position.y + plataforma.height && jogador.position.y + jogador.velocidade.y <= plataforma.position.y + plataforma.height) || (jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.y > plataforma.position.y)) && jogador.position.x + jogador.width > plataforma.position.x && jogador.position.x < plataforma.position.x + plataforma.width) {
                    jogador.position.y = plataforma.position.y + plataforma.height;
                    jogador.velocidade.y = 0.1;

                    jogador.podePular = false; // impede que o jogador pule (pois há uma plataforma acima)
                }

                if (jogador.encostandoEmParede && jogador.seMoveu) { //fix pra bug em que um jogador entra dentro do outro quando estao encostados em uma parede e andando
                    jogador.encostandoEmParede = false;
                }

                // colisão com plataformas na horizontal esquerda para direita
                if (jogador.position.y + jogador.height >= plataforma.position.y && jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.x + jogador.width <= plataforma.position.x && jogador.position.x + jogador.width + jogador.velocidade.x >= plataforma.position.x) {
                    if (jogador.position.x + jogador.width < plataforma.position.x) {
                        jogador.position.x = plataforma.position.x - jogador.width;
                    }

                    jogador.encostandoEmParede = true; //fix pra bug em que um jogador entra dentro do outro quando estao encostados em uma parede e andando
                    jogador.seMoveu = false; //fix pra bug em que um jogador entra dentro do outro quando estao encostados em uma parede e andando
                    jogador.velocidade.x = 0;
                }

                // colisão com plataformas na horizontal direita para esquerda
                if (jogador.position.y + jogador.height >= plataforma.position.y && jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.x >= plataforma.position.x + plataforma.width && jogador.position.x + jogador.velocidade.x <= plataforma.position.x + plataforma.width) {
                    if (jogador.position.x > plataforma.position.x + plataforma.width) {
                        jogador.position.x = plataforma.position.x + plataforma.width;
                    }

                    console.log("COLISAO")

                    jogador.encostandoEmParede = true;
                    jogador.seMoveu = false;
                    jogador.velocidade.x = 0;
                }
            }
        })


        //colisões jogador-jogador

        // players na vertical pra baixo
        if (jogador.position.y + jogador.height <= outroJogador.position.y + outroJogador.velocidade.y && jogador.position.y + jogador.height + jogador.velocidade.y >= outroJogador.position.y + outroJogador.velocidade.y && jogador.position.x + jogador.width > outroJogador.position.x && jogador.position.x < outroJogador.position.x + outroJogador.width) {
            jogador.velocidade.y = -0.1;
            jogador.position.y = outroJogador.position.y - jogador.height;

            jogador.podePular = true; // permite que o jogador pule (pois está em cima do outro jogador)
            jogador.podeDoubleJump = false;
            jogador.podePisar = false; // impede que o jogador dê uma pisada
            jogador.estaDandoPisada = false;
        }

        // players na vertical para cima (também cuida de casos em que o jogador entra dentro do outro)
        // if (((jogador.position.y >= outroJogador.position.y + outroJogador.height && jogador.position.y + jogador.velocidade.y <= outroJogador.position.y + outroJogador.height) || (jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.y > outroJogador.position.y)) && jogador.position.x + jogador.width > outroJogador.position.x && jogador.position.x < outroJogador.position.x + outroJogador.width) {
        //     jogador.position.y = outroJogador.position.y + outroJogador.height;
        //     jogador.velocidade.y = 0;

        //      console.log("TESTE")   
        // }

        // detectando se há um jogador acima do outro
        if (outroJogador.position.y + outroJogador.height >= jogador.position.y - 0.3 && outroJogador.position.y + outroJogador.height < jogador.position.y + 0.3 && jogador.position.x + jogador.width >= outroJogador.position.x && jogador.position.x <= outroJogador.position.x + outroJogador.width) { //0.3 é uma margem de segurança
            jogador.podePular = false; // impede que o jogador pule (pois há outro jogador em cima)
        }

        // players na horizontal esquerda para direita
        if (jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.x + jogador.width <= outroJogador.position.x && jogador.position.x + jogador.width + jogador.velocidade.x >= outroJogador.position.x + outroJogador.velocidade.x) {
            //colisão
            if (jogador.position.x + jogador.width < outroJogador.position.x && jogador.velocidade.x != 0) {
                jogador.position.x = outroJogador.position.x - jogador.width;
            }

            jogador.velocidade.x = 0;

            if (!outroJogador.encostandoEmParede) outroJogador.velocidade.x += 1;

            if (jogador.estaDandoDash) { //impacto no dash joga o outro jogador pra frente
                outroJogador.estaDandoDash = true;

                outroJogador.velocidade.x += jogador.dashBase / 2; //outro jogador ganha metade da velocidade do jogador que bateu nele

                setTimeout(() => {
                    outroJogador.estaDandoDash = false;
                }, 100); //tempo da animação 100ms

                //jogador que bateu é arremessado pra trás
                jogador.estaDandoDash = true;
                jogador.velocidade.x = -3;

                setTimeout(() => {
                    jogador.estaDandoDash = false;
                }, 30); //tempo da animação 100ms
            }
        }

        // if(jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height  &&  jogador.position.x + jogador.width <= outroJogador.position.x  &&  jogador.position.x + jogador.width + jogador.velocidade.x >= outroJogador.position.x + outroJogador.velocidade.x) {
        //   console.log('DESGRAÇA');
        //   outroJogador.velocidade.x = 0;
        //   outroJogador.position.x = jogador.position.x + jogador.width;
        // }

        // if(jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height  &&  jogador.position.x >= outroJogador.position.x + outroJogador.width  &&  jogador.position.x + jogador.velocidade.x <= outroJogador.position.x + outroJogador.width + outroJogador.velocidade.x) {
        //   console.log('DESGRAÇA 2');
        //   outroJogador.velocidade.x = 0;
        //   outroJogador.position.x = jogador.position.x - jogador.width;
        // }

        // players na horizontal direita para esquerda
        if (jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.x >= outroJogador.position.x + outroJogador.width && jogador.position.x + jogador.velocidade.x <= outroJogador.position.x + outroJogador.width + outroJogador.velocidade.x) {


            //colisão
            if (jogador.position.x > outroJogador.position.x + outroJogador.width && jogador.velocidade.x != 0) {
                jogador.position.x = outroJogador.position.x + outroJogador.width;
            }

            jogador.velocidade.x = 0;
            if (!outroJogador.encostandoEmParede) outroJogador.velocidade.x -= 1;

            if (jogador.estaDandoDash) { //impacto no dash joga o outro jogador pra frente
                outroJogador.estaDandoDash = true;

                outroJogador.velocidade.x -= jogador.dashBase / 2; //outro jogador ganha metade da velocidade do jogador que bateu nele

                setTimeout(() => {
                    outroJogador.estaDandoDash = false;
                }, 100); //tempo da animação 100ms

                //jogador que bateu é arremessado pra trás
                jogador.estaDandoDash = true;
                jogador.velocidade.x = 3;

                setTimeout(() => {
                    jogador.estaDandoDash = false;
                }, 30); //tempo da animação 100ms
            }
        }
    })
}


animar(); //inicia o jogo


//detecção das teclas
window.addEventListener('keydown', ({ code }) => {
    switch (code) {
        // teclas do jogador 0
        case 'KeyW': // apertou W
            teclas[0].cima.pressionada = true;
            break;
        case 'KeyA': // apertou A
            teclas[0].esquerda.pressionada = true;
            break;
        case 'KeyS': // apertou S
            teclas[0].baixo.pressionada = true;
            break;
        case 'KeyD': // apertou D
            teclas[0].direita.pressionada = true;
            break;
        case 'ShiftLeft': // apertou SHIFT esquerdo
            teclas[0].dash.pressionada = true;
            break;
        case 'KeyG': // apertou G (ataque)
            teclas[0].ataque.pressionada = true;
            break;

        // teclas do jogador 1
        case 'ArrowUp': // apertou CIMA
            teclas[1].cima.pressionada = true;
            break;
        case 'ArrowLeft': // apertou ESQUERDA
            teclas[1].esquerda.pressionada = true;
            break;
        case 'ArrowDown': // apertou BAIXO
            teclas[1].baixo.pressionada = true;
            break;
        case 'ArrowRight': // apertou DIREITA
            teclas[1].direita.pressionada = true;
            break;
        case 'ControlRight': // apertou CTRL direito
            teclas[1].dash.pressionada = true;
            break;
        case 'Numpad0': // apertou 0 (ataque)
            teclas[1].ataque.pressionada = true;
            break;
    }
});


window.addEventListener('keyup', ({ code }) => { //quando soltar a tecla
    console.log(code);

    switch (code) {
        //teclas do jogador 0
        case 'KeyW': //soltou W
            teclas[0].cima.pressionada = false;
            jogadores[0].debounce = false; //permite que dê double jump
            break;
        case 'KeyA': //soltou A
            teclas[0].esquerda.pressionada = false;
            break;
        case 'KeyS': //soltou S
            teclas[0].baixo.pressionada = false;
            break;
        case 'KeyD': //soltou D
            teclas[0].direita.pressionada = false;
            break;
        case 'ShiftLeft': //soltou SHIFT
            teclas[0].dash.pressionada = false;
            break;
        case 'KeyG': //soltou G (ataque)
            teclas[0].ataque.pressionada = false;
            jogadores[0].podeAtacar = true;
            break;

        //teclas do jogador 1
        case 'ArrowUp': //soltou CIMA
            teclas[1].cima.pressionada = false;
            jogadores[1].debounce = false; //permite que dê double jump
            break;
        case 'ArrowLeft': //soltou ESQUERDA
            teclas[1].esquerda.pressionada = false;
            break;
        case 'ArrowDown': //soltou BAIXO
            teclas[1].baixo.pressionada = false;
            break;
        case 'ArrowRight': //soltou DIREITA
            teclas[1].direita.pressionada = false;
            break;
        case 'ControlRight': // soltou CTRL
            teclas[1].dash.pressionada = false;
            break;
        case 'Numpad0': // soltou 0 (ataque)
            teclas[1].ataque.pressionada = false;
            jogadores[1].podeAtacar = true;
            break;
    }
})