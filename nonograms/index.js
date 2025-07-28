import {
  board,
  dimensions,
  timer,
  maxTime,
  interval,
  sounds,
  difficulty,
  defaultGame,
  isSound,
} from "./js/constants.js";
import { createBasicHTML, gameboardContent, resultsTable } from "./js/html.js";
import { getRandom, puzzleArr, playSound, gameProgress } from "./js/helper.js";

import { puzzle } from "./js/puzzles.js";

/* on click events */
document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]");

  let currentDropdown;
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]");
    currentDropdown.classList.toggle("active");
  }

  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    if (dropdown === currentDropdown) return;
    dropdown.classList.remove("active");
  });

  const isMenuRandom = e.target.matches(".menu__random");
  if (isMenuRandom) handleRandom();

  const isMenuBest = e.target.matches(".menu__best");
  if (isMenuBest) handleBestResults();

  const isDropdownItem = e.target.closest(".dropdown__item");
  if (isDropdownItem) clickDropdownItem(e);

  /* toggle dark/light themes*/
  const isThemeButton = e.target.closest(".title-bar__theme-button");
  if (isThemeButton) clickTheme();

  /* click on board cells */
  const isBoardCell = e.target.matches(".gameboard__battle-cell");
  if (isBoardCell) clickCell(e);

  /* footer controls */
  const isSolutionsButton = e.target.matches(".solutions-button");
  if (isSolutionsButton) handleSolution(e);

  const isSound = e.target.matches('.switch input');
  if (isSound) handleSwitch(e)

  const isResetButton = e.target.matches(".scoreboard__reset-button");
  if (isResetButton) reset();

  const isGameOverButton = e.target.matches(".game-over__button");
  if (isGameOverButton) handleFinishModal(e);

  const isSaveButton = e.target.matches(".scoreboard__save-button");
  if (isSaveButton) handleSaveGame();

  const isResumeButton = e.target.matches(".scoreboard__resume-button");
  if (isResumeButton) handleResumeGame();

  const isResultsModal = e.target.closest(".results-modal");
  if (isResultsModal) {
    document.querySelector(".results-modal").style.display = "none";
  }
});

/* right click event listener */
document.addEventListener("contextmenu", (e) => {
  const isBoardCell = e.target.matches(".gameboard__battle-cell");
  if (isBoardCell) rightClicked(e);
});
/* end of On click events */

(function reload() {
  createBasicHTML();
  reset();
})();

function reset() {
  const gameLevel = board.game[0];
  const gameName = board.game[1];
  const gameSolution = puzzle[gameLevel][gameName].solution;
  document.querySelector(".gameboard").replaceChildren();
  gameboardContent(gameLevel, gameSolution, dimensions);
  document.querySelector(".scoreboard__game-name").innerText = gameName;

  /* set timer on first click */
  document.querySelector(".gameboard__battlefield").addEventListener(
    "click",
    (e) => {
      stopWatch();
    },
    { once: true }
  );
  document.querySelector(".gameboard__battlefield").addEventListener(
    "contextmenu",
    (e) => {
      stopWatch();
    },
    { once: true }
  );
  clearTimer();
}

/* game functions */
function handleSwitch(e) {
  const soundInput = document.querySelector('.switch input')
  isSound.sound = soundInput.checked;
}

function handleSaveGame() {
  const flagged = document.querySelectorAll(
    ".gameboard__battle-cell.checked, .gameboard__battle-cell.marked"
  );
  if (flagged.length > 0) {
    const progressObj = {
      puzzle: board.game,
      arr: gameProgress(flagged),
    };
    localStorage.setItem("nonolastgame", JSON.stringify(progressObj));
    alert("Game saved...");
  } else {
    alert("Nothing to save...");
  }
}

function handleResumeGame() {
  const lastGame = JSON.parse(localStorage.getItem("nonolastgame") || "{}");
  if (Object.keys(lastGame).length > 0) {
    board.game = [lastGame.puzzle[0], lastGame.puzzle[1]];
    reset(board);
    lastGame.arr.forEach((item) => {
      document
        .querySelector(
          `.gameboard__battle-cell[data-col="${item[0]}"][data-row="${item[1]}"`
        )
        .classList.add(item[2]);
    });
  } else {
    alert("No game saved...");
  }
}

