import React, { Component } from "react";
import { Swipeable } from "react-swipeable";
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
    };
  }
  handleSwipe = (eventData) => {
    console.log(eventData.dir);
  };
  render = () => {
    return (
      <Swipeable onSwiped={this.handleSwipe}>
        <div className="Game">
          <TitleRow />
          <div className="Game-secondRow">
            <Selector />
            <Commands />
          </div>

          <Board size={this.state.gridSize} />
        </div>
      </Swipeable>
    );
  };
}

export default Game;
