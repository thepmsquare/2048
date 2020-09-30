import React, { Component } from "react";
import { Swipeable } from "react-swipeable";
import "./stylesheets/Game.css";
class Game extends Component {
  handleSwipe = (eventData) => {
    console.log(eventData.dir);
  };
  render = () => {
    return (
      <div className="Game">
        <Swipeable onSwiped={this.handleSwipe}>
          <h1>Game</h1>
        </Swipeable>
      </div>
    );
  };
}

export default Game;
