const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const timerInput = document.getElementById('timerInput');
const timeRemaining = document.getElementById('timeRemaining');

let cards = [];
let flipped = [];
let matched = [];
let gameActive = false;
let timer = null;
let timeLeft = 0;

const emojis = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

function initGame() {
    board.innerHTML = '';
    cards = [];
    flipped = [];
    matched = [];
    gameActive = true;
    
    timeLeft = parseInt(timerInput.value);
    timeRemaining.textContent = timeLeft;
    
    // Create card pairs
    const gameCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    // Create card elements
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        
        card.addEventListener('click', flipCard);
        board.appendChild(card);
        cards.push(card);
    });
    
    startTimer();
}

function flipCard(e) {
    if (!gameActive) return;
    
    const card = e.target;
    const index = card.dataset.index;
    
    // Prevent flipping same card twice or already matched cards
    if (flipped.includes(index) || matched.includes(index)) return;
    
    // Limit to 2 flipped cards
    if (flipped.length >= 2) return;
    
    card.textContent = card.dataset.emoji;
    card.classList.add('flipped');
    flipped.push(index);
    
    if (flipped.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [idx1, idx2] = flipped;
    const emoji1 = cards[idx1].dataset.emoji;
    const emoji2 = cards[idx2].dataset.emoji;
    
    if (emoji1 === emoji2) {
        // Match found
        matched.push(idx1, idx2);
        cards[idx1].classList.add('matched');
        cards[idx2].classList.add('matched');
        flipped = [];
        
        if (matched.length === cards.length) {
            endGame(true);
        }
    } else {
        // No match
        setTimeout(() => {
            cards[idx1].textContent = '?';
            cards[idx2].textContent = '?';
            cards[idx1].classList.remove('flipped');
            cards[idx2].classList.remove('flipped');
            flipped = [];
        }, 1000);
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        timeRemaining.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    gameActive = false;
    clearInterval(timer);
    
    setTimeout(() => {
        if (won) {
            alert('🎉 Congratulations! You won! 🎉');
        } else {
            alert('⏰ Time\'s up! Game Over! Try again!');
        }
    }, 300);
}

startBtn.addEventListener('click', initGame);
