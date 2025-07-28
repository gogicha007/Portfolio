import data from "./word-list.json" with { type: "json" };

const checkTablet = window.matchMedia("(max-width: 767px)");
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const bodyPartsArray = [
  "body-parts__head",
  "body-parts__body",
  "body-parts__left-arm",
  "body-parts__right-arm",
  "body-parts__left-leg",
  "body-parts__right-leg",
];
let task = {};
let guessCounter = 0;
let status;

/* Generate html */
const modal = document.createElement("div");
modal.className = "modal";

const gameOver = document.createElement("div");
gameOver.className = "game-over";
gameOver.appendChild(document.createElement("h4"));
gameOver.appendChild(document.createElement("p"));
gameOver.appendChild(document.createElement("button"));
gameOver.children[0].className = "game-over__result";
gameOver.children[1].innerText = "The correct word was: ";
gameOver.children[1].appendChild(document.createElement("b"));
gameOver.children[1].children[0].className = "game-over__secret-word";
gameOver.children[2].className = "game-over__button";
gameOver.children[2].innerText = "Play again";
modal.appendChild(gameOver);

const gameBoard = document.createElement("div");
gameBoard.className = "game-board";

const hangmanBox = document.createElement("div");
hangmanBox.className = "hangman-box";
hangmanBox.appendChild(document.createElement("img"));
hangmanBox.appendChild(document.createElement("h1"));
hangmanBox.children[0].src = "./assets/images/gallows.svg";
hangmanBox.children[0].alt = "gallows";
hangmanBox.children[1].innerText = "Hangman Game";

const bodyParts = document.createElement("div");
bodyParts.className = "body-parts";

const head = document.createElement("img"); // head
head.className = bodyPartsArray[0];
head.src = "./assets/images/head.svg";

const torso = document.createElement("div");
torso.className = "body-parts__torso";
torso.appendChild(document.createElement("img")); // left hand
torso.appendChild(document.createElement("img")); // body
torso.appendChild(document.createElement("img")); // right hand
torso.children[0].src = "./assets/images/hand-one.svg";
torso.children[0].className = bodyPartsArray[2];
torso.children[1].src = "./assets/images/body.svg";
torso.children[1].className = bodyPartsArray[1];
torso.children[2].src = "./assets/images/hand-two.svg";
torso.children[2].className = bodyPartsArray[3];

const legs = document.createElement("div");
legs.className = "body-parts__legs";
legs.appendChild(document.createElement("img")); // left leg
legs.appendChild(document.createElement("img")); // right leg
legs.children[0].src = "./assets/images/leg-one.svg";
legs.children[0].className = bodyPartsArray[4];
legs.children[1].src = "./assets/images/leg-two.svg";
legs.children[1].className = bodyPartsArray[5];
bodyParts.appendChild(head);
bodyParts.appendChild(torso);
bodyParts.appendChild(legs);
hangmanBox.appendChild(bodyParts);

const gameBox = document.createElement("div");
gameBox.className = "game-box";

const guesses = document.createElement("h4");
guesses.className = "game-box__guesses";
guesses.innerText = "Incorrect guesses: ";
const countEl = document.createElement("b");
guesses.appendChild(countEl);

const secretWord = document.createElement("ul");
secretWord.className = "game-box__secret-word";
let letters = [];

const hint = document.createElement("h4");
hint.className = "game-box__hint";
hint.innerText = "Hint: ";
const hintText = document.createElement("b");
hint.appendChild(hintText);

const keyboard = document.createElement("div");
keyboard.className = "keyboard";
const keyBtns = Array.from(alpha).reduce((acc, char) => {
  const keyBtn = document.createElement("button");
  keyBtn.className = "keyboard__button";
  keyBtn.innerText = char.trim();
  keyBtn.addEventListener("click", keyboardClicked);
  acc.push(keyBtn);
  return acc;
}, []);
keyBtns.forEach((elem) => keyboard.appendChild(elem));

gameBox.appendChild(secretWord);
gameBox.appendChild(hint);
gameBox.appendChild(guesses);
gameBox.appendChild(keyboard);
gameBoard.appendChild(hangmanBox);
gameBoard.appendChild(gameBox);
document.body.appendChild(gameBoard);
document.body.appendChild(modal);

