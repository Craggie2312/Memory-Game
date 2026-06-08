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
    "fa-folder"
];

const board = document.getElementById("board");
const timerInput = document.getElementById("timerInput");
const timerDisplay = document.getElementById("timeRemaining");
const startBtn = document.getElementById("startBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

let timer = 60;
let interval;

function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

function createDeck(){

    const deck = [...ICONS, ...ICONS];

    shuffle(deck);

    return deck;
}

function renderBoard(){

    board.innerHTML="";

    const deck = createDeck();

    deck.forEach(icon=>{

        const card=document.createElement("div");

        card.className="card hidden";

        card.dataset.icon=icon;

        card.innerHTML=`<i class="fa-solid ${icon}"></i>`;

        card.addEventListener("click",()=>flipCard(card));

        board.appendChild(card);
    });
}

function flipCard(card){

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

        if(matches===16){

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

    timerDisplay.textContent=timer;

    interval=setInterval(()=>{

        timer--;

        timerDisplay.textContent=timer;

        if(timer<=0){

            clearInterval(interval);

            alert("Time Up!");

            document
                .querySelectorAll(".card")
                .forEach(card=>{
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

    renderBoard();

    startTimer();
}

startBtn.addEventListener("click",startGame);

startGame();
