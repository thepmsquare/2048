import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import "./stylesheets/Board.css";
import colorPalette from "./constant";
class Board extends Component {
  getColor(value) {
    let compareThis = Math.log2(value);
    while (compareThis > 11) {
      compareThis -= 11;
    }
    for (let palette in colorPalette) {
      if (parseInt(palette) === compareThis) {
        return colorPalette[palette];
      }
    }
  }

  render = () => {
    const { size, board } = this.props;
    return (
      <div
        className="Board"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {board.map((block) => {
          return (
            <Paper
              style={{
                backgroundColor: this.getColor(block.value),
                color: "#FFF",
              }}
              key={`${block.row}-${block.col}`}
              className="Board-block"
            >
              <Typography> {block.value} </Typography>
            </Paper>
          );
        })}
      </div>
    );
  };
}

export default Board;
