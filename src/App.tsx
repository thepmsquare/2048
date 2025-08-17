import "./stylesheets/App.css";

import { Component } from "react";

import Game from "./Game.tsx";

class App extends Component {
  render = () => {
    return (
      <div className="App">
        <Game />
      </div>
    );
  };
}

export default App;
