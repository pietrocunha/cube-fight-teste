import plataforma from './imgs/plataforma-primavera-principal.jpg'

console.log(plataforma)

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//ajuste do tamanho do espaço do jogo (parte jogável)
canvas.width = 1600; //innerWidth
canvas.height = 900; //innerHeight


class Jogador {
    constructor({ cor }) { //propriedades do jogador
        this.position = {
            x: 100,
            y: 100
        }
        this.velocidade = {
            x: 0,
            y: 1
        }

        this.width = 40
        this.height = 40

        this.velocidadeBase = 4;
        this.saltoBase = 5;
        this.gravidadeBase = 0.08;
        this.pisadaBase = 8;
        this.dashBase = 7;
        this.dashCooldown = 500; // tempo em ms
        this.ataqueBase = 12;
        this.alcanceBase = 45;

        this.podePular = false;
        this.podePisar = false;
        this.podeDarDash = true;
        this.podeAtacar = true;

        this.orientacao = 'direita';
        this.estaDandoDash = false;
        this.estaSendoAtacado = false;

        this.cor = cor;
    }

    desenhar() { //desenha o jogador na tela
        c.fillStyle = this.cor
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() { //atualiza as propriedades do jogador
        this.desenhar()
        this.position.y += this.velocidade.y
        this.position.x += this.velocidade.x

        if (this.position.y + this.height + this.velocidade.y <= canvas.height)
            this.velocidade.y += this.gravidadeBase; //acelera com a gravidade
        else {
            this.velocidade.y = 0;
            this.position.y = canvas.height - this.height;
        }
    }
}

class Plataforma {
    constructor({ x, y, width, height, cor }) { //propriedades de uma plataforma
        this.position = {
            x: x,
            y: y
        }

        this.width = width
        this.height = height

        this.cor = cor
    }

    desenhar() { //desenha a plataforma na tela
        c.fillStyle = this.cor
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

//criação dos jogadores
const jogadores = [new Jogador({
    cor: 'red'
}), new Jogador({
    cor: 'green'
})];

//criação das plataformas
const plataformas = [new Plataforma({
    x: 200, y: 600, width: 200, height: 200, cor: 'blue'
}), new Plataforma({
    x: 500, y: 750, width: 200, height: 50, cor: 'blue'
}), new Plataforma({
    x: 860, y: 800, width: 200, height: 50, cor: 'blue'
}), new Plataforma({
    x: -1200, y: 850, width: 4000, height: 200, cor: 'blue'
})];

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

function animar() { //função principal que atualiza a tela
    requestAnimationFrame(animar); // loop infinito

    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    jogadores.forEach(jogador => {
        jogador.update(); //atualiza o jogador
    })

    plataformas.forEach(plataforma => {
        plataforma.desenhar() //atualiza as plataformas
    })


    //movimento dos jogadores
    for (let i = 0; i < 2; i++) { //i assume 0 e 1 (só podem ter 2 jogadores)

        //movimentos horizontais
        if (teclas[i].direita.pressionada) {
            if ((jogadores[i].estaDandoDash && jogadores[i].orientacao == 'esquerda') || !jogadores[i].estaDandoDash) { // verificação se o jogador está dando dash
                if (!jogadores[i].estaSendoAtacado) { // verificação se o jogador está sendo atacado
                    jogadores[i].velocidade.x = jogadores[i].velocidadeBase; //velocidade para a direita
                }

                jogadores[i].orientacao = 'direita';
            }

        } else if (teclas[i].esquerda.pressionada) {
            if ((jogadores[i].estaDandoDash && jogadores[i].orientacao == 'direita') || !jogadores[i].estaDandoDash) { // verificação se o jogador está dando dash
                if (!jogadores[i].estaSendoAtacado) { // verificação se o jogador está sendo atacado
                    jogadores[i].velocidade.x = -jogadores[i].velocidadeBase; //velocidade para a esquerda
                }

                jogadores[i].orientacao = 'esquerda';
            }

        } else if (!jogadores[i].estaDandoDash && !jogadores[i].estaSendoAtacado) {
            jogadores[i].velocidade.x = 0;
        }


        //salto
        if (teclas[i].cima.pressionada && jogadores[i].podePular) { // salto (somente se o jogador estiver pisando em uma plataforma ou em outro jogador)
            jogadores[i].velocidade.y -= jogadores[i].saltoBase;

            jogadores[i].podePisar = true; //carrega a pisada
        }


        //pisada
        if (teclas[i].baixo.pressionada && jogadores[i].podePisar) {
            jogadores[i].velocidade.y += jogadores[i].pisadaBase;

            jogadores[i].podePisar = false; //gasta a pisada
        }

        //dash
        if (teclas[i].dash.pressionada && jogadores[i].podeDarDash) {
            if (jogadores[i].orientacao == 'direita') jogadores[i].velocidade.x += jogadores[i].dashBase;
            else jogadores[i].velocidade.x -= jogadores[i].dashBase;

            jogadores[i].estaDandoDash = true;
            jogadores[i].podeDarDash = false;

            // duração da animação do dash
            setTimeout(() => {
                jogadores[i].estaDandoDash = false;
            }, 120); //tempo da animaçao 120ms

            //cooldown do dash
            setTimeout(() => {
                jogadores[i].podeDarDash = true;
            }, jogadores[i].dashCooldown);
        }


        //ataque
        let outroJogador = jogadores[1]; //definindo o outro jogador
        if (outroJogador == jogadores[i]) outroJogador = jogadores[0];

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
                jogador.podePisar = false; // impede que o jogador dê uma pisada
            }

            // colisão com plataformas na vertical para cima (também cuida de casos em que o jogador entra dentro da plataforma)
            if (((jogador.position.y >= plataforma.position.y + plataforma.height && jogador.position.y + jogador.velocidade.y <= plataforma.position.y + plataforma.height) || (jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.y > plataforma.position.y)) && jogador.position.x + jogador.width > plataforma.position.x && jogador.position.x < plataforma.position.x + plataforma.width) {
                jogador.position.y = plataforma.position.y + plataforma.height;
                jogador.velocidade.y = 0.1;

                jogador.podePular = false; // impede que o jogador pule (pois há uma plataforma acima)
            }

            // fix caso entre dentro da plataforma com outro jogador em cima
            if (jogador.position.y + jogador.height > plataforma.position.y && jogador.position.y < plataforma.position.y + plataforma.height && jogador.position.x + jogador.width > plataforma.position.x && jogador.position.x < plataforma.position.x + plataforma.width) {
                jogador.position.y = plataforma.position.y - jogador.height;
                jogador.velocidade.y = 0;

                if (outroJogador.position.y + outroJogador.height > jogador.position.y && outroJogador.position.y < jogador.position.y + jogador.height) {
                    outroJogador.velocidade.y -= 1;
                }
            }

            // colisão com plataformas na horizontal esquerda para direita
            if (jogador.position.y + jogador.height >= plataforma.position.y && jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.x + jogador.width <= plataforma.position.x && jogador.position.x + jogador.width + jogador.velocidade.x >= plataforma.position.x) {
                if (jogador.position.x + jogador.width < plataforma.position.x) {
                    jogador.position.x = plataforma.position.x - jogador.width;
                }

                jogador.velocidade.x = 0;
            }

            // colisão com plataformas na horizontal direita para esquerda
            if (jogador.position.y + jogador.height >= plataforma.position.y && jogador.position.y <= plataforma.position.y + plataforma.height && jogador.position.x >= plataforma.position.x + plataforma.width && jogador.position.x + jogador.velocidade.x <= plataforma.position.x + plataforma.width) {
                if (jogador.position.x > plataforma.position.x + plataforma.width) {
                    jogador.position.x = plataforma.position.x + plataforma.width;
                }

                jogador.velocidade.x = 0;
            }
        })


