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
    this.state = {
      gridSize: 4,
      snackbar: true,
    };
  }
  handleSwipe = (eventData) => {
    console.log(eventData.dir);
  };
  handleKeyPress = (eventData) => {
    console.log(eventData.key);
  };
  handleSnackbarClose = () => {
    this.setState(() => {
      return { snackbar: false };
    });
  };
  handleChangeGrid = (newGrid) => {
    this.setState(() => {
      return { gridSize: newGrid };
    });
  };
  render = () => {
    return (
      <Swipeable onSwiped={this.handleSwipe}>
        <div className="Game" tabIndex={0} onKeyDown={this.handleKeyPress}>
          <TitleRow />
          <div className="Game-secondRow">
            <Selector handleChangeGrid={this.handleChangeGrid} />
            <Commands />
          </div>

          <Board size={this.state.gridSize} />
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
