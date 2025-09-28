import "./stylesheets/TitleRow.css";

import { Component } from "react";

import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

import type { TitleRowProps } from "./types/All";

class TitleRow extends Component<TitleRowProps> {
  render = () => {
    return (
      <AppBar position="sticky">
        <div className="TitleRow">
          <Typography variant="h4" component="h1">
            {this.props.winCondition}
          </Typography>
          <div>
            <Typography variant="h6" component="h2">
              Sum
            </Typography>
            <Typography variant="h6" component="h2">
              {this.props.sum}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" component="h2">
              Best
            </Typography>
            <Typography variant="h6" component="h2">
              {this.props.best}
            </Typography>
          </div>
        </div>
      </AppBar>
    );
  };
}

export default TitleRow;
