import React, { Component } from "react";
import { Swipeable } from "react-swipeable";
import { isBrowser } from "react-device-detect";
import _ from "lodash";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "./stylesheets/Game.css";
import TitleRow from "./TitleRow";
import Selector from "./Selector";
import Commands from "./Commands";
import Board from "./Board";
class Game extends Component {
  constructor(props) {
    super(props);
    // change this to change default grid size.
    const startSize = 4;
    // change this to change upper and lower limits of grid sizes.
    this.upperLimit = 8;
    this.lowerLimit = 3;
    const allBoards = [];
    for (let i = this.lowerLimit; i <= this.upperLimit; i++) {
      allBoards.push({ size: i, board: [], sum: 0, best: 0, history: [] });
    }
    allBoards.forEach((board) => {
      for (let i = 1; i <= board.size; i++) {
        for (let j = 1; j <= board.size; j++) {
          board.board.push({ row: i, col: j, value: "" });
        }
      }
    });
    this.state = {
      gridSize: startSize,
      allBoards,
      snackbar: true,
    };
  }
  componentDidMount = () => {
    this.startGame();
  };
  handleInput = (eventData) => {
    let input = "";
    if (eventData.dir) {
      input = eventData.dir;
    } else if (eventData.key) {
      input = eventData.key;
    }

    if (
      input === "Right" ||
      input === "a" ||
      input === "A" ||
      input === "ArrowRight"
    ) {
      this.goRight();
    } else if (
      input === "Left" ||
      input === "d" ||
      input === "D" ||
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
  handleChangeGrid = (newGrid) => {
    let board = this.state.allBoards.find((ele) => ele.size === newGrid);
    this.setState(
      () => {
        return { gridSize: newGrid };
      },
      () => {
        if (board.sum === 0) {
          this.startGame();
        }
      }
    );
  };
  startGame = () => {
    const newAllBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const options = [
      ...newAllBoards.find((ele) => ele.size === this.state.gridSize).board,
    ];
    const choices = [];
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
    this.setState(() => {
      return {
        allBoards: newAllBoards,
      };
    });
  };
  goUp = () => {
    const size = this.state.gridSize;
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const oldBoard = JSON.parse(
      JSON.stringify(allBoards.find((ele) => ele.size === size).board)
    );
    const board = allBoards.find((ele) => ele.size === size).board;
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
        mergedCurValues.push("");
      }
      col.forEach((ele, index) => (ele.value = mergedCurValues[index]));
    });

    for (let i = 0; i < cols.length; i++) {
      tempNew.push(...cols[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        newBoard.push(tempNew.find((ele) => ele.row === i && ele.col === j));
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(() => {
        return { allBoards };
      }, this.addRandomNumber);
    }
  };
  goDown = () => {
    const size = this.state.gridSize;
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const oldBoard = JSON.parse(
      JSON.stringify(allBoards.find((ele) => ele.size === size).board)
    );
    const board = allBoards.find((ele) => ele.size === size).board;
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
        mergedCurValues.unshift("");
      }
      col.forEach((ele, index) => (ele.value = mergedCurValues[index]));
    });

    for (let i = 0; i < cols.length; i++) {
      tempNew.push(...cols[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        newBoard.push(tempNew.find((ele) => ele.row === i && ele.col === j));
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(() => {
        return { allBoards };
      }, this.addRandomNumber);
    }
  };
  goLeft = () => {
    const size = this.state.gridSize;
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const oldBoard = JSON.parse(
      JSON.stringify(allBoards.find((ele) => ele.size === size).board)
    );
    const board = allBoards.find((ele) => ele.size === size).board;
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
        mergedCurValues.push("");
      }
      row.forEach((ele, index) => (ele.value = mergedCurValues[index]));
    });
    for (let i = 0; i < rows.length; i++) {
      tempNew.push(...rows[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        newBoard.push(tempNew.find((ele) => ele.row === i && ele.col === j));
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      allBoards[changeThisIndex].board = newBoard;
      this.setState(() => {
        return { allBoards };
      }, this.addRandomNumber);
    }
  };
  goRight = () => {
    const size = this.state.gridSize;
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const oldBoard = JSON.parse(
      JSON.stringify(allBoards.find((ele) => ele.size === size).board)
    );
    const board = allBoards.find((ele) => ele.size === size).board;
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
        mergedCurValues.unshift("");
      }
      row.forEach((ele, index) => (ele.value = mergedCurValues[index]));
    });

    for (let i = 0; i < rows.length; i++) {
      tempNew.push(...rows[i]);
    }
    for (let i = 1; i <= size; i++) {
      for (let j = 1; j <= size; j++) {
        newBoard.push(tempNew.find((ele) => ele.row === i && ele.col === j));
      }
    }
    if (!_.isEqual(oldBoard, newBoard)) {
      const changeThisIndex = allBoards.findIndex((ele) => ele.size === size);
      allBoards[changeThisIndex].board = newBoard;
      allBoards[changeThisIndex].history.push(oldBoard);
      if (allBoards[changeThisIndex].history.length > 5) {
        allBoards[changeThisIndex].history.shift();
      }
      this.setState(() => {
        return { allBoards };
      }, this.addRandomNumber);
    }
  };
  addRandomNumber = () => {
    // change this to change probability of new number.
    const newNumber = [2, 2, 2, 2, 4];
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const newBoard = allBoards.find((ele) => ele.size === this.state.gridSize)
      .board;

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
    this.setState(() => {
      return {
        allBoards,
      };
    });
  };
  handleReset = () => {
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const board = allBoards.find((ele) => ele.size === this.state.gridSize)
      .board;
    board.forEach((block) => {
      block.value = "";
    });
    const changeThisIndex = allBoards.findIndex(
      (ele) => ele.size === this.state.gridSize
    );
    allBoards[changeThisIndex].board = board;
    this.setState({ allBoards }, this.startGame);
  };
  handleUndo = () => {
    const allBoards = JSON.parse(JSON.stringify(this.state.allBoards));
    const curBoard = allBoards.find((ele) => ele.size === this.state.gridSize);
    curBoard.board = curBoard.history.pop();
    const sum = _.sumBy(
      curBoard.board.filter((ele) => ele.value),
      "value"
    );
    curBoard.sum = sum;
    this.setState({ allBoards });
  };
  render = () => {
    let allBoardsWithCurrentGridSize = this.state.allBoards.find(
      (ele) => ele.size === this.state.gridSize
    );
    return (
      <Swipeable onSwiped={this.handleInput}>
        <div className="Game" tabIndex={0} onKeyDown={this.handleInput}>
          <TitleRow
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
      </Swipeable>
    );
  };
}

export default Game;
