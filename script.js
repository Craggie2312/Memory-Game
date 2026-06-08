// Memory Game Logic
const symbols = ['🎨', '🎮', '🎭', '🎪', '🎯', '🎲', '🎸', '🎬'];
const cards = [...symbols, ...symbols]; // Duplicate for pairs
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let matches = 0;

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize game board
function initializeGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    matches = 0;
    updateStats();

    const shuffledCards = shuffleArray(cards);

    shuffledCards.forEach((symbol, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.textContent = '?';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip card logic
function flipCard(event) {
    const card = event.target;

    // Prevent clicking if card is already flipped or matched
    if (flippedCards.includes(card) || matchedCards.includes(card) || flippedCards.length >= 2) {
        return;
    }

    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    // Check for match
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

// Check if cards match
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        matches++;
        updateStats();
        flippedCards = [];

        // Check if game is won
        if (matchedCards.length === cards.length) {
            setTimeout(() => {
                alert(`🎉 You won in ${moves} moves!`);
            }, 500);
        }
    } else {
        // No match - flip back after delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            flippedCards = [];
        }, 1000);
    }
}

// Update move and match counter
function updateStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matches;
}

// Reset game button
document.getElementById('reset-btn').addEventListener('click', initializeGame);

// Start game when page loads
window.addEventListener('load', initializeGame);