        //colisões jogador-jogador

        // players na vertical pra baixo
        if (jogador.position.y + jogador.height <= outroJogador.position.y && jogador.position.y + jogador.height + jogador.velocidade.y >= outroJogador.position.y && jogador.position.x + jogador.width > outroJogador.position.x && jogador.position.x < outroJogador.position.x + outroJogador.width) {
            jogador.velocidade.y = -0.1;
            jogador.position.y = outroJogador.position.y - jogador.height;

            jogador.podePular = true; // permite que o jogador pule (pois está em cima do outro jogador)
            jogador.podePisar = false; // impede que o jogador dê uma pisada
        }

        // players na vertical para cima (também cuida de casos em que o jogador entra dentro do outro)
        if (((jogador.position.y >= outroJogador.position.y + outroJogador.height && jogador.position.y + jogador.velocidade.y <= outroJogador.position.y + outroJogador.height) || (jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.y > outroJogador.position.y)) && jogador.position.x + jogador.width > outroJogador.position.x && jogador.position.x < outroJogador.position.x + outroJogador.width) {
            jogador.position.y = outroJogador.position.y + outroJogador.height;
            jogador.velocidade.y = 0;
        }

        // detectando se há um jogador acima do outro
        if (outroJogador.position.y + outroJogador.height >= jogador.position.y - 0.3 && outroJogador.position.y + outroJogador.height < jogador.position.y + 0.3 && jogador.position.x + jogador.width >= outroJogador.position.x && jogador.position.x <= outroJogador.position.x + outroJogador.width) { //0.3 é uma margem de segurança
            jogador.podePular = false; // impede que o jogador pule (pois há outro jogador em cima)
        }

        // players na horizontal esquerda para direita
        if (jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.x + jogador.width <= outroJogador.position.x && jogador.position.x + jogador.width + jogador.velocidade.x >= outroJogador.position.x) {
            if (jogador.position.x + jogador.width < outroJogador.position.x) {
                jogador.position.x = outroJogador.position.x - jogador.width;
            }

            jogador.velocidade.x = 0;
        }

        // players na horizontal direita para esquerda
        if (jogador.position.y + jogador.height >= outroJogador.position.y && jogador.position.y <= outroJogador.position.y + outroJogador.height && jogador.position.x >= outroJogador.position.x + outroJogador.width && jogador.position.x + jogador.velocidade.x <= outroJogador.position.x + outroJogador.width) {
            if (jogador.position.x > outroJogador.position.x + outroJogador.width) {
                jogador.position.x = outroJogador.position.x + outroJogador.width;
            }

            jogador.velocidade.x = 0;
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
        case 'ArrowUp': //apertou CIMA
            teclas[1].cima.pressionada = false;
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