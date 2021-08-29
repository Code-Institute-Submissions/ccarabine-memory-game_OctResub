//Modals
const newGameModal = document.getElementById("newgamemodal");
const finishGameModal = document.getElementById("finishgamemodal");
const rulesModal = document.getElementById("rulesmodal");
const confirmModal = document.getElementById("confirmmodal");
const scoreBoardModal = document.getElementById("scoreboardmodal");
const span = document.getElementsByClassName("close")[0];
const closeRules = document.getElementsByClassName("closerules")[0];
const closeScoreBoard = document.getElementsByClassName("closescoreboard")[0];

let con = "<tr><td colspan='2'></td></tr><tr><td>Name  </td><td>Score  </td></tr> ";

//Get Elements
const cards = document.querySelectorAll('.card');
const counterMoves = document.getElementById("moves");
const counterMatchedPairs = document.getElementById("matchedpairs");
const results = document.getElementById("results");
const names = document.getElementById('name');
const highScore = [{
    knames: "chris",
    kscores: 15
}, {
    knames: "chris",
    kscores: 15
}, {
    knames: "chris",
    kscores: 15
}, {
    knames: "chris",
    kscores: 15
}];

//declare Variables
let moves = 0;
let matchedPairs = 0;
let score = 0;
let selectedCard = false;
let boardDisabled = false;
let firstClick;
let secondClick;

/**
 * Function SelectCard 
 * 1.  boardDisabled: // if boardDisabled =true return so the rest doesnt get executed else disable board and enable it (in the match function) after the cards have been selected
 * 2. if statement to fix bug :if user clicks twice on a the same card, match will equal to true and it will remove the event listener so have incorporated this line of code
 *    solution: if its the first click then the (this) varaible holds the first card but the first card varaible is still unset so the condition is  going to evaluate to false and the function wil be executed normally.
 *   if its is the second card clicked then the (this) varaible holds the second card, if this equal first card then it will remove the "select" class therefore turning the card back over
 * 3. Turn the card over : this keyword relates to '.card' class, if the '.select' class is there remove it, if not add it 
 * 4. if selectedcard equals false then the player has selected the first card
 * 5. if selectedcard equals true then the player has selected the second card
 */
function selectCard() {
    if (boardDisabled) return; //1.

    if (this === firstClick) //2.
        return;
    this.classList.add('select'); // 3.

    if (!selectedCard) { // 4.
        selectedCard = true;
        firstClick = this;
        return;
    } else { // 5.
        selectedCard = false;
        secondClick = this;
        moveCounter();
        match();
    }
}

/**
 * Function - Match
 * 1.if first card equals second card then its a match, remove event listeners on first click and second click card
 * which will disabled the user from clickiing the matched pair of cars
 * 2. Call matchPairsCounter Function and resetBoard
 * 3. If match pairs equal 6, then call finishGame function
 * 4. Unlock the board and wait until they have turned back over
 * 5. Not a match,  set a delay 1000milseconds so we can see the 2nd clicked card, turn back over the cards(rotate by 180oc remove the classes '.select')
 */
function match() {
    if (firstClick.dataset.cardtype === secondClick.dataset.cardtype) { // 1. 
        firstClick.removeEventListener('click', selectCard);
        secondClick.removeEventListener('click', selectCard);
        matchPairsCounter(); //2.
        resetBoard();

        if (matchedPairs == 6) { //3.
            finishGame();
        }
    } else { //4.
        boardDisabled = true;
        setTimeout(() => { //5. 
            firstClick.classList.remove('select');
            secondClick.classList.remove('select');
            resetBoard();
        }, 1000);
    }
}
/**
 * Function - ShuffleCards, Reposition the order of the cards by order property and generating a random number to position it
 */
function shuffleCards() {
    for (let i = 0; i < cards.length; i++) {
        let position = Math.floor(Math.random() * 12);
        cards[i].style.order = position;
    }
}
/**
 * Function - reset boards and resets the values of selectedCard, boardDisabled, firstClick and secondClick
 */
function resetBoard() {
    selectedCard = false;
    boardDisabled = false;
    firstClick = null;
    secondClick = null;
}
/**
 * Function - increments number of moves the player has made by 1 and displays the result in the main window
 */
function moveCounter() {
    moves++;
    counterMoves.innerHTML = `Moves: ${moves}   `;
}

