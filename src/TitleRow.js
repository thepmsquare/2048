import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import "./stylesheets/TitleRow.css";

class TitleRow extends Component {
  render = () => {
    return (
      <AppBar position="sticky">
        <div className="TitleRow">
          <Typography variant="h4" component="h1">
            2048
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
