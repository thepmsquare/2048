import React, { Component } from "react";
import { Swipeable } from "react-swipeable";
import { isBrowser } from "react-device-detect";
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
    const startSize = 4;
    const startBoard = [];
    for (let i = 1; i <= startSize; i++) {
      for (let j = 1; j <= startSize; j++) {
        startBoard.push({ row: i, col: j, value: "" });
      }
    }
    this.state = {
      gridSize: startSize,
      board: startBoard,
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
    const newBoard = [];
    for (let i = 1; i <= newGrid; i++) {
      for (let j = 1; j <= newGrid; j++) {
        newBoard.push({ row: i, col: j, value: "" });
      }
    }
    this.setState(() => {
      return { gridSize: newGrid, board: newBoard };
    }, this.startGame);
  };
  startGame = () => {
    const choices = [];
    const options = [...this.state.board];
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
    this.setState(() => {
      return {
        board: options,
      };
    });
  };
  goUp = () => {
    const size = this.state.gridSize;
    const board = [...this.state.board];
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
    this.setState(() => {
      return { board: newBoard };
    }, this.addRandomNumber);
  };
  goDown = () => {
    const size = this.state.gridSize;
    const board = [...this.state.board];
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
    this.setState(() => {
      return { board: newBoard };
    }, this.addRandomNumber);
  };
  goLeft = () => {
    const size = this.state.gridSize;
    const board = [...this.state.board];
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
    this.setState(() => {
      return { board: newBoard };
    }, this.addRandomNumber);
  };
  goRight = () => {
    const size = this.state.gridSize;
    const board = [...this.state.board];
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
    this.setState(() => {
      return { board: newBoard };
    }, this.addRandomNumber);
  };
  addRandomNumber = () => {
    const newNumber = [2, 2, 2, 2, 4];
    const newBoard = [...this.state.board];
    const options = newBoard.filter((block) => !block.value);
    const optionsIndex = Math.floor(Math.random() * options.length);
    const changeThisElement = options[optionsIndex];
    const indexOfChangedElement = newBoard.findIndex(
      (ele) =>
        ele.row === changeThisElement.row && ele.col === changeThisElement.col
    );
    newBoard[indexOfChangedElement].value =
      newNumber[Math.floor(Math.random() * newNumber.length)];
    this.setState(() => {
      return { board: newBoard };
    });
  };
  render = () => {
    return (
      <Swipeable onSwiped={this.handleInput}>
        <div className="Game" tabIndex={0} onKeyDown={this.handleInput}>
          <TitleRow />
          <div className="Game-secondRow">
            <Selector handleChangeGrid={this.handleChangeGrid} />
            <Commands />
          </div>

          <Board size={this.state.gridSize} board={this.state.board} />
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
