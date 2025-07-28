import { getColumns, getHints, getTimeString } from "./helper.js";
import { puzzle } from "./puzzles.js";

/* Basic HTML */
export const createBasicHTML = () => {
  const header = document.createElement("header");
  header.classList.add("header");
  const main = document.createElement("main");
  main.classList.add("main");

  const gameboard = document.createElement("div");
  gameboard.classList.add("gameboard");
  main.appendChild(gameboard);
  main.appendChild(footerBar());

  header.appendChild(titleBar(puzzle));
  header.appendChild(dropDown());
  header.appendChild(scoreBoard());

  document.body.append(header);
  document.body.append(main);

  document.body.append(finishModal());
  document.body.append(resultsModal());

  return {
    header,
    gameboard,
  };
};
/* Header content */
const titleBar = (game) => {
  const titleBar = document.createElement("div");
  titleBar.appendChild(document.createElement("h1"));
  titleBar.classList.add("title-bar");
  titleBar.children[0].className = "title-bar__title";
  titleBar.children[0].innerText = "Nonograms game!";
  titleBar.appendChild(document.createElement("button"));
  titleBar.children[1].className = "title-bar__theme-button";
  titleBar.children[1].appendChild(svgSun());
  titleBar.children[1].appendChild(svgMoon());
  return titleBar;
};

const scoreBoard = () => {
  const scoreBoard = document.createElement("div");
  scoreBoard.classList.add("scoreboard");

  const scoreBoardInfo = document.createElement("div");
  scoreBoardInfo.classList.add("scoreboard__info");

  scoreBoardInfo.appendChild(document.createElement("div"));
  scoreBoardInfo.children[0].classList.add("scoreboard__template");
  scoreBoardInfo.children[0].innerText = "Puzzle name:";
  scoreBoardInfo.children[0].appendChild(document.createElement("span"));
  scoreBoardInfo.children[0].children[0].classList.add("scoreboard__game-name");
  scoreBoardInfo.children[0].children[0].innerText = "Airplane";

  scoreBoardInfo.appendChild(document.createElement("div"));
  scoreBoardInfo.children[1].classList.add("scoreboard__timer-outer");
  scoreBoardInfo.children[1].innerText = "Time gone:";
  scoreBoardInfo.children[1].appendChild(document.createElement("span"));
  scoreBoardInfo.children[1].children[0].classList.add("scoreboard__timer");
  scoreBoardInfo.children[1].children[0].innerText = "00:00";
  scoreBoard.appendChild(scoreBoardInfo);

  scoreBoard.appendChild(document.createElement("div"));
  scoreBoard.children[1].classList.add("scoreboard__buttons");
  scoreBoard.children[1].appendChild(document.createElement("button"));
  scoreBoard.children[1].children[0].classList.add("scoreboard__reset-button");
  scoreBoard.children[1].children[0].innerText = "Reset game";

  scoreBoard.children[1].appendChild(document.createElement("button"));
  scoreBoard.children[1].children[1].classList.add("scoreboard__save-button");
  scoreBoard.children[1].children[1].innerText = "Save game";

  scoreBoard.children[1].appendChild(document.createElement("button"));
  scoreBoard.children[1].children[2].classList.add("scoreboard__resume-button");
  scoreBoard.children[1].children[2].innerText = "Continue last game";

  return scoreBoard;
};

const dropDown = (puzzle) => {
  const dropDown = document.createElement("div");
  dropDown.classList.add("menu");
  dropDown.setAttribute("data-dropdown", "");
  dropDown.appendChild(document.createElement("button"));
  dropDown.children[0].classList.add("link");
  dropDown.children[0].setAttribute("data-dropdown-button", "");
  dropDown.children[0].innerText = "Select game";
  dropDown.appendChild(document.createElement("button"));
  dropDown.children[1].classList.add("link", "menu__random");
  dropDown.children[1].innerText = "Random game";
  dropDown.appendChild(document.createElement("button"));
  dropDown.children[2].classList.add("link", "menu__best");
  dropDown.children[2].innerText = "Best results";

  dropDown.appendChild(document.createElement("div"));
  dropDown.children[3].classList.add("dropdown-menu", "information-grid");

  const easy = document.createElement("div");
  easy.appendChild(document.createElement("div"));
  easy.children[0].classList.add("dropdown-heading");
  easy.children[0].innerText = "5 x 5";
  easy.appendChild(dropdownItems(5));
  dropDown.children[3].appendChild(easy);

  const medium = document.createElement("div");
  medium.appendChild(document.createElement("div"));
  medium.children[0].classList.add("dropdown-heading");
  medium.children[0].innerText = "10 x 10";
  medium.appendChild(dropdownItems(10));
  dropDown.children[3].appendChild(medium);

  const hard = document.createElement("div");
  hard.appendChild(document.createElement("div"));
  hard.children[0].classList.add("dropdown-heading");
  hard.children[0].innerText = "15 x 15";
  hard.appendChild(dropdownItems(15));
  dropDown.children[3].appendChild(hard);
  return dropDown;
};

