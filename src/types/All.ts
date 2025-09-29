import type { ReactNode } from "react";

interface Block {
  row: number;
  col: number;
  value: number;
  id: string;
}

interface BoardProps {
  size: number;
  board: Block[];
}

interface CommandsProps {
  numberOfUndos: number;
  handleUndo: () => void;
  handleReset: () => void;
}

interface CommandsState {
  showDialog: boolean;
}

// todo: keep a better type
interface ColorPalette {
  [key: number]: string;
}

interface DialogAppProps {
  children: ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
}

interface GameBoard {
  size: number;
  board: Block[];
  sum: number;
  best: number;
  history: Block[][];
  winCondition: number;
  needToWin: boolean;
  gameOver: boolean;
}

interface SelectorProps {
  handleChangeGrid: (newGrid: number) => void;
}

interface SelectorState {
  displayRow: boolean;
  value: number;
}

interface SingleBlockProps {
  block: Block;
  backgroundColor: string | undefined;
}

interface TitleRowProps {
  winCondition: number;
  sum: number;
  best: number;
}

interface Move {
  old: {
    row: number;
    col: number;
  };
  new: {
    row: number;
    col: number;
  };
  type: "slide" | "merge";
}

export type {
  Block,
  Move,
  BoardProps,
  CommandsProps,
  CommandsState,
  DialogAppProps,
  ColorPalette,
  GameBoard,
  SelectorProps,
  SingleBlockProps,
  SelectorState,
  TitleRowProps,
};
