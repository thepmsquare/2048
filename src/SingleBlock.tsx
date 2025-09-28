import "./stylesheets/SingleBlock.css";

import { Paper, Typography } from "@mui/material";

// todo: move to a more appropriate place
interface Block {
  row: number;
  col: number;
  value: number;
}
// todo: move to a more appropriate place
interface SingleBlockProps {
  block: Block;
  backgroundColor: string | undefined;
}
let SingleBlock = ({ block, backgroundColor }: SingleBlockProps) => {
  return (
    <Paper
      style={{
        backgroundColor: backgroundColor,
        color: "#FFF",
      }}
      className="Board-block"
    >
      <Typography> {block.value} </Typography>
    </Paper>
  );
};
export default SingleBlock;
