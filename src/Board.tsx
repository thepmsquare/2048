import "./stylesheets/Board.css";

import { Component } from "react";

import colorPalette from "./constant.ts";
import SingleBlock from "./SingleBlock.tsx";

// todo: move to a more appropriate place
interface Block {
  row: number;
  col: number;
  value: number;
}
// todo: move to a more appropriate place
interface BoardProps {
  size: number;
  board: Block[];
}

class Board extends Component<BoardProps> {
  getColor(value: number): string | undefined {
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
            <SingleBlock
              block={block}
              key={`${block.row}-${block.col}`}
              backgroundColor={this.getColor(block.value)}
            />
          );
        })}
      </div>
    );
  };
}

export default Board;