function showFinishModal() {
  const modal = document.querySelector(".finish-modal");
  modal.style.display = "flex";
  modal.querySelector(
    ".game-over__result"
  ).innerText = `Great! You have solved the nonogram in ${timer.value} seconds!`;
}

function handleFinishModal(e) {
  const modal = document.querySelector(".finish-modal");
  modal.style.display = "none";
  board.game = defaultGame;
  reset();
}

function clickDropdownItem(e) {
  const arr = [
    e.target.parentElement.dataset.level,
    e.target.parentElement.dataset.name,
  ];
  board.game = arr;
  reset();
}

function clickCell(e) {
  e.target.classList.toggle("checked");
  if (e.target.classList.contains("checked")) {
    if (isSound.sound) playSound(sounds.checked).play();
  } else {
    if (isSound.sound) playSound(sounds.empty).play();
  }
  if (e.target.classList.contains("marked"))
    e.target.classList.remove("marked");
  if (isVictory()) handleVictory();
}

function rightClicked(e) {
  e.preventDefault();
  e.target.classList.toggle("marked");
  if (e.target.classList.contains("marked")) {
    if (isSound.sound) playSound(sounds.marked).play();
  } else {
    if (isSound.sound) playSound(sounds.empty).play();
  }
  if (e.target.classList.contains("checked"))
    e.target.classList.remove("checked");
}

function handleRandom(e) {
  const random = getRandom(puzzleArr(puzzle).length);
  const arr = puzzleArr()[random];
  board.game = arr;
  reset();
}

function handleVictory() {
  saveScore();
  playSound(sounds.win).play();
  showFinishModal();
  clearInterval(interval.id);
}

function isVictory() {
  const ones = document.querySelectorAll("[data-val = '1']");
  const zeroes = document.querySelectorAll("[data-val = '0']");
  const allOnes = Array.from(ones).every((item) =>
    item.classList.contains("checked")
  );
  const allZeroes = Array.from(zeroes).every(
    (item) => !item.classList.contains("checked")
  );
  return allOnes && allZeroes;
}

function saveScore() {
  const time = timer.value;
  const level = difficulty[board.game[0]];
  const puzzleName = board.game[1];
  const storageData = JSON.parse(localStorage.getItem("nonoresults") || "[]");
  storageData.push([time, puzzleName, level]);
  const newData = storageData.sort((a, b) => a[0] - b[0]).slice(0, 5);
  localStorage.setItem("nonoresults", JSON.stringify(newData));
}

function handleBestResults() {
  const resultsArr = JSON.parse(localStorage.getItem("nonoresults") || "[]");
  const resultsModal = document.querySelector(".results-modal");
  resultsModal.style.display = "flex";
  resultsModal.querySelector(".results-table").innerHTML = "";
  if (resultsArr.length > 0) {
    const table = resultsTable(resultsArr);
    resultsModal.querySelector(".results-table").appendChild(table);
  } else {
    resultsModal.querySelector(".results-table").innerText = "No results...";
  }
  resultsModal.style.display = "flex";
}

function handleSolution(e) {
  document.querySelectorAll(".gameboard__battle-cell").forEach((item) => {
    item.classList.remove("checked", "marked");
    item.classList.add(item.dataset.val === "1" ? "checked" : "marked");
    item.style.pointerEvents = "none";
  });
  clearTimer();
  document.querySelector(".gameboard__right-side").style.pointerEvents = "none";
}
/* TIMER */
function stopWatch() {
  interval.id = setInterval(tick, 1000);

  function tick() {
    let secs = timer.value;
    if (secs < maxTime) {
      timer.value += 1;
    } else {
      timer.value = 0;
    }
    const mins = Math.floor(secs / 60);
    secs %= 60;
    const pretty =
      (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;

    document.querySelector(".scoreboard__timer").innerText = pretty;
  }
}

function clearTimer() {
  timer.value = 0;
  clearInterval(interval.id);
  document.querySelector(".scoreboard__timer").innerText = "00:00";
}

/* toggle display functions */
const clickTheme = (e) => {
  document.body.classList.toggle("dark");
  toggleDisplay(document.querySelector(".theme-button__icon_light"));
  toggleDisplay(document.querySelector(".theme-button__icon_dark"));
};
const toggleDisplay = (target) => {
  target.style.display =
    window.getComputedStyle(target).display === "none" ? "block" : "none";
};
/* end of toggle display functions */
