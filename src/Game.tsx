import "./stylesheets/Game.css";

import _ from "lodash";
import React, { Component } from "react";
import { isBrowser } from "react-device-detect";

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

// todo: move to a more appropriate place
interface Block {
  row: number;
  col: number;
  value: number;
}
// todo: move to a more appropriate place
interface GameBoard {
  size: number;
  board: Block[];
  sum: number;
  best: number;
  history: Block[][];
  winCondition: number;
  needToWin: boolean;
  gameOver: boolean;
}
// todo: move to a more appropriate place
interface GameState {
  gridSize: number;
  allBoards: GameBoard[];
  snackbar: boolean;
  winDialog: boolean;
  gameOverDialog: boolean;
}

class Game extends Component<{}, GameState> {
  upperLimit: number;
  lowerLimit: number;
  winConditions: { size: number; condition: number }[];
  constructor(props: {}) {
    super(props);
    // change this to change default grid size.
    const storedValue = window.localStorage.getItem("gridSize");
    const startSize = storedValue ? JSON.parse(storedValue) : 4;
    // change this to change upper and lower limits of grid sizes.
    this.upperLimit = 8;
    this.lowerLimit = 3;
    // messy way to fix the special case of 3x3 grid having 1024 as win condition.
    this.winConditions = [
      { size: 3, condition: 1024 },
      { size: 4, condition: 2048 },
      { size: 5, condition: 2048 },
      { size: 6, condition: 2048 },
      { size: 7, condition: 2048 },
      { size: 8, condition: 2048 },
    ];
    const allBoards: GameBoard[] = [];
    for (let i = this.lowerLimit; i <= this.upperLimit; i++) {
      let winCondition = this.winConditions.find(
        (ele) => ele.size === i
      )?.condition;

      allBoards.push({
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
    allBoards.forEach((board) => {
      for (let i = 1; i <= board.size; i++) {
        for (let j = 1; j <= board.size; j++) {
          board.board.push({ row: i, col: j, value: 0 });
        }
      }
    });
    let startAllBoardsLocalStorage = window.localStorage.getItem("allBoards");
    const startAllBoards = startAllBoardsLocalStorage
      ? JSON.parse(startAllBoardsLocalStorage)
      : allBoards;

    this.state = {
      gridSize: startSize,
      allBoards: startAllBoards,
      snackbar: true,
      winDialog: false,
      gameOverDialog: false,
    };
  }

  componentDidMount = () => {
    if (!this.state.allBoards.some((board) => board.sum > 0)) {
      this.startGame();
    }
  };

  handleKeyInput: KeyboardEventHandler<HTMLDivElement> = (eventData) => {
    let input = eventData.key;

    if (
      input === "Right" ||
      input === "d" ||
      input === "D" ||
      input === "ArrowRight"
    ) {
      this.goRight();
    } else if (
      input === "Left" ||
      input === "a" ||
      input === "A" ||
      input === "ArrowLeft"
    ) {
      this.goLeft();
    } else if (
      input === "Up" ||
      input === "w" ||
      input === "W" ||
      input === "ArrowUp"
    ) {
      this.goUp();
    } else if (
      input === "Down" ||
      input === "s" ||
      input === "S" ||
      input === "ArrowDown"
    ) {
      this.goDown();
    }
  };
  handleSnackbarClose = () => {
    this.setState(() => {
      return { snackbar: false };
    });
  };
  handleChangeGrid = (newGrid: number) => {
    let board = this.state.allBoards.find((ele) => ele.size === newGrid);
    if (board === undefined) {
      console.error("Invalid grid size selected: ", newGrid);
      return;
    }
    this.setState(
      () => {
        return { gridSize: newGrid };
      },
      () => {
        window.localStorage.setItem("gridSize", JSON.stringify(newGrid));
        if (board.sum === 0) {
          this.startGame();
        }
      }
    );
  };
  startGame = () => {
    const newAllBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = newAllBoards.find((ele) => ele.size === this.state.gridSize);
    if (!finder) {
      console.error(
        "Invalid grid size for starting game: ",
        this.state.gridSize
      );
      return;
    }
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
      (ele) => ele.size === this.state.gridSize
    );
    newAllBoards[changeThisIndex].board = options;
    newAllBoards[changeThisIndex].sum = sum;
    newAllBoards[changeThisIndex].best =
      sum > newAllBoards[changeThisIndex].best
        ? sum
        : newAllBoards[changeThisIndex].best;
    this.setState(
      () => {
        return {
          allBoards: newAllBoards,
        };
      },
      () => {
        window.localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
      }
    );
  };
  goUp = () => {
    const size = this.state.gridSize;
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === size);
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
    cols.forEach((col) => {
      let curValues = col.map((ele) => ele.value);
      let filteredCurValues = curValues.filter((ele) => ele);
      let mergedCurValues = [];
      for (let i = 0; i < filteredCurValues.length; i++) {
        if (filteredCurValues[i] === filteredCurValues[i + 1]) {
          mergedCurValues.push(filteredCurValues[i] + filteredCurValues[i + 1]);
          i++;
        } else {
          mergedCurValues.push(filteredCurValues[i]);
        }
      }
      while (mergedCurValues.length !== size) {
        mergedCurValues.push(0);
      }
      col.forEach((ele, index) => (ele.value = mergedCurValues[index]));
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
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(
        () => {
          return { allBoards };
        },
        () => {
          window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
          if (allBoards[changeThisIndex].needToWin) {
            this.checkForWin();
          } else {
            this.addRandomNumber();
          }
        }
      );
    }
  };
  goDown = () => {
    const size = this.state.gridSize;
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === size);
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
    cols.forEach((col) => {
      let curValues = col.map((ele) => ele.value);
      let filteredCurValues = curValues.filter((ele) => ele);
      let mergedCurValues = [];
      for (let i = filteredCurValues.length - 1; i >= 0; i--) {
        if (filteredCurValues[i] === filteredCurValues[i - 1]) {
          mergedCurValues.unshift(
            filteredCurValues[i] + filteredCurValues[i - 1]
          );
          i--;
        } else {
          mergedCurValues.unshift(filteredCurValues[i]);
        }
      }
      while (mergedCurValues.length !== size) {
        mergedCurValues.unshift(0);
      }
      col.forEach((ele, index) => (ele.value = mergedCurValues[index]));
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
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(
        () => {
          return { allBoards };
        },
        () => {
          window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
          if (allBoards[changeThisIndex].needToWin) {
            this.checkForWin();
          } else {
            this.addRandomNumber();
          }
        }
      );
    }
  };
  goLeft = () => {
    const size = this.state.gridSize;
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === size);
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
    rows.forEach((row) => {
      let curValues = row.map((ele) => ele.value);
      let filteredCurValues = curValues.filter((ele) => ele);
      let mergedCurValues = [];
      for (let i = 0; i < filteredCurValues.length; i++) {
        if (filteredCurValues[i] === filteredCurValues[i + 1]) {
          mergedCurValues.push(filteredCurValues[i] + filteredCurValues[i + 1]);
          i++;
        } else {
          mergedCurValues.push(filteredCurValues[i]);
        }
      }
      while (mergedCurValues.length !== size) {
        mergedCurValues.push(0);
      }
      row.forEach((ele, index) => (ele.value = mergedCurValues[index]));
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
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(
        () => {
          return { allBoards };
        },
        () => {
          window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
          if (allBoards[changeThisIndex].needToWin) {
            this.checkForWin();
          } else {
            this.addRandomNumber();
          }
        }
      );
    }
  };
  goRight = () => {
    const size = this.state.gridSize;
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === size);
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
    rows.forEach((row) => {
      let curValues = row.map((ele) => ele.value);
      let filteredCurValues = curValues.filter((ele) => ele);
      let mergedCurValues = [];
      for (let i = filteredCurValues.length - 1; i >= 0; i--) {
        if (filteredCurValues[i] === filteredCurValues[i - 1]) {
          mergedCurValues.unshift(
            filteredCurValues[i] + filteredCurValues[i - 1]
          );
          i--;
        } else {
          mergedCurValues.unshift(filteredCurValues[i]);
        }
      }
      while (mergedCurValues.length !== size) {
        mergedCurValues.unshift(0);
      }
      row.forEach((ele, index) => (ele.value = mergedCurValues[index]));
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
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].board = newBoard;
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      this.setState(
        () => {
          return { allBoards };
        },
        () => {
          window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
          if (allBoards[changeThisIndex].needToWin) {
            this.checkForWin();
          } else {
            this.addRandomNumber();
          }
        }
      );
    }
  };
  addRandomNumber = () => {
    // change this to change probability of new number.

    const newNumber = [2, 2, 2, 2, 4];
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === this.state.gridSize);
    if (!finder) {
      console.error(
        "Invalid grid size for adding random number: ",
        this.state.gridSize
      );
      return;
    }
    const newBoard = finder.board;

    const options = newBoard.filter((block) => !block.value);
    const optionsIndex = Math.floor(Math.random() * options.length);
    const changeThisElement = options[optionsIndex];
    // this seems redundant now. i didn't know about references before :(
    const indexOfChangedElement = newBoard.findIndex(
      (ele) =>
        ele.row === changeThisElement.row && ele.col === changeThisElement.col
    );
    newBoard[indexOfChangedElement].value =
      newNumber[Math.floor(Math.random() * newNumber.length)];
    const sum = _.sumBy(
      newBoard.filter((ele) => ele.value),
      "value"
    );

    const changeThisIndex = allBoards.findIndex(
      (ele) => ele.size === this.state.gridSize
    );
    allBoards[changeThisIndex].board = newBoard;
    allBoards[changeThisIndex].sum = sum;
    allBoards[changeThisIndex].best =
      sum > allBoards[changeThisIndex].best
        ? sum
        : allBoards[changeThisIndex].best;
    this.setState(
      () => {
        return {
          allBoards,
          gameOverDialog: this.checkGameOver(allBoards),
        };
      },
      () => {
        window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
      }
    );
  };
  handleReset = () => {
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    let finder = allBoards.find((ele) => ele.size === this.state.gridSize);
    if (!finder) {
      console.error("Invalid grid size for resetting: ", this.state.gridSize);
      return;
    }
    const board = finder.board;
    board.forEach((block) => {
      block.value = 0;
    });
    const changeThisIndex = allBoards.findIndex(
      (ele) => ele.size === this.state.gridSize
    );
    allBoards[changeThisIndex].board = board;
    allBoards[changeThisIndex].needToWin = true;
    allBoards[changeThisIndex].history = [];
    this.setState(
      { allBoards, gameOverDialog: false, winDialog: false },
      () => {
        window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
        this.startGame();
      }
    );
  };
  handleUndo = () => {
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    const curBoard = allBoards.find((ele) => ele.size === this.state.gridSize);
    if (!curBoard) {
      console.error("Invalid grid size for undo: ", this.state.gridSize);
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
    this.setState({ allBoards }, () => {
      window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
    });
  };
  checkGameOver = (allBoards: GameBoard[]) => {
    const size = this.state.gridSize;
    let allBoardsWithCurrentGridSize = allBoards.find(
      (ele) => ele.size === this.state.gridSize
    );
    if (!allBoardsWithCurrentGridSize) {
      console.error(
        "Invalid grid size for checking game over: ",
        this.state.gridSize
      );
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
  checkForWin = () => {
    const allBoards: GameBoard[] = JSON.parse(
      JSON.stringify(this.state.allBoards)
    );
    const board = allBoards.find((ele) => ele.size === this.state.gridSize);
    if (!board) {
      console.error(
        "Invalid grid size for checking win: ",
        this.state.gridSize
      );
      return;
    }
    if (board.board.some((block) => block.value === board.winCondition)) {
      board.needToWin = false;
      this.setState(
        () => {
          return { allBoards, winDialog: true };
        },
        () => {
          window.localStorage.setItem("allBoards", JSON.stringify(allBoards));
        }
      );
    } else {
      this.addRandomNumber();
    }
  };
  handleWinDialogClose = () => {
    this.setState(() => {
      return { winDialog: false };
    }, this.addRandomNumber);
  };
  handleGameOverDialogClose = () => {
    this.setState(() => {
      return { gameOverDialog: false };
    });
  };
  render = () => {
    let allBoardsWithCurrentGridSize = this.state.allBoards.find(
      (ele) => ele.size === this.state.gridSize
    );
    if (!allBoardsWithCurrentGridSize) {
      return <div>error</div>;
    }
    return (
      <>
        <div className="Game" tabIndex={0} onKeyDown={this.handleKeyInput}>
          <TitleRow
            winCondition={allBoardsWithCurrentGridSize.winCondition}
            sum={allBoardsWithCurrentGridSize.sum}
            best={allBoardsWithCurrentGridSize.best}
          />
          <div className="Game-secondRow">
            <Selector handleChangeGrid={this.handleChangeGrid} />
            <Commands
              numberOfUndos={allBoardsWithCurrentGridSize.history.length}
              handleReset={this.handleReset}
              handleUndo={this.handleUndo}
            />
          </div>

          <Board
            size={this.state.gridSize}
            board={allBoardsWithCurrentGridSize.board}
          />
        </div>
        {isBrowser && (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={this.state.snackbar}
            autoHideDuration={6000}
            onClose={this.handleSnackbarClose}
            message="Use AWSD or Arrow Keys to Play."
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={this.handleSnackbarClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        )}

        <DialogApp
          title="You Win!"
          open={this.state.winDialog}
          onClose={this.handleWinDialogClose}
        >
          <Button onClick={this.handleReset} color="primary">
            Reset
          </Button>
          <Button onClick={this.handleWinDialogClose} color="primary" autoFocus>
            Keep Playing
          </Button>
        </DialogApp>

        <DialogApp
          title="Game Over!"
          open={this.state.gameOverDialog}
          onClose={this.handleGameOverDialogClose}
        >
          <Button
            onClick={() => {
              this.handleUndo();
              this.handleGameOverDialogClose();
            }}
            color="primary"
          >
            Undo
          </Button>
          <Button onClick={this.handleReset} color="primary">
            Reset
          </Button>
        </DialogApp>
      </>
    );
  };
}

export default Game;
