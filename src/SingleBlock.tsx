import "./stylesheets/SingleBlock.css";

import { Paper, Typography } from "@mui/material";

import type { SingleBlockProps } from "./types/All";

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
