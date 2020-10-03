import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import "./stylesheets/Board.css";

class Board extends Component {
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
            <Paper key={`${block.row}-${block.col}`} className="Board-block">
              <Typography> {block.value} </Typography>
            </Paper>
          );
        })}
      </div>
    );
  };
}

export default Board;
