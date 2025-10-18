import "./stylesheets/Board.css";

import { Component } from "react";

import { Paper } from "@mui/material";

import colorPalette from "./constant.ts";

import type { BoardProps, Move } from "./types/All.ts";
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
  private blockRefs: Record<string, HTMLDivElement | null> = {};
  componentDidUpdate(prevProps: BoardProps) {
    // Clear stale refs
    const currentKeys = new Set(
      this.props.board.map((b) => `${b.row}-${b.col}`)
    );
    Object.keys(this.blockRefs).forEach((key) => {
      if (!currentKeys.has(key)) {
        delete this.blockRefs[key];
      }
    });

    if (prevProps.movesState !== this.props.movesState) {
      this.animateMoves(this.props.movesState);
    }
  }
  animateMoves = (moves: Move[]) => {
    moves.forEach((move) => {
      switch (move.type) {
        case "slide":
          this.animateSlide(move);
          break;
        case "merge":
          // this.animateMerge(move);
          break;
        case "create":
          this.animateCreate(move);
          break;
      }
    });
  };
  animateCreate = (move: Move) => {
    const newKey = `${move.new.row}-${move.new.col}`;
    const element = this.blockRefs[newKey];

    if (element) {
      // Set initial state without transition
      element.style.transform = "scale(0)";
      element.style.transition = "none";

      // Force reflow to apply initial state
      void element.offsetHeight;

      // Apply transition and final state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.transition = "transform 0.2s ease";
          element.style.transform = "scale(1)";
        });
      });
    }
  };
  animateSlide = (move: Move) => {
    // const oldKey = `${move.old.row}-${move.old.col}`;
    const newKey = `${move.new.row}-${move.new.col}`;
    const element = this.blockRefs[newKey];

    if (!element) return;

    // compute delta (assuming each grid cell is equal in size)
    const styles = getComputedStyle(element.parentElement!);
    const gap = parseFloat(styles.gap || "0");
    const cellSize = element.offsetWidth + gap;

    const dx = (move.old.col - move.new.col) * cellSize;
    const dy = (move.old.row - move.new.row) * cellSize;

    // reset to start position (visually starts from old spot)
    element.style.transition = "none";
    element.style.transform = `translate(${dx}px, ${dy}px)`;

    // force reflow before animating
    void element.offsetHeight;

    // animate to final position
    requestAnimationFrame(() => {
      element.style.transition = "transform 0.15s ease";
      element.style.transform = "translate(0, 0)";
    });
  };

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
          const key = `${block.row}-${block.col}`;
          return (
            <Paper
              ref={(el: HTMLDivElement | null) => {
                this.blockRefs[key] = el;
              }}
              style={{
                backgroundColor: this.getColor(block.value),
                color: "#FFF",
              }}
              key={key}
              className="Board-block"
            >
              {block.value}
            </Paper>
          );
        })}
      </div>
    );
  };
}

export default Board;
