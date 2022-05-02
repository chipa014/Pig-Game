'use strict';

//Selecting elements to refer to in the code
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnRules = document.querySelector('.btn--rules');
const btnCloseRules = document.querySelector('.close-rules');
const diceDisplay = document.querySelector('.dice');
const rulesModal = document.querySelector('.rules');

let players = [];
let curPlayer;

class Player {
  constructor(playerNumber) {
    this.curScore = 0;
    this.totalScore = 0;
    this.curScoreDisplay = document.getElementById(`current--${playerNumber}`);
    this.totalScoreDisplay = document.getElementById(`score--${playerNumber}`);
    this.playerNumber = playerNumber;
    this.element = document.querySelector(`.player--${this.playerNumber}`);
  }
  display = function () {
    this.curScoreDisplay.textContent = this.curScore;
    this.totalScoreDisplay.textContent = this.totalScore;
  };
  addCurScore = function (diceRoll) {
    this.curScore += diceRoll;
    this.display();
  };
  nullCurScore = function () {
    this.curScore = 0;
    this.display();
  };
  addTotalScore = function () {
    this.totalScore += this.curScore;
    this.curScore = 0;
    this.display();
  };
  reset = function () {
    this.curScore = 0;
    this.totalScore = 0;
    this.display();
    this.element.classList.remove('player--winner');
  };
}

//Changing the current player
const changePlayer = function () {
  const curNumber = curPlayer.playerNumber;
  curPlayer.element.classList.remove('player--active');
  curPlayer = players[1 - curNumber]; //becomes 0 if was 1, becomes 1 if was 0
  curPlayer.element.classList.add('player--active');
};

//disabling Roll and Hold buttons for when a player wins (the game ends)
const disableButtons = function () {
  btnRoll.removeEventListener('click', rollDice);
  btnHold.removeEventListener('click', hold);
};

//enabling Roll and Hold buttons back
const enableButtons = function () {
  btnRoll.addEventListener('click', rollDice);
  btnHold.addEventListener('click', hold);
};

const showRules = function () {
  rulesModal.classList.remove('hidden');
  btnCloseRules.addEventListener('click', hideRules);
};

const hideRules = function () {
  rulesModal.classList.add('hidden');
};

const rollADie = function () {
  return Math.floor(Math.random() * 6) + 1;
};

const rollDice = function () {
  const diceRoll = rollADie();
  //Displaying the dice image
  diceDisplay.src = `dice-${diceRoll}.png`;
  diceDisplay.classList.remove('hidden');
  //Player rolls a 1
  if (diceRoll === 1) {
    curPlayer.nullCurScore();
    changePlayer();
    return;
  }
  //Player rolls not a 1
  curPlayer.addCurScore(diceRoll);
};

const hold = function () {
  curPlayer.addTotalScore();
  if (curPlayer.totalScore >= 100) {
    curPlayer.element.classList.add('player--winner');
    curPlayer.element.classList.remove('player--active');
    disableButtons();
    diceDisplay.classList.add('hidden');
    return;
  }
  changePlayer();
};

//Resets the game (happens when the 'New Game' button is clicked).
const reset = function () {
  diceDisplay.classList.add('hidden');
  for (let i = 0; i < 2; i++) {
    players[i].reset();
  }
  document.querySelector('.player--0').classList.add('player--active');
  document.querySelector('.player--1').classList.remove('player--active');
  curPlayer = players[0];
  enableButtons();
};

//Initialising Players
for (let i = 0; i < 2; i++) {
  players[i] = new Player(i);
}
curPlayer = players[0];

enableButtons();
btnNew.addEventListener('click', reset);
btnRules.addEventListener('click', showRules);
