


let chapeusEl = document.querySelectorAll(".chapeu"); //Guarda todas as imagem de chapéu (player 1 e 2)
let carasEl = document.querySelectorAll(".cara");//Guarda todas as imagem de cara (player 1 e 2)
let roupasEl = document.querySelectorAll(".roupa");//Guarda todas as imagem de roupa (player 1 e 2)
let armasEl = document.querySelectorAll(".arma");//Guarda todas as imagens de arma (player 1 e 2)

let botoesChapeuEl = document.querySelectorAll(".botao-chapeu"); //Guarda todos os botões de chapéu (player 1 e 2)
let botoesRoupaEl = document.querySelectorAll(".botao-roupa"); //Guarda todos os botões de roupa (player 1 e 2)
let botoesCaraEl = document.querySelectorAll(".botao-cara"); //Guarda todos os botões de cara (player 1 e 2)
let botoesArmaEl = document.querySelectorAll(".botao-arma"); //Guarda todos os botões de arma (player 1 e 2)
let botaoJogarEl = document.querySelector("#botao-jogar"); //Guarda o botão de jogar
let botaoFecharSelecaoArmaEl = document.querySelector("#botao-fechar-selecao-arma"); //Guarda o botão de fechar a seleção de armas

let totalDeChapeus = chapeusEl.length;
let totalDeCaras = carasEl.length;
let totalDeRoupas = roupasEl.length;
let totalDeArmas = armasEl.length;

let containerSelecaoArmasEl = document.querySelector("#selecao-arma");
let containersTodoOPlayerEl = document.querySelectorAll(".todo-o-player");

/*
O total dos acessórios contam tanto para o player um e dois, ou seja, se temos 4 opções de 
chapéu para cada jogador, na verdade o total de chapéus que teremos no vetor será 8.
*/

let posicaoAtualDoChapeuPlayer1 = -1;
let posicaoAtualDaCaraPlayer1 = -1;
let posicaoAtualDaRoupaPlayer1 = -1;
let posicaoAtualDaArmaPlayer1 = -1;

/*
Variáveis para guardar qual acessório respectivamente o player um está vestindo. A posição -1 
representa a não equipação de acessórios pelo jogador
*/

let posicaoAtualDoChapeuPlayer2 = totalDeChapeus / 2 - 1;
let posicaoAtualDaCaraPlayer2 = totalDeCaras / 2 - 1;
let posicaoAtualDaRoupaPlayer2 = totalDeRoupas / 2 - 1;
let posicaoAtualDaArmaPlayer2 = totalDeArmas / 2 - 1;

