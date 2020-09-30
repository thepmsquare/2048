import React, { Component } from "react";
import { Swipeable } from "react-swipeable";
import "./stylesheets/Game.css";
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: "",
    };
  }
  handleSwipe = (eventData) => {
    this.setState(() => {
      return {
        dir: eventData.dir,
      };
    });
  };
  render = () => {
    return (
      <div className="Game">
        <Swipeable onSwiped={this.handleSwipe}>
          <h1>Game</h1>
          {this.state.dir}
        </Swipeable>
      </div>
    );
  };
}

export default Game;
