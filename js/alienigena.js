const larguraJogo = 700; // Definindo a largura do jogo
const alturaJogo = 850; // Definindo a altura do jogo
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300}, // Configuração da gravidade
            debug: false // Modo de depuração desativado para física
        }
    },
    scene: {
        preload: preload, // Função para carregar recursos
        create: create, // Função para criar elementos do jogo
        update: update // Função para atualizar lógica do jogo
    }
};

const game = new Phaser.Game (config); // Criação do objeto de jogo com a configuração definida

var alien; // Declaração de variável para o alienígena
var plataforma; // Declaração de variável para a plataforma
var teclado; // Declaração de variável para as teclas do teclado
var fogo; // Declaração de variável para o efeito de turbo
var moeda;
var pontuacao = 0;
var placar;

function preload () {
    // Função para carregar recursos
    this.load.image("background", "assets/bg.png"); // Carrega a imagem de fundo
    this.load.image("alien", "assets/alienigena.png"); // Carrega a imagem do alienígena
    this.load.image("turbo", "assets/turbo.png"); // Carrega a imagem do turbo
    this.load.image("plataforma", "assets/tijolos.png"); // Carrega a imagem da plataforma
    this.load.image("moeda", "assets/moeda.png"); // Carrega a imagem da moeda
}

function create () {
    // Função para criar elementos do jogo
    this.add.image(larguraJogo/2, alturaJogo/2, "background"); // Adiciona a imagem de fundo

    alien = this.physics.add.sprite(larguraJogo/2, 0, "alien"); // Adiciona o sprite do alienígena
    moeda = this.physics.add.sprite(larguraJogo/2, 0, "moeda"); // Adiciona o sprite da moeda
    plataforma = this.physics.add.staticImage(larguraJogo/2, alturaJogo/2, "plataforma"); // Adiciona a plataforma

    this.physics.add.collider(alien, plataforma); // Adiciona colisão entre o alienígena e a plataforma
    alien.setCollideWorldBounds(true); // Define a colisão com os limites do mundo

    teclado = this.input.keyboard.createCursorKeys(); // Cria as teclas de controle do jogo

    fogo = this.add.sprite(0, 0, "turbo"); // Adiciona o efeito de turbo
    fogo.setVisible(false); // Torna o efeito de turbo invisível inicialmente

    placar = this.add.text(50, 150, "Moedas: " + pontuacao, {fontSize: "45px", fill: "#495613"});

    moeda.setCollideWorldBounds(true); // Garante que a moeda colida com os limites do mundo
    moeda.setBounce(0.7); // Define o coeficiente de restituição da moeda para simular o rebote
    this.physics.add.collider(plataforma, moeda); // Adiciona colisão entre a plataforma e a moeda
    
    this.physics.add.overlap(alien, moeda, function () { // Adiciona a detecção de sobreposição entre o alienígena e a moeda
        moeda.setVisible(false); // Torna a moeda invisível após ser coletada
        var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650); // Define uma nova posição Y aleatória para a moeda
        moeda.setPosition(posicaoMoeda_Y, 100); // Define a nova posição da moeda
        pontuacao += 1; // Incrementa a pontuação ao coletar a moeda
        placar.setText("Moedas: " + pontuacao); // Atualiza o texto do placar com a nova pontuação
        moeda.setVisible(true); // Torna a moeda visível novamente para aparecer em sua nova posição
    })
}

function update () {
    // Função para atualizar lógica do jogo
    if (teclado.left.isDown) {
        alien.setVelocityX(-150); // Define a velocidade do alienígena para a esquerda
    } else if (teclado.right.isDown) {
        alien.setVelocityX(150); // Define a velocidade do alienígena para a direita
    } else {
        alien.setVelocityX(0); // Define a velocidade do alienígena como 0 se nenhuma tecla direcional estiver pressionada
    }

    if (teclado.up.isDown) {
        alien.setVelocityY(-150); // Define a velocidade do alienígena para cima
        ativarTurbo(); // Ativa o efeito de turbo
    } else {
        semTurbo(); // Desativa o efeito de turbo
    }
   
    fogo.setPosition(alien.x, alien.y + 65); // Define a posição do efeito de turbo relativa à do alienígena
}

function ativarTurbo () {
    // Função para ativar o efeito de turbo
    fogo.setVisible(true); // Torna o efeito de turbo visível
}

function semTurbo () {
    // Função para desativar o efeito de turbo
    fogo.setVisible(false); // Torna o efeito de turbo invisível
}