/* events */
document.addEventListener("keydown", (e) => keyboardClicked(e));
document
  .querySelector(".game-over__button")
  .addEventListener("click", handleModal);
checkTablet.addEventListener("change", handleTabletMode);

reset();

/* event handlers */
function keyboardClicked(e) {
  let keyPressed = !e.code ? this.innerText : e.code.replace("Key", "");
  if (status !== "game") return;
  let word = task.word.toUpperCase();
  if (!alpha.includes(keyPressed)) return; // pressed not the letter
  if (isKeyPressed(keyPressed)) return; // already pressed
  disableKeyPressed(keyPressed);
  if (word.includes(keyPressed)) {
    Array.from(word).forEach((val, idx) => {
      if (keyPressed === val) {
        letters[idx].innerText = val;
        letters[idx].classList.add("guessed");
      }
    });
  } else {
    guessCounter++;
    guesses.children[0].innerText = `${guessCounter} / 6`;
    showBodyParts(guessCounter);
  }
  status = checkStatus();
  if (status !== "game") {
    secretWord.replaceChildren();
    showModal(status);
  }
}

function isKeyPressed(key) {
  return keyBtns.find((e) => e.innerText === key).disabled;
}

function showModal(result) {
  let resultText = {
    winner: "Congratulations Winner!",
    loser: "Try again loser!",
  };
  modal.style.display = "flex";
  document.querySelector(".game-over__secret-word").innerText = task.word;
  document.querySelector(".game-over__result").innerText = resultText[result];
  document
    .querySelector(".game-over__result")
    .classList.add(`game-over__result_${result}`);
}

function checkStatus() {
  if (guessCounter === 6) return "loser";
  const yetGuessed = letters.reduce((acc, elem) => (acc += elem.innerText), "");
  if (yetGuessed === task.word.toUpperCase()) return "winner";
  return "game";
}

function handleModal() {
  modal.style.display = "none";
  gameOver.children[0].className = "game-over__result";
  reset();
}
/* Helpers */
function reset() {
  task = getTask();
  console.log(task.word);
  guessCounter = 0;
  status = 'game';
  letters = [];
  letters = generateLetters(task.word.length);
  letters.forEach((elem) => secretWord.appendChild(elem));
  hintText.innerText = task.hint;
  countEl.innerText = `${guessCounter} / 6`;
  keyBtns.forEach((e) => (e.disabled = false));
  bodyPartsArray.forEach((val) => {
    document.querySelector(`.${val}`).style.visibility = "hidden";
  });
  handleTabletMode(window.matchMedia("(max-width: 767px)"));
}

function generateLetters(len) {
  for (let i = 0; i < len; i += 1) {
    let letter = document.createElement("li");
    letter.className = "secret-word__letter";
    letters.push(letter);
  }
  return letters;
}

function showBodyParts(value) {
  let index = value > 6 ? 6 : value;
  document.querySelector(`.${bodyPartsArray[index - 1]}`).style.visibility =
    "visible";
}

function disableKeyPressed(key) {
  keyBtns.find((e) => e.innerText === key).disabled = true;
}

function getRandomIdx() {
  let lastIndex = getLastIndex();
  let result = lastIndex;
  while (lastIndex === result) {
    result = Math.floor(Math.random() * (Object.keys(data).length - 0) + 0);
  }
  setLastIndex(result);
  return result;
}

function setLastIndex(value) {
  localStorage.setItem("lastIndex", JSON.stringify(value));
}

function getLastIndex() {
  if (!localStorage.getItem("lastIndex")) {
    setLastIndex("-1");
  }
  return JSON.parse(localStorage.getItem("lastIndex"));
}

function getTask() {
  return data[getRandomIdx()];
}

function handleTabletMode(e) {
  const tabPos = [40, 100]; // position for tablet: top, left
  const deskPos = [70, 163];
  bodyParts.style.top = !e.matches ? `${deskPos[0]}px` : `${tabPos[0]}px`;
  bodyParts.style.left = !e.matches ? `${deskPos[1]}px` : `${tabPos[1]}px`;
}
