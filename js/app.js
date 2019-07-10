/*
 * Create a list that holds all of your cards
 */
const cards = ['fa-diamond', 'fa-diamond',
               'fa-paper-plane-o', 'fa-paper-plane-o',
               'fa-anchor', 'fa-anchor',
               'fa-bolt', 'fa-bolt',
               'fa-cube', 'fa-cube',
               'fa-leaf', 'fa-leaf',
               'fa-bicycle', 'fa-bicycle',
               'fa-bomb', 'fa-bomb',
              ];

/**
 * Returns html for a single card
 * @param  {string} card card that goes in html
 * @return {html}      created html for card
 */
function createCard(card) {
  return `<li class="card"><i class="fa ${card}"></i></li>`
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
/**
 * Shuffles cards for deck
 * @param  {array} array cards to shuffle
 * @return {array}       shuffled cards
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
 * Starts and restarts the game
 */
function startGame() {
  pick = 0;
  currentCard = null;
  cardsOpen = 0;
  maxCards = 0;
  moves = 0;
  blocked = false;
  second = 0, minute = 0;

  let deck = document.querySelector('.deck');
  let cardHTML = shuffle(cards).map(function(card) {
    return createCard(card);
  });

  moveCounter(0);

  let timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);

  deck.innerHTML = cardHTML.join('');

  const cardElements = document.getElementsByClassName('card');
  maxCards = cardElements.length;

  for (var i in cardElements) {
    cardElements[i].onclick = clickCard;
  }
};

/**
 * Main event handler
 * Contains logic for showing cards, checking if they match
 * and marking as matched or closing
 * @param  {event} e  click event which is triggered upon clicking the card
 */
function clickCard(e) {
  if (blocked) return false;
  if (pick > 0 && currentCard !== e.target) {

    const newClasses = e.target.getElementsByClassName('fa')[0].classList;

    let newCardType = null;
    for (let i = 0; i < newClasses.length; i++) {
      if (newClasses[i].substring(0, 3) == 'fa-') {
        newCardType = newClasses[i];
      };
    };

    const oldClasses = currentCard.getElementsByClassName('fa')[0].classList;

    let oldCardType = null;
    for (let i = 0; i < oldClasses.length; i++) {
      if (oldClasses[i].substring(0, 3) == 'fa-') {
        oldCardType = oldClasses[i];
      };
    };

    // Compares opened cards and if the are matching adds 'match' class, if not deletes 'open, show' classes.
    if (newCardType == oldCardType) {
      e.target.classList.add('match');
      currentCard.classList.add('match');
      currentCard.classList.remove('open', 'show');
      currentCard = e.target;
      currentCard = null;
      pick = 0;
      cardsOpen += 2;
      // Checks if all cards are open. If all are open then stops timer and shows Congratulations window.
      if(cardsOpen >= maxCards) {
        clearInterval(interval);
      }
    } else {
      e.target.classList.add('open', 'show', 'nomatch');
      currentCard.classList.add('nomatch');
      blocked = true;
      setTimeout(function(){
        e.target.classList.remove('open', 'show', 'nomatch');
        currentCard.classList.remove('open', 'show', 'nomatch');
        currentCard = null;
        pick = 0;
        blocked = false;
      }, 1000);
    };
    moveCounter();
    if(cardsOpen >= maxCards) {
      setTimeout(showCongratulations, 750);
    }

  } else {
    e.target.classList.add('open', 'show');
    currentCard = e.target;
    pick = 1;
  }
};

/**
 * Shows the congratulations modal for completing the game
 */
function showCongratulations() {

  let finalTime = timer.innerHTML;

  completed.classList.add('show');

  let starRating = document.querySelector('.stars').innerHTML;

  // Shows how many stars you got, moves and time it took to complete the game
  document.getElementsByClassName('final-moves')[0].innerHTML = moves;
  document.getElementsByClassName('star-rating')[0].innerHTML = starRating;
  document.getElementsByClassName('total-time')[0].innerHTML = finalTime;

  // Closes congratulations window.
  closeIcon.addEventListener('click', function(e) {
    completed.classList.remove('show');
  });
};

/**
 * Handler for "Play again" button in modal
 * Hides the modal and restarts the game
 */
function playAgain() {
  completed.classList.remove('show');
  startGame();
};

let pick = 0;
let currentCard = null;
let cardsOpen = 0;
let maxCards = 0;
let moves = 0;
let blocked = false;
let second = 0, minute = 0;
let timer = document.querySelector('.timer');
let interval;
let stars = document.querySelectorAll('.fa-star');
const completed = document.querySelector('.completed');
const closeIcon = document.querySelector('.close');

/**
 * Sets up timer for the game.
*/
function startTimer(){
  interval = setInterval(function(){
    timer.innerHTML = minute+" mins "+second+" secs";
    second++;
    if(second == 60){
      minute++;
      second = 0;
    }
    if(minute == 60){
      hour++;
      minute = 0;
    }
  },1000);
};


/**
 * Counts or resets the moves
 * @param  {number} pass 0 to reset counter, pass nothing to increment by 1
 *  */
function moveCounter(m = null){
  if (m !== null)
  {
    moves = m;
  } else {
    moves++;
  }

  document.getElementById('movesCounter').innerHTML = moves;
  if(moves == 1){
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
  starRating();
}

/**
 * Calculates and shows how many stars player will get for completing the game
 */
function starRating() {

  let showStars = 3;

  if (moves > 14) showStars--;
  if (moves > 22) showStars--;
  // setting rates based on moves
  for( i= 0; i < 3; i++){
    if(i + 1 > showStars){
      stars[i].style.visibility = "collapse";
    } else {
      stars[i].style.visibility = "visible";
    }
  }
}

// hook into document ready event
document.addEventListener("DOMContentLoaded", function(event) {
  startGame();
});
