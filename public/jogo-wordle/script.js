// Variáveis globais
let palavraAtual = '';
let tentativaAtual = 0;
let posicaoAtual = 0;
let jogoTerminado = false;
let palavraSecreta = '';

// Elementos do DOM
let gameBoardElement;
let keyboardElement;
let gameMessageElement;
let newGameButton;

// Layout do teclado
const teclado = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

// Inicialização do jogo
function iniciarJogo() {
    // Obter elementos do DOM
    gameBoardElement = document.getElementById('game-board');
    keyboardElement = document.getElementById('keyboard');
    gameMessageElement = document.getElementById('game-message');
    newGameButton = document.getElementById('new-game-btn');
    const helpButton = document.getElementById('help-btn');
    const closeInstructionsButton = document.getElementById('close-instructions');
    const gameInstructions = document.getElementById('game-instructions');
    
    // Limpar variáveis
    palavraAtual = '';
    tentativaAtual = 0;
    posicaoAtual = 0;
    jogoTerminado = false;
    gameMessageElement.textContent = '';
    
    // Escolher uma palavra aleatória
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)].toUpperCase();
    console.log('Palavra secreta:', palavraSecreta); // Para debug
    
    // Criar o tabuleiro
    criarTabuleiro();
    
    // Criar o teclado
    criarTeclado();
    
    // Adicionar event listeners
    document.addEventListener('keydown', tratarTecladoFisico);
    newGameButton.addEventListener('click', iniciarJogo);
    
    // Adicionar event listeners para o botão de ajuda
    helpButton.addEventListener('click', () => {
        gameInstructions.classList.remove('hidden');
    });
    
    closeInstructionsButton.addEventListener('click', () => {
        gameInstructions.classList.add('hidden');
    });
}

// Criar o tabuleiro do jogo
function criarTabuleiro() {
    // Limpar o tabuleiro existente
    gameBoardElement.innerHTML = '';
    
    // Criar 6 linhas (tentativas)
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        // Criar 5 células por linha
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }
        
        gameBoardElement.appendChild(row);
    }
}

// Criar o teclado virtual
function criarTeclado() {
    // Limpar o teclado existente
    keyboardElement.innerHTML = '';
    
    // Criar as linhas do teclado
    teclado.forEach(linha => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        // Criar as teclas
        linha.forEach(tecla => {
            const key = document.createElement('div');
            
            if (tecla === 'ENTER') {
                key.className = 'key key-wide';
                key.textContent = tecla;
            } else if (tecla === '⌫') {
                key.className = 'key key-wide';
                key.textContent = tecla;
            } else {
                key.className = 'key key-letter';
                key.textContent = tecla;
            }
            
            // Adicionar event listener para clique
            key.addEventListener('click', () => tratarCliqueTecla(tecla));
            
            keyboardRow.appendChild(key);
        });
        
        keyboardElement.appendChild(keyboardRow);
    });
}

// Tratar clique no teclado virtual
function tratarCliqueTecla(tecla) {
    if (jogoTerminado) return;
    
    // Adicionar efeito visual de clique
    const teclas = document.querySelectorAll('.key');
    teclas.forEach(element => {
        if (element.textContent === tecla) {
            element.classList.add('key-pressed');
            setTimeout(() => {
                element.classList.remove('key-pressed');
            }, 100);
        }
    });
    
    if (tecla === '⌫') {
        apagarLetra();
    } else if (tecla === 'ENTER') {
        verificarPalavra();
    } else {
        adicionarLetra(tecla);
    }
}

// Tratar input do teclado físico
function tratarTecladoFisico(e) {
    if (jogoTerminado) return;
    
    if (e.key === 'Backspace') {
        apagarLetra();
    } else if (e.key === 'Enter') {
        verificarPalavra();
    } else if (/^[a-zA-ZçÇ]$/.test(e.key)) {
        adicionarLetra(e.key.toUpperCase());
    }
}

// Adicionar letra à tentativa atual
function adicionarLetra(letra) {
    if (posicaoAtual < 5 && tentativaAtual < 6) {
        const row = gameBoardElement.children[tentativaAtual];
        const cell = row.children[posicaoAtual];
        
        cell.textContent = letra;
        cell.classList.add('filled');
        
        palavraAtual += letra;
        posicaoAtual++;
    }
}

// Apagar a última letra
function apagarLetra() {
    if (posicaoAtual > 0) {
        posicaoAtual--;
        
        const row = gameBoardElement.children[tentativaAtual];
        const cell = row.children[posicaoAtual];
        
        cell.textContent = '';
        cell.classList.remove('filled');
        
        palavraAtual = palavraAtual.slice(0, -1);
    }
}