const dropdownItems = (level) => {
  const arr = Object.keys(puzzle[level]).map((name) => {
    return [name, puzzle[level][name].icon];
  });
  const dropdownLinks = document.createElement("div");
  dropdownLinks.classList.add("dropdown-links");
  arr.map((val) => {
    const link = document.createElement("div");
    link.classList.add("dropdown__item", "link");
    link.dataset.level = level;
    link.dataset.name = val[0];
    link.appendChild(document.createElement("img"));
    link.children[0].src = val[1];
    link.children[0].classList.add("dropdown__menu-icon");
    link.appendChild(document.createElement("span"));
    link.children[1].innerText = val[0];
    dropdownLinks.appendChild(link);
  });
  return dropdownLinks;
};

/* end of header content */
const footerBar = () => {
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  footer.appendChild(soundSwitch());
  footer.appendChild(solutionButton());
  return footer;
};

const soundSwitch = () => {
  const sound = document.createElement("div");
  sound.classList.add("switch-container");
  sound.appendChild(document.createElement("span"));
  sound.children[0].innerText = "Sound on/off";
  const soundLabel = document.createElement("label");
  soundLabel.classList.add("switch");
  soundLabel.appendChild(document.createElement("input"));
  soundLabel.children[0].setAttribute("type", "checkbox");
  soundLabel.children[0].checked = true;
  soundLabel.appendChild(document.createElement("span"));
  soundLabel.children[1].classList.add("slider", "round");

  sound.appendChild(soundLabel);

  return sound;
};

const solutionButton = () => {
  const solutionBtn = document.createElement("button");
  solutionBtn.classList.add("solutions-button");
  solutionBtn.innerText = "Solution";
  return solutionBtn;
};

export const gameboardContent = (size, solution, dimensions) => {
  const gameRows = solution;
  const gameCols = getColumns(gameRows);
  const sideHintsArr = getHints(gameRows);
  const topHintsArr = getHints(gameCols);
  const cellSize = dimensions[size].cell_size;
  const boardSize = dimensions[size].board_size;
  const topHeight = dimensions[size].top_height;
  const sideWidth = dimensions[size].side_width;

  const gameboard = document.querySelector(".gameboard");

  const sideHints = document.createElement("div");
  sideHints.classList.add("gameboard__side-hints");
  gameboard.appendChild(sideHints);

  sideHintsArr.map((hints, idx, arr) => {
    sideHints.appendChild(
      hintCell(cellSize, sideWidth, hints, "gameboard__side-cell")
    );
    if (idx === 0) sideHints.children[idx].style.borderTop = "2px solid";
    if ((idx + 1) % 5 === 0)
      sideHints.children[idx].style.borderBottom = "2px solid";
    if (idx === arr.length - 1)
      sideHints.children[idx].style.borderBottom = "2px solid";
  });

  const gameboardRight = document.createElement("div");
  gameboardRight.classList.add("gameboard__right-side");
  gameboardRight.style.setProperty("--board-size", `${boardSize}vmin`);
  gameboard.appendChild(gameboardRight);

  const topHints = document.createElement("div");
  topHints.classList.add("gameboard__top-hints");
  gameboardRight.appendChild(topHints);

  topHintsArr.map((hints, idx, arr) => {
    topHints.appendChild(
      hintCell(cellSize, topHeight, hints, "gameboard__top-cell")
    );
    if (idx === 0) topHints.children[idx].style.borderLeft = "2px solid";
    if ((idx + 1) % 5 === 0)
      topHints.children[idx].style.borderRight = "2px solid";
    if (idx === arr.length - 1)
      topHints.children[idx].style.borderRight = "2px solid";
  });

  const battlefield = document.createElement("div");
  battlefield.classList.add("gameboard__battlefield");

  gameRows.map((row, rowIdx) => {
    row.map((val, colIdx, arr) => {
      battlefield.appendChild(
        boardCell(cellSize, [colIdx, rowIdx, val, arr.length])
      );
    });
  });

  gameboardRight.appendChild(battlefield);
};

const hintCell = (size, crossSize, hintsArr, className) => {
  const cell = document.createElement("div");
  cell.classList.add(className);
  cell.style.setProperty("--cell-size", `${size}vmin`);
  cell.style.setProperty("--cross-size", `${crossSize}px`);
  let span;
  for (let i = 0; i < hintsArr.length; i += 1) {
    span = document.createElement("span");
    span.innerText = hintsArr[i];
    cell.appendChild(span);
  }
  return cell;
};

const boardCell = (size, colrow) => {
  const cell = document.createElement("div");
  cell.classList.add("gameboard__battle-cell");
  cell.style.setProperty("--cell-size", `${size}vmin`);
  cell.dataset.col = colrow[0];
  cell.dataset.row = colrow[1];
  cell.dataset.val = colrow[2];
  if ((colrow[0] + 1) % 5 === 0) cell.style.borderRight = "2px solid";
  if ((colrow[1] + 1) % 5 === 0) cell.style.borderBottom = "2px solid";
  if (colrow[0] === 0) cell.style.borderLeft = "2px solid";
  if (colrow[0] === colrow[3] - 1) cell.style.borderRight = "2px solid";
  if (colrow[1] === 0) cell.style.borderTop = "2px solid";
  if (colrow[1] === colrow[3] - 1) cell.style.borderBottom = "2px solid";
  return cell;
};
/* end of gameboardContent */

/* MODALs */
const finishModal = () => {
  const modal = document.createElement("div");
  modal.className = "finish-modal";
  const gameOver = document.createElement("div");
  gameOver.className = "game-over";
  gameOver.appendChild(document.createElement("p"));
  gameOver.appendChild(document.createElement("button"));
  gameOver.children[0].className = "game-over__result";
  gameOver.children[0].innerText =
    "Great! You have solved the nonogram in ## seconds!";
  gameOver.children[1].className = "game-over__button";
  gameOver.children[1].innerText = "Close";
  modal.appendChild(gameOver);
  return modal;
};

const resultsModal = () => {
  const resultsModal = document.createElement("div");
  resultsModal.className = "results-modal";
  resultsModal.appendChild(document.createElement("div"));
  resultsModal.children[0].classList.add("results-table");
  return resultsModal;
};

export const resultsTable = (results) => {
  // create table
  const table = document.createElement("table");
  // create head
  const thead = table.createTHead();
  const hrow = thead.insertRow();
  const titles = ["TIME", "GAME", "LEVEL"];
  for (let i = 0; i < 3; i += 1) {
    const th = document.createElement("th");
    hrow.appendChild(th).appendChild(document.createTextNode(titles[i]));
  }

  table.appendChild(thead);
  // create body
  let tbody = table.createTBody();
  for (let element of results) {
    let row = tbody.insertRow();
    for (let j = 0; j < 3; j += 1) {
      let cell = row.insertCell();
      let content = j === 0 ? getTimeString(element[j]) : element[j];
      let text = document.createTextNode(content);
      cell.appendChild(text);
    }
  }
  table.appendChild(tbody);
  return table;
};

/* end of MODAL */

/* SVGs */
const svgSun = () => {
  const sun = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const pathSun = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  sun.setAttribute("class", "theme-button__icon theme-button__icon_light");
  sun.setAttribute("fill", "currentColor");
  sun.setAttribute("viewBox", "0 0 24 24");
  pathSun.setAttribute(
    "d",
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  );
  pathSun.setAttribute("stroke", "currentColor");
  pathSun.setAttribute("stroke-linecap", "round");
  pathSun.setAttribute("stroke-width", "1");
  sun.appendChild(pathSun);
  return sun;
};

const svgMoon = () => {
  const moon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const pathMoon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  moon.setAttribute("class", "theme-button__icon theme-button__icon_dark");
  moon.setAttribute("fill", "currentColor");
  moon.setAttribute("viewBox", "0 0 24 24");
  pathMoon.setAttribute(
    "d",
    "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  );
  pathMoon.setAttribute("stroke", "currentColor");
  pathMoon.setAttribute("stroke-linecap", "round");
  pathMoon.setAttribute("stroke-width", "1");
  moon.appendChild(pathMoon);
  return moon;
};