/*
Variáveis para guardar qual acessório respectivamente o player dois está vestindo. A posição 
totalDe... / 2 - 1 representa a não equipação de acessórios pelo jogador.
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function mudarChapeu(event) { //Função para mudar o chapéu
    let botaoClicadoEl = event.currentTarget;

    if (botaoClicadoEl.id == "botao-chapeu-passar-player1") { //Verifica qual foi o botão clicado
        if (posicaoAtualDoChapeuPlayer1 > -1) {
            chapeusEl[posicaoAtualDoChapeuPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDoChapeuPlayer1++;
        //soma um na posição dos chapéis do jogador

        if (posicaoAtualDoChapeuPlayer1 >= totalDeChapeus / 2) {
            posicaoAtualDoChapeuPlayer1 = -1;
            return;
        }
        /*
        caso passe da última posição dos chapéis do player 1 (representada pelo total dividido por 2
        já que o vetor das imagens possui os chapéis dos dois players), voltar para a posição inicial
        (sem equipar nada)
        */

        chapeusEl[posicaoAtualDoChapeuPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-chapeu-voltar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDoChapeuPlayer1 > -1) {
            chapeusEl[posicaoAtualDoChapeuPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.


        posicaoAtualDoChapeuPlayer1--;
        //subtrai um na posição dos chapéis do jogador

        if (posicaoAtualDoChapeuPlayer1 === -1) {
            return;
        }
        //caso o jogador tenha voltado para a posição onde ele não veste nada, sai da função

        if (posicaoAtualDoChapeuPlayer1 < -1) {
            posicaoAtualDoChapeuPlayer1 = totalDeChapeus / 2 - 1;
        }
        /*
        caso o jogador volte uma posição enquanto está na posição -1, levar ele para a última posição,
        que é o total / 2 - 1
        */

        chapeusEl[posicaoAtualDoChapeuPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-chapeu-passar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDoChapeuPlayer2 >= totalDeChapeus / 2) {
            chapeusEl[posicaoAtualDoChapeuPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDoChapeuPlayer2++;
        //soma um na posição dos chapéis do jogador

        if (posicaoAtualDoChapeuPlayer2 >= totalDeChapeus) {
            posicaoAtualDoChapeuPlayer2 = totalDeChapeus / 2 - 1;
        }
        //Se tiver passado da última posição, voltar para a primeira

        if (posicaoAtualDoChapeuPlayer2 === totalDeChapeus / 2 - 1) {
            return;
        }
        /*
        A posição total.. / 2 - 1 representa a não equipação de acessórios pelo jogador. 
        Caso esteja nela, sair da função antes de colocar um acessório.
        */

        chapeusEl[posicaoAtualDoChapeuPlayer2].classList.add("habilitar");
        //colocar o acessório da posição atual
    }

    if (botaoClicadoEl.id == "botao-chapeu-voltar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDoChapeuPlayer2 >= totalDeChapeus / 2) {
            chapeusEl[posicaoAtualDoChapeuPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDoChapeuPlayer2--;
        //subtrai um na posição dos chapéis do jogador

        if (posicaoAtualDoChapeuPlayer2 < totalDeChapeus / 2 - 1) {
            posicaoAtualDoChapeuPlayer2 = totalDeChapeus - 1;
        }
        /*
        Se tiver voltado até antes da primeira posição, levar ele pra última
        */

        if (posicaoAtualDoChapeuPlayer2 === totalDeChapeus / 2 - 1) {
            return;
        }
        //Se estiver na posição da não equipação de acessórios, sair da função antes de trocar o acessório

        chapeusEl[posicaoAtualDoChapeuPlayer2].classList.add("habilitar");
        //troca o acessório para a posição atual
    }
}



function mudarCara(event) { //Função para mudar a cara
    let botaoClicadoEl = event.currentTarget;

    if (botaoClicadoEl.id == "botao-cara-passar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaCaraPlayer1 > -1) {
            carasEl[posicaoAtualDaCaraPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaCaraPlayer1++;
        //soma um na posição das caras do jogador

        if (posicaoAtualDaCaraPlayer1 >= totalDeCaras / 2) {
            posicaoAtualDaCaraPlayer1 = -1;
            return;
        }
        /*
        caso passe da última posição dos chapéis do player 1 (representada pelo total dividido por 2
        já que o vetor das imagens possui os chapéis dos dois players), voltar para a posição inicial
        (sem equipar nada)
        */

        carasEl[posicaoAtualDaCaraPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-cara-voltar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaCaraPlayer1 > -1) {
            carasEl[posicaoAtualDaCaraPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaCaraPlayer1--;
        //subtrai um na posição das caras do jogador

        if (posicaoAtualDaCaraPlayer1 === -1) {
            return;
        }
        //caso o jogador tenha voltado para a posição onde ele não veste nada, sai da função antes de trooar acessório

        if (posicaoAtualDaCaraPlayer1 < -1) {
            posicaoAtualDaCaraPlayer1 = totalDeCaras / 2 - 1;
        }
        /*
        caso o jogador volte uma posição enquanto está na posição -1, levar ele para a última posição,
        que é o total / 2 - 1
        */

        carasEl[posicaoAtualDaCaraPlayer1].classList.add("habilitar");
         //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-cara-passar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaCaraPlayer2 >= totalDeCaras / 2) {
            carasEl[posicaoAtualDaCaraPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaCaraPlayer2++;
        //soma um na posição das caras do jogador

        if (posicaoAtualDaCaraPlayer2 >= totalDeCaras) {
            posicaoAtualDaCaraPlayer2 = totalDeCaras / 2 - 1;
        }
        //Se tiver passado da última posição, voltar para a primeira

        if (posicaoAtualDaCaraPlayer2 === totalDeCaras / 2 - 1) {
            return;
        }
        /*
        A posição total.. / 2 - 1 representa a não equipação de acessórios pelo jogador. 
        Caso esteja nela, sair da função antes de colocar um acessório.
        */

        carasEl[posicaoAtualDaCaraPlayer2].classList.add("habilitar");
        //colocar o acessório da posição atual
    }

    if (botaoClicadoEl.id == "botao-cara-voltar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaCaraPlayer2 >= totalDeCaras / 2) {
            carasEl[posicaoAtualDaCaraPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaCaraPlayer2--;
        //subtrai um na posição das caras do jogador


        if (posicaoAtualDaCaraPlayer2 < totalDeCaras / 2 - 1) {
            posicaoAtualDaCaraPlayer2 = totalDeCaras - 1;
        }
        /*
        Se tiver voltado até antes da primeira posição, levar ele pra última
        */

        if (posicaoAtualDaCaraPlayer2 === totalDeCaras / 2 - 1) {
            return;
        }
        //Se estiver na posição da não equipação de acessórios, sair da função antes de trocar o acessório

        carasEl[posicaoAtualDaCaraPlayer2].classList.add("habilitar");
        //troca o acessório para a posição atual
    }
}

function mudarRoupa(event) { //Função para mudar a roupa
    let botaoClicadoEl = event.currentTarget;

    if (botaoClicadoEl.id == "botao-roupa-passar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaRoupaPlayer1 > -1) {
            roupasEl[posicaoAtualDaRoupaPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaRoupaPlayer1++;
        //soma um na posição das roupas do jogador

        if (posicaoAtualDaRoupaPlayer1 >= totalDeRoupas / 2) {
            posicaoAtualDaRoupaPlayer1 = -1;
            return;
        }
        /*
        caso passe da última posição dos chapéis do player 1 (representada pelo total dividido por 2
        já que o vetor das imagens possui os chapéis dos dois players), voltar para a posição inicial
        (sem equipar nada)
        */

        roupasEl[posicaoAtualDaRoupaPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-roupa-voltar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaRoupaPlayer1 > -1) {
            roupasEl[posicaoAtualDaRoupaPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaRoupaPlayer1--;
        //subtrai um na posição das roupas do jogador

        if (posicaoAtualDaRoupaPlayer1 === -1) {
            return;
        }
        //caso o jogador tenha voltado para a posição onde ele não veste nada, sai da função antes de trooar acessório

        if (posicaoAtualDaRoupaPlayer1 < -1) {
            posicaoAtualDaRoupaPlayer1 = totalDeRoupas / 2 - 1;
        }
        /*
        caso o jogador volte uma posição enquanto está na posição -1, levar ele para a última posição,
        que é o total / 2 - 1
        */

        roupasEl[posicaoAtualDaRoupaPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-roupa-passar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaRoupaPlayer2 >= totalDeRoupas / 2) {
            roupasEl[posicaoAtualDaRoupaPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaRoupaPlayer2++;
        //soma um na posição das roupas do jogador

        if (posicaoAtualDaRoupaPlayer2 >= totalDeRoupas) {
            posicaoAtualDaRoupaPlayer2 = totalDeRoupas / 2 - 1;
        }
        //Se tiver passado da última posição, voltar para a primeira


        if (posicaoAtualDaRoupaPlayer2 === totalDeRoupas / 2 - 1) {
            return;
        }
        /*
        A posição total.. / 2 - 1 representa a não equipação de acessórios pelo jogador. 
        Caso esteja nela, sair da função antes de colocar um acessório.
        */

        roupasEl[posicaoAtualDaRoupaPlayer2].classList.add("habilitar");
        //colocar o acessório da posição atual
    }

    if (botaoClicadoEl.id == "botao-roupa-voltar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaRoupaPlayer2 >= totalDeRoupas / 2) {
            roupasEl[posicaoAtualDaRoupaPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaRoupaPlayer2--;
        //subtrai um na posição das roupas do jogador

        if (posicaoAtualDaRoupaPlayer2 < totalDeRoupas / 2 - 1) {
            posicaoAtualDaRoupaPlayer2 = totalDeRoupas - 1;
        }
        /*
        Se tiver voltado até antes da primeira posição, levar ele pra última
        */

        if (posicaoAtualDaRoupaPlayer2 === totalDeRoupas / 2 - 1) {
            return;
        }
        //Se estiver na posição da não equipação de acessórios, sair da função antes de trocar o acessório

        roupasEl[posicaoAtualDaRoupaPlayer2].classList.add("habilitar");
        //troca o acessório para a posição atual
    }
}

function mudarArma(event) { //Função para mudar a arma
    let botaoClicadoEl = event.currentTarget;

    if (botaoClicadoEl.id == "botao-arma-passar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaArmaPlayer1 > -1) {
            armasEl[posicaoAtualDaArmaPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaArmaPlayer1++;
        //soma um na posição das armas do jogador

        if (posicaoAtualDaArmaPlayer1 >= totalDeArmas / 2) {
            posicaoAtualDaArmaPlayer1 = -1;
            return;
        }
        /*
        caso passe da última posição dos chapéis do player 1 (representada pelo total dividido por 2
        já que o vetor das imagens possui os chapéis dos dois players), voltar para a posição inicial
        (sem equipar nada)
        */

        armasEl[posicaoAtualDaArmaPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-arma-voltar-player1") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaArmaPlayer1 > -1) {
            armasEl[posicaoAtualDaArmaPlayer1].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido.

        posicaoAtualDaArmaPlayer1--;
        //subtrai um na posição das roupas do jogador

        if (posicaoAtualDaArmaPlayer1 === -1) {
            return;
        }
        //caso o jogador tenha voltado para a posição onde ele não veste nada, sai da função antes de trcoar acessório

        if (posicaoAtualDaArmaPlayer1 < -1) {
            posicaoAtualDaArmaPlayer1 = totalDeArmas / 2 - 1;
        }
        /*
        caso o jogador volte uma posição enquanto está na posição -1, levar ele para a última posição,
        que é o total / 2 - 1
        */

        armasEl[posicaoAtualDaArmaPlayer1].classList.add("habilitar");
        //colocar o acessório da posição atual no jogador
    }

    if (botaoClicadoEl.id == "botao-arma-passar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaArmaPlayer2 >= totalDeArmas / 2) {
            armasEl[posicaoAtualDaArmaPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaArmaPlayer2++;
        //soma um na posição das armas do jogador

        if (posicaoAtualDaArmaPlayer2 >= totalDeArmas) {
            posicaoAtualDaArmaPlayer2 = totalDeArmas / 2 - 1;
        }
        //Se tiver passado da última posição, voltar para a primeira


        if (posicaoAtualDaArmaPlayer2 === totalDeArmas / 2 - 1) {
            return;
        }
        /*
        A posição total.. / 2 - 1 representa a não equipação de acessórios pelo jogador. 
        Caso esteja nela, sair da função antes de colocar um acessório.
        */

        armasEl[posicaoAtualDaArmaPlayer2].classList.add("habilitar");
        //colocar o acessório da posição atual
    }

    if (botaoClicadoEl.id == "botao-arma-voltar-player2") {//Verifica qual foi o botão clicado
        if (posicaoAtualDaArmaPlayer2 >= totalDeArmas / 2) {
            armasEl[posicaoAtualDaArmaPlayer2].classList.remove("habilitar");
        }
        //Se tiver vestindo algum acessório e tiver clicado no botão, remove o acessório previamente vestido

        posicaoAtualDaArmaPlayer2--;
        //subtrai um na posição das armas do jogador

        if (posicaoAtualDaArmaPlayer2 < totalDeArmas / 2 - 1) {
            posicaoAtualDaArmaPlayer2 = totalDeArmas - 1;
        }
        /*
        Se tiver voltado até antes da primeira posição, levar ele pra última
        */

        if (posicaoAtualDaArmaPlayer2 === totalDeArmas / 2 - 1) {
            return;
        }
        //Se estiver na posição da não equipação de acessórios, sair da função antes de trocar o acessório

        armasEl[posicaoAtualDaArmaPlayer2].classList.add("habilitar");
        //troca o acessório para a posição atual
    }
}

function apareceSelecaoDeArma() { //Função para fazer aparecer o container da seleção de arma inicial
    containerSelecaoArmasEl.classList.remove("desabilitado"); //habilita o container

    //reposiciona as imgs do jogador na tela
    containersTodoOPlayerEl.forEach((elementoAtual) => elementoAtual.classList.remove("todo-o-player"));
    containersTodoOPlayerEl.forEach((elementoAtual, indice) => elementoAtual.classList.add(`reposicionar-player${indice + 1}-selecao-arma`));

}

function desapareceSelecaoDeArma() {
    containerSelecaoArmasEl.classList.add("desabilitado"); //habilita o container

    //reposiciona as imgs do jogador na tela
    containersTodoOPlayerEl.forEach((elementoAtual, indice) => elementoAtual.classList.remove(`reposicionar-player${indice + 1}-selecao-arma`));
    containersTodoOPlayerEl.forEach((elementoAtual) => elementoAtual.classList.add("todo-o-player"));

    armasEl.forEach((elementoAtual) => elementoAtual.classList.remove("habilitar"));
    posicaoAtualDaArmaPlayer1 = -1;
    posicaoAtualDaArmaPlayer2 = totalDeArmas / 2 - 1;
}


botoesChapeuEl.forEach((elementoAtual) => elementoAtual.addEventListener('click', mudarChapeu)); 
botoesCaraEl.forEach((elementoAtual) => elementoAtual.addEventListener('click', mudarCara));
botoesRoupaEl.forEach((elementoAtual) => elementoAtual.addEventListener('click', mudarRoupa));
botoesArmaEl.forEach((elementoAtual) => elementoAtual.addEventListener('click', mudarArma));

botaoJogarEl.addEventListener('click', apareceSelecaoDeArma);
botaoFecharSelecaoArmaEl.addEventListener('click', desapareceSelecaoDeArma);

//Adicionar os eventos de clique aos botões



// ajusta a escala da página
function ajustarEscala() {
    const baseW = 1440;
    const baseH = 900;
    const proporcao = baseW / baseH;

    let largura = window.innerWidth;
    let altura = window.innerHeight;

    if (largura / altura > proporcao) {
        largura = altura * proporcao;
    } else {
        altura = largura / proporcao;
    }

    const escala = largura / baseW;

    document.documentElement.style.setProperty('--scale', escala);
}

ajustarEscala();
window.addEventListener('resize', ajustarEscala);


// impede zoom
window.addEventListener('wheel', e => {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });

window.addEventListener('keydown', e => {
    if (e.ctrlKey && ['+', '-', '='].includes(e.key)) e.preventDefault();
});