// Verificar se a palavra está correta
function verificarPalavra() {
    if (posicaoAtual !== 5) {
        mostrarMensagem('A palavra deve ter 5 letras!');
        animarLinha();
        return;
    }
    
    // Verificar se a palavra existe na lista
    const palavraLowerCase = palavraAtual.toLowerCase();
    if (!palavras.includes(palavraLowerCase)) {
        mostrarMensagem('Palavra não encontrada na lista!');
        animarLinha();
        return;
    }
    
    // Adicionar uma pequena pausa antes de mostrar o resultado
    setTimeout(() => {
        verificarLetras();
    }, 100);
}

// Verificar as letras da palavra
function verificarLetras() {
    
    // Verificar letras e atualizar cores
    const row = gameBoardElement.children[tentativaAtual];
    const letrasUsadas = {};
    
    // Primeiro, marcar as letras corretas (verde)
    for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        const letra = cell.textContent;
        
        if (letra === palavraSecreta[i]) {
            atualizarCelula(cell, 'correct', i);
            atualizarTecla(letra, 'correct');
            letrasUsadas[i] = true;
        }
    }
    
    // Depois, marcar as letras presentes mas em posição errada (amarelo) ou ausentes (cinza)
    for (let i = 0; i < 5; i++) {
        const cell = row.children[i];
        const letra = cell.textContent;
        
        if (letra !== palavraSecreta[i]) {
            // Verificar se a letra existe na palavra secreta
            let letraPresente = false;
            
            for (let j = 0; j < 5; j++) {
                if (letra === palavraSecreta[j] && !letrasUsadas[j]) {
                    atualizarCelula(cell, 'present', i);
                    atualizarTecla(letra, 'present');
                    letrasUsadas[j] = true;
                    letraPresente = true;
                    break;
                }
            }
            
            if (!letraPresente) {
                atualizarCelula(cell, 'absent', i);
                atualizarTecla(letra, 'absent');
            }
        }
    }
    
    // Verificar se o jogador ganhou
    if (palavraAtual === palavraSecreta) {
        setTimeout(() => {
            mostrarMensagem('Parabéns! Você acertou!');
            jogoTerminado = true;
        }, 1500);
        return;
    }
    
    // Avançar para a próxima tentativa
    tentativaAtual++;
    posicaoAtual = 0;
    palavraAtual = '';
    
    // Verificar se o jogador perdeu
    if (tentativaAtual === 6) {
        setTimeout(() => {
            mostrarMensagem(`Você perdeu! A palavra era: ${palavraSecreta}`);
            jogoTerminado = true;
        }, 1500);
    }
}

// Atualizar a cor da célula
function atualizarCelula(cell, status, index) {
    // Adicionar uma pequena animação de virada com atraso baseado no índice
    setTimeout(() => {
        cell.classList.add(status);
    }, 250 + (index * 100));
}

// Atualizar a cor da tecla no teclado virtual
function atualizarTecla(letra, status) {
    const teclas = document.querySelectorAll('.key');
    
    teclas.forEach(tecla => {
        if (tecla.textContent === letra) {
            // Não rebaixar o status da tecla (correct > present > absent)
            if (tecla.classList.contains('correct')) {
                return;
            }
            
            if (tecla.classList.contains('present') && status === 'absent') {
                return;
            }
            
            // Remover classes anteriores
            tecla.classList.remove('correct', 'present', 'absent');
            
            // Adicionar nova classe
            tecla.classList.add(status);
        }
    });
}

// Mostrar mensagem ao jogador
function mostrarMensagem(mensagem) {
    gameMessageElement.textContent = mensagem;
    
    // Limpar a mensagem após 3 segundos se o jogo não terminou
    if (!jogoTerminado) {
        setTimeout(() => {
            gameMessageElement.textContent = '';
        }, 3000);
    }
}

// Animar a linha atual quando a palavra é inválida
function animarLinha() {
    const row = gameBoardElement.children[tentativaAtual];
    row.classList.add('shake');
    
    setTimeout(() => {
        row.classList.remove('shake');
    }, 500);
}

// Adicionar a classe de animação para a linha
document.head.insertAdjacentHTML('beforeend', `
<style>
.shake {
    animation: shake 0.5s;
}

@keyframes shake {
    0% { transform: translateX(0); }
    10% { transform: translateX(-5px); }
    20% { transform: translateX(5px); }
    30% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    50% { transform: translateX(-5px); }
    60% { transform: translateX(5px); }
    70% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    90% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
}

.key-pressed {
    transform: scale(0.95);
    opacity: 0.7;
    transition: transform 0.1s, opacity 0.1s;
}

@keyframes flip {
    0% { transform: rotateX(0); }
    50% { transform: rotateX(90deg); }
    100% { transform: rotateX(0); }
}

.correct, .present, .absent {
    animation: flip 0.5s;
}
</style>
`);

// Iniciar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', iniciarJogo);