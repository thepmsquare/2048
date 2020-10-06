import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import "./stylesheets/Board.css";
import colorPalette from './constant';
class Board extends Component {

  getColor(value){
     for (let palette in colorPalette){
       if(parseInt(palette)===value){
         return colorPalette[palette]
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
            <Paper style={{backgroundColor:this.getColor(block.value),color:'#FFF'}} key={`${block.row}-${block.col}`} className="Board-block">
              <Typography component="h4" variant="h4" > {block.value} </Typography>
            </Paper>
          );
        })}
      </div>
    );
  };
}

export default Board;
