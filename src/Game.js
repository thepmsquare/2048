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
      console.log("Right");
    } else if (
      input === "Left" ||
      input === "d" ||
      input === "D" ||
      input === "ArrowLeft"
    ) {
      console.log("Left");
    } else if (
      input === "Up" ||
      input === "w" ||
      input === "W" ||
      input === "ArrowUp"
    ) {
      console.log("Up");
    } else if (
      input === "Down" ||
      input === "s" ||
      input === "S" ||
      input === "ArrowDown"
    ) {
      console.log("Down");
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
