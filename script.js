const ICONS = [
    "fa-bath",
    "fa-gear",
    "fa-github",
    "fa-box",
    "fa-wifi",
    "fa-envelope",
    "fa-sack-dollar",
    "fa-shield-halved",
    "fa-leaf",
    "fa-camera",
    "fa-gamepad",
    "fa-fingerprint",
    "fa-ghost",
    "fa-hat-cowboy",
    "fa-wave-square",
    "fa-folder",
    "fa-heart",
    "fa-star",
    "fa-sun",
    "fa-moon",
    "fa-cloud",
    "fa-tree",
    "fa-fire",
    "fa-anchor",
    "fa-apple-alt",
    "fa-baseball",
    "fa-bell",
    "fa-bicycle",
    "fa-bomb",
    "fa-book",
    "fa-bookmark",
    "fa-bottle-water"
];

let board;
let timerInput;
let progressBar;
let startBtn;
let rowsInput;
let colsInput;
let applySettingsBtn;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

let timer = 60;
let totalTime = 60;
let interval;
let gameStarted = false;

let rows = 4;
let cols = 8;
let deck = [];

function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

function createDeck(){
    const totalCards = rows * cols;
    const pairsNeeded = totalCards / 2;
    
    if(pairsNeeded > ICONS.length){
        alert("Not enough icons for this grid size! Maximum is " + (ICONS.length * 2) + " cards.");
        return [];
    }
    
    const selectedIcons = ICONS.slice(0, pairsNeeded);
    const newDeck = [...selectedIcons, ...selectedIcons];
    shuffle(newDeck);
    return newDeck;
}

function renderBoard(){
    board.innerHTML="";
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    deck = createDeck();

    if(deck.length === 0) return;

    deck.forEach(icon=>{
        const card=document.createElement("div");
        card.className="card revealed";
        card.dataset.icon=icon;
        card.innerHTML=`<i class="fa-solid ${icon}"></i>`;
        card.addEventListener("click",()=>flipCard(card));
        board.appendChild(card);
    });
}

function updateProgressBar(){
    if(progressBar){
        const percentage = (timer / totalTime) * 100;
        progressBar.style.width = percentage + "%";
    }
}

function showPreview(){
    lockBoard = true;
    updateProgressBar();
    
    // Show all icons for 5 seconds
    setTimeout(()=>{
        // After 5 seconds, hide all cards
        document.querySelectorAll(".card").forEach(card=>{
            card.classList.remove("revealed");
            card.classList.add("hidden");
        });

        // Show for another 5 seconds
        setTimeout(()=>{
            // After another 5 seconds, cover them and start timer
            document.querySelectorAll(".card").forEach(card=>{
                card.classList.remove("revealed");
                card.classList.add("hidden");
            });

            lockBoard = false;
            gameStarted = true;
            startTimer();
        }, 5000);
    }, 5000);
}

function flipCard(card){
    if(!gameStarted) return;
    if(lockBoard) return;
    if(card.classList.contains("matched")) return;
    if(card===firstCard) return;

    card.classList.remove("hidden");
    card.classList.add("revealed");

    if(!firstCard){
        firstCard=card;
        return;
    }

    secondCard=card;
    lockBoard=true;

    if(firstCard.dataset.icon===secondCard.dataset.icon){
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;
        resetTurn();

        if(matches === deck.length / 2){
            clearInterval(interval);
            alert("You Win!");
        }
    }else{
        setTimeout(()=>{
            firstCard.classList.add("hidden");
            secondCard.classList.add("hidden");

            firstCard.classList.remove("revealed");
            secondCard.classList.remove("revealed");

            resetTurn();
        },700);
    }
}

function resetTurn(){
    firstCard=null;
    secondCard=null;
    lockBoard=false;
}

function startTimer(){
    clearInterval(interval);
    timer=parseInt(timerInput.value,10);
    totalTime = timer;
    updateProgressBar();

    interval=setInterval(()=>{
        timer--;
        updateProgressBar();

        if(timer<=0){
            clearInterval(interval);
            alert("Time Up!");

            document.querySelectorAll(".card").forEach(card=>{
                card.style.pointerEvents="none";
            });
        }
    },1000);
}

function startGame(){
    matches=0;
    firstCard=null;
    secondCard=null;
    lockBoard=false;
    gameStarted = false;

    renderBoard();
    showPreview();
}

function setupTabSwitching(){
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(tabName).classList.add("active");
        });
    });
}

// Initialize
function init(){
    // Get DOM elements
    board = document.getElementById("board");
    timerInput = document.getElementById("timerInput");
    progressBar = document.getElementById("progressBar");
    startBtn = document.getElementById("startBtn");
    rowsInput = document.getElementById("rowsInput");
    colsInput = document.getElementById("colsInput");
    applySettingsBtn = document.getElementById("applySettingsBtn");

    setupTabSwitching();
    
    // Set initial values
    rowsInput.value = 8;
    colsInput.value = 4;
    rows = 8;
    cols = 4;
    
    startBtn.addEventListener("click", startGame);
    
    applySettingsBtn.addEventListener("click", () => {
        const newRows = parseInt(rowsInput.value, 10);
        const newCols = parseInt(colsInput.value, 10);

        if(newRows < 2 || newRows > 8 || newCols < 2 || newCols > 8){
            alert("Rows and columns must be between 2 and 8");
            return;
        }

        if(newRows * newCols > ICONS.length * 2){
            alert("Grid too large! Maximum is " + (ICONS.length * 2) + " cards.");
            return;
        }

        rows = newRows;
        cols = newCols;

        startGame();

        document.querySelector('.tab-btn[data-tab="game"]').click();
    });
    
    startGame();
}

// Wait for DOM to be ready
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
