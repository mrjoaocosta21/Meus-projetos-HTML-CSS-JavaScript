const icons = ['🍒', '🍏', '🍌', '🍇', '🍉', '🥝', '🍍', '🥥'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timeInterval = null;
let timerStarted = false;
let score = 1000;

// Elementos do DOM
const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const matchedPairsDisplay = document.getElementById('matchedPairs');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const winMessage = document.getElementById('winMessage');
const finalScore = document.getElementById('finalScore');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');

// Inicializa ou reinicia o jogo
function startGame() {
  stopTimer();

  // Duplica e embaralha as cartas
  cards = [...icons, ...icons];
  cards.sort(() => 0.5 - Math.random());

  // Reseta variáveis de estado
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  timerStarted = false;
  score = 1000;

  // Atualiza a interface
  movesDisplay.textContent = moves;
  timerDisplay.textContent = '00:00';
  matchedPairsDisplay.textContent = matchedPairs;
  scoreDisplay.textContent = score;
  winMessage.hidden = true;

  // Renderiza o tabuleiro com a estrutura necessária para o CSS 3D
  gameBoard.innerHTML = '';
  cards.forEach((icon, index) => {
    const card = document.createElement('button');
    card.classList.add('card');
    card.type = 'button';
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.setAttribute('aria-label', 'Carta do jogo da memória');

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${icon}</div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

// Inicia o temporizador
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timeInterval = setInterval(() => {
    timer++;
    updateTimerDisplay();
    updateScore();
  }, 1000);
}

// Para o temporizador
function stopTimer() {
  clearInterval(timeInterval);
  timeInterval = null;
  timerStarted = false;
}

// Formata e exibe o tempo (MM:SS)
function updateTimerDisplay() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Recalcula a pontuação com base nos movimentos e no tempo
function updateScore() {
  score = Math.max(0, 1000 - (moves * 15) - (timer * 2));
  scoreDisplay.textContent = score;
}

// Ação de virar a carta
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains('matched')) return;

  startTimer();

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;
  updateScore();

  checkForMatch();
}

// Verifica se as duas cartas viradas formam um par
function checkForMatch() {
  const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// Ação para cartas correspondentes
function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  matchedPairs++;
  matchedPairsDisplay.textContent = matchedPairs;

  resetBoard();

  if (matchedPairs === icons.length) {
    handleWin();
  }
}

// Ação para cartas diferentes (desvira após delay)
function unflipCards() {
  lockBoard = true;
  firstCard.classList.add('wrong');
  secondCard.classList.add('wrong');

  setTimeout(() => {
    if (firstCard && secondCard) {
      firstCard.classList.remove('flipped', 'wrong');
      secondCard.classList.remove('flipped', 'wrong');
    }
    resetBoard();
  }, 900);
}

// Reseta seleção das cartas
function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Exibe a tela de vitória
function handleWin() {
  stopTimer();

  setTimeout(() => {
    finalScore.textContent = `Você fez ${score} pontos!`;
    finalMoves.textContent = moves;
    finalTime.textContent = timerDisplay.textContent;
    winMessage.hidden = false;
  }, 400);
}

// Event Listeners
restartBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

// Inicia o jogo no carregamento da página
document.addEventListener('DOMContentLoaded', startGame);