import { isSound } from "./constants.js";
import { puzzle } from "./puzzles.js";

export const getColumns = (array) =>
  array.reduce((colArr, row, rowIdx, arr) => {
    colArr.push(
      row.reduce((subAcc, _, colIdx) => {
        subAcc.push(arr[colIdx][rowIdx]);
        return subAcc;
      }, [])
    );
    return colArr;
  }, []);

export const getHints = (array) => {
  let count = 0;
  return array.reduce((acc, val) => {
    acc.push(
      val.reduce((subAcc, subVal, subIdx, subArr) => {
        count += subVal;
        if (count && (!subVal || subArr.length - 1 === subIdx)) {
          subAcc.push(count);
          count = 0;
        }
        return subAcc;
      }, [])
    );
    return acc;
  }, []);
};

export const getRandom = (length) => {
  return Math.floor(Math.random() * (length - 0) + 0);
};

export const puzzleArr = () => {
  return Object.keys(puzzle).flatMap((val) => {
    return Object.keys(puzzle[val]).map((subVal) => {
      return [val, subVal];
    });
  });
};

export const playSound = (audPath) => {
  return new Audio(audPath);
};

export const getTimeString = (time) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  const timeStr = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  return timeStr;
};

export const gameProgress = (flaggedCells) => {
  return Array.from(flaggedCells).reduce((acc, item) => {
    acc.push([item.dataset.col, item.dataset.row, item.classList[1]]);
    return acc;
  }, []);
};
