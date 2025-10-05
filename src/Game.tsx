import "./stylesheets/Game.css";

import _ from "lodash";
import React, { useEffect } from "react";
import { isBrowser } from "react-device-detect";
import { useSwipeable } from "react-swipeable";

import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";

import Board from "./Board.tsx";
import Commands from "./Commands.tsx";
import DialogApp from "./DialogApp.tsx";
import Selector from "./Selector.tsx";
import TitleRow from "./TitleRow.tsx";

import type { KeyboardEventHandler } from "react";
import type { GameBoard, Block, Move } from "./types/All.ts";

const Game = () => {
  // change this to change default grid size.
  const storedValue = window.localStorage.getItem("gridSize");
  const startSize = storedValue ? JSON.parse(storedValue) : 4;
  // change this to change upper and lower limits of grid sizes.
  let upperLimit: number = 8;
  let lowerLimit: number = 3;
  // messy way to fix the special case of 3x3 grid having 1024 as win condition.
  let winConditions: { size: number; condition: number }[] = [
    { size: 3, condition: 1024 },
    { size: 4, condition: 2048 },
    { size: 5, condition: 2048 },
    { size: 6, condition: 2048 },
    { size: 7, condition: 2048 },
    { size: 8, condition: 2048 },
  ];
  const allBoardsGlobalUnsafe: GameBoard[] = [];
  for (let i = lowerLimit; i <= upperLimit; i++) {
    let winCondition = winConditions.find((ele) => ele.size === i)?.condition;

    allBoardsGlobalUnsafe.push({
      size: i,
      board: [],
      sum: 0,
      best: 0,
      history: [],
      winCondition: winCondition || 2048, // default to 2048 if not found
      needToWin: true,
      gameOver: false,
    });
  }
  allBoardsGlobalUnsafe.forEach((board) => {
    for (let i = 1; i <= board.size; i++) {
      for (let j = 1; j <= board.size; j++) {
        board.board.push({
          row: i,
          col: j,
          value: 0,
        });
      }
    }
  });
  let startAllBoardsLocalStorage = window.localStorage.getItem("allBoards");
  const startAllBoards = startAllBoardsLocalStorage
    ? JSON.parse(startAllBoardsLocalStorage)
    : allBoardsGlobalUnsafe;
  const [gridSize, setGridSize] = React.useState<number>(startSize);
  const [allBoardsState, setAllBoardsState] =
    React.useState<GameBoard[]>(startAllBoards);
  const [snackbar, setSnackbar] = React.useState<boolean>(true);
  const [winDialogOpen, setWinDialogOpen] = React.useState<boolean>(false);
  const [gameOverDialogOpen, setGameOverDialogOpen] =
    React.useState<boolean>(false);
  const [movesState, setMovesState] = React.useState<Move[]>([]);

  let handleKeyInput: KeyboardEventHandler<HTMLDivElement> = (eventData) => {
    let input = eventData.key;

    if (
      input === "Right" ||
      input === "d" ||
      input === "D" ||
      input === "ArrowRight"
    ) {
      goRight();
    } else if (
      input === "Left" ||
      input === "a" ||
      input === "A" ||
      input === "ArrowLeft"
    ) {
      goLeft();
    } else if (
      input === "Up" ||
      input === "w" ||
      input === "W" ||
      input === "ArrowUp"
    ) {
      goUp();
    } else if (
      input === "Down" ||
      input === "s" ||
      input === "S" ||
      input === "ArrowDown"
    ) {
      goDown();
    }
  };

  let handleSnackbarClose = () => {
    setSnackbar(false);
  };

  let handleChangeGrid = (newGrid: number) => {
    let board = allBoardsState.find((ele) => ele.size === newGrid);
    if (board === undefined) {
      console.error("Invalid grid size selected: ", newGrid);
      return;
    }
    setGridSize(newGrid);
    window.localStorage.setItem("gridSize", JSON.stringify(newGrid));
  };

  let startGame = () => {
    const newAllBoards: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let finder = newAllBoards.find((ele) => ele.size === gridSize);
    if (!finder) {
      console.error("Invalid grid size for starting game: ", gridSize);
      return;
    }
    const board = finder.board;
    board.forEach((block) => {
      block.value = 0;
    });
    finder.needToWin = true;
    finder.gameOver = false;
    finder.history = [];
    // todo: refactor this logic to reduce duplicate code from addRandomNumberInPlace.
    const options = [...finder.board];
    const choices: number[] = [];
    // change this to change probability of 2 or 4 while start.
    const startValues = [2, 2, 2, 2, 4];
    while (choices.length !== 2) {
      let curChoice = Math.floor(Math.random() * options.length);
      if (!choices.includes(curChoice)) {
        choices.push(curChoice);
      }
    }
    choices.forEach((choice) => {
      options[choice].value =
        startValues[Math.floor(Math.random() * startValues.length)];
    });
    const sum = _.sumBy(
      options.filter((ele) => ele.value),
      "value"
    );
    const changeThisIndex = newAllBoards.findIndex(
      (ele) => ele.size === gridSize
    );
    newAllBoards[changeThisIndex].board = options;
    newAllBoards[changeThisIndex].sum = sum;
    newAllBoards[changeThisIndex].best =
      sum > newAllBoards[changeThisIndex].best
        ? sum
        : newAllBoards[changeThisIndex].best;
    setAllBoardsState(newAllBoards);
    window.localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
  };

  let goUp = () => {
    const size = gridSize;
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let finder = allBoardsLocalClone.find((ele) => ele.size === size);
    if (!finder) {
      console.error("Invalid grid size for going up: ", size);
      return;
    }
    const oldBoard = JSON.parse(JSON.stringify(finder.board));
    const board = finder.board;
    const cols = [];
    const newBoard = [];
    const tempNew = [];
    for (let i = 1; i <= size; i++) {
      cols.push(board.filter((ele) => ele.col === i));
    }
    let moves: Move[] = [];
    cols.forEach((col, colIdx) => {
      let colClone: Block[] = JSON.parse(JSON.stringify(col));
      // sliding logic
      let newCol = colClone.filter((ele) => ele.value);
      for (let rowIdx = newCol.length; rowIdx < size; rowIdx++) {
        newCol.push({
          row: rowIdx + 1,
          col: colIdx + 1,
          value: 0,
        });
      }

      newCol.forEach((ele, rowIdx) => {
        if (ele.row !== rowIdx + 1) {
          moves.push({
            old: { row: ele.row, col: ele.col },
            new: { row: rowIdx + 1, col: ele.col },
            type: "slide",
          });
          ele.row = rowIdx + 1;
        }
      });
      // merging logic
      let mergedCols: Block[] = [];
      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i].value !== 0 && newCol[i].value === newCol[i + 1].value) {
          mergedCols.push({
            row: newCol[i].row,
            col: newCol[i].col,
            value: newCol[i].value + newCol[i + 1].value,
          });
          moves.push({
            old: { row: newCol[i].row + 1, col: newCol[i].col },
            new: { row: newCol[i].row, col: newCol[i].col },
            type: "merge",
          });
          i++;
        } else {
          mergedCols.push({
            ...newCol[i],
          });
        }
      }
      for (let rowIdx = mergedCols.length; rowIdx < size; rowIdx++) {
        mergedCols.push({
          row: rowIdx + 1,
          col: colIdx + 1,
          value: 0,
        });
      }
      cols[colIdx] = mergedCols;
    });

    for (let i = 0; i < cols.length; i++) {
      tempNew.push(...cols[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        const foundBlock = tempNew.find(
          (ele) => ele.row === i && ele.col === j
        );
        if (foundBlock) {
          newBoard.push(foundBlock);
        }
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoardsLocalClone.findIndex(
        (ele) => ele.size === size
      );
      allBoardsLocalClone[changeThisIndex].history.push(oldBoard);
      if (allBoardsLocalClone[changeThisIndex].history.length > 5) {
        allBoardsLocalClone[changeThisIndex].history.shift();
      }
      allBoardsLocalClone[changeThisIndex].board = newBoard;
      if (allBoardsLocalClone[changeThisIndex].needToWin) {
        checkForWin(allBoardsLocalClone[changeThisIndex]);
      } else {
        addRandomNumberInPlace(allBoardsLocalClone[changeThisIndex]);
      }
      setAllBoardsState(allBoardsLocalClone);
      setMovesState(moves);
      console.log(movesState);
      window.localStorage.setItem(
        "allBoards",
        JSON.stringify(allBoardsLocalClone)
      );
    }
  };

  let goDown = () => {
    const size = gridSize;
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let finder = allBoardsLocalClone.find((ele) => ele.size === size);
    if (!finder) {
      console.error("Invalid grid size for going down: ", size);
      return;
    }
    const oldBoard = JSON.parse(JSON.stringify(finder.board));
    const board = finder.board;
    const cols = [];
    const newBoard = [];
    const tempNew = [];
    for (let i = 1; i <= size; i++) {
      cols.push(board.filter((ele) => ele.col === i));
    }
    let moves: Move[] = [];
    cols.forEach((col, colIdx) => {
      let colClone: Block[] = JSON.parse(JSON.stringify(col));
      // sliding logic
      let newCol = colClone.filter((ele) => ele.value);
      let numLoops = size - newCol.length;
      for (let rowIdx = 0; rowIdx < numLoops; rowIdx++) {
        newCol.unshift({
          row: numLoops - rowIdx,
          col: colIdx + 1,
          value: 0,
        });
      }
      newCol.forEach((ele, rowIdx) => {
        if (ele.row !== rowIdx + 1) {
          moves.push({
            old: { row: ele.row, col: ele.col },
            new: { row: rowIdx + 1, col: ele.col },
            type: "slide",
          });
          ele.row = rowIdx + 1;
        }
      });
      // merging logic
      let mergedCols: Block[] = [];
      for (let i = newCol.length - 1; i >= 0; i--) {
        if (newCol[i].value !== 0 && newCol[i].value === newCol[i - 1].value) {
          mergedCols.unshift({
            row: newCol[i].row,
            col: newCol[i].col,
            value: newCol[i].value + newCol[i - 1].value,
          });
          mergedCols.unshift({
            row: newCol[i].row - 1,
            col: newCol[i].col,
            value: 0,
          });
          moves.push({
            old: { row: newCol[i].row - 1, col: newCol[i].col },
            new: { row: newCol[i].row, col: newCol[i].col },
            type: "merge",
          });
          i--;
        } else {
          mergedCols.unshift({
            ...newCol[i],
          });
        }
      }
      numLoops = size - mergedCols.length;
      for (let rowIdx = 0; rowIdx < numLoops; rowIdx++) {
        mergedCols.unshift({
          row: numLoops - rowIdx,
          col: colIdx + 1,
          value: 0,
        });
      }
      cols[colIdx] = mergedCols;
    });

    for (let i = 0; i < cols.length; i++) {
      tempNew.push(...cols[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        const foundBlock = tempNew.find(
          (ele) => ele.row === i && ele.col === j
        );
        if (foundBlock) {
          newBoard.push(foundBlock);
        }
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoardsLocalClone.findIndex(
        (ele) => ele.size === size
      );
      allBoardsLocalClone[changeThisIndex].history.push(oldBoard);
      if (allBoardsLocalClone[changeThisIndex].history.length > 5) {
        allBoardsLocalClone[changeThisIndex].history.shift();
      }
      allBoardsLocalClone[changeThisIndex].board = newBoard;
      if (allBoardsLocalClone[changeThisIndex].needToWin) {
        checkForWin(allBoardsLocalClone[changeThisIndex]);
      } else {
        addRandomNumberInPlace(allBoardsLocalClone[changeThisIndex]);
      }
      setAllBoardsState(allBoardsLocalClone);
      setMovesState(moves);
      window.localStorage.setItem(
        "allBoards",
        JSON.stringify(allBoardsLocalClone)
      );
    }
  };

  let goLeft = () => {
    const size = gridSize;
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let finder = allBoardsLocalClone.find((ele) => ele.size === size);
    if (!finder) {
      console.error("Invalid grid size for going left: ", size);
      return;
    }
    const oldBoard = JSON.parse(JSON.stringify(finder.board));
    const board = finder.board;
    const rows = [];
    const newBoard = [];
    const tempNew = [];
    for (let i = 1; i <= size; i++) {
      rows.push(board.filter((ele) => ele.row === i));
    }
    let moves: Move[] = [];
    rows.forEach((row, rowIdx) => {
      let rowClone: Block[] = JSON.parse(JSON.stringify(row));
      // sliding logic
      let newRow = rowClone.filter((ele) => ele.value);
      for (let colIdx = newRow.length; colIdx < size; colIdx++) {
        newRow.push({
          row: rowIdx + 1,
          col: colIdx + 1,
          value: 0,
        });
      }
      newRow.forEach((ele, colIdx) => {
        if (ele.col !== colIdx + 1) {
          moves.push({
            old: { row: ele.row, col: ele.col },
            new: { row: ele.row, col: colIdx + 1 },
            type: "slide",
          });
          ele.col = colIdx + 1;
        }
      });
      // merging logic
      let mergedRows: Block[] = [];
      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i].value !== 0 && newRow[i].value === newRow[i + 1].value) {
          mergedRows.push({
            row: newRow[i].row,
            col: newRow[i].col,
            value: newRow[i].value + newRow[i + 1].value,
          });
          moves.push({
            old: { row: newRow[i].row, col: newRow[i].col + 1 },
            new: { row: newRow[i].row, col: newRow[i].col },
            type: "merge",
          });
          i++;
        } else {
          mergedRows.push({
            ...newRow[i],
          });
        }
      }
      for (let colIdx = mergedRows.length; colIdx < size; colIdx++) {
        mergedRows.push({
          row: rowIdx + 1,
          col: colIdx + 1,
          value: 0,
        });
      }
      rows[rowIdx] = mergedRows;
    });
    for (let i = 0; i < rows.length; i++) {
      tempNew.push(...rows[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        const foundBlock = tempNew.find(
          (ele) => ele.row === i && ele.col === j
        );
        if (foundBlock) {
          newBoard.push(foundBlock);
        }
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoardsLocalClone.findIndex(
        (ele) => ele.size === size
      );
      allBoardsLocalClone[changeThisIndex].history.push(oldBoard);
      if (allBoardsLocalClone[changeThisIndex].history.length > 5) {
        allBoardsLocalClone[changeThisIndex].history.shift();
      }
      allBoardsLocalClone[changeThisIndex].board = newBoard;
      if (allBoardsLocalClone[changeThisIndex].needToWin) {
        checkForWin(allBoardsLocalClone[changeThisIndex]);
      } else {
        addRandomNumberInPlace(allBoardsLocalClone[changeThisIndex]);
      }
      setAllBoardsState(allBoardsLocalClone);
      setMovesState(moves);
      window.localStorage.setItem(
        "allBoards",
        JSON.stringify(allBoardsLocalClone)
      );
    }
  };

  let goRight = () => {
    const size = gridSize;
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let finder = allBoardsLocalClone.find((ele) => ele.size === size);
    if (!finder) {
      console.error("Invalid grid size for going right: ", size);
      return;
    }
    const oldBoard = JSON.parse(JSON.stringify(finder.board));
    const board = finder.board;
    const rows = [];
    const newBoard = [];
    const tempNew = [];
    for (let i = 1; i <= size; i++) {
      rows.push(board.filter((ele) => ele.row === i));
    }
    let moves: Move[] = [];
    rows.forEach((row, rowIdx) => {
      let rowClone: Block[] = JSON.parse(JSON.stringify(row));
      // sliding logic
      let newRow = rowClone.filter((ele) => ele.value);
      let numLoops = size - newRow.length;
      for (let colIdx = 0; colIdx < numLoops; colIdx++) {
        newRow.unshift({
          row: rowIdx + 1,
          col: numLoops - colIdx,
          value: 0,
        });
      }
      newRow.forEach((ele, colIdx) => {
        if (ele.col !== colIdx + 1) {
          moves.push({
            old: { row: ele.row, col: ele.col },
            new: { row: ele.row, col: colIdx + 1 },
            type: "slide",
          });
          ele.col = colIdx + 1;
        }
      });
      // merging logic
      let mergedRows: Block[] = [];
      for (let i = newRow.length - 1; i >= 0; i--) {
        if (newRow[i].value !== 0 && newRow[i].value === newRow[i - 1].value) {
          mergedRows.unshift({
            row: newRow[i].row,
            col: newRow[i].col,
            value: newRow[i].value + newRow[i - 1].value,
          });
          mergedRows.unshift({
            row: newRow[i].row,
            col: newRow[i].col - 1,
            value: 0,
          });
          moves.push({
            old: { row: newRow[i].row, col: newRow[i].col - 1 },
            new: { row: newRow[i].row, col: newRow[i].col },
            type: "merge",
          });
          i--;
        } else {
          mergedRows.unshift({
            ...newRow[i],
          });
        }
      }
      numLoops = size - mergedRows.length;
      for (let colIdx = 0; colIdx < numLoops; colIdx++) {
        mergedRows.unshift({
          row: rowIdx + 1,
          col: numLoops - colIdx,
          value: 0,
        });
      }
      rows[rowIdx] = mergedRows;
    });

    for (let i = 0; i < rows.length; i++) {
      tempNew.push(...rows[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        const foundBlock = tempNew.find(
          (ele) => ele.row === i && ele.col === j
        );
        if (foundBlock) {
          newBoard.push(foundBlock);
        }
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoardsLocalClone.findIndex(
        (ele) => ele.size === size
      );
      allBoardsLocalClone[changeThisIndex].board = newBoard;
      allBoardsLocalClone[changeThisIndex].history.push(oldBoard);
      if (allBoardsLocalClone[changeThisIndex].history.length > 5) {
        allBoardsLocalClone[changeThisIndex].history.shift();
      }
      if (allBoardsLocalClone[changeThisIndex].needToWin) {
        checkForWin(allBoardsLocalClone[changeThisIndex]);
      } else {
        addRandomNumberInPlace(allBoardsLocalClone[changeThisIndex]);
      }
      setAllBoardsState(allBoardsLocalClone);
      setMovesState(moves);
      window.localStorage.setItem(
        "allBoards",
        JSON.stringify(allBoardsLocalClone)
      );
    }
  };

  let addRandomNumberInPlace = (board: GameBoard) => {
    // change this to change probability of new number.
    const newNumber = [2, 2, 2, 2, 4];
    const newBoard = board.board;

    const options = newBoard.filter((block) => !block.value);
    const optionsIndex = Math.floor(Math.random() * options.length);
    const changeThisElement = options[optionsIndex];
    // this seems redundant now. i didn't know about references before :(
    // const indexOfChangedElement = newBoard.findIndex(
    //   (ele) =>
    //     ele.row === changeThisElement.row && ele.col === changeThisElement.col
    // );
    changeThisElement.value =
      newNumber[Math.floor(Math.random() * newNumber.length)];
    const sum = _.sumBy(
      newBoard.filter((ele) => ele.value),
      "value"
    );

    // allBoards[changeThisIndex].board = newBoard;
    board.sum = sum;
    board.best = sum > board.best ? sum : board.best;
  };

  let handleReset = () => {
    startGame();
  };

  let handleUndo = () => {
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    const curBoard = allBoardsLocalClone.find((ele) => ele.size === gridSize);
    if (!curBoard) {
      console.error("Invalid grid size for undo: ", gridSize);
      return;
    }
    let newBoard = curBoard.history.pop();
    if (newBoard) {
      curBoard.board = newBoard;
    }
    const sum = _.sumBy(
      curBoard.board.filter((ele) => ele.value),
      "value"
    );
    curBoard.sum = sum;
    setAllBoardsState(allBoardsLocalClone);
    window.localStorage.setItem(
      "allBoards",
      JSON.stringify(allBoardsLocalClone)
    );
  };

  let checkGameOver = (allBoardsParam: GameBoard[]) => {
    const size = gridSize;
    let allBoardsWithCurrentGridSize = allBoardsParam.find(
      (ele) => ele.size === gridSize
    );
    if (!allBoardsWithCurrentGridSize) {
      console.error("Invalid grid size for checking game over: ", gridSize);
      return false;
    }
    if (
      !allBoardsWithCurrentGridSize.board.some((block) => block.value === 0)
    ) {
      let gameOver = true;
      match: for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (
            j < size - 1 &&
            allBoardsWithCurrentGridSize.board[j + size * i].value ===
              allBoardsWithCurrentGridSize.board[j + 1 + size * i].value
          ) {
            gameOver = false;
            break match;
          }
          if (
            i < size - 1 &&
            allBoardsWithCurrentGridSize.board[j + size * i].value ===
              allBoardsWithCurrentGridSize.board[j + size * i + size].value
          ) {
            gameOver = false;
            break match;
          }
        }
      }

      if (gameOver) {
        return true;
      }
    }
    return false;
  };

  let checkForWin = (board: GameBoard) => {
    if (board.board.some((block) => block.value === board.winCondition)) {
      board.needToWin = false;
      setWinDialogOpen(true);
    } else {
      addRandomNumberInPlace(board);
    }
  };

  let handleWinDialogClose = () => {
    setWinDialogOpen(false);
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    const changeThisIndex = allBoardsLocalClone.findIndex(
      (ele) => ele.size === gridSize
    );
    if (changeThisIndex === -1) {
      console.error(
        "Invalid grid size for handling win dialog close: ",
        gridSize
      );
      return;
    }
    let board = allBoardsLocalClone[changeThisIndex];
    addRandomNumberInPlace(board);
  };

  let handleGameOverDialogClose = () => {
    setGameOverDialogOpen(false);
  };

  let allBoardsWithCurrentGridSize = allBoardsState.find(
    (ele) => ele.size === gridSize
  );

  if (!allBoardsWithCurrentGridSize) {
    return <div>error</div>;
  }

  useEffect(() => {
    if (!allBoardsState.some((board) => board.sum > 0)) {
      startGame();
    }
  }, []);

  useEffect(() => {
    const allBoardsLocalClone: GameBoard[] = JSON.parse(
      JSON.stringify(allBoardsState)
    );
    let board = allBoardsLocalClone.find((ele) => ele.size === gridSize);
    if (!board) {
      console.error("Invalid grid size for checking start game: ", gridSize);
      return;
    }
    if (board.sum === 0) {
      startGame();
    }
  }, [gridSize]);

  useEffect(() => {
    setGameOverDialogOpen(checkGameOver(allBoardsState));
  }, [allBoardsState]);

  // misc
  const handlers = useSwipeable({
    onSwipedUp: goUp,
    onSwipedDown: goDown,
    onSwipedLeft: goLeft,
    onSwipedRight: goRight,
    preventScrollOnSwipe: true,
  });
  return (
    <>
      <div
        className="Game"
        tabIndex={0}
        onKeyDown={handleKeyInput}
        {...handlers}
      >
        <TitleRow
          winCondition={allBoardsWithCurrentGridSize.winCondition}
          sum={allBoardsWithCurrentGridSize.sum}
          best={allBoardsWithCurrentGridSize.best}
        />
        <div className="Game-secondRow">
          <Selector handleChangeGrid={handleChangeGrid} />
          <Commands
            numberOfUndos={allBoardsWithCurrentGridSize.history.length}
            handleReset={handleReset}
            handleUndo={handleUndo}
          />
        </div>

        <Board size={gridSize} board={allBoardsWithCurrentGridSize.board} />
      </div>
      {isBrowser && (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Use AWSD or Arrow Keys to Play."
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      )}

      <DialogApp
        title="You Win!"
        open={winDialogOpen}
        onClose={handleWinDialogClose}
      >
        <Button onClick={handleReset} color="primary">
          Reset
        </Button>
        <Button onClick={handleWinDialogClose} color="primary" autoFocus>
          Keep Playing
        </Button>
      </DialogApp>

      <DialogApp
        title="Game Over!"
        open={gameOverDialogOpen}
        onClose={handleGameOverDialogClose}
      >
        <Button
          onClick={() => {
            handleUndo();
            handleGameOverDialogClose();
          }}
          color="primary"
        >
          Undo
        </Button>
        <Button onClick={handleReset} color="primary">
          Reset
        </Button>
      </DialogApp>
    </>
  );
};

export default Game;
