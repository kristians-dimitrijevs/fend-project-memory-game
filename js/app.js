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

function cardOrder(card) {
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
 * [shuffle description]
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
}


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

// Starts the game from beggining. Shuffles cards and places them randomly.
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
    return cardOrder(card);
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

       if (newCardType == oldCardType) { // Compares opened cards and if the are matching adds 'match' class, if not deletes 'open, show' classes.
         e.target.classList.add('match');
         currentCard.classList.add('match');
         currentCard.classList.remove('open', 'show');
         currentCard = e.target;
         currentCard = null;
         pick = 0;
         cardsOpen += 2;
         if(cardsOpen >= maxCards) { // Checks if all cards are open. If all are open then stops timer and shows Congratulations window.
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
 }

 function showCongratulations() { // Creates Congratulations window.

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
 }
// Restarts the game.
 function reset() {
   completed.classList.remove('show');
   startGame();
 }

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

// Starts the timer for game.
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

}


// Shows how many moves are made
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
};

// Creates Star rating based on moves
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

document.addEventListener("DOMContentLoaded", function(event) {
  startGame();
});