/**
 * Function - increments number of matched pairs the player has completed by 1 and displays the result in the main window
 */
function matchPairsCounter() {
    matchedPairs++;
    counterMatchedPairs.innerHTML = `Matched Pairs: ${matchedPairs} `;
}

/**
 * Function - Adds the players name and score to the addscore array
 */
function addToArray() {
    const addScore = {
        knames: names.value,
        kscores: parseInt((score), 10)
    };
    highScore.push(addScore);
}

/**
 * Function - Sorts highscore Array by score from highest to lowest and displays the scoreboard
 */
function displayScores() {
    highScore.sort((a, b) => (b.kscores > a.kscores) ? 1 : -1);

    for (let i = 0; i < highScore.length; i++) {
        con = con + "<tr><td>" + highScore[i].knames + "</td><td>" + highScore[i].kscores + "</td></tr>";
    }
    return con;
}

/**
 * Function - closes new game modal, calls reset game function and listens out for click on card, then calls select card function
 */
function playNewGame() {
    newGameModal.style.display = "none";
    resetGame();
    cards.forEach(card => card.addEventListener('click', selectCard)); // loop for each card click invoke the select card function
}

/**
 * Function - Reset scores to zero and calls remove select and shuffle card functions
 */
function resetGame() {
    moves = 0;
    matchedPairs = 0;
    score = 0;
    counterMatchedPairs.innerHTML = `Matched Pairs: ${matchedPairs} `;
    counterMoves.innerHTML = `Moves: ${moves}   `;
    removeSelect();
    shuffleCards();
}

/**
 * Function - Removes '.select' from all cards, so they show the back card
 */
function removeSelect() {
    let selectCards = Array.from(document.querySelectorAll('.select'));

    selectCards.forEach(function (selectCard) {
        selectCard.classList.remove('select');
    });
}

/**
 * This Function closes the new game modal and displays the new rule modal
 */
function rules() {
    newGameModal.style.display = "none";
    rulesModal.style.display = "block";
}

/**
 * This Function closes the finishgamemodal and displays the new game modal
 */
function displayNewGameModal() {
    finishGameModal.style.display = "none";
    newGameModal.style.display = "block";
}

/**
 * This Function closes finish game modal, runs function addToArray which adds the name and score to scoreboard, then displays it.
 */
function addScoreToScoreBoard() {
    finishGameModal.style.display = "none";
    addToArray();
    displayScores(con);
    document.getElementById('scoretable').innerHTML = con;
    displayScoreBoardModal();
}

/**
 * This Function displays the scoreboard Modal
 */
function displayScoreBoardModal() {
    scoreBoardModal.style.display = "block";
}
/**
 * This Function calculates the final score and puts the values in the finish game modal
 */
function finishGame() {
    if (moves <= 9) {
        score = 80;
    } else if (moves <= 12) {
        score = 60;
    } else if (moves <= 14) {
        score = 40;
    } else if (moves <= 16) {
        score = 30;
    } else if (moves <= 18) {
        score = 20;
    } else if (moves <= 20) {
        score = 10;
    } else if (moves >= 21) {
        score = 5;
    }
    results.innerHTML = `You made ${moves} moves. Well done, your score is ${score} points`;

    finishGameModal.style.display = "block";
}

/**
 *  This function brings up the confirm modal which allows the user to either the restart a new Game or continue with the game 
 */
function confirmDecision() {
    confirmModal.style.display = "block";
}

/**
 * This function calls the new game function and closes the confirm modal  
 */
function restartGame() {
    confirmModal.style.display = "none";

    playNewGame();

}
/**
 * Function Click no on the Confirmation modal and it closes the confirmation modal and continues game
 */
function continueGame() {
    confirmModal.style.display = "none";
}
// When the user clicks on (x), close the modal and open the newGame Modal
closeRules.onclick = function () {
    rulesModal.style.display = "none";
    newGameModal.style.display = "block";

};
// When the user clicks on (x), close the modal 
closeScoreBoard.onclick = function () {
    scoreBoardModal.style.display = "none";
};


// When the user clicks anywhere outside of the rulesModal, close it
window.onclick = function (event) {
    if (event.target == rulesModal) {
        rulesModal.style.display = "none";
    }
};

//OPENS new Game Modal at the beginning
newGameModal.style.display = "